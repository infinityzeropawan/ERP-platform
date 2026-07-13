import { useAuth } from '@/lib/AuthContext';
import { UserProfile } from '../profile_types';

export function useProfile() {
  const { user } = useAuth();
  
  const profile: UserProfile = {
    name: user?.name || 'Pawan Kumar Dubey',
    email: user?.email || 'pawankrdubey36@gmail.com',
    phone: user?.phone || '95801 81697',
    role: user?.role || 'Teacher',
    joiningDate: user?.joiningDate || '6/5/2026',
    qualification: user?.qualification || '—',
    bloodGroup: user?.bloodGroup || '—',
    gender: user?.gender || '—',
    emergencyPhone: user?.emergencyPhone || '—',
  };

  const initials = profile.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  return { profile, initials };
}
