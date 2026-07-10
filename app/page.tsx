'use client';
import { useAuth } from '@/lib/AuthContext';
import SuperadminDashboard from '@/components/dashboard/SuperadminDashboard';
import TeacherDashboard from '@/components/dashboard/TeacherDashboard';
import StudentDashboard from '@/components/dashboard/StudentDashboard';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function RootPage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) router.push('/login');
    else if (user?.role === 'superadmin') router.push('/admin');
    else if (user?.role === 'teacher') router.push('/teacher');
    else router.push('/student');
  }, [isAuthenticated, user, router]);

  return null;
}
