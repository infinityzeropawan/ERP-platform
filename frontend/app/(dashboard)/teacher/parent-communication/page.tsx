'use client';
import { useState, useMemo, useEffect } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
const messageTemplates: Array<{id: string; name: string; category: string; subjectTemplate: string; bodyTemplate: string}> = [];
import { MessageSquare, Users, Send, Search, Check, AlertTriangle, Filter, Plus, Calendar } from 'lucide-react';

interface ParentMessage {
  id: string;
  teacherId: string;
  studentId: string;
  studentName: string;
  parentName: string;
  subject: string;
  body: string;
  category: string;
  priority: string;
  isBroadcast: boolean;
  classId?: string | null;
  isRead: boolean;
  createdAt: string;
}

interface Student {
  id: string;
  name: string;
  email: string;
  class: string;
  section: string;
  fatherName: string;
}

export default function ParentCommunicationPage() {
  const { token } = useAuth();
  const [messages, setMessages] = useState<ParentMessage[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  // Dialog controls
  const [isComposeOpen, setIsComposeOpen] = useState<boolean>(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState<boolean>(false);
  
  // Compose form state
  const [isBroadcast, setIsBroadcast] = useState<boolean>(false);
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('custom');
  const [category, setCategory] = useState<string>('general');
  const [priority, setPriority] = useState<string>('normal');
  const [subject, setSubject] = useState<string>('');
  const [body, setBody] = useState<string>('');
  
  // Detailed review state
  const [selectedMessage, setSelectedMessage] = useState<ParentMessage | null>(null);
  const [sendSuccess, setSendSuccess] = useState<boolean>(false);

  // Categories list for filtering
  const categories = ['attendance', 'behavior', 'academic', 'fee', 'general'];

  const fetchData = async () => {
    if (!token) return;
    try {
      setLoading(true);
      // Fetch messages
      const msgRes = await fetch('/api/v1/teacher/parent-messages', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (msgRes.ok) {
        const msgData = await msgRes.json();
        setMessages(msgData);
      }

      // Fetch students list
      const stdRes = await fetch('/api/v1/teacher/students', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (stdRes.ok) {
        const stdData = await stdRes.json();
        setStudents(stdData);
        if (stdData.length > 0) {
          setSelectedStudentId(stdData[0].id);
        }
      }
    } catch (err) {
      console.error('Error loading parent-communication logs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  // Filtered sent messages
  const filteredMessages = useMemo(() => {
    return messages.filter(m => {
      const matchesCategory = selectedCategory === 'all' || m.category === selectedCategory;
      const matchesSearch = searchQuery === '' || 
        m.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.body.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.parentName.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [messages, selectedCategory, searchQuery]);

  // Find currently selected student details
  const currentStudent = useMemo(() => {
    return students.find(s => s.id === selectedStudentId);
  }, [students, selectedStudentId]);

  // Apply message template
  useEffect(() => {
    if (selectedTemplateId === 'custom') {
      setSubject('');
      setBody('');
      return;
    }

    const tpl = messageTemplates.find(t => t.id === selectedTemplateId);
    if (!tpl) return;

    setCategory(tpl.category);
    
    // Default values if student is not found
    const sName = currentStudent?.name || 'Student';
    const pName = currentStudent?.fatherName || 'Parent';
    const classVal = currentStudent?.class || 'Class-XI';

    const subText = tpl.subjectTemplate
      .replace('{studentName}', sName)
      .replace('{feeType}', 'Q1 Tuition Fee');

    const bodyText = tpl.bodyTemplate
      .replace('{parentName}', pName)
      .replace('{studentName}', sName)
      .replace('{attendance}', '88')
      .replace('{subjectName}', 'IOT & Embedded Systems')
      .replace('{percentage}', '88')
      .replace('{feeType}', 'Q1 Tuition Fee')
      .replace('{amount}', '14,000')
      .replace('{dueDate}', 'July 31, 2026')
      .replace('{details}', 'is doing excellent work')
      .replace('{teacherName}', 'Pawan Kumar Dubey')
      .replace('{title}', 'Alert')
      .replace('{content}', '')
      .replace('{className}', classVal);

    setSubject(subText);
    setBody(bodyText);
  }, [selectedTemplateId, selectedStudentId, currentStudent]);

  // Handle send message
  const handleSendMessage = async () => {
    if (!subject.trim() || !body.trim() || !token) return;

    let targetParent = 'All Parents';
    let targetStudentName = '';
    let targetStudentId = '';

    if (!isBroadcast && currentStudent) {
      targetParent = currentStudent.fatherName || 'Parent';
      targetStudentName = currentStudent.name;
      targetStudentId = currentStudent.id;
    }

    try {
      const res = await fetch('/api/v1/teacher/parent-messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          studentId: targetStudentId || students[0]?.id,
          parentName: targetParent,
          subject,
          body,
          category,
          priority,
          isBroadcast,
          classId: currentStudent?.class
        })
      });

      if (res.ok) {
        const createdMsg = await res.json();
        // Resolve student name immediately for local UI append
        createdMsg.studentName = targetStudentName || 'Student';
        setMessages(prev => [createdMsg, ...prev]);
        setSendSuccess(true);
        setTimeout(() => {
          setSendSuccess(false);
          setIsComposeOpen(false);
          // Reset form
          setSelectedTemplateId('custom');
          setSubject('');
          setBody('');
        }, 1500);
      }
    } catch (err) {
      console.error('Error creating parent message:', err);
    }
  };

  const handleOpenDetails = (msg: ParentMessage) => {
    setSelectedMessage(msg);
    setIsDetailsOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Parent Communication</h1>
          <p className="text-gray-500 text-sm mt-0.5">Send private notifications, academic alerts, and behavioral notes directly to parents.</p>
        </div>
        <Button onClick={() => setIsComposeOpen(true)} className="bg-teal-600 hover:bg-teal-700 text-white flex items-center gap-2 self-start sm:self-auto shadow-md rounded-xl">
          <Plus className="h-4 w-4" /> Compose Message
        </Button>
      </div>

      {/* Filter and Search */}
      <Card className="rounded-2xl border-gray-100/80 shadow-sm">
        <CardContent className="p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex items-center gap-2 w-full md:w-auto">
            <span className="text-sm font-medium text-gray-600 flex items-center gap-1"><Filter className="h-4 w-4" /> Category:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="all">All Categories</option>
              {categories.map(c => (
                <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
              ))}
            </select>
          </div>
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search messages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 rounded-xl"
            />
          </div>
        </CardContent>
      </Card>

      {/* Message History Feed */}
      <div className="space-y-4">
        {filteredMessages.map(m => {
          const catColors = 
            m.category === 'attendance' ? 'bg-amber-50 text-amber-700 border-amber-200' :
            m.category === 'behavior' ? 'bg-purple-50 text-purple-700 border-purple-200' :
            m.category === 'academic' ? 'bg-blue-50 text-blue-700 border-blue-200' :
            m.category === 'fee' ? 'bg-red-50 text-red-700 border-red-200' :
            'bg-gray-50 text-gray-700 border-gray-200';

          const priorityColors =
            m.priority === 'urgent' ? 'bg-red-650 text-white shadow-sm' :
            m.priority === 'important' ? 'bg-amber-500 text-white shadow-sm' :
            'bg-gray-150 text-gray-800';

          return (
            <Card key={m.id} className="hover:shadow-md transition-shadow cursor-pointer rounded-2xl border-gray-100" onClick={() => handleOpenDetails(m)}>
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-0.5 rounded-full border text-xs font-semibold ${catColors}`}>
                      {m.category.charAt(0).toUpperCase() + m.category.slice(1)}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider ${priorityColors}`}>
                      {m.priority}
                    </span>
                    {m.isBroadcast && (
                      <Badge variant="default" className="bg-teal-600 flex items-center gap-1 text-[10px] py-0 px-2 rounded-lg">
                        <Users className="h-3 w-3" /> Class Broadcast
                      </Badge>
                    )}
                  </div>
                  <span className="text-xs text-gray-400 flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    {new Date(m.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-gray-900 line-clamp-1">{m.subject}</h3>
                  <p className="text-sm font-semibold text-gray-600 mt-0.5">
                    {m.isBroadcast ? 'To: All Parents' : `To: ${m.parentName} (${m.studentName}'s parent)`}
                  </p>
                </div>

                <p className="text-sm text-gray-550 line-clamp-2 leading-relaxed bg-gray-50/50 p-2.5 rounded-xl border border-gray-100/50 font-mono text-[13px]">
                  {m.body}
                </p>

                <div className="flex justify-between items-center text-xs text-gray-400 pt-1">
                  <span>Sent dynamically from Portal</span>
                  <span className="text-teal-600 font-semibold hover:underline">View details →</span>
                </div>
              </CardContent>
            </Card>
          );
        })}

        {filteredMessages.length === 0 && (
          <div className="text-center py-12 text-gray-400 bg-white rounded-2xl border border-gray-100">
            No parent communications logged.
          </div>
        )}
      </div>

      {/* Compose Dialog */}
      <Dialog open={isComposeOpen} onOpenChange={setIsComposeOpen}>
        <DialogContent className="max-w-xl rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-gray-900">Send Message to Parents</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4 max-h-[70vh] overflow-y-auto px-1">
            
            {/* Delivery mode */}
            <div className="flex items-center gap-4 bg-gray-50 p-3 rounded-xl border border-gray-100">
              <label className="text-xs text-gray-500 font-medium block">Send To:</label>
              <div className="flex items-center gap-2">
                <input
                  type="radio"
                  id="mode-single"
                  name="delivery-mode"
                  checked={!isBroadcast}
                  onChange={() => setIsBroadcast(false)}
                  className="text-teal-600 focus:ring-teal-500"
                />
                <label htmlFor="mode-single" className="text-sm font-medium text-gray-700 cursor-pointer">Single Parent</label>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="radio"
                  id="mode-broadcast"
                  name="delivery-mode"
                  checked={isBroadcast}
                  onChange={() => setIsBroadcast(true)}
                  className="text-teal-600 focus:ring-teal-500"
                />
                <label htmlFor="mode-broadcast" className="text-sm font-medium text-gray-700 cursor-pointer">Broadcast (All Class Parents)</label>
              </div>
            </div>

            {/* Student selection (if single) */}
            {!isBroadcast && (
              <div>
                <label className="text-xs text-gray-500 font-medium mb-1 block">Select Student</label>
                <select
                  value={selectedStudentId}
                  onChange={(ev) => setSelectedStudentId(ev.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  {students.map(s => (
                    <option key={s.id} value={s.id}>{s.name} (Class: {s.class})</option>
                  ))}
                </select>
                {currentStudent && (
                  <p className="text-xs text-gray-400 mt-1">
                    Primary Parent: {currentStudent.fatherName || 'Not specified'} · Contact: {currentStudent.email}
                  </p>
                )}
              </div>
            )}

            {/* Template Selection */}
            <div>
              <label className="text-xs text-gray-500 font-medium mb-1 block">Select Template</label>
              <select
                value={selectedTemplateId}
                onChange={(e) => setSelectedTemplateId(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="custom">-- Custom Message --</option>
                {messageTemplates.map(t => (
                  <option key={t.id} value={t.id}>{t.name} ({t.category})</option>
                ))}
              </select>
            </div>

            {/* Category & Priority */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-500 font-medium mb-1 block">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  {categories.map(c => (
                    <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-500 font-medium mb-1 block">Priority</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="normal">Normal</option>
                  <option value="important">Important</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
            </div>

            {/* Subject */}
            <div>
              <label className="text-xs text-gray-500 font-medium mb-1 block">Subject</label>
              <Input
                placeholder="Alert Subject..."
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="rounded-xl"
              />
            </div>

            {/* Body */}
            <div>
              <label className="text-xs text-gray-500 font-medium mb-1 block">Message Content</label>
              <Textarea
                placeholder="Type your communication details here..."
                rows={5}
                value={body}
                onChange={(e) => setBody(e.target.value)}
                className="rounded-xl"
              />
            </div>

            {sendSuccess && (
              <div className="p-3 bg-green-50 text-green-700 text-xs font-semibold rounded-xl text-center border border-green-200">
                ✓ Message sent successfully to target parent(s)!
              </div>
            )}
          </div>
          <DialogFooter>
            <Button onClick={handleSendMessage} className="w-full bg-teal-600 hover:bg-teal-700 text-white rounded-xl shadow-md flex items-center gap-2">
              <Send className="h-4 w-4" /> Send Notification
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-md rounded-2xl">
          {selectedMessage && (
            <>
              <DialogHeader>
                <DialogTitle className="text-lg font-bold text-gray-900">{selectedMessage.subject}</DialogTitle>
                <p className="text-xs text-gray-400 mt-1">
                  Sent on {new Date(selectedMessage.createdAt).toLocaleString()}
                </p>
              </DialogHeader>
              <div className="space-y-4 py-3">
                <div className="flex gap-2">
                  <Badge variant="outline" className="capitalize">{selectedMessage.category}</Badge>
                  <Badge className="bg-amber-500 text-white uppercase">{selectedMessage.priority}</Badge>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 text-sm font-mono whitespace-pre-line text-gray-700">
                  {selectedMessage.body}
                </div>
                <div className="text-xs text-gray-500">
                  <p><strong>Student Ref:</strong> {selectedMessage.studentName}</p>
                  <p className="mt-1"><strong>Parent Receiver:</strong> {selectedMessage.parentName}</p>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={() => setIsDetailsOpen(false)} className="w-full bg-gray-100 hover:bg-gray-250 text-gray-800 rounded-xl">
                  Close Details
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
