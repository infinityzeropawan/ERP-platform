'use client';
import { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectItem } from '@/components/ui/select';
import { useAuth } from '@/lib/AuthContext';
import {
  MODULE_CATALOG, DEFAULT_MODULES, INSTITUTION_TYPE_LABELS,
  type InstitutionType, type ModuleKey, type ModuleDef
} from '@/lib/modules';
import {
  Building2, Plus, Settings, School, Target, Globe, GraduationCap,
  BookOpen, Layers, Search, CheckCircle, XCircle, Sparkles, Edit2, Phone, Mail, Link as LinkIcon, MapPin, Calendar, CreditCard
} from 'lucide-react';

interface MockInstitution {
  id: string;
  name: string;
  slug: string;
  type: InstitutionType;
  plan: string;
  status: 'active' | 'trial' | 'suspended';
  students: number;
  teachers: number;
  enabledModules: ModuleKey[];
  joinedDate: string;
  phone?: string;
  email?: string;
  website?: string;
  address?: string;
}

const TYPE_ICONS: Record<InstitutionType, React.ElementType> = {
  school: School, coaching: Target, online_teaching: Globe,
  college: GraduationCap, tuition: BookOpen, hybrid: Layers,
};

const MOCK_INSTITUTIONS: MockInstitution[] = [
  { id: 'inst-001', name: 'Greenwood High School', slug: 'greenwood', type: 'school', plan: 'pro', status: 'active', students: 248, teachers: 18, enabledModules: DEFAULT_MODULES.school, joinedDate: '2026-01-15', phone: '+91 95801 81697', email: 'admin@greenwood.buildroonix.com', website: 'greenwood.buildroonix.com', address: '12, Sector 5, Noida, UP, India' },
  { id: 'inst-002', name: 'Allen Coaching Center', slug: 'allen', type: 'coaching', plan: 'enterprise', status: 'active', students: 520, teachers: 32, enabledModules: DEFAULT_MODULES.coaching, joinedDate: '2026-02-10', phone: '+91 98765 00001', email: 'info@allen.buildroonix.com', website: 'allen.buildroonix.com', address: '45, Lajpat Nagar, Delhi, India' },
  { id: 'inst-003', name: 'LearnOnline Academy', slug: 'learnonline', type: 'online_teaching', plan: 'basic', status: 'trial', students: 85, teachers: 6, enabledModules: DEFAULT_MODULES.online_teaching, joinedDate: '2026-06-01', phone: '+91 98765 00002', email: 'help@learnonline.com', website: 'learnonline.com', address: 'Online Platform' },
  { id: 'inst-004', name: 'ABC Engineering College', slug: 'abceng', type: 'college', plan: 'enterprise', status: 'active', students: 1200, teachers: 95, enabledModules: DEFAULT_MODULES.college, joinedDate: '2025-07-20', phone: '+91 98765 00003', email: 'admissions@abceng.edu', website: 'abceng.edu', address: 'Dwarka Sector 12, Delhi, India' },
  { id: 'inst-005', name: 'Sunrise Tuition Center', slug: 'sunrise', type: 'tuition', plan: 'basic', status: 'active', students: 42, teachers: 4, enabledModules: DEFAULT_MODULES.tuition, joinedDate: '2026-05-12', phone: '+91 98765 00004', email: 'contact@sunrise.com', website: 'sunrise.com', address: 'Mayur Vihar, Delhi, India' },
];

const CATEGORY_COLORS: Record<ModuleDef['category'], string> = {
  core: 'bg-slate-100 text-slate-700',
  academic: 'bg-teal-100 text-teal-700',
  admin: 'bg-blue-100 text-blue-700',
  coaching: 'bg-orange-100 text-orange-700',
  online: 'bg-purple-100 text-purple-700',
  college: 'bg-indigo-100 text-indigo-700',
};

export default function InstitutionsPage() {
  const { user } = useAuth();
  const { token } = useAuth();
  const [institutions, setInstitutions] = useState<MockInstitution[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [selectedInst, setSelectedInst] = useState<MockInstitution | null>(null);
  const [moduleTab, setModuleTab] = useState<ModuleDef['category'] | 'all'>('all');
  const [addOpen, setAddOpen] = useState(false);
  const [editDetailsOpen, setEditDetailsOpen] = useState(false);
  const [newInst, setNewInst] = useState({ 
    name: '', 
    slug: '', 
    type: 'school' as InstitutionType, 
    plan: 'basic',
    adminName: '',
    adminEmail: '',
    adminPassword: ''
  });
  
  // School Admin active institution settings
  const [myInstitution, setMyInstitution] = useState<MockInstitution>({
    id: '', name: '', slug: '', type: 'school', plan: 'basic', status: 'active',
    students: 0, teachers: 0, enabledModules: [], joinedDate: ''
  });
  const [editForm, setEditForm] = useState({
    phone: '',
    email: '',
    website: '',
    address: ''
  });

  const fetchInstitutions = async () => {
    if (user?.role !== 'superadmin' || !token) return;
    setLoading(true);
    try {
      const res = await fetch('/api/v1/superadmin/institutions', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to fetch institutions');
      setInstitutions(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error occurred');
    } finally {
      setLoading(false);
    }
  };

  const fetchMyInstitution = async () => {
    if (user?.role !== 'school_admin' || !token) return;
    try {
      const res = await fetch('/api/v1/admin/my-institution', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setMyInstitution(data);
        setEditForm({
          phone: data.phone || '',
          email: data.email || '',
          website: data.website || '',
          address: data.address || ''
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (user?.role === 'superadmin') {
      fetchInstitutions();
    } else if (user?.role === 'school_admin') {
      fetchMyInstitution();
    }
  }, [user, token]);

  const filtered = institutions.filter(i =>
    i.name.toLowerCase().includes(search.toLowerCase()) ||
    i.slug.toLowerCase().includes(search.toLowerCase())
  );

  const toggleModule = async (instId: string, moduleKey: ModuleKey) => {
    const inst = institutions.find(i => i.id === instId);
    if (!inst) return;
    const has = inst.enabledModules.includes(moduleKey);
    const updatedModules = has 
      ? inst.enabledModules.filter(m => m !== moduleKey)
      : [...inst.enabledModules, moduleKey];

    try {
      const res = await fetch(`/api/v1/superadmin/institutions/${instId}/modules`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ enabledModules: updatedModules })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to update modules');

      setInstitutions(prev => prev.map(i => i.id === instId ? { ...i, enabledModules: updatedModules } : i));
      setSelectedInst(prev => prev && prev.id === instId ? { ...prev, enabledModules: updatedModules } : prev);
    } catch (err: any) {
      alert(err.message || 'Failed to update modules');
    }
  };

  const toggleMySchoolModule = (moduleKey: ModuleKey) => {
    // School Admin toggling modules has no server-side route (Superadmin only) - notify or mock
    alert('Contact Super Admin to modify active modules.');
  };

  const addInstitution = async () => {
    if (!newInst.name || !newInst.slug || !newInst.adminEmail || !newInst.adminPassword) {
      alert('Please fill in Name, Slug, Admin Email, and Admin Password.');
      return;
    }
    try {
      const res = await fetch('/api/v1/superadmin/institutions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newInst)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to onboard institution');

      alert(`Institution Onboarded! Provide login ID: ${newInst.adminEmail} & Password: ${newInst.adminPassword} to the tenant.`);
      setNewInst({ name: '', slug: '', type: 'school', plan: 'basic', adminName: '', adminEmail: '', adminPassword: '' });
      setAddOpen(false);
      fetchInstitutions();
    } catch (err: any) {
      alert(err.message || 'Failed to onboard institution');
    }
  };

  const handleEditDetailsSubmit = async () => {
    try {
      const res = await fetch('/api/v1/admin/my-institution', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editForm)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to update details');
      
      setMyInstitution(data);
      localStorage.setItem('buildroonix_my_institution', JSON.stringify(data));
      setEditDetailsOpen(false);
    } catch (err: any) {
      alert(err.message || 'Failed to update details');
    }
  };

  const displayModules = MODULE_CATALOG.filter(m =>
    moduleTab === 'all' ? true : m.category === moduleTab
  );

  const statusColor: Record<string, 'success' | 'warning' | 'danger'> = {
    active: 'success', trial: 'warning', suspended: 'danger',
  };
  const planColor: Record<string, 'default' | 'info' | 'success'> = {
    basic: 'default', pro: 'info', enterprise: 'success',
  };
  const planPrices: Record<string, string> = {
    basic: '₹1,999', pro: '₹4,999', enterprise: '₹9,999'
  };

  // No local mock invoices list for dynamic database alignment
  const invoices: any[] = [];

  // ─────────────────────────────────────────────────────────────
  // RENDER: SCHOOL ADMIN SINGLE-SCHOOL VIEW
  // ─────────────────────────────────────────────────────────────
  if (user?.role === 'school_admin') {
    const typeInfo = INSTITUTION_TYPE_LABELS[myInstitution.type];
    const TypeIcon = TYPE_ICONS[myInstitution.type];
    
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Building2 className="h-6 w-6 text-teal-600" />My Institution
            </h1>
            <p className="text-gray-500 text-sm mt-0.5">Manage school settings, branding, modules, and view subscription details.</p>
          </div>
          <Button onClick={() => {
            setEditForm({
              phone: myInstitution.phone || '',
              email: myInstitution.email || '',
              website: myInstitution.website || '',
              address: myInstitution.address || ''
            });
            setEditDetailsOpen(true);
          }} className="bg-teal-600 hover:bg-teal-700 text-white flex items-center gap-2">
            <Edit2 className="h-4 w-4" /> Edit Details
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column: School Profile Card */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Main Info Card */}
            <Card>
              <CardContent className="p-6 space-y-6">
                <div className="flex items-center gap-4">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${typeInfo.color} flex items-center justify-center shadow-md`}>
                    <TypeIcon className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">{myInstitution.name}</h2>
                    <p className="text-sm text-gray-400 font-mono mt-0.5">{myInstitution.slug}.buildroonix.com</p>
                    <div className="flex gap-2 mt-2">
                      <Badge variant="outline">{typeInfo.label}</Badge>
                      <Badge variant={planColor[myInstitution.plan] as any} className="capitalize">{myInstitution.plan} Plan</Badge>
                      <Badge variant={statusColor[myInstitution.status] as any}>{myInstitution.status}</Badge>
                    </div>
                  </div>
                </div>

                <hr className="border-gray-100" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span><strong>Phone:</strong> {myInstitution.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span><strong>Email:</strong> {myInstitution.email}</span>
                  </div>
                  <div className="flex items-center gap-2 col-span-1 md:col-span-2">
                    <LinkIcon className="h-4 w-4 text-gray-400" />
                    <span><strong>Website:</strong> <a href={`https://${myInstitution.website}`} target="_blank" rel="noreferrer" className="text-teal-600 hover:underline">{myInstitution.website}</a></span>
                  </div>
                  <div className="flex items-center gap-2 col-span-1 md:col-span-2">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span><strong>Address:</strong> {myInstitution.address}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Modules Manager Card */}
            <Card>
              <CardHeader className="pb-3 border-b">
                <CardTitle className="text-base flex items-center gap-2">
                  <Settings className="h-4 w-4 text-teal-600" /> Institution Modules
                </CardTitle>
                <p className="text-xs text-gray-400 mt-1">Configure active feature modules for your staff and student portals.</p>
              </CardHeader>
              <CardContent className="p-0">
                {/* Category tabs */}
                <div className="flex gap-2 p-4 overflow-x-auto border-b border-gray-100 bg-gray-50/50">
                  <button
                    onClick={() => setModuleTab('all')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap ${moduleTab === 'all' ? 'bg-teal-600 text-white shadow-sm' : 'bg-gray-100 text-gray-600'}`}
                  >
                    All Modules
                  </button>
                  {(['core', 'academic', 'admin'] as const).map(cat => (
                    <button
                      key={cat}
                      onClick={() => setModuleTab(cat)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize whitespace-nowrap ${moduleTab === cat ? 'bg-teal-600 text-white shadow-sm' : 'bg-gray-100 text-gray-600'}`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                <div className="divide-y divide-gray-100 max-h-[300px] overflow-y-auto">
                  {displayModules.map(mod => {
                    const isEnabled = myInstitution.enabledModules.includes(mod.key);
                    return (
                      <div key={mod.key} className="flex items-center justify-between p-4 hover:bg-gray-50/50 transition-colors">
                        <div>
                          <p className="font-semibold text-sm text-gray-900">{mod.name}</p>
                          <p className="text-xs text-gray-400 mt-0.5">{mod.description}</p>
                          <div className="flex gap-1.5 mt-1.5">
                            <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider ${CATEGORY_COLORS[mod.category]}`}>
                              {mod.category}
                            </span>
                            {mod.isPremium && <Badge variant="default" className="text-[9px] py-0 px-1 bg-amber-500 text-white">Premium</Badge>}
                          </div>
                        </div>
                        <button
                          onClick={() => toggleMySchoolModule(mod.key)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${isEnabled ? 'bg-teal-50 text-teal-700 border border-teal-200' : 'bg-gray-100 text-gray-400'}`}
                        >
                          {isEnabled ? 'Active' : 'Disabled'}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Statistics & Billing */}
          <div className="space-y-6">
            
            {/* Stats Card */}
            <Card>
              <CardHeader className="pb-3"><CardTitle className="text-base">Operational Usage</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                {[
                  { label: 'Enrolled Students', value: myInstitution.students, max: 500, color: 'bg-teal-500' },
                  { label: 'Active Teachers', value: myInstitution.teachers, max: 30, color: 'bg-indigo-500' },
                  { label: 'Classes/Sections', value: 12, max: 20, color: 'bg-blue-500' }
                ].map(stat => (
                  <div key={stat.label} className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold text-gray-600">
                      <span>{stat.label}</span>
                      <span>{stat.value} / {stat.max} limit</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full">
                      <div className={`h-2 rounded-full ${stat.color}`} style={{ width: `${(stat.value / stat.max) * 100}%` }} />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Billing History Card */}
            <Card>
              <CardHeader className="pb-3 border-b"><CardTitle className="text-base flex items-center gap-2"><CreditCard className="h-4 w-4 text-teal-600" />Billing & Subscriptions</CardTitle></CardHeader>
              <CardContent className="p-0">
                <div className="p-4 bg-teal-50/20 text-xs flex justify-between items-center border-b border-teal-100/50">
                  <div>
                    <p className="font-bold text-teal-900 capitalize">{myInstitution.plan || 'Basic'} Subscription Plan</p>
                    <p className="text-teal-600 mt-0.5 capitalize">Status: {myInstitution.status || 'Active'}</p>
                  </div>
                  <Badge variant="success">{planPrices[myInstitution.plan] || '₹1,999'} / mo</Badge>
                </div>
                <div className="divide-y divide-gray-100 text-xs">
                  {invoices.length === 0 ? (
                    <div className="p-6 text-center text-gray-400">
                      No invoices generated yet.
                    </div>
                  ) : (
                    invoices.map(inv => (
                      <div key={inv.id} className="p-3.5 flex items-center justify-between hover:bg-gray-50/50 transition-colors">
                        <div>
                          <p className="font-bold text-gray-800">{inv.month}</p>
                          <p className="text-gray-400 mt-0.5">{inv.date} · Invoice #{inv.id}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-gray-900">₹{inv.amount.toLocaleString('en-IN')}</p>
                          <span className="text-[10px] text-green-600 font-semibold uppercase">Paid</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Edit details dialog */}
        <Dialog open={editDetailsOpen} onOpenChange={setEditDetailsOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Edit School Information</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-3">
              <div>
                <label className="text-xs text-gray-500 font-medium mb-1 block">Phone Number</label>
                <Input
                  value={editForm.phone}
                  onChange={(ev) => setEditForm({ ...editForm, phone: ev.target.value })}
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 font-medium mb-1 block">Email Address</label>
                <Input
                  value={editForm.email}
                  onChange={(ev) => setEditForm({ ...editForm, email: ev.target.value })}
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 font-medium mb-1 block">Website URL</label>
                <Input
                  value={editForm.website}
                  onChange={(ev) => setEditForm({ ...editForm, website: ev.target.value })}
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 font-medium mb-1 block">Office Address</label>
                <Input
                  value={editForm.address}
                  onChange={(ev) => setEditForm({ ...editForm, address: ev.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditDetailsOpen(false)}>Cancel</Button>
              <Button onClick={handleEditDetailsSubmit} className="bg-teal-600 hover:bg-teal-700 text-white">Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // RENDER: SUPERADMIN MULTI-INSTITUTION LIST VIEW (ORIGINAL VIEW)
  // ─────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Building2 className="h-6 w-6 text-teal-600" />Manage Institutions
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">
            Onboard institutions and control their module access
          </p>
        </div>
        <Button onClick={() => setAddOpen(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />Add Institution
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Institutions', value: institutions.length, color: 'text-teal-600' },
          { label: 'Active', value: institutions.filter(i => i.status === 'active').length, color: 'text-green-600' },
          { label: 'On Trial', value: institutions.filter(i => i.status === 'trial').length, color: 'text-amber-600' },
          { label: 'Total Students', value: institutions.reduce((a, i) => a + i.students, 0), color: 'text-blue-600' },
        ].map(s => (
          <Card key={s.label}>
            <CardContent className="p-4 text-center">
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-gray-500 mt-1">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search */}
      <div className="relative w-72">
        <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-gray-400" />
        <Input placeholder="Search institutions..." value={search} onChange={e => setSearch(e.target.value)} className="pl-8" />
      </div>

      {/* Institution Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map(inst => {
          const TypeIcon = TYPE_ICONS[inst.type];
          const typeInfo = INSTITUTION_TYPE_LABELS[inst.type];
          return (
            <Card key={inst.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${typeInfo.color} flex items-center justify-center`}>
                      <TypeIcon className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">{inst.name}</p>
                      <p className="text-xs text-gray-400">{inst.slug}.buildroonix.com</p>
                    </div>
                  </div>
                  <Badge variant={statusColor[inst.status] as any}>{inst.status}</Badge>
                </div>

                <div className="flex flex-wrap gap-2 mb-3">
                  <Badge variant="outline" className="text-xs">{typeInfo.label}</Badge>
                  <Badge variant={planColor[inst.plan] as any} className="text-xs capitalize">{inst.plan}</Badge>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center mb-4">
                  <div className="bg-gray-50 rounded-lg p-2">
                    <p className="text-sm font-bold text-gray-900">{inst.students}</p>
                    <p className="text-[10px] text-gray-400">Students</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-2">
                    <p className="text-sm font-bold text-gray-900">{inst.teachers}</p>
                    <p className="text-[10px] text-gray-400">Teachers</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-2">
                    <p className="text-sm font-bold text-teal-600">{inst.enabledModules.length}</p>
                    <p className="text-[10px] text-gray-400">Modules</p>
                  </div>
                </div>

                <Button
                  size="sm"
                  variant="outline"
                  className="w-full flex items-center gap-2"
                  onClick={() => setSelectedInst(inst)}
                >
                  <Settings className="h-3.5 w-3.5" />Manage Modules
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* ── MODULE MANAGER DIALOG ── */}
      {selectedInst && (
        <Dialog open={!!selectedInst} onOpenChange={() => setSelectedInst(null)}>
          <DialogContent className="w-full max-w-3xl max-h-[85vh]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-teal-600" /> Module Manager — {selectedInst.name}
              </DialogTitle>
            </DialogHeader>

            <div className="flex gap-2 pb-3 overflow-x-auto border-b">
              <button
                onClick={() => setModuleTab('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${moduleTab === 'all' ? 'bg-teal-600 text-white' : 'bg-gray-100 text-gray-600'}`}
              >
                All
              </button>
              {(['core', 'academic', 'admin', 'coaching', 'online', 'college'] as const).map(cat => (
                <button
                  key={cat}
                  onClick={() => setModuleTab(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize whitespace-nowrap ${moduleTab === cat ? 'bg-teal-600 text-white' : 'bg-gray-100 text-gray-600'}`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="divide-y max-h-[45vh] overflow-y-auto pr-1">
              {displayModules.map(mod => {
                const isEnabled = selectedInst.enabledModules.includes(mod.key);
                return (
                  <div key={mod.key} className="flex items-center justify-between py-3">
                    <div>
                      <p className="font-semibold text-sm text-gray-900">{mod.name}</p>
                      <p className="text-xs text-gray-400">{mod.description}</p>
                      <div className="flex gap-1.5 mt-1">
                        <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider ${CATEGORY_COLORS[mod.category]}`}>
                          {mod.category}
                        </span>
                        {mod.isPremium && <Badge variant="default" className="text-[9px] py-0 px-1 bg-amber-500 text-white">Premium</Badge>}
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant={isEnabled ? 'default' : 'outline'}
                      className={isEnabled ? 'bg-teal-600 hover:bg-teal-700 text-white' : ''}
                      onClick={() => toggleModule(selectedInst.id, mod.key)}
                    >
                      {isEnabled ? 'Active' : 'Disabled'}
                    </Button>
                  </div>
                );
              })}
            </div>
            <DialogFooter>
              <Button onClick={() => setSelectedInst(null)} className="bg-teal-600 hover:bg-teal-700 text-white">Done</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* ── ADD INSTITUTION DIALOG ── */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="w-full max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Institution</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">Institution Name *</label>
              <Input
                placeholder="Greenwood High School"
                value={newInst.name}
                onChange={e => setNewInst(p => ({ ...p, name: e.target.value }))}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">Domain Slug *</label>
              <Input
                placeholder="greenwood"
                value={newInst.slug}
                onChange={e => setNewInst(p => ({ ...p, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') }))}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">Type</label>
                <select
                  value={newInst.type}
                  onChange={e => setNewInst(p => ({ ...p, type: e.target.value as InstitutionType }))}
                  className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="school">School</option>
                  <option value="coaching">Coaching</option>
                  <option value="online_teaching">Online Academy</option>
                  <option value="college">College/Univ</option>
                  <option value="tuition">Tuition Center</option>
                  <option value="hybrid">Hybrid</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">Plan</label>
                <select
                  value={newInst.plan}
                  onChange={e => setNewInst(p => ({ ...p, plan: e.target.value }))}
                  className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="basic">Basic</option>
                  <option value="pro">Pro</option>
                  <option value="enterprise">Enterprise</option>
                </select>
              </div>
            </div>
            <div className="border-t pt-2 mt-2">
              <span className="text-xs font-semibold text-slate-800 block mb-2">Create School Admin Account</span>
              <div className="space-y-2">
                <div>
                  <label className="text-[10px] font-medium text-gray-500 mb-1 block">Admin Full Name</label>
                  <Input
                    placeholder="John Doe"
                    value={newInst.adminName}
                    onChange={e => setNewInst(p => ({ ...p, adminName: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-medium text-gray-500 mb-1 block">Admin Email / Login ID *</label>
                  <Input
                    type="email"
                    placeholder="admin@greenwood.com"
                    value={newInst.adminEmail}
                    onChange={e => setNewInst(p => ({ ...p, adminEmail: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-medium text-gray-500 mb-1 block">Admin Password *</label>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={newInst.adminPassword}
                    onChange={e => setNewInst(p => ({ ...p, adminPassword: e.target.value }))}
                  />
                </div>
              </div>
            </div>
          </div>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setAddOpen(false)}>Cancel</Button>
            <Button onClick={addInstitution} className="bg-teal-600 hover:bg-teal-700 text-white">Onboard & Create Admin</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
