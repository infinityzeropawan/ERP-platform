import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { ADMIN_ROUTES } from '../admin_url_config';
import { AdminInstitutionStats } from '../admin_types';

export function useAdminDashboard() {
  const { user, token } = useAuth();
  const [myInstitution, setMyInstitution] = useState<AdminInstitutionStats | null>(null);

  useEffect(() => {
    const fetchMyInstitution = async () => {
      if (!token) return;
      try {
        const res = await fetch(ADMIN_ROUTES.API.MY_INSTITUTION, {
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

  return {
    user,
    myInstitution,
    studentsCount: myInstitution?.students || 0,
    teachersCount: myInstitution?.teachers || 0,
  };
}
