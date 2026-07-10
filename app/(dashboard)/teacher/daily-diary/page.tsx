'use client';
import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { BookOpen, Calendar, Plus, Search, Edit2, Trash2 } from 'lucide-react';

export default function DailyDiaryPage() {
  const { token, user } = useAuth();
  const [entries, setEntries] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  
  // Dialog controls
  const [isAddOpen, setIsAddOpen] = useState<boolean>(false);
  const [isEditOpen, setIsEditOpen] = useState<boolean>(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false);
  
  // Form State
  const [activeEntry, setActiveEntry] = useState<any | null>(null);

  // Subject options for selection in addition/filters
  const subjectOptions = [
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

  // Filtered & searched entries
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

  // Open add dialog
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

  // Save new entry
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

  // Open edit dialog
  const handleOpenEdit = (entry: any) => {
    setActiveEntry({ ...entry });
    setIsEditOpen(true);
  };

  // Submit edits
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

  // Open delete dialog
  const handleOpenDelete = (entry: any) => {
    setActiveEntry(entry);
    setIsDeleteOpen(true);
  };

  // Confirm delete
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

  // Quick visibility toggle
  const togglePublish = async (entry: any) => {
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Daily Class Diary</h1>
          <p className="text-gray-500 text-sm mt-0.5">Post daily logs of topics covered, classwork assigned, and homework tasks.</p>
        </div>
        <Button onClick={handleOpenAdd} className="bg-teal-600 hover:bg-teal-700 text-white flex items-center gap-2 self-start sm:self-auto">
          <Plus className="h-4 w-4" /> Add Diary Entry
        </Button>
      </div>

      {/* Filter and Search */}
      <Card>
        <CardContent className="p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex items-center gap-2 w-full md:w-auto">
            <span className="text-sm font-medium text-gray-600">Filter Subject:</span>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="all">All Subjects</option>
              {subjectOptions.map(o => (
                <option key={o.code} value={o.code}>{o.name}</option>
              ))}
            </select>
          </div>
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search diary logs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </CardContent>
      </Card>

      {/* Timeline/Entries Feed */}
      <div className="space-y-4">
        {filteredEntries.map(e => (
          <Card key={e.id} className="overflow-hidden hover:shadow-md transition-shadow">
            <CardHeader className="bg-gray-50/50 py-3 border-b border-gray-100 flex flex-row items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-3">
                <Badge variant={e.isPublished ? "success" : "default"}>
                  {e.isPublished ? 'Published' : 'Draft'}
                </Badge>
                <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
                  <Calendar className="h-3.5 w-3.5" />
                  {e.date}
                </div>
                <div className="text-xs text-gray-400">by {e.teacherName}</div>
                <div className="text-xs font-semibold text-teal-600">Class: {e.className}-{e.section}</div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => togglePublish(e)}
                  className="text-xs text-gray-600 hover:bg-gray-100"
                >
                  {e.isPublished ? 'Unpublish' : 'Publish'}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleOpenEdit(e)}
                  className="text-teal-600 hover:text-teal-700 hover:bg-teal-50"
                >
                  <Edit2 className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleOpenDelete(e)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-5">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <BookOpen className="h-3.5 w-3.5 text-teal-600" /> Subject Details
                  </h3>
                  <p className="text-sm font-semibold text-gray-800">{e.subject}</p>
                </div>
                <div>
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    📚 Classwork Covered
                  </h3>
                  <p className="text-sm text-gray-600 whitespace-pre-line">{e.classwork || 'No classwork logged.'}</p>
                </div>
                <div>
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    📝 Homework Assigned
                  </h3>
                  <p className="text-sm text-gray-600 whitespace-pre-line">{e.homework || 'No homework assigned.'}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredEntries.length === 0 && (
          <Card className="p-8 text-center text-gray-400 text-xs border-dashed">
            No class diary entries found matching the selection.
          </Card>
        )}
      </div>

      {/* Add Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader><DialogTitle>New Class Diary Entry</DialogTitle></DialogHeader>
          {activeEntry && (
            <div className="space-y-4 py-2">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-600">Date</label>
                  <Input type="date" value={activeEntry.date} onChange={e => setActiveEntry((p: any) => ({ ...p, date: e.target.value }))} />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600">Class Target</label>
                  <Input placeholder="Class-X" value={activeEntry.className} onChange={e => setActiveEntry((p: any) => ({ ...p, className: e.target.value, classId: `${e.target.value}-${p.section || 'A'}` }))} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-600">Section</label>
                  <Input placeholder="A" value={activeEntry.section} onChange={e => setActiveEntry((p: any) => ({ ...p, section: e.target.value, classId: `${p.className || 'Class-X'}-${e.target.value}` }))} />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600">Subject</label>
                  <select
                    value={activeEntry.subject}
                    onChange={e => setActiveEntry((p: any) => ({ ...p, subject: e.target.value }))}
                    className="w-full h-10 px-3 border rounded-lg bg-white text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-teal-500"
                  >
                    {subjectOptions.map(o => (
                      <option key={o.code} value={o.code}>{o.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600">Classwork Details *</label>
                <Textarea placeholder="Describe the topics covered in class today..." value={activeEntry.classwork} onChange={e => setActiveEntry((p: any) => ({ ...p, classwork: e.target.value }))} />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600">Homework Task</label>
                <Textarea placeholder="Enter instructions for homework assignment..." value={activeEntry.homework} onChange={e => setActiveEntry((p: any) => ({ ...p, homework: e.target.value }))} />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button>
            <Button onClick={handleAddSubmit} className="bg-teal-600 hover:bg-teal-700 text-white">Save Entry</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader><DialogTitle>Edit Class Diary Entry</DialogTitle></DialogHeader>
          {activeEntry && (
            <div className="space-y-4 py-2">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-600">Date</label>
                  <Input type="date" value={activeEntry.date} onChange={e => setActiveEntry((p: any) => ({ ...p, date: e.target.value }))} />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600">Class Target</label>
                  <Input placeholder="Class-X" value={activeEntry.className} onChange={e => setActiveEntry((p: any) => ({ ...p, className: e.target.value, classId: `${e.target.value}-${p.section || 'A'}` }))} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-600">Section</label>
                  <Input placeholder="A" value={activeEntry.section} onChange={e => setActiveEntry((p: any) => ({ ...p, section: e.target.value, classId: `${p.className || 'Class-X'}-${e.target.value}` }))} />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600">Subject</label>
                  <select
                    value={activeEntry.subject}
                    onChange={e => setActiveEntry((p: any) => ({ ...p, subject: e.target.value }))}
                    className="w-full h-10 px-3 border rounded-lg bg-white text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-teal-500"
                  >
                    {subjectOptions.map(o => (
                      <option key={o.code} value={o.code}>{o.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600">Classwork Details *</label>
                <Textarea placeholder="Describe the topics covered in class today..." value={activeEntry.classwork} onChange={e => setActiveEntry((p: any) => ({ ...p, classwork: e.target.value }))} />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600">Homework Task</label>
                <Textarea placeholder="Enter instructions for homework assignment..." value={activeEntry.homework} onChange={e => setActiveEntry((p: any) => ({ ...p, homework: e.target.value }))} />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>Cancel</Button>
            <Button onClick={handleEditSubmit} className="bg-teal-600 hover:bg-teal-700 text-white">Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader><DialogTitle>Delete Class Diary Entry</DialogTitle></DialogHeader>
          <div className="py-2 text-xs font-semibold text-gray-600">
            Are you sure you want to delete this diary entry? This action is permanent and cannot be undone.
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>Cancel</Button>
            <Button onClick={handleDeleteConfirm} className="bg-red-600 hover:bg-red-700 text-white">Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
