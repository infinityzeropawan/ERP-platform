'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Users, GraduationCap, BookOpen, UserPlus, CheckCircle, XCircle,
  Calendar, Bell, IndianRupee, TrendingUp, Shield, Clock
} from 'lucide-react';
import { useAdminDashboard } from '../../admin_hooks/useAdminDashboard';
import '../../admin.css'; // import the module-level css

export default function AdminDashboardComponent() {
  const { user, myInstitution, studentsCount, teachersCount } = useAdminDashboard();
  const today = new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  const stats = [
    { label: 'Total Students', value: studentsCount.toLocaleString(), icon: GraduationCap, colorVar: 'var(--admin-success)', bgVar: 'var(--admin-success-bg)', sub: 'Enrolled in system' },
    { label: 'Total Teachers', value: teachersCount.toLocaleString(), icon: BookOpen, colorVar: 'var(--admin-primary)', bgVar: 'var(--admin-primary-subtle)', sub: 'Assigned teachers' },
    { label: 'Active Classes', value: 0, icon: Users, colorVar: 'var(--admin-info)', bgVar: 'var(--admin-info-bg)', sub: 'No classes created' },
    { label: 'Pending Enrollments', value: 0, icon: UserPlus, colorVar: 'var(--admin-warning)', bgVar: 'var(--admin-warning-bg)', sub: 'No requests' },
    { label: 'Present Today', value: 0, icon: CheckCircle, colorVar: 'var(--admin-success)', bgVar: 'var(--admin-success-bg)', sub: '0% attendance' },
    { label: 'Absent Today', value: 0, icon: XCircle, colorVar: 'var(--admin-danger)', bgVar: 'var(--admin-danger-bg)', sub: 'No absences' },
    { label: 'Fee Collected', value: '₹0', icon: IndianRupee, colorVar: 'var(--admin-success)', bgVar: 'var(--admin-success-bg)', sub: '0 pending' },
    { label: 'Payroll Pending', value: 0, icon: Clock, colorVar: 'var(--admin-warning)', bgVar: 'var(--admin-warning-bg)', sub: 'No pending payrolls' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--admin-text-primary)' }}>Welcome, {user?.name?.split(' ')[0]}! 👋</h1>
          <p className="text-sm mt-0.5 flex items-center gap-1" style={{ color: 'var(--admin-text-secondary)' }}><Calendar className="h-3.5 w-3.5" />{today}</p>
        </div>
        <Badge variant="default" className="self-start sm:self-auto flex items-center gap-1 border-0" style={{ backgroundColor: 'var(--admin-success-bg)', color: 'var(--admin-success)' }}>
          <Shield className="h-3 w-3" />{myInstitution?.name || 'Institution Admin'}
        </Badge>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map(s => (
          <Card key={s.label} style={{ backgroundColor: 'var(--admin-bg-card)', borderColor: 'var(--admin-border)' }}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-medium leading-tight" style={{ color: 'var(--admin-text-secondary)' }}>{s.label}</p>
                <div className="p-1.5 rounded-lg" style={{ backgroundColor: s.bgVar }}><s.icon className="h-4 w-4" style={{ color: s.colorVar }} /></div>
              </div>
              <p className="text-2xl font-bold" style={{ color: s.colorVar }}>{s.value}</p>
              <p className="text-xs mt-1" style={{ color: 'var(--admin-text-secondary)' }}>{s.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card style={{ backgroundColor: 'var(--admin-bg-card)', borderColor: 'var(--admin-border)' }}>
          <CardHeader className="pb-3"><CardTitle className="text-base flex items-center gap-2" style={{ color: 'var(--admin-text-primary)' }}><TrendingUp className="h-4 w-4" style={{ color: 'var(--admin-success)' }} />Weekly Attendance</CardTitle></CardHeader>
          <CardContent className="h-[200px] flex items-center justify-center text-xs" style={{ color: 'var(--admin-text-secondary)' }}>
            No attendance records logged.
          </CardContent>
        </Card>

        {/* Fee Summary */}
        <Card style={{ backgroundColor: 'var(--admin-bg-card)', borderColor: 'var(--admin-border)' }}>
          <CardHeader className="pb-3"><CardTitle className="text-base flex items-center gap-2" style={{ color: 'var(--admin-text-primary)' }}><IndianRupee className="h-4 w-4" style={{ color: 'var(--admin-success)' }} />Fee Collection Summary</CardTitle></CardHeader>
          <CardContent className="h-[200px] flex items-center justify-center text-xs" style={{ color: 'var(--admin-text-secondary)' }}>
            No fee invoices logged.
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Enrollment Requests */}
        <Card style={{ backgroundColor: 'var(--admin-bg-card)', borderColor: 'var(--admin-border)' }}>
          <CardHeader className="pb-3"><CardTitle className="text-base flex items-center gap-2" style={{ color: 'var(--admin-text-primary)' }}><UserPlus className="h-4 w-4" style={{ color: 'var(--admin-warning)' }} />Pending Enrollments</CardTitle></CardHeader>
          <CardContent className="h-[150px] flex items-center justify-center text-xs" style={{ color: 'var(--admin-text-secondary)' }}>
            No pending enrollment requests.
          </CardContent>
        </Card>

        {/* Recent Notices */}
        <Card style={{ backgroundColor: 'var(--admin-bg-card)', borderColor: 'var(--admin-border)' }}>
          <CardHeader className="pb-3"><CardTitle className="text-base flex items-center gap-2" style={{ color: 'var(--admin-text-primary)' }}><Bell className="h-4 w-4" style={{ color: 'var(--admin-warning)' }} />Recent Notices</CardTitle></CardHeader>
          <CardContent className="h-[150px] flex items-center justify-center text-xs" style={{ color: 'var(--admin-text-secondary)' }}>
            No notices posted.
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
