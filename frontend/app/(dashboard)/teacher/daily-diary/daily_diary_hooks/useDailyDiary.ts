import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { DiaryEntry, SubjectOption } from '../daily_diary_types';

export function useDailyDiary() {
  const { token, user } = useAuth();
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  
  const [isAddOpen, setIsAddOpen] = useState<boolean>(false);
  const [isEditOpen, setIsEditOpen] = useState<boolean>(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false);
  
  const [activeEntry, setActiveEntry] = useState<DiaryEntry | null>(null);

  const subjectOptions: SubjectOption[] = [
    { code: 'IOT & Embedded Systems', name: 'IOT & Embedded Systems' },
    { code: 'Embedded C Programming', name: 'Embedded C Programming' },
    { code: 'Network Protocols', name: 'Network Protocols' },
  ];

  const fetchDiaries = async () => {
    if (!token) return;
    try {
      const res = await fetch('/api/v1/teacher/diaries', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) setEntries(data);
    } catch (err) {
      console.error('Error fetching diaries:', err);
    }
  };

  useEffect(() => {
    fetchDiaries();
  }, [token]);

  const filteredEntries = useMemo(() => {
    return entries.filter(e => {
      const matchesSubject = selectedSubject === 'all' || e.subject === selectedSubject;
      const matchesSearch = searchQuery === '' || 
        (e.subject && e.subject.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (e.homework && e.homework.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (e.classwork && e.classwork.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesSubject && matchesSearch;
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [entries, selectedSubject, searchQuery]);

  const handleOpenAdd = () => {
    setActiveEntry({
      date: new Date().toISOString().split('T')[0],
      subject: 'IOT & Embedded Systems',
      classId: user?.class ? `${user.class}-${user.section || 'A'}` : 'Class-X-A',
      className: user?.class || 'Class-X',
      section: user?.section || 'A',
      classwork: '',
      homework: '',
      isPublished: true,
      teacherName: user?.name || 'Instructor'
    });
    setIsAddOpen(true);
  };

  const handleAddSubmit = async () => {
    if (!activeEntry || !activeEntry.classwork) return;
    try {
      const res = await fetch('/api/v1/teacher/diaries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(activeEntry)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to save diary entry');
      alert('Diary entry saved successfully!');
      fetchDiaries();
      setIsAddOpen(false);
    } catch (err: any) {
      alert(err.message || 'Failed to save diary entry');
    }
  };

  const handleOpenEdit = (entry: DiaryEntry) => {
    setActiveEntry({ ...entry });
    setIsEditOpen(true);
  };

  const handleEditSubmit = async () => {
    if (!activeEntry || !activeEntry.id || !activeEntry.classwork) return;
    try {
      const res = await fetch(`/api/v1/teacher/diaries/${activeEntry.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(activeEntry)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to update diary entry');
      alert('Diary entry updated successfully!');
      fetchDiaries();
      setIsEditOpen(false);
    } catch (err: any) {
      alert(err.message || 'Failed to update diary entry');
    }
  };

  const handleOpenDelete = (entry: DiaryEntry) => {
    setActiveEntry(entry);
    setIsDeleteOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!activeEntry || !activeEntry.id || !token) return;
    try {
      const res = await fetch(`/api/v1/teacher/diaries/${activeEntry.id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to delete diary entry');
      alert('Diary entry deleted successfully!');
      fetchDiaries();
      setIsDeleteOpen(false);
    } catch (err: any) {
      alert(err.message || 'Failed to delete diary entry');
    }
  };

  const togglePublish = async (entry: DiaryEntry) => {
    if (!token) return;
    try {
      const res = await fetch(`/api/v1/teacher/diaries/${entry.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ ...entry, isPublished: !entry.isPublished })
      });
      if (res.ok) fetchDiaries();
    } catch (err) {
      console.error('Failed to toggle publish status:', err);
    }
  };

  return {
    searchQuery,
    setSearchQuery,
    selectedSubject,
    setSelectedSubject,
    isAddOpen,
    setIsAddOpen,
    isEditOpen,
    setIsEditOpen,
    isDeleteOpen,
    setIsDeleteOpen,
    activeEntry,
    setActiveEntry,
    subjectOptions,
    filteredEntries,
    handleOpenAdd,
    handleAddSubmit,
    handleOpenEdit,
    handleEditSubmit,
    handleOpenDelete,
    handleDeleteConfirm,
    togglePublish
  };
}
