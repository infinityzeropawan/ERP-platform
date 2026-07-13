import { useState } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { AUTH_URLS } from '../auth_url_config';

export function useAuthLogin() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleLogin = async (email: string, password: string, role: string) => {
    setError(''); 
    setLoading(true);
    
    try {
      const res = await fetch(AUTH_URLS.API_LOGIN, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password, role })
      });

      const data = await res.json();

      if (data.message?.includes('1 minute')) {
        throw new Error('Too many failed attempts. Please wait 1 minute and try again.');
      }
      if (!res.ok) {
        throw new Error(data.message || 'Incorrect email or password');
      }

      // If logging in as school admin, save institution details to localStorage
      if (data.user.role === 'school_admin' && data.user.institutionId) {
        const instRes = await fetch(AUTH_URLS.API_MY_INSTITUTION, {
          headers: {
            'Authorization': `Bearer ${data.token}`
          }
        });
        if (instRes.ok) {
          const instData = await instRes.json();
          localStorage.setItem('buildroonix_my_institution', JSON.stringify(instData));
        }
      }

      if (data.user.role === 'superadmin') {
        throw new Error('Access Denied: Super Administrators must authenticate via the secure console.');
      }

      login(data.user, data.token);
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'Failed to connect to the authentication server. Ensure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return { error, loading, setError, handleLogin };
}
