'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Users, Plus, BookOpen, MapPin, Pencil, Trash2 } from 'lucide-react';

export default function ClassesPage() {
  const { token } = useAuth();
  const [classes, setClasses] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [editItem, setEditItem] = useState<any | null>(null);
  const [form, setForm] = useState({ className: '', section: '', classTeacherId: '', room: '', totalStudents: '0' });

  const fetchClasses = async () => {
    if (!token) return;
    try {
      const res = await fetch('/api/v1/admin/classes', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) setClasses(data);
    } catch (err) {
      console.error('Error fetching classes:', err);
    }
  };

  const fetchTeachers = async () => {
    if (!token) return;
    try {
      const res = await fetch('/api/v1/admin/users?role=teacher', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) setTeachers(data);
    } catch (err) {
      console.error('Error fetching teachers:', err);
    }
  };

  useEffect(() => {
    fetchClasses();
    fetchTeachers();
  }, [token]);

  const openCreate = () => {
    setEditItem(null);
    setForm({ className: '', section: '', classTeacherId: '', room: 'Main Hall', totalStudents: '0' });
    setOpen(true);
  };

  const openEdit = (c: any) => {
    setEditItem(c);
    setForm({
      className: c.className,
      section: c.section,
      classTeacherId: c.classTeacherId || '',
      room: c.room || 'Main Hall',
      totalStudents: String(c.totalStudents)
    });
    setOpen(true);
  };

  const save = async () => {
    if (!form.className || !form.section) return;

    try {
      let url = '/api/v1/admin/classes';
      let method = 'POST';
      if (editItem) {
        url = `/api/v1/admin/classes/${editItem.id}`;
        method = 'PUT';
      }

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          className: form.className,
          section: form.section,
          classTeacherId: form.classTeacherId || null
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to save class');

      alert('Class saved successfully!');
      fetchClasses();
      setOpen(false);
    } catch (err: any) {
      alert(err.message || 'Failed to save class');
    }
  };

  const remove = async (id: string) => {
    if (confirm('Are you sure you want to delete this class? This will unassign all students and teachers in it.')) {
      try {
        const res = await fetch(`/api/v1/admin/classes/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to delete class');

        alert('Class deleted successfully!');
        fetchClasses();
      } catch (err: any) {
        alert(err.message || 'Failed to delete class');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2"><Users className="h-6 w-6 text-teal-600" />Classes & Sections</h1>
          <p className="text-gray-500 text-sm mt-0.5">Manage all classes and their sections</p>
        </div>
        <Button onClick={openCreate} className="flex items-center gap-2"><Plus className="h-4 w-4" />Add Class</Button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Classes', value: classes.length, color: 'text-teal-600' },
          { label: 'Active', value: classes.filter(c => c.isActive).length, color: 'text-green-600' },
          { label: 'Total Students', value: classes.reduce((a, c) => a + c.totalStudents, 0), color: 'text-blue-600' },
        ].map(s => (
          <Card key={s.label}><CardContent className="p-4 text-center"><p className={`text-2xl font-bold ${s.color}`}>{s.value}</p><p className="text-xs text-gray-500 mt-1">{s.label}</p></CardContent></Card>
        ))}
      </div>

      {classes.length === 0 ? (
        <Card className="p-10 text-center text-gray-400 text-sm border-dashed">
          No classes or sections created yet. Assign students or teachers to a class to generate them automatically.
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {classes.map(cls => (
            <Card key={cls.id} className={cls.isActive ? 'border-teal-200' : 'border-gray-200 opacity-60'}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center">
                    <BookOpen className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Badge variant={cls.isActive ? 'success' : 'default'}>{cls.isActive ? 'Active' : 'Inactive'}</Badge>
                  </div>
                </div>
                <p className="font-bold text-gray-900">{cls.className}</p>
                <p className="text-sm text-gray-500">{cls.section} Section</p>
                <div className="mt-3 space-y-1.5 text-xs text-gray-500">
                  <p className="flex items-center gap-1.5"><BookOpen className="h-3.5 w-3.5 text-teal-400" />Teacher: {cls.classTeacher}</p>
                  <p className="flex items-center gap-1.5"><Users className="h-3.5 w-3.5 text-blue-400" />{cls.totalStudents} Students</p>
                  <p className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 text-purple-400" />Room: {cls.room}</p>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button size="sm" variant="outline" onClick={() => openEdit(cls)} className="flex-1 flex items-center justify-center gap-1 text-xs"><Pencil className="h-3 w-3" />Edit</Button>
                  <button onClick={() => remove(cls.id)} className="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-400 transition-colors"><Trash2 className="h-3.5 w-3.5" /></button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="w-full max-w-md">
          <DialogHeader><DialogTitle>{editItem ? 'Edit Class' : 'Add New Class'}</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">Class Name *</label>
                <Input placeholder="Class-X" value={form.className} onChange={e => setForm(p => ({ ...p, className: e.target.value }))} />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">Section *</label>
                <Input placeholder="A" value={form.section} onChange={e => setForm(p => ({ ...p, section: e.target.value }))} />
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">Class Teacher</label>
              <select
                value={form.classTeacherId}
                onChange={e => setForm(p => ({ ...p, classTeacherId: e.target.value }))}
                className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="">Select teacher</option>
                {teachers.map(t => (
                  <option key={t.id} value={t.id}>{t.name} ({t.qualification || 'No subject'})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">Room</label>
              <Input placeholder="Main Hall" value={form.room} onChange={e => setForm(p => ({ ...p, room: e.target.value }))} />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setOpen(false)} variant="outline">Cancel</Button>
            <Button onClick={save}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
