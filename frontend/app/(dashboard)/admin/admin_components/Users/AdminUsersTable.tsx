import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit2, Trash2, Bus, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { UserTabType } from '../../admin_hooks/useAdminUsers';

interface AdminUsersTableProps {
  users: any[];
  tab: UserTabType;
  onEdit: (user: any) => void;
  onDelete: (id: string) => void;
}

export default function AdminUsersTable({ users, tab, onEdit, onDelete }: AdminUsersTableProps) {
  const [visiblePassId, setVisiblePassId] = useState<string | null>(null);

  const getDefaultPassword = (email: string) => email.split('@')[0] + '123';

  const ROLE_LABELS: Record<string, string> = {
    guard: 'Security Guard',
    driver: 'Bus Driver',
    receptionist: 'Receptionist',
    cleaner: 'Housekeeping/Cleaner',
    accountant: 'Accountant',
    helper: 'Lab Helper'
  };

  return (
    <table className="w-full text-sm">
      <thead style={{ backgroundColor: 'rgba(99,102,241,0.08)' }} className="border-b border-gray-200">
        <tr>
          <th className="text-left px-4 py-3 text-xs font-semibold uppercase" style={{ color: 'var(--admin-text-secondary)' }}>Profile Details</th>
          <th className="text-left px-4 py-3 text-xs font-semibold uppercase" style={{ color: 'var(--admin-text-secondary)' }}>Contact Information</th>
          <th className="text-left px-4 py-3 text-xs font-semibold uppercase" style={{ color: 'var(--admin-text-secondary)' }}>
            {tab === 'students' ? 'Class & Sec' : tab === 'teachers' ? 'Subject Specialization' : 'Staff Role & Shift'}
          </th>
          <th className="text-left px-4 py-3 text-xs font-semibold uppercase" style={{ color: 'var(--admin-text-secondary)' }}>
            {tab === 'support' ? 'Basic Salary' : 'Login Password'}
          </th>
          <th className="text-right px-4 py-3 text-xs font-semibold uppercase" style={{ color: 'var(--admin-text-secondary)' }}>Actions</th>
        </tr>
      </thead>
      <tbody>
        {users.map(u => (
          <tr key={u.id} className="border-b transition-colors cursor-pointer" 
              style={{ borderColor: 'var(--admin-border)' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(99,102,241,0.06)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              onClick={() => onEdit(u)}
          >
            <td className="px-4 py-3.5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
                     style={{ backgroundColor: tab === 'students' ? 'var(--admin-success)' : tab === 'teachers' ? 'var(--admin-primary)' : 'var(--admin-warning)' }}>
                  {u.name?.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                </div>
                <div>
                  <span className="font-semibold block text-xs" style={{ color: 'var(--admin-text-primary)' }}>{u.name}</span>
                  {tab === 'students' && <span className="text-[10px] font-mono" style={{ color: 'var(--admin-text-secondary)' }}>Roll: {u.rollNo}</span>}
                  {tab === 'support' && <span className="text-[10px]" style={{ color: 'var(--admin-text-secondary)' }}>Joined: {u.joiningDate}</span>}
                </div>
              </div>
            </td>
            <td className="px-4 py-3.5">
              <span className="text-xs block" style={{ color: 'var(--admin-text-primary)' }}>{u.email}</span>
              <span className="text-[10px] block" style={{ color: 'var(--admin-text-secondary)' }}>{u.phone}</span>
            </td>
            <td className="px-4 py-3.5">
              {tab === 'students' && (
                <Badge variant="info" className="text-[10px]" style={{ backgroundColor: 'var(--admin-info-bg)', color: 'var(--admin-info)' }}>{u.class}</Badge>
              )}
              {tab === 'teachers' && (
                <span className="font-medium text-xs" style={{ color: 'var(--admin-text-secondary)' }}>{u.subject}</span>
              )}
              {tab === 'support' && (
                <div className="space-y-1">
                  <Badge variant="default" className="text-[9px] border-0" style={{ backgroundColor: 'var(--admin-warning)', color: 'white' }}>{ROLE_LABELS[u.role] || u.role}</Badge>
                  <div className="flex items-center gap-1 text-[10px]" style={{ color: 'var(--admin-text-secondary)' }}>
                    <span>Shift: {u.shift}</span>
                    {u.busNumber && <span className="flex items-center gap-0.5" style={{ color: 'var(--admin-success)' }}><Bus className="h-2.5 w-2.5" />{u.busNumber}</span>}
                  </div>
                </div>
              )}
            </td>
            <td className="px-4 py-3.5">
              {tab === 'support' ? (
                <span className="font-bold text-xs" style={{ color: 'var(--admin-text-primary)' }}>
                  ₹{u.salary?.toLocaleString('en-IN')}
                </span>
              ) : (
                <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                  <span className="font-mono text-xs px-2 py-0.5 rounded" style={{ backgroundColor: 'var(--admin-bg-input)', color: 'var(--admin-text-primary)' }}>
                    {visiblePassId === u.id ? getDefaultPassword(u.email) : '••••••••'}
                  </span>
                  <button onClick={() => setVisiblePassId(visiblePassId === u.id ? null : u.id)} className="hover:opacity-80" style={{ color: 'var(--admin-text-secondary)' }}>
                    {visiblePassId === u.id ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                  </button>
                </div>
              )}
            </td>
            <td className="px-4 py-3.5 text-right">
              <div className="flex gap-1 justify-end" onClick={(e) => e.stopPropagation()}>
                <Button size="sm" variant="outline" onClick={() => onEdit(u)} className="h-7 w-7 p-0" style={{ borderColor: 'var(--admin-border)' }}>
                  <Edit2 className="h-3.5 w-3.5" style={{ color: 'var(--admin-text-secondary)' }} />
                </Button>
                <Button size="sm" variant="destructive" onClick={() => onDelete(u.id)} className="h-7 w-7 p-0 border-0" style={{ backgroundColor: 'var(--admin-danger-bg)' }}>
                  <Trash2 className="h-3.5 w-3.5" style={{ color: 'var(--admin-danger)' }} />
                </Button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
