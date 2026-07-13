'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';
import { DEFAULT_MODULES, INSTITUTION_TYPE_LABELS, type InstitutionType, type ModuleKey } from '@/lib/modules';
import {
  LayoutDashboard, CheckSquare, Users, BookOpen, Clock, FileText,
  ClipboardList, Award, FileQuestion, Briefcase, UserCheck, Video, UserPlus,
  MessageCircle, ChevronDown, ChevronRight, Menu, X, Rocket,
  GraduationCap, BarChart3, Settings, Bell, BookMarked, Layers, Building2,
  CreditCard, Trophy, IndianRupee, Megaphone, Globe, Shield, BookCopy, BellRing, ScrollText,
  HelpCircle, Star, Library, Heart, Ticket, Webhook, Smartphone, MessagesSquare, Sparkles
} from 'lucide-react';

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
  moduleKey?: string;
}

interface NavGroup {
  title: string;
  items: NavItem[];
  roles: string[];
}

const navGroups: NavGroup[] = [
  // ── SUPERADMIN ──────────────────────────────────────────────
  {
    title: 'Platform',
    roles: ['superadmin'],
    items: [
      { href: '/superadmin', label: 'Dashboard', icon: LayoutDashboard },
      { href: '/superadmin/institutions', label: 'Institutions', icon: Building2 },
      { href: '/superadmin/modules', label: 'Feature Modules', icon: Layers },
      { href: '/superadmin/billing', label: 'Billing & Subscriptions', icon: IndianRupee },
      { href: '/superadmin/announcements', label: 'Announcements', icon: Megaphone },
      { href: '/superadmin/settings', label: 'Platform Settings', icon: Settings },
    ],
  },
  // ── SCHOOL ADMIN ────────────────────────────────────────────
  {
    title: 'Administration',
    roles: ['school_admin'],
    items: [
      { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
      { href: '/admin/institutions', label: 'My Institution', icon: Building2 },
      { href: '/admin/classes', label: 'Classes & Sections', icon: BookCopy, moduleKey: 'mod_student_dir' },
      { href: '/admin/timetable', label: 'Timetable Management', icon: Clock, moduleKey: 'mod_timetable' },
      { href: '/admin/users', label: 'Manage Users', icon: Users, moduleKey: 'mod_student_dir' },
      { href: '/admin/enrollment', label: 'Enrollment Requests', icon: UserPlus, moduleKey: 'mod_enrollment' },
      { href: '/admin/attendance', label: 'Attendance Reports', icon: UserCheck, moduleKey: 'mod_attendance' },
      { href: '/admin/fee', label: 'Fee Management', icon: CreditCard, moduleKey: 'mod_fee_management' },
      { href: '/admin/payroll', label: 'Payroll Management', icon: IndianRupee, moduleKey: 'mod_fee_management' },
      { href: '/admin/notices', label: 'Notice Board', icon: Bell },
      { href: '/admin/reports', label: 'Reports & Analytics', icon: BarChart3, moduleKey: 'mod_reports' },
      { href: '/admin/integrations', label: 'Integrations & APIs', icon: Webhook, moduleKey: 'mod_payment_gateway,mod_sms_whatsapp' },
      { href: '/admin/notifications', label: 'SMS & WhatsApp', icon: Smartphone, moduleKey: 'mod_sms_whatsapp' },
      { href: '/chat', label: 'Real-time Chat', icon: MessagesSquare, moduleKey: 'mod_realtime_chat' },
      { href: '/admin/ai-settings', label: 'AI Settings', icon: Sparkles, moduleKey: 'mod_ai_features' },
      { href: '/admin/messaging', label: 'Messaging', icon: MessageCircle },
      { href: '/admin/settings', label: 'Settings', icon: Settings },
    ],
  },
  // ── TEACHER ─────────────────────────────────────────────────
  {
    title: 'Academics',
    roles: ['teacher'],
    items: [
      { href: '/teacher', label: 'Dashboard', icon: LayoutDashboard },
      { href: '/teacher/attendance', label: 'Mark Attendance', icon: CheckSquare, moduleKey: 'mod_attendance' },
      { href: '/teacher/student-attendance', label: 'Attendance Reports', icon: UserCheck, moduleKey: 'mod_attendance' },
      { href: '/teacher/assignments', label: 'Assignments & HW', icon: FileText, moduleKey: 'mod_assignments' },
      { href: '/teacher/timetable', label: 'My Timetable', icon: Clock, moduleKey: 'mod_timetable' },
      { href: '/teacher/syllabus', label: 'Syllabus', icon: BookOpen, moduleKey: 'mod_syllabus' },
      { href: '/teacher/lesson-plans', label: 'Lesson Plans', icon: BookMarked, moduleKey: 'mod_syllabus' },
      { href: '/teacher/study-material', label: 'Study Materials', icon: Library, moduleKey: 'mod_study_material' },
      { href: '/teacher/gradebook', label: 'Gradebook', icon: Trophy, moduleKey: 'mod_gradebook' },
      { href: '/teacher/daily-diary', label: 'Daily Diary', icon: ScrollText, moduleKey: 'mod_daily_diary' },
      { href: '/teacher/exams', label: 'Exams & Results', icon: Award, moduleKey: 'mod_exams' },
      { href: '/teacher/online-exams', label: 'Online Exams (MCQ)', icon: ClipboardList, moduleKey: 'mod_online_exams' },
      { href: '/teacher/online-classes', label: 'Online Classes', icon: Video, moduleKey: 'mod_online_classes' },
      { href: '/teacher/previous-papers', label: 'Previous Papers', icon: FileQuestion, moduleKey: 'mod_previous_papers' },
      { href: '/teacher/students', label: 'Student Directory', icon: GraduationCap, moduleKey: 'mod_student_dir' },
      { href: '/teacher/leave', label: 'My Leave', icon: Briefcase, moduleKey: 'mod_leave' },
    ],
  },
  {
    title: 'General',
    roles: ['teacher'],
    items: [
      { href: '/teacher/payroll', label: 'My Payroll', icon: IndianRupee, moduleKey: 'mod_fee_management' },
      { href: '/teacher/parent-communication', label: 'Parent Communication', icon: Megaphone, moduleKey: 'mod_parent_comm' },
      { href: '/chat', label: 'Real-time Chat', icon: MessagesSquare, moduleKey: 'mod_realtime_chat' },
      { href: '/teacher/messaging', label: 'Messaging', icon: MessageCircle },
      { href: '/teacher/ai-notes', label: 'AI Notes Generator', icon: Layers, moduleKey: 'mod_ai_features' },
      { href: '/teacher/ai-settings', label: 'AI Settings', icon: Sparkles, moduleKey: 'mod_ai_features' },
      { href: '/teacher/profile', label: 'My Profile', icon: Users },
    ],
  },
  // ── STUDENT ─────────────────────────────────────────────────
  {
    title: 'Academics',
    roles: ['student'],
    items: [
      { href: '/student', label: 'Dashboard', icon: LayoutDashboard },
      { href: '/student/timetable', label: 'My Timetable', icon: Clock, moduleKey: 'mod_timetable' },
      { href: '/student/attendance', label: 'My Attendance', icon: CheckSquare, moduleKey: 'mod_attendance' },
      { href: '/student/assignments', label: 'Assignments', icon: FileText, moduleKey: 'mod_assignments' },
      { href: '/student/exams', label: 'My Exams', icon: Award, moduleKey: 'mod_exams' },
      { href: '/student/online-exams', label: 'Online Exams', icon: ClipboardList, moduleKey: 'mod_online_exams' },
      { href: '/student/results', label: 'My Results', icon: Trophy, moduleKey: 'mod_exams' },
      { href: '/student/online-classes', label: 'Online Classes', icon: Video, moduleKey: 'mod_online_classes' },
      { href: '/student/previous-papers', label: 'Previous Papers', icon: FileQuestion, moduleKey: 'mod_previous_papers' },
      { href: '/student/study-material', label: 'Study Materials', icon: Library, moduleKey: 'mod_study_material' },
      { href: '/student/syllabus', label: 'Syllabus Progress', icon: BookOpen, moduleKey: 'mod_syllabus' },
      { href: '/student/doubts', label: 'Doubts & Q&A', icon: HelpCircle, moduleKey: 'mod_doubt_sessions' },
      { href: '/student/report-card', label: 'Report Card', icon: ScrollText, moduleKey: 'mod_exams' },
    ],
  },
  {
    title: 'General',
    roles: ['student'],
    items: [
      { href: '/student/fee', label: 'Fee & Payments', icon: CreditCard, moduleKey: 'mod_fee_management' },
      { href: '/student/leave', label: 'My Leave', icon: Briefcase, moduleKey: 'mod_leave' },
      { href: '/student/certificates', label: 'Certificates', icon: Award, moduleKey: 'mod_certificates' },
      { href: '/student/feedback', label: 'Feedback', icon: Star },
      { href: '/student/notifications', label: 'Notifications', icon: BellRing },
      { href: '/student/notices', label: 'Notice Board', icon: Bell },
      { href: '/student/my-class', label: 'My Class', icon: Users, moduleKey: 'mod_student_dir' },
      { href: '/chat', label: 'Real-time Chat', icon: MessagesSquare, moduleKey: 'mod_realtime_chat' },
      { href: '/student/messaging', label: 'Messaging', icon: MessageCircle },
      { href: '/student/ai-notes', label: 'AI Notes Generator', icon: Layers, moduleKey: 'mod_ai_features' },
      { href: '/student/ai-settings', label: 'AI Settings', icon: Sparkles, moduleKey: 'mod_ai_features' },
      { href: '/student/profile', label: 'My Profile', icon: GraduationCap },
    ],
  },
  // ── PARENT ──────────────────────────────────────────────────
  {
    title: 'Parent Portal',
    roles: ['parent'],
    items: [
      { href: '/parent', label: 'Dashboard', icon: LayoutDashboard },
      { href: '/parent/exams', label: 'Exams & Results', icon: Award, moduleKey: 'mod_exams' },
      { href: '/parent/fee', label: 'Fee Payment', icon: CreditCard, moduleKey: 'mod_fee_management' },
      { href: '/parent/admit-cards', label: 'Admit Cards', icon: Ticket, moduleKey: 'mod_exams' },
      { href: '/parent/timetable', label: 'Student Timetable', icon: Clock, moduleKey: 'mod_timetable' },
      { href: '/chat', label: 'Real-time Chat', icon: MessagesSquare, moduleKey: 'mod_realtime_chat' },
    ],
  },
];

function getInitials(name: string) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

const roleColors: Record<string, string> = {
  superadmin: 'from-purple-500 to-purple-700',
  school_admin: 'from-indigo-500 to-indigo-700',
  teacher: 'from-teal-500 to-teal-700',
  student: 'from-blue-500 to-blue-700',
  parent: 'from-rose-500 to-rose-700',
};

const roleLabels: Record<string, string> = {
  superadmin: 'Super Admin',
  school_admin: 'School Admin',
  teacher: 'Teacher',
  student: 'Student',
  parent: 'Parent',
};

export function Sidebar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({ Platform: true, Administration: true, Academics: true, General: true, 'Parent Portal': true });
  
  // Dynamic institution specs
  const [institution, setInstitution] = useState<{ type: InstitutionType; enabledModules: ModuleKey[] }>(() => {
    return {
      type: 'school',
      enabledModules: DEFAULT_MODULES.school
    };
  });

  useEffect(() => {
    const loadInfo = () => {
      const savedInst = localStorage.getItem('buildroonix_my_institution');
      const savedDefaults = localStorage.getItem('buildroonix_default_modules');
      
      let type: InstitutionType = 'school';
      let customModules: ModuleKey[] | null = null;
      
      if (savedInst) {
        const parsed = JSON.parse(savedInst);
        type = parsed.type;
        customModules = parsed.enabledModules;
      }
      
      const defaults = savedDefaults ? JSON.parse(savedDefaults) : DEFAULT_MODULES;
      const enabledModules = customModules || defaults[type] || [];
      
      setInstitution({ type, enabledModules });
    };

    loadInfo();
    window.addEventListener('storage', loadInfo);
    return () => window.removeEventListener('storage', loadInfo);
  }, []);

  const role = user?.role || 'student';
  const toggleGroup = (title: string) => setOpenGroups(prev => ({ ...prev, [title]: !prev[title] }));
  
  const activeType = institution.type;
  const activeModules = institution.enabledModules;
  const terms = INSTITUTION_TYPE_LABELS[activeType]?.terms || INSTITUTION_TYPE_LABELS.school.terms;

  // Dynamic text translator
  const translateLabel = (label: string) => {
    let result = label;
    result = result.replace(/Classes/g, terms.class.charAt(0).toUpperCase() + terms.class.slice(1) + (terms.class.toLowerCase() === 'class' ? 'es' : 's'));
    result = result.replace(/Class/g, terms.class.charAt(0).toUpperCase() + terms.class.slice(1));
    result = result.replace(/Section/g, terms.section.charAt(0).toUpperCase() + terms.section.slice(1));
    result = result.replace(/Teacher/g, terms.teacher.charAt(0).toUpperCase() + terms.teacher.slice(1));
    result = result.replace(/Student/g, terms.student.charAt(0).toUpperCase() + terms.student.slice(1));
    result = result.replace(/Exam/g, terms.exam.charAt(0).toUpperCase() + terms.exam.slice(1));
    result = result.replace(/Timetable/g, terms.timetable.charAt(0).toUpperCase() + terms.timetable.slice(1));
    return result;
  };

  // Filter groups by role and enabled modules
  const filteredGroups = navGroups.map(group => {
    if (role === 'superadmin') return group;
    return {
      ...group,
      items: group.items.filter(item => {
        if (!item.moduleKey) return true;
        const keys = item.moduleKey.split(',');
        return keys.some(key => activeModules.includes(key as ModuleKey));
      })
    };
  }).filter(group => group.roles.includes(role) && group.items.length > 0);

  return (
    <aside className={`${collapsed ? 'w-[72px]' : 'w-[240px]'} hidden md:flex flex-col bg-slate-900 text-white transition-all duration-300 min-h-screen`}>
      {/* Logo */}
      <div className="flex items-center justify-between p-4 border-b border-slate-700">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center">
              <Rocket className="h-4 w-4 text-white" />
            </div>
            <div>
              <span className="font-bold text-white text-sm">Buildroonix</span>
              <p className="text-[10px] text-teal-400">{roleLabels[role]}</p>
            </div>
          </div>
        )}
        {collapsed && (
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center mx-auto">
            <Rocket className="h-4 w-4 text-white" />
          </div>
        )}
        <button onClick={() => setCollapsed(!collapsed)} className="text-slate-400 hover:text-white transition-colors ml-auto">
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronDown className="h-4 w-4 rotate-90" />}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3">
        {filteredGroups.map(group => (
          <div key={group.title + group.roles[0]} className="mb-2">
            {!collapsed && (
              <button onClick={() => toggleGroup(group.title)}
                className="flex items-center justify-between w-full px-4 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-slate-400 hover:text-slate-300">
                {translateLabel(group.title)}
                {openGroups[group.title] ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
              </button>
            )}
            {(collapsed || openGroups[group.title]) && group.items.map(({ href, label, icon: Icon }) => {
              const active = pathname === href || (href !== '/admin' && href !== '/teacher' && href !== '/student' && href !== '/superadmin' && pathname.startsWith(href));
              const translatedLabel = translateLabel(label);
              return (
                <Link key={href} href={href} title={collapsed ? translatedLabel : undefined}
                  className={`flex items-center gap-3 mx-2 px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                    active ? 'bg-teal-600 text-white shadow-sm' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  } ${collapsed ? 'justify-center' : ''}`}>
                  <Icon className="h-4 w-4 flex-shrink-0" />
                  {!collapsed && <span className="truncate">{translatedLabel}</span>}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* User Footer */}
      <div className="border-t border-slate-700 p-3">
        {!collapsed ? (
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${roleColors[role]} flex items-center justify-center text-xs font-bold text-white flex-shrink-0`}>
              {user ? getInitials(user.name) : 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-white truncate">{user?.name || 'User'}</p>
              <p className="text-[10px] text-slate-400">{roleLabels[role]}</p>
            </div>
            <button onClick={logout} className="text-slate-400 hover:text-red-400 transition-colors" title="Logout">
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div className="flex justify-center">
            <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${roleColors[role]} flex items-center justify-center text-xs font-bold text-white cursor-pointer`} onClick={logout} title="Logout">
              {user ? getInitials(user.name) : 'U'}
            </div>
          </div>
        )}
        {!collapsed && (
          <p className="text-[9px] text-slate-500 text-center mt-2 flex items-center justify-center gap-1">
            <Rocket className="h-2.5 w-2.5 text-teal-500" /> Powered by Buildroonix
          </p>
        )}
      </div>
    </aside>
  );
}

export function MobileHeader() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const role = user?.role || 'student';

  const [institution, setInstitution] = useState<{ type: InstitutionType; enabledModules: ModuleKey[] }>(() => {
    return {
      type: 'school',
      enabledModules: DEFAULT_MODULES.school
    };
  });

  useEffect(() => {
    const loadInfo = () => {
      const savedInst = localStorage.getItem('buildroonix_my_institution');
      const savedDefaults = localStorage.getItem('buildroonix_default_modules');
      
      let type: InstitutionType = 'school';
      let customModules: ModuleKey[] | null = null;
      
      if (savedInst) {
        const parsed = JSON.parse(savedInst);
        type = parsed.type;
        customModules = parsed.enabledModules;
      }
      
      const defaults = savedDefaults ? JSON.parse(savedDefaults) : DEFAULT_MODULES;
      const enabledModules = customModules || defaults[type] || [];
      
      setInstitution({ type, enabledModules });
    };

    loadInfo();
    window.addEventListener('storage', loadInfo);
    return () => window.removeEventListener('storage', loadInfo);
  }, []);

  const activeType = institution.type;
  const activeModules = institution.enabledModules;
  const terms = INSTITUTION_TYPE_LABELS[activeType]?.terms || INSTITUTION_TYPE_LABELS.school.terms;

  const translateLabel = (label: string) => {
    let result = label;
    result = result.replace(/Classes/g, terms.class.charAt(0).toUpperCase() + terms.class.slice(1) + (terms.class.toLowerCase() === 'class' ? 'es' : 's'));
    result = result.replace(/Class/g, terms.class.charAt(0).toUpperCase() + terms.class.slice(1));
    result = result.replace(/Section/g, terms.section.charAt(0).toUpperCase() + terms.section.slice(1));
    result = result.replace(/Teacher/g, terms.teacher.charAt(0).toUpperCase() + terms.teacher.slice(1));
    result = result.replace(/Student/g, terms.student.charAt(0).toUpperCase() + terms.student.slice(1));
    result = result.replace(/Exam/g, terms.exam.charAt(0).toUpperCase() + terms.exam.slice(1));
    result = result.replace(/Timetable/g, terms.timetable.charAt(0).toUpperCase() + terms.timetable.slice(1));
    return result;
  };

  const filteredGroups = navGroups.map(group => {
    if (role === 'superadmin') return group;
    return {
      ...group,
      items: group.items.filter(item => {
        if (!item.moduleKey) return true;
        return activeModules.includes(item.moduleKey as ModuleKey);
      })
    };
  }).filter(group => group.roles.includes(role) && group.items.length > 0);

  return (
    <>
      <header className="md:hidden flex items-center justify-between px-4 py-3 bg-slate-900 text-white sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center">
            <Rocket className="h-3.5 w-3.5 text-white" />
          </div>
          <span className="font-bold text-sm">Buildroonix</span>
        </div>
        <button onClick={() => setOpen(true)} className="text-white"><Menu className="h-5 w-5" /></button>
      </header>

      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <div className="fixed left-0 top-0 bottom-0 w-72 bg-slate-900 text-white overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-slate-700">
              <span className="font-bold text-teal-400">Buildroonix</span>
              <button onClick={() => setOpen(false)}><X className="h-5 w-5 text-slate-400" /></button>
            </div>
            <nav className="py-3">
              {filteredGroups.map(group => (
                <div key={group.title + group.roles[0]} className="mb-3">
                  <p className="px-4 py-1 text-[10px] font-semibold uppercase tracking-widest text-slate-400">{translateLabel(group.title)}</p>
                  {group.items.map(({ href, label, icon: Icon }) => {
                    const translatedLabel = translateLabel(label);
                    return (
                      <Link key={href} href={href} onClick={() => setOpen(false)}
                        className={`flex items-center gap-3 mx-2 px-3 py-2 rounded-lg text-sm transition-all ${pathname === href ? 'bg-teal-600 text-white' : 'text-slate-300 hover:bg-slate-800'}`}>
                        <Icon className="h-4 w-4" />{translatedLabel}
                      </Link>
                    );
                  })}
                </div>
              ))}
            </nav>
            <div className="p-4 border-t border-slate-700">
              <p className="text-xs text-white mb-1">{user?.name} · {roleLabels[role]}</p>
              <button onClick={logout} className="text-sm text-red-400 hover:text-red-300">Logout</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
