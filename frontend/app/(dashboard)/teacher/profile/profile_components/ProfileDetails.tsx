import { Mail, Phone, Calendar, BookOpen, Droplets, Users, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UserProfile } from '../profile_types';

interface Props {
  profile: UserProfile;
}

export function ProfileDetails({ profile }: Props) {
  const details = [
    { label: 'Email', value: profile.email, icon: Mail },
    { label: 'Phone', value: profile.phone, icon: Phone },
    { label: 'Joining Date', value: profile.joiningDate, icon: Calendar },
    { label: 'Highest Qualification', value: profile.qualification, icon: BookOpen },
    { label: 'Blood Group', value: profile.bloodGroup, icon: Droplets },
    { label: 'Gender', value: profile.gender, icon: Users },
    { label: 'Emergency Phone', value: profile.emergencyPhone, icon: AlertCircle },
  ];

  return (
    <Card className="lg:col-span-2 border-[var(--border)] bg-[var(--bg-card)]">
      <CardHeader className="pb-3 border-b border-[var(--border)] mb-4">
        <CardTitle className="text-base text-[var(--text-primary)]">Profile Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {details.map(d => (
            <div key={d.label} className="flex items-start gap-3 p-3 bg-[var(--bg-input)] rounded-xl border border-[var(--border)]">
              <div className="w-8 h-8 rounded-lg bg-[var(--primary-subtle)] flex items-center justify-center flex-shrink-0">
                <d.icon className="h-4 w-4 text-[var(--primary)]" />
              </div>
              <div>
                <p className="text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wide">{d.label}</p>
                <p className="text-sm font-semibold text-[var(--text-primary)] mt-0.5">{d.value}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
