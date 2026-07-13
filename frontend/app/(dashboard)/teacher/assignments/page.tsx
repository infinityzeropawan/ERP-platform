'use client';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectItem } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ResourceState, useResource } from '@/lib/useResource';
import { FileText, Plus, Calendar, BookOpen, Award } from 'lucide-react';

export default function AssignmentsPage() {
  type Assignment = {
    id: string; title: string; class: string; subject: string; dueDate: string;
    maxMarks: number; status: 'active' | 'closed' | 'draft'; description: string;
  };
  const { data: rawAssignments, loading, error, create } = useResource<{
    id: string; title: string; className: string; subject: string; dueAt: string;
    maxMarks: number; status: Assignment['status']; description: string;
  }>('assignments');
  const assignments: Assignment[] = rawAssignments.map(item => ({
    ...item, class: item.className, dueDate: new Date(item.dueAt).toLocaleDateString(),
  }));
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ title: '', subject: '', dueDate: '', maxMarks: '', description: '', status: 'active' as Assignment['status'] });

  const handleCreate = async () => {
    if (!form.title || !form.subject || !form.dueDate) return;
    await create({
      title: form.title,
      className: 'IOT-2026',
      subject: form.subject,
      dueAt: form.dueDate,
      maxMarks: Number(form.maxMarks) || 100,
      status: form.status,
      description: form.description,
    });
    setForm({ title: '', subject: '', dueDate: '', maxMarks: '', description: '', status: 'active' });
    setOpen(false);
  };

  const statusColor: Record<Assignment['status'], 'success' | 'danger' | 'warning'> = {
    active: 'success', closed: 'danger', draft: 'warning',
  };
  if (loading || error) return <ResourceState loading={loading} error={error} />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <FileText className="h-6 w-6 text-teal-600" />Teacher Workspace
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">Assignments & Homework</p>
        </div>
        <Button onClick={() => setOpen(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />Create Assignment
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          {assignments.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-16 text-gray-400">
              <FileText className="h-12 w-12 text-gray-300" />
              <p className="text-base font-medium">No assignments found</p>
              <p className="text-sm">Create your first assignment using the button above</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Title & Class</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Subject</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Due Date</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Max Marks</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {assignments.map(a => (
                    <tr key={a.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <p className="font-medium text-gray-900">{a.title}</p>
                        <p className="text-xs text-gray-400">{a.class}</p>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5 text-gray-600">
                          <BookOpen className="h-3.5 w-3.5 text-teal-500" />{a.subject}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5 text-gray-600">
                          <Calendar className="h-3.5 w-3.5 text-orange-400" />{a.dueDate}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5 text-gray-600">
                          <Award className="h-3.5 w-3.5 text-purple-400" />{a.maxMarks}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={statusColor[a.status]}>{a.status}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="w-full max-w-lg">
          <DialogHeader>
            <DialogTitle>Create New Assignment</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">Title *</label>
              <Input placeholder="Assignment title" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">Subject *</label>
                <Input placeholder="e.g. IOT101" value={form.subject} onChange={e => setForm(p => ({ ...p, subject: e.target.value }))} />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">Max Marks</label>
                <Input type="number" placeholder="100" value={form.maxMarks} onChange={e => setForm(p => ({ ...p, maxMarks: e.target.value }))} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">Due Date *</label>
                <Input type="date" value={form.dueDate} onChange={e => setForm(p => ({ ...p, dueDate: e.target.value }))} />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">Status</label>
                <Select value={form.status} onValueChange={v => setForm(p => ({ ...p, status: v as Assignment['status'] }))}>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </Select>
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">Description</label>
              <Textarea placeholder="Assignment description..." rows={3} value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={handleCreate}>Create Assignment</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
