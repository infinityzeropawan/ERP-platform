import { Router, type Response } from 'express';
import prisma from '../config/db';
import { type AuthenticatedRequest } from '../middlewares/auth';

const router = Router();

// ─── GET /api/v1/chat/rooms — list user's rooms with last message & unread count
router.get('/rooms', async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  const institutionId = req.institutionId!;

  const memberships = await prisma.chatMember.findMany({
    where: { userId },
    include: {
      room: {
        include: {
          members: {
            include: { user: { select: { id: true, name: true, role: true } } }
          },
          messages: {
            orderBy: { createdAt: 'desc' },
            take: 1,
            include: { sender: { select: { name: true } } }
          }
        }
      }
    }
  });

  const rooms = memberships.map(m => {
    const room = m.room;
    const lastMsg = room.messages[0] || null;
    const unread = 0; // Could be extended with per-user read tracking
    const otherMembers = room.members
      .filter(mb => mb.userId !== userId)
      .map(mb => mb.user);

    return {
      id: room.id,
      type: room.type,
      name: room.name || otherMembers.map(u => u.name).join(', '),
      members: room.members.map(mb => mb.user),
      lastMessage: lastMsg ? {
        content: lastMsg.content,
        senderName: lastMsg.sender.name,
        createdAt: lastMsg.createdAt
      } : null,
      unread,
      createdAt: room.createdAt,
    };
  });

  // Sort: rooms with most recent message first
  rooms.sort((a, b) => {
    const aTime = a.lastMessage?.createdAt ? new Date(a.lastMessage.createdAt).getTime() : 0;
    const bTime = b.lastMessage?.createdAt ? new Date(b.lastMessage.createdAt).getTime() : 0;
    return bTime - aTime;
  });

  return res.json(rooms);
});

// ─── POST /api/v1/chat/rooms — create or get direct room
router.post('/rooms', async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  const institutionId = req.institutionId!;
  const { targetUserId, type = 'direct', name } = req.body;

  if (!targetUserId && type === 'direct') {
    return res.status(400).json({ error: 'targetUserId is required for direct rooms' });
  }

  // For direct rooms, check if room already exists between these two users
  if (type === 'direct' && targetUserId) {
    const existingMemberships = await prisma.chatMember.findMany({
      where: { userId },
      select: { roomId: true }
    });
    const myRoomIds = existingMemberships.map(m => m.roomId);

    const existing = await prisma.chatMember.findFirst({
      where: {
        userId: targetUserId,
        roomId: { in: myRoomIds },
        room: { type: 'direct' }
      },
      include: { room: { include: { members: { include: { user: { select: { id: true, name: true, role: true } } } } } } }
    });

    if (existing) {
      return res.json({ id: existing.room.id, type: 'direct', members: existing.room.members.map(m => m.user), alreadyExisted: true });
    }

    // Create new direct room
    const room = await prisma.chatRoom.create({
      data: {
        institutionId,
        type: 'direct',
        members: {
          create: [
            { userId },
            { userId: targetUserId }
          ]
        }
      },
      include: { members: { include: { user: { select: { id: true, name: true, role: true } } } } }
    });

    return res.status(201).json({ id: room.id, type: room.type, members: room.members.map(m => m.user) });
  }

  // Group room
  const { memberIds = [] } = req.body;
  const allMembers = Array.from(new Set([userId, ...memberIds]));

  const room = await prisma.chatRoom.create({
    data: {
      institutionId,
      type: 'group',
      name: name || 'Group Chat',
      members: { create: allMembers.map((uid: string) => ({ userId: uid })) }
    },
    include: { members: { include: { user: { select: { id: true, name: true, role: true } } } } }
  });

  return res.status(201).json({ id: room.id, type: room.type, name: room.name, members: room.members.map(m => m.user) });
});

// ─── GET /api/v1/chat/rooms/:id/messages — paginated message history
router.get('/rooms/:id/messages', async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  const { id: roomId } = req.params;
  const limit = parseInt(req.query.limit as string) || 50;
  const before = req.query.before as string | undefined;

  // Verify membership
  const member = await prisma.chatMember.findUnique({
    where: { roomId_userId: { roomId, userId } }
  });
  if (!member) return res.status(403).json({ error: 'Not a member of this room' });

  const messages = await prisma.chatMessage.findMany({
    where: {
      roomId,
      ...(before ? { createdAt: { lt: new Date(before) } } : {})
    },
    include: { sender: { select: { id: true, name: true, role: true } } },
    orderBy: { createdAt: 'desc' },
    take: limit,
  });

  return res.json(messages.reverse());
});

// ─── GET /api/v1/chat/users — search institution users to start a chat
router.get('/users', async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  const institutionId = req.institutionId!;
  const q = (req.query.q as string || '').toLowerCase();

  const users = await prisma.user.findMany({
    where: {
      institutionId,
      id: { not: userId },
      isApproved: true,
      ...(q ? { name: { contains: q, mode: 'insensitive' } } : {})
    },
    select: { id: true, name: true, role: true },
    take: 20
  });

  return res.json(users);
});

export default router;
