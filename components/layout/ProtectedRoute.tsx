'use client';
import { useAuth } from '@/lib/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';

const roleHome: Record<string, string> = {
  superadmin: '/superadmin',
  school_admin: '/admin',
  teacher: '/teacher',
  student: '/student',
  parent: '/parent',
};

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isAuthenticated) { router.push('/login'); return; }
    const role = user?.role || 'student';
    const home = roleHome[role];

    if (pathname.startsWith('/superadmin') && role !== 'superadmin') router.push(home);
    if (pathname.startsWith('/admin') && role !== 'school_admin') router.push(home);
    if (pathname.startsWith('/teacher') && role !== 'teacher') router.push(home);
    if (pathname.startsWith('/student') && role !== 'student') router.push(home);
    if (pathname.startsWith('/parent') && role !== 'parent') router.push(home);
  }, [isAuthenticated, user, pathname, router]);

  if (!isAuthenticated) return null;
  return <>{children}</>;
}
