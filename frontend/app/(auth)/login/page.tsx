'use client';
import { useState } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { Rocket, Eye, EyeOff, Shield, School, BookOpen } from 'lucide-react';

const themeColors = {
  bg: 'from-slate-900 via-slate-800 to-teal-900',
  logo: 'from-teal-400 to-teal-600',
  btn: 'from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 hover:shadow-teal-200',
  text: 'text-teal-300',
  ring: 'focus:ring-teal-500',
  badge: 'bg-teal-50 text-teal-800 border-teal-200'
};

export default function LoginPage() {
  const [tab, setTab] = useState<'staff' | 'student'>('staff');
  const [role, setRole] = useState('teacher');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();

  const handleStaffLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); 
    setLoading(true);
    
    try {
      const res = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password, role: tab === 'staff' ? role : 'student' })
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
        // Fetch active institution details to display in frontend pages
        const instRes = await fetch('/api/v1/admin/my-institution', {
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

  return (
    <div className={`min-h-screen bg-gradient-to-br ${themeColors.bg} flex items-center justify-center p-4 transition-all duration-500`}>
      <div className="w-full max-w-md">
        
        {/* Logo and Branded Title */}
        <div className="text-center mb-6 animate-fade-in">
          <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${themeColors.logo} shadow-2xl mb-3`}>
            <Rocket className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Buildroonix ERP</h1>
          <p className={`${themeColors.text} text-xs mt-1 uppercase tracking-widest font-bold`}>Multi-Tenant Administration Portal</p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-gray-100">
            <button onClick={() => { setTab('staff'); setError(''); }} className={`flex-1 py-3.5 text-sm font-semibold transition-all ${tab === 'staff' ? 'bg-slate-900 text-white' : 'text-gray-500 hover:bg-gray-50'}`}>
              Staff Login
            </button>
            <button onClick={() => { setTab('student'); setError(''); }} className={`flex-1 py-3.5 text-sm font-semibold transition-all ${tab === 'student' ? 'bg-slate-900 text-white' : 'text-gray-500 hover:bg-gray-50'}`}>
              Student Login
            </button>
          </div>

          <div className="p-6">
            {tab === 'staff' ? (
              <form onSubmit={handleStaffLogin} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-gray-600 mb-1.5 uppercase tracking-wide">Staff Role</label>
                  <select
                    value={role}
                    onChange={e => setRole(e.target.value)}
                    className={`w-full h-10 px-4 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 ${themeColors.ring} focus:border-transparent bg-gray-50`}
                  >
                    <option value="teacher">Teacher / Instructor</option>
                    <option value="school_admin">Institution Admin</option>
                    <option value="superadmin">Super Administrator</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-600 mb-1.5 uppercase tracking-wide">Email Address</label>
                  <input 
                    type="text" 
                    value={email} 
                    onChange={e => setEmail(e.target.value)} 
                    placeholder="name@buildroonix.com"
                    className={`w-full h-10 px-4 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 ${themeColors.ring} focus:border-transparent bg-gray-50`} 
                    required 
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-600 mb-1.5 uppercase tracking-wide">Password</label>
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
                  {loading ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Signing in...</> : 'Sign In →'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleStaffLogin} className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-xs text-blue-700 flex items-center gap-2">
                  🎓 Students use the same login form. Enter your email and password below.
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-600 mb-1.5 uppercase tracking-wide">Email Address</label>
                  <input
                    type="text"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="student@school.com"
                    className={`w-full h-10 px-4 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 ${themeColors.ring} focus:border-transparent bg-gray-50`}
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-600 mb-1.5 uppercase tracking-wide">Password</label>
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
                  {loading ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Signing in...</> : 'Sign In →'}
                </button>
                
                {tab === 'student' && (
                  <div className="text-center mt-3">
                    <p className="text-xs text-gray-500">
                      New student?{' '}
                      <a href="/register" className={`font-semibold ${themeColors.text} hover:underline`}>
                        Apply for Admission
                      </a>
                    </p>
                  </div>
                )}
              </form>
            )}
          </div>
        </div>

        <p className="text-center text-slate-400 text-[10px] mt-6 flex items-center justify-center gap-1">
          <Rocket className="h-3 w-3 text-slate-400" /> Powered by Buildroonix © 2026
        </p>
      </div>
    </div>
  );
}
