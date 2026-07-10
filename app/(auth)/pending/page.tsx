'use client';
import { Rocket, Clock, CheckCircle, Mail, Phone } from 'lucide-react';

export default function PendingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-teal-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md text-center">
        <div className="bg-white rounded-2xl shadow-2xl p-10">
          <div className="w-20 h-20 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-6">
            <Clock className="h-10 w-10 text-amber-500 animate-pulse" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Registration Submitted!</h1>
          <p className="text-gray-500 text-sm mb-6">Your registration is under review. The admin will approve your account within 24–48 hours.</p>

          <div className="space-y-3 mb-8">
            {[
              { icon: CheckCircle, text: 'Registration form submitted', done: true },
              { icon: Clock, text: 'Admin review in progress', done: false },
              { icon: CheckCircle, text: 'Account activation & class assignment', done: false },
            ].map((step, i) => (
              <div key={i} className={`flex items-center gap-3 p-3 rounded-xl ${step.done ? 'bg-green-50 border border-green-100' : 'bg-gray-50 border border-gray-100'}`}>
                <step.icon className={`h-5 w-5 ${step.done ? 'text-green-500' : 'text-gray-300'}`} />
                <span className={`text-sm ${step.done ? 'text-green-700 font-medium' : 'text-gray-400'}`}>{step.text}</span>
              </div>
            ))}
          </div>

          <div className="bg-teal-50 rounded-xl p-4 mb-6 text-left">
            <p className="text-xs font-semibold text-teal-700 mb-2">Need help? Contact us:</p>
            <p className="text-xs text-teal-600 flex items-center gap-2"><Mail className="h-3 w-3" /> pawankrdubey36@gmail.com</p>
            <p className="text-xs text-teal-600 flex items-center gap-2 mt-1"><Phone className="h-3 w-3" /> +91 9580181697</p>
          </div>

          <a href="/login" className="block w-full py-3 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-xl font-semibold text-sm hover:from-teal-600 hover:to-teal-700 transition-all shadow-lg">
            Back to Login
          </a>
        </div>
        <p className="text-slate-400 text-xs mt-4 flex items-center justify-center gap-1">
          <Rocket className="h-3 w-3 text-teal-400" /> Powered by Buildroonix © 2026
        </p>
      </div>
    </div>
  );
}
