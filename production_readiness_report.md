# Buildroonix ERP – Production Readiness & Feature Gap Report

> Generated: 2026-07-09 | Based on full codebase audit

---

## Overall Verdict

| Area | Status | Score |
|---|---|---|
| Core Architecture | ✅ Solid | 8/10 |
| Backend API Coverage | ⚠️ Partial | 6/10 |
| Frontend Completeness | ⚠️ Partial | 6/10 |
| Security | ⚠️ Needs Work | 5/10 |
| Production Infra | ❌ Not Ready | 3/10 |
| Feature Completeness | ⚠️ Partial | 6/10 |

> [!CAUTION]
> The platform is **NOT ready for production** in its current state. The primary risks are missing backend integration, security hardening, and infrastructure stabilization. GitHub CI/CD and payment portal integration are deferred to a later phase.

---

## ✅ What Is Working Well (Production-Grade)

### Core Platform
- **Multi-tenancy**: Proper institution isolation via `institutionId` scoping on every query — solid design
- **Auth system**: JWT + Refresh token rotation, role-based guards (superadmin, school_admin, teacher, student, parent)
- **5 Institution Types**: school, coaching, tuition, college, hybrid — all with plan/module control
- **Module System**: Superadmin can enable/disable specific feature modules per institution
- **Enrollment Flow**: Self-registration → approval → login works end-to-end
- **Payroll**: Auto-generation, mark-paid, salary slips working
- **Gradebook**: Teacher marks entry, student result retrieval working

### API Resources (Backend + Frontend Connected)
| Feature | Admin | Teacher | Student | Parent |
|---|---|---|---|---|
| User Management | ✅ | — | — | — |
| Classes (Batches) | ✅ | — | — | — |
| Attendance | ✅ | ✅ | ✅ | ✅ |
| Fee Management | ✅ | — | ✅ | ✅ |
| Timetable | ✅ | ✅ | ✅ | ✅ |
| Notices/Announcements | ✅ | ✅ | ✅ | ✅ |
| Exams | ✅ | ✅ | ✅ | — |
| Leave Requests | ✅ | ✅ | ✅ | — |
| Online Classes | ✅ | ✅ | ✅ | — |
| Assignments | ✅ | ✅ | ✅ | — |
| Parent Messaging | ✅ | ✅ | — | ✅ |
| Payroll | ✅ | ✅(view) | — | — |
| Gradebook | — | ✅ | ✅ | — |
| Daily Diary | — | ✅ | ✅ | — |
| Enrollment Requests | ✅ | — | — | — |

---

## ❌ Critical Gaps (Must Fix Before Production)

### 1. Pages Using Hardcoded / Mock Data (Not Connected to Backend)

| Page | Issue |
|---|---|
| `admin/reports/page.tsx` | **100% hardcoded chart data** — shows fake attendance/enrollment numbers |
| `admin/settings/page.tsx` | **Static form with no save API** — save button does nothing |
| `student/feedback/page.tsx` | **"backend API coming soon"** — all feedback data is local state |
| `student/doubts/page.tsx` | **"backend API coming soon"** — all doubts are local state |
| `student/online-exams/page.tsx` | **"backend API coming soon"** — no MCQ exam engine in backend |
| `teacher/syllabus/page.tsx` | **"backend API coming soon"** — syllabus is local state only |
| `student/assignments/page.tsx` | **File attachment: "coming soon"** — no file upload support |

### 2. Missing Backend Models / Database Tables

The following features have UI pages but **no database table** in `schema.prisma`:

| Feature | Missing Model | Impact |
|---|---|---|
| Student Doubts / Q&A | `Doubt`, `DoubtReply` | Student doubts page can't save |
| Student Feedback | `FeedbackSubmission` | Feedback can't persist |
| Online Exam / MCQ | `OnlineExam`, `MCQQuestion`, `ExamAttempt` | No exam engine |
| Syllabus | `SyllabusUnit` | Syllabus can't persist |
| File Uploads | `FileUpload` / S3 integration | Assignment attachments don't work |
| Library | `LibraryBook`, `BookIssue` | No library tracking |
| Transport | `TransportRoute`, `BusStop`, `VehicleAssignment` | No transport tracking |
| Certificate | `Certificate` | Student certificate page has no backend |
| Study Material | `StudyMaterial` | No study material uploads |
| Previous Papers | `PreviousPaper` | No paper repository |
| AI Notes | No AI integration | No Gemini/GPT integration |

### 3. Security Issues

> [!WARNING]
> These are **critical blockers** for production:

- **No rate limiting** on login endpoint (brute-force vulnerable)
- **No HTTPS enforcement** — running plain HTTP in dev mode
- **Passwords stored with bcrypt** ✅ but **no password strength validation** on signup
- **No input sanitization** for XSS (e.g., notice `content` field accepts raw HTML)
- **No CORS policy** configured for production domains
- **No audit logs** — admin actions (delete user, change plan) are not logged
- **Superadmin password is hardcoded** in the seed script as `superadminpass123`
- **JWT secret** uses a weak default in `.env.example`

### 4. Infrastructure Not Production-Ready

> [!CAUTION]
> The project cannot be deployed as-is:

- **No Dockerfile or docker-compose.yml** for the backend
- **No environment separation** (dev vs staging vs production configs)
- **No database migration strategy** — only `prisma db push` (destructive)
- **No health check endpoint** (`/health` or `/ping`) for load balancers
- **No logging aggregation** (Winston logs go to console, need to go to file or service)
- **No backup strategy** for PostgreSQL database
- **No CDN or static asset optimization** for the Next.js frontend

---

## ⚠️ Feature Gaps by Institution Type

### 🏫 School
| Missing Feature | Priority |
|---|---|
| Result/Report Cards (PDF export) | 🔴 High |
| Admit Cards / Hall Tickets (PDF) | 🔴 High |
| Transport Management (GPS tracking) | 🟡 Medium |
| Library Management (issue/return) | 🟡 Medium |
| Hostel Management | 🟢 Low |
| SMS / WhatsApp notifications | 🟡 Medium |
| Parent mobile app | 🟢 Low |

### 🏛️ Coaching Center
| Missing Feature | Priority |
|---|---|
| Batch-wise Fee Structure (per subject) | 🔴 High |
| Test Series / Mock Tests | 🔴 High |
| Rank & Performance Analytics | 🟡 Medium |
| Study Material Repository | 🟡 Medium |
| Doubt Solving Forum | 🟡 Medium |
| Referral / Lead tracking | 🟢 Low |

### 📚 Tuition Center
| Missing Feature | Priority |
|---|---|
| Per-student subject enrollment | 🔴 High |
| Monthly/hourly billing | 🔴 High |
| Demo class booking | 🟡 Medium |
| Parent daily progress report | 🟡 Medium |

### 🎓 College
| Missing Feature | Priority |
|---|---|
| Semester/Credit system | 🔴 High |
| University affiliation management | 🟡 Medium |
| Elective course enrollment | 🟡 Medium |
| Research / thesis tracking | 🟢 Low |
| Alumni management | 🟢 Low |

---

## 🚀 Recommended Improvements (High Value)

### Tier 1 — Do These Before Any Launch

1. **Connect Reports to Real Data**: Replace hardcoded chart data with aggregated Prisma queries
2. **Settings API**: Create a `PUT /admin/settings` endpoint to save institution settings
3. **File Upload System**: Add Cloudinary or S3 for assignment attachments, study materials
4. **Online MCQ Exam Engine**: Add `OnlineExam` + `MCQQuestion` models + attempt tracking
5. **PDF Generation**: Add `puppeteer` or `react-pdf` for report cards and admit cards
6. **Rate Limiting**: Add `express-rate-limit` on `/auth/login` (max 5 attempts/15 min)
7. **Dockerize Backend**: Add `Dockerfile` + `docker-compose.yml` for reproducible deployment
8. **Database Migrations**: Switch from `prisma db push` to `prisma migrate deploy`

### Tier 2 — High Business Value

9. **Real-time Notifications**: Add WebSocket or Server-Sent Events for live fee/attendance alerts
10. **SMS/WhatsApp Integration**: Twilio or WhatsApp Business API for critical notifications
11. **Analytics Dashboard**: Real aggregation queries for attendance %, fee collection, exam stats
12. **Doubt/Q&A Forum**: Backend for `Doubts` + `DoubtReply` models (high engagement)
13. **Study Material Library**: File upload + categorization by class/subject
14. **Library Management**: Books, issue/return, fine calculation

### Tier 3 — Competitive Differentiators

15. **AI-powered Notes**: Integrate Gemini API to auto-generate study notes from diary/syllabus
16. **Mobile App**: React Native frontend using the same backend API
17. **Multi-language Support**: i18n for Hindi, Marathi, Bengali (key Indian market requirement)
18. **Offline Mode**: PWA with service workers for areas with poor connectivity
19. **API Webhooks**: Allow institutions to subscribe to events (fee paid, attendance marked)

### Deferred for Later Release
- **GitHub CI/CD pipeline**: GitHub Actions for build/test/deploy should be planned in the next phase, after core platform issues are fixed.
- **Payment portal integration**: Online fee payment portal and Razorpay/Stripe integration remain future work and are not blockers for the core production readiness pass.

---

## Summary Checklist

```
Before Production:
[ ] Fix all 7 hardcoded/stub pages with real API connections
[ ] Add 11 missing database models
[ ] Implement rate limiting and CORS
[ ] Add security audit and penetration test
[ ] Dockerize the backend
[ ] Add proper environment configs (dev/staging/prod)
[ ] Add health check endpoint
[ ] Add backup strategy for PostgreSQL
[ ] Add PDF generation for report cards

High Priority Features to Add:
[ ] File upload system (S3/Cloudinary)
[ ] Online MCQ exam engine
[ ] Real-time notifications
[ ] SMS/WhatsApp integration
[ ] Analytics dashboard with real data
```

```
Deferred for later release:
[ ] GitHub Actions CI/CD pipeline
[ ] Payment portal integration (Razorpay/Stripe)
```
