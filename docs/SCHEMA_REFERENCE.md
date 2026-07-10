# BUILDROONIX — DATABASE SCHEMA REFERENCE
# ==========================================
# This file is the DIRECTION document for all development.
# Frontend uses lib/types.ts | Backend will use the SQL schemas.

## ─────────────────────────────────────────
## SYSTEM LAYERS
## ─────────────────────────────────────────

```
┌─────────────────────────────────────────────────────────────┐
│                    BUILDROONIX PLATFORM                      │
│                  (You = Super Admin)                         │
│                                                             │
│  buildroonix_master_db                                      │
│  ├── superadmins          (you and your team)               │
│  ├── institutions         (all schools using the platform)  │
│  ├── subscription_plans   (basic / pro / enterprise)        │
│  ├── billing_invoices     (payments from institutions)      │
│  └── platform_announcements (broadcast to all)             │
└─────────────────────────────────────────────────────────────┘
         │                    │                    │
         ▼                    ▼                    ▼
┌──────────────┐   ┌──────────────┐   ┌──────────────┐
│ greenwood_db │   │ sunrise_db   │   │ techno_db    │
│ (School A)   │   │ (School B)   │   │ (School C)   │
└──────────────┘   └──────────────┘   └──────────────┘
```

## ─────────────────────────────────────────
## TENANT DB — TABLE RELATIONSHIPS
## ─────────────────────────────────────────

```
institution_config (1)
        │
        ├── academic_years (many)
        ├── departments (many)
        │       └── subjects (many)
        │
        ├── users (many)
        │   ├── [role=school_admin]
        │   ├── [role=teacher] ──► teacher_profiles (1:1)
        │   └── [role=student] ──► student_profiles (1:1)
        │
        ├── classes (many)
        │   ├── sections (many per class)
        │   ├── class_subjects (many: class ↔ subject ↔ teacher)
        │   └── timetable_slots (many per class)
        │
        ├── attendance (many)
        │   └── [student_id + timetable_slot_id + date = UNIQUE]
        │
        ├── assignments (many)
        │   └── assignment_submissions (many per assignment)
        │
        ├── exams (many)
        │   └── exam_results (many per exam)
        │
        ├── online_exams (many)
        │   ├── online_exam_questions (many)
        │   └── online_exam_attempts (many per student)
        │
        ├── syllabus (many)
        │   └── lesson_plans (many per syllabus unit)
        │
        ├── leave_requests (many)
        ├── notices (many)
        ├── messages (many: sender ↔ receiver)
        ├── online_classes (many)
        ├── previous_papers (many)
        ├── enrollment_requests (many)
        ├── holidays (many)
        ├── ai_notes_history (many)
        ├── notifications (many per user)
        ├── fee_structure (many per class)
        ├── fee_payments (many per student)
        └── activity_logs (many)
```

## ─────────────────────────────────────────
## ROLE → FEATURE ACCESS MAP
## ─────────────────────────────────────────

| Feature                  | superadmin | school_admin | teacher | student |
|--------------------------|:----------:|:------------:|:-------:|:-------:|
| Manage Institutions      |     ✅     |      ❌      |   ❌    |   ❌    |
| Billing & Subscriptions  |     ✅     |      ❌      |   ❌    |   ❌    |
| Platform Announcements   |     ✅     |      ❌      |   ❌    |   ❌    |
| Manage All Users         |     ✅     |      ✅      |   ❌    |   ❌    |
| Enrollment Requests      |     ✅     |      ✅      |   ❌    |   ❌    |
| Manage Classes/Sections  |     ✅     |      ✅      |   ❌    |   ❌    |
| Manage Subjects          |     ✅     |      ✅      |   ❌    |   ❌    |
| Create Timetable         |     ✅     |      ✅      |   ❌    |   ❌    |
| View Timetable           |     ✅     |      ✅      |   ✅    |   ✅    |
| Mark Attendance          |     ✅     |      ✅      |   ✅    |   ❌    |
| View Own Attendance      |     ❌     |      ❌      |   ❌    |   ✅    |
| Attendance Reports       |     ✅     |      ✅      |   ✅    |   ❌    |
| Create Assignments       |     ❌     |      ❌      |   ✅    |   ❌    |
| Submit Assignments       |     ❌     |      ❌      |   ❌    |   ✅    |
| Grade Assignments        |     ❌     |      ❌      |   ✅    |   ❌    |
| Create Exams             |     ✅     |      ✅      |   ✅    |   ❌    |
| View Exam Results        |     ✅     |      ✅      |   ✅    |   ✅    |
| Create Online Exams      |     ❌     |      ❌      |   ✅    |   ❌    |
| Attempt Online Exams     |     ❌     |      ❌      |   ❌    |   ✅    |
| Manage Syllabus          |     ✅     |      ✅      |   ✅    |   ❌    |
| Create Lesson Plans      |     ❌     |      ❌      |   ✅    |   ❌    |
| Apply Leave              |     ❌     |      ❌      |   ✅    |   ❌    |
| Approve Leave            |     ✅     |      ✅      |   ❌    |   ❌    |
| Post Notices             |     ✅     |      ✅      |   ✅    |   ❌    |
| View Notices             |     ✅     |      ✅      |   ✅    |   ✅    |
| 1-to-1 Messaging         |     ✅     |      ✅      |   ✅    |   ✅    |
| Schedule Online Classes  |     ❌     |      ❌      |   ✅    |   ❌    |
| Join Online Classes      |     ❌     |      ❌      |   ✅    |   ✅    |
| Upload Previous Papers   |     ❌     |      ❌      |   ✅    |   ❌    |
| Download Previous Papers |     ❌     |      ❌      |   ✅    |   ✅    |
| AI Notes Generator       |     ❌     |      ❌      |   ✅    |   ✅    |
| Fee Management           |     ✅     |      ✅      |   ❌    |   ❌    |
| View Own Fee Status      |     ❌     |      ❌      |   ❌    |   ✅    |
| Reports & Analytics      |     ✅     |      ✅      |   ✅*   |   ❌    |
| System Settings          |     ✅     |      ✅      |   ❌    |   ❌    |

*Teacher sees only their own class reports

## ─────────────────────────────────────────
## API ROUTE STRUCTURE (Future Backend)
## ─────────────────────────────────────────

### Master API (buildroonix.com/api/v1)
```
POST   /auth/superadmin/login
GET    /institutions
POST   /institutions
PUT    /institutions/:id
DELETE /institutions/:id
GET    /institutions/:id/stats
PUT    /institutions/:id/subscription
GET    /billing/invoices
POST   /billing/invoices
GET    /plans
POST   /plans
GET    /announcements
POST   /announcements
```

### Tenant API ({slug}.buildroonix.com/api/v1)
```
# Auth
POST   /auth/login
POST   /auth/logout
POST   /auth/refresh
POST   /auth/forgot-password

# Users
GET    /users                    (admin only)
POST   /users                    (admin only)
GET    /users/:id
PUT    /users/:id
DELETE /users/:id

# Classes & Sections
GET    /classes
POST   /classes
GET    /classes/:id/students
GET    /sections
POST   /sections

# Subjects & Timetable
GET    /subjects
POST   /subjects
GET    /timetable
POST   /timetable/slots

# Attendance
GET    /attendance?date=&classId=&sectionId=
POST   /attendance/mark          (teacher)
GET    /attendance/student/:id   (student's own)
GET    /attendance/report        (admin/teacher)

# Assignments
GET    /assignments
POST   /assignments              (teacher)
PUT    /assignments/:id
GET    /assignments/:id/submissions
POST   /assignments/:id/submit   (student)
PUT    /assignments/:id/grade    (teacher)

# Exams
GET    /exams
POST   /exams
GET    /exams/:id/results
POST   /exams/:id/results        (teacher)

# Online Exams
GET    /online-exams
POST   /online-exams             (teacher)
POST   /online-exams/:id/attempt (student)

# Leave
GET    /leave
POST   /leave/apply
PUT    /leave/:id/review         (admin)

# Notices
GET    /notices
POST   /notices
DELETE /notices/:id

# Messages
GET    /messages/contacts
GET    /messages/:userId
POST   /messages/send

# Notifications
GET    /notifications
PUT    /notifications/:id/read

# AI Notes
POST   /ai/generate-notes

# Reports
GET    /reports/attendance
GET    /reports/performance
GET    /reports/overview

# Fee
GET    /fees/structure
GET    /fees/payments
POST   /fees/payments
```

## ─────────────────────────────────────────
## DEVELOPMENT PHASES
## ─────────────────────────────────────────

### Phase 1 — Frontend (CURRENT ✅)
- Login page with role-based routing
- All dashboards (superadmin, teacher, student)
- All UI pages with mock data
- Sidebar with RBAC navigation

### Phase 2 — Student Module (NEXT)
- Student profile complete
- Attendance view (read-only)
- Assignment submission
- Exam results view
- Timetable view

### Phase 3 — Teacher Module
- Mark attendance (save to DB)
- Create/grade assignments
- Timetable management
- Leave management

### Phase 4 — Admin Module
- User management (CRUD)
- Class/section management
- Enrollment approval
- Reports & analytics

### Phase 5 — Super Admin Module
- Institution onboarding
- Subscription management
- Billing & invoices
- Platform announcements

### Phase 6 — Advanced Features
- Online exams (MCQ engine)
- Online classes (video integration)
- AI Notes (real AI API)
- Fee management
- Mobile responsive PWA

## ─────────────────────────────────────────
## TECH STACK DECISIONS
## ─────────────────────────────────────────

Frontend:   Next.js 14 + TypeScript + Tailwind CSS
Backend:    Node.js + Express OR Next.js API Routes
Database:   PostgreSQL (multi-tenant with separate DBs)
Auth:       JWT (access + refresh tokens)
File Store: AWS S3 or Cloudinary
AI:         OpenAI API / Vercel AI SDK
Email:      Nodemailer / SendGrid
SMS:        Twilio / MSG91
Hosting:    Vercel (frontend) + Railway/Render (backend)
