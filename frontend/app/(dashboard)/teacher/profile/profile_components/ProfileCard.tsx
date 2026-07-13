import { Mail, Phone } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { UserProfile } from '../profile_types';

interface Props {
  profile: UserProfile;
  initials: string;
}

export function ProfileCard({ profile, initials }: Props) {
  return (
    <Card className="lg:col-span-1 border-[var(--border)] bg-[var(--bg-card)]">
      <CardContent className="p-6 flex flex-col items-center text-center">
        <div className="w-24 h-24 rounded-full bg-[var(--primary)] flex items-center justify-center text-white text-3xl font-bold shadow-lg mb-4">
          {initials}
        </div>
        <h2 className="text-xl font-bold text-[var(--text-primary)]">{profile.name}</h2>
        <Badge variant="default" className="mt-2 capitalize bg-[var(--bg-input)] text-[var(--text-primary)] border border-[var(--border)] hover:bg-[var(--bg-card)]">{profile.role}</Badge>
        <div className="mt-4 w-full space-y-2">
          <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)] bg-[var(--bg-input)] rounded-lg p-2.5 border border-[var(--border)]">
            <Mail className="h-4 w-4 text-[var(--primary)] flex-shrink-0" />
            <span className="truncate">{profile.email}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)] bg-[var(--bg-input)] rounded-lg p-2.5 border border-[var(--border)]">
            <Phone className="h-4 w-4 text-[var(--primary)] flex-shrink-0" />
            <span>{profile.phone}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
