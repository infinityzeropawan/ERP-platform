'use client';
import { useState } from 'react';
import { Rocket } from 'lucide-react';
import { useAuthLogin } from '../auth_hooks/useAuthLogin';
import { AuthStaffLogin } from './AuthStaffLogin';
import { AuthStudentLogin } from './AuthStudentLogin';
import { LoginTabType } from '../auth_types';

export function AuthLoginForm() {
  const [tab, setTab] = useState<LoginTabType>('staff');
  const [role, setRole] = useState('teacher');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const { error, loading, setError, handleLogin } = useAuthLogin();

  const switchTab = (newTab: LoginTabType) => {
    setTab(newTab);
    setError('');
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const submitRole = tab === 'staff' ? role : 'student';
    handleLogin(email, password, submitRole);
  };

  return (
    <div className="min-h-screen auth-page-bg flex items-center justify-center p-4 transition-all duration-500">
      <div className="w-full max-w-md">
        
        {/* Logo and Branded Title */}
        <div className="text-center mb-6 animate-fade-in">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl auth-logo-bg shadow-2xl mb-3">
            <Rocket className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Buildroonix ERP</h1>
          <p className="auth-text-highlight text-xs mt-1 uppercase tracking-widest font-bold">Multi-Tenant Administration Portal</p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-gray-100">
            <button 
              onClick={() => switchTab('staff')} 
              className={`flex-1 py-3.5 text-sm font-semibold transition-all ${tab === 'staff' ? 'bg-slate-900 text-white' : 'text-gray-500 hover:bg-gray-50'}`}
            >
              Staff Login
            </button>
            <button 
              onClick={() => switchTab('student')} 
              className={`flex-1 py-3.5 text-sm font-semibold transition-all ${tab === 'student' ? 'bg-slate-900 text-white' : 'text-gray-500 hover:bg-gray-50'}`}
            >
              Student Login
            </button>
          </div>

          <div className="p-6">
            {tab === 'staff' ? (
              <AuthStaffLogin 
                email={email} 
                setEmail={setEmail} 
                password={password} 
                setPassword={setPassword} 
                role={role} 
                setRole={setRole} 
                onSubmit={onSubmit} 
                loading={loading} 
                error={error} 
              />
            ) : (
              <AuthStudentLogin 
                email={email} 
                setEmail={setEmail} 
                password={password} 
                setPassword={setPassword} 
                onSubmit={onSubmit} 
                loading={loading} 
                error={error} 
              />
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
