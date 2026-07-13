'use client';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useAuth } from '@/lib/AuthContext';
import { type SupportStaff } from '@/lib/types';
import { Users, Search, Plus, GraduationCap, BookOpen, Shield, Trash2, Edit2, ShieldAlert, Bus, ShieldCheck, Eye, EyeOff, KeyRound } from 'lucide-react';

export default function AdminUsersPage() {
  const { token } = useAuth();
  const [tab, setTab] = useState<'students' | 'teachers' | 'support'>('students');
  const [search, setSearch] = useState('');
  
  // Lists state
  const [students, setStudents] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [supportStaff, setSupportStaff] = useState<any[]>([]);

  // Dialog State
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    class: 'IOT-2026',
    section: 'Morning',
    rollNo: '',
    subject: '',
    role: 'guard' as SupportStaff['role'],
    salary: 15000,
    shift: 'morning' as SupportStaff['shift'],
    busNumber: ''
  });
  const [showPass, setShowPass] = useState(false);
  const [visiblePassId, setVisiblePassId] = useState<string | null>(null);

  const getDefaultPassword = (email: string) => email.split('@')[0] + '123';

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      phone: '',
      class: 'IOT-2026',
      section: 'Morning',
      rollNo: '',
      subject: '',
      role: 'guard',
      salary: 15000,
      shift: 'morning',
      busNumber: ''
    });
    setShowPass(false);
  };

  const fetchUsers = async () => {
    if (!token) return;
    try {
      const res = await fetch(`/api/v1/admin/users?role=${tab === 'support' ? 'support' : tab === 'teachers' ? 'teacher' : 'student'}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        if (tab === 'students') setStudents(data);
        else if (tab === 'teachers') setTeachers(data);
        else if (tab === 'support') setSupportStaff(data);
      }
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [token, tab]);

  const handleAddUser = async () => {
    if (!formData.name || !formData.email) return;

    try {
      const res = await fetch('/api/v1/admin/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          role: tab === 'support' ? 'support' : tab === 'teachers' ? 'teacher' : 'student',
          name: formData.name,
          email: formData.email,
          password: formData.password || undefined,
          phone: formData.phone,
          class: formData.class,
          section: formData.section,
          rollNo: formData.rollNo,
          subject: formData.subject,
          supportRole: formData.role,
          salary: formData.salary,
          shift: formData.shift,
          busNumber: formData.busNumber
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to create profile');

      alert('Profile created successfully!');
      fetchUsers();
      setAddOpen(false);
      resetForm();
    } catch (err: any) {
      alert(err.message || 'Failed to create profile');
    }
  };

  const handleEditUser = async () => {
    if (!selectedUser) return;

    try {
      const res = await fetch(`/api/v1/admin/users/${selectedUser.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          role: tab === 'support' ? 'support' : tab === 'teachers' ? 'teacher' : 'student',
          name: formData.name,
          email: formData.email,
          password: formData.password || undefined,
          phone: formData.phone,
          class: formData.class,
          section: formData.section,
          rollNo: formData.rollNo,
          subject: formData.subject,
          supportRole: formData.role,
          salary: formData.salary,
          shift: formData.shift,
          busNumber: formData.busNumber
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to update profile');

      alert('Profile updated successfully!');
      fetchUsers();
      setEditOpen(false);
      setSelectedUser(null);
      resetForm();
    } catch (err: any) {
      alert(err.message || 'Failed to update profile');
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (confirm('Are you sure you want to remove this profile?')) {
      try {
        const res = await fetch(`/api/v1/admin/users/${id}?role=${tab === 'support' ? 'support' : tab === 'teachers' ? 'teacher' : 'student'}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to delete profile');

        alert('Profile deleted successfully!');
        fetchUsers();
      } catch (err: any) {
        alert(err.message || 'Failed to delete profile');
      }
    }
  };

  const openEditDialog = (user: any) => {
    setSelectedUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      password: '',
      phone: user.phone || '',
      class: user.class || 'IOT-2026',
      section: user.section || 'Morning',
      rollNo: user.rollNo || '',
      subject: user.qualification || user.role || '',
      role: user.role || 'guard',
      salary: user.salary || 15000,
      shift: user.shift || 'morning',
      busNumber: user.busNumber || ''
    });
    setShowPass(false);
    setEditOpen(true);
  };

  const filteredStudents = students.filter(s => s.name.toLowerCase().includes(search.toLowerCase()) || s.email.toLowerCase().includes(search.toLowerCase()));
  const filteredTeachers = teachers.filter(t => t.name.toLowerCase().includes(search.toLowerCase()) || t.email.toLowerCase().includes(search.toLowerCase()));
  const filteredSupport = supportStaff.filter(s => s.name.toLowerCase().includes(search.toLowerCase()) || s.email.toLowerCase().includes(search.toLowerCase()));

  const ROLE_LABELS: Record<string, string> = {
    guard: 'Security Guard',
    driver: 'Bus Driver',
    receptionist: 'Receptionist',
    cleaner: 'Housekeeping/Cleaner',
    accountant: 'Accountant',
    helper: 'Lab Helper'
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2"><Users className="h-6 w-6 text-teal-600" />Manage Directory</h1>
          <p className="text-gray-500 text-sm mt-0.5">Manage students, teachers, and supporting staff members</p>
        </div>
        <Button onClick={() => { resetForm(); setAddOpen(true); }} className="bg-teal-600 hover:bg-teal-700 text-white flex items-center gap-2">
          <Plus className="h-4 w-4" /> Add Profile
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        {[
          { key: 'students', label: 'Students', icon: GraduationCap, count: students.length },
          { key: 'teachers', label: 'Teachers', icon: BookOpen, count: teachers.length },
          { key: 'support', label: 'Support Staff', icon: ShieldCheck, count: supportStaff.length }
        ].map(t => (
          <button
            key={t.key}
            onClick={() => { setTab(t.key as any); setSearch(''); }}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors ${tab === t.key ? 'border-teal-600 text-teal-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          >
            <t.icon className="h-4 w-4" />{t.label}
            <span className={`px-1.5 py-0.5 rounded-full text-xs ${tab === t.key ? 'bg-teal-100 text-teal-700' : 'bg-gray-100 text-gray-500'}`}>{t.count}</span>
          </button>
        ))}
      </div>

      <div className="relative w-64">
        <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-gray-400" />
        <Input placeholder="Search records..." value={search} onChange={e => setSearch(e.target.value)} className="pl-8 text-xs h-9" />
      </div>

      <Card>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Profile Details</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Contact Information</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">
                  {tab === 'students' ? 'Class & Sec' : tab === 'teachers' ? 'Subject Specialization' : 'Staff Role & Shift'}
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">
                  {tab === 'support' ? 'Basic Salary' : 'Login Password'}
                </th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {/* Students Tab */}
              {tab === 'students' && filteredStudents.map(s => (
                <tr key={s.id} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-white text-xs font-bold">
                        {s.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                      </div>
                      <div>
                        <span className="font-semibold text-gray-900 block text-xs">{s.name}</span>
                        <span className="text-[10px] text-gray-400 font-mono">Roll: {s.rollNo}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="text-gray-700 text-xs block">{s.email}</span>
                    <span className="text-[10px] text-gray-400 block">{s.phone}</span>
                  </td>
                  <td className="px-4 py-3.5"><Badge variant="info" className="text-[10px]">{s.class}</Badge></td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-xs text-gray-700 bg-gray-100 px-2 py-0.5 rounded">
                        {visiblePassId === s.id ? getDefaultPassword(s.email) : '••••••••'}
                      </span>
                      <button onClick={() => setVisiblePassId(visiblePassId === s.id ? null : s.id)} className="text-gray-400 hover:text-teal-600">
                        {visiblePassId === s.id ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <div className="flex gap-1 justify-end">
                      <Button size="sm" variant="outline" onClick={() => openEditDialog(s)} className="h-7 w-7 p-0"><Edit2 className="h-3.5 w-3.5 text-gray-600" /></Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDeleteUser(s.id)} className="h-7 w-7 p-0 bg-red-50 hover:bg-red-100 border-0"><Trash2 className="h-3.5 w-3.5 text-red-600" /></Button>
                    </div>
                  </td>
                </tr>
              ))}

              {/* Teachers Tab */}
              {tab === 'teachers' && filteredTeachers.map(t => (
                <tr key={t.id} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center text-white text-xs font-bold">
                        {t.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                      </div>
                      <span className="font-semibold text-gray-900 text-xs">{t.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="text-gray-700 text-xs block">{t.email}</span>
                    <span className="text-[10px] text-gray-400 block">{t.phone}</span>
                  </td>
                  <td className="px-4 py-3.5 text-gray-600 font-medium text-xs">{t.subject}</td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-xs text-gray-700 bg-gray-100 px-2 py-0.5 rounded">
                        {visiblePassId === t.id ? getDefaultPassword(t.email) : '••••••••'}
                      </span>
                      <button onClick={() => setVisiblePassId(visiblePassId === t.id ? null : t.id)} className="text-gray-400 hover:text-teal-600">
                        {visiblePassId === t.id ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <div className="flex gap-1 justify-end">
                      <Button size="sm" variant="outline" onClick={() => openEditDialog(t)} className="h-7 w-7 p-0"><Edit2 className="h-3.5 w-3.5 text-gray-600" /></Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDeleteUser(t.id)} className="h-7 w-7 p-0 bg-red-50 hover:bg-red-100 border-0"><Trash2 className="h-3.5 w-3.5 text-red-600" /></Button>
                    </div>
                  </td>
                </tr>
              ))}

              {/* Support Staff Tab */}
              {tab === 'support' && filteredSupport.map(s => (
                <tr key={s.id} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-xs font-bold">
                        {s.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                      </div>
                      <div>
                        <span className="font-semibold text-gray-900 block text-xs">{s.name}</span>
                        <span className="text-[10px] text-gray-400">Joined: {s.joiningDate}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="text-gray-700 text-xs block">{s.email}</span>
                    <span className="text-[10px] text-gray-400 block">{s.phone}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="space-y-1">
                      <Badge variant="default" className="text-[9px] bg-orange-500 text-white border-0">{ROLE_LABELS[s.role] || s.role}</Badge>
                      <div className="flex items-center gap-1 text-[10px] text-gray-400">
                        <span>Shift: {s.shift}</span>
                        {s.busNumber && <span className="flex items-center gap-0.5 text-teal-600"><Bus className="h-2.5 w-2.5" />{s.busNumber}</span>}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 font-bold text-slate-700 text-xs">
                    ₹{s.salary.toLocaleString('en-IN')}
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <div className="flex gap-1 justify-end">
                      <Button size="sm" variant="outline" onClick={() => openEditDialog(s)} className="h-7 w-7 p-0"><Edit2 className="h-3.5 w-3.5 text-gray-600" /></Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDeleteUser(s.id)} className="h-7 w-7 p-0 bg-red-50 hover:bg-red-100 border-0"><Trash2 className="h-3.5 w-3.5 text-red-600" /></Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Add User Dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-base font-bold flex items-center gap-1.5">
              <Plus className="h-4.5 w-4.5 text-teal-600" />
              Add New {tab === 'students' ? 'Student' : tab === 'teachers' ? 'Teacher' : 'Support Staff'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4 text-xs font-semibold">
            <div className="space-y-1">
              <label className="text-gray-600">Full Name</label>
              <Input value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="Enter name" className="h-9 text-xs" />
            </div>
            <div className="space-y-1">
              <label className="text-gray-600">Email Address</label>
              <Input type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} placeholder="Enter email" className="h-9 text-xs" />
            </div>
            <div className="space-y-1">
              <label className="text-gray-600">Phone Number</label>
              <Input value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} placeholder="Enter phone" className="h-9 text-xs" />
            </div>
            <div className="space-y-1">
              <label className="text-gray-600 flex items-center gap-1"><KeyRound className="h-3 w-3 text-teal-600" /> Set Password <span className="text-gray-400 font-normal">(leave blank for default: email+123)</span></label>
              <div className="relative">
                <Input type={showPass ? 'text' : 'password'} value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} placeholder="Custom password or leave blank" className="h-9 text-xs pr-9" />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-2 top-2 text-gray-400 hover:text-gray-600">
                  {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Students Fields */}
            {tab === 'students' && (
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-gray-600">Class/Batch</label>
                  <select value={formData.class} onChange={e => setFormData({ ...formData, class: e.target.value })} className="w-full h-9 px-2 border rounded-lg text-xs font-semibold bg-white focus:outline-none focus:ring-1 focus:ring-teal-500">
                    <option value="IOT-2026">IOT-2026</option>
                    <option value="CS-2026">CS-2026</option>
                    <option value="MECH-2026">MECH-2026</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-gray-600">Section/Slot</label>
                  <Input value={formData.section} onChange={e => setFormData({ ...formData, section: e.target.value })} placeholder="Morning" className="h-9 text-xs" />
                </div>
              </div>
            )}

            {/* Teachers Fields */}
            {tab === 'teachers' && (
              <div className="space-y-1">
                <label className="text-gray-600">Subject Specialization</label>
                <Input value={formData.subject} onChange={e => setFormData({ ...formData, subject: e.target.value })} placeholder="e.g. Physics, Chemistry" className="h-9 text-xs" />
              </div>
            )}

            {/* Support Staff Fields */}
            {tab === 'support' && (
              <div className="space-y-4 border-t border-slate-100 pt-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-gray-600 font-bold text-orange-600">Staff Role</label>
                    <select value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value as any })} className="w-full h-9 px-2 border rounded-lg text-xs font-semibold bg-white focus:outline-none focus:ring-1 focus:ring-orange-500">
                      <option value="guard">Security Guard</option>
                      <option value="driver">Bus Driver</option>
                      <option value="receptionist">Receptionist</option>
                      <option value="cleaner">Cleaner</option>
                      <option value="accountant">Accountant</option>
                      <option value="helper">Lab Helper</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-gray-600">Shift</label>
                    <select value={formData.shift} onChange={e => setFormData({ ...formData, shift: e.target.value as any })} className="w-full h-9 px-2 border rounded-lg text-xs font-semibold bg-white focus:outline-none focus:ring-1 focus:ring-orange-500">
                      <option value="morning">Morning</option>
                      <option value="evening">Evening</option>
                      <option value="night">Night</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-gray-600">Basic Monthly Salary (₹)</label>
                    <Input type="number" value={formData.salary} onChange={e => setFormData({ ...formData, salary: Number(e.target.value) })} className="h-9 text-xs" />
                  </div>
                  {formData.role === 'driver' && (
                    <div className="space-y-1">
                      <label className="text-gray-600">Assigned Bus No.</label>
                      <Input value={formData.busNumber} onChange={e => setFormData({ ...formData, busNumber: e.target.value })} placeholder="BUS-102" className="h-9 text-xs" />
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddOpen(false)}>Cancel</Button>
            <Button onClick={handleAddUser} className="bg-teal-600 hover:bg-teal-700 text-white">Save Profile</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-base font-bold flex items-center gap-1.5">
              <Edit2 className="h-4.5 w-4.5 text-teal-600" />
              Edit Profile details
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4 text-xs font-semibold">
            <div className="space-y-1">
              <label className="text-gray-600">Full Name</label>
              <Input value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="h-9 text-xs" />
            </div>
            <div className="space-y-1">
              <label className="text-gray-600">Email Address</label>
              <Input type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="h-9 text-xs" />
            </div>
            <div className="space-y-1">
              <label className="text-gray-600">Phone Number</label>
              <Input value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} className="h-9 text-xs" />
            </div>
            <div className="space-y-1">
              <label className="text-gray-600 flex items-center gap-1"><KeyRound className="h-3 w-3 text-teal-600" /> Reset Password <span className="text-gray-400 font-normal">(leave blank to keep current)</span></label>
              <div className="relative">
                <Input type={showPass ? 'text' : 'password'} value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} placeholder="New password or leave blank" className="h-9 text-xs pr-9" />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-2 top-2 text-gray-400 hover:text-gray-600">
                  {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Students Fields */}
            {tab === 'students' && (
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-gray-600">Class/Batch</label>
                  <select value={formData.class} onChange={e => setFormData({ ...formData, class: e.target.value })} className="w-full h-9 px-2 border rounded-lg text-xs font-semibold bg-white focus:outline-none focus:ring-1 focus:ring-teal-500">
                    <option value="IOT-2026">IOT-2026</option>
                    <option value="CS-2026">CS-2026</option>
                    <option value="MECH-2026">MECH-2026</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-gray-600">Section/Slot</label>
                  <Input value={formData.section} onChange={e => setFormData({ ...formData, section: e.target.value })} className="h-9 text-xs" />
                </div>
              </div>
            )}

            {/* Teachers Fields */}
            {tab === 'teachers' && (
              <div className="space-y-1">
                <label className="text-gray-600">Subject Specialization</label>
                <Input value={formData.subject} onChange={e => setFormData({ ...formData, subject: e.target.value })} className="h-9 text-xs" />
              </div>
            )}

            {/* Support Staff Fields */}
            {tab === 'support' && (
              <div className="space-y-4 border-t border-slate-100 pt-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-gray-600 font-bold text-orange-600">Staff Role</label>
                    <select value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value as any })} className="w-full h-9 px-2 border rounded-lg text-xs font-semibold bg-white focus:outline-none focus:ring-1 focus:ring-orange-500">
                      <option value="guard">Security Guard</option>
                      <option value="driver">Bus Driver</option>
                      <option value="receptionist">Receptionist</option>
                      <option value="cleaner">Cleaner</option>
                      <option value="accountant">Accountant</option>
                      <option value="helper">Lab Helper</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-gray-600">Shift</label>
                    <select value={formData.shift} onChange={e => setFormData({ ...formData, shift: e.target.value as any })} className="w-full h-9 px-2 border rounded-lg text-xs font-semibold bg-white focus:outline-none focus:ring-1 focus:ring-orange-500">
                      <option value="morning">Morning</option>
                      <option value="evening">Evening</option>
                      <option value="night">Night</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-gray-600">Basic Monthly Salary (₹)</label>
                    <Input type="number" value={formData.salary} onChange={e => setFormData({ ...formData, salary: Number(e.target.value) })} className="h-9 text-xs" />
                  </div>
                  {formData.role === 'driver' && (
                    <div className="space-y-1">
                      <label className="text-gray-600">Assigned Bus No.</label>
                      <Input value={formData.busNumber} onChange={e => setFormData({ ...formData, busNumber: e.target.value })} placeholder="BUS-102" className="h-9 text-xs" />
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>Cancel</Button>
            <Button onClick={handleEditUser} className="bg-teal-600 hover:bg-teal-700 text-white">Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
