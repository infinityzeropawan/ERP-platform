'use client';
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

interface AuthStudentLoginProps {
  email: string;
  setEmail: (val: string) => void;
  password: string;
  setPassword: (val: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  loading: boolean;
  error: string;
}

export function AuthStudentLogin({
  email, setEmail, password, setPassword, onSubmit, loading, error
}: AuthStudentLoginProps) {
  const [showPass, setShowPass] = useState(false);

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-xs text-blue-700 flex items-center gap-2">
        🎓 Students use the same login form. Enter your email and password below.
      </div>
      <div>
        <label className="block text-[10px] font-bold text-gray-600 mb-1.5 uppercase tracking-wide">Email Address</label>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="student@school.com"
          className="w-full h-10 px-4 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 auth-focus-ring bg-gray-50"
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
            className="w-full h-10 px-4 pr-11 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 auth-focus-ring bg-gray-50"
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
        className="w-full h-11 auth-btn-bg text-white rounded-xl font-semibold text-sm transition-all disabled:opacity-60 flex items-center justify-center gap-2 shadow-md"
      >
        {loading ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Signing in...</> : 'Sign In →'}
      </button>
    </form>
  );
}
