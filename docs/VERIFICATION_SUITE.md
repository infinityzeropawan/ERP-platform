# Buildroonix E2E Verification Suite Documentation

This document outlines the testing suite implemented to verify the integration and database connections between the Super Admin Control and the individual Institution Administrators (School, Coaching, and College).

---

## 🧪 Verification Suite Map

| Test ID | Functionality Name | Method | Endpoint | Database Model / Field Checked |
| :--- | :--- | :---: | :--- | :--- |
| **T-1** | Superadmin Authentication | `POST` | `/api/v1/auth/login` | `User` (email lookup & bcrypt password comparison) |
| **T-2** | Onboard School Admin | `POST` | `/api/v1/superadmin/institutions` | `Institution` & `User` (transactional SQL insert) |
| **T-3** | Onboard Coaching Admin | `POST` | `/api/v1/superadmin/institutions` | `Institution` & `User` (transactional SQL insert) |
| **T-4** | Onboard College Admin | `POST` | `/api/v1/superadmin/institutions` | `Institution` & `User` (transactional SQL insert) |
| **T-5** | Suspend Institution Status | `PUT` | `/api/v1/superadmin/institutions/:id/status` | `Institution.status` (value: `suspended`) |
| **T-6** | Upgrade Institution Plan | `PUT` | `/api/v1/superadmin/institutions/:id/plan` | `Institution.plan` (value: `enterprise`) |
| **T-7** | Restrict Feature Modules | `PUT` | `/api/v1/superadmin/institutions/:id/modules` | `Institution.enabledModules` (custom string array) |
| **T-8** | Set Status to Trial | `PUT` | `/api/v1/superadmin/institutions/:id/status` | `Institution.status` (value: `trial`) |
| **T-9** | Upgrade Plan to Pro | `PUT` | `/api/v1/superadmin/institutions/:id/plan` | `Institution.plan` (value: `pro`) |
| **T-10** | Modify Feature Modules | `PUT` | `/api/v1/superadmin/institutions/:id/modules` | `Institution.enabledModules` (custom string array) |
| **T-11** | Activate Institution Status | `PUT` | `/api/v1/superadmin/institutions/:id/status` | `Institution.status` (value: `active`) |
| **T-12** | Downgrade Plan to Basic | `PUT` | `/api/v1/superadmin/institutions/:id/plan` | `Institution.plan` (value: `basic`) |
| **T-13** | Minimal Module Assignment | `PUT` | `/api/v1/superadmin/institutions/:id/modules` | `Institution.enabledModules` (custom string array) |
| **T-14** | School DB Propagation | `GET` | `/api/v1/admin/my-institution` | `Institution` (checks status: suspended, plan: enterprise, active modules) |
| **T-15** | Coaching DB Propagation | `GET` | `/api/v1/admin/my-institution` | `Institution` (checks status: trial, plan: pro, active modules) |
| **T-16** | College DB Propagation | `GET` | `/api/v1/admin/my-institution` | `Institution` (checks status: active, plan: basic, active modules) |
| **T-17** | Create Teacher Profile | `POST` | `/api/v1/admin/users` | `User` (creates role: teacher, bcrypt password hash) |
| **T-18** | Create Student Profile | `POST` | `/api/v1/admin/users` | `User` (creates role: student, class/section fields, bcrypt) |
| **T-19** | Create Support Profile | `POST` | `/api/v1/admin/users` | `SupportStaff` (saves supportRole, salary, shift, busNumber) |
| **T-20** | Dynamically Register Class | `POST` | `/api/v1/admin/classes` | `User` (updates assigned teacher's class/section values) |
| **T-21** | Group Classes Verification | `GET` | `/api/v1/admin/classes` | `User` (dynamically groups student class lists & joins teacher name) |
| **T-22** | Rename Class / Section | `PUT` | `/api/v1/admin/classes/:id` | `User` (renames class & section string for all assigned users) |
| **T-23** | Student DB Rename Check | `GET` | `/api/v1/admin/users?role=student` | `User.class` (verifies student class field updated to renamed value) |
| **T-24** | Delete Class | `DELETE` | `/api/v1/admin/classes/:id` | `User` (clears class & section strings for all assigned users) |
| **T-25** | DB Unassign Check | `GET` | `/api/v1/admin/users?role=student` | `User.class` (verifies student class field reset to null on delete) |
| **T-26** | Auto-generate Payroll | `GET` | `/api/v1/admin/payroll` | `StaffPayroll` (verifies pending entries generated for all staff) |
| **T-27** | Disburse Salary Payout | `PUT` | `/api/v1/admin/payroll/:id/pay` | `StaffPayroll.status` (updates status: `paid`, saves paymentMethod) |
| **T-28** | Staff Login Authentication | `POST` | `/api/v1/auth/login` | `User` (verifies registered teacher can log in using `staff123` default) |
| **T-29** | Teacher Salary Slip Fetch | `GET` | `/api/v1/teacher/payroll` | `StaffPayroll` (verifies logged-in teacher can fetch their own paid slip) |
| **T-30** | Create Daily Diary Entry | `POST` | `/api/v1/teacher/diaries` | `DailyDiary` (creates homework/classwork record for the active class/section) |
| **T-31** | Fetch Daily Diary List | `GET` | `/api/v1/teacher/diaries` | `DailyDiary` (verifies published logs are returned dynamically) |
| **T-32** | Save Batch Gradebook Marks | `POST` | `/api/v1/teacher/gradebook/batch` | `GradebookEntry` (creates or updates exam scores using a transaction) |
| **T-33** | Pivoted Class Gradebook | `GET` | `/api/v1/teacher/gradebook` | `GradebookEntry` & `User` (computes total marks, percentages, and grade letters) |
| **T-34** | Student Authentication | `POST` | `/api/v1/auth/login` | `User` (verifies registered student can authenticate using `student123` format) |
| **T-35** | Student Class-Info Directory | `GET` | `/api/v1/student/class-info` | `User` (joins classmates sharing class/section and active class teachers) |
| **T-36** | Student Personal Results | `GET` | `/api/v1/student/results` | `GradebookEntry` (verifies student can fetch academic scores and remarks) |
| **T-37** | Student Self-Registration | `POST` | `/api/v1/auth/register` | `User` (creates user with role student and isApproved false) |
| **T-38** | Login Block Pre-Approval | `POST` | `/api/v1/auth/login` | `User.isApproved` (verifies login attempt fails with 403 Forbidden) |
| **T-39** | Pending Enrollments List | `GET` | `/api/v1/admin/enrollment-requests` | `User` (verifies school admin can query pending registrations queue) |
| **T-40** | Approve Student Enrollment | `PUT` | `/api/v1/admin/enrollment-requests/:id/approve` | `User.isApproved` (sets isApproved to true for the selected student) |
| **T-41** | Login Success Post-Approval | `POST` | `/api/v1/auth/login` | `User` (verifies student can authenticate successfully after approval) |
| **T-42** | Parent Account Onboarding | `POST` | `/api/v1/admin/users` | `User` (creates parent user profile linked to child student) |
| **T-43** | Post Parent Message Alert | `POST` | `/api/v1/teacher/parent-messages` | `ParentMessage` (teacher logs academic/behavioral alert regarding student) |
| **T-44** | Query Parent Alerts Queue | `GET` | `/api/v1/admin/parent-messages` | `ParentMessage` (admin fetches active conversational logs list) |
| **T-45** | Parent Inbox & Child Info | `GET` | `/api/v1/parent/messages` | `ParentMessage` & `User` (verifies parent views child info & alerts) |

---

## 🔍 Detailed Functionality Analysis

### 1. Authentication Engine (`T-1`, `T-28`, `T-34`)
- **Action**: Authenticate User sessions.
- **Verification Details**: Verifies that Super Admins, School Admins, Teachers, and Students can successfully authenticate using bcrypt password comparisons, returning signed JWT session tokens containing their active role claims.

### 2. Multi-Tenant Onboarding (`T-2`, `T-3`, `T-4`)
- **Action**: Register three distinct institution types: School, Coaching, and College.
- **Verification Details**:
  - Validates transactional integrity: The script ensures that both the `Institution` record and its accompanying administrator `User` record are either successfully committed together or fully rolled back in the database (`prisma.$transaction`).

### 3. Administrative Control Actions (`T-5` to `T-13`)
- **Action**: Modify tenant status, subscription plans, and modules.
- **Verification Details**: Tests the ability to suspend, activate, or trial tenants, upgrade or downgrade plans, and adjust active feature modules from the super admin console.

### 4. Database-Backed Propagation Checks (`T-14`, `T-15`, `T-16`)
- **Action**: Login as the tenant admins and fetch their profiles.
- **Verification Details**: Logs in and checks that all status, plan, and module modifications made by the Super Admin correspond exactly to the parsed JSON response retrieved from the database.

### 5. School Admin User Directories (`T-17`, `T-18`, `T-19`)
- **Action**: School Admin CRUD actions on Student, Teacher, and Support Staff profiles.
- **Verification Details**: Verifies that users and support staff are created successfully, mapping credentials, shift patterns, and default passwords correctly.

### 6. Dynamic Classes Calculation & Management (`T-20` to `T-25`)
- **Action**: Manage class/section structures dynamically using student and teacher record properties.
- **Verification Details**: Verifies that assigning a teacher registers a class, grouping is computed dynamically, and renaming or deleting a class propagates structural updates across all assigned users.

### 7. Staff Payroll System (`T-26`, `T-27`, `T-29`)
- **Action**: Auto-generate monthly payroll sheets, disburse salaries, and enable employees to fetch slips.
- **Verification Details**:
  - **Auto-generation**: Opening the payroll page automatically populates pending salary lines for all registered staff.
  - **Disbursement**: Admin paying a salary record updates payment status to `paid` and saves transaction history.
  - **Employee Fetch**: Authenticated staff members can view and query their own paid slips from the database.

### 8. Teacher & Student Dashboard Integration (`T-30` to `T-36`)
- **Action**: Post diaries, spreadsheet gradebook batch entry, and view classmates, teachers, and results.
- **Verification Details**:
  - **Class Diary**: Verifies that teachers can post classwork and homework logs which are queryable dynamically.
  - **Gradebook**: Verifies that teachers can batch update student exam types (Unit Tests, Mid Terms, Assignments, Practicals) in a database transaction, which compute cumulative percentage summaries on the fly.
  - **Student Directory & Results**: Verifies that logged-in students can view classmate lists, assigned teacher profiles, and personal graded scorecard histories.

### 9. Student Registration & Admin Approvals (`T-37` to `T-41`)
- **Action**: Public student registration request flow, pre-approval security checks, and admin approvals queue.
- **Verification Details**:
  - **Self-registration**: Students can self-register using the public `/register` form by specifying an institution slug, creating a pending account record (`isApproved: false`).
  - **Security Guard**: Unapproved student accounts are rejected during login authentication with a `403 PendingApproval` status.
  - **Approval Queue**: School Admins retrieve pending registration lists, and approve accounts (set `isApproved: true`) or reject them (deletes the record).
  - **Activation**: Approved students can successfully sign in and access dashboard features.

---

## 🌐 Phase 3 & 4 API Specifications, DB Integration & Verification Status

> [!NOTE]
> **Complete Teacher & Student Functionality Verification Status**:
> All backend API routes, database operations, and frontend screens for both Teacher and Student roles are fully integrated with PostgreSQL and verified.
> There are no mock or static data references remaining in the following core directories:
> - **Teacher dashboard**: Daily Diary logs, Gradebook pivot scorecard tables, and Payroll slips history are 100% live.
> - **Student dashboard**: Self-registration flow, Class directories (classmates and teachers), and academic Results sheets are 100% live.

This section documents the specific HTTP API interfaces implemented for Phase 3 and Phase 4 and how they map to PostgreSQL table queries.

### 1. Teacher APIs & DB Interactions (`/api/v1/teacher`)

#### A. Class Diary Management
- **`GET /diaries`**
  - **Description**: Fetch all class diary entries logged for the institution.
  - **Prisma SQL equivalent**: `prisma.dailyDiary.findMany({ where: { institutionId }, orderBy: { date: 'desc' } })`
- **`POST /diaries`**
  - **Description**: Add a new daily homework/classwork task log.
  - **Payload**:
    ```json
    {
      "className": "Class-XI",
      "section": "B",
      "subject": "IOT & Embedded Systems",
      "teacherName": "Pawan Kumar Dubey",
      "classwork": "Introduction to Microcontrollers",
      "homework": "Read Chapter 1"
    }
    ```
  - **Prisma SQL equivalent**: `prisma.dailyDiary.create({ data: { ... } })`
- **`PUT /diaries/:id`**
  - **Description**: Edit an existing class diary log.
- **`DELETE /diaries/:id`**
  - **Description**: Remove a class diary log from the database.

#### B. Gradebook Spreadsheets
- **`GET /gradebook?subject=...&class=...&section=...`**
  - **Description**: Returns pivoted scorecard rows for students of the specified class and subject.
  - **Logic**: Selects students assigned to `class` and `section`, queries all matching `GradebookEntry` records, and pivots exam scores (`Unit Test 1`, `Unit Test 2`, `Mid Term`, `Assignment`, `Practical`) on the fly, calculating percentages and letter grades.
- **`POST /gradebook/batch`**
  - **Description**: Batch upserts student marks inside a transaction.
  - **Payload**:
    ```json
    {
      "subject": "IOT & Embedded Systems",
      "entries": [
        {
          "id": "student-uuid",
          "studentName": "Aman Sharma",
          "unitTest1": 22,
          "unitTest2": 20,
          "midTerm": 82,
          "assignment": 24,
          "practical": 46,
          "remarks": "Outstanding performance"
        }
      ]
    }
    ```
  - **Prisma SQL equivalent**: Executes batch inserts/updates within a transaction: `prisma.$transaction([ prisma.gradebookEntry.update(...), prisma.gradebookEntry.create(...) ])`

---

### 2. Student APIs & DB Interactions (`/api/v1/student`)

- **`GET /class-info`**
  - **Description**: Retrieve classmates sharing the logged-in student's `class`/`section` and view active class teachers.
  - **Prisma SQL equivalent**:
    - Classmates: `prisma.user.findMany({ where: { institutionId, role: 'student', class, section } })`
    - Teachers: `prisma.user.findMany({ where: { institutionId, role: 'teacher', class, section } })`
- **`GET /results`**
  - **Description**: Retrieve academic exam scores.
  - **Prisma SQL equivalent**: `prisma.gradebookEntry.findMany({ where: { studentId, institutionId }, orderBy: { date: 'desc' } })`
- **`GET /diaries`**
  - **Description**: Retrieve published class homework assignments.
  - **Prisma SQL equivalent**: `prisma.dailyDiary.findMany({ where: { institutionId, className, section, isPublished: true } })`

---

### 3. Student Self-Registration & Admin Approval APIs

#### A. Public Registration & Authentication (`/api/v1/auth`)
- **`POST /register`**
  - **Description**: Public form endpoint to register student profiles. Marks profiles with `isApproved: false` and links them to the resolved institution.
  - **Prisma SQL equivalent**: `prisma.user.create({ data: { ...isApproved: false, institutionId } })`
- **`POST /login`**
  - **Description**: Validates user credentials. Enforces approval status check by returning `403 Forbidden` if `isApproved` is false.
  - **Prisma SQL equivalent**: `prisma.user.findUnique({ where: { email } })`

#### B. Administrative Approvals (`/api/v1/admin`)
- **`GET /enrollment-requests`**
  - **Description**: Fetch all unapproved students contextually registered to the school.
  - **Prisma SQL equivalent**: `prisma.user.findMany({ where: { institutionId, role: 'student', isApproved: false } })`
- **`PUT /enrollment-requests/:id/approve`**
  - **Description**: Approve a student and activate their account access.
  - **Prisma SQL equivalent**: `prisma.user.update({ where: { id }, data: { isApproved: true } })`
- **`DELETE /enrollment-requests/:id`**
  - **Description**: Reject and remove a student from the database.
  - **Prisma SQL equivalent**: `prisma.user.delete({ where: { id } })`

---

### 4. Parent Communication & Conversational Loop APIs

#### A. Administrative & Teacher Interfaces (`/api/v1/admin` & `/api/v1/teacher`)
- **`GET /parent-messages`**
  - **Description**: Fetch all parent messages for the active institution.
  - **Prisma SQL equivalent**: `prisma.parentMessage.findMany({ where: { institutionId } })`
- **`POST /parent-messages`**
  - **Description**: Publish an academic alert or message to a parent.
  - **Prisma SQL equivalent**: `prisma.parentMessage.create({ data: { ... } })`

#### B. Parent Inbox & Child Profile Info (`/api/v1/parent`)
- **`GET /child-info`**
  - **Description**: Resolves student profile information for the parent user.
  - **Prisma SQL equivalent**: `prisma.user.findFirst({ where: { institutionId, role: 'student', fatherName: parentUser.name } })`
- **`GET /messages`**
  - **Description**: Retrieve personal and broadcasted school messages.
  - **Prisma SQL equivalent**: `prisma.parentMessage.findMany({ where: { institutionId, studentId: child.id } })`
- **`POST /messages`**
  - **Description**: Send a reply message to the school teacher/admin.
  - **Prisma SQL equivalent**: `prisma.parentMessage.create({ data: { teacherId: 'admin', studentId: child.id, ... } })`

---

## 🏃 Running the Verification Script

Execute the script from the backend directory to check the API health and verify database connection routing:
```bash
cd backend
bash verify-superadmin-connections.sh
```
