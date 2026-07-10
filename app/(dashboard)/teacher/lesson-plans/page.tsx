'use client';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectItem } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

type LessonPlan = { id: string; subject: string; subjectCode: string; topic: string; objectives: string; content: string; teachingAids: string; plannedDate: string; durationMins: number; status: 'draft' | 'approved' | 'completed'; };
import { BookMarked, Plus, Calendar, Clock, Eye, X } from 'lucide-react';

const statusConfig = {
  draft: { variant: 'warning' as const },
  approved: { variant: 'info' as const },
  completed: { variant: 'success' as const },
};

export default function LessonPlansPage() {
  const [plans, setPlans] = useState<LessonPlan[]>([]);
  const [open, setOpen] = useState(false);
  const [viewPlan, setViewPlan] = useState<LessonPlan | null>(null);
  const [form, setForm] = useState({ subject: '', subjectCode: '', topic: '', objectives: '', content: '', teachingAids: '', plannedDate: '', durationMins: '', status: 'draft' as LessonPlan['status'] });

  const handleCreate = () => {
    if (!form.subject || !form.topic) return;
    setPlans(p => [{
      id: `lp-${Date.now()}`, ...form, durationMins: Number(form.durationMins) || 60,
    }, ...p]);
    setForm({ subject: '', subjectCode: '', topic: '', objectives: '', content: '', teachingAids: '', plannedDate: '', durationMins: '', status: 'draft' });
    setOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2"><BookMarked className="h-6 w-6 text-teal-600" />Lesson Plans</h1>
          <p className="text-gray-500 text-sm mt-0.5">Plan and organize your lessons topic-wise</p>
        </div>
        <Button onClick={() => setOpen(true)} className="flex items-center gap-2"><Plus className="h-4 w-4" />Create Plan</Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Plans', value: plans.length, color: 'text-teal-600' },
          { label: 'Approved', value: plans.filter(p => p.status === 'approved').length, color: 'text-blue-600' },
          { label: 'Completed', value: plans.filter(p => p.status === 'completed').length, color: 'text-green-600' },
        ].map(s => (
          <Card key={s.label}><CardContent className="p-4 text-center"><p className={`text-2xl font-bold ${s.color}`}>{s.value}</p><p className="text-xs text-gray-500 mt-1">{s.label}</p></CardContent></Card>
        ))}
      </div>

      <Card>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                {['Topic', 'Subject', 'Planned Date', 'Duration', 'Status', 'Action'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {plans.map(plan => (
                <tr key={plan.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-900">{plan.topic}</p>
                    <p className="text-xs text-gray-400 mt-0.5 max-w-[200px] truncate">{plan.objectives}</p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-gray-700 text-xs font-medium">{plan.subject}</p>
                    <p className="text-xs text-gray-400">{plan.subjectCode}</p>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5 text-gray-600 text-xs">
                      <Calendar className="h-3.5 w-3.5 text-purple-400" />{plan.plannedDate}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5 text-gray-600 text-xs">
                      <Clock className="h-3.5 w-3.5 text-blue-400" />{plan.durationMins} min
                    </div>
                  </td>
                  <td className="px-4 py-3"><Badge variant={statusConfig[plan.status].variant}>{plan.status}</Badge></td>
                  <td className="px-4 py-3">
                    <Button size="sm" variant="outline" onClick={() => setViewPlan(plan)} className="flex items-center gap-1 text-xs">
                      <Eye className="h-3 w-3" />View
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Create Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="w-full max-w-lg">
          <DialogHeader><DialogTitle>Create Lesson Plan</DialogTitle></DialogHeader>
          <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
            <div className="grid grid-cols-2 gap-3">
              <div><label className="text-xs font-medium text-gray-600 mb-1 block">Subject *</label><Input placeholder="IOT & Embedded Systems" value={form.subject} onChange={e => setForm(p => ({ ...p, subject: e.target.value }))} /></div>
              <div><label className="text-xs font-medium text-gray-600 mb-1 block">Subject Code</label><Input placeholder="IOT101" value={form.subjectCode} onChange={e => setForm(p => ({ ...p, subjectCode: e.target.value }))} /></div>
            </div>
            <div><label className="text-xs font-medium text-gray-600 mb-1 block">Topic *</label><Input placeholder="MQTT Protocol" value={form.topic} onChange={e => setForm(p => ({ ...p, topic: e.target.value }))} /></div>
            <div><label className="text-xs font-medium text-gray-600 mb-1 block">Learning Objectives</label><Textarea placeholder="Students will be able to..." rows={2} value={form.objectives} onChange={e => setForm(p => ({ ...p, objectives: e.target.value }))} /></div>
            <div><label className="text-xs font-medium text-gray-600 mb-1 block">Content / Activities</label><Textarea placeholder="Theory + Practical details..." rows={3} value={form.content} onChange={e => setForm(p => ({ ...p, content: e.target.value }))} /></div>
            <div><label className="text-xs font-medium text-gray-600 mb-1 block">Teaching Aids</label><Input placeholder="Whiteboard, Arduino kit, Projector" value={form.teachingAids} onChange={e => setForm(p => ({ ...p, teachingAids: e.target.value }))} /></div>
            <div className="grid grid-cols-3 gap-3">
              <div><label className="text-xs font-medium text-gray-600 mb-1 block">Planned Date</label><Input type="date" value={form.plannedDate} onChange={e => setForm(p => ({ ...p, plannedDate: e.target.value }))} /></div>
              <div><label className="text-xs font-medium text-gray-600 mb-1 block">Duration (min)</label><Input type="number" placeholder="60" value={form.durationMins} onChange={e => setForm(p => ({ ...p, durationMins: e.target.value }))} /></div>
              <div><label className="text-xs font-medium text-gray-600 mb-1 block">Status</label>
                <Select value={form.status} onValueChange={v => setForm(p => ({ ...p, status: v as LessonPlan['status'] }))}>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={handleCreate}>Create Plan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={!!viewPlan} onOpenChange={() => setViewPlan(null)}>
        <DialogContent className="w-full max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>{viewPlan?.topic}</span>
              <Badge variant={viewPlan ? statusConfig[viewPlan.status].variant : 'default'}>{viewPlan?.status}</Badge>
            </DialogTitle>
          </DialogHeader>
          {viewPlan && (
            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 rounded-lg p-3"><p className="text-xs text-gray-400 mb-1">Subject</p><p className="font-medium">{viewPlan.subject} ({viewPlan.subjectCode})</p></div>
                <div className="bg-gray-50 rounded-lg p-3"><p className="text-xs text-gray-400 mb-1">Date & Duration</p><p className="font-medium">{viewPlan.plannedDate} · {viewPlan.durationMins} min</p></div>
              </div>
              {viewPlan.objectives && <div className="bg-blue-50 rounded-lg p-3"><p className="text-xs text-blue-600 font-semibold mb-1">Objectives</p><p className="text-gray-700">{viewPlan.objectives}</p></div>}
              {viewPlan.content && <div className="bg-teal-50 rounded-lg p-3"><p className="text-xs text-teal-600 font-semibold mb-1">Content & Activities</p><p className="text-gray-700">{viewPlan.content}</p></div>}
              {viewPlan.teachingAids && <div className="bg-purple-50 rounded-lg p-3"><p className="text-xs text-purple-600 font-semibold mb-1">Teaching Aids</p><p className="text-gray-700">{viewPlan.teachingAids}</p></div>}
            </div>
          )}
          <DialogFooter><Button variant="outline" onClick={() => setViewPlan(null)}>Close</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
