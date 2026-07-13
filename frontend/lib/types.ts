// ============================================================
// BUILDROONIX — TypeScript Types (mirrors DB schema)
// Use these types across frontend & future backend API
// ============================================================

// ─────────────────────────────────────────────────────────────
// ROLES
// ─────────────────────────────────────────────────────────────
export type UserRole = 'superadmin' | 'school_admin' | 'teacher' | 'student';

export type SubscriptionPlan = 'trial' | 'basic' | 'pro' | 'enterprise';
export type SubscriptionStatus = 'active' | 'expired' | 'suspended' | 'trial';

// ─────────────────────────────────────────────────────────────
// MASTER DB TYPES (Buildroonix level)
// ─────────────────────────────────────────────────────────────

export interface SuperAdmin {
  id: string;
  name: string;
  email: string;
  phone?: string;
  isActive: boolean;
  createdAt: string;
}

export interface Institution {
  id: string;
  name: string;
  slug: string;                    // "greenwood" → greenwood.buildroonix.com
  logoUrl?: string;
  address?: string;
  city?: string;
  state?: string;
  country: string;
  phone?: string;
  email?: string;
  website?: string;
  dbName: string;                  // tenant DB name
  subscriptionPlan: SubscriptionPlan;
  subscriptionStatus: SubscriptionStatus;
  trialEndsAt?: string;
  subscriptionEndsAt?: string;
  maxStudents: number;
  maxTeachers: number;
  isActive: boolean;
  onboardedAt: string;
  createdBy: string;               // superadmin ID
}

export interface SubscriptionPlanDef {
  id: string;
  name: SubscriptionPlan;
  displayName: string;
  priceMonthly: number;
  priceYearly?: number;
  maxStudents: number;
  maxTeachers: number;
  features: {
    aiNotes: boolean;
    onlineExams: boolean;
    onlineClasses: boolean;
    feeManagement: boolean;
    advancedReports: boolean;
    customBranding: boolean;
    apiAccess: boolean;
  };
}

export interface BillingInvoice {
  id: string;
  institutionId: string;
  planId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentMethod?: string;
  paymentReference?: string;
  invoiceDate: string;
  dueDate?: string;
  paidAt?: string;
}

// ─────────────────────────────────────────────────────────────
// TENANT DB TYPES (Institution level)
// ─────────────────────────────────────────────────────────────

export interface User {
  id: string;
  institutionId: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  avatarUrl?: string;
  gender?: 'Male' | 'Female' | 'Other';
  dateOfBirth?: string;
  bloodGroup?: string;
  address?: string;
  emergencyPhone?: string;
  joiningDate?: string;
  isActive: boolean;
  lastLoginAt?: string;
  createdAt: string;
}

export interface TeacherProfile {
  id: string;
  userId: string;
  employeeId?: string;
  qualification?: string;
  specialization?: string;
  experienceYears: number;
  designation?: string;
  department?: string;
}

export interface StudentProfile {
  id: string;
  userId: string;
  rollNumber?: string;
  admissionNumber?: string;
  classId?: string;
  sectionId?: string;
  parentName?: string;
  parentPhone?: string;
  parentEmail?: string;
  admissionDate?: string;
  feeStatus: 'paid' | 'pending' | 'partial';
}

export interface AcademicYear {
  id: string;
  institutionId: string;
  name: string;                    // "2026-2027"
  startDate: string;
  endDate: string;
  isCurrent: boolean;
}

export interface Department {
  id: string;
  institutionId: string;
  name: string;
  code?: string;
  headTeacherId?: string;
  isActive: boolean;
}

export interface Class {
  id: string;
  institutionId: string;
  academicYearId: string;
  departmentId?: string;
  name: string;                    // "IOT-2026"
  displayName?: string;
  classTeacherId?: string;
  maxStudents: number;
  isActive: boolean;
}

export interface Section {
  id: string;
  classId: string;
  name: string;                    // "Evening" | "Morning" | "A" | "B"
  teacherId?: string;
  roomNumber?: string;
  maxStudents: number;
}

export interface Subject {
  id: string;
  institutionId: string;
  departmentId?: string;
  name: string;                    // "IoT & Embedded System"
  code: string;                    // "IOT101"
  description?: string;
  credits: number;
  type: 'theory' | 'practical' | 'both';
  isActive: boolean;
}

export interface ClassSubject {
  id: string;
  classId: string;
  subjectId: string;
  teacherId?: string;
  academicYearId: string;
}

export interface TimetableSlot {
  id: string;
  institutionId: string;
  classId: string;
  sectionId?: string;
  subjectId: string;
  teacherId: string;
  dayOfWeek: 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun';
  periodName?: string;             // "Evening Period"
  startTime: string;               // "20:30"
  endTime: string;                 // "21:30"
  roomNumber?: string;
  academicYearId: string;
  isActive: boolean;
}

export interface AttendanceRecord {
  id: string;
  institutionId: string;
  studentId: string;
  classId: string;
  sectionId?: string;
  subjectId?: string;
  timetableSlotId?: string;
  teacherId: string;
  date: string;                    // "2026-07-06"
  status: 'present' | 'absent' | 'late' | 'excused';
  remarks?: string;
  markedAt: string;
}

export interface Assignment {
  id: string;
  institutionId: string;
  teacherId: string;
  classId: string;
  sectionId?: string;
  subjectId: string;
  title: string;
  description?: string;
  type: 'assignment' | 'homework' | 'project';
  dueDate: string;
  maxMarks: number;
  attachmentUrl?: string;
  status: 'active' | 'closed' | 'draft';
  academicYearId: string;
  createdAt: string;
}

export interface AssignmentSubmission {
  id: string;
  assignmentId: string;
  studentId: string;
  submissionUrl?: string;
  submissionText?: string;
  submittedAt: string;
  marksObtained?: number;
  feedback?: string;
  gradedBy?: string;
  gradedAt?: string;
  status: 'submitted' | 'graded' | 'late' | 'missing';
}

export interface Exam {
  id: string;
  institutionId: string;
  classId: string;
  sectionId?: string;
  subjectId: string;
  teacherId: string;
  academicYearId: string;
  title: string;
  examType: 'midterm' | 'final' | 'unit_test' | 'online';
  examDate: string;
  startTime?: string;
  durationMins?: number;
  maxMarks: number;
  passingMarks?: number;
  roomNumber?: string;
  instructions?: string;
  status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
}

export interface ExamResult {
  id: string;
  examId: string;
  studentId: string;
  marksObtained?: number;
  grade?: string;
  remarks?: string;
  isAbsent: boolean;
  enteredBy: string;
  enteredAt: string;
}

export interface LeaveRequest {
  id: string;
  institutionId: string;
  userId: string;
  leaveType: 'sick' | 'casual' | 'earned' | 'emergency' | 'maternity';
  fromDate: string;
  toDate: string;
  totalDays?: number;
  reason?: string;
  attachmentUrl?: string;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  reviewedBy?: string;
  reviewedAt?: string;
  reviewRemarks?: string;
  createdAt: string;
}

export interface Notice {
  id: string;
  institutionId: string;
  createdBy: string;
  title: string;
  content: string;
  targetRole: 'all' | 'teacher' | 'student' | 'school_admin';
  targetClassId?: string;
  attachmentUrl?: string;
  isPublished: boolean;
  publishedAt: string;
  expiresAt?: string;
}

export interface Message {
  id: string;
  institutionId: string;
  senderId: string;
  receiverId: string;
  content: string;
  attachmentUrl?: string;
  isRead: boolean;
  readAt?: string;
  createdAt: string;
}

export interface OnlineClass {
  id: string;
  institutionId: string;
  teacherId: string;
  classId: string;
  sectionId?: string;
  subjectId: string;
  title: string;
  description?: string;
  platform: 'zoom' | 'google_meet' | 'teams' | 'custom';
  meetingLink?: string;
  meetingId?: string;
  scheduledAt: string;
  durationMins: number;
  status: 'scheduled' | 'live' | 'completed' | 'cancelled';
  recordingUrl?: string;
}

export interface Holiday {
  id: string;
  institutionId: string;
  academicYearId: string;
  name: string;
  holidayDate: string;
  type: 'national' | 'regional' | 'institution';
  description?: string;
}

export interface EnrollmentRequest {
  id: string;
  institutionId: string;
  studentName: string;
  email: string;
  phone?: string;
  dateOfBirth?: string;
  classId?: string;
  parentName?: string;
  parentPhone?: string;
  documentsUrl?: string[];
  status: 'pending' | 'approved' | 'rejected' | 'waitlisted';
  reviewedBy?: string;
  reviewedAt?: string;
  remarks?: string;
  appliedAt: string;
}

export interface Notification {
  id: string;
  institutionId: string;
  userId: string;
  title: string;
  body?: string;
  type: 'assignment' | 'exam' | 'attendance' | 'notice' | 'message' | 'leave';
  referenceId?: string;
  isRead: boolean;
  readAt?: string;
  createdAt: string;
}

export interface FeeStructure {
  id: string;
  institutionId: string;
  classId: string;
  academicYearId: string;
  feeType: string;
  amount: number;
  dueDate?: string;
  isMandatory: boolean;
}

export interface FeePayment {
  id: string;
  institutionId: string;
  studentId: string;
  feeStructureId: string;
  amountPaid: number;
  paymentDate: string;
  paymentMethod: 'cash' | 'online' | 'cheque' | 'dd';
  transactionRef?: string;
  receiptNumber?: string;
  collectedBy: string;
  status: 'paid' | 'partial' | 'pending' | 'refunded';
}

export interface AiNotesHistory {
  id: string;
  institutionId: string;
  userId: string;
  subjectId?: string;
  topic: string;
  generatedNotes: string;
  tokensUsed?: number;
  createdAt: string;
}

// ─────────────────────────────────────────────────────────────
// API RESPONSE WRAPPERS
// ─────────────────────────────────────────────────────────────
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// ─────────────────────────────────────────────────────────────
// AUTH TYPES
// ─────────────────────────────────────────────────────────────
export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  institutionId?: string;          // null for superadmin
  institutionSlug?: string;
  institutionName?: string;
  phone?: string;
  joiningDate?: string;
  qualification?: string;
  bloodGroup?: string;
  gender?: string;
  emergencyPhone?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
  institutionSlug?: string;        // required for school_admin/teacher/student
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

// ─────────────────────────────────────────────────────────────
// STUDENT-SPECIFIC TYPES
// ─────────────────────────────────────────────────────────────

export interface StudentLeaveRequest {
  id: string;
  institutionId: string;
  studentId: string;
  leaveType: 'sick' | 'casual' | 'emergency' | 'personal';
  fromDate: string;
  toDate: string;
  totalDays: number;
  reason: string;
  attachmentUrl?: string;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  reviewedBy?: string;
  reviewedAt?: string;
  reviewRemarks?: string;
  appliedOn: string;
}

export interface AppNotification {
  id: string;
  institutionId: string;
  userId: string;
  title: string;
  body: string;
  type: 'assignment' | 'exam' | 'attendance' | 'notice' | 'fee' | 'result' | 'leave' | 'class';
  referenceId?: string;
  isRead: boolean;
  readAt?: string;
  createdAt: string;
}

export interface SubjectAttendanceSummary {
  studentId: string;
  subjectId: string;
  subjectName: string;
  subjectCode: string;
  teacherName: string;
  totalClasses: number;
  attended: number;
  percentage: number;
  lastAbsent?: string;
}

export interface ReportCard {
  id: string;
  institutionId: string;
  studentId: string;
  classId: string;
  academicYearId: string;
  term: 'mid_term' | 'final' | 'annual';
  totalMarks: number;
  obtainedMarks: number;
  percentage: number;
  grade: string;
  rankInClass?: number;
  attendancePercent?: number;
  teacherRemarks?: string;
  principalRemarks?: string;
  isPublished: boolean;
  publishedAt?: string;
  subjects: ReportCardSubject[];
}

export interface ReportCardSubject {
  id: string;
  reportCardId: string;
  subjectId: string;
  subjectName: string;
  subjectCode: string;
  unitTest1?: number;
  unitTest2?: number;
  midTerm?: number;
  finalExam?: number;
  practical?: number;
  totalObtained: number;
  totalMax: number;
  grade: string;
  remarks?: string;
}

export interface StudentDocument {
  id: string;
  institutionId: string;
  studentId: string;
  documentType: 'admit_card' | 'certificate' | 'id_card' | 'marksheet' | 'other';
  title: string;
  fileUrl: string;
  academicYearId?: string;
  uploadedBy: string;
  isVerified: boolean;
  createdAt: string;
}

// ─────────────────────────────────────────────────────────────
// NEW FEATURE TYPES (Features 1–8)
// ─────────────────────────────────────────────────────────────

export interface StudyMaterial {
  id: string;
  institutionId: string;
  teacherId: string;
  classId: string;
  subjectId: string;
  academicYearId: string;
  title: string;
  description?: string;
  type: 'pdf' | 'video' | 'doc' | 'ppt' | 'link';
  fileUrl: string;
  fileSize?: string;
  chapter?: string;
  isPublished: boolean;
  viewCount: number;
  createdAt: string;
}

export interface Doubt {
  id: string;
  institutionId: string;
  studentId: string;
  subjectId: string;
  classId: string;
  title: string;
  description: string;
  tags: string[];
  status: 'open' | 'answered' | 'closed';
  viewCount: number;
  createdAt: string;
  replies: DoubtReply[];
}

export interface DoubtReply {
  id: string;
  doubtId: string;
  authorId: string;
  authorName: string;
  authorRole: 'teacher' | 'student';
  content: string;
  isAccepted: boolean;
  upvotes: number;
  createdAt: string;
}

export interface AdmitCard {
  id: string;
  institutionId: string;
  examId: string;
  studentId: string;
  rollNumber: string;
  roomNumber: string;
  seatNumber?: string;
  instructions: string[];
  isIssued: boolean;
  issuedOn?: string;
  issuedBy?: string;
}

export interface Certificate {
  id: string;
  institutionId: string;
  studentId: string;
  title: string;
  description?: string;
  type: 'academic' | 'attendance' | 'participation' | 'achievement' | 'completion';
  issuedOn: string;
  issuedBy: string;
  academicYearId?: string;
  grade?: string;
  certificateUrl?: string;
  isPublished: boolean;
}

export interface Feedback {
  id: string;
  institutionId: string;
  studentId: string;
  targetType: 'teacher' | 'class' | 'subject' | 'institution';
  targetId: string;
  rating: 1 | 2 | 3 | 4 | 5;
  comment?: string;
  isAnonymous: boolean;
  academicYearId?: string;
  createdAt: string;
}

export interface ParentProfile {
  id: string;
  userId: string;
  relation: 'father' | 'mother' | 'guardian';
  occupation?: string;
  annualIncome?: number;
  education?: string;
}

export interface StudentParentLink {
  id: string;
  institutionId: string;
  studentId: string;
  parentId: string;
  relation: 'father' | 'mother' | 'guardian';
  isPrimary: boolean;
  canPickup: boolean;
}

export interface FeeReceipt {
  id: string;
  institutionId: string;
  feePaymentId: string;
  studentId: string;
  receiptNumber: string;
  amount: number;
  paymentDate: string;
  paymentMethod: string;
  feeDescription: string;
  generatedBy: string;
  receiptUrl?: string;
  createdAt: string;
}

// ─────────────────────────────────────────────────────────────
// TEACHER ENHANCEMENT TYPES (Gradebook, Daily Diary, Parent Comm)
// ─────────────────────────────────────────────────────────────

export interface GradebookEntry {
  id: string;
  institutionId: string;
  teacherId: string;
  studentId: string;
  classId: string;
  subjectId: string;
  academicYearId: string;
  unitTest1?: number;
  unitTest2?: number;
  midTerm?: number;
  finalExam?: number;
  assignment?: number;
  practical?: number;
  totalObtained: number;
  totalMax: number;
  percentage: number;
  grade: string;
  remarks?: string;
  lastUpdated: string;
}

export interface DailyDiary {
  id: string;
  institutionId: string;
  teacherId: string;
  classId: string;
  sectionId?: string;
  subjectId: string;
  date: string;                      // "2026-07-08"
  topicsCovered: string;
  classwork?: string;
  homework?: string;
  remarks?: string;
  isPublished: boolean;
  createdAt: string;
}

export interface ParentMessage {
  id: string;
  institutionId: string;
  teacherId: string;
  studentId: string;
  parentId?: string;
  subject: string;
  body: string;
  category: 'attendance' | 'behavior' | 'academic' | 'fee' | 'general';
  priority: 'normal' | 'important' | 'urgent';
  attachmentUrl?: string;
  isBroadcast: boolean;
  classId?: string;                  // for broadcast messages
  isRead: boolean;
  readAt?: string;
  createdAt: string;
}

// ─────────────────────────────────────────────────────────────
// SUPPORT STAFF & STAFF PAYROLL SCHEMAS
// ─────────────────────────────────────────────────────────────
export interface SupportStaff {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'guard' | 'driver' | 'receptionist' | 'cleaner' | 'accountant' | 'helper';
  joiningDate: string;
  salary: number;
  isActive: boolean;
  busNumber?: string;
  shift?: 'morning' | 'evening' | 'night';
}

export interface StaffPayroll {
  id: string;
  staffId: string;
  staffName: string;
  role: string;
  basicSalary: number;
  allowances: number;
  deductions: number;
  netSalary: number;
  month: string;
  year: number;
  status: 'paid' | 'pending' | 'processing';
  paidOn?: string;
  paymentMethod?: 'bank_transfer' | 'cash' | 'cheque';
}

