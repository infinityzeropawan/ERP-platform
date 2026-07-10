-- AlterTable
ALTER TABLE "User" ADD COLUMN "parentId" TEXT;
ALTER TABLE "User"
  ALTER COLUMN "joiningDate" TYPE TIMESTAMP(3) USING NULLIF("joiningDate", '')::timestamp,
  ALTER COLUMN "dob" TYPE TIMESTAMP(3) USING NULLIF("dob", '')::timestamp,
  ALTER COLUMN "admissionDate" TYPE TIMESTAMP(3) USING NULLIF("admissionDate", '')::timestamp;

-- AlterTable
ALTER TABLE "GradebookEntry"
  ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ALTER COLUMN "date" TYPE TIMESTAMP(3) USING "date"::timestamp;

-- AlterTable
ALTER TABLE "DailyDiary"
  ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ALTER COLUMN "date" TYPE TIMESTAMP(3) USING "date"::timestamp;

-- AlterTable
ALTER TABLE "ParentMessage" ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "SupportStaff"
  ALTER COLUMN "joiningDate" TYPE TIMESTAMP(3) USING "joiningDate"::timestamp;

-- AlterTable
ALTER TABLE "StaffPayroll"
  ALTER COLUMN "paidOn" TYPE TIMESTAMP(3) USING NULLIF("paidOn", '')::timestamp;

-- CreateTable
CREATE TABLE "RefreshToken" (
    "id" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "revokedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RefreshToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Attendance" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL,
    "subject" TEXT,
    "className" TEXT,
    "section" TEXT,
    "notes" TEXT,
    "institutionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Attendance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FeeRecord" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "paidDate" TIMESTAMP(3),
    "status" TEXT NOT NULL,
    "receiptNo" TEXT,
    "paymentMode" TEXT,
    "institutionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FeeRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TimetablePeriod" (
    "id" TEXT NOT NULL,
    "dayOfWeek" INTEGER NOT NULL,
    "periodNo" INTEGER NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "subjectCode" TEXT,
    "className" TEXT NOT NULL,
    "section" TEXT,
    "room" TEXT,
    "teacherId" TEXT,
    "teacherName" TEXT,
    "institutionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TimetablePeriod_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notice" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "publishedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "authorId" TEXT NOT NULL,
    "authorName" TEXT NOT NULL,
    "priority" TEXT NOT NULL DEFAULT 'medium',
    "category" TEXT NOT NULL DEFAULT 'General',
    "audience" TEXT NOT NULL DEFAULT 'all',
    "institutionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Notice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Exam" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "startsAt" TIMESTAMP(3) NOT NULL,
    "durationMins" INTEGER NOT NULL,
    "maxMarks" DOUBLE PRECISION NOT NULL,
    "room" TEXT,
    "syllabus" TEXT,
    "className" TEXT NOT NULL,
    "section" TEXT,
    "status" TEXT NOT NULL DEFAULT 'scheduled',
    "institutionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Exam_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LeaveRequest" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "fromDate" TIMESTAMP(3) NOT NULL,
    "toDate" TIMESTAMP(3) NOT NULL,
    "reason" TEXT NOT NULL,
    "leaveType" TEXT NOT NULL DEFAULT 'personal',
    "status" TEXT NOT NULL DEFAULT 'pending',
    "reviewedBy" TEXT,
    "reviewRemarks" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "institutionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LeaveRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OnlineClass" (
    "id" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "teacherId" TEXT NOT NULL,
    "teacherName" TEXT NOT NULL,
    "startsAt" TIMESTAMP(3) NOT NULL,
    "durationMins" INTEGER NOT NULL,
    "meetingUrl" TEXT NOT NULL,
    "recordingUrl" TEXT,
    "status" TEXT NOT NULL DEFAULT 'upcoming',
    "className" TEXT NOT NULL,
    "section" TEXT,
    "institutionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OnlineClass_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Assignment" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "className" TEXT NOT NULL,
    "section" TEXT,
    "dueAt" TIMESTAMP(3) NOT NULL,
    "maxMarks" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "teacherId" TEXT NOT NULL,
    "institutionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Assignment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AssignmentSubmission" (
    "id" TEXT NOT NULL,
    "assignmentId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "contentUrl" TEXT,
    "notes" TEXT,
    "marks" DOUBLE PRECISION,
    "feedback" TEXT,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "gradedAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AssignmentSubmission_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RefreshToken_tokenHash_key" ON "RefreshToken"("tokenHash");

-- CreateIndex
CREATE INDEX "RefreshToken_userId_idx" ON "RefreshToken"("userId");

-- CreateIndex
CREATE INDEX "RefreshToken_expiresAt_idx" ON "RefreshToken"("expiresAt");

-- CreateIndex
CREATE INDEX "Attendance_institutionId_date_idx" ON "Attendance"("institutionId", "date");

-- CreateIndex
CREATE INDEX "Attendance_institutionId_userId_date_idx" ON "Attendance"("institutionId", "userId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "Attendance_institutionId_userId_date_subject_key" ON "Attendance"("institutionId", "userId", "date", "subject");

-- CreateIndex
CREATE INDEX "FeeRecord_institutionId_studentId_idx" ON "FeeRecord"("institutionId", "studentId");

-- CreateIndex
CREATE INDEX "FeeRecord_institutionId_status_dueDate_idx" ON "FeeRecord"("institutionId", "status", "dueDate");

-- CreateIndex
CREATE INDEX "TimetablePeriod_institutionId_teacherId_idx" ON "TimetablePeriod"("institutionId", "teacherId");

-- CreateIndex
CREATE UNIQUE INDEX "TimetablePeriod_institutionId_className_section_dayOfWeek_p_key" ON "TimetablePeriod"("institutionId", "className", "section", "dayOfWeek", "periodNo");

-- CreateIndex
CREATE INDEX "Notice_institutionId_publishedAt_idx" ON "Notice"("institutionId", "publishedAt");

-- CreateIndex
CREATE INDEX "Exam_institutionId_className_section_startsAt_idx" ON "Exam"("institutionId", "className", "section", "startsAt");

-- CreateIndex
CREATE INDEX "LeaveRequest_institutionId_userId_idx" ON "LeaveRequest"("institutionId", "userId");

-- CreateIndex
CREATE INDEX "LeaveRequest_institutionId_status_idx" ON "LeaveRequest"("institutionId", "status");

-- CreateIndex
CREATE INDEX "OnlineClass_institutionId_className_section_startsAt_idx" ON "OnlineClass"("institutionId", "className", "section", "startsAt");

-- CreateIndex
CREATE INDEX "OnlineClass_institutionId_teacherId_idx" ON "OnlineClass"("institutionId", "teacherId");

-- CreateIndex
CREATE INDEX "Assignment_institutionId_className_section_dueAt_idx" ON "Assignment"("institutionId", "className", "section", "dueAt");

-- CreateIndex
CREATE INDEX "Assignment_institutionId_teacherId_idx" ON "Assignment"("institutionId", "teacherId");

-- CreateIndex
CREATE INDEX "AssignmentSubmission_studentId_idx" ON "AssignmentSubmission"("studentId");

-- CreateIndex
CREATE UNIQUE INDEX "AssignmentSubmission_assignmentId_studentId_key" ON "AssignmentSubmission"("assignmentId", "studentId");

-- CreateIndex
CREATE INDEX "User_institutionId_idx" ON "User"("institutionId");

-- CreateIndex
CREATE INDEX "User_institutionId_role_idx" ON "User"("institutionId", "role");

-- CreateIndex
CREATE INDEX "User_institutionId_class_section_idx" ON "User"("institutionId", "class", "section");

-- CreateIndex
CREATE INDEX "GradebookEntry_studentId_idx" ON "GradebookEntry"("studentId");

-- CreateIndex
CREATE INDEX "GradebookEntry_institutionId_idx" ON "GradebookEntry"("institutionId");

-- CreateIndex
CREATE INDEX "GradebookEntry_institutionId_studentId_date_idx" ON "GradebookEntry"("institutionId", "studentId", "date");

-- CreateIndex
CREATE INDEX "DailyDiary_institutionId_idx" ON "DailyDiary"("institutionId");

-- CreateIndex
CREATE INDEX "DailyDiary_institutionId_className_section_date_idx" ON "DailyDiary"("institutionId", "className", "section", "date");

-- CreateIndex
CREATE INDEX "ParentMessage_studentId_idx" ON "ParentMessage"("studentId");

-- CreateIndex
CREATE INDEX "ParentMessage_institutionId_idx" ON "ParentMessage"("institutionId");

-- CreateIndex
CREATE INDEX "SupportStaff_institutionId_idx" ON "SupportStaff"("institutionId");

-- CreateIndex
CREATE INDEX "StaffPayroll_institutionId_idx" ON "StaffPayroll"("institutionId");

-- CreateIndex
CREATE INDEX "StaffPayroll_institutionId_year_month_idx" ON "StaffPayroll"("institutionId", "year", "month");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RefreshToken" ADD CONSTRAINT "RefreshToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_institutionId_fkey" FOREIGN KEY ("institutionId") REFERENCES "Institution"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FeeRecord" ADD CONSTRAINT "FeeRecord_institutionId_fkey" FOREIGN KEY ("institutionId") REFERENCES "Institution"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TimetablePeriod" ADD CONSTRAINT "TimetablePeriod_institutionId_fkey" FOREIGN KEY ("institutionId") REFERENCES "Institution"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notice" ADD CONSTRAINT "Notice_institutionId_fkey" FOREIGN KEY ("institutionId") REFERENCES "Institution"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Exam" ADD CONSTRAINT "Exam_institutionId_fkey" FOREIGN KEY ("institutionId") REFERENCES "Institution"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeaveRequest" ADD CONSTRAINT "LeaveRequest_institutionId_fkey" FOREIGN KEY ("institutionId") REFERENCES "Institution"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OnlineClass" ADD CONSTRAINT "OnlineClass_institutionId_fkey" FOREIGN KEY ("institutionId") REFERENCES "Institution"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Assignment" ADD CONSTRAINT "Assignment_institutionId_fkey" FOREIGN KEY ("institutionId") REFERENCES "Institution"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssignmentSubmission" ADD CONSTRAINT "AssignmentSubmission_assignmentId_fkey" FOREIGN KEY ("assignmentId") REFERENCES "Assignment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
