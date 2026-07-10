'use client';
import { useEffect, useRef, useState, useCallback } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  MessageSquare, Send, Search, Plus, Users, User, X, Loader2,
  Wifi, WifiOff, Circle
} from 'lucide-react';

interface ChatUser { id: string; name: string; role: string; }
interface LastMessage { content: string; senderName: string; createdAt: string; }
interface Room {
  id: string; type: string; name: string;
  members: ChatUser[]; lastMessage: LastMessage | null; unread: number;
}
interface Message {
  id: string; roomId: string; senderId: string;
  senderName?: string; sender?: { name: string };
  content: string; createdAt: string;
}

const ROLE_COLORS: Record<string, string> = {
  school_admin: 'bg-purple-100 text-purple-700',
  teacher: 'bg-teal-100 text-teal-700',
  student: 'bg-blue-100 text-blue-700',
  parent: 'bg-amber-100 text-amber-700',
  superadmin: 'bg-red-100 text-red-700',
};

export default function ChatPage() {
  const { user } = useAuth();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [activeRoom, setActiveRoom] = useState<Room | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMsg, setNewMsg] = useState('');
  const [search, setSearch] = useState('');
  const [userSearch, setUserSearch] = useState('');
  const [users, setUsers] = useState<ChatUser[]>([]);
  const [showNewChat, setShowNewChat] = useState(false);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [wsStatus, setWsStatus] = useState<'connecting' | 'connected' | 'disconnected'>('disconnected');
  const [loading, setLoading] = useState(true);
  const wsRef = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Load rooms ────────────────────────────────────────────
  const fetchRooms = useCallback(async () => {
    const res = await fetch('/api/v1/chat/rooms');
    if (res.ok) setRooms(await res.json());
    setLoading(false);
  }, []);

  // ── Connect WebSocket ─────────────────────────────────────
  const connectWS = useCallback(() => {
    const token = localStorage.getItem('buildroonix_token');
    if (!token) return;
    const wsUrl = `${window.location.protocol === 'https:' ? 'wss' : 'ws'}://${window.location.host}/ws?token=${token}`;
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;
    setWsStatus('connecting');

    ws.onopen = () => setWsStatus('connected');
    ws.onclose = () => {
      setWsStatus('disconnected');
      setTimeout(connectWS, 3000); // auto-reconnect
    };
    ws.onerror = () => setWsStatus('disconnected');

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.type === 'message:new') {
        setMessages(prev => {
          if (prev.find(m => m.id === msg.id)) return prev;
          return [...prev, { ...msg, sender: { name: msg.senderName } }];
        });
        // Update room last message
        setRooms(prev => prev.map(r =>
          r.id === msg.roomId
            ? { ...r, lastMessage: { content: msg.content, senderName: msg.senderName, createdAt: msg.createdAt } }
            : r
        ));
        setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
      }
      if (msg.type === 'typing') {
        setTypingUsers(prev => Array.from(new Set([...prev, msg.userName])));
        setTimeout(() => {
          setTypingUsers(prev => prev.filter(n => n !== msg.userName));
        }, 2000);
      }
    };
  }, []);

  useEffect(() => {
    fetchRooms();
    connectWS();
    return () => wsRef.current?.close();
  }, [fetchRooms, connectWS]);

  // ── Open a room ──────────────────────────────────────────
  const openRoom = async (room: Room) => {
    setActiveRoom(room);
    setMessages([]);
    setTypingUsers([]);
    // Load message history
    const res = await fetch(`/api/v1/chat/rooms/${room.id}/messages`);
    if (res.ok) {
      const hist = await res.json();
      setMessages(hist.map((m: any) => ({ ...m, senderName: m.sender?.name })));
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    }
    // Join via WebSocket
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: 'room:join', roomId: room.id }));
    }
  };

  // ── Send message ────────────────────────────────────────
  const sendMessage = () => {
    if (!newMsg.trim() || !activeRoom) return;
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: 'message:send', roomId: activeRoom.id, content: newMsg.trim() }));
      setNewMsg('');
    }
  };

  // ── Typing indicator ────────────────────────────────────
  const onTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMsg(e.target.value);
    if (wsRef.current?.readyState === WebSocket.OPEN && activeRoom) {
      wsRef.current.send(JSON.stringify({ type: 'typing', roomId: activeRoom.id }));
    }
  };

  // ── Search users ─────────────────────────────────────────
  useEffect(() => {
    if (!showNewChat) return;
    const t = setTimeout(async () => {
      const res = await fetch(`/api/v1/chat/users?q=${userSearch}`);
      if (res.ok) setUsers(await res.json());
    }, 300);
    return () => clearTimeout(t);
  }, [userSearch, showNewChat]);

  // ── Start new chat ────────────────────────────────────────
  const startChat = async (targetUser: ChatUser) => {
    const res = await fetch('/api/v1/chat/rooms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ targetUserId: targetUser.id, type: 'direct' })
    });
    if (res.ok) {
      const room = await res.json();
      const fullRoom: Room = {
        ...room,
        name: room.name || targetUser.name,
        lastMessage: null, unread: 0
      };
      setRooms(prev => {
        if (prev.find(r => r.id === room.id)) return prev;
        return [fullRoom, ...prev];
      });
      setShowNewChat(false);
      setUserSearch('');
      openRoom(fullRoom);
    }
  };

  const filteredRooms = rooms.filter(r =>
    r.name.toLowerCase().includes(search.toLowerCase())
  );

  const formatTime = (iso: string) => {
    const d = new Date(iso);
    const now = new Date();
    if (d.toDateString() === now.toDateString()) {
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  return (
    <div className="flex h-[calc(100vh-120px)] min-h-[500px] gap-0 rounded-xl overflow-hidden border border-gray-200 shadow-sm bg-white">
      {/* ── Left Panel ── */}
      <div className="w-72 flex-shrink-0 border-r border-gray-200 flex flex-col bg-slate-50">
        <div className="p-4 border-b border-gray-200 bg-white">
          <div className="flex items-center justify-between mb-3">
            <h1 className="font-bold text-gray-900 flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-teal-600" />Chat
            </h1>
            <div className="flex items-center gap-2">
              <div title={wsStatus} className="flex items-center gap-1">
                {wsStatus === 'connected'
                  ? <Wifi className="h-3.5 w-3.5 text-green-500" />
                  : <WifiOff className="h-3.5 w-3.5 text-red-400" />}
              </div>
              <Button size="sm" variant="outline" className="h-7 px-2" onClick={() => setShowNewChat(true)}>
                <Plus className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-2 h-3.5 w-3.5 text-gray-400" />
            <Input placeholder="Search conversations..." value={search} onChange={e => setSearch(e.target.value)} className="pl-8 h-8 text-xs" />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {loading && (
            <div className="flex items-center justify-center py-12 text-gray-400">
              <Loader2 className="h-5 w-5 animate-spin" />
            </div>
          )}
          {!loading && filteredRooms.length === 0 && (
            <div className="text-center py-12 px-4 text-gray-400">
              <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-30" />
              <p className="text-sm">No conversations yet</p>
              <p className="text-xs mt-1">Click + to start chatting</p>
            </div>
          )}
          {filteredRooms.map(room => (
            <button key={room.id} onClick={() => openRoom(room)}
              className={`w-full text-left px-4 py-3 hover:bg-white transition-colors border-b border-gray-100 ${activeRoom?.id === room.id ? 'bg-white border-l-2 border-l-teal-500' : ''}`}>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center flex-shrink-0">
                  {room.type === 'group'
                    ? <Users className="h-4 w-4 text-white" />
                    : <User className="h-4 w-4 text-white" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-gray-900 truncate">{room.name}</p>
                    {room.lastMessage && (
                      <span className="text-[10px] text-gray-400 flex-shrink-0 ml-1">
                        {formatTime(room.lastMessage.createdAt)}
                      </span>
                    )}
                  </div>
                  {room.lastMessage
                    ? <p className="text-xs text-gray-500 truncate">{room.lastMessage.senderName}: {room.lastMessage.content}</p>
                    : <p className="text-xs text-gray-400 italic">No messages yet</p>}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* ── Right Panel ── */}
      {activeRoom ? (
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="px-5 py-3 border-b border-gray-200 bg-white flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center">
              {activeRoom.type === 'group' ? <Users className="h-4 w-4 text-white" /> : <User className="h-4 w-4 text-white" />}
            </div>
            <div>
              <p className="font-semibold text-gray-900 text-sm">{activeRoom.name}</p>
              <p className="text-xs text-gray-400">{activeRoom.members.length} members</p>
            </div>
            <div className="ml-auto flex items-center gap-1">
              {activeRoom.members.filter(m => m.id !== user?.id).map(m => (
                <Badge key={m.id} variant="outline" className={`text-[10px] py-0 ${ROLE_COLORS[m.role] || ''}`}>
                  {m.role}
                </Badge>
              ))}
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-gray-50">
            {messages.map(msg => {
              const isMe = msg.senderId === user?.id;
              return (
                <div key={msg.id} className={`flex gap-2 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-white text-xs font-bold ${isMe ? 'bg-teal-500' : 'bg-slate-400'}`}>
                    {(msg.sender?.name || msg.senderName || '?')[0].toUpperCase()}
                  </div>
                  <div className={`max-w-[65%] ${isMe ? 'items-end' : 'items-start'} flex flex-col`}>
                    {!isMe && (
                      <p className="text-[10px] text-gray-400 mb-0.5 px-1">
                        {msg.sender?.name || msg.senderName}
                      </p>
                    )}
                    <div className={`px-4 py-2.5 rounded-2xl text-sm ${isMe ? 'bg-teal-600 text-white rounded-tr-sm' : 'bg-white border border-gray-200 text-gray-800 rounded-tl-sm shadow-sm'}`}>
                      {msg.content}
                    </div>
                    <p className="text-[10px] text-gray-400 mt-0.5 px-1">
                      {formatTime(msg.createdAt)}
                    </p>
                  </div>
                </div>
              );
            })}
            {typingUsers.length > 0 && (
              <div className="flex gap-2 items-center">
                <div className="w-7 h-7 rounded-full bg-gray-300 flex items-center justify-center">
                  <Circle className="h-3 w-3 text-gray-500" />
                </div>
                <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-sm px-4 py-2 shadow-sm">
                  <div className="flex gap-1 items-center">
                    <span className="text-xs text-gray-500">{typingUsers.join(', ')} typing</span>
                    <span className="flex gap-0.5">
                      {[0, 1, 2].map(i => (
                        <span key={i} className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                      ))}
                    </span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-200 bg-white">
            <div className="flex gap-2">
              <Input
                placeholder="Type a message..."
                value={newMsg}
                onChange={onTyping}
                onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                className="flex-1"
              />
              <Button onClick={sendMessage} disabled={!newMsg.trim()} className="bg-teal-600 hover:bg-teal-700 text-white px-4">
                <Send className="h-4 w-4" />
              </Button>
            </div>
            {wsStatus !== 'connected' && (
              <p className="text-[10px] text-amber-500 mt-1 flex items-center gap-1">
                <WifiOff className="h-3 w-3" />Reconnecting...
              </p>
            )}
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center bg-gray-50">
          <div className="text-center text-gray-400">
            <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-20" />
            <p className="font-medium text-gray-500">Select a conversation</p>
            <p className="text-sm mt-1">or click + to start a new one</p>
          </div>
        </div>
      )}

      {/* ── New Chat Modal ── */}
      {showNewChat && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
          <Card className="w-80 p-4 shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-900">New Conversation</h3>
              <button onClick={() => setShowNewChat(false)}><X className="h-4 w-4 text-gray-400" /></button>
            </div>
            <div className="relative mb-3">
              <Search className="absolute left-3 top-2 h-3.5 w-3.5 text-gray-400" />
              <Input placeholder="Search by name..." value={userSearch} onChange={e => setUserSearch(e.target.value)} className="pl-8 h-8 text-xs" autoFocus />
            </div>
            <div className="max-h-56 overflow-y-auto divide-y divide-gray-50">
              {users.map(u => (
                <button key={u.id} onClick={() => startChat(u)}
                  className="w-full text-left px-2 py-2.5 hover:bg-gray-50 rounded flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-400 to-slate-600 flex items-center justify-center text-white text-xs font-bold">
                    {u.name[0].toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{u.name}</p>
                    <p className={`text-[10px] px-1.5 py-0.5 rounded mt-0.5 inline-block capitalize ${ROLE_COLORS[u.role] || 'bg-gray-100 text-gray-600'}`}>{u.role.replace('_', ' ')}</p>
                  </div>
                </button>
              ))}
              {users.length === 0 && userSearch && (
                <p className="text-xs text-gray-400 text-center py-4">No users found</p>
              )}
              {users.length === 0 && !userSearch && (
                <p className="text-xs text-gray-400 text-center py-4">Type a name to search</p>
              )}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
