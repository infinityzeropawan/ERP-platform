'use client';

import { useState } from 'react';
import { useAdminUsers, UserTabType } from '../../admin_hooks/useAdminUsers';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Users, Search, Plus, GraduationCap, BookOpen, ShieldCheck } from 'lucide-react';
import AdminUsersTable from './AdminUsersTable';
import AdminUserForm from './AdminUserForm';
import '../../admin.css';

export default function AdminUsersClient() {
  const [tab, setTab] = useState<UserTabType>('students');
  const [search, setSearch] = useState('');
  const { usersData, loading, addUser, editUser, deleteUser } = useAdminUsers(tab);

  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  const filteredUsers = usersData.filter(u => 
    u.name?.toLowerCase().includes(search.toLowerCase()) || 
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddSubmit = async (data: any) => {
    try {
      await addUser(data);
      alert('Profile created successfully!');
      setAddOpen(false);
    } catch (err: any) {
      alert(err.message || 'Failed to create profile');
    }
  };

  const handleEditSubmit = async (data: any) => {
    try {
      await editUser(selectedUser.id, data);
      alert('Profile updated successfully!');
      setEditOpen(false);
      setSelectedUser(null);
    } catch (err: any) {
      alert(err.message || 'Failed to update profile');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to remove this profile?')) {
      try {
        await deleteUser(id);
        alert('Profile deleted successfully!');
      } catch (err: any) {
        alert(err.message || 'Failed to delete profile');
      }
    }
  };

  const openEditDialog = (user: any) => {
    setSelectedUser(user);
    setEditOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2" style={{ color: 'var(--admin-text-primary)' }}>
            <Users className="h-6 w-6" style={{ color: 'var(--admin-primary)' }} />
            Manage Directory
          </h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--admin-text-secondary)' }}>
            Manage students, teachers, and supporting staff members
          </p>
        </div>
        <Button 
          onClick={() => setAddOpen(true)} 
          className="text-white flex items-center gap-2" 
          style={{ backgroundColor: 'var(--admin-primary)' }}
        >
          <Plus className="h-4 w-4" /> Add Profile
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b" style={{ borderColor: 'var(--admin-border)' }}>
        {[
          { key: 'students', label: 'Students', icon: GraduationCap },
          { key: 'teachers', label: 'Teachers', icon: BookOpen },
          { key: 'support', label: 'Support Staff', icon: ShieldCheck }
        ].map(t => (
          <button
            key={t.key}
            onClick={() => { setTab(t.key as UserTabType); setSearch(''); }}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors ${tab === t.key ? 'border-b-[var(--admin-primary)] text-[var(--admin-primary)]' : 'border-transparent text-[var(--admin-text-secondary)] hover:text-[var(--admin-text-primary)]'}`}
            style={{ 
               borderColor: tab === t.key ? 'var(--admin-primary)' : 'transparent',
               color: tab === t.key ? 'var(--admin-primary)' : 'var(--admin-text-secondary)'
            }}
          >
            <t.icon className="h-4 w-4" />{t.label}
          </button>
        ))}
      </div>

      <div className="relative w-64">
        <Search className="absolute left-3 top-2.5 h-3.5 w-3.5" style={{ color: 'var(--admin-text-secondary)' }} />
        <Input 
          placeholder="Search records..." 
          value={search} 
          onChange={e => setSearch(e.target.value)} 
          className="pl-8 text-xs h-9" 
          style={{ backgroundColor: 'var(--admin-bg-input)', borderColor: 'var(--admin-border)', color: 'var(--admin-text-primary)' }}
        />
      </div>

      <Card style={{ backgroundColor: 'var(--admin-bg-card)', borderColor: 'var(--admin-border)' }}>
        <CardContent className="p-0">
          <AdminUsersTable 
            users={filteredUsers} 
            tab={tab} 
            onEdit={openEditDialog} 
            onDelete={handleDelete} 
          />
        </CardContent>
      </Card>

      {/* Forms */}
      <AdminUserForm 
        open={addOpen} 
        onOpenChange={setAddOpen} 
        tab={tab} 
        onSubmit={handleAddSubmit} 
      />
      
      {selectedUser && (
        <AdminUserForm 
          open={editOpen} 
          onOpenChange={setEditOpen} 
          tab={tab} 
          defaultValues={selectedUser} 
          onSubmit={handleEditSubmit} 
        />
      )}
    </div>
  );
}
