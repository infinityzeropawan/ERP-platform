'use client';

import { User, Mail, Phone, Calendar, BookOpen, Users, Hash, MapPin, Bus, GraduationCap, Heart, Home } from 'lucide-react';
import { useProfile } from @/app/(dashboard)/student/profile/profile_hooks/useProfile;
import '../../student.css';

export default function ProfileClient() {
  const { user, teachers, initials } = useProfile();

  const Section = ({ title, icon: Icon, children }: { title: string; icon: React.ElementType; children: React.ReactNode }) => (
    <div className="rounded-2xl border shadow-sm overflow-hidden" style={{ backgroundColor: 'var(--student-bg-card)', borderColor: 'var(--student-border)' }}>
      <div className="flex items-center gap-2 px-5 py-4 border-b" style={{ borderColor: 'var(--student-border)', backgroundColor: 'var(--student-bg-hover)' }}>
        <Icon className="h-5 w-5" style={{ color: 'var(--student-primary)' }} />
        <h3 className="text-base font-bold" style={{ color: 'var(--student-text-primary)' }}>{title}</h3>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );

  const Field = ({ label, value, icon: Icon, highlight }: { label: string; value?: string | null; icon: React.ElementType; highlight?: boolean }) => (
    <div className="flex items-start gap-4 p-4 rounded-xl transition-colors"
         style={{ backgroundColor: highlight ? 'var(--student-primary-subtle)' : 'var(--student-bg-hover)', border: highlight ? '1px solid var(--student-primary)' : '1px solid transparent' }}>
      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm border"
           style={{ backgroundColor: highlight ? 'var(--student-primary)' : 'var(--student-bg-card)', borderColor: highlight ? 'transparent' : 'var(--student-border)' }}>
        <Icon className="h-5 w-5" style={{ color: highlight ? 'white' : 'var(--student-text-secondary)' }} />
      </div>
      <div>
        <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: 'var(--student-text-disabled)' }}>{label}</p>
        <p className="text-sm font-semibold" style={{ color: highlight ? 'var(--student-primary)' : 'var(--student-text-primary)' }}>{value || '—'}</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="animate-fade-in">
        <h1 className="text-2xl font-bold flex items-center gap-2" style={{ color: 'var(--student-text-primary)' }}>
          <User className="h-6 w-6" style={{ color: 'var(--student-primary)' }} />My Profile
        </h1>
        <p className="text-sm mt-0.5" style={{ color: 'var(--student-text-secondary)' }}>View your complete student profile</p>
      </div>

      <div className="rounded-3xl p-8 text-white shadow-lg animate-fade-in-up flex items-center gap-6 bg-gradient-to-br from-[#4f46e5] to-[#7c3aed]"
           style={{ background: 'linear-gradient(135deg, var(--student-primary) 0%, #3a32a8 100%)' }}>
        <div className="w-24 h-24 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-4xl font-bold shadow-inner border-2 border-white/30 flex-shrink-0">
          {initials}
        </div>
        <div className="flex-1">
          <h2 className="text-3xl font-bold mb-1">{user?.name}</h2>
          <p className="text-white/80 font-medium text-sm mb-3 opacity-90">{user?.class} · {user?.section} Section</p>
          <div className="flex flex-wrap gap-2">
            {user?.rollNo && <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-bold shadow-sm backdrop-blur-sm border border-white/20">Roll No: {user.rollNo}</span>}
            {user?.busNumber && <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-bold shadow-sm backdrop-blur-sm border border-white/20">Bus: {user.busNumber}</span>}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in-up delay-100">
        <Section title="Personal Information" icon={User}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Full Name" value={user?.name} icon={User} />
            <Field label="Date of Birth" value={user?.dob} icon={Calendar} />
            <Field label="Gender" value={user?.gender} icon={Users} />
            <Field label="Email" value={user?.email} icon={Mail} />
            <Field label="Phone" value={user?.phone} icon={Phone} />
          </div>
        </Section>

        <Section title="Academic Information" icon={GraduationCap}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Class" value={user?.class} icon={BookOpen} highlight />
            <Field label="Section" value={user?.section} icon={Users} />
            <Field label="Roll Number" value={user?.rollNo} icon={Hash} highlight />
            <Field label="Admission Date" value={user?.admissionDate} icon={Calendar} />
          </div>
        </Section>

        {(user?.busNumber || user?.busRoute) && (
          <Section title="Transport Information" icon={Bus}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Bus Number" value={user?.busNumber} icon={Bus} highlight />
              <Field label="Bus Route" value={user?.busRoute} icon={MapPin} highlight />
            </div>
          </Section>
        )}

        <Section title="Family Information" icon={Heart}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Father's Name" value={user?.fatherName} icon={User} />
            <Field label="Mother's Name" value={user?.motherName} icon={User} />
            <div className="sm:col-span-2">
              <Field label="Address" value={user?.address} icon={Home} />
            </div>
          </div>
        </Section>
      </div>

      {teachers.length > 0 && (
        <div className="animate-fade-in-up delay-200">
          <Section title="My Teachers" icon={GraduationCap}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {teachers.map(t => (
                <div key={t.id} className="flex items-center gap-4 p-4 rounded-xl border transition-shadow hover:shadow-md"
                     style={{ backgroundColor: 'var(--student-primary-subtle)', borderColor: 'var(--student-primary)' }}>
                  <div className="w-12 h-12 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0 shadow-sm"
                       style={{ backgroundColor: 'var(--student-primary)' }}>
                    {t.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-bold" style={{ color: 'var(--student-text-primary)' }}>{t.name}</p>
                    <p className="text-xs font-semibold mt-0.5" style={{ color: 'var(--student-primary)' }}>{t.subject}</p>
                    <p className="text-[10px] uppercase tracking-wide mt-1" style={{ color: 'var(--student-text-disabled)' }}>{t.qualification}</p>
                  </div>
                </div>
              ))}
            </div>
          </Section>
        </div>
      )}
    </div>
  );
}
