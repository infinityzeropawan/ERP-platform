// ============================================================
// BUILDROONIX — Module System
// Controls which features each institution type can access
// ============================================================

export type InstitutionType =
  | 'school'
  | 'coaching'
  | 'online_teaching'
  | 'college'
  | 'tuition'
  | 'hybrid';

export type ModuleKey =
  // ── CORE (all types) ──────────────────────────────────────
  | 'core_auth'
  | 'core_dashboard'
  | 'core_messaging'
  | 'core_notices'
  | 'core_notifications'
  | 'core_ai_notes'
  | 'core_profile'
  // ── ACADEMIC ──────────────────────────────────────────────
  | 'mod_timetable'
  | 'mod_attendance'
  | 'mod_assignments'
  | 'mod_exams'
  | 'mod_online_exams'
  | 'mod_syllabus'
  | 'mod_previous_papers'
  | 'mod_online_classes'
  | 'mod_recorded_content'
  | 'mod_certificates'
  // ── ADMINISTRATION ────────────────────────────────────────
  | 'mod_enrollment'
  | 'mod_fee_management'
  | 'mod_leave'
  | 'mod_student_dir'
  | 'mod_reports'
  | 'mod_transport'
  | 'mod_hostel'
  | 'mod_library'
  | 'mod_sms_whatsapp'
  | 'mod_payment_gateway'
  | 'mod_realtime_chat'
  | 'mod_ai_features'
  // ── COACHING-SPECIFIC ─────────────────────────────────────
  | 'mod_batches'
  | 'mod_test_series'
  | 'mod_doubt_sessions'
  | 'mod_rankings'
  | 'mod_study_material'
  // ── ONLINE TEACHING ───────────────────────────────────────
  | 'mod_courses'
  | 'mod_subscriptions'
  | 'mod_live_streaming'
  | 'mod_content_library'
  | 'mod_progress_track'
  // ── COLLEGE-SPECIFIC ──────────────────────────────────────
  | 'mod_departments'
  | 'mod_semesters'
  | 'mod_internal_marks'
  | 'mod_placement'
  | 'mod_research'
  | 'mod_gradebook'
  | 'mod_daily_diary'
  | 'mod_parent_comm';

export interface ModuleDef {
  key: ModuleKey;
  name: string;
  description: string;
  category: 'core' | 'academic' | 'admin' | 'coaching' | 'online' | 'college';
  isPremium: boolean;
  icon: string;
  defaultFor: InstitutionType[];
}

// ─────────────────────────────────────────────────────────────
// FULL MODULE CATALOG
// ─────────────────────────────────────────────────────────────
export const MODULE_CATALOG: ModuleDef[] = [
  // CORE
  { key: 'core_auth',          name: 'Authentication',       description: 'Login, roles, password reset',           category: 'core',     isPremium: false, icon: 'Shield',       defaultFor: ['school','coaching','online_teaching','college','tuition','hybrid'] },
  { key: 'core_dashboard',     name: 'Dashboard',            description: 'Role-based dashboards',                  category: 'core',     isPremium: false, icon: 'LayoutDashboard', defaultFor: ['school','coaching','online_teaching','college','tuition','hybrid'] },
  { key: 'core_messaging',     name: 'Messaging',            description: '1-to-1 direct chat',                     category: 'core',     isPremium: false, icon: 'MessageCircle', defaultFor: ['school','coaching','online_teaching','college','tuition','hybrid'] },
  { key: 'core_notices',       name: 'Notice Board',         description: 'Announcements for all roles',            category: 'core',     isPremium: false, icon: 'Bell',         defaultFor: ['school','coaching','online_teaching','college','tuition','hybrid'] },
  { key: 'core_notifications', name: 'Notifications',        description: 'In-app push notifications',              category: 'core',     isPremium: false, icon: 'BellRing',     defaultFor: ['school','coaching','online_teaching','college','tuition','hybrid'] },
  { key: 'core_ai_notes',      name: 'AI Notes Generator',   description: 'AI-powered study notes',                 category: 'core',     isPremium: true,  icon: 'Sparkles',     defaultFor: ['school','coaching','online_teaching','college','tuition','hybrid'] },
  { key: 'core_profile',       name: 'User Profile',         description: 'Profile management',                     category: 'core',     isPremium: false, icon: 'User',         defaultFor: ['school','coaching','online_teaching','college','tuition','hybrid'] },

  // ACADEMIC
  { key: 'mod_timetable',      name: 'Timetable',            description: 'Weekly class schedule',                  category: 'academic', isPremium: false, icon: 'Clock',        defaultFor: ['school','college','tuition','hybrid'] },
  { key: 'mod_attendance',     name: 'Attendance',           description: 'Daily attendance marking & reports',     category: 'academic', isPremium: false, icon: 'CheckSquare',  defaultFor: ['school','coaching','college','tuition','hybrid'] },
  { key: 'mod_assignments',    name: 'Assignments & HW',     description: 'Create, submit, grade assignments',      category: 'academic', isPremium: false, icon: 'FileText',     defaultFor: ['school','coaching','online_teaching','college','tuition','hybrid'] },
  { key: 'mod_exams',          name: 'Exams & Results',      description: 'Exam scheduling and result entry',       category: 'academic', isPremium: false, icon: 'Award',        defaultFor: ['school','coaching','college','tuition','hybrid'] },
  { key: 'mod_online_exams',   name: 'Online Exams',         description: 'MCQ-based online examinations',          category: 'academic', isPremium: true,  icon: 'ClipboardList',defaultFor: ['school','coaching','online_teaching','college','hybrid'] },
  { key: 'mod_syllabus',       name: 'Syllabus',             description: 'Syllabus and lesson plans',              category: 'academic', isPremium: false, icon: 'BookOpen',     defaultFor: ['school','college','hybrid'] },
  { key: 'mod_previous_papers',name: 'Previous Papers',      description: 'Previous year question papers',          category: 'academic', isPremium: false, icon: 'FileQuestion', defaultFor: ['school','coaching','college','hybrid'] },
  { key: 'mod_online_classes', name: 'Online Classes',       description: 'Live virtual class scheduling',          category: 'academic', isPremium: true,  icon: 'Video',        defaultFor: ['school','coaching','online_teaching','college','hybrid'] },
  { key: 'mod_recorded_content',name:'Recorded Content',     description: 'Upload and stream recorded lectures',    category: 'academic', isPremium: true,  icon: 'PlayCircle',   defaultFor: ['online_teaching','hybrid'] },
  { key: 'mod_certificates',   name: 'Certificates',         description: 'Generate completion certificates',       category: 'academic', isPremium: true,  icon: 'BadgeCheck',   defaultFor: ['online_teaching','coaching','hybrid'] },
  { key: 'mod_gradebook',      name: 'Gradebook',            description: 'Unified grade aggregator and analytics', category: 'academic', isPremium: false, icon: 'Trophy',       defaultFor: ['school','coaching','college','hybrid'] },
  { key: 'mod_daily_diary',    name: 'Daily Diary',          description: 'Daily class logs and homework diary',    category: 'academic', isPremium: false, icon: 'ScrollText',   defaultFor: ['school','college','hybrid'] },

  // ADMINISTRATION
  { key: 'mod_enrollment',     name: 'Enrollment Requests',  description: 'Student admission management',           category: 'admin',    isPremium: false, icon: 'UserPlus',     defaultFor: ['school','coaching','college','hybrid'] },
  { key: 'mod_fee_management', name: 'Fee Management',       description: 'Fee structure, collection, receipts',    category: 'admin',    isPremium: true,  icon: 'CreditCard',   defaultFor: ['school','coaching','college','tuition','hybrid'] },
  { key: 'mod_leave',          name: 'Leave Management',     description: 'Leave application and approval',         category: 'admin',    isPremium: false, icon: 'Briefcase',    defaultFor: ['school','college','hybrid'] },
  { key: 'mod_student_dir',    name: 'Student Directory',    description: 'Full student directory with search',     category: 'admin',    isPremium: false, icon: 'GraduationCap',defaultFor: ['school','coaching','college','tuition','hybrid'] },
  { key: 'mod_reports',        name: 'Reports & Analytics',  description: 'Platform-wide analytics and reports',    category: 'admin',    isPremium: true,  icon: 'BarChart3',    defaultFor: ['school','coaching','online_teaching','college','tuition','hybrid'] },
  { key: 'mod_transport',      name: 'Transport',            description: 'Bus routes and student transport',       category: 'admin',    isPremium: true,  icon: 'Bus',          defaultFor: ['school'] },
  { key: 'mod_hostel',         name: 'Hostel',               description: 'Hostel room and student management',     category: 'admin',    isPremium: true,  icon: 'Building',     defaultFor: ['school','college'] },
  { key: 'mod_library',        name: 'Library',              description: 'Book issue and return management',       category: 'admin',    isPremium: true,  icon: 'Library',      defaultFor: ['school','college'] },
  { key: 'mod_parent_comm',    name: 'Parent Communication', description: 'Dedicated parent messaging channel',     category: 'admin',    isPremium: false, icon: 'Megaphone',    defaultFor: ['school','coaching','college','hybrid'] },
  { key: 'mod_sms_whatsapp',   name: 'SMS & WhatsApp Notifications', description: 'Broadcast SMS/WhatsApp messages',category: 'admin',    isPremium: true,  icon: 'MessageSquare',defaultFor: [] },
  { key: 'mod_payment_gateway',name: 'Online Payment Gateway',       description: 'Accept online fee payments',     category: 'admin',    isPremium: true,  icon: 'CreditCard',   defaultFor: [] },
  { key: 'mod_realtime_chat',  name: 'Real-time Chat',               description: 'Live 1-on-1 and group messaging', category: 'admin',    isPremium: true,  icon: 'MessagesSquare', defaultFor: [] },
  { key: 'mod_ai_features',    name: 'AI Features',                  description: 'Gemini/OpenAI-powered AI tools',  category: 'admin',    isPremium: true,  icon: 'Sparkles',     defaultFor: [] },

  // COACHING-SPECIFIC
  { key: 'mod_batches',        name: 'Batch Management',     description: 'Manage coaching batches',                category: 'coaching', isPremium: false, icon: 'Users',        defaultFor: ['coaching'] },
  { key: 'mod_test_series',    name: 'Test Series',          description: 'Scheduled test series with rankings',    category: 'coaching', isPremium: true,  icon: 'ListChecks',   defaultFor: ['coaching'] },
  { key: 'mod_doubt_sessions', name: 'Doubt Sessions',       description: 'Scheduled doubt clearing sessions',      category: 'coaching', isPremium: false, icon: 'HelpCircle',   defaultFor: ['coaching'] },
  { key: 'mod_rankings',       name: 'Student Rankings',     description: 'Performance leaderboard',                category: 'coaching', isPremium: false, icon: 'Trophy',       defaultFor: ['coaching'] },
  { key: 'mod_study_material', name: 'Study Material',       description: 'PDF/video study material distribution',  category: 'coaching', isPremium: false, icon: 'FolderOpen',   defaultFor: ['coaching','online_teaching'] },

  // ONLINE TEACHING
  { key: 'mod_courses',        name: 'Course Management',    description: 'Create and manage online courses',       category: 'online',   isPremium: false, icon: 'BookMarked',   defaultFor: ['online_teaching','hybrid'] },
  { key: 'mod_subscriptions',  name: 'Subscriptions',        description: 'Student subscription plans',             category: 'online',   isPremium: true,  icon: 'Repeat',       defaultFor: ['online_teaching'] },
  { key: 'mod_live_streaming', name: 'Live Streaming',       description: 'Live class with recording',              category: 'online',   isPremium: true,  icon: 'Radio',        defaultFor: ['online_teaching','hybrid'] },
  { key: 'mod_content_library',name: 'Content Library',      description: 'Video/PDF content management',           category: 'online',   isPremium: true,  icon: 'Library',      defaultFor: ['online_teaching','hybrid'] },
  { key: 'mod_progress_track', name: 'Progress Tracking',    description: 'Course completion tracking',             category: 'online',   isPremium: false, icon: 'TrendingUp',   defaultFor: ['online_teaching','hybrid'] },

  // COLLEGE-SPECIFIC
  { key: 'mod_departments',    name: 'Departments',          description: 'Department management',                  category: 'college',  isPremium: false, icon: 'Layers',       defaultFor: ['college'] },
  { key: 'mod_semesters',      name: 'Semester System',      description: 'Semester-based academic structure',      category: 'college',  isPremium: false, icon: 'Calendar',     defaultFor: ['college'] },
  { key: 'mod_internal_marks', name: 'Internal Marks',       description: 'Internal assessment marks entry',        category: 'college',  isPremium: false, icon: 'ClipboardCheck',defaultFor: ['college'] },
  { key: 'mod_placement',      name: 'Placement Cell',       description: 'Placement and recruitment management',   category: 'college',  isPremium: true,  icon: 'Briefcase',    defaultFor: ['college'] },
  { key: 'mod_research',       name: 'Research',             description: 'Research paper submissions',             category: 'college',  isPremium: true,  icon: 'FlaskConical', defaultFor: ['college'] },
];

// ─────────────────────────────────────────────────────────────
// DEFAULT MODULE SETS PER INSTITUTION TYPE
// ─────────────────────────────────────────────────────────────
export const DEFAULT_MODULES: Record<InstitutionType, ModuleKey[]> = {
  school: [
    'core_auth','core_dashboard','core_messaging','core_notices',
    'core_notifications','core_ai_notes','core_profile',
    'mod_timetable','mod_attendance','mod_assignments','mod_exams',
    'mod_online_exams','mod_syllabus','mod_previous_papers',
    'mod_online_classes','mod_enrollment','mod_fee_management',
    'mod_leave','mod_student_dir','mod_reports',
    'mod_gradebook','mod_daily_diary','mod_parent_comm',
  ],
  coaching: [
    'core_auth','core_dashboard','core_messaging','core_notices',
    'core_notifications','core_ai_notes','core_profile',
    'mod_batches','mod_attendance','mod_assignments','mod_exams',
    'mod_test_series','mod_online_exams','mod_doubt_sessions',
    'mod_rankings','mod_study_material','mod_fee_management',
    'mod_enrollment','mod_reports','mod_online_classes','mod_certificates',
    'mod_gradebook','mod_parent_comm',
  ],
  online_teaching: [
    'core_auth','core_dashboard','core_messaging','core_notices',
    'core_notifications','core_ai_notes','core_profile',
    'mod_courses','mod_subscriptions','mod_live_streaming',
    'mod_content_library','mod_progress_track','mod_assignments',
    'mod_online_exams','mod_certificates','mod_reports','mod_recorded_content',
  ],
  college: [
    'core_auth','core_dashboard','core_messaging','core_notices',
    'core_notifications','core_ai_notes','core_profile',
    'mod_departments','mod_semesters','mod_timetable','mod_attendance',
    'mod_assignments','mod_exams','mod_online_exams','mod_syllabus',
    'mod_internal_marks','mod_fee_management','mod_leave','mod_enrollment',
    'mod_placement','mod_reports','mod_library','mod_hostel','mod_student_dir',
    'mod_gradebook','mod_daily_diary','mod_parent_comm',
  ],
  tuition: [
    'core_auth','core_dashboard','core_messaging','core_notices',
    'core_notifications','core_ai_notes','core_profile',
    'mod_timetable','mod_attendance','mod_assignments',
    'mod_fee_management','mod_reports','mod_student_dir',
  ],
  hybrid: [
    'core_auth','core_dashboard','core_messaging','core_notices',
    'core_notifications','core_ai_notes','core_profile',
    'mod_timetable','mod_attendance','mod_assignments','mod_exams',
    'mod_online_exams','mod_syllabus','mod_online_classes',
    'mod_live_streaming','mod_recorded_content','mod_courses',
    'mod_progress_track','mod_enrollment','mod_fee_management',
    'mod_leave','mod_student_dir','mod_reports','mod_certificates',
    'mod_gradebook','mod_daily_diary','mod_parent_comm',
  ],
};

// ─────────────────────────────────────────────────────────────
// INSTITUTION TYPE LABELS (for UI display)
// ─────────────────────────────────────────────────────────────
export const INSTITUTION_TYPE_LABELS: Record<InstitutionType, {
  label: string;
  description: string;
  icon: string;
  color: string;
  // Terminology overrides
  terms: {
    class: string;       // Class | Batch | Course | Department
    section: string;     // Section | Slot | Module | Semester
    teacher: string;     // Teacher | Faculty | Instructor | Professor
    student: string;     // Student | Learner | Candidate
    exam: string;        // Exam | Test | Quiz | Assessment
    timetable: string;   // Timetable | Schedule | Calendar
  };
}> = {
  school: {
    label: 'School',
    description: 'K-12 schools with full academic management',
    icon: 'School',
    color: 'from-teal-500 to-teal-700',
    terms: { class: 'Class', section: 'Section', teacher: 'Teacher', student: 'Student', exam: 'Exam', timetable: 'Timetable' },
  },
  coaching: {
    label: 'Coaching Institute',
    description: 'Competitive exam coaching and test series',
    icon: 'Target',
    color: 'from-orange-500 to-orange-700',
    terms: { class: 'Batch', section: 'Slot', teacher: 'Faculty', student: 'Candidate', exam: 'Test', timetable: 'Schedule' },
  },
  online_teaching: {
    label: 'Online Teaching',
    description: 'Digital-first online learning platform',
    icon: 'Globe',
    color: 'from-blue-500 to-blue-700',
    terms: { class: 'Course', section: 'Module', teacher: 'Instructor', student: 'Learner', exam: 'Quiz', timetable: 'Calendar' },
  },
  college: {
    label: 'College / University',
    description: 'Higher education with departments and semesters',
    icon: 'GraduationCap',
    color: 'from-purple-500 to-purple-700',
    terms: { class: 'Department', section: 'Semester', teacher: 'Professor', student: 'Student', exam: 'Internal', timetable: 'Timetable' },
  },
  tuition: {
    label: 'Tuition Center',
    description: 'Small tuition centers and home tutoring',
    icon: 'BookOpen',
    color: 'from-green-500 to-green-700',
    terms: { class: 'Class', section: 'Batch', teacher: 'Tutor', student: 'Student', exam: 'Test', timetable: 'Schedule' },
  },
  hybrid: {
    label: 'Hybrid Institute',
    description: 'Combines offline and online teaching',
    icon: 'Layers',
    color: 'from-indigo-500 to-indigo-700',
    terms: { class: 'Class', section: 'Section', teacher: 'Teacher', student: 'Student', exam: 'Exam', timetable: 'Timetable' },
  },
};

// ─────────────────────────────────────────────────────────────
// HELPER: Get modules for an institution type
// ─────────────────────────────────────────────────────────────
export function getDefaultModules(type: InstitutionType): ModuleKey[] {
  return DEFAULT_MODULES[type] || DEFAULT_MODULES.school;
}

// ─────────────────────────────────────────────────────────────
// HELPER: Check if a module is enabled
// ─────────────────────────────────────────────────────────────
export function isModuleEnabled(
  enabledModules: ModuleKey[],
  moduleKey: ModuleKey
): boolean {
  return enabledModules.includes(moduleKey);
}

// ─────────────────────────────────────────────────────────────
// HELPER: Get modules by category
// ─────────────────────────────────────────────────────────────
export function getModulesByCategory(category: ModuleDef['category']): ModuleDef[] {
  return MODULE_CATALOG.filter(m => m.category === category);
}

// ─────────────────────────────────────────────────────────────
// HELPER: Get term for institution type
// ─────────────────────────────────────────────────────────────
export function getTerm(
  type: InstitutionType,
  term: keyof typeof INSTITUTION_TYPE_LABELS[InstitutionType]['terms']
): string {
  return INSTITUTION_TYPE_LABELS[type]?.terms[term] || term;
}
