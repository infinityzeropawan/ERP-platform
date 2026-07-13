'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { UserPlus, Check, X, Clock } from 'lucide-react';

export default function EnrollmentPage() {
  const { token } = useAuth();
  const [requests, setRequests] = useState<any[]>([]);

  const fetchRequests = async () => {
    if (!token) return;
    try {
      const res = await fetch('/api/v1/admin/enrollment-requests', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) setRequests(data);
    } catch (err) {
      console.error('Error fetching enrollment requests:', err);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [token]);

  const handleApprove = async (id: string) => {
    if (!token) return;
    try {
      const res = await fetch(`/api/v1/admin/enrollment-requests/${id}/approve`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to approve enrollment');

      alert('Enrollment approved successfully!');
      fetchRequests();
    } catch (err: any) {
      alert(err.message || 'Failed to approve enrollment');
    }
  };

  const handleReject = async (id: string) => {
    if (!token) return;
    const confirm = window.confirm('Are you sure you want to reject and delete this registration?');
    if (!confirm) return;

    try {
      const res = await fetch(`/api/v1/admin/enrollment-requests/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to reject enrollment');

      alert('Enrollment rejected and profile deleted!');
      fetchRequests();
    } catch (err: any) {
      alert(err.message || 'Failed to reject enrollment');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2"><UserPlus className="h-6 w-6 text-teal-600" />Enrollment Requests</h1>
        <p className="text-gray-500 text-sm mt-0.5">Review and manage student enrollment applications</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Pending Queue', value: requests.filter(r => r.status === 'pending').length, color: 'text-amber-600', icon: Clock },
          { label: 'System Approved', value: requests.filter(r => r.status === 'approved').length, color: 'text-green-600', icon: Check },
          { label: 'System Rejected', value: requests.filter(r => r.status === 'rejected').length, color: 'text-red-500', icon: X },
        ].map(s => (
          <Card key={s.label}>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
                <s.icon className={`h-5 w-5 ${s.color}`} />
              </div>
              <div>
                <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                <p className="text-xs text-gray-500">{s.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                {['Student', 'Email', 'Class Target', 'Applied On', 'Status', 'Actions'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {requests.map(r => (
                <tr key={r.id} className="border-b border-gray-100 hover:bg-gray-50/50">
                  <td className="px-4 py-3 font-semibold text-gray-950 text-xs">{r.studentName}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{r.email}</td>
                  <td className="px-4 py-3">
                    <Badge variant="info" className="text-[10px] font-bold">{r.class}</Badge>
                  </td>
                  <td className="px-4 py-3 text-gray-400 text-xs">{r.date}</td>
                  <td className="px-4 py-3">
                    <Badge variant="warning" className="text-[10px] font-bold uppercase">{r.status}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    {r.status === 'pending' && (
                      <div className="flex gap-2">
                        <Button size="sm" variant="success" onClick={() => handleApprove(r.id)} className="flex items-center gap-1 text-[11px] h-8 bg-green-600 hover:bg-green-700 text-white">
                          <Check className="h-3.5 w-3.5" /> Approve
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleReject(r.id)} className="flex items-center gap-1 text-[11px] h-8 bg-red-600 hover:bg-red-700 text-white">
                          <X className="h-3.5 w-3.5" /> Reject
                        </Button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {requests.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-400 text-xs">No pending student registration requests found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
