import { User } from 'lucide-react';

export function ProfileHeader() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-[var(--text-primary)] flex items-center gap-2">
        <User className="h-6 w-6 text-[var(--primary)]" />My Profile Details
      </h1>
      <p className="text-[var(--text-secondary)] text-sm mt-0.5">Your personal and professional information</p>
    </div>
  );
}
