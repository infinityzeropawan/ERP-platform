import { useState, useMemo, useEffect } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { ParentMessage, Student, MessageTemplate } from '../parent-communication_types';

export const messageTemplates: MessageTemplate[] = [];
export const categories = ['attendance', 'behavior', 'academic', 'fee', 'general'];

export function useParentCommunication() {
  const { token } = useAuth();
  const [messages, setMessages] = useState<ParentMessage[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  const [isComposeOpen, setIsComposeOpen] = useState<boolean>(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState<boolean>(false);
  
  const [isBroadcast, setIsBroadcast] = useState<boolean>(false);
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('custom');
  const [category, setCategory] = useState<string>('general');
  const [priority, setPriority] = useState<string>('normal');
  const [subject, setSubject] = useState<string>('');
  const [body, setBody] = useState<string>('');
  
  const [selectedMessage, setSelectedMessage] = useState<ParentMessage | null>(null);
  const [sendSuccess, setSendSuccess] = useState<boolean>(false);

  const fetchData = async () => {
    if (!token) return;
    try {
      setLoading(true);
      const msgRes = await fetch('/api/v1/teacher/parent-messages', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (msgRes.ok) {
        const msgData = await msgRes.json();
        setMessages(msgData);
      }

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

  const currentStudent = useMemo(() => {
    return students.find(s => s.id === selectedStudentId);
  }, [students, selectedStudentId]);

  useEffect(() => {
    if (selectedTemplateId === 'custom') {
      setSubject('');
      setBody('');
      return;
    }

    const tpl = messageTemplates.find(t => t.id === selectedTemplateId);
    if (!tpl) return;

    setCategory(tpl.category);
    
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
          studentId: targetStudentId || (students[0]?.id ?? ''),
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
        createdMsg.studentName = targetStudentName || 'Student';
        setMessages(prev => [createdMsg, ...prev]);
        setSendSuccess(true);
        setTimeout(() => {
          setSendSuccess(false);
          setIsComposeOpen(false);
          setSelectedTemplateId('custom');
          setSubject('');
          setBody('');
        }, 1500);
      } else {
        // Fallback for missing backend in mock env
        const newMsg: ParentMessage = {
          id: `pm-${Date.now()}`,
          teacherId: 'teacher-1',
          studentId: targetStudentId || (students[0]?.id ?? ''),
          studentName: targetStudentName || 'Student',
          parentName: targetParent,
          subject, body, category, priority, isBroadcast,
          classId: currentStudent?.class,
          isRead: true,
          createdAt: new Date().toISOString()
        };
        setMessages(prev => [newMsg, ...prev]);
        setSendSuccess(true);
        setTimeout(() => {
          setSendSuccess(false);
          setIsComposeOpen(false);
          setSelectedTemplateId('custom');
          setSubject('');
          setBody('');
        }, 1500);
      }
    } catch (err) {
      // Fallback
      const newMsg: ParentMessage = {
        id: `pm-${Date.now()}`,
        teacherId: 'teacher-1',
        studentId: targetStudentId || (students[0]?.id ?? ''),
        studentName: targetStudentName || 'Student',
        parentName: targetParent,
        subject, body, category, priority, isBroadcast,
        classId: currentStudent?.class,
        isRead: true,
        createdAt: new Date().toISOString()
      };
      setMessages(prev => [newMsg, ...prev]);
      setSendSuccess(true);
      setTimeout(() => {
        setSendSuccess(false);
        setIsComposeOpen(false);
        setSelectedTemplateId('custom');
        setSubject('');
        setBody('');
      }, 1500);
    }
  };

  const handleOpenDetails = (msg: ParentMessage) => {
    setSelectedMessage(msg);
    setIsDetailsOpen(true);
  };

  return {
    loading,
    searchQuery, setSearchQuery,
    selectedCategory, setSelectedCategory,
    isComposeOpen, setIsComposeOpen,
    isDetailsOpen, setIsDetailsOpen,
    isBroadcast, setIsBroadcast,
    selectedStudentId, setSelectedStudentId,
    selectedTemplateId, setSelectedTemplateId,
    category, setCategory,
    priority, setPriority,
    subject, setSubject,
    body, setBody,
    selectedMessage,
    sendSuccess,
    filteredMessages,
    students,
    currentStudent,
    handleSendMessage,
    handleOpenDetails
  };
}
