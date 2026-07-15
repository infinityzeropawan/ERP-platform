'use client';
import { useState } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { Eye, EyeOff, Shield } from 'lucide-react';

const themeColors = {
  bg: 'from-slate-950 via-slate-900 to-purple-950',
  logo: 'from-purple-400 to-purple-600',
  btn: 'from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 hover:shadow-purple-200',
  text: 'text-purple-300',
  ring: 'focus:ring-purple-500'
};

export default function SuperadminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); 
    setLoading(true);
    
    try {
      const res = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Incorrect email or password');
      }

      if (data.user.role !== 'superadmin') {
        throw new Error('Unauthorized. This portal is for Super Administrators only.');
      }

      login(data.user, data.token);
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'Failed to connect to the authentication server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${themeColors.bg} flex items-center justify-center p-4`}>
      <div className="w-full max-w-md">
        
        {/* Logo and Branded Title */}
        <div className="text-center mb-6 animate-fade-in">
          <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${themeColors.logo} shadow-2xl mb-3`}>
            <Shield className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Buildroonix Control</h1>
          <p className={`${themeColors.text} text-xs mt-1 uppercase tracking-widest font-bold`}>Super Administrator Login</p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden p-6 border border-slate-200">
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-gray-600 mb-1.5 uppercase tracking-wide">Admin Identity / Email</label>
              <input 
                type="text" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                placeholder="superadmin@buildroonix.com"
                className={`w-full h-10 px-4 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 ${themeColors.ring} focus:border-transparent bg-gray-50`} 
                required 
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-600 mb-1.5 uppercase tracking-wide">Key / Password</label>
              <div className="relative">
                <input 
                  type={showPass ? 'text' : 'password'} 
                  value={password} 
                  onChange={e => setPassword(e.target.value)} 
                  placeholder="••••••••"
                  className={`w-full h-10 px-4 pr-11 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 ${themeColors.ring} focus:border-transparent bg-gray-50`} 
                  required 
                />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-3 text-gray-400 hover:text-gray-600">
                  {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            {error && <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-xs text-red-600 flex items-center gap-2">⚠️ {error}</div>}
            <button 
              type="submit" 
              disabled={loading}
              className={`w-full h-11 bg-gradient-to-r ${themeColors.btn} text-white rounded-xl font-semibold text-sm transition-all disabled:opacity-60 flex items-center justify-center gap-2 shadow-md`}
            >
              {loading ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Authorizing Access...</> : 'Authenticate →'}
            </button>
          </form>
        </div>

        <p className="text-center text-slate-500 text-[10px] mt-6 flex items-center justify-center gap-1">
          <Shield className="h-3 w-3 text-slate-500" /> Secure Terminal © 2026
        </p>
      </div>
    </div>
  );
}
