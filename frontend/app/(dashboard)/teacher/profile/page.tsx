'use client';
import { useAuth } from '@/lib/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, Mail, Phone, Calendar, BookOpen, Droplets, Users, AlertCircle } from 'lucide-react';

export default function TeacherProfilePage() {
  const { user } = useAuth();

  const details = [
    { label: 'Email', value: user?.email || 'pawankrdubey36@gmail.com', icon: Mail },
    { label: 'Phone', value: user?.phone || '95801 81697', icon: Phone },
    { label: 'Joining Date', value: user?.joiningDate || '6/5/2026', icon: Calendar },
    { label: 'Highest Qualification', value: user?.qualification || '—', icon: BookOpen },
    { label: 'Blood Group', value: user?.bloodGroup || '—', icon: Droplets },
    { label: 'Gender', value: user?.gender || '—', icon: Users },
    { label: 'Emergency Phone', value: user?.emergencyPhone || '—', icon: AlertCircle },
  ];

  const initials = user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'PK';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <User className="h-6 w-6 text-teal-600" />My Profile Details
        </h1>
        <p className="text-gray-500 text-sm mt-0.5">Your personal and professional information</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Avatar Card */}
        <Card className="lg:col-span-1">
          <CardContent className="p-6 flex flex-col items-center text-center">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg mb-4">
              {initials}
            </div>
            <h2 className="text-xl font-bold text-gray-900">{user?.name || 'Pawan Kumar Dubey'}</h2>
            <Badge variant="default" className="mt-2 capitalize">{user?.role || 'Teacher'}</Badge>
            <div className="mt-4 w-full space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 rounded-lg p-2.5">
                <Mail className="h-4 w-4 text-teal-500 flex-shrink-0" />
                <span className="truncate">{user?.email || 'pawankrdubey36@gmail.com'}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 rounded-lg p-2.5">
                <Phone className="h-4 w-4 text-teal-500 flex-shrink-0" />
                <span>{user?.phone || '95801 81697'}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Details Grid */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Profile Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {details.map(d => (
                <div key={d.label} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className="w-8 h-8 rounded-lg bg-teal-100 flex items-center justify-center flex-shrink-0">
                    <d.icon className="h-4 w-4 text-teal-600" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">{d.label}</p>
                    <p className="text-sm font-semibold text-gray-900 mt-0.5">{d.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
