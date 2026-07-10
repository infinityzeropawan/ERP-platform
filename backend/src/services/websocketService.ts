import { WebSocketServer, WebSocket } from 'ws';
import type { Server } from 'http';
import jwt from 'jsonwebtoken';
import prisma from '../config/db';
import { env } from '../config/env';
import { logger } from '../config/logger';

interface AuthenticatedWS extends WebSocket {
  userId?: string;
  institutionId?: string;
  userName?: string;
  rooms?: Set<string>;
}

// roomId → set of connected sockets
const roomClients = new Map<string, Set<AuthenticatedWS>>();

function addToRoom(roomId: string, ws: AuthenticatedWS) {
  if (!roomClients.has(roomId)) roomClients.set(roomId, new Set());
  roomClients.get(roomId)!.add(ws);
  if (!ws.rooms) ws.rooms = new Set();
  ws.rooms.add(roomId);
}

function removeFromRoom(roomId: string, ws: AuthenticatedWS) {
  roomClients.get(roomId)?.delete(ws);
}

function broadcastToRoom(roomId: string, payload: object, excludeWs?: AuthenticatedWS) {
  const clients = roomClients.get(roomId);
  if (!clients) return;
  const data = JSON.stringify(payload);
  for (const client of clients) {
    if (client !== excludeWs && client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  }
}

export function initWebSocketServer(server: Server) {
  const wss = new WebSocketServer({ server, path: '/ws' });

  wss.on('connection', async (ws: AuthenticatedWS, req) => {
    // JWT auth from query param: /ws?token=...
    const url = new URL(req.url || '', `http://localhost`);
    const token = url.searchParams.get('token');

    if (!token) {
      ws.close(4001, 'Unauthorized: No token provided');
      return;
    }

    try {
      const decoded = jwt.verify(token, env.jwtSecret) as {
        id: string; institutionId: string; name?: string;
      };
      ws.userId = decoded.id;
      ws.institutionId = decoded.institutionId;
      ws.rooms = new Set();

      // Load user's name
      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
        select: { name: true }
      });
      ws.userName = user?.name || 'User';

      ws.send(JSON.stringify({ type: 'connected', userId: ws.userId }));
      logger.info(`WS connected: ${ws.userId}`);
    } catch {
      ws.close(4001, 'Unauthorized: Invalid token');
      return;
    }

    ws.on('message', async (rawData) => {
      if (!ws.userId || !ws.institutionId) return;
      let msg: any;
      try { msg = JSON.parse(rawData.toString()); } catch { return; }

      switch (msg.type) {
        // Client joins a room to receive messages
        case 'room:join': {
          const { roomId } = msg;
          if (!roomId) return;
          // Verify user is a member
          const member = await prisma.chatMember.findUnique({
            where: { roomId_userId: { roomId, userId: ws.userId! } }
          });
          if (!member) {
            ws.send(JSON.stringify({ type: 'error', message: 'Not a member of this room' }));
            return;
          }
          addToRoom(roomId, ws);
          ws.send(JSON.stringify({ type: 'room:joined', roomId }));
          break;
        }

        // Client sends a message
        case 'message:send': {
          const { roomId, content } = msg;
          if (!roomId || !content?.trim()) return;

          // Verify membership
          const member = await prisma.chatMember.findUnique({
            where: { roomId_userId: { roomId, userId: ws.userId! } }
          });
          if (!member) return;

          // Persist to DB
          const saved = await prisma.chatMessage.create({
            data: {
              roomId,
              senderId: ws.userId!,
              content: content.trim(),
            }
          });

          const payload = {
            type: 'message:new',
            id: saved.id,
            roomId,
            senderId: ws.userId,
            senderName: ws.userName,
            content: saved.content,
            createdAt: saved.createdAt.toISOString(),
          };

          // Broadcast to all room members (including sender for confirmation)
          broadcastToRoom(roomId, payload);
          // Also send to sender if they joined via WS
          if (!roomClients.get(roomId)?.has(ws)) {
            ws.send(JSON.stringify(payload));
          }
          break;
        }

        // Typing indicator (not persisted)
        case 'typing': {
          const { roomId } = msg;
          if (!roomId) return;
          broadcastToRoom(roomId, {
            type: 'typing',
            roomId,
            userId: ws.userId,
            userName: ws.userName,
          }, ws);
          break;
        }

        default:
          break;
      }
    });

    ws.on('close', () => {
      if (ws.rooms) {
        for (const roomId of ws.rooms) {
          removeFromRoom(roomId, ws);
        }
      }
      logger.info(`WS disconnected: ${ws.userId}`);
    });

    ws.on('error', (err) => {
      logger.error('WebSocket error', { userId: ws.userId, error: err.message });
    });
  });

  logger.info('WebSocket server initialized at /ws');
  return wss;
}
