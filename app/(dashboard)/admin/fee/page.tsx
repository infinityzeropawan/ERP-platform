'use client';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ResourceState, useResource } from '@/lib/useResource';
import { IndianRupee, Search, CheckCircle, AlertCircle, Clock, Filter } from 'lucide-react';

export default function AdminFeePage() {
  const { data: rawFees, loading, error, update } = useResource<{
    id: string; studentName: string; rollNo: string; title: string; amount: number;
    dueDate: string; paidDate?: string; receiptNo?: string;
    status: 'paid' | 'pending' | 'overdue';
  }>('fees');
  const fees = rawFees.map(fee => ({ ...fee, feeType: fee.title }));
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'paid' | 'pending' | 'overdue'>('all');

  const filtered = fees.filter(f =>
    (filter === 'all' || f.status === filter) &&
    f.studentName.toLowerCase().includes(search.toLowerCase())
  );

  const markPaid = async (id: string) => {
    await update(id, {
      status: 'paid',
      paidDate: new Date().toISOString().split('T')[0],
      receiptNo: `RCP-${Date.now()}`,
    });
  };

  const collected = fees.filter(f => f.status === 'paid').reduce((a, f) => a + f.amount, 0);
  const pending = fees.filter(f => f.status === 'pending').reduce((a, f) => a + f.amount, 0);
  const overdue = fees.filter(f => f.status === 'overdue').reduce((a, f) => a + f.amount, 0);
  if (loading || error) return <ResourceState loading={loading} error={error} />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2"><IndianRupee className="h-6 w-6 text-teal-600" />Fee Management</h1>
        <p className="text-gray-500 text-sm mt-0.5">Track and manage student fee collection</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-green-500 to-green-700 text-white border-0">
          <CardContent className="p-5">
            <p className="text-green-100 text-xs font-medium uppercase">Collected</p>
            <p className="text-3xl font-bold mt-1">₹{collected.toLocaleString('en-IN')}</p>
            <p className="text-green-200 text-xs mt-1 flex items-center gap-1"><CheckCircle className="h-3 w-3" />{fees.filter(f => f.status === 'paid').length} payments</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-gray-400 text-xs font-medium uppercase">Pending</p>
            <p className="text-2xl font-bold text-amber-600 mt-1">₹{pending.toLocaleString('en-IN')}</p>
            <p className="text-gray-400 text-xs mt-1 flex items-center gap-1"><Clock className="h-3 w-3" />{fees.filter(f => f.status === 'pending').length} students</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-gray-400 text-xs font-medium uppercase">Overdue</p>
            <p className="text-2xl font-bold text-red-600 mt-1">₹{overdue.toLocaleString('en-IN')}</p>
            <p className="text-gray-400 text-xs mt-1 flex items-center gap-1"><AlertCircle className="h-3 w-3" />{fees.filter(f => f.status === 'overdue').length} students</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <CardTitle className="text-base">Fee Records</CardTitle>
            <div className="flex items-center gap-2 flex-wrap">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-gray-400" />
                <Input placeholder="Search student..." value={search} onChange={e => setSearch(e.target.value)} className="pl-8 h-8 w-44 text-xs" />
              </div>
              <div className="flex gap-1">
                {(['all', 'paid', 'pending', 'overdue'] as const).map(f => (
                  <button key={f} onClick={() => setFilter(f)}
                    className={`px-3 py-1 rounded-full text-xs font-medium capitalize transition-colors ${filter === f ? 'bg-teal-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                    {f}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                {['Student', 'Roll No', 'Fee Type', 'Amount', 'Due Date', 'Paid Date', 'Receipt', 'Status', 'Action'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(f => (
                <tr key={f.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{f.studentName}</td>
                  <td className="px-4 py-3 text-gray-500">{f.rollNo}</td>
                  <td className="px-4 py-3 text-gray-600">{f.feeType}</td>
                  <td className="px-4 py-3 font-bold text-gray-900">₹{f.amount.toLocaleString('en-IN')}</td>
                  <td className="px-4 py-3 text-gray-500">{new Date(f.dueDate).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-gray-500">{f.paidDate ? new Date(f.paidDate).toLocaleDateString() : '—'}</td>
                  <td className="px-4 py-3 text-xs text-gray-400 font-mono">{f.receiptNo || '—'}</td>
                  <td className="px-4 py-3">
                    <Badge variant={f.status === 'paid' ? 'success' : f.status === 'overdue' ? 'danger' : 'warning'}>{f.status}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    {f.status !== 'paid' && (
                      <Button size="sm" variant="success" onClick={() => markPaid(f.id)} className="text-xs h-7">Mark Paid</Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
