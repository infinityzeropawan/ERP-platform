'use client';
import { Sidebar, MobileHeader } from '@/components/layout/Sidebar';
import ProtectedRoute from '@/components/layout/ProtectedRoute';
import { useAuth } from '@/lib/AuthContext';
import { Rocket, Bell } from 'lucide-react';
import Link from 'next/link';

function TopBar() {
  const { user } = useAuth();
  if (user?.role !== 'student') return null;
  const unread = 0; // notifications count managed in /student/notifications page
  return (
    <div className="hidden md:flex items-center justify-end px-6 py-2 bg-white border-b border-gray-100">
      <Link href="/student/notifications" className="relative p-2 rounded-xl hover:bg-gray-100 transition-colors">
        <Bell className="h-5 w-5 text-gray-500" />
        {unread > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center animate-bounce-in">
            {unread}
          </span>
        )}
      </Link>
    </div>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <div className="flex flex-col flex-1 min-w-0">
          <MobileHeader />
          <TopBar />
          <main className="flex-1 p-4 md:p-6 overflow-auto">
            {children}
          </main>
          <footer className="px-6 py-3 border-t border-gray-200 bg-white">
            <p className="text-xs text-gray-400 flex items-center gap-1">
              <Rocket className="h-3 w-3 text-teal-500" />
              Powered by Buildroonix — Smart School ERP & LMS Platform
            </p>
          </footer>
        </div>
      </div>
    </ProtectedRoute>
  );
}
