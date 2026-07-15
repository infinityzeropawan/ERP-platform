'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Rocket, User, Mail, Phone, Calendar, MapPin, ChevronLeft, Landmark } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '', email: '', phone: '', dob: '', gender: 'male', fatherName: '', motherName: '',
    address: '', bloodGroup: 'O+', class: '', section: '', password: '', confirmPassword: '', institutionCode: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const set = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }));

  const validate1 = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.email.includes('@')) e.email = 'Valid email required';
    if (form.phone.length < 10) e.phone = 'Valid phone required';
    if (!form.dob) e.dob = 'Date of birth required';
    if (!form.gender) e.gender = 'Gender required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validate2 = () => {
    const e: Record<string, string> = {};
    if (!form.institutionCode.trim()) e.institutionCode = 'Institution Code is required';
    if (!form.fatherName.trim()) e.fatherName = 'Required';
    if (!form.address.trim()) e.address = 'Required';
    if (!form.class) e.class = 'Required';
    if (form.password.length < 6) e.password = 'Min 6 characters';
    if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate2()) return;
    setLoading(true);

    try {
      const res = await fetch('/api/v1/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to submit registration');

      if (data.studentId) {
        alert(`Registration successful! Your Student ID is: ${data.studentId}\nPlease save this ID for your records.`);
      }
      router.push('/pending');
    } catch (err: any) {
      alert(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const Field = ({ label, name, type = 'text', placeholder, icon: Icon }: { label: string; name: string; type?: string; placeholder: string; icon: React.ElementType }) => (
    <div key={name}>
      <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">{label}</label>
      <div className="relative">
        <Icon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <input type={type} value={form[name as keyof typeof form]} onChange={e => set(name, e.target.value)} placeholder={placeholder}
          className={`w-full h-11 pl-10 pr-4 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-gray-50 ${errors[name] ? 'border-red-300' : 'border-gray-200'}`} />
      </div>
      {errors[name] && <p className="text-xs text-red-500 mt-1">{errors[name]}</p>}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-teal-950 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-400 to-teal-600 shadow-2xl mb-3">
            <Rocket className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Student Registration</h1>
          <p className="text-teal-300 text-sm mt-1">Buildroonix — Smart School ERP</p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Step indicator */}
          <div className="flex border-b border-gray-100">
            {[1, 2].map(s => (
              <div key={s} className={`flex-1 py-3 text-center text-sm font-semibold transition-all ${step === s ? 'bg-teal-600 text-white' : step > s ? 'bg-teal-100 text-teal-700' : 'text-gray-400'}`}>
                Step {s}: {s === 1 ? 'Personal Info' : 'Academic & Security'}
              </div>
            ))}
          </div>

          <div className="p-8">
            {step === 1 ? (
              <div className="space-y-4">
                {Field({ label: "Full Name", name: "name", placeholder: "Enter your full name", icon: User })}
                {Field({ label: "Email Address", name: "email", type: "email", placeholder: "your@email.com", icon: Mail })}
                {Field({ label: "Phone Number", name: "phone", placeholder: "10-digit mobile number", icon: Phone })}
                {Field({ label: "Date of Birth", name: "dob", type: "date", placeholder: "", icon: Calendar })}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Gender</label>
                  <select value={form.gender} onChange={e => set('gender', e.target.value)}
                    className={`w-full h-11 px-4 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-gray-50 ${errors.gender ? 'border-red-300' : 'border-gray-200'}`}>
                    <option value="">Select gender</option>
                    <option>Male</option><option>Female</option><option>Other</option>
                  </select>
                  {errors.gender && <p className="text-xs text-red-500 mt-1">{errors.gender}</p>}
                </div>
                <button type="button" onClick={() => validate1() && setStep(2)}
                  className="w-full h-11 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-xl font-semibold text-sm hover:from-teal-600 hover:to-teal-700 transition-all shadow-lg mt-2">
                  Next Step →
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {Field({ label: "5-Letter Institution Code *", name: "institutionCode", placeholder: "e.g. A7X9K", icon: Landmark })}
                {Field({ label: "Father's Name", name: "fatherName", placeholder: "Father's full name", icon: User })}
                {Field({ label: "Mother's Name", name: "motherName", placeholder: "Mother's full name", icon: User })}
                {Field({ label: "Address", name: "address", placeholder: "Full residential address", icon: MapPin })}
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Blood Group</label>
                    <select value={form.bloodGroup} onChange={e => set('bloodGroup', e.target.value)}
                      className="w-full h-11 px-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-gray-50">
                      <option value="">Select</option>
                      {['A+','A-','B+','B-','O+','O-','AB+','AB-'].map(g => <option key={g}>{g}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Class</label>
                    <input type="text" value={form.class} onChange={e => set('class', e.target.value)} placeholder="e.g. 10th"
                      className={`w-full h-11 px-3 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-gray-50 ${errors.class ? 'border-red-300' : 'border-gray-200'}`} />
                    {errors.class && <p className="text-xs text-red-500 mt-1">{errors.class}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Section</label>
                    <input type="text" value={form.section} onChange={e => set('section', e.target.value)} placeholder="e.g. A"
                      className="w-full h-11 px-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-gray-50" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Password</label>
                  <input type="password" value={form.password} onChange={e => set('password', e.target.value)} placeholder="Min 6 characters"
                    className={`w-full h-11 px-4 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-gray-50 ${errors.password ? 'border-red-300' : 'border-gray-200'}`} />
                  {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Confirm Password</label>
                  <input type="password" value={form.confirmPassword} onChange={e => set('confirmPassword', e.target.value)} placeholder="Re-enter password"
                    className={`w-full h-11 px-4 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-gray-50 ${errors.confirmPassword ? 'border-red-300' : 'border-gray-200'}`} />
                  {errors.confirmPassword && <p className="text-xs text-red-500 mt-1">{errors.confirmPassword}</p>}
                </div>
                <div className="flex gap-3 mt-4">
                  <button type="button" onClick={() => setStep(1)}
                    className="flex-1 h-11 border border-gray-200 text-gray-600 rounded-xl font-semibold text-sm hover:bg-gray-50 transition-all flex items-center justify-center gap-2">
                    <ChevronLeft className="h-4 w-4" /> Back
                  </button>
                  <button type="submit" disabled={loading}
                    className="flex-1 h-11 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-xl font-semibold text-sm hover:from-teal-600 hover:to-teal-700 transition-all disabled:opacity-60 flex items-center justify-center gap-2 shadow-lg">
                    {loading ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Submitting...</> : 'Submit Registration'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        <div className="text-center mt-4">
          <p className="text-slate-400 text-xs">
            Already registered? <a href="/login" className="text-teal-400 hover:underline">Sign in here</a>
          </p>
        </div>
      </div>
    </div>
  );
}
