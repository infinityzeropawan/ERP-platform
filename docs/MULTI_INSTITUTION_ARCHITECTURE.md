# BUILDROONIX — MULTI-INSTITUTION-TYPE ARCHITECTURE
# ===================================================
# Problem: Different institution types need different features
# Solution: Feature Flag + Module System with Institution Types
# ===================================================

## THE CORE PROBLEM

```
School          → Needs: Attendance, Timetable, Exams, Fee, Transport, Hostel
Coaching        → Needs: Batch Management, Test Series, Doubt Sessions, Rankings
Online Teaching → Needs: Live Classes, Recorded Content, Subscriptions, Certificates
College         → Needs: Departments, Semesters, Internal Marks, Placement
Tuition Center  → Needs: Multiple Subjects, Flexible Timing, Parent Reports
```

Each type shares a CORE but has UNIQUE modules.
The Super Admin controls WHICH modules each institution can access.

---

## SOLUTION: 3-LAYER ARCHITECTURE

```
┌─────────────────────────────────────────────────────────────────┐
│  LAYER 1 — INSTITUTION TYPE                                      │
│  (What kind of institution is it?)                               │
│  school | coaching | online_teaching | college | tuition         │
└─────────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│  LAYER 2 — MODULE SYSTEM                                         │
│  (Which feature modules are enabled for this institution?)       │
│  Each module = a group of related features                       │
│  Super Admin enables/disables modules per institution            │
└─────────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│  LAYER 3 — FEATURE FLAGS                                         │
│  (Fine-grained control within a module)                          │
│  e.g. attendance module → can_mark_biometric: false              │
└─────────────────────────────────────────────────────────────────┘
```

---

## INSTITUTION TYPES

| Type              | Slug               | Example                        |
|-------------------|--------------------|--------------------------------|
| School            | school             | Greenwood High School          |
| Coaching Institute| coaching           | Allen Career Institute         |
| Online Teaching   | online_teaching    | Unacademy-style platform       |
| College/University| college            | ABC Engineering College        |
| Tuition Center    | tuition            | Home Tuition / Small Center    |
| Hybrid            | hybrid             | School + Online both           |

---

## MODULE CATALOG (All possible modules)

### CORE MODULES (Available to ALL institution types)
```
core_auth           → Login, roles, profile, password reset
core_dashboard      → Role-based dashboards
core_messaging      → 1-to-1 chat
core_notices        → Announcements
core_notifications  → In-app notifications
core_ai_notes       → AI notes generator
core_profile        → User profile management
```

### ACADEMIC MODULES
```
mod_timetable       → Weekly timetable management
mod_attendance      → Daily attendance marking + reports
mod_assignments     → Create, submit, grade assignments
mod_exams           → Exam scheduling + results
mod_online_exams    → MCQ-based online tests
mod_syllabus        → Syllabus + lesson plans
mod_previous_papers → Previous year papers upload/download
mod_online_classes  → Live class scheduling (Zoom/Meet)
mod_recorded_content→ Upload & stream recorded lectures
mod_certificates    → Generate completion certificates
```

### ADMINISTRATION MODULES
```
mod_enrollment      → Student enrollment requests + approval
mod_fee_management  → Fee structure, collection, receipts
mod_leave           → Leave application + approval
mod_student_dir     → Student directory
mod_reports         → Analytics and reports
mod_transport       → Bus routes, tracking (school-specific)
mod_hostel          → Hostel room management (school/college)
mod_library         → Book issue/return management
```

### COACHING-SPECIFIC MODULES
```
mod_batches         → Batch management (replaces classes)
mod_test_series     → Scheduled test series with rankings
mod_doubt_sessions  → Doubt clearing sessions
mod_rankings        → Student performance leaderboard
mod_study_material  → PDF/video study material distribution
```

### ONLINE TEACHING MODULES
```
mod_courses         → Course creation + enrollment
mod_subscriptions   → Student subscription plans
mod_live_streaming  → Live class with recording
mod_content_library → Video/PDF content management
mod_progress_track  → Course completion tracking
```

### COLLEGE-SPECIFIC MODULES
```
mod_departments     → Department management
mod_semesters       → Semester-based academic structure
mod_internal_marks  → Internal assessment marks
mod_placement       → Placement cell management
mod_research        → Research paper submissions
```

---

## DEFAULT MODULE SETS PER INSTITUTION TYPE

### school → gets these modules by default:
```
core_auth, core_dashboard, core_messaging, core_notices,
core_notifications, core_ai_notes, core_profile,
mod_timetable, mod_attendance, mod_assignments, mod_exams,
mod_online_exams, mod_syllabus, mod_previous_papers,
mod_online_classes, mod_enrollment, mod_fee_management,
mod_leave, mod_student_dir, mod_reports,
mod_transport*, mod_hostel*, mod_library*
(* = optional, enabled by super admin)
```

### coaching → gets these modules by default:
```
core_auth, core_dashboard, core_messaging, core_notices,
core_notifications, core_ai_notes, core_profile,
mod_batches, mod_attendance, mod_assignments,
mod_test_series, mod_online_exams, mod_doubt_sessions,
mod_rankings, mod_study_material, mod_fee_management,
mod_enrollment, mod_reports, mod_online_classes
```

### online_teaching → gets these modules by default:
```
core_auth, core_dashboard, core_messaging, core_notices,
core_notifications, core_ai_notes, core_profile,
mod_courses, mod_subscriptions, mod_live_streaming,
mod_content_library, mod_progress_track, mod_assignments,
mod_online_exams, mod_certificates, mod_reports
```

### college → gets these modules by default:
```
core_auth, core_dashboard, core_messaging, core_notices,
core_notifications, core_ai_notes, core_profile,
mod_departments, mod_semesters, mod_timetable,
mod_attendance, mod_assignments, mod_exams,
mod_online_exams, mod_syllabus, mod_internal_marks,
mod_fee_management, mod_leave, mod_enrollment,
mod_placement, mod_reports, mod_library, mod_hostel
```

### tuition → gets these modules by default:
```
core_auth, core_dashboard, core_messaging, core_notices,
core_notifications, core_ai_notes, core_profile,
mod_timetable, mod_attendance, mod_assignments,
mod_fee_management, mod_reports, mod_student_dir
```

---

## HOW SUPER ADMIN CONTROLS THIS

### Step 1 — Onboard Institution
Super Admin creates institution and selects:
- Institution Type (school / coaching / online / college / tuition)
- Subscription Plan (basic / pro / enterprise)

### Step 2 — Auto Module Assignment
System automatically assigns the DEFAULT module set
for that institution type.

### Step 3 — Fine-tune Modules
Super Admin can then:
- ADD extra modules (e.g. give a school the coaching test_series module)
- REMOVE modules (e.g. disable hostel for a day school)
- Set feature flags within modules

### Step 4 — Institution Admin Sees Only Their Modules
The school admin's sidebar, dashboard, and API access
is filtered by their enabled modules.

---

## SIDEBAR RENDERING LOGIC

```
User logs in
    → Load their institution's enabled_modules[]
    → Filter sidebar nav items by:
        1. User role (teacher/student/admin)
        2. Institution's enabled modules
    → Render only what's allowed
```

Example:
- Coaching institute teacher → sees "Batches" not "Classes"
- Online teaching teacher → sees "Courses" not "Timetable"
- School teacher → sees "Timetable" + "Attendance"

---

## DATABASE IMPLEMENTATION

### In master DB — institutions table gets:
```sql
institution_type    VARCHAR(30)   -- school|coaching|online_teaching|college|tuition|hybrid
enabled_modules     TEXT[]        -- ['mod_attendance','mod_timetable','mod_fee_management',...]
custom_module_config JSONB        -- fine-grained flags per module
```

### institution_modules table (master DB):
```sql
id                  UUID
institution_id      UUID
module_key          VARCHAR(50)   -- 'mod_attendance'
is_enabled          BOOLEAN
config              JSONB         -- module-specific settings
enabled_by          UUID          -- superadmin who enabled it
enabled_at          TIMESTAMP
```

### module_catalog table (master DB):
```sql
id                  UUID
key                 VARCHAR(50)   -- 'mod_attendance'
name                VARCHAR(100)  -- 'Attendance Management'
description         TEXT
category            VARCHAR(50)   -- core|academic|admin|coaching|online|college
default_for         TEXT[]        -- ['school','college','coaching']
is_premium          BOOLEAN       -- requires pro/enterprise plan
icon                VARCHAR(50)   -- lucide icon name
```

---

## FRONTEND IMPLEMENTATION PLAN

### 1. useModules() hook
```typescript
// Returns which modules are enabled for current institution
const { hasModule, modules } = useModules()
hasModule('mod_attendance') // → true/false
```

### 2. ModuleGuard component
```tsx
<ModuleGuard module="mod_attendance">
  <AttendancePage />   // only renders if module is enabled
</ModuleGuard>
```

### 3. Dynamic Sidebar
```typescript
// Each nav item has a requiredModule field
{ href: '/teacher/attendance', module: 'mod_attendance', roles: ['teacher'] }
{ href: '/teacher/batches',    module: 'mod_batches',    roles: ['teacher'] }
// Sidebar filters by BOTH role AND enabled module
```

### 4. Super Admin Module Manager UI
```
Institution Detail Page → Modules Tab
┌─────────────────────────────────────┐
│ ✅ Attendance          [Core]        │
│ ✅ Timetable           [Academic]    │
│ ✅ Assignments         [Academic]    │
│ ❌ Transport           [Admin]  [+]  │
│ ❌ Hostel              [Admin]  [+]  │
│ ❌ Test Series         [Coaching][+] │
└─────────────────────────────────────┘
Super Admin toggles ON/OFF → saves to DB
→ Institution admin sees updated sidebar immediately
```

---

## NAMING DIFFERENCES BY TYPE

| Concept    | School      | Coaching    | Online      | College     |
|------------|-------------|-------------|-------------|-------------|
| Group      | Class       | Batch       | Course      | Department  |
| Sub-group  | Section     | Slot        | Module      | Semester    |
| Test       | Exam        | Test Series | Quiz        | Internal    |
| Teacher    | Teacher     | Faculty     | Instructor  | Professor   |
| Content    | Syllabus    | Study Mat.  | Course Mat. | Curriculum  |
| Schedule   | Timetable   | Schedule    | —           | Timetable   |

These labels are stored in institution_config and used
throughout the UI dynamically.

---

## SUMMARY

The architecture solves the problem in 3 clean ways:

1. INSTITUTION TYPE → determines the default experience
2. MODULE SYSTEM   → super admin enables/disables features
3. FEATURE FLAGS   → fine-grained control within each module

This means:
- One codebase handles ALL institution types
- No code duplication
- Super admin has full control
- Each institution sees only what they paid for / need
- New institution types can be added by just defining
  a new default module set — no code changes needed
