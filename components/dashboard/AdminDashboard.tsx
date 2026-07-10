'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Users, GraduationCap, BookOpen, UserPlus, CheckCircle, XCircle,
  Calendar, Bell, IndianRupee, TrendingUp, Shield, Clock
} from 'lucide-react';

export default function AdminDashboard() {
  const { user, token } = useAuth();
  const [myInstitution, setMyInstitution] = useState<any>(null);
  const today = new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  useEffect(() => {
    const fetchMyInstitution = async () => {
      if (!token) return;
      try {
        const res = await fetch('/api/v1/admin/my-institution', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setMyInstitution(data);
        }
      } catch (err) {
        console.error('Error fetching admin institution stats:', err);
      }
    };
    fetchMyInstitution();
  }, [token]);

  const studentsCount = myInstitution?.students || 0;
  const teachersCount = myInstitution?.teachers || 0;

  const stats = [
    { label: 'Total Students', value: studentsCount.toLocaleString(), icon: GraduationCap, color: 'text-teal-600', bg: 'bg-teal-50', sub: 'Enrolled in system' },
    { label: 'Total Teachers', value: teachersCount.toLocaleString(), icon: BookOpen, color: 'text-indigo-600', bg: 'bg-indigo-50', sub: 'Assigned teachers' },
    { label: 'Active Classes', value: 0, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50', sub: 'No classes created' },
    { label: 'Pending Enrollments', value: 0, icon: UserPlus, color: 'text-amber-600', bg: 'bg-amber-50', sub: 'No requests' },
    { label: 'Present Today', value: 0, icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50', sub: '0% attendance' },
    { label: 'Absent Today', value: 0, icon: XCircle, color: 'text-red-600', bg: 'bg-red-50', sub: 'No absences' },
    { label: 'Fee Collected', value: '₹0', icon: IndianRupee, color: 'text-green-600', bg: 'bg-green-50', sub: '0 pending' },
    { label: 'Payroll Pending', value: 0, icon: Clock, color: 'text-orange-600', bg: 'bg-orange-50', sub: 'No pending payrolls' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome, {user?.name?.split(' ')[0]}! 👋</h1>
          <p className="text-gray-500 text-sm mt-0.5 flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />{today}</p>
        </div>
        <Badge variant="default" className="self-start sm:self-auto flex items-center gap-1 bg-teal-600 hover:bg-teal-600 text-white border-0">
          <Shield className="h-3 w-3" />{myInstitution?.name || 'Institution Admin'}
        </Badge>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map(s => (
          <Card key={s.label}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-medium text-gray-500 leading-tight">{s.label}</p>
                <div className={`p-1.5 rounded-lg ${s.bg}`}><s.icon className={`h-4 w-4 ${s.color}`} /></div>
              </div>
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-gray-400 mt-1">{s.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-3"><CardTitle className="text-base flex items-center gap-2"><TrendingUp className="h-4 w-4 text-teal-600" />Weekly Attendance</CardTitle></CardHeader>
          <CardContent className="h-[200px] flex items-center justify-center text-xs text-gray-400">
            No attendance records logged.
          </CardContent>
        </Card>

        {/* Fee Summary */}
        <Card>
          <CardHeader className="pb-3"><CardTitle className="text-base flex items-center gap-2"><IndianRupee className="h-4 w-4 text-green-600" />Fee Collection Summary</CardTitle></CardHeader>
          <CardContent className="h-[200px] flex items-center justify-center text-xs text-gray-400">
            No fee invoices logged.
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Enrollment Requests */}
        <Card>
          <CardHeader className="pb-3"><CardTitle className="text-base flex items-center gap-2"><UserPlus className="h-4 w-4 text-amber-500" />Pending Enrollments</CardTitle></CardHeader>
          <CardContent className="h-[150px] flex items-center justify-center text-xs text-gray-400">
            No pending enrollment requests.
          </CardContent>
        </Card>

        {/* Recent Notices */}
        <Card>
          <CardHeader className="pb-3"><CardTitle className="text-base flex items-center gap-2"><Bell className="h-4 w-4 text-amber-500" />Recent Notices</CardTitle></CardHeader>
          <CardContent className="h-[150px] flex items-center justify-center text-xs text-gray-400">
            No notices posted.
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
