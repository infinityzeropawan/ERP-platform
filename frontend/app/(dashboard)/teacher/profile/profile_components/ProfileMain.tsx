'use client';
import { useProfile } from '../profile_hooks/useProfile';
import { ProfileHeader } from './ProfileHeader';
import { ProfileCard } from './ProfileCard';
import { ProfileDetails } from './ProfileDetails';

export function ProfileMain() {
  const { profile, initials } = useProfile();

  return (
    <div className="space-y-6">
      <ProfileHeader />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ProfileCard profile={profile} initials={initials} />
        <ProfileDetails profile={profile} />
      </div>
    </div>
  );
}
