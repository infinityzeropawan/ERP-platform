import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/AuthContext';

export type TeacherInfo = {
  id: string;
  name: string;
  subject: string;
  qualification: string;
};

export function useProfile() {
  const { user } = useAuth();
  const [teachers, setTeachers] = useState<TeacherInfo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/v1/student/class-info')
      .then(r => r.ok ? r.json() : { teachers: [] })
      .then(data => {
        setTeachers(data.teachers || []);
        setLoading(false);
      })
      .catch(() => {
        setTeachers([]);
        setLoading(false);
      });
  }, []);

  const initials = user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || '??';

  return {
    user,
    teachers,
    loading,
    initials
  };
}
