'use client';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectItem } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Briefcase, Plus, Calendar, Clock } from 'lucide-react';

interface LeaveRequest {
  id: string; type: string; from: string; to: string; reason: string; status: 'pending' | 'approved' | 'rejected';
}

const initialLeaves: LeaveRequest[] = [
  { id: 'lv-001', type: 'Sick Leave', from: '2026-07-10', to: '2026-07-11', reason: 'Fever and cold', status: 'approved' },
  { id: 'lv-002', type: 'Casual Leave', from: '2026-07-20', to: '2026-07-20', reason: 'Personal work', status: 'pending' },
];

export default function LeavePage() {
  const [leaves, setLeaves] = useState<LeaveRequest[]>(initialLeaves);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ type: '', from: '', to: '', reason: '' });

  const submit = () => {
    if (!form.type || !form.from || !form.to) return;
    setLeaves(p => [...p, { id: `lv-${Date.now()}`, ...form, status: 'pending' }]);
    setForm({ type: '', from: '', to: '', reason: '' });
    setOpen(false);
  };

  const statusColor: Record<string, 'success' | 'danger' | 'warning'> = { approved: 'success', rejected: 'danger', pending: 'warning' };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2"><Briefcase className="h-6 w-6 text-teal-600" />My Leave</h1>
          <p className="text-gray-500 text-sm mt-0.5">Apply and track your leave requests</p>
        </div>
        <Button onClick={() => setOpen(true)} className="flex items-center gap-2"><Plus className="h-4 w-4" />Apply Leave</Button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[{ label: 'Total Applied', value: leaves.length, color: 'text-teal-600' }, { label: 'Approved', value: leaves.filter(l => l.status === 'approved').length, color: 'text-green-600' }, { label: 'Pending', value: leaves.filter(l => l.status === 'pending').length, color: 'text-amber-600' }].map(s => (
          <Card key={s.label}><CardContent className="p-4 text-center"><p className={`text-2xl font-bold ${s.color}`}>{s.value}</p><p className="text-xs text-gray-500 mt-1">{s.label}</p></CardContent></Card>
        ))}
      </div>

      <Card>
        <CardHeader className="pb-3"><CardTitle className="text-base">Leave History</CardTitle></CardHeader>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                {['Type', 'From', 'To', 'Reason', 'Status'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {leaves.map(l => (
                <tr key={l.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{l.type}</td>
                  <td className="px-4 py-3 text-gray-600 flex items-center gap-1"><Calendar className="h-3.5 w-3.5 text-gray-400" />{l.from}</td>
                  <td className="px-4 py-3 text-gray-600">{l.to}</td>
                  <td className="px-4 py-3 text-gray-500 max-w-[200px] truncate">{l.reason}</td>
                  <td className="px-4 py-3"><Badge variant={statusColor[l.status]}>{l.status}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Apply for Leave</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">Leave Type</label>
              <Select value={form.type} onValueChange={v => setForm(p => ({ ...p, type: v }))} placeholder="Select type">
                <SelectItem value="Sick Leave">Sick Leave</SelectItem>
                <SelectItem value="Casual Leave">Casual Leave</SelectItem>
                <SelectItem value="Earned Leave">Earned Leave</SelectItem>
                <SelectItem value="Emergency Leave">Emergency Leave</SelectItem>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className="text-xs font-medium text-gray-600 mb-1 block">From Date</label><Input type="date" value={form.from} onChange={e => setForm(p => ({ ...p, from: e.target.value }))} /></div>
              <div><label className="text-xs font-medium text-gray-600 mb-1 block">To Date</label><Input type="date" value={form.to} onChange={e => setForm(p => ({ ...p, to: e.target.value }))} /></div>
            </div>
            <div><label className="text-xs font-medium text-gray-600 mb-1 block">Reason</label><Textarea placeholder="Reason for leave..." value={form.reason} onChange={e => setForm(p => ({ ...p, reason: e.target.value }))} rows={3} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={submit}>Submit Request</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
