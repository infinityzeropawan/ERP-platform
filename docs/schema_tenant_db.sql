-- ============================================================
-- BUILDROONIX — TENANT (INSTITUTION) DATABASE SCHEMA
-- Database: {institution_slug}_db  (e.g. greenwood_db)
-- One copy of this schema per institution
-- Controlled by: School Admin of that institution
-- ============================================================

-- ─────────────────────────────────────────────────────────────
-- TABLE: institution_config
-- Institution-level settings (mirrors master but local copy)
-- ─────────────────────────────────────────────────────────────
CREATE TABLE institution_config (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institution_id      UUID NOT NULL UNIQUE,       -- FK to master DB institutions.id
    name                VARCHAR(200) NOT NULL,
    slug                VARCHAR(100) NOT NULL,
    logo_url            TEXT,
    address             TEXT,
    phone               VARCHAR(20),
    email               VARCHAR(150),
    academic_year       VARCHAR(20) DEFAULT '2026-2027',
    timezone            VARCHAR(100) DEFAULT 'Asia/Kolkata',
    currency            VARCHAR(10) DEFAULT 'INR',
    working_days        VARCHAR(20) DEFAULT 'Mon-Sat',  -- Mon-Sat | Mon-Fri
    theme_color         VARCHAR(20) DEFAULT '#0d9488',
    updated_at          TIMESTAMP DEFAULT NOW()
);

-- ─────────────────────────────────────────────────────────────
-- TABLE: users
-- All users of this institution (admin, teacher, student)
-- ─────────────────────────────────────────────────────────────
CREATE TABLE users (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institution_id      UUID NOT NULL,              -- which institution
    name                VARCHAR(150) NOT NULL,
    email               VARCHAR(150) UNIQUE NOT NULL,
    phone               VARCHAR(20),
    password_hash       TEXT NOT NULL,
    role                VARCHAR(30) NOT NULL,        -- school_admin | teacher | student
    avatar_url          TEXT,
    gender              VARCHAR(20),                 -- Male | Female | Other
    date_of_birth       DATE,
    blood_group         VARCHAR(10),
    address             TEXT,
    emergency_phone     VARCHAR(20),
    joining_date        DATE,
    is_active           BOOLEAN DEFAULT TRUE,
    is_email_verified   BOOLEAN DEFAULT FALSE,
    last_login_at       TIMESTAMP,
    created_at          TIMESTAMP DEFAULT NOW(),
    updated_at          TIMESTAMP DEFAULT NOW()
);

-- ─────────────────────────────────────────────────────────────
-- TABLE: teacher_profiles
-- Extended info for teachers
-- ─────────────────────────────────────────────────────────────
CREATE TABLE teacher_profiles (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id             UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    employee_id         VARCHAR(50) UNIQUE,
    qualification       VARCHAR(200),               -- "B.Tech, M.Tech"
    specialization      VARCHAR(200),               -- "IoT, Embedded Systems"
    experience_years    INT DEFAULT 0,
    designation         VARCHAR(100),               -- "Assistant Professor"
    department          VARCHAR(100),
    salary              DECIMAL(12,2),
    bank_account        VARCHAR(50),
    pan_number          VARCHAR(20),
    created_at          TIMESTAMP DEFAULT NOW()
);

-- ─────────────────────────────────────────────────────────────
-- TABLE: student_profiles
-- Extended info for students
-- ─────────────────────────────────────────────────────────────
CREATE TABLE student_profiles (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id             UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    roll_number         VARCHAR(50),
    admission_number    VARCHAR(50) UNIQUE,
    class_id            UUID,                       -- FK → classes.id (set after class creation)
    section_id          UUID,                       -- FK → sections.id
    parent_name         VARCHAR(150),
    parent_phone        VARCHAR(20),
    parent_email        VARCHAR(150),
    parent_occupation   VARCHAR(100),
    previous_school     VARCHAR(200),
    admission_date      DATE,
    fee_status          VARCHAR(30) DEFAULT 'paid', -- paid | pending | partial
    created_at          TIMESTAMP DEFAULT NOW()
);

-- ─────────────────────────────────────────────────────────────
-- TABLE: academic_years
-- Tracks academic sessions
-- ─────────────────────────────────────────────────────────────
CREATE TABLE academic_years (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institution_id  UUID NOT NULL,
    name            VARCHAR(20) NOT NULL,       -- "2026-2027"
    start_date      DATE NOT NULL,
    end_date        DATE NOT NULL,
    is_current      BOOLEAN DEFAULT FALSE,
    created_at      TIMESTAMP DEFAULT NOW()
);

-- ─────────────────────────────────────────────────────────────
-- TABLE: departments
-- Departments within an institution
-- ─────────────────────────────────────────────────────────────
CREATE TABLE departments (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institution_id  UUID NOT NULL,
    name            VARCHAR(100) NOT NULL,      -- "Computer Science", "IoT"
    code            VARCHAR(20),                -- "CS", "IOT"
    head_teacher_id UUID REFERENCES users(id),
    description     TEXT,
    is_active       BOOLEAN DEFAULT TRUE,
    created_at      TIMESTAMP DEFAULT NOW()
);

-- ─────────────────────────────────────────────────────────────
-- TABLE: classes
-- A class/batch (e.g. "IOT-2026", "CS-2025")
-- ─────────────────────────────────────────────────────────────
CREATE TABLE classes (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institution_id      UUID NOT NULL,
    academic_year_id    UUID REFERENCES academic_years(id),
    department_id       UUID REFERENCES departments(id),
    name                VARCHAR(100) NOT NULL,       -- "IOT-2026"
    display_name        VARCHAR(150),                -- "IoT Engineering 2026 Batch"
    class_teacher_id    UUID REFERENCES users(id),   -- homeroom teacher
    max_students        INT DEFAULT 60,
    is_active           BOOLEAN DEFAULT TRUE,
    created_at          TIMESTAMP DEFAULT NOW()
);

-- ─────────────────────────────────────────────────────────────
-- TABLE: sections
-- Sections within a class (Morning, Evening, A, B)
-- ─────────────────────────────────────────────────────────────
CREATE TABLE sections (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    class_id        UUID REFERENCES classes(id) ON DELETE CASCADE,
    name            VARCHAR(50) NOT NULL,        -- "Evening", "Morning", "A", "B"
    teacher_id      UUID REFERENCES users(id),   -- section teacher
    room_number     VARCHAR(50),
    max_students    INT DEFAULT 30,
    created_at      TIMESTAMP DEFAULT NOW()
);

-- ─────────────────────────────────────────────────────────────
-- TABLE: subjects
-- Subjects/courses offered
-- ─────────────────────────────────────────────────────────────
CREATE TABLE subjects (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institution_id  UUID NOT NULL,
    department_id   UUID REFERENCES departments(id),
    name            VARCHAR(150) NOT NULL,       -- "IoT & Embedded System"
    code            VARCHAR(30) UNIQUE NOT NULL, -- "IOT101"
    description     TEXT,
    credits         INT DEFAULT 3,
    type            VARCHAR(30) DEFAULT 'theory', -- theory | practical | both
    is_active       BOOLEAN DEFAULT TRUE,
    created_at      TIMESTAMP DEFAULT NOW()
);

-- ─────────────────────────────────────────────────────────────
-- TABLE: class_subjects
-- Which subjects are taught in which class (many-to-many)
-- ─────────────────────────────────────────────────────────────
CREATE TABLE class_subjects (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    class_id        UUID REFERENCES classes(id) ON DELETE CASCADE,
    subject_id      UUID REFERENCES subjects(id) ON DELETE CASCADE,
    teacher_id      UUID REFERENCES users(id),   -- assigned teacher for this subject
    academic_year_id UUID REFERENCES academic_years(id),
    UNIQUE(class_id, subject_id, academic_year_id)
);

-- ─────────────────────────────────────────────────────────────
-- TABLE: timetable_slots
-- Weekly timetable definition
-- ─────────────────────────────────────────────────────────────
CREATE TABLE timetable_slots (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institution_id  UUID NOT NULL,
    class_id        UUID REFERENCES classes(id) ON DELETE CASCADE,
    section_id      UUID REFERENCES sections(id),
    subject_id      UUID REFERENCES subjects(id),
    teacher_id      UUID REFERENCES users(id),
    day_of_week     VARCHAR(10) NOT NULL,        -- Mon | Tue | Wed | Thu | Fri | Sat | Sun
    period_name     VARCHAR(50),                 -- "Evening Period", "Period 1"
    start_time      TIME NOT NULL,               -- 20:30
    end_time        TIME NOT NULL,               -- 21:30
    room_number     VARCHAR(50),
    academic_year_id UUID REFERENCES academic_years(id),
    is_active       BOOLEAN DEFAULT TRUE,
    created_at      TIMESTAMP DEFAULT NOW()
);

-- ─────────────────────────────────────────────────────────────
-- TABLE: attendance
-- Daily attendance records per student per period
-- ─────────────────────────────────────────────────────────────
CREATE TABLE attendance (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institution_id  UUID NOT NULL,
    student_id      UUID REFERENCES users(id) ON DELETE CASCADE,
    class_id        UUID REFERENCES classes(id),
    section_id      UUID REFERENCES sections(id),
    subject_id      UUID REFERENCES subjects(id),
    timetable_slot_id UUID REFERENCES timetable_slots(id),
    teacher_id      UUID REFERENCES users(id),   -- who marked it
    date            DATE NOT NULL,
    status          VARCHAR(20) NOT NULL,         -- present | absent | late | excused
    remarks         TEXT,
    marked_at       TIMESTAMP DEFAULT NOW(),
    UNIQUE(student_id, timetable_slot_id, date)
);

-- ─────────────────────────────────────────────────────────────
-- TABLE: assignments
-- Assignments and homework created by teachers
-- ─────────────────────────────────────────────────────────────
CREATE TABLE assignments (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institution_id  UUID NOT NULL,
    teacher_id      UUID REFERENCES users(id) ON DELETE CASCADE,
    class_id        UUID REFERENCES classes(id),
    section_id      UUID REFERENCES sections(id),
    subject_id      UUID REFERENCES subjects(id),
    title           VARCHAR(200) NOT NULL,
    description     TEXT,
    type            VARCHAR(30) DEFAULT 'assignment', -- assignment | homework | project
    due_date        DATE NOT NULL,
    max_marks       INT DEFAULT 100,
    attachment_url  TEXT,                        -- file upload URL
    status          VARCHAR(30) DEFAULT 'active', -- active | closed | draft
    academic_year_id UUID REFERENCES academic_years(id),
    created_at      TIMESTAMP DEFAULT NOW(),
    updated_at      TIMESTAMP DEFAULT NOW()
);

-- ─────────────────────────────────────────────────────────────
-- TABLE: assignment_submissions
-- Student submissions for assignments
-- ─────────────────────────────────────────────────────────────
CREATE TABLE assignment_submissions (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assignment_id   UUID REFERENCES assignments(id) ON DELETE CASCADE,
    student_id      UUID REFERENCES users(id) ON DELETE CASCADE,
    submission_url  TEXT,                        -- uploaded file
    submission_text TEXT,                        -- text answer
    submitted_at    TIMESTAMP DEFAULT NOW(),
    marks_obtained  INT,
    feedback        TEXT,
    graded_by       UUID REFERENCES users(id),
    graded_at       TIMESTAMP,
    status          VARCHAR(30) DEFAULT 'submitted', -- submitted | graded | late | missing
    UNIQUE(assignment_id, student_id)
);

-- ─────────────────────────────────────────────────────────────
-- TABLE: exams
-- Exam schedules
-- ─────────────────────────────────────────────────────────────
CREATE TABLE exams (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institution_id  UUID NOT NULL,
    class_id        UUID REFERENCES classes(id),
    section_id      UUID REFERENCES sections(id),
    subject_id      UUID REFERENCES subjects(id),
    teacher_id      UUID REFERENCES users(id),
    academic_year_id UUID REFERENCES academic_years(id),
    title           VARCHAR(200) NOT NULL,       -- "Mid-Term Exam"
    exam_type       VARCHAR(50),                 -- midterm | final | unit_test | online
    exam_date       DATE NOT NULL,
    start_time      TIME,
    duration_mins   INT,                         -- 180 = 3 hours
    max_marks       INT NOT NULL,
    passing_marks   INT,
    room_number     VARCHAR(50),
    instructions    TEXT,
    status          VARCHAR(30) DEFAULT 'scheduled', -- scheduled | ongoing | completed | cancelled
    created_at      TIMESTAMP DEFAULT NOW()
);

-- ─────────────────────────────────────────────────────────────
-- TABLE: exam_results
-- Student marks in exams
-- ─────────────────────────────────────────────────────────────
CREATE TABLE exam_results (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    exam_id         UUID REFERENCES exams(id) ON DELETE CASCADE,
    student_id      UUID REFERENCES users(id) ON DELETE CASCADE,
    marks_obtained  DECIMAL(6,2),
    grade           VARCHAR(5),                  -- A+ | A | B | C | D | F
    remarks         TEXT,
    is_absent       BOOLEAN DEFAULT FALSE,
    entered_by      UUID REFERENCES users(id),
    entered_at      TIMESTAMP DEFAULT NOW(),
    UNIQUE(exam_id, student_id)
);

-- ─────────────────────────────────────────────────────────────
-- TABLE: online_exams
-- MCQ/online exam questions
-- ─────────────────────────────────────────────────────────────
CREATE TABLE online_exams (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institution_id  UUID NOT NULL,
    teacher_id      UUID REFERENCES users(id),
    class_id        UUID REFERENCES classes(id),
    subject_id      UUID REFERENCES subjects(id),
    title           VARCHAR(200) NOT NULL,
    instructions    TEXT,
    duration_mins   INT NOT NULL,
    total_marks     INT NOT NULL,
    start_datetime  TIMESTAMP,
    end_datetime    TIMESTAMP,
    shuffle_questions BOOLEAN DEFAULT TRUE,
    show_result_immediately BOOLEAN DEFAULT FALSE,
    status          VARCHAR(30) DEFAULT 'draft', -- draft | published | ongoing | completed
    created_at      TIMESTAMP DEFAULT NOW()
);

CREATE TABLE online_exam_questions (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    online_exam_id  UUID REFERENCES online_exams(id) ON DELETE CASCADE,
    question_text   TEXT NOT NULL,
    question_type   VARCHAR(30) DEFAULT 'mcq',  -- mcq | true_false | short_answer
    options         JSONB,                       -- ["Option A", "Option B", "Option C", "Option D"]
    correct_answer  VARCHAR(500),
    marks           INT DEFAULT 1,
    order_index     INT DEFAULT 0
);

CREATE TABLE online_exam_attempts (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    online_exam_id  UUID REFERENCES online_exams(id),
    student_id      UUID REFERENCES users(id),
    answers         JSONB,                       -- {question_id: "answer"}
    score           DECIMAL(6,2),
    started_at      TIMESTAMP,
    submitted_at    TIMESTAMP,
    status          VARCHAR(30) DEFAULT 'in_progress', -- in_progress | submitted | graded
    UNIQUE(online_exam_id, student_id)
);

-- ─────────────────────────────────────────────────────────────
-- TABLE: syllabus
-- Course syllabus per subject per class
-- ─────────────────────────────────────────────────────────────
CREATE TABLE syllabus (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    class_id        UUID REFERENCES classes(id),
    subject_id      UUID REFERENCES subjects(id),
    academic_year_id UUID REFERENCES academic_years(id),
    unit_number     INT NOT NULL,
    unit_title      VARCHAR(200) NOT NULL,
    topics          TEXT,                        -- comma-separated or JSON
    total_hours     INT,
    completed_hours INT DEFAULT 0,
    status          VARCHAR(30) DEFAULT 'pending', -- pending | in_progress | completed
    created_at      TIMESTAMP DEFAULT NOW()
);

-- ─────────────────────────────────────────────────────────────
-- TABLE: lesson_plans
-- Teacher's lesson plans per topic
-- ─────────────────────────────────────────────────────────────
CREATE TABLE lesson_plans (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    teacher_id      UUID REFERENCES users(id),
    class_id        UUID REFERENCES classes(id),
    subject_id      UUID REFERENCES subjects(id),
    syllabus_id     UUID REFERENCES syllabus(id),
    title           VARCHAR(200) NOT NULL,
    objectives      TEXT,
    content         TEXT,
    teaching_aids   TEXT,
    planned_date    DATE,
    duration_mins   INT,
    status          VARCHAR(30) DEFAULT 'draft', -- draft | approved | completed
    created_at      TIMESTAMP DEFAULT NOW()
);

-- ─────────────────────────────────────────────────────────────
-- TABLE: leave_requests
-- Teacher/student leave applications
-- ─────────────────────────────────────────────────────────────
CREATE TABLE leave_requests (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institution_id  UUID NOT NULL,
    user_id         UUID REFERENCES users(id) ON DELETE CASCADE,
    leave_type      VARCHAR(50) NOT NULL,        -- sick | casual | earned | emergency | maternity
    from_date       DATE NOT NULL,
    to_date         DATE NOT NULL,
    total_days      INT,
    reason          TEXT,
    attachment_url  TEXT,
    status          VARCHAR(30) DEFAULT 'pending', -- pending | approved | rejected | cancelled
    reviewed_by     UUID REFERENCES users(id),
    reviewed_at     TIMESTAMP,
    review_remarks  TEXT,
    created_at      TIMESTAMP DEFAULT NOW()
);

-- ─────────────────────────────────────────────────────────────
-- TABLE: notices
-- Announcements within an institution
-- ─────────────────────────────────────────────────────────────
CREATE TABLE notices (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institution_id  UUID NOT NULL,
    created_by      UUID REFERENCES users(id),
    title           VARCHAR(200) NOT NULL,
    content         TEXT NOT NULL,
    target_role     VARCHAR(30) DEFAULT 'all',   -- all | teacher | student | school_admin
    target_class_id UUID REFERENCES classes(id), -- NULL = all classes
    attachment_url  TEXT,
    is_published    BOOLEAN DEFAULT TRUE,
    published_at    TIMESTAMP DEFAULT NOW(),
    expires_at      TIMESTAMP,
    created_at      TIMESTAMP DEFAULT NOW()
);

-- ─────────────────────────────────────────────────────────────
-- TABLE: messages
-- 1-to-1 direct messages between users
-- ─────────────────────────────────────────────────────────────
CREATE TABLE messages (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institution_id  UUID NOT NULL,
    sender_id       UUID REFERENCES users(id) ON DELETE CASCADE,
    receiver_id     UUID REFERENCES users(id) ON DELETE CASCADE,
    content         TEXT NOT NULL,
    attachment_url  TEXT,
    is_read         BOOLEAN DEFAULT FALSE,
    read_at         TIMESTAMP,
    created_at      TIMESTAMP DEFAULT NOW()
);

-- ─────────────────────────────────────────────────────────────
-- TABLE: online_classes
-- Virtual class sessions (Zoom/Meet links)
-- ─────────────────────────────────────────────────────────────
CREATE TABLE online_classes (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institution_id  UUID NOT NULL,
    teacher_id      UUID REFERENCES users(id),
    class_id        UUID REFERENCES classes(id),
    section_id      UUID REFERENCES sections(id),
    subject_id      UUID REFERENCES subjects(id),
    title           VARCHAR(200) NOT NULL,
    description     TEXT,
    platform        VARCHAR(50),                 -- zoom | google_meet | teams | custom
    meeting_link    TEXT,
    meeting_id      VARCHAR(100),
    meeting_password VARCHAR(100),
    scheduled_at    TIMESTAMP NOT NULL,
    duration_mins   INT DEFAULT 60,
    status          VARCHAR(30) DEFAULT 'scheduled', -- scheduled | live | completed | cancelled
    recording_url   TEXT,
    created_at      TIMESTAMP DEFAULT NOW()
);

-- ─────────────────────────────────────────────────────────────
-- TABLE: previous_papers
-- Previous year question papers
-- ─────────────────────────────────────────────────────────────
CREATE TABLE previous_papers (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institution_id  UUID NOT NULL,
    subject_id      UUID REFERENCES subjects(id),
    class_id        UUID REFERENCES classes(id),
    title           VARCHAR(200) NOT NULL,
    exam_year       INT NOT NULL,
    exam_type       VARCHAR(50),                 -- midterm | final | university
    file_url        TEXT NOT NULL,
    uploaded_by     UUID REFERENCES users(id),
    created_at      TIMESTAMP DEFAULT NOW()
);

-- ─────────────────────────────────────────────────────────────
-- TABLE: enrollment_requests
-- Students applying to join an institution
-- ─────────────────────────────────────────────────────────────
CREATE TABLE enrollment_requests (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institution_id  UUID NOT NULL,
    student_name    VARCHAR(150) NOT NULL,
    email           VARCHAR(150) NOT NULL,
    phone           VARCHAR(20),
    date_of_birth   DATE,
    class_id        UUID REFERENCES classes(id),
    parent_name     VARCHAR(150),
    parent_phone    VARCHAR(20),
    documents_url   TEXT[],                      -- array of uploaded doc URLs
    status          VARCHAR(30) DEFAULT 'pending', -- pending | approved | rejected | waitlisted
    reviewed_by     UUID REFERENCES users(id),
    reviewed_at     TIMESTAMP,
    remarks         TEXT,
    applied_at      TIMESTAMP DEFAULT NOW()
);

-- ─────────────────────────────────────────────────────────────
-- TABLE: holidays
-- Institution holiday calendar
-- ─────────────────────────────────────────────────────────────
CREATE TABLE holidays (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institution_id  UUID NOT NULL,
    academic_year_id UUID REFERENCES academic_years(id),
    name            VARCHAR(150) NOT NULL,
    holiday_date    DATE NOT NULL,
    type            VARCHAR(50) DEFAULT 'national', -- national | regional | institution
    description     TEXT,
    created_at      TIMESTAMP DEFAULT NOW()
);

-- ─────────────────────────────────────────────────────────────
-- TABLE: ai_notes_history
-- Tracks AI-generated notes per user
-- ─────────────────────────────────────────────────────────────
CREATE TABLE ai_notes_history (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institution_id  UUID NOT NULL,
    user_id         UUID REFERENCES users(id) ON DELETE CASCADE,
    subject_id      UUID REFERENCES subjects(id),
    topic           VARCHAR(200) NOT NULL,
    prompt_used     TEXT,
    generated_notes TEXT NOT NULL,
    tokens_used     INT,
    created_at      TIMESTAMP DEFAULT NOW()
);

-- ─────────────────────────────────────────────────────────────
-- TABLE: activity_logs
-- Audit trail within an institution
-- ─────────────────────────────────────────────────────────────
CREATE TABLE activity_logs (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institution_id  UUID NOT NULL,
    user_id         UUID REFERENCES users(id),
    role            VARCHAR(30),
    action          VARCHAR(200) NOT NULL,        -- "marked_attendance", "created_assignment"
    entity_type     VARCHAR(50),                  -- "attendance" | "assignment" | "exam"
    entity_id       UUID,
    details         JSONB,
    ip_address      VARCHAR(50),
    created_at      TIMESTAMP DEFAULT NOW()
);

-- ─────────────────────────────────────────────────────────────
-- TABLE: notifications
-- In-app notifications per user
-- ─────────────────────────────────────────────────────────────
CREATE TABLE notifications (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institution_id  UUID NOT NULL,
    user_id         UUID REFERENCES users(id) ON DELETE CASCADE,
    title           VARCHAR(200) NOT NULL,
    body            TEXT,
    type            VARCHAR(50),                 -- assignment | exam | attendance | notice | message
    reference_id    UUID,                        -- ID of the related entity
    is_read         BOOLEAN DEFAULT FALSE,
    read_at         TIMESTAMP,
    created_at      TIMESTAMP DEFAULT NOW()
);

-- ─────────────────────────────────────────────────────────────
-- TABLE: fee_structure
-- Fee plans per class
-- ─────────────────────────────────────────────────────────────
CREATE TABLE fee_structure (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institution_id  UUID NOT NULL,
    class_id        UUID REFERENCES classes(id),
    academic_year_id UUID REFERENCES academic_years(id),
    fee_type        VARCHAR(100) NOT NULL,        -- "Tuition Fee" | "Lab Fee" | "Exam Fee"
    amount          DECIMAL(10,2) NOT NULL,
    due_date        DATE,
    is_mandatory    BOOLEAN DEFAULT TRUE,
    created_at      TIMESTAMP DEFAULT NOW()
);

-- ─────────────────────────────────────────────────────────────
-- TABLE: fee_payments
-- Student fee payment records
-- ─────────────────────────────────────────────────────────────
CREATE TABLE fee_payments (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institution_id  UUID NOT NULL,
    student_id      UUID REFERENCES users(id),
    fee_structure_id UUID REFERENCES fee_structure(id),
    amount_paid     DECIMAL(10,2) NOT NULL,
    payment_date    DATE NOT NULL,
    payment_method  VARCHAR(50),                 -- cash | online | cheque | dd
    transaction_ref VARCHAR(200),
    receipt_number  VARCHAR(100),
    collected_by    UUID REFERENCES users(id),
    status          VARCHAR(30) DEFAULT 'paid',  -- paid | partial | pending | refunded
    created_at      TIMESTAMP DEFAULT NOW()
);

-- ─────────────────────────────────────────────────────────────
-- ALL INDEXES — Tenant DB
-- ─────────────────────────────────────────────────────────────
CREATE INDEX idx_users_institution ON users(institution_id);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_attendance_student ON attendance(student_id);
CREATE INDEX idx_attendance_date ON attendance(date);
CREATE INDEX idx_attendance_class ON attendance(class_id);
CREATE INDEX idx_assignments_teacher ON assignments(teacher_id);
CREATE INDEX idx_assignments_class ON assignments(class_id);
CREATE INDEX idx_assignments_due ON assignments(due_date);
CREATE INDEX idx_submissions_assignment ON assignment_submissions(assignment_id);
CREATE INDEX idx_submissions_student ON assignment_submissions(student_id);
CREATE INDEX idx_exams_class ON exams(class_id);
CREATE INDEX idx_exams_date ON exams(exam_date);
CREATE INDEX idx_messages_sender ON messages(sender_id);
CREATE INDEX idx_messages_receiver ON messages(receiver_id);
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(is_read);
CREATE INDEX idx_leave_user ON leave_requests(user_id);
CREATE INDEX idx_leave_status ON leave_requests(status);
CREATE INDEX idx_timetable_class ON timetable_slots(class_id);
CREATE INDEX idx_timetable_teacher ON timetable_slots(teacher_id);
CREATE INDEX idx_timetable_day ON timetable_slots(day_of_week);

-- ─────────────────────────────────────────────────────────────
-- TABLE: student_documents
-- Stores student-uploaded documents (admit card, certificates, ID)
-- ─────────────────────────────────────────────────────────────
CREATE TABLE student_documents (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institution_id  UUID NOT NULL,
    student_id      UUID REFERENCES users(id) ON DELETE CASCADE,
    document_type   VARCHAR(50) NOT NULL,        -- admit_card | certificate | id_card | marksheet | other
    title           VARCHAR(200) NOT NULL,
    file_url        TEXT NOT NULL,
    academic_year_id UUID REFERENCES academic_years(id),
    uploaded_by     UUID REFERENCES users(id),   -- admin or student
    is_verified     BOOLEAN DEFAULT FALSE,
    created_at      TIMESTAMP DEFAULT NOW()
);

-- ─────────────────────────────────────────────────────────────
-- TABLE: report_cards
-- Consolidated term-wise report card per student
-- ─────────────────────────────────────────────────────────────
CREATE TABLE report_cards (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institution_id      UUID NOT NULL,
    student_id          UUID REFERENCES users(id) ON DELETE CASCADE,
    class_id            UUID REFERENCES classes(id),
    academic_year_id    UUID REFERENCES academic_years(id),
    term                VARCHAR(50) NOT NULL,        -- mid_term | final | annual
    total_marks         DECIMAL(8,2),
    obtained_marks      DECIMAL(8,2),
    percentage          DECIMAL(5,2),
    grade               VARCHAR(5),
    rank_in_class       INT,
    attendance_percent  DECIMAL(5,2),
    teacher_remarks     TEXT,
    principal_remarks   TEXT,
    is_published        BOOLEAN DEFAULT FALSE,
    published_at        TIMESTAMP,
    created_at          TIMESTAMP DEFAULT NOW(),
    UNIQUE(student_id, academic_year_id, term)
);

-- ─────────────────────────────────────────────────────────────
-- TABLE: report_card_subjects
-- Per-subject marks within a report card
-- ─────────────────────────────────────────────────────────────
CREATE TABLE report_card_subjects (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    report_card_id  UUID REFERENCES report_cards(id) ON DELETE CASCADE,
    subject_id      UUID REFERENCES subjects(id),
    unit_test_1     DECIMAL(6,2),
    unit_test_2     DECIMAL(6,2),
    mid_term        DECIMAL(6,2),
    final_exam      DECIMAL(6,2),
    practical       DECIMAL(6,2),
    total_obtained  DECIMAL(6,2),
    total_max       DECIMAL(6,2),
    grade           VARCHAR(5),
    remarks         TEXT
);

-- ─────────────────────────────────────────────────────────────
-- VIEW: student_subject_attendance
-- Aggregated attendance per student per subject
-- ─────────────────────────────────────────────────────────────
CREATE VIEW student_subject_attendance AS
SELECT
    a.student_id,
    a.subject_id,
    s.name                                          AS subject_name,
    s.code                                          AS subject_code,
    COUNT(*)                                        AS total_classes,
    COUNT(*) FILTER (WHERE a.status = 'present')    AS attended,
    ROUND(
        COUNT(*) FILTER (WHERE a.status = 'present') * 100.0 / NULLIF(COUNT(*), 0),
        2
    )                                               AS attendance_percentage
FROM attendance a
JOIN subjects s ON s.id = a.subject_id
GROUP BY a.student_id, a.subject_id, s.name, s.code;

-- ─────────────────────────────────────────────────────────────
-- Additional indexes for new tables
-- ─────────────────────────────────────────────────────────────
CREATE INDEX idx_student_docs_student   ON student_documents(student_id);
CREATE INDEX idx_report_cards_student   ON report_cards(student_id);
CREATE INDEX idx_report_cards_year_term ON report_cards(academic_year_id, term);

-- ─────────────────────────────────────────────────────────────
-- TABLE: study_materials
-- Teacher-uploaded study content per subject (PDFs, videos, PPTs)
-- ─────────────────────────────────────────────────────────────
CREATE TABLE study_materials (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institution_id  UUID NOT NULL,
    teacher_id      UUID REFERENCES users(id) ON DELETE CASCADE,
    class_id        UUID REFERENCES classes(id),
    subject_id      UUID REFERENCES subjects(id),
    academic_year_id UUID REFERENCES academic_years(id),
    title           VARCHAR(200) NOT NULL,
    description     TEXT,
    type            VARCHAR(30) NOT NULL,        -- pdf | video | doc | ppt | link
    file_url        TEXT NOT NULL,
    file_size       VARCHAR(30),                 -- "2.4 MB"
    chapter         VARCHAR(100),                -- "Unit 1", "Chapter 3"
    is_published    BOOLEAN DEFAULT TRUE,
    view_count      INT DEFAULT 0,
    created_at      TIMESTAMP DEFAULT NOW(),
    updated_at      TIMESTAMP DEFAULT NOW()
);

-- ─────────────────────────────────────────────────────────────
-- TABLE: doubts
-- Student Q&A forum per subject
-- ─────────────────────────────────────────────────────────────
CREATE TABLE doubts (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institution_id  UUID NOT NULL,
    student_id      UUID REFERENCES users(id) ON DELETE CASCADE,
    subject_id      UUID REFERENCES subjects(id),
    class_id        UUID REFERENCES classes(id),
    title           VARCHAR(300) NOT NULL,
    description     TEXT NOT NULL,
    tags            TEXT[],                      -- ['MQTT', 'Unit 3']
    status          VARCHAR(30) DEFAULT 'open',  -- open | answered | closed
    view_count      INT DEFAULT 0,
    created_at      TIMESTAMP DEFAULT NOW(),
    updated_at      TIMESTAMP DEFAULT NOW()
);

CREATE TABLE doubt_replies (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    doubt_id        UUID REFERENCES doubts(id) ON DELETE CASCADE,
    author_id       UUID REFERENCES users(id) ON DELETE CASCADE,
    content         TEXT NOT NULL,
    is_accepted     BOOLEAN DEFAULT FALSE,       -- teacher marks as accepted answer
    upvotes         INT DEFAULT 0,
    created_at      TIMESTAMP DEFAULT NOW()
);

-- ─────────────────────────────────────────────────────────────
-- TABLE: admit_cards
-- Exam hall tickets generated per student per exam
-- ─────────────────────────────────────────────────────────────
CREATE TABLE admit_cards (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institution_id  UUID NOT NULL,
    exam_id         UUID REFERENCES exams(id) ON DELETE CASCADE,
    student_id      UUID REFERENCES users(id) ON DELETE CASCADE,
    roll_number     VARCHAR(50),
    room_number     VARCHAR(50),
    seat_number     VARCHAR(50),
    instructions    TEXT[],
    is_issued       BOOLEAN DEFAULT FALSE,
    issued_on       DATE,
    issued_by       UUID REFERENCES users(id),
    created_at      TIMESTAMP DEFAULT NOW(),
    UNIQUE(exam_id, student_id)
);

-- ─────────────────────────────────────────────────────────────
-- TABLE: certificates
-- Student achievement and completion certificates
-- ─────────────────────────────────────────────────────────────
CREATE TABLE certificates (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institution_id  UUID NOT NULL,
    student_id      UUID REFERENCES users(id) ON DELETE CASCADE,
    title           VARCHAR(200) NOT NULL,
    description     TEXT,
    type            VARCHAR(50) NOT NULL,        -- academic | attendance | participation | achievement | completion
    issued_on       DATE NOT NULL,
    issued_by       UUID REFERENCES users(id),
    academic_year_id UUID REFERENCES academic_years(id),
    grade           VARCHAR(10),
    certificate_url TEXT,                        -- generated PDF URL
    is_published    BOOLEAN DEFAULT TRUE,
    created_at      TIMESTAMP DEFAULT NOW()
);

-- ─────────────────────────────────────────────────────────────
-- TABLE: feedback
-- Student feedback on teachers and classes
-- ─────────────────────────────────────────────────────────────
CREATE TABLE feedback (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institution_id  UUID NOT NULL,
    student_id      UUID REFERENCES users(id) ON DELETE CASCADE,
    target_type     VARCHAR(30) NOT NULL,        -- teacher | class | subject | institution
    target_id       UUID NOT NULL,               -- teacher_id or online_class_id
    rating          SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment         TEXT,
    is_anonymous    BOOLEAN DEFAULT FALSE,
    academic_year_id UUID REFERENCES academic_years(id),
    created_at      TIMESTAMP DEFAULT NOW(),
    UNIQUE(student_id, target_type, target_id)   -- one feedback per target per student
);

-- ─────────────────────────────────────────────────────────────
-- TABLE: parent_profiles
-- Parent/guardian extended profile
-- ─────────────────────────────────────────────────────────────
CREATE TABLE parent_profiles (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    relation        VARCHAR(30) NOT NULL,        -- father | mother | guardian
    occupation      VARCHAR(100),
    annual_income   DECIMAL(12,2),
    education       VARCHAR(100),
    created_at      TIMESTAMP DEFAULT NOW()
);

-- ─────────────────────────────────────────────────────────────
-- TABLE: student_parent_link
-- Links students to their parents (one student → multiple parents)
-- ─────────────────────────────────────────────────────────────
CREATE TABLE student_parent_link (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institution_id  UUID NOT NULL,
    student_id      UUID REFERENCES users(id) ON DELETE CASCADE,
    parent_id       UUID REFERENCES users(id) ON DELETE CASCADE,
    relation        VARCHAR(30) NOT NULL,        -- father | mother | guardian
    is_primary      BOOLEAN DEFAULT FALSE,       -- primary contact
    can_pickup      BOOLEAN DEFAULT TRUE,        -- authorized for school pickup
    created_at      TIMESTAMP DEFAULT NOW(),
    UNIQUE(student_id, parent_id)
);

-- ─────────────────────────────────────────────────────────────
-- TABLE: fee_receipts
-- Printable receipt log for each fee payment
-- ─────────────────────────────────────────────────────────────
CREATE TABLE fee_receipts (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institution_id  UUID NOT NULL,
    fee_payment_id  UUID REFERENCES fee_payments(id) ON DELETE CASCADE,
    student_id      UUID REFERENCES users(id),
    receipt_number  VARCHAR(100) UNIQUE NOT NULL,
    amount          DECIMAL(10,2) NOT NULL,
    payment_date    DATE NOT NULL,
    payment_method  VARCHAR(50),
    fee_description VARCHAR(200),
    generated_by    UUID REFERENCES users(id),
    receipt_url     TEXT,                        -- PDF URL if generated
    created_at      TIMESTAMP DEFAULT NOW()
);

-- ─────────────────────────────────────────────────────────────
-- Additional indexes for new tables
-- ─────────────────────────────────────────────────────────────
CREATE INDEX idx_study_materials_subject  ON study_materials(subject_id);
CREATE INDEX idx_study_materials_class    ON study_materials(class_id);
CREATE INDEX idx_doubts_student           ON doubts(student_id);
CREATE INDEX idx_doubts_subject           ON doubts(subject_id);
CREATE INDEX idx_doubts_status            ON doubts(status);
CREATE INDEX idx_doubt_replies_doubt      ON doubt_replies(doubt_id);
CREATE INDEX idx_admit_cards_exam         ON admit_cards(exam_id);
CREATE INDEX idx_admit_cards_student      ON admit_cards(student_id);
CREATE INDEX idx_certificates_student     ON certificates(student_id);
CREATE INDEX idx_feedback_student         ON feedback(student_id);
CREATE INDEX idx_feedback_target          ON feedback(target_type, target_id);
CREATE INDEX idx_parent_link_student      ON student_parent_link(student_id);
CREATE INDEX idx_parent_link_parent       ON student_parent_link(parent_id);
CREATE INDEX idx_fee_receipts_student     ON fee_receipts(student_id);
CREATE INDEX idx_fee_receipts_payment     ON fee_receipts(fee_payment_id);
