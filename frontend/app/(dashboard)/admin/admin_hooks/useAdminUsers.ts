import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { ADMIN_ROUTES } from '../admin_url_config';

export type UserTabType = 'students' | 'teachers' | 'support';

export function useAdminUsers(tab: UserTabType) {
  const { token } = useAuth();
  
  const [usersData, setUsersData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchUsers = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const roleParam = tab === 'support' ? 'support' : tab === 'teachers' ? 'teacher' : 'student';
      const res = await fetch(`${ADMIN_ROUTES.API.USERS}?role=${roleParam}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setUsersData(data);
      }
    } catch (err) {
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  }, [token, tab]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const addUser = async (payload: any) => {
    const res = await fetch(ADMIN_ROUTES.API.USERS, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        role: tab === 'support' ? 'support' : tab === 'teachers' ? 'teacher' : 'student',
        ...payload
      })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to create profile');
    await fetchUsers();
  };

  const editUser = async (id: string, payload: any) => {
    const res = await fetch(`${ADMIN_ROUTES.API.USERS}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        role: tab === 'support' ? 'support' : tab === 'teachers' ? 'teacher' : 'student',
        ...payload
      })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to update profile');
    await fetchUsers();
  };

  const deleteUser = async (id: string) => {
    const roleParam = tab === 'support' ? 'support' : tab === 'teachers' ? 'teacher' : 'student';
    const res = await fetch(`${ADMIN_ROUTES.API.USERS}/${id}?role=${roleParam}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to delete profile');
    await fetchUsers();
  };

  return {
    usersData,
    loading,
    fetchUsers,
    addUser,
    editUser,
    deleteUser
  };
}
