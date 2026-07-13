import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, Edit2, KeyRound, Eye, EyeOff } from 'lucide-react';
import { UserTabType } from '../../admin_hooks/useAdminUsers';
import { studentSchema, teacherSchema, supportStaffSchema } from '../../admin_utils/admin_schemas';

interface AdminUserFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tab: UserTabType;
  defaultValues?: any;
  onSubmit: (data: any) => void;
}

export default function AdminUserForm({ open, onOpenChange, tab, defaultValues, onSubmit }: AdminUserFormProps) {
  const [showPass, setShowPass] = useState(false);

  const schema = tab === 'students' ? studentSchema : tab === 'teachers' ? teacherSchema : supportStaffSchema;

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '', email: '', password: '', phone: '',
      class: 'IOT-2026', section: 'Morning', rollNo: '',
      subject: '', role: 'guard', shift: 'morning', salary: 15000, busNumber: ''
    }
  });

  useEffect(() => {
    if (open) {
      if (defaultValues) {
        reset(defaultValues);
      } else {
        reset({
          name: '', email: '', password: '', phone: '',
          class: 'IOT-2026', section: 'Morning', rollNo: '',
          subject: '', role: 'guard', shift: 'morning', salary: 15000, busNumber: ''
        });
      }
      setShowPass(false);
    }
  }, [open, defaultValues, reset]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]" style={{ backgroundColor: 'var(--admin-bg-card)', borderColor: 'var(--admin-border)' }}>
        <DialogHeader>
          <DialogTitle className="text-base font-bold flex items-center gap-1.5" style={{ color: 'var(--admin-text-primary)' }}>
            {defaultValues ? <Edit2 className="h-4 w-4" style={{ color: 'var(--admin-primary)' }} /> : <Plus className="h-4 w-4" style={{ color: 'var(--admin-success)' }} />}
            {defaultValues ? 'Edit Profile Details' : `Add New ${tab === 'students' ? 'Student' : tab === 'teachers' ? 'Teacher' : 'Support Staff'}`}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4 text-xs font-semibold">
          <div className="space-y-1">
            <label style={{ color: 'var(--admin-text-secondary)' }}>Full Name</label>
            <Input {...register('name')} className="h-9 text-xs" style={{ backgroundColor: 'var(--admin-bg-input)', borderColor: 'var(--admin-border)', color: 'var(--admin-text-primary)' }} />
            {errors.name && <span style={{ color: 'var(--admin-danger)' }}>{errors.name.message as string}</span>}
          </div>
          <div className="space-y-1">
            <label style={{ color: 'var(--admin-text-secondary)' }}>Email Address</label>
            <Input type="email" {...register('email')} className="h-9 text-xs" style={{ backgroundColor: 'var(--admin-bg-input)', borderColor: 'var(--admin-border)', color: 'var(--admin-text-primary)' }} />
            {errors.email && <span style={{ color: 'var(--admin-danger)' }}>{errors.email.message as string}</span>}
          </div>
          <div className="space-y-1">
            <label style={{ color: 'var(--admin-text-secondary)' }}>Phone Number</label>
            <Input {...register('phone')} className="h-9 text-xs" style={{ backgroundColor: 'var(--admin-bg-input)', borderColor: 'var(--admin-border)', color: 'var(--admin-text-primary)' }} />
            {errors.phone && <span style={{ color: 'var(--admin-danger)' }}>{errors.phone.message as string}</span>}
          </div>
          <div className="space-y-1">
            <label className="flex items-center gap-1" style={{ color: 'var(--admin-text-secondary)' }}>
              <KeyRound className="h-3 w-3" style={{ color: 'var(--admin-primary)' }} /> 
              {defaultValues ? 'Reset Password' : 'Set Password'}
              <span className="font-normal" style={{ color: 'var(--admin-text-disabled)' }}>(leave blank for default)</span>
            </label>
            <div className="relative">
              <Input type={showPass ? 'text' : 'password'} {...register('password')} className="h-9 text-xs pr-9" style={{ backgroundColor: 'var(--admin-bg-input)', borderColor: 'var(--admin-border)', color: 'var(--admin-text-primary)' }} />
              <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-2 top-2 hover:opacity-80" style={{ color: 'var(--admin-text-secondary)' }}>
                {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {tab === 'students' && (
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label style={{ color: 'var(--admin-text-secondary)' }}>Class/Batch</label>
                <select {...register('class')} className="w-full h-9 px-2 border rounded-lg text-xs font-semibold focus:outline-none" style={{ backgroundColor: 'var(--admin-bg-input)', borderColor: 'var(--admin-border)', color: 'var(--admin-text-primary)' }}>
                  <option value="IOT-2026">IOT-2026</option>
                  <option value="CS-2026">CS-2026</option>
                  <option value="MECH-2026">MECH-2026</option>
                </select>
              </div>
              <div className="space-y-1">
                <label style={{ color: 'var(--admin-text-secondary)' }}>Section/Slot</label>
                <Input {...register('section')} className="h-9 text-xs" style={{ backgroundColor: 'var(--admin-bg-input)', borderColor: 'var(--admin-border)', color: 'var(--admin-text-primary)' }} />
              </div>
            </div>
          )}

          {tab === 'teachers' && (
            <div className="space-y-1">
              <label style={{ color: 'var(--admin-text-secondary)' }}>Subject Specialization</label>
              <Input {...register('subject')} className="h-9 text-xs" style={{ backgroundColor: 'var(--admin-bg-input)', borderColor: 'var(--admin-border)', color: 'var(--admin-text-primary)' }} />
            </div>
          )}

          {tab === 'support' && (
            <div className="space-y-4 border-t pt-3" style={{ borderColor: 'var(--admin-border)' }}>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold" style={{ color: 'var(--admin-warning)' }}>Staff Role</label>
                  <select {...register('role')} className="w-full h-9 px-2 border rounded-lg text-xs font-semibold focus:outline-none" style={{ backgroundColor: 'var(--admin-bg-input)', borderColor: 'var(--admin-border)', color: 'var(--admin-text-primary)' }}>
                    <option value="guard">Security Guard</option>
                    <option value="driver">Bus Driver</option>
                    <option value="receptionist">Receptionist</option>
                    <option value="cleaner">Cleaner</option>
                    <option value="accountant">Accountant</option>
                    <option value="helper">Lab Helper</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label style={{ color: 'var(--admin-text-secondary)' }}>Shift</label>
                  <select {...register('shift')} className="w-full h-9 px-2 border rounded-lg text-xs font-semibold focus:outline-none" style={{ backgroundColor: 'var(--admin-bg-input)', borderColor: 'var(--admin-border)', color: 'var(--admin-text-primary)' }}>
                    <option value="morning">Morning</option>
                    <option value="evening">Evening</option>
                    <option value="night">Night</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label style={{ color: 'var(--admin-text-secondary)' }}>Basic Monthly Salary (₹)</label>
                  <Input type="number" {...register('salary')} className="h-9 text-xs" style={{ backgroundColor: 'var(--admin-bg-input)', borderColor: 'var(--admin-border)', color: 'var(--admin-text-primary)' }} />
                </div>
                {/* For simplicity we always show bus number, validation will handle it or we could watch the value */}
                <div className="space-y-1">
                  <label style={{ color: 'var(--admin-text-secondary)' }}>Assigned Bus No.</label>
                  <Input {...register('busNumber')} placeholder="BUS-102" className="h-9 text-xs" style={{ backgroundColor: 'var(--admin-bg-input)', borderColor: 'var(--admin-border)', color: 'var(--admin-text-primary)' }} />
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} style={{ borderColor: 'var(--admin-border)', color: 'var(--admin-text-primary)' }}>Cancel</Button>
            <Button type="submit" className="text-white" style={{ backgroundColor: 'var(--admin-primary)' }}>{defaultValues ? 'Save Changes' : 'Save Profile'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
