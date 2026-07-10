'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DEFAULT_MODULES, INSTITUTION_TYPE_LABELS } from '@/lib/modules';
import {
  Building2, Users, IndianRupee, TrendingUp, Shield, Calendar,
  AlertCircle, Megaphone, Globe
} from 'lucide-react';

const planColors: Record<string, string> = { 
  basic: 'bg-gray-100 text-gray-700', 
  pro: 'bg-blue-100 text-blue-700', 
  enterprise: 'bg-purple-100 text-purple-700' 
};
const statusColors: Record<string, 'success' | 'warning' | 'danger'> = { 
  active: 'success', 
  trial: 'warning', 
  suspended: 'danger' 
};

export default function SuperadminDashboard() {
  const { user, token } = useAuth();
  const [institutions, setInstitutions] = useState<any[]>([]);
  const today = new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  useEffect(() => {
    const loadStats = async () => {
      if (!token) return;
      try {
        const res = await fetch('/api/v1/superadmin/institutions', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        if (res.ok) {
          setInstitutions(data);
        }
      } catch (err) {
        console.error(err);
      }
    };
    loadStats();
  }, [token]);

  const totalRevenue = 0;
  const pendingRevenue = 0;
  const totalStudents = institutions.reduce((a, i) => a + (i.students || 0), 0);
  const totalTeachers = institutions.reduce((a, i) => a + (i.teachers || 0), 0);

  const stats = [
    { label: 'Total Institutions', value: institutions.length, icon: Building2, color: 'text-teal-600', bg: 'bg-teal-50', sub: `${institutions.filter(i => i.status === 'active').length} active` },
    { label: 'Total Students', value: totalStudents.toLocaleString(), icon: Users, color: 'text-blue-600', bg: 'bg-blue-50', sub: 'Across all institutions' },
    { label: 'Total Revenue', value: `₹${totalRevenue.toLocaleString('en-IN')}`, icon: IndianRupee, color: 'text-green-600', bg: 'bg-green-50', sub: 'Collected this cycle' },
    { label: 'Pending Revenue', value: `₹${pendingRevenue.toLocaleString('en-IN')}`, icon: AlertCircle, color: 'text-amber-600', bg: 'bg-amber-50', sub: `0 invoices` },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome, {user?.name?.split(' ')[0]}! 👋</h1>
          <p className="text-gray-500 text-sm mt-0.5 flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />{today}</p>
        </div>
        <Badge variant="default" className="self-start sm:self-auto flex items-center gap-1 bg-purple-600 hover:bg-purple-600">
          <Shield className="h-3 w-3" />Super Admin · Buildroonix
        </Badge>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map(s => (
          <Card key={s.label}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-medium text-gray-500">{s.label}</p>
                <div className={`p-1.5 rounded-lg ${s.bg}`}><s.icon className={`h-4 w-4 ${s.color}`} /></div>
              </div>
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-gray-400 mt-1">{s.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Analytics Placeholders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <IndianRupee className="h-4 w-4 text-green-600" />
              Monthly Revenue (₹)
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[200px] flex items-center justify-center text-xs text-gray-400">
            No monthly revenue data available.
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-teal-600" />
              Institution Growth
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[200px] flex items-center justify-center text-xs text-gray-400">
            No growth statistics available.
          </CardContent>
        </Card>
      </div>

      {/* Institutions Overview */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2"><Building2 className="h-4 w-4 text-teal-600" />Institutions Overview</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                {['Institution', 'Type', 'Plan', 'Students', 'Teachers', 'Status'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {institutions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-gray-400 text-xs">
                    No registered institutions found in the database.
                  </td>
                </tr>
              ) : (
                institutions.map((inst, i) => (
                  <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${INSTITUTION_TYPE_LABELS[inst.type as keyof typeof INSTITUTION_TYPE_LABELS].color} flex items-center justify-center`}>
                          <Globe className="h-3.5 w-3.5 text-white" />
                        </div>
                        <span className="font-medium text-gray-900">{inst.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs capitalize">{INSTITUTION_TYPE_LABELS[inst.type as keyof typeof INSTITUTION_TYPE_LABELS].label}</td>
                    <td className="px-4 py-3"><span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${planColors[inst.plan]}`}>{inst.plan}</span></td>
                    <td className="px-4 py-3 font-medium text-gray-900">{inst.students || 0}</td>
                    <td className="px-4 py-3 text-gray-600">{inst.teachers || 0}</td>
                    <td className="px-4 py-3"><Badge variant={statusColors[inst.status] as any}>{inst.status}</Badge></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Invoices */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <IndianRupee className="h-4 w-4 text-amber-500" />
              Recent Invoices
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[150px] flex items-center justify-center text-xs text-gray-400">
            No recent billing history found in the database.
          </CardContent>
        </Card>

        {/* Platform Announcements */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Megaphone className="h-4 w-4 text-purple-500" />
              Platform Announcements
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[150px] flex items-center justify-center text-xs text-gray-400">
            No announcements posted.
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
