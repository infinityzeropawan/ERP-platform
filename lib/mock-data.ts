import { type SupportStaff, type StaffPayroll } from './types';
export type UserRole = 'superadmin' | 'teacher' | 'student';

export interface Student {
  id: string; name: string; class: string; section: string; rollNo: string;
  email: string; phone: string; attendance: number; password: string;
  fatherName: string; motherName: string; dob: string; gender: string;
  address: string; bloodGroup: string; busNumber: string; busRoute: string;
  admissionDate: string; profileColor: string;
}

export interface Teacher {
  id: string; name: string; email: string; phone: string;
  subject: string; qualification: string; joiningDate: string;
}

export interface Assignment {
  id: string; title: string; class: string; subject: string;
  dueDate: string; maxMarks: number; status: 'active' | 'closed' | 'draft';
  description: string; submittedBy?: string[];
}

export interface Period {
  id: string; name: string; time: string; subject: string;
  subjectCode: string; class: string; room: string; teacherName: string;
}

export interface Timetable { [day: string]: Period[]; }

export interface ChatMessage {
  id: string; sender: string; senderId: string; text: string; time: string; isOwn: boolean;
}

export interface Holiday { id: string; name: string; date: string; type: string; }

export interface Notice {
  id: string; title: string; content: string; date: string;
  author: string; priority: 'high' | 'medium' | 'low'; category: string;
}

export interface Exam {
  id: string; subject: string; date: string; time: string;
  duration: string; maxMarks: number; room: string; syllabus: string;
}

export interface Result {
  id: string; subject: string; maxMarks: number; obtainedMarks: number;
  grade: string; examType: string; date: string; remarks: string;
}

export interface FeeRecord {
  id: string; title: string; amount: number; dueDate: string;
  paidDate?: string; status: 'paid' | 'pending' | 'overdue';
  receiptNo?: string; paymentMode?: string;
}

export interface EnrollmentRequest {
  id: string; studentName: string; email: string; class: string;
  date: string; status: 'pending' | 'approved' | 'rejected';
}

export interface OnlineClass {
  id: string; subject: string; teacherName: string; date: string;
  time: string; duration: string; meetLink: string; status: 'live' | 'upcoming' | 'completed';
  recordingUrl?: string;
}

export interface PreviousPaper {
  id: string; subject: string; year: string; examType: string;
  downloadUrl: string; pages: number;
}

export const studentsList: Student[] = [
  { id: 'std-001', name: 'Aarav Sharma', class: 'IOT-2026', section: 'Evening', rollNo: '001', email: 'aarav@student.com', phone: '9876543210', attendance: 85, password: 'aarav123', fatherName: 'Rajesh Sharma', motherName: 'Sunita Sharma', dob: '2005-03-15', gender: 'Male', address: '12, Sector 5, Noida, UP', bloodGroup: 'B+', busNumber: 'BUS-07', busRoute: 'Noida Sector 5 → School', admissionDate: '2024-07-01', profileColor: 'from-teal-400 to-teal-600' },
  { id: 'std-002', name: 'Priya Patel', class: 'IOT-2026', section: 'Evening', rollNo: '002', email: 'priya@student.com', phone: '9876543211', attendance: 92, password: 'priya123', fatherName: 'Suresh Patel', motherName: 'Meena Patel', dob: '2005-06-22', gender: 'Female', address: '45, Lajpat Nagar, Delhi', bloodGroup: 'A+', busNumber: 'BUS-03', busRoute: 'Lajpat Nagar → School', admissionDate: '2024-07-01', profileColor: 'from-pink-400 to-pink-600' },
  { id: 'std-003', name: 'Rohan Verma', class: 'IOT-2026', section: 'Evening', rollNo: '003', email: 'rohan@student.com', phone: '9876543212', attendance: 78, password: 'rohan123', fatherName: 'Anil Verma', motherName: 'Kavita Verma', dob: '2005-01-10', gender: 'Male', address: '78, Vasundhara, Ghaziabad', bloodGroup: 'O+', busNumber: 'BUS-11', busRoute: 'Vasundhara → School', admissionDate: '2024-07-01', profileColor: 'from-blue-400 to-blue-600' },
  { id: 'std-004', name: 'Sneha Gupta', class: 'IOT-2026', section: 'Evening', rollNo: '004', email: 'sneha@student.com', phone: '9876543213', attendance: 95, password: 'sneha123', fatherName: 'Deepak Gupta', motherName: 'Rekha Gupta', dob: '2005-09-05', gender: 'Female', address: '23, Indirapuram, Ghaziabad', bloodGroup: 'AB+', busNumber: 'BUS-11', busRoute: 'Indirapuram → School', admissionDate: '2024-07-01', profileColor: 'from-purple-400 to-purple-600' },
  { id: 'std-005', name: 'Karan Singh', class: 'IOT-2026', section: 'Evening', rollNo: '005', email: 'karan@student.com', phone: '9876543214', attendance: 70, password: 'karan123', fatherName: 'Harpal Singh', motherName: 'Gurpreet Singh', dob: '2005-11-18', gender: 'Male', address: '56, Rajouri Garden, Delhi', bloodGroup: 'B-', busNumber: 'BUS-02', busRoute: 'Rajouri Garden → School', admissionDate: '2024-07-01', profileColor: 'from-orange-400 to-orange-600' },
  { id: 'std-006', name: 'Ananya Mishra', class: 'IOT-2026', section: 'Evening', rollNo: '006', email: 'ananya@student.com', phone: '9876543215', attendance: 88, password: 'ananya123', fatherName: 'Vivek Mishra', motherName: 'Priti Mishra', dob: '2005-04-30', gender: 'Female', address: '90, Dwarka Sector 12, Delhi', bloodGroup: 'A-', busNumber: 'BUS-05', busRoute: 'Dwarka → School', admissionDate: '2024-07-01', profileColor: 'from-green-400 to-green-600' },
  { id: 'std-007', name: 'Vikram Yadav', class: 'IOT-2026', section: 'Evening', rollNo: '007', email: 'vikram@student.com', phone: '9876543216', attendance: 60, password: 'vikram123', fatherName: 'Ramesh Yadav', motherName: 'Sushma Yadav', dob: '2005-07-14', gender: 'Male', address: '34, Rohini Sector 3, Delhi', bloodGroup: 'O-', busNumber: 'BUS-08', busRoute: 'Rohini → School', admissionDate: '2024-07-01', profileColor: 'from-red-400 to-red-600' },
  { id: 'std-008', name: 'Pooja Joshi', class: 'IOT-2026', section: 'Evening', rollNo: '008', email: 'pooja@student.com', phone: '9876543217', attendance: 97, password: 'pooja123', fatherName: 'Mahesh Joshi', motherName: 'Asha Joshi', dob: '2005-02-28', gender: 'Female', address: '67, Pitampura, Delhi', bloodGroup: 'B+', busNumber: 'BUS-08', busRoute: 'Pitampura → School', admissionDate: '2024-07-01', profileColor: 'from-indigo-400 to-indigo-600' },
  { id: 'std-009', name: 'Amit Kumar', class: 'IOT-2026', section: 'Evening', rollNo: '009', email: 'amit@student.com', phone: '9876543218', attendance: 82, password: 'amit123', fatherName: 'Sunil Kumar', motherName: 'Anita Kumar', dob: '2005-08-20', gender: 'Male', address: '11, Janakpuri, Delhi', bloodGroup: 'AB-', busNumber: 'BUS-04', busRoute: 'Janakpuri → School', admissionDate: '2024-07-01', profileColor: 'from-cyan-400 to-cyan-600' },
  { id: 'std-010', name: 'Divya Nair', class: 'IOT-2026', section: 'Evening', rollNo: '010', email: 'divya@student.com', phone: '9876543219', attendance: 91, password: 'divya123', fatherName: 'Krishnan Nair', motherName: 'Lakshmi Nair', dob: '2005-05-12', gender: 'Female', address: '88, Mayur Vihar, Delhi', bloodGroup: 'A+', busNumber: 'BUS-06', busRoute: 'Mayur Vihar → School', admissionDate: '2024-07-01', profileColor: 'from-yellow-400 to-yellow-600' },
];

export const teachers: Teacher[] = [
  { id: 'tch-001', name: 'Pawan Kumar Dubey', email: 'pawan@buildroonix.com', phone: '9580181697', subject: 'IOT & Embedded Systems', qualification: 'M.Tech (Electronics)', joiningDate: '2024-06-01' },
  { id: 'tch-002', name: 'Samer Khan', email: 'samer@buildroonix.com', phone: '9876500001', subject: 'Embedded C Programming', qualification: 'B.Tech (CS)', joiningDate: '2024-06-01' },
  { id: 'tch-003', name: 'Ritu Sharma', email: 'ritu@buildroonix.com', phone: '9876500002', subject: 'Network Protocols', qualification: 'M.Sc (Networks)', joiningDate: '2024-07-01' },
];

export const timetable: Timetable = {
  Mon: [{ id: 'p1', name: 'Period 1', time: '8:30 PM – 9:30 PM', subject: 'IOT & Embedded Systems', subjectCode: 'IOT101', class: 'IOT-2026 – Evening', room: 'Lab-3', teacherName: 'Pawan Kumar Dubey' }],
  Tue: [{ id: 'p2', name: 'Period 1', time: '8:30 PM – 9:30 PM', subject: 'Embedded C Programming', subjectCode: 'IOT102', class: 'IOT-2026 – Evening', room: 'Lab-3', teacherName: 'Samer Khan' }],
  Wed: [{ id: 'p3', name: 'Period 1', time: '8:30 PM – 9:30 PM', subject: 'Network Protocols', subjectCode: 'IOT103', class: 'IOT-2026 – Evening', room: 'Room-5', teacherName: 'Ritu Sharma' }],
  Thu: [{ id: 'p4', name: 'Period 1', time: '8:30 PM – 9:30 PM', subject: 'IOT & Embedded Systems', subjectCode: 'IOT101', class: 'IOT-2026 – Evening', room: 'Lab-3', teacherName: 'Pawan Kumar Dubey' }],
  Fri: [{ id: 'p5', name: 'Period 1', time: '8:30 PM – 9:30 PM', subject: 'Embedded C Programming', subjectCode: 'IOT102', class: 'IOT-2026 – Evening', room: 'Lab-3', teacherName: 'Samer Khan' }],
  Sat: [],
  Sun: [],
};

export const assignments: Assignment[] = [
  { id: 'asgn-001', title: 'IoT Sensor Integration', class: 'IOT-2026', subject: 'IOT101', dueDate: '2026-07-15', maxMarks: 50, status: 'active', description: 'Integrate DHT11 sensor with Arduino and display temperature/humidity readings on LCD.', submittedBy: ['std-002', 'std-004'] },
  { id: 'asgn-002', title: 'Embedded C LED Blink', class: 'IOT-2026', subject: 'IOT102', dueDate: '2026-07-20', maxMarks: 100, status: 'active', description: 'Write a program to blink LED at 1Hz using embedded C on STM32.', submittedBy: [] },
  { id: 'asgn-003', title: 'MQTT Protocol Report', class: 'IOT-2026', subject: 'IOT101', dueDate: '2026-07-10', maxMarks: 30, status: 'closed', description: 'Write a detailed report on MQTT protocol with diagrams.', submittedBy: ['std-001', 'std-002', 'std-003', 'std-004', 'std-005'] },
];

export const chatMessages: ChatMessage[] = [
  { id: 'msg-001', sender: 'Pawan Kumar Dubey', senderId: 'tch-001', text: 'Hello class! Assignment 1 deadline is July 15th.', time: '8:30 PM', isOwn: false },
  { id: 'msg-002', sender: 'Aarav Sharma', senderId: 'std-001', text: 'Sir, can we submit in PDF format?', time: '8:31 PM', isOwn: true },
  { id: 'msg-003', sender: 'Pawan Kumar Dubey', senderId: 'tch-001', text: 'Yes, PDF or Word both are accepted.', time: '8:32 PM', isOwn: false },
  { id: 'msg-004', sender: 'Priya Patel', senderId: 'std-002', text: 'Thank you sir!', time: '8:33 PM', isOwn: false },
  { id: 'msg-005', sender: 'Aarav Sharma', senderId: 'std-001', text: 'Thank you sir!', time: '8:34 PM', isOwn: true },
];

export const holidays: Holiday[] = [
  { id: 'hol-001', name: 'Independence Day', date: '15 Aug 2026', type: 'National' },
  { id: 'hol-002', name: 'Janmashtami', date: '4 Sept 2026', type: 'Religious' },
  { id: 'hol-003', name: 'Milad-un-Nabi', date: '25 Sept 2026', type: 'Religious' },
  { id: 'hol-004', name: 'Gandhi Jayanti', date: '2 Oct 2026', type: 'National' },
  { id: 'hol-005', name: 'Dussehra', date: '21 Oct 2026', type: 'Festival' },
  { id: 'hol-006', name: 'Diwali', date: '8 Nov 2026', type: 'Festival' },
];

export const notices: Notice[] = [
  { id: 'ntc-001', title: 'Exam Schedule Released', content: 'The final exam schedule for IOT-2026 batch has been released. Please check the exam section for details. All students must carry their ID cards.', date: '2026-06-25', author: 'Admin', priority: 'high', category: 'Exam' },
  { id: 'ntc-002', title: 'Fee Payment Reminder', content: 'Last date for Q2 fee payment is July 31st. Late fee of ₹500 will be charged after the due date.', date: '2026-06-20', author: 'Accounts', priority: 'high', category: 'Fee' },
  { id: 'ntc-003', title: 'Holiday Notice – Independence Day', content: 'School will remain closed on Independence Day (15 Aug 2026). Classes will resume on 16 Aug 2026.', date: '2026-06-15', author: 'Admin', priority: 'medium', category: 'Holiday' },
  { id: 'ntc-004', title: 'New Lab Equipment Available', content: 'New Arduino Mega kits and Raspberry Pi 4 boards are now available in Lab-3 for student use during lab hours.', date: '2026-06-10', author: 'Lab Incharge', priority: 'low', category: 'General' },
];

export const upcomingExams: Exam[] = [
  { id: 'exam-001', subject: 'IOT & Embedded Systems', date: '2026-08-10', time: '10:00 AM', duration: '3 Hours', maxMarks: 100, room: 'Hall-A', syllabus: 'Unit 1-4: Sensors, Arduino, MQTT, Cloud Integration' },
  { id: 'exam-002', subject: 'Embedded C Programming', date: '2026-08-12', time: '2:00 PM', duration: '2 Hours', maxMarks: 50, room: 'Lab-3', syllabus: 'Unit 1-3: Pointers, Interrupts, Timers' },
  { id: 'exam-003', subject: 'Network Protocols', date: '2026-08-15', time: '10:00 AM', duration: '2 Hours', maxMarks: 50, room: 'Room-5', syllabus: 'Unit 1-2: TCP/IP, HTTP, MQTT, CoAP' },
];

export const studentResults: Result[] = [
  { id: 'res-001', subject: 'IOT & Embedded Systems', maxMarks: 100, obtainedMarks: 82, grade: 'A', examType: 'Mid Term', date: '2026-03-15', remarks: 'Excellent performance' },
  { id: 'res-002', subject: 'Embedded C Programming', maxMarks: 50, obtainedMarks: 44, grade: 'A+', examType: 'Mid Term', date: '2026-03-17', remarks: 'Outstanding' },
  { id: 'res-003', subject: 'Network Protocols', maxMarks: 50, obtainedMarks: 38, grade: 'B+', examType: 'Mid Term', date: '2026-03-19', remarks: 'Good, improve on TCP/IP' },
  { id: 'res-004', subject: 'IOT & Embedded Systems', maxMarks: 100, obtainedMarks: 91, grade: 'A+', examType: 'Unit Test 1', date: '2026-01-20', remarks: 'Excellent' },
  { id: 'res-005', subject: 'Embedded C Programming', maxMarks: 50, obtainedMarks: 47, grade: 'A+', examType: 'Unit Test 1', date: '2026-01-22', remarks: 'Perfect score almost!' },
];

export const feeRecords: FeeRecord[] = [
  { id: 'fee-001', title: 'Admission Fee', amount: 5000, dueDate: '2024-07-01', paidDate: '2024-07-01', status: 'paid', receiptNo: 'RCP-2024-001', paymentMode: 'Online' },
  { id: 'fee-002', title: 'Q1 Tuition Fee (Jul–Sep 2024)', amount: 12000, dueDate: '2024-07-15', paidDate: '2024-07-10', status: 'paid', receiptNo: 'RCP-2024-002', paymentMode: 'Online' },
  { id: 'fee-003', title: 'Q2 Tuition Fee (Oct–Dec 2024)', amount: 12000, dueDate: '2024-10-15', paidDate: '2024-10-12', status: 'paid', receiptNo: 'RCP-2024-003', paymentMode: 'UPI' },
  { id: 'fee-004', title: 'Q3 Tuition Fee (Jan–Mar 2025)', amount: 12000, dueDate: '2025-01-15', paidDate: '2025-01-14', status: 'paid', receiptNo: 'RCP-2025-001', paymentMode: 'Bank Transfer' },
  { id: 'fee-005', title: 'Q4 Tuition Fee (Apr–Jun 2025)', amount: 12000, dueDate: '2025-04-15', paidDate: '2025-04-15', status: 'paid', receiptNo: 'RCP-2025-002', paymentMode: 'Online' },
  { id: 'fee-006', title: 'Q1 Tuition Fee (Jul–Sep 2025)', amount: 13000, dueDate: '2025-07-15', paidDate: '2025-07-20', status: 'paid', receiptNo: 'RCP-2025-003', paymentMode: 'UPI' },
  { id: 'fee-007', title: 'Q2 Tuition Fee (Oct–Dec 2025)', amount: 13000, dueDate: '2025-10-15', paidDate: '2025-10-10', status: 'paid', receiptNo: 'RCP-2025-004', paymentMode: 'Online' },
  { id: 'fee-008', title: 'Q3 Tuition Fee (Jan–Mar 2026)', amount: 13000, dueDate: '2026-01-15', paidDate: '2026-01-13', status: 'paid', receiptNo: 'RCP-2026-001', paymentMode: 'UPI' },
  { id: 'fee-009', title: 'Q4 Tuition Fee (Apr–Jun 2026)', amount: 13000, dueDate: '2026-04-15', paidDate: '2026-04-14', status: 'paid', receiptNo: 'RCP-2026-002', paymentMode: 'Online' },
  { id: 'fee-010', title: 'Q1 Tuition Fee (Jul–Sep 2026)', amount: 14000, dueDate: '2026-07-31', status: 'pending' },
  { id: 'fee-011', title: 'Lab Fee 2026', amount: 3000, dueDate: '2026-08-15', status: 'pending' },
  { id: 'fee-012', title: 'Exam Fee 2026', amount: 1500, dueDate: '2026-07-20', status: 'overdue' },
];

export const onlineClasses: OnlineClass[] = [
  { id: 'oc-001', subject: 'IOT & Embedded Systems', teacherName: 'Pawan Kumar Dubey', date: '2026-07-08', time: '8:30 PM', duration: '60 min', meetLink: 'https://meet.google.com/abc-defg-hij', status: 'live' },
  { id: 'oc-002', subject: 'Embedded C Programming', teacherName: 'Samer Khan', date: '2026-07-09', time: '8:30 PM', duration: '60 min', meetLink: 'https://meet.google.com/xyz-uvwx-yz1', status: 'upcoming' },
  { id: 'oc-003', subject: 'Network Protocols', teacherName: 'Ritu Sharma', date: '2026-07-10', time: '8:30 PM', duration: '60 min', meetLink: 'https://meet.google.com/lmn-opqr-stu', status: 'upcoming' },
  { id: 'oc-004', subject: 'IOT & Embedded Systems', teacherName: 'Pawan Kumar Dubey', date: '2026-07-01', time: '8:30 PM', duration: '60 min', meetLink: '#', status: 'completed', recordingUrl: 'https://drive.google.com/rec-001' },
  { id: 'oc-005', subject: 'Embedded C Programming', teacherName: 'Samer Khan', date: '2026-07-02', time: '8:30 PM', duration: '60 min', meetLink: '#', status: 'completed', recordingUrl: 'https://drive.google.com/rec-002' },
];

export const previousPapers: PreviousPaper[] = [
  { id: 'pp-001', subject: 'IOT & Embedded Systems', year: '2025', examType: 'Final Exam', downloadUrl: '#', pages: 8 },
  { id: 'pp-002', subject: 'IOT & Embedded Systems', year: '2024', examType: 'Final Exam', downloadUrl: '#', pages: 6 },
  { id: 'pp-003', subject: 'Embedded C Programming', year: '2025', examType: 'Final Exam', downloadUrl: '#', pages: 5 },
  { id: 'pp-004', subject: 'Embedded C Programming', year: '2024', examType: 'Mid Term', downloadUrl: '#', pages: 4 },
  { id: 'pp-005', subject: 'Network Protocols', year: '2025', examType: 'Final Exam', downloadUrl: '#', pages: 7 },
  { id: 'pp-006', subject: 'Network Protocols', year: '2024', examType: 'Unit Test', downloadUrl: '#', pages: 3 },
];

export const enrollmentRequests: EnrollmentRequest[] = [
  { id: 'enr-001', studentName: 'Rahul Mehta', email: 'rahul@example.com', class: 'IOT-2026', date: '2026-06-20', status: 'pending' },
  { id: 'enr-002', studentName: 'Sunita Rao', email: 'sunita@example.com', class: 'IOT-2026', date: '2026-06-22', status: 'pending' },
  { id: 'enr-003', studentName: 'Manoj Tiwari', email: 'manoj@example.com', class: 'CS-2026', date: '2026-06-18', status: 'approved' },
];

export const contacts = [
  { id: 'c-001', name: 'Pawan Kumar Dubey', role: 'Teacher', lastMessage: 'Assignment deadline is July 15th', time: '8:30 PM', unread: 1, online: true },
  { id: 'c-002', name: 'Samer Khan', role: 'Teacher', lastMessage: 'Lab session tomorrow at 8:30 PM', time: '7:15 PM', unread: 0, online: true },
  { id: 'c-003', name: 'Ritu Sharma', role: 'Teacher', lastMessage: 'Check the syllabus update', time: '6:00 PM', unread: 2, online: false },
  { id: 'c-004', name: 'School Admin', role: 'Admin', lastMessage: 'Fee payment reminder', time: 'Yesterday', unread: 1, online: false },
  { id: 'c-005', name: 'Priya Patel', role: 'Student', lastMessage: 'Did you complete assignment 2?', time: '5:00 PM', unread: 0, online: true },
];

export const adminStats = {
  totalStudents: 248, totalTeachers: 18, totalClasses: 12, activeEnrollments: 3,
  presentToday: 210, absentToday: 38, pendingAssignments: 24, upcomingExams: 5,
};

// ── SYLLABUS ──────────────────────────────────────────────────
export interface SyllabusUnit {
  id: string; subject: string; subjectCode: string; unitNo: number;
  unitTitle: string; topics: string[]; totalHours: number; completedHours: number;
  status: 'pending' | 'in_progress' | 'completed';
}

export const syllabusUnits: SyllabusUnit[] = [
  { id: 'syl-001', subject: 'IOT & Embedded Systems', subjectCode: 'IOT101', unitNo: 1, unitTitle: 'Introduction to IoT', topics: ['IoT Architecture', 'Sensors & Actuators', 'Microcontrollers Overview'], totalHours: 10, completedHours: 10, status: 'completed' },
  { id: 'syl-002', subject: 'IOT & Embedded Systems', subjectCode: 'IOT101', unitNo: 2, unitTitle: 'Arduino & ESP32', topics: ['Arduino IDE', 'GPIO Programming', 'ESP32 WiFi', 'DHT11 Sensor'], totalHours: 12, completedHours: 8, status: 'in_progress' },
  { id: 'syl-003', subject: 'IOT & Embedded Systems', subjectCode: 'IOT101', unitNo: 3, unitTitle: 'Communication Protocols', topics: ['MQTT', 'HTTP REST', 'CoAP', 'Zigbee'], totalHours: 10, completedHours: 0, status: 'pending' },
  { id: 'syl-004', subject: 'IOT & Embedded Systems', subjectCode: 'IOT101', unitNo: 4, unitTitle: 'Cloud Integration', topics: ['AWS IoT Core', 'ThingSpeak', 'Node-RED', 'Dashboard'], totalHours: 8, completedHours: 0, status: 'pending' },
  { id: 'syl-005', subject: 'Embedded C Programming', subjectCode: 'IOT102', unitNo: 1, unitTitle: 'C Fundamentals', topics: ['Pointers', 'Structures', 'Bit Manipulation'], totalHours: 8, completedHours: 8, status: 'completed' },
  { id: 'syl-006', subject: 'Embedded C Programming', subjectCode: 'IOT102', unitNo: 2, unitTitle: 'Interrupts & Timers', topics: ['ISR', 'Timer0/1/2', 'PWM Generation'], totalHours: 10, completedHours: 5, status: 'in_progress' },
  { id: 'syl-007', subject: 'Network Protocols', subjectCode: 'IOT103', unitNo: 1, unitTitle: 'TCP/IP Stack', topics: ['OSI Model', 'TCP vs UDP', 'IP Addressing', 'Subnetting'], totalHours: 10, completedHours: 10, status: 'completed' },
  { id: 'syl-008', subject: 'Network Protocols', subjectCode: 'IOT103', unitNo: 2, unitTitle: 'Application Protocols', topics: ['HTTP/HTTPS', 'WebSocket', 'MQTT Deep Dive'], totalHours: 8, completedHours: 3, status: 'in_progress' },
];

// ── LESSON PLANS ──────────────────────────────────────────────
export interface LessonPlan {
  id: string; subject: string; subjectCode: string; topic: string;
  objectives: string; content: string; teachingAids: string;
  plannedDate: string; durationMins: number; status: 'draft' | 'approved' | 'completed';
}

export const lessonPlans: LessonPlan[] = [
  { id: 'lp-001', subject: 'IOT & Embedded Systems', subjectCode: 'IOT101', topic: 'MQTT Protocol Deep Dive', objectives: 'Students will understand publish/subscribe model and implement MQTT on ESP32', content: 'Theory: MQTT broker, topics, QoS levels. Practical: Connect ESP32 to Mosquitto broker', teachingAids: 'Whiteboard, ESP32 kit, Laptop, Projector', plannedDate: '2026-07-10', durationMins: 60, status: 'approved' },
  { id: 'lp-002', subject: 'IOT & Embedded Systems', subjectCode: 'IOT101', topic: 'DHT11 Sensor Integration', objectives: 'Read temperature and humidity data and display on LCD', content: 'Hands-on: Wire DHT11 to Arduino, write sketch, display on 16x2 LCD', teachingAids: 'Arduino Mega, DHT11, LCD, Breadboard', plannedDate: '2026-07-14', durationMins: 60, status: 'draft' },
  { id: 'lp-003', subject: 'Embedded C Programming', subjectCode: 'IOT102', topic: 'Timer Interrupts on AVR', objectives: 'Configure Timer0 for 1Hz interrupt and toggle LED', content: 'Theory: Timer registers, prescaler. Practical: Write ISR for LED blink', teachingAids: 'ATmega328, Oscilloscope, Breadboard', plannedDate: '2026-07-08', durationMins: 60, status: 'completed' },
];

// ── ONLINE EXAMS (MCQ) ────────────────────────────────────────
export interface MCQQuestion {
  id: string; question: string; options: string[]; correctIndex: number; marks: number;
}

export interface OnlineExam {
  id: string; title: string; subject: string; subjectCode: string;
  durationMins: number; totalMarks: number; passingMarks: number;
  scheduledAt: string; status: 'upcoming' | 'live' | 'completed';
  questions: MCQQuestion[];
}

export const onlineExams: OnlineExam[] = [
  {
    id: 'oe-001', title: 'IoT Unit 1 Quiz', subject: 'IOT & Embedded Systems', subjectCode: 'IOT101',
    durationMins: 30, totalMarks: 20, passingMarks: 12, scheduledAt: '2026-07-12T20:30:00', status: 'upcoming',
    questions: [
      { id: 'q1', question: 'What does IoT stand for?', options: ['Internet of Things', 'Intranet of Things', 'Interface of Technology', 'Internet of Technology'], correctIndex: 0, marks: 2 },
      { id: 'q2', question: 'Which protocol is used for lightweight messaging in IoT?', options: ['HTTP', 'FTP', 'MQTT', 'SMTP'], correctIndex: 2, marks: 2 },
      { id: 'q3', question: 'DHT11 sensor measures:', options: ['Pressure & Altitude', 'Temperature & Humidity', 'Light & Sound', 'Motion & Distance'], correctIndex: 1, marks: 2 },
      { id: 'q4', question: 'ESP32 supports which wireless protocol?', options: ['Zigbee only', 'Bluetooth only', 'WiFi only', 'WiFi & Bluetooth'], correctIndex: 3, marks: 2 },
      { id: 'q5', question: 'MQTT uses which communication model?', options: ['Client-Server', 'Publish-Subscribe', 'Peer-to-Peer', 'Request-Response'], correctIndex: 1, marks: 2 },
    ],
  },
  {
    id: 'oe-002', title: 'Embedded C Mid Quiz', subject: 'Embedded C Programming', subjectCode: 'IOT102',
    durationMins: 20, totalMarks: 10, passingMarks: 6, scheduledAt: '2026-07-15T20:30:00', status: 'upcoming',
    questions: [
      { id: 'q1', question: 'Which register controls data direction in AVR?', options: ['PORT', 'PIN', 'DDR', 'TCCR'], correctIndex: 2, marks: 2 },
      { id: 'q2', question: 'ISR stands for:', options: ['Interrupt Service Routine', 'Internal System Register', 'Input Signal Register', 'Interrupt Signal Reset'], correctIndex: 0, marks: 2 },
      { id: 'q3', question: 'PWM stands for:', options: ['Pulse Width Modulation', 'Power Width Management', 'Pulse Wave Mode', 'Power Wave Modulation'], correctIndex: 0, marks: 2 },
    ],
  },
  {
    id: 'oe-003', title: 'Network Protocols Quiz', subject: 'Network Protocols', subjectCode: 'IOT103',
    durationMins: 25, totalMarks: 15, passingMarks: 9, scheduledAt: '2026-07-05T20:30:00', status: 'completed',
    questions: [
      { id: 'q1', question: 'How many layers does the OSI model have?', options: ['5', '6', '7', '8'], correctIndex: 2, marks: 3 },
      { id: 'q2', question: 'TCP is a __ protocol.', options: ['Connectionless', 'Connection-oriented', 'Broadcast', 'Multicast'], correctIndex: 1, marks: 3 },
      { id: 'q3', question: 'Default port for HTTP is:', options: ['21', '22', '80', '443'], correctIndex: 2, marks: 3 },
    ],
  },
];

// ── PAYROLL (Teacher) ─────────────────────────────────────────
export interface PayrollRecord {
  id: string; month: string; year: number; basicSalary: number;
  hra: number; da: number; otherAllowances: number;
  pf: number; tds: number; otherDeductions: number;
  netSalary: number; status: 'paid' | 'pending' | 'processing';
  paidOn?: string; slipNo: string;
}

export const payrollRecords: PayrollRecord[] = [
  { id: 'pay-001', month: 'January', year: 2026, basicSalary: 35000, hra: 8750, da: 3500, otherAllowances: 2000, pf: 4200, tds: 1500, otherDeductions: 500, netSalary: 43050, status: 'paid', paidOn: '2026-01-31', slipNo: 'SLP-2026-01' },
  { id: 'pay-002', month: 'February', year: 2026, basicSalary: 35000, hra: 8750, da: 3500, otherAllowances: 2000, pf: 4200, tds: 1500, otherDeductions: 500, netSalary: 43050, status: 'paid', paidOn: '2026-02-28', slipNo: 'SLP-2026-02' },
  { id: 'pay-003', month: 'March', year: 2026, basicSalary: 35000, hra: 8750, da: 3500, otherAllowances: 2000, pf: 4200, tds: 1500, otherDeductions: 500, netSalary: 43050, status: 'paid', paidOn: '2026-03-31', slipNo: 'SLP-2026-03' },
  { id: 'pay-004', month: 'April', year: 2026, basicSalary: 38000, hra: 9500, da: 3800, otherAllowances: 2000, pf: 4560, tds: 1800, otherDeductions: 500, netSalary: 46440, status: 'paid', paidOn: '2026-04-30', slipNo: 'SLP-2026-04' },
  { id: 'pay-005', month: 'May', year: 2026, basicSalary: 38000, hra: 9500, da: 3800, otherAllowances: 2000, pf: 4560, tds: 1800, otherDeductions: 500, netSalary: 46440, status: 'paid', paidOn: '2026-05-31', slipNo: 'SLP-2026-05' },
  { id: 'pay-006', month: 'June', year: 2026, basicSalary: 38000, hra: 9500, da: 3800, otherAllowances: 2000, pf: 4560, tds: 1800, otherDeductions: 500, netSalary: 46440, status: 'paid', paidOn: '2026-06-30', slipNo: 'SLP-2026-06' },
  { id: 'pay-007', month: 'July', year: 2026, basicSalary: 38000, hra: 9500, da: 3800, otherAllowances: 2000, pf: 4560, tds: 1800, otherDeductions: 500, netSalary: 46440, status: 'processing', slipNo: 'SLP-2026-07' },
];

// ── EXAM RESULTS (for teacher to enter) ──────────────────────
export interface ExamWithResults {
  id: string; subject: string; subjectCode: string; examType: string;
  date: string; time: string; duration: string; maxMarks: number;
  passingMarks: number; room: string; syllabus: string;
  status: 'scheduled' | 'completed';
  results?: { studentId: string; marks: number; grade: string; remarks: string }[];
}

export const examsWithResults: ExamWithResults[] = [
  {
    id: 'exr-001', subject: 'IOT & Embedded Systems', subjectCode: 'IOT101', examType: 'Unit Test 1',
    date: '2026-06-20', time: '8:30 PM', duration: '1 Hour', maxMarks: 25, passingMarks: 10,
    room: 'Lab-3', syllabus: 'Unit 1: IoT Architecture, Sensors', status: 'completed',
    results: [
      { studentId: 'std-001', marks: 22, grade: 'A+', remarks: 'Excellent' },
      { studentId: 'std-002', marks: 20, grade: 'A', remarks: 'Very Good' },
      { studentId: 'std-003', marks: 15, grade: 'B', remarks: 'Good' },
      { studentId: 'std-004', marks: 23, grade: 'A+', remarks: 'Outstanding' },
      { studentId: 'std-005', marks: 12, grade: 'C', remarks: 'Needs improvement' },
    ],
  },
  {
    id: 'exr-002', subject: 'Embedded C Programming', subjectCode: 'IOT102', examType: 'Unit Test 1',
    date: '2026-06-22', time: '8:30 PM', duration: '1 Hour', maxMarks: 25, passingMarks: 10,
    room: 'Lab-3', syllabus: 'Unit 1: C Fundamentals, Pointers', status: 'completed',
    results: [
      { studentId: 'std-001', marks: 18, grade: 'A', remarks: 'Good' },
      { studentId: 'std-002', marks: 24, grade: 'A+', remarks: 'Excellent' },
      { studentId: 'std-003', marks: 14, grade: 'B', remarks: 'Average' },
    ],
  },
  {
    id: 'exr-003', subject: 'IOT & Embedded Systems', subjectCode: 'IOT101', examType: 'Mid Term',
    date: '2026-08-10', time: '10:00 AM', duration: '3 Hours', maxMarks: 100, passingMarks: 40,
    room: 'Hall-A', syllabus: 'Unit 1-4', status: 'scheduled',
  },
  {
    id: 'exr-004', subject: 'Embedded C Programming', subjectCode: 'IOT102', examType: 'Mid Term',
    date: '2026-08-12', time: '2:00 PM', duration: '2 Hours', maxMarks: 50, passingMarks: 20,
    room: 'Lab-3', syllabus: 'Unit 1-3', status: 'scheduled',
  },
];

// ── SUPERADMIN MOCK DATA ──────────────────────────────────────
export interface BillingInvoice {
  id: string; institutionName: string; plan: string; amount: number;
  status: 'paid' | 'pending' | 'overdue'; date: string; dueDate: string;
}

export const billingInvoices: BillingInvoice[] = [
  { id: 'inv-001', institutionName: 'Greenwood High School', plan: 'Pro', amount: 4999, status: 'paid', date: '2026-06-01', dueDate: '2026-06-15' },
  { id: 'inv-002', institutionName: 'Allen Coaching Center', plan: 'Enterprise', amount: 9999, status: 'paid', date: '2026-06-01', dueDate: '2026-06-15' },
  { id: 'inv-003', institutionName: 'LearnOnline Academy', plan: 'Basic', amount: 1999, status: 'pending', date: '2026-07-01', dueDate: '2026-07-15' },
  { id: 'inv-004', institutionName: 'ABC Engineering College', plan: 'Enterprise', amount: 9999, status: 'paid', date: '2026-06-01', dueDate: '2026-06-15' },
  { id: 'inv-005', institutionName: 'Sunrise Tuition Center', plan: 'Basic', amount: 1999, status: 'overdue', date: '2026-05-01', dueDate: '2026-05-15' },
  { id: 'inv-006', institutionName: 'Greenwood High School', plan: 'Pro', amount: 4999, status: 'pending', date: '2026-07-01', dueDate: '2026-07-15' },
];

export interface PlatformAnnouncement {
  id: string; title: string; content: string; targetType: 'all' | 'school' | 'coaching' | 'college';
  createdAt: string; isActive: boolean;
}

export const platformAnnouncements: PlatformAnnouncement[] = [
  { id: 'ann-001', title: 'New Feature: Online Exam Builder', content: 'We have launched a new MCQ-based online exam builder. All Pro and Enterprise institutions can now create timed online exams with auto-grading.', targetType: 'all', createdAt: '2026-07-01', isActive: true },
  { id: 'ann-002', title: 'Scheduled Maintenance – July 20', content: 'Platform will be under maintenance on July 20, 2026 from 2:00 AM to 4:00 AM IST. Please plan accordingly.', targetType: 'all', createdAt: '2026-07-05', isActive: true },
  { id: 'ann-003', title: 'AI Notes Generator Upgrade', content: 'AI Notes Generator now supports 10 more subjects and generates structured notes with diagrams. Available for all plans.', targetType: 'all', createdAt: '2026-06-20', isActive: false },
];

// ── ADMIN (SCHOOL_ADMIN) MOCK DATA ────────────────────────────
export interface ClassSection {
  id: string; className: string; section: string; classTeacher: string;
  totalStudents: number; room: string; isActive: boolean;
}

export const classSections: ClassSection[] = [
  { id: 'cls-001', className: 'IOT-2026', section: 'Evening', classTeacher: 'Pawan Kumar Dubey', totalStudents: 10, room: 'Lab-3', isActive: true },
  { id: 'cls-002', className: 'CS-2026', section: 'Morning', classTeacher: 'Samer Khan', totalStudents: 8, room: 'Room-2', isActive: true },
  { id: 'cls-003', className: 'MECH-2026', section: 'Afternoon', classTeacher: 'Ritu Sharma', totalStudents: 12, room: 'Room-5', isActive: false },
];

export interface TeacherPayroll {
  id: string; teacherName: string; designation: string; basicSalary: number;
  netSalary: number; month: string; year: number; status: 'paid' | 'pending' | 'processing';
  paidOn?: string;
}

export const teacherPayrolls: TeacherPayroll[] = [
  { id: 'tp-001', teacherName: 'Pawan Kumar Dubey', designation: 'Senior Teacher', basicSalary: 38000, netSalary: 46440, month: 'July', year: 2026, status: 'processing' },
  { id: 'tp-002', teacherName: 'Samer Khan', designation: 'Teacher', basicSalary: 30000, netSalary: 36500, month: 'July', year: 2026, status: 'pending' },
  { id: 'tp-003', teacherName: 'Ritu Sharma', designation: 'Teacher', basicSalary: 28000, netSalary: 34200, month: 'July', year: 2026, status: 'pending' },
  { id: 'tp-004', teacherName: 'Pawan Kumar Dubey', designation: 'Senior Teacher', basicSalary: 38000, netSalary: 46440, month: 'June', year: 2026, status: 'paid', paidOn: '2026-06-30' },
  { id: 'tp-005', teacherName: 'Samer Khan', designation: 'Teacher', basicSalary: 30000, netSalary: 36500, month: 'June', year: 2026, status: 'paid', paidOn: '2026-06-30' },
  { id: 'tp-006', teacherName: 'Ritu Sharma', designation: 'Teacher', basicSalary: 28000, netSalary: 34200, month: 'June', year: 2026, status: 'paid', paidOn: '2026-06-30' },
];

export interface FeeCollection {
  id: string; studentName: string; rollNo: string; feeType: string;
  amount: number; dueDate: string; paidDate?: string;
  status: 'paid' | 'pending' | 'overdue'; receiptNo?: string;
}

export const feeCollections: FeeCollection[] = [
  { id: 'fc-001', studentName: 'Aarav Sharma', rollNo: '001', feeType: 'Q1 Tuition Fee', amount: 14000, dueDate: '2026-07-31', status: 'pending' },
  { id: 'fc-002', studentName: 'Priya Patel', rollNo: '002', feeType: 'Q1 Tuition Fee', amount: 14000, dueDate: '2026-07-31', paidDate: '2026-07-05', status: 'paid', receiptNo: 'RCP-2026-101' },
  { id: 'fc-003', studentName: 'Rohan Verma', rollNo: '003', feeType: 'Q1 Tuition Fee', amount: 14000, dueDate: '2026-07-31', status: 'pending' },
  { id: 'fc-004', studentName: 'Sneha Gupta', rollNo: '004', feeType: 'Q1 Tuition Fee', amount: 14000, dueDate: '2026-07-31', paidDate: '2026-07-02', status: 'paid', receiptNo: 'RCP-2026-102' },
  { id: 'fc-005', studentName: 'Karan Singh', rollNo: '005', feeType: 'Exam Fee', amount: 1500, dueDate: '2026-07-20', status: 'overdue' },
  { id: 'fc-006', studentName: 'Ananya Mishra', rollNo: '006', feeType: 'Q1 Tuition Fee', amount: 14000, dueDate: '2026-07-31', paidDate: '2026-07-08', status: 'paid', receiptNo: 'RCP-2026-103' },
  { id: 'fc-007', studentName: 'Vikram Yadav', rollNo: '007', feeType: 'Exam Fee', amount: 1500, dueDate: '2026-07-20', status: 'overdue' },
  { id: 'fc-008', studentName: 'Pooja Joshi', rollNo: '008', feeType: 'Q1 Tuition Fee', amount: 14000, dueDate: '2026-07-31', paidDate: '2026-07-01', status: 'paid', receiptNo: 'RCP-2026-104' },
];

// ── STUDENT LEAVE REQUESTS ────────────────────────────────────
export interface StudentLeaveRequest {
  id: string; leaveType: 'sick' | 'casual' | 'emergency' | 'personal';
  fromDate: string; toDate: string; totalDays: number;
  reason: string; status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  appliedOn: string; reviewedBy?: string; reviewRemarks?: string;
}

export const studentLeaveRequests: StudentLeaveRequest[] = [
  { id: 'slv-001', leaveType: 'sick', fromDate: '2026-06-10', toDate: '2026-06-11', totalDays: 2, reason: 'High fever and cold. Doctor advised rest for 2 days.', status: 'approved', appliedOn: '2026-06-09', reviewedBy: 'Pawan Kumar Dubey', reviewRemarks: 'Approved. Get well soon.' },
  { id: 'slv-002', leaveType: 'casual', fromDate: '2026-06-25', toDate: '2026-06-25', totalDays: 1, reason: 'Family function — sister\'s engagement ceremony.', status: 'approved', appliedOn: '2026-06-22', reviewedBy: 'Pawan Kumar Dubey', reviewRemarks: 'Approved.' },
  { id: 'slv-003', leaveType: 'personal', fromDate: '2026-07-18', toDate: '2026-07-19', totalDays: 2, reason: 'Need to visit hometown for urgent family matter.', status: 'pending', appliedOn: '2026-07-10' },
  { id: 'slv-004', leaveType: 'emergency', fromDate: '2026-05-05', toDate: '2026-05-05', totalDays: 1, reason: 'Medical emergency in family.', status: 'rejected', appliedOn: '2026-05-05', reviewedBy: 'Pawan Kumar Dubey', reviewRemarks: 'Applied on same day — please apply in advance.' },
];

// ── ASSIGNMENT SUBMISSIONS ────────────────────────────────────
export interface AssignmentSubmission {
  id: string; assignmentId: string; submittedAt: string;
  submissionText: string; status: 'submitted' | 'graded' | 'late' | 'missing';
  marksObtained?: number; feedback?: string; gradedAt?: string;
}

export const assignmentSubmissions: AssignmentSubmission[] = [
  { id: 'sub-001', assignmentId: 'asgn-003', submittedAt: '2026-07-09T20:15:00', submissionText: 'MQTT (Message Queuing Telemetry Transport) is a lightweight publish-subscribe messaging protocol...', status: 'graded', marksObtained: 27, feedback: 'Excellent report! Diagrams are very clear. Minor improvement needed in QoS section.', gradedAt: '2026-07-11' },
];

// ── SUBJECT-WISE ATTENDANCE ───────────────────────────────────
export interface SubjectAttendance {
  subjectCode: string; subjectName: string; teacherName: string;
  totalClasses: number; attended: number; percentage: number;
  lastAbsent?: string;
}

export const subjectAttendance: SubjectAttendance[] = [
  { subjectCode: 'IOT101', subjectName: 'IOT & Embedded Systems', teacherName: 'Pawan Kumar Dubey', totalClasses: 28, attended: 25, percentage: 89, lastAbsent: '2026-06-10' },
  { subjectCode: 'IOT102', subjectName: 'Embedded C Programming', teacherName: 'Samer Khan', totalClasses: 24, attended: 17, percentage: 71, lastAbsent: '2026-07-02' },
  { subjectCode: 'IOT103', subjectName: 'Network Protocols', teacherName: 'Ritu Sharma', totalClasses: 20, attended: 18, percentage: 90, lastAbsent: '2026-06-25' },
];

// ── NOTIFICATIONS ─────────────────────────────────────────────
export interface AppNotification {
  id: string; title: string; body: string;
  type: 'assignment' | 'exam' | 'attendance' | 'notice' | 'fee' | 'result' | 'leave' | 'class';
  isRead: boolean; createdAt: string; referenceId?: string;
}

export const appNotifications: AppNotification[] = [
  { id: 'notif-001', title: 'New Assignment Posted', body: 'IoT Sensor Integration assignment has been posted. Due: July 15, 2026.', type: 'assignment', isRead: false, createdAt: '2026-07-08T09:00:00', referenceId: 'asgn-001' },
  { id: 'notif-002', title: 'Exam Reminder', body: 'IOT & Embedded Systems exam is scheduled on Aug 10. Syllabus: Unit 1-4.', type: 'exam', isRead: false, createdAt: '2026-07-07T10:00:00', referenceId: 'exam-001' },
  { id: 'notif-003', title: 'Fee Due Alert', body: 'Q1 Tuition Fee of ₹14,000 is due on July 31, 2026. Please pay on time.', type: 'fee', isRead: false, createdAt: '2026-07-06T08:00:00' },
  { id: 'notif-004', title: 'Attendance Warning', body: 'Your attendance in Embedded C Programming is 71% — below the 75% minimum. Please attend regularly.', type: 'attendance', isRead: true, createdAt: '2026-07-05T11:00:00' },
  { id: 'notif-005', title: 'Result Published', body: 'Your Mid Term result for IOT & Embedded Systems has been published. Score: 82/100.', type: 'result', isRead: true, createdAt: '2026-06-20T14:00:00', referenceId: 'res-001' },
  { id: 'notif-006', title: 'Leave Approved', body: 'Your sick leave request (Jun 10-11) has been approved by Pawan Kumar Dubey.', type: 'leave', isRead: true, createdAt: '2026-06-09T16:00:00', referenceId: 'slv-001' },
  { id: 'notif-007', title: 'Online Class Starting Soon', body: 'IOT & Embedded Systems online class starts in 30 minutes. Join via Google Meet.', type: 'class', isRead: true, createdAt: '2026-07-08T20:00:00', referenceId: 'oc-001' },
  { id: 'notif-008', title: 'Assignment Graded', body: 'Your MQTT Protocol Report has been graded. Marks: 27/30. Check feedback.', type: 'assignment', isRead: true, createdAt: '2026-07-11T12:00:00', referenceId: 'asgn-003' },
  { id: 'notif-009', title: 'New Notice Posted', body: 'Exam Schedule Released — Final exam schedule for IOT-2026 batch is now available.', type: 'notice', isRead: false, createdAt: '2026-06-25T09:00:00' },
];

// ── REPORT CARD ───────────────────────────────────────────────
export interface ReportCardEntry {
  subject: string; subjectCode: string;
  unitTest1?: number; unitTest2?: number; midTerm?: number; finalExam?: number;
  maxUT: number; maxMid: number; maxFinal: number;
  totalObtained: number; totalMax: number;
  grade: string; percentage: number; remarks: string;
}

export const reportCardData: ReportCardEntry[] = [
  { subject: 'IOT & Embedded Systems', subjectCode: 'IOT101', unitTest1: 22, unitTest2: 20, midTerm: 82, maxUT: 25, maxMid: 100, maxFinal: 100, totalObtained: 124, totalMax: 150, grade: 'A', percentage: 83, remarks: 'Excellent' },
  { subject: 'Embedded C Programming', subjectCode: 'IOT102', unitTest1: 18, unitTest2: 21, midTerm: 44, maxUT: 25, maxMid: 50, maxFinal: 50, totalObtained: 83, totalMax: 125, grade: 'A+', percentage: 86, remarks: 'Outstanding' },
  { subject: 'Network Protocols', subjectCode: 'IOT103', unitTest1: 16, unitTest2: 18, midTerm: 38, maxUT: 25, maxMid: 50, maxFinal: 50, totalObtained: 72, totalMax: 125, grade: 'B+', percentage: 78, remarks: 'Good' },
];

// ── STUDY MATERIALS ───────────────────────────────────────────
export interface StudyMaterial {
  id: string; subjectCode: string; subjectName: string;
  title: string; description: string; type: 'pdf' | 'video' | 'doc' | 'ppt' | 'link';
  fileUrl: string; fileSize?: string; uploadedBy: string;
  uploadedAt: string; chapter?: string; isNew?: boolean;
}

export const studyMaterials: StudyMaterial[] = [
  { id: 'sm-001', subjectCode: 'IOT101', subjectName: 'IOT & Embedded Systems', title: 'Unit 1 - IoT Architecture Notes', description: 'Complete notes covering IoT layers, sensors, actuators and microcontrollers.', type: 'pdf', fileUrl: '#', fileSize: '2.4 MB', uploadedBy: 'Pawan Kumar Dubey', uploadedAt: '2026-07-01', chapter: 'Unit 1', isNew: false },
  { id: 'sm-002', subjectCode: 'IOT101', subjectName: 'IOT & Embedded Systems', title: 'Arduino Programming Guide', description: 'Step-by-step guide for Arduino IDE setup and GPIO programming.', type: 'pdf', fileUrl: '#', fileSize: '1.8 MB', uploadedBy: 'Pawan Kumar Dubey', uploadedAt: '2026-07-05', chapter: 'Unit 2', isNew: true },
  { id: 'sm-003', subjectCode: 'IOT101', subjectName: 'IOT & Embedded Systems', title: 'MQTT Protocol - Video Lecture', description: 'Recorded lecture on MQTT publish-subscribe model with live demo.', type: 'video', fileUrl: '#', uploadedBy: 'Pawan Kumar Dubey', uploadedAt: '2026-07-08', chapter: 'Unit 3', isNew: true },
  { id: 'sm-004', subjectCode: 'IOT101', subjectName: 'IOT & Embedded Systems', title: 'ESP32 Datasheet', description: 'Official ESP32 technical datasheet with pinout and specifications.', type: 'pdf', fileUrl: '#', fileSize: '5.1 MB', uploadedBy: 'Pawan Kumar Dubey', uploadedAt: '2026-06-28', chapter: 'Unit 2' },
  { id: 'sm-005', subjectCode: 'IOT102', subjectName: 'Embedded C Programming', title: 'Pointers & Memory Management', description: 'Detailed notes on pointer arithmetic, dynamic memory, and common pitfalls.', type: 'pdf', fileUrl: '#', fileSize: '1.2 MB', uploadedBy: 'Samer Khan', uploadedAt: '2026-07-02', chapter: 'Unit 1' },
  { id: 'sm-006', subjectCode: 'IOT102', subjectName: 'Embedded C Programming', title: 'Timer & Interrupt Slides', description: 'PPT slides covering Timer0/1/2 configuration and ISR writing.', type: 'ppt', fileUrl: '#', fileSize: '3.5 MB', uploadedBy: 'Samer Khan', uploadedAt: '2026-07-06', chapter: 'Unit 2', isNew: true },
  { id: 'sm-007', subjectCode: 'IOT103', subjectName: 'Network Protocols', title: 'OSI Model Reference Sheet', description: 'Quick reference card for all 7 OSI layers with protocols at each layer.', type: 'pdf', fileUrl: '#', fileSize: '0.8 MB', uploadedBy: 'Ritu Sharma', uploadedAt: '2026-06-30', chapter: 'Unit 1' },
  { id: 'sm-008', subjectCode: 'IOT103', subjectName: 'Network Protocols', title: 'TCP/IP vs OSI Comparison', description: 'Detailed comparison document with diagrams and protocol mapping.', type: 'doc', fileUrl: '#', fileSize: '1.1 MB', uploadedBy: 'Ritu Sharma', uploadedAt: '2026-07-04', chapter: 'Unit 1', isNew: false },
];

// ── DOUBTS / Q&A ──────────────────────────────────────────────
export interface DoubtReply {
  id: string; authorName: string; authorRole: 'teacher' | 'student';
  content: string; createdAt: string; isAccepted?: boolean;
}

export interface Doubt {
  id: string; subjectCode: string; subjectName: string;
  title: string; description: string; askedBy: string;
  createdAt: string; status: 'open' | 'answered' | 'closed';
  replies: DoubtReply[]; tags: string[];
}

export const doubts: Doubt[] = [
  {
    id: 'dbt-001', subjectCode: 'IOT101', subjectName: 'IOT & Embedded Systems',
    title: 'What is the difference between MQTT QoS 0, 1 and 2?',
    description: 'I understand MQTT has 3 QoS levels but I am confused about when to use which one. Can someone explain with a real-world example?',
    askedBy: 'Aarav Sharma', createdAt: '2026-07-06T19:30:00', status: 'answered', tags: ['MQTT', 'QoS', 'Unit 3'],
    replies: [
      { id: 'r1', authorName: 'Pawan Kumar Dubey', authorRole: 'teacher', content: 'Great question! QoS 0 = fire and forget (no guarantee). QoS 1 = at least once delivery (may duplicate). QoS 2 = exactly once (slowest but guaranteed). Use QoS 0 for sensor data where occasional loss is OK, QoS 2 for critical commands like turning off a machine.', createdAt: '2026-07-06T20:15:00', isAccepted: true },
      { id: 'r2', authorName: 'Priya Patel', authorRole: 'student', content: 'Adding to sir\'s answer — QoS 2 uses a 4-step handshake which is why it\'s slower. I found this helpful!', createdAt: '2026-07-06T21:00:00' },
    ],
  },
  {
    id: 'dbt-002', subjectCode: 'IOT102', subjectName: 'Embedded C Programming',
    title: 'Why does my LED blink twice instead of once per second?',
    description: 'I wrote the timer interrupt code exactly as shown in class but my LED blinks at 2Hz instead of 1Hz. My prescaler is set to 1024.',
    askedBy: 'Rohan Verma', createdAt: '2026-07-07T18:00:00', status: 'open', tags: ['Timer', 'ISR', 'Unit 2'],
    replies: [],
  },
  {
    id: 'dbt-003', subjectCode: 'IOT101', subjectName: 'IOT & Embedded Systems',
    title: 'Can ESP32 connect to both WiFi and Bluetooth simultaneously?',
    description: 'The datasheet says ESP32 supports both WiFi and Bluetooth but I want to confirm if they can run at the same time without interference.',
    askedBy: 'Sneha Gupta', createdAt: '2026-07-05T15:00:00', status: 'answered', tags: ['ESP32', 'WiFi', 'Bluetooth'],
    replies: [
      { id: 'r3', authorName: 'Pawan Kumar Dubey', authorRole: 'teacher', content: 'Yes! ESP32 has a dual-mode radio that supports WiFi 802.11 b/g/n and Bluetooth 4.2/BLE simultaneously. They share the same 2.4GHz antenna but the chip handles coexistence internally. You can run both in your sketch without issues.', createdAt: '2026-07-05T16:30:00', isAccepted: true },
    ],
  },
  {
    id: 'dbt-004', subjectCode: 'IOT103', subjectName: 'Network Protocols',
    title: 'What is the default port for MQTT over TLS?',
    description: 'I know HTTP uses 80 and HTTPS uses 443. What ports does MQTT use for normal and secure connections?',
    askedBy: 'Karan Singh', createdAt: '2026-07-08T10:00:00', status: 'open', tags: ['MQTT', 'TLS', 'Ports'],
    replies: [
      { id: 'r4', authorName: 'Divya Nair', authorRole: 'student', content: 'From what I read — MQTT uses port 1883 for unencrypted and 8883 for TLS/SSL encrypted connections.', createdAt: '2026-07-08T11:00:00' },
    ],
  },
];

// ── ADMIT CARDS ───────────────────────────────────────────────
export interface AdmitCard {
  id: string; examId: string; subject: string; examType: string;
  examDate: string; examTime: string; duration: string;
  room: string; rollNo: string; studentName: string;
  instructions: string[]; issuedOn: string;
}

export const admitCards: AdmitCard[] = [
  {
    id: 'ac-001', examId: 'exam-001', subject: 'IOT & Embedded Systems', examType: 'Mid Term Examination',
    examDate: '2026-08-10', examTime: '10:00 AM', duration: '3 Hours',
    room: 'Examination Hall-A', rollNo: '001', studentName: 'Aarav Sharma',
    issuedOn: '2026-07-25',
    instructions: [
      'Carry this admit card to the examination hall.',
      'Report 30 minutes before the exam starts.',
      'Mobile phones and electronic devices are strictly prohibited.',
      'Bring your own pen, pencil and calculator (non-programmable).',
      'No student will be allowed entry after 15 minutes of exam start.',
    ],
  },
  {
    id: 'ac-002', examId: 'exam-002', subject: 'Embedded C Programming', examType: 'Mid Term Examination',
    examDate: '2026-08-12', examTime: '2:00 PM', duration: '2 Hours',
    room: 'Lab-3', rollNo: '001', studentName: 'Aarav Sharma',
    issuedOn: '2026-07-25',
    instructions: [
      'Carry this admit card to the examination hall.',
      'Report 30 minutes before the exam starts.',
      'Mobile phones and electronic devices are strictly prohibited.',
      'Lab practical exam — bring your lab manual.',
    ],
  },
  {
    id: 'ac-003', examId: 'exam-003', subject: 'Network Protocols', examType: 'Mid Term Examination',
    examDate: '2026-08-15', examTime: '10:00 AM', duration: '2 Hours',
    room: 'Room-5', rollNo: '001', studentName: 'Aarav Sharma',
    issuedOn: '2026-07-25',
    instructions: [
      'Carry this admit card to the examination hall.',
      'Report 30 minutes before the exam starts.',
      'Mobile phones and electronic devices are strictly prohibited.',
    ],
  },
];

// ── CERTIFICATES ──────────────────────────────────────────────
export interface Certificate {
  id: string; title: string; description: string;
  type: 'academic' | 'attendance' | 'participation' | 'achievement' | 'completion';
  issuedOn: string; issuedBy: string; grade?: string;
  badgeColor: string; icon: string;
}

export const certificates: Certificate[] = [
  { id: 'cert-001', title: 'Academic Excellence Award', description: 'Awarded for achieving A+ grade in Embedded C Programming — Unit Test 1', type: 'academic', issuedOn: '2026-02-01', issuedBy: 'Buildroonix Institute', grade: 'A+', badgeColor: 'from-yellow-400 to-amber-500', icon: '🏆' },
  { id: 'cert-002', title: 'Perfect Attendance — April 2026', description: 'Awarded for 100% attendance in the month of April 2026', type: 'attendance', issuedOn: '2026-05-01', issuedBy: 'Buildroonix Institute', badgeColor: 'from-green-400 to-teal-500', icon: '✅' },
  { id: 'cert-003', title: 'IoT Project Competition — Runner Up', description: 'Secured 2nd place in the Annual IoT Project Competition 2026', type: 'achievement', issuedOn: '2026-03-15', issuedBy: 'Buildroonix Institute', badgeColor: 'from-blue-400 to-indigo-500', icon: '🥈' },
  { id: 'cert-004', title: 'Course Completion — IOT Fundamentals', description: 'Successfully completed the IOT & Embedded Systems course for Academic Year 2025-26', type: 'completion', issuedOn: '2026-06-30', issuedBy: 'Buildroonix Institute', badgeColor: 'from-purple-400 to-purple-600', icon: '🎓' },
  { id: 'cert-005', title: 'Online Exam Topper — Network Protocols', description: 'Scored highest marks in the Network Protocols online quiz — July 2026', type: 'academic', issuedOn: '2026-07-06', issuedBy: 'Buildroonix Institute', grade: 'A+', badgeColor: 'from-teal-400 to-cyan-500', icon: '⭐' },
];

// ── FEEDBACK ──────────────────────────────────────────────────
export interface FeedbackItem {
  id: string; targetType: 'teacher' | 'class' | 'subject';
  targetId: string; targetName: string; subjectName?: string;
  rating: number; comment: string; submittedAt: string;
  isAnonymous: boolean;
}

export const feedbackItems: FeedbackItem[] = [
  { id: 'fb-001', targetType: 'teacher', targetId: 'tch-001', targetName: 'Pawan Kumar Dubey', subjectName: 'IOT & Embedded Systems', rating: 5, comment: 'Excellent teaching style. Explains complex concepts with real-world examples. Very approachable for doubts.', submittedAt: '2026-07-01', isAnonymous: false },
  { id: 'fb-002', targetType: 'class', targetId: 'oc-004', targetName: 'IOT & Embedded Systems — Online Class', rating: 4, comment: 'Good session on MQTT. Audio quality could be better. Recording was helpful.', submittedAt: '2026-07-02', isAnonymous: true },
];

// ── PARENT PORTAL DATA ────────────────────────────────────────
export interface ParentProfile {
  id: string; name: string; email: string; phone: string;
  relation: 'father' | 'mother' | 'guardian';
  studentId: string; studentName: string; studentClass: string;
  occupation?: string; address: string;
}

export const parentProfiles: ParentProfile[] = [
  { id: 'par-001', name: 'Rajesh Sharma', email: 'rajesh@parent.com', phone: '9876543200', relation: 'father', studentId: 'std-001', studentName: 'Aarav Sharma', studentClass: 'IOT-2026 · Evening', occupation: 'Business', address: '12, Sector 5, Noida, UP' },
];

// ── GRADEBOOK ─────────────────────────────────────────────────
export interface GradebookEntry {
  id: string; studentId: string; studentName: string; rollNo: string;
  subjectCode: string; subjectName: string;
  unitTest1?: number; unitTest2?: number; midTerm?: number;
  assignment?: number; practical?: number;
  totalObtained: number; totalMax: number; percentage: number;
  grade: string; remarks?: string;
}

export const gradebookEntries: GradebookEntry[] = [
  // IOT101 - IOT & Embedded Systems (UT: /25, Mid: /100, Asgn: /50, Practical: /25 → Total: /200)
  { id: 'gb-001', studentId: 'std-001', studentName: 'Aarav Sharma', rollNo: '001', subjectCode: 'IOT101', subjectName: 'IOT & Embedded Systems', unitTest1: 22, unitTest2: 20, midTerm: 82, assignment: 45, practical: 22, totalObtained: 191, totalMax: 225, percentage: 85, grade: 'A', remarks: 'Excellent' },
  { id: 'gb-002', studentId: 'std-002', studentName: 'Priya Patel', rollNo: '002', subjectCode: 'IOT101', subjectName: 'IOT & Embedded Systems', unitTest1: 24, unitTest2: 23, midTerm: 88, assignment: 48, practical: 24, totalObtained: 207, totalMax: 225, percentage: 92, grade: 'A+', remarks: 'Outstanding' },
  { id: 'gb-003', studentId: 'std-003', studentName: 'Rohan Verma', rollNo: '003', subjectCode: 'IOT101', subjectName: 'IOT & Embedded Systems', unitTest1: 15, unitTest2: 18, midTerm: 62, assignment: 35, practical: 18, totalObtained: 148, totalMax: 225, percentage: 66, grade: 'B', remarks: 'Needs improvement in practicals' },
  { id: 'gb-004', studentId: 'std-004', studentName: 'Sneha Gupta', rollNo: '004', subjectCode: 'IOT101', subjectName: 'IOT & Embedded Systems', unitTest1: 23, unitTest2: 24, midTerm: 90, assignment: 47, practical: 23, totalObtained: 207, totalMax: 225, percentage: 92, grade: 'A+', remarks: 'Consistent top performer' },
  { id: 'gb-005', studentId: 'std-005', studentName: 'Karan Singh', rollNo: '005', subjectCode: 'IOT101', subjectName: 'IOT & Embedded Systems', unitTest1: 12, unitTest2: 14, midTerm: 48, assignment: 28, practical: 15, totalObtained: 117, totalMax: 225, percentage: 52, grade: 'C', remarks: 'At risk — needs attention' },
  { id: 'gb-006', studentId: 'std-006', studentName: 'Ananya Mishra', rollNo: '006', subjectCode: 'IOT101', subjectName: 'IOT & Embedded Systems', unitTest1: 20, unitTest2: 19, midTerm: 75, assignment: 42, practical: 20, totalObtained: 176, totalMax: 225, percentage: 78, grade: 'B+', remarks: 'Good' },
  { id: 'gb-007', studentId: 'std-007', studentName: 'Vikram Yadav', rollNo: '007', subjectCode: 'IOT101', subjectName: 'IOT & Embedded Systems', unitTest1: 8, unitTest2: 10, midTerm: 35, assignment: 20, practical: 12, totalObtained: 85, totalMax: 225, percentage: 38, grade: 'F', remarks: 'Failing — irregular attendance' },
  { id: 'gb-008', studentId: 'std-008', studentName: 'Pooja Joshi', rollNo: '008', subjectCode: 'IOT101', subjectName: 'IOT & Embedded Systems', unitTest1: 25, unitTest2: 24, midTerm: 95, assignment: 49, practical: 24, totalObtained: 217, totalMax: 225, percentage: 96, grade: 'A+', remarks: 'Class topper' },
  { id: 'gb-009', studentId: 'std-009', studentName: 'Amit Kumar', rollNo: '009', subjectCode: 'IOT101', subjectName: 'IOT & Embedded Systems', unitTest1: 18, unitTest2: 17, midTerm: 68, assignment: 38, practical: 19, totalObtained: 160, totalMax: 225, percentage: 71, grade: 'B', remarks: 'Average — can improve' },
  { id: 'gb-010', studentId: 'std-010', studentName: 'Divya Nair', rollNo: '010', subjectCode: 'IOT101', subjectName: 'IOT & Embedded Systems', unitTest1: 21, unitTest2: 22, midTerm: 80, assignment: 44, practical: 21, totalObtained: 188, totalMax: 225, percentage: 84, grade: 'A', remarks: 'Very Good' },
  // IOT102 - Embedded C Programming (UT: /25, Mid: /50, Asgn: /25, Practical: /25 → Total: /150)
  { id: 'gb-011', studentId: 'std-001', studentName: 'Aarav Sharma', rollNo: '001', subjectCode: 'IOT102', subjectName: 'Embedded C Programming', unitTest1: 18, unitTest2: 21, midTerm: 44, assignment: 22, practical: 23, totalObtained: 128, totalMax: 150, percentage: 85, grade: 'A', remarks: 'Good understanding' },
  { id: 'gb-012', studentId: 'std-002', studentName: 'Priya Patel', rollNo: '002', subjectCode: 'IOT102', subjectName: 'Embedded C Programming', unitTest1: 24, unitTest2: 23, midTerm: 48, assignment: 24, practical: 25, totalObtained: 144, totalMax: 150, percentage: 96, grade: 'A+', remarks: 'Outstanding' },
  { id: 'gb-013', studentId: 'std-003', studentName: 'Rohan Verma', rollNo: '003', subjectCode: 'IOT102', subjectName: 'Embedded C Programming', unitTest1: 14, unitTest2: 16, midTerm: 32, assignment: 18, practical: 16, totalObtained: 96, totalMax: 150, percentage: 64, grade: 'B', remarks: 'Weak in pointers' },
  { id: 'gb-014', studentId: 'std-004', studentName: 'Sneha Gupta', rollNo: '004', subjectCode: 'IOT102', subjectName: 'Embedded C Programming', unitTest1: 22, unitTest2: 24, midTerm: 46, assignment: 24, practical: 24, totalObtained: 140, totalMax: 150, percentage: 93, grade: 'A+', remarks: 'Excellent' },
  { id: 'gb-015', studentId: 'std-005', studentName: 'Karan Singh', rollNo: '005', subjectCode: 'IOT102', subjectName: 'Embedded C Programming', unitTest1: 10, unitTest2: 12, midTerm: 25, assignment: 14, practical: 12, totalObtained: 73, totalMax: 150, percentage: 49, grade: 'D', remarks: 'Needs improvement' },
  // IOT103 - Network Protocols (UT: /25, Mid: /50, Asgn: /25 → Total: /125)
  { id: 'gb-016', studentId: 'std-001', studentName: 'Aarav Sharma', rollNo: '001', subjectCode: 'IOT103', subjectName: 'Network Protocols', unitTest1: 16, unitTest2: 18, midTerm: 38, assignment: 21, totalObtained: 93, totalMax: 125, percentage: 74, grade: 'B+', remarks: 'Good' },
  { id: 'gb-017', studentId: 'std-002', studentName: 'Priya Patel', rollNo: '002', subjectCode: 'IOT103', subjectName: 'Network Protocols', unitTest1: 22, unitTest2: 21, midTerm: 45, assignment: 24, totalObtained: 112, totalMax: 125, percentage: 90, grade: 'A+', remarks: 'Excellent' },
  { id: 'gb-018', studentId: 'std-003', studentName: 'Rohan Verma', rollNo: '003', subjectCode: 'IOT103', subjectName: 'Network Protocols', unitTest1: 13, unitTest2: 15, midTerm: 30, assignment: 17, totalObtained: 75, totalMax: 125, percentage: 60, grade: 'B', remarks: 'Average' },
];

// ── DAILY DIARY ───────────────────────────────────────────────
export interface DailyDiaryEntry {
  id: string; subjectCode: string; subjectName: string; date: string;
  topicsCovered: string; classwork?: string; homework?: string;
  remarks?: string; isPublished: boolean; teacherName: string;
}

export const dailyDiaryEntries: DailyDiaryEntry[] = [
  { id: 'dd-001', subjectCode: 'IOT101', subjectName: 'IOT & Embedded Systems', date: '2026-07-08', topicsCovered: 'MQTT Protocol — QoS Levels (0, 1, 2), Retain flag, Last Will & Testament', classwork: 'Demo: Connect ESP32 to Mosquitto broker and publish sensor data', homework: 'Write a program to subscribe to 3 different MQTT topics and display data on Serial Monitor', remarks: 'Good participation. Karan and Vikram were absent.', isPublished: true, teacherName: 'Pawan Kumar Dubey' },
  { id: 'dd-002', subjectCode: 'IOT101', subjectName: 'IOT & Embedded Systems', date: '2026-07-07', topicsCovered: 'MQTT Protocol — Introduction, Publish-Subscribe model, Broker architecture', classwork: 'Installed Mosquitto broker on lab machines, tested with MQTT.fx client', homework: 'Read MQTT protocol specification (sections 1-3) and prepare notes', remarks: 'All students present. Class went well.', isPublished: true, teacherName: 'Pawan Kumar Dubey' },
  { id: 'dd-003', subjectCode: 'IOT102', subjectName: 'Embedded C Programming', date: '2026-07-08', topicsCovered: 'Timer1 — CTC mode, Compare Output Mode, Waveform generation', classwork: 'Practical: Generate 1 kHz square wave using Timer1 CTC mode on ATmega328P', homework: 'Modify the program to generate a 500 Hz wave with 25% duty cycle using Fast PWM', isPublished: true, teacherName: 'Samer Khan' },
  { id: 'dd-004', subjectCode: 'IOT103', subjectName: 'Network Protocols', date: '2026-07-08', topicsCovered: 'HTTP/2 vs HTTP/1.1 — Multiplexing, Header compression, Server Push', classwork: 'Wireshark capture of HTTP/2 frames, analyzed header compression with HPACK', homework: 'Compare HTTP/1.1, HTTP/2, and HTTP/3 in a table with at least 8 parameters', isPublished: true, teacherName: 'Ritu Sharma' },
  { id: 'dd-005', subjectCode: 'IOT101', subjectName: 'IOT & Embedded Systems', date: '2026-07-06', topicsCovered: 'ESP32 WiFi — Station mode, AP mode, WiFiMulti for fallback', classwork: 'Practical: Connected ESP32 to lab WiFi, sent HTTP GET request to jsonplaceholder API', homework: 'Create an ESP32 program that connects to WiFi and posts sensor data to ThingSpeak', remarks: 'Vikram\'s ESP32 board has a faulty USB port — needs replacement.', isPublished: true, teacherName: 'Pawan Kumar Dubey' },
  { id: 'dd-006', subjectCode: 'IOT102', subjectName: 'Embedded C Programming', date: '2026-07-06', topicsCovered: 'Timer0 Overflow Interrupt — Prescaler selection, TCNT0, TCCR0A/B registers', classwork: 'Practical: Blink LED at exactly 1 Hz using Timer0 overflow ISR', homework: 'Calculate prescaler and compare value for 2 Hz and 0.5 Hz blink rates', isPublished: true, teacherName: 'Samer Khan' },
  { id: 'dd-007', subjectCode: 'IOT101', subjectName: 'IOT & Embedded Systems', date: '2026-07-05', topicsCovered: 'DHT11 Sensor — Working principle, Timing diagram, Data format (40-bit)', classwork: 'Wired DHT11 to Arduino, displayed temperature and humidity on 16x2 LCD', homework: 'Implement a temperature alarm system: if temp > 35°C, turn on buzzer and red LED', isPublished: false, teacherName: 'Pawan Kumar Dubey' },
];

// ── PARENT COMMUNICATION ──────────────────────────────────────
export interface ParentMessage {
  id: string; teacherName: string; studentId: string; studentName: string;
  parentName: string; subject: string; body: string;
  category: 'attendance' | 'behavior' | 'academic' | 'fee' | 'general';
  priority: 'normal' | 'important' | 'urgent';
  isBroadcast: boolean; isRead: boolean; readAt?: string; createdAt: string;
}

export const parentMessages: ParentMessage[] = [
  { id: 'pm-001', teacherName: 'Pawan Kumar Dubey', studentId: 'std-005', studentName: 'Karan Singh', parentName: 'Harpal Singh', subject: 'Attendance Warning — Below 75%', body: 'Dear Mr. Harpal Singh,\n\nThis is to bring to your attention that Karan\'s attendance in IOT & Embedded Systems has dropped to 70%, which is below the required 75% minimum. He has been absent on 6 occasions in the last month.\n\nPlease ensure he attends classes regularly to avoid being detained from exams.\n\nRegards,\nPawan Kumar Dubey', category: 'attendance', priority: 'urgent', isBroadcast: false, isRead: true, readAt: '2026-07-06T10:00:00', createdAt: '2026-07-05T09:00:00' },
  { id: 'pm-002', teacherName: 'Pawan Kumar Dubey', studentId: 'std-007', studentName: 'Vikram Yadav', parentName: 'Ramesh Yadav', subject: 'Academic Performance Concern — At Risk of Failing', body: 'Dear Mr. Ramesh Yadav,\n\nI am writing to express concern about Vikram\'s academic performance in IOT & Embedded Systems. His current aggregate score is 38% which is below the passing threshold of 40%.\n\nHe needs to significantly improve in the remaining assessments. I suggest regular study hours and attending doubt-clearing sessions.\n\nPlease discuss this with Vikram and let me know if you would like to schedule a parent-teacher meeting.\n\nRegards,\nPawan Kumar Dubey', category: 'academic', priority: 'urgent', isBroadcast: false, isRead: false, createdAt: '2026-07-07T11:00:00' },
  { id: 'pm-003', teacherName: 'Pawan Kumar Dubey', studentId: 'std-004', studentName: 'Sneha Gupta', parentName: 'Deepak Gupta', subject: 'Excellent Performance — Congratulations!', body: 'Dear Mr. Deepak Gupta,\n\nI am happy to inform you that Sneha has been performing exceptionally well in all subjects. She scored 92% in IOT & Embedded Systems and 93% in Embedded C Programming.\n\nHer dedication and consistent effort are commendable. Keep encouraging her!\n\nBest wishes,\nPawan Kumar Dubey', category: 'academic', priority: 'normal', isBroadcast: false, isRead: true, readAt: '2026-07-04T14:00:00', createdAt: '2026-07-03T10:00:00' },
  { id: 'pm-004', teacherName: 'Pawan Kumar Dubey', studentId: 'std-003', studentName: 'Rohan Verma', parentName: 'Anil Verma', subject: 'Behavioral Note — Disrupting Class', body: 'Dear Mr. Anil Verma,\n\nI need to bring to your attention that Rohan has been disrupting the class during practical sessions. He was found using his phone during lab hours on two occasions this week (July 6 and July 8).\n\nI have counseled him, but I request your support in ensuring he follows the class discipline guidelines.\n\nRegards,\nPawan Kumar Dubey', category: 'behavior', priority: 'important', isBroadcast: false, isRead: false, createdAt: '2026-07-08T16:00:00' },
  { id: 'pm-005', teacherName: 'Pawan Kumar Dubey', studentId: '', studentName: '', parentName: 'All Parents — IOT-2026', subject: 'Mid Term Exam Schedule Released', body: 'Dear Parents,\n\nThe Mid Term Examination schedule for IOT-2026 batch has been released. Exams will begin on August 10, 2026.\n\nPlease ensure your ward prepares well. The detailed subject-wise schedule is available on the student portal under "My Exams".\n\nImportant: Students must carry their admit cards to the examination hall.\n\nRegards,\nPawan Kumar Dubey\nClass Teacher — IOT-2026', category: 'general', priority: 'important', isBroadcast: true, isRead: false, createdAt: '2026-07-08T09:00:00' },
  { id: 'pm-006', teacherName: 'Samer Khan', studentId: 'std-005', studentName: 'Karan Singh', parentName: 'Harpal Singh', subject: 'Fee Payment Reminder — Exam Fee Overdue', body: 'Dear Mr. Harpal Singh,\n\nThis is a reminder that Karan\'s Exam Fee of ₹1,500 is overdue (due date: July 20, 2026). Students with pending fees may not be issued admit cards for the upcoming Mid Term exams.\n\nPlease clear the dues at the earliest.\n\nRegards,\nSamer Khan', category: 'fee', priority: 'urgent', isBroadcast: false, isRead: false, createdAt: '2026-07-08T12:00:00' },
];

// ── PARENT MESSAGE TEMPLATES ──────────────────────────────────
export interface MessageTemplate {
  id: string; name: string; category: ParentMessage['category'];
  subjectTemplate: string; bodyTemplate: string;
}

export const messageTemplates: MessageTemplate[] = [
  { id: 'tpl-001', name: 'Attendance Warning', category: 'attendance', subjectTemplate: 'Attendance Warning — {studentName}', bodyTemplate: 'Dear {parentName},\n\nThis is to inform you that {studentName}\'s attendance has dropped to {attendance}%, which is below the required 75% minimum.\n\nPlease ensure regular attendance to avoid exam detention.\n\nRegards,\n{teacherName}' },
  { id: 'tpl-002', name: 'Academic Concern', category: 'academic', subjectTemplate: 'Academic Performance Concern — {studentName}', bodyTemplate: 'Dear {parentName},\n\nI am writing to express concern about {studentName}\'s academic performance in {subjectName}. The current score is {percentage}%.\n\nPlease discuss study habits and consider additional coaching if needed.\n\nRegards,\n{teacherName}' },
  { id: 'tpl-003', name: 'Behavioral Note', category: 'behavior', subjectTemplate: 'Behavioral Note — {studentName}', bodyTemplate: 'Dear {parentName},\n\nI need to bring to your attention a behavioral concern regarding {studentName}. {details}\n\nI request your support in addressing this matter.\n\nRegards,\n{teacherName}' },
  { id: 'tpl-004', name: 'Fee Reminder', category: 'fee', subjectTemplate: 'Fee Payment Reminder — {feeType}', bodyTemplate: 'Dear {parentName},\n\nThis is a reminder that {studentName}\'s {feeType} of ₹{amount} is pending (due: {dueDate}). Please clear the dues at the earliest.\n\nRegards,\n{teacherName}' },
  { id: 'tpl-005', name: 'Academic Excellence', category: 'academic', subjectTemplate: 'Excellent Performance — Congratulations!', bodyTemplate: 'Dear {parentName},\n\nI am happy to inform you that {studentName} has been performing exceptionally well. {details}\n\nKeep encouraging them!\n\nBest wishes,\n{teacherName}' },
  { id: 'tpl-006', name: 'General Announcement', category: 'general', subjectTemplate: '{title}', bodyTemplate: 'Dear Parents,\n\n{content}\n\nRegards,\n{teacherName}\nClass Teacher — {className}' },
];

export const supportStaffList: SupportStaff[] = [
  { id: 'stf-001', name: 'Ramesh Singh', email: 'ramesh@greenwood.com', phone: '+91 95801 81601', role: 'driver', joiningDate: '2025-08-10', salary: 18000, isActive: true, busNumber: 'BUS-102', shift: 'morning' },
  { id: 'stf-002', name: 'Sunil Kumar', email: 'sunil@greenwood.com', phone: '+91 95801 81602', role: 'guard', joiningDate: '2026-01-05', salary: 15000, isActive: true, shift: 'night' },
  { id: 'stf-003', name: 'Meena Sharma', email: 'meena@greenwood.com', phone: '+91 95801 81603', role: 'receptionist', joiningDate: '2026-03-20', salary: 22000, isActive: true, shift: 'morning' },
  { id: 'stf-004', name: 'Deepak Verma', email: 'deepak@greenwood.com', phone: '+91 95801 81604', role: 'cleaner', joiningDate: '2026-02-15', salary: 12000, isActive: true, shift: 'evening' },
  { id: 'stf-005', name: 'Ajay Saxena', email: 'ajay@greenwood.com', phone: '+91 95801 81605', role: 'accountant', joiningDate: '2025-05-12', salary: 35000, isActive: true, shift: 'morning' },
];

export const supportStaffPayrolls: StaffPayroll[] = [
  { id: 'sp-001', staffId: 'stf-001', staffName: 'Ramesh Singh', role: 'Driver', basicSalary: 18000, allowances: 2000, deductions: 500, netSalary: 19500, month: 'July', year: 2026, status: 'processing' },
  { id: 'sp-002', staffId: 'stf-002', staffName: 'Sunil Kumar', role: 'Guard', basicSalary: 15000, allowances: 1000, deductions: 200, netSalary: 15800, month: 'July', year: 2026, status: 'pending' },
  { id: 'sp-003', staffId: 'stf-003', staffName: 'Meena Sharma', role: 'Receptionist', basicSalary: 22000, allowances: 2500, deductions: 800, netSalary: 23700, month: 'July', year: 2026, status: 'pending' },
  { id: 'sp-004', staffId: 'stf-004', staffName: 'Deepak Verma', role: 'Cleaner', basicSalary: 12000, allowances: 800, deductions: 200, netSalary: 12600, month: 'July', year: 2026, status: 'paid', paidOn: '2026-07-05', paymentMethod: 'cash' },
  { id: 'sp-005', staffId: 'stf-005', staffName: 'Ajay Saxena', role: 'Accountant', basicSalary: 35000, allowances: 4000, deductions: 1500, netSalary: 37500, month: 'July', year: 2026, status: 'pending' },
  
  { id: 'sp-006', staffId: 'stf-001', staffName: 'Ramesh Singh', role: 'Driver', basicSalary: 18000, allowances: 2000, deductions: 500, netSalary: 19500, month: 'June', year: 2026, status: 'paid', paidOn: '2026-06-30', paymentMethod: 'bank_transfer' },
  { id: 'sp-007', staffId: 'stf-002', staffName: 'Sunil Kumar', role: 'Guard', basicSalary: 15000, allowances: 1000, deductions: 200, netSalary: 15800, month: 'June', year: 2026, status: 'paid', paidOn: '2026-06-30', paymentMethod: 'cash' },
  { id: 'sp-008', staffId: 'stf-003', staffName: 'Meena Sharma', role: 'Receptionist', basicSalary: 22000, allowances: 2500, deductions: 800, netSalary: 23700, month: 'June', year: 2026, status: 'paid', paidOn: '2026-06-30', paymentMethod: 'bank_transfer' },
];

