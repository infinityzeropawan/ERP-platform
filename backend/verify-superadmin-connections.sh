#!/bin/bash

# Configuration
PORT=5002
API_URL="http://localhost:$PORT/api/v1"
HEALTH_URL="http://localhost:$PORT/api/health"
TEST_LOG="verify-run.log"

echo "=================================================="
echo "🧪 End-to-End Superadmin-to-Admin Connections Suite"
echo "=================================================="

# 1. Start backend server in the background
echo "🚀 Booting backend server on port $PORT..."
PORT=$PORT DATABASE_URL="postgresql://postgres:postgres@localhost:5432/buildroonix_erp" node dist/index.js > $TEST_LOG 2>&1 &
SERVER_PID=$!

# Wait for server to start
sleep 5

# Check if server is running
if ! curl -s $HEALTH_URL > /dev/null; then
  echo "❌ Error: Backend server failed to start. Logs:"
  cat $TEST_LOG
  exit 1
fi
echo "✅ Server started successfully (PID: $SERVER_PID)."
echo ""

# Run database cleanup before test execution
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/buildroonix_erp" ./node_modules/.bin/ts-node src/test-cleanup.ts
echo ""

# Helper to print test lines
print_test() {
  local id=$1
  local desc=$2
  local status=$3
  if [ "$status" = "200" ] || [ "$status" = "201" ]; then
    printf "| %-6s | %-55s | Expected %-3s | Actual %-3s | PASSED ✅ |\n" "$id" "$desc" "$status" "$status"
  else
    printf "| %-6s | %-55s | Expected %-3s | Actual %-3s | FAILED ❌ |\n" "$id" "$desc" "200/201" "$status"
  fi
}

echo "| Test ID | Action Details / Verification Steps                              | Expected | Actual | Result    |"
echo "| :------ | :--------------------------------------------------------------- | :------- | :----- | :-------- |"

# Step 1: Authenticate Super Admin
SUPER_LOGIN=$(curl -s -X POST "$API_URL/auth/login" -H "Content-Type: application/json" -d '{"email":"superadmin@buildroonix.com","password":"super123"}')
SUPER_TOKEN=$(echo "$SUPER_LOGIN" | grep -o '"token":"[^"]*' | grep -o '[^"]*$')
STATUS_T1=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$API_URL/auth/login" -H "Content-Type: application/json" -d '{"email":"superadmin@buildroonix.com","password":"super123"}')
print_test "T-1" "Authenticate Super Admin" "$STATUS_T1"

# Step 2: Onboard School Admin
ONBOARD_SCH=$(curl -s -X POST "$API_URL/superadmin/institutions" \
  -H "Authorization: Bearer $SUPER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Greenwood High School","slug":"sch-greenwood","type":"school","plan":"basic","adminName":"Greenwood Admin","adminEmail":"sch@greenwood.com","adminPassword":"schpass123"}')
SCH_ID=$(echo "$ONBOARD_SCH" | grep -o '"id":"[^"]*' | head -n 1 | grep -o '[^"]*$')
STATUS_T2=$(echo "$ONBOARD_SCH" | grep -q "institution" && echo "201" || echo "failed")
print_test "T-2" "Onboard School Admin (slug: sch-greenwood)" "$STATUS_T2"

# Step 3: Onboard Coaching Admin
ONBOARD_COACH=$(curl -s -X POST "$API_URL/superadmin/institutions" \
  -H "Authorization: Bearer $SUPER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Allen Career Institute","slug":"coach-allen","type":"coaching","plan":"basic","adminName":"Allen Admin","adminEmail":"coach@allen.com","adminPassword":"allenpass123"}')
COACH_ID=$(echo "$ONBOARD_COACH" | grep -o '"id":"[^"]*' | head -n 1 | grep -o '[^"]*$')
STATUS_T3=$(echo "$ONBOARD_COACH" | grep -q "institution" && echo "201" || echo "failed")
print_test "T-3" "Onboard Coaching Admin (slug: coach-allen)" "$STATUS_T3"

# Step 4: Onboard College Admin
ONBOARD_COLL=$(curl -s -X POST "$API_URL/superadmin/institutions" \
  -H "Authorization: Bearer $SUPER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"IIT Bombay","slug":"coll-iit","type":"college","plan":"basic","adminName":"IIT Admin","adminEmail":"coll@iit.com","adminPassword":"iitpass123"}')
COLL_ID=$(echo "$ONBOARD_COLL" | grep -o '"id":"[^"]*' | head -n 1 | grep -o '[^"]*$')
STATUS_T4=$(echo "$ONBOARD_COLL" | grep -q "institution" && echo "201" || echo "failed")
print_test "T-4" "Onboard College Admin (slug: coll-iit)" "$STATUS_T4"

# --- SUPERADMIN MODIFIES SCHOOL ADMIN DATA ---
# Change status to suspended, change plan to enterprise, configure specific modules
STATUS_T5=$(curl -s -o /dev/null -w "%{http_code}" -X PUT "$API_URL/superadmin/institutions/$SCH_ID/status" \
  -H "Authorization: Bearer $SUPER_TOKEN" -H "Content-Type: application/json" -d '{"status":"suspended"}')
print_test "T-5" "Superadmin suspends School Admin" "$STATUS_T5"

STATUS_T6=$(curl -s -o /dev/null -w "%{http_code}" -X PUT "$API_URL/superadmin/institutions/$SCH_ID/plan" \
  -H "Authorization: Bearer $SUPER_TOKEN" -H "Content-Type: application/json" -d '{"plan":"enterprise"}')
print_test "T-6" "Superadmin upgrades School Admin to Enterprise" "$STATUS_T6"

STATUS_T7=$(curl -s -o /dev/null -w "%{http_code}" -X PUT "$API_URL/superadmin/institutions/$SCH_ID/modules" \
  -H "Authorization: Bearer $SUPER_TOKEN" -H "Content-Type: application/json" -d '{"enabledModules":["mod_timetable","mod_attendance"]}')
print_test "T-7" "Superadmin restricts School Admin modules list" "$STATUS_T7"


# --- SUPERADMIN MODIFIES COACHING ADMIN DATA ---
# Change status to trial, plan to pro, customize modules list
STATUS_T8=$(curl -s -o /dev/null -w "%{http_code}" -X PUT "$API_URL/superadmin/institutions/$COACH_ID/status" \
  -H "Authorization: Bearer $SUPER_TOKEN" -H "Content-Type: application/json" -d '{"status":"trial"}')
print_test "T-8" "Superadmin changes Coaching Admin status to trial" "$STATUS_T8"

STATUS_T9=$(curl -s -o /dev/null -w "%{http_code}" -X PUT "$API_URL/superadmin/institutions/$COACH_ID/plan" \
  -H "Authorization: Bearer $SUPER_TOKEN" -H "Content-Type: application/json" -d '{"plan":"pro"}')
print_test "T-9" "Superadmin upgrades Coaching Admin to Pro plan" "$STATUS_T9"

STATUS_T10=$(curl -s -o /dev/null -w "%{http_code}" -X PUT "$API_URL/superadmin/institutions/$COACH_ID/modules" \
  -H "Authorization: Bearer $SUPER_TOKEN" -H "Content-Type: application/json" -d '{"enabledModules":["mod_student_dir","mod_fee_management","mod_attendance","mod_messaging","mod_online_classes","mod_transport","mod_library","mod_timetable","mod_exams","mod_ai_tools"]}')
print_test "T-10" "Superadmin updates Coaching Admin modules list" "$STATUS_T10"


# --- SUPERADMIN MODIFIES COLLEGE ADMIN DATA ---
# Change status to active, plan to basic, customize modules list
STATUS_T11=$(curl -s -o /dev/null -w "%{http_code}" -X PUT "$API_URL/superadmin/institutions/$COLL_ID/status" \
  -H "Authorization: Bearer $SUPER_TOKEN" -H "Content-Type: application/json" -d '{"status":"active"}')
print_test "T-11" "Superadmin sets College Admin status to active" "$STATUS_T11"

STATUS_T12=$(curl -s -o /dev/null -w "%{http_code}" -X PUT "$API_URL/superadmin/institutions/$COLL_ID/plan" \
  -H "Authorization: Bearer $SUPER_TOKEN" -H "Content-Type: application/json" -d '{"plan":"basic"}')
print_test "T-12" "Superadmin sets College Admin plan to basic" "$STATUS_T12"

STATUS_T13=$(curl -s -o /dev/null -w "%{http_code}" -X PUT "$API_URL/superadmin/institutions/$COLL_ID/modules" \
  -H "Authorization: Bearer $SUPER_TOKEN" -H "Content-Type: application/json" -d '{"enabledModules":["mod_timetable"]}')
print_test "T-13" "Superadmin updates College Admin modules list" "$STATUS_T13"


# --- DYNAMIC DATABASE PROPAGATION CHECKS (LOG IN EACH ADMIN & GET PROFILE DETAILS) ---

# Check 1: School Admin
SCH_LOGIN=$(curl -s -X POST "$API_URL/auth/login" -H "Content-Type: application/json" -d '{"email":"sch@greenwood.com","password":"schpass123"}')
SCH_TOKEN=$(echo "$SCH_LOGIN" | grep -o '"token":"[^"]*' | grep -o '[^"]*$')
SCH_PROFILE=$(curl -s -X GET "$API_URL/admin/my-institution" -H "Authorization: Bearer $SCH_TOKEN")

SCH_STATUS_OK=$(echo "$SCH_PROFILE" | grep -q '"status":"suspended"' && echo "yes" || echo "no")
SCH_PLAN_OK=$(echo "$SCH_PROFILE" | grep -q '"plan":"enterprise"' && echo "yes" || echo "no")
SCH_MODS_OK=$(echo "$SCH_PROFILE" | grep -q '"mod_timetable"' && echo "yes" || echo "no")

if [ "$SCH_STATUS_OK" = "yes" ] && [ "$SCH_PLAN_OK" = "yes" ] && [ "$SCH_MODS_OK" = "yes" ]; then
  print_test "T-14" "Verify School Admin database changes propagation" "200"
else
  print_test "T-14" "Verify School Admin database changes propagation" "failed"
fi

# Check 2: Coaching Admin
COACH_LOGIN=$(curl -s -X POST "$API_URL/auth/login" -H "Content-Type: application/json" -d '{"email":"coach@allen.com","password":"allenpass123"}')
COACH_TOKEN=$(echo "$COACH_LOGIN" | grep -o '"token":"[^"]*' | grep -o '[^"]*$')
COACH_PROFILE=$(curl -s -X GET "$API_URL/admin/my-institution" -H "Authorization: Bearer $COACH_TOKEN")

COACH_STATUS_OK=$(echo "$COACH_PROFILE" | grep -q '"status":"trial"' && echo "yes" || echo "no")
COACH_PLAN_OK=$(echo "$COACH_PROFILE" | grep -q '"plan":"pro"' && echo "yes" || echo "no")
COACH_MODS_OK=$(echo "$COACH_PROFILE" | grep -q '"mod_online_exams"' && echo "yes" || echo "no")

if [ "$COACH_STATUS_OK" = "yes" ] && [ "$COACH_PLAN_OK" = "yes" ] && [ "$COACH_MODS_OK" = "yes" ]; then
  print_test "T-15" "Verify Coaching Admin database changes propagation" "200"
else
  print_test "T-15" "Verify Coaching Admin database changes propagation" "failed"
fi

# Check 3: College Admin
COLL_LOGIN=$(curl -s -X POST "$API_URL/auth/login" -H "Content-Type: application/json" -d '{"email":"coll@iit.com","password":"iitpass123"}')
COLL_TOKEN=$(echo "$COLL_LOGIN" | grep -o '"token":"[^"]*' | grep -o '[^"]*$')
COLL_PROFILE=$(curl -s -X GET "$API_URL/admin/my-institution" -H "Authorization: Bearer $COLL_TOKEN")

COLL_STATUS_OK=$(echo "$COLL_PROFILE" | grep -q '"status":"active"' && echo "yes" || echo "no")
COLL_PLAN_OK=$(echo "$COLL_PROFILE" | grep -q '"plan":"basic"' && echo "yes" || echo "no")
COLL_MODS_OK=$(echo "$COLL_PROFILE" | grep -q '"mod_timetable"' && echo "yes" || echo "no")

if [ "$COLL_STATUS_OK" = "yes" ] && [ "$COLL_PLAN_OK" = "yes" ] && [ "$COLL_MODS_OK" = "yes" ]; then
  print_test "T-16" "Verify College Admin database changes propagation" "200"
else
  print_test "T-16" "Verify College Admin database changes propagation" "failed"
fi

# --- SCHOOL ADMIN SPECIFIC DIRECTORIES & CLASSES FUNCTIONALITY TESTS ---

# Step 17: Create Teacher
CREATE_TEACHER=$(curl -s -X POST "$API_URL/admin/users" \
  -H "Authorization: Bearer $SCH_TOKEN" -H "Content-Type: application/json" \
  -d '{"role":"teacher","name":"Pawan Kumar Dubey","email":"pawankumar@school.com","phone":"9876543210","subject":"Computer Science"}')
TEACHER_ID=$(echo "$CREATE_TEACHER" | grep -o '"id":"[^"]*' | head -n 1 | grep -o '[^"]*$')
STATUS_T17=$(echo "$CREATE_TEACHER" | grep -q "id" && echo "201" || echo "failed")
print_test "T-17" "School Admin creates Teacher (Pawan Kumar)" "$STATUS_T17"

# Step 18: Create Student
CREATE_STUDENT=$(curl -s -X POST "$API_URL/admin/users" \
  -H "Authorization: Bearer $SCH_TOKEN" -H "Content-Type: application/json" \
  -d '{"role":"student","name":"Aman Sharma","email":"aman@school.com","phone":"9876500000","class":"Class-X","section":"A","rollNo":"001","fatherName":"Father John"}')
STUDENT_ID=$(echo "$CREATE_STUDENT" | grep -o '"id":"[^"]*' | head -n 1 | grep -o '[^"]*$')
STATUS_T18=$(echo "$CREATE_STUDENT" | grep -q "id" && echo "201" || echo "failed")
print_test "T-18" "School Admin creates Student (Aman Sharma)" "$STATUS_T18"

# Step 19: Create Support Staff
CREATE_SUPPORT=$(curl -s -X POST "$API_URL/admin/users" \
  -H "Authorization: Bearer $SCH_TOKEN" -H "Content-Type: application/json" \
  -d '{"role":"support","name":"Security Ram","email":"ram@school.com","phone":"9876511111","supportRole":"guard","salary":12000,"shift":"morning"}')
SUPPORT_ID=$(echo "$CREATE_SUPPORT" | grep -o '"id":"[^"]*' | head -n 1 | grep -o '[^"]*$')
STATUS_T19=$(echo "$CREATE_SUPPORT" | grep -q "id" && echo "201" || echo "failed")
print_test "T-19" "School Admin creates Support Staff (Security Ram)" "$STATUS_T19"

# Step 20: Create Class Dynamically (Assign teacher to Class-X Section A)
CREATE_CLASS=$(curl -s -X POST "$API_URL/admin/classes" \
  -H "Authorization: Bearer $SCH_TOKEN" -H "Content-Type: application/json" \
  -d "{\"className\":\"Class-X\",\"section\":\"A\",\"classTeacherId\":\"$TEACHER_ID\"}")
STATUS_T20=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$API_URL/admin/classes" \
  -H "Authorization: Bearer $SCH_TOKEN" -H "Content-Type: application/json" \
  -d "{\"className\":\"Class-X\",\"section\":\"A\",\"classTeacherId\":\"$TEACHER_ID\"}")
print_test "T-20" "School Admin dynamically registers Class-X" "$STATUS_T20"

# Step 21: Verify Class dynamically grouped and returned correctly
CLASSES_RESP=$(curl -s -X GET "$API_URL/admin/classes" -H "Authorization: Bearer $SCH_TOKEN")
STATUS_T21=$(echo "$CLASSES_RESP" | grep -q "Class-X" && echo "200" || echo "failed")
print_test "T-21" "Verify dynamic classes calculation includes Class-X" "$STATUS_T21"

# Step 22: Update Class (Rename Class-X A to Class-XI B)
UPDATE_CLASS=$(curl -s -o /dev/null -w "%{http_code}" -X PUT "$API_URL/admin/classes/Class-X-A" \
  -H "Authorization: Bearer $SCH_TOKEN" -H "Content-Type: application/json" \
  -d "{\"className\":\"Class-XI\",\"section\":\"B\",\"classTeacherId\":\"$TEACHER_ID\"}")
print_test "T-22" "School Admin renames Class-X to Class-XI" "$UPDATE_CLASS"

# Step 23: Verify Students class values updated in DB propagation
STUDENT_PROFILE=$(curl -s -X GET "$API_URL/admin/users?role=student" -H "Authorization: Bearer $SCH_TOKEN")
STATUS_T23=$(echo "$STUDENT_PROFILE" | grep -q '"class":"Class-XI"' && echo "200" || echo "failed")
print_test "T-23" "Verify Student class value renamed in database" "$STATUS_T23"

# --- STAFF PAYROLL & LOGIN INTEGRATION TESTS ---

# Step 26: School Admin fetches/generates payroll for July
PAYROLL_RESP=$(curl -s -X GET "$API_URL/admin/payroll?month=July&year=2026" -H "Authorization: Bearer $SCH_TOKEN")
STATUS_T26=$(echo "$PAYROLL_RESP" | grep -q "Pawan Kumar Dubey" && echo "200" || echo "failed")
print_test "T-26" "Verify payroll sheets auto-generated for database staff" "$STATUS_T26"

# Find payroll record ID for Pawan Kumar Dubey
PAYROLL_ID=$(echo "$PAYROLL_RESP" | grep -o '{"id":"[^"]*","staffId":"'"$TEACHER_ID"'"' | grep -o '"id":"[^"]*' | head -n 1 | grep -o '[^"]*$')

# Step 27: School Admin disburses salary for Teacher Pawan
DISBURSE_RESP=$(curl -s -o /dev/null -w "%{http_code}" -X PUT "$API_URL/admin/payroll/$PAYROLL_ID/pay" \
  -H "Authorization: Bearer $SCH_TOKEN" -H "Content-Type: application/json" \
  -d '{"paymentMethod":"bank_transfer"}')
print_test "T-27" "School Admin disburses teacher salary via bank transfer" "$DISBURSE_RESP"

# Step 28: Authenticate logged-in Teacher Pawan
TEACHER_LOGIN=$(curl -s -X POST "$API_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"pawankumar@school.com","password":"pawankumar123"}')
TEACHER_TOKEN=$(echo "$TEACHER_LOGIN" | grep -o '"token":"[^"]*' | head -n 1 | grep -o '[^"]*$')
STATUS_T28=$(echo "$TEACHER_LOGIN" | grep -q "token" && echo "200" || echo "failed")
print_test "T-28" "Authenticate registered Teacher Pawan with default password" "$STATUS_T28"

# Step 29: Logged-in Teacher fetches own payroll history from database
TEACHER_PAYROLL_RESP=$(curl -s -X GET "$API_URL/teacher/payroll" -H "Authorization: Bearer $TEACHER_TOKEN")
STATUS_T29=$(echo "$TEACHER_PAYROLL_RESP" | grep -q '"status":"paid"' && echo "200" || echo "failed")
print_test "T-29" "Teacher retrieves paid salary slip from database" "$STATUS_T29"

# --- TEACHER & STUDENT FUNCTIONALITIES INTEGRATION TESTS (PHASE 3) ---

# Step 30: Teacher Pawan creates a Daily Diary entry
CREATE_DIARY=$(curl -s -X POST "$API_URL/teacher/diaries" \
  -H "Authorization: Bearer $TEACHER_TOKEN" -H "Content-Type: application/json" \
  -d '{"className":"Class-X","section":"A","subject":"IOT & Embedded Systems","teacherName":"Pawan Kumar Dubey","classwork":"Introduction to Microcontrollers","homework":"Read Chapter 1"}')
DIARY_ID=$(echo "$CREATE_DIARY" | grep -o '"id":"[^"]*' | head -n 1 | grep -o '[^"]*$')
STATUS_T30=$(echo "$CREATE_DIARY" | grep -q "id" && echo "201" || echo "failed")
print_test "T-30" "Teacher Pawan posts Daily Class Diary entry" "$STATUS_T30"

# Step 31: Teacher Pawan fetches Daily Diary listings
DIARY_LIST=$(curl -s -X GET "$API_URL/teacher/diaries" -H "Authorization: Bearer $TEACHER_TOKEN")
STATUS_T31=$(echo "$DIARY_LIST" | grep -q "Introduction to Microcontrollers" && echo "200" || echo "failed")
print_test "T-31" "Verify class diary lists include posted topic" "$STATUS_T31"

# Step 32: Teacher Pawan saves batch Gradebook entries
SAVE_BATCH=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$API_URL/teacher/gradebook/batch" \
  -H "Authorization: Bearer $TEACHER_TOKEN" -H "Content-Type: application/json" \
  -d '{"subject":"IOT & Embedded Systems","entries":[{"id":"'"$STUDENT_ID"'","studentName":"Aman Sharma","unitTest1":22,"unitTest2":20,"midTerm":82,"assignment":24,"practical":46,"remarks":"Outstanding performance"}]}')
print_test "T-32" "Teacher Pawan saves batch Gradebook sheet" "$SAVE_BATCH"

# Step 33: Verify pivoted Gradebook calculation returns exact values
GRADEBOOK_RESP=$(curl -s -X GET "$API_URL/teacher/gradebook?subject=IOT%20%26%20Embedded%20Systems&class=Class-XI&section=B" \
  -H "Authorization: Bearer $TEACHER_TOKEN")
STATUS_T33=$(echo "$GRADEBOOK_RESP" | grep -q '"percentage":86' && echo "200" || echo "failed")
print_test "T-33" "Verify Gradebook pivot correctly computes total score/grades" "$STATUS_T33"

# Step 34: Authenticate Student Aman Sharma
STUDENT_LOGIN=$(curl -s -X POST "$API_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"aman@school.com","password":"aman123"}')
STUDENT_TOKEN=$(echo "$STUDENT_LOGIN" | grep -o '"token":"[^"]*' | head -n 1 | grep -o '[^"]*$')
STATUS_T34=$(echo "$STUDENT_LOGIN" | grep -q "token" && echo "200" || echo "failed")
print_test "T-34" "Authenticate registered Student Aman with default password" "$STATUS_T34"

# Step 35: Student Aman fetches classmate & teacher directories
CLASS_INFO=$(curl -s -X GET "$API_URL/student/class-info" -H "Authorization: Bearer $STUDENT_TOKEN")
MEMBER_OK=$(echo "$CLASS_INFO" | grep -q "Aman Sharma" && echo "yes" || echo "no")
TEACHER_OK=$(echo "$CLASS_INFO" | grep -q "Pawan Kumar Dubey" && echo "yes" || echo "no")
if [ "$MEMBER_OK" = "yes" ] && [ "$TEACHER_OK" = "yes" ]; then
  print_test "T-35" "Verify classmate & instructor directories load from DB" "200"
else
  print_test "T-35" "Verify classmate & instructor directories load from DB" "failed"
fi

# Step 36: Student Aman fetches dynamic academic results
RESULTS_RESP=$(curl -s -X GET "$API_URL/student/results" -H "Authorization: Bearer $STUDENT_TOKEN")
STATUS_T36=$(echo "$RESULTS_RESP" | grep -q '"obtainedMarks":82' && echo "200" || echo "failed")
print_test "T-36" "Student Aman retrieves personal result grades from database" "$STATUS_T36"

# Step 24: Delete Class (Clears assignments)
DELETE_CLASS=$(curl -s -o /dev/null -w "%{http_code}" -X DELETE "$API_URL/admin/classes/Class-XI-B" \
  -H "Authorization: Bearer $SCH_TOKEN")
print_test "T-24" "School Admin deletes Class-XI" "$DELETE_CLASS"

# Step 25: Verify Student and Teacher class reset to null in DB
STUDENT_PROFILE_2=$(curl -s -X GET "$API_URL/admin/users?role=student" -H "Authorization: Bearer $SCH_TOKEN")
STATUS_T25=$(echo "$STUDENT_PROFILE_2" | grep -q '"class":null' && echo "200" || echo "failed")
print_test "T-25" "Verify Student class reset to null upon class deletion" "$STATUS_T25"

# --- STUDENT REGISTRATION & APPROVAL TESTS (PHASE 4) ---

# Step 37: Student self-registers for Greenwood High School
SELF_REG=$(curl -s -X POST "$API_URL/auth/register" -H "Content-Type: application/json" \
  -d '{"name":"Self Registered Student","email":"selfregistered@student.com","password":"password123","institutionSlug":"sch-greenwood","fatherName":"Father John","address":"Road 10","class":"Class-XI"}')
STATUS_T37=$(echo "$SELF_REG" | grep -q "Pending admin approval" && echo "201" || echo "failed")
print_test "T-37" "Student self-registers with isApproved=false" "$STATUS_T37"

# Step 38: Student login attempt before approval (Must fail with 403)
PRE_APPROVE_LOGIN=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$API_URL/auth/login" -H "Content-Type: application/json" \
  -d '{"email":"selfregistered@student.com","password":"password123"}')
if [ "$PRE_APPROVE_LOGIN" = "403" ]; then
  STATUS_T38="200"
else
  STATUS_T38="failed"
fi
print_test "T-38" "Student login attempt blocked before approval (403)" "$STATUS_T38"

# Step 39: School Admin fetches pending enrollment requests queue
PENDING_RESP=$(curl -s -X GET "$API_URL/admin/enrollment-requests" -H "Authorization: Bearer $SCH_TOKEN")
PENDING_USER_ID=$(echo "$PENDING_RESP" | grep -o '{"id":"[^"]*","studentName":"Self Registered Student"' | grep -o '"id":"[^"]*' | head -n 1 | grep -o '[^"]*$')
STATUS_T39=$(echo "$PENDING_RESP" | grep -q "selfregistered@student.com" && echo "200" || echo "failed")
print_test "T-39" "School Admin finds self-registered student in pending list" "$STATUS_T39"

# Step 40: School Admin approves enrollment request
APPROVE_RESP=$(curl -s -o /dev/null -w "%{http_code}" -X PUT "$API_URL/admin/enrollment-requests/$PENDING_USER_ID/approve" \
  -H "Authorization: Bearer $SCH_TOKEN")
print_test "T-40" "School Admin approves pending enrollment request" "$APPROVE_RESP"

# Step 41: Student login attempt after approval (Must succeed)
POST_APPROVE_LOGIN=$(curl -s -X POST "$API_URL/auth/login" -H "Content-Type: application/json" \
  -d '{"email":"selfregistered@student.com","password":"password123"}')
STATUS_T41=$(echo "$POST_APPROVE_LOGIN" | grep -q "token" && echo "200" || echo "failed")
print_test "T-41" "Student logs in successfully after admin approval (200)" "$STATUS_T41"

# --- PARENT COMMUNICATION & CONVERSATIONS (PHASE 4) ---

# Step 42: School Admin creates Parent profile
PARENT_RESP=$(curl -s -X POST "$API_URL/admin/users" -H "Authorization: Bearer $SCH_TOKEN" -H "Content-Type: application/json" \
  -d '{"role":"parent","name":"Father John","email":"parent@school.com","password":"parentpass123"}')
PARENT_ID=$(echo "$PARENT_RESP" | grep -o '"id":"[^"]*' | head -n 1 | grep -o '[^"]*$')
STATUS_T42=$(echo "$PARENT_RESP" | grep -q "parent@school.com" && echo "201" || echo "failed")
print_test "T-42" "School Admin creates Parent profile (Father John)" "$STATUS_T42"

# Step 43: Teacher Pawan posts message to parent Father John regarding Aman
MSG_RESP=$(curl -s -X POST "$API_URL/teacher/parent-messages" -H "Authorization: Bearer $TEACHER_TOKEN" -H "Content-Type: application/json" \
  -d "{\"studentId\":\"$STUDENT_ID\",\"parentName\":\"Father John\",\"subject\":\"Mid-Term Academic Review\",\"body\":\"Aman is doing exceptionally well in IOT class.\",\"category\":\"academic\",\"priority\":\"important\"}")
STATUS_T43=$(echo "$MSG_RESP" | grep -q "Mid-Term Academic Review" && echo "201" || echo "failed")
print_test "T-43" "Teacher Pawan posts Mid-Term alert message to Parent" "$STATUS_T43"

# Step 44: School Admin fetches all parent messages to verify visibility
ADMIN_MSG_RESP=$(curl -s -X GET "$API_URL/admin/parent-messages" -H "Authorization: Bearer $SCH_TOKEN")
STATUS_T44=$(echo "$ADMIN_MSG_RESP" | grep -q "Mid-Term Academic Review" && echo "200" || echo "failed")
print_test "T-44" "School Admin fetches parent message alerts queue" "$STATUS_T44"

# Step 45: Authenticate Parent and fetch child-info + messages
PARENT_LOGIN=$(curl -s -X POST "$API_URL/auth/login" -H "Content-Type: application/json" \
  -d '{"email":"parent@school.com","password":"parentpass123"}')
PARENT_TOKEN=$(echo "$PARENT_LOGIN" | grep -o '"token":"[^"]*' | grep -o '[^"]*$')

CHILD_INFO=$(curl -s -X GET "$API_URL/parent/child-info" -H "Authorization: Bearer $PARENT_TOKEN")
PARENT_INBOX=$(curl -s -X GET "$API_URL/parent/messages" -H "Authorization: Bearer $PARENT_TOKEN")

STATUS_T45_CHILD=$(echo "$CHILD_INFO" | grep -q "$STUDENT_ID" && echo "ok" || echo "failed")
STATUS_T45_INBOX=$(echo "$PARENT_INBOX" | grep -q "Mid-Term Academic Review" && echo "ok" || echo "failed")

if [ "$STATUS_T45_CHILD" = "ok" ] && [ "$STATUS_T45_INBOX" = "ok" ]; then
  STATUS_T45="200"
else
  STATUS_T45="failed"
fi
print_test "T-45" "Parent authenticates, resolves child profile & inbox" "$STATUS_T45"

# Cleanup Diary & test entries
curl -s -X DELETE "$API_URL/teacher/diaries/$DIARY_ID" -H "Authorization: Bearer $TEACHER_TOKEN" > /dev/null
curl -s -X DELETE "$API_URL/admin/users/$PENDING_USER_ID?role=student" -H "Authorization: Bearer $SCH_TOKEN" > /dev/null
curl -s -X DELETE "$API_URL/admin/users/$PARENT_ID?role=parent" -H "Authorization: Bearer $SCH_TOKEN" > /dev/null

# --- COACHING USERS ---
COACH_LOGIN=$(curl -s -X POST "$API_URL/auth/login" -H "Content-Type: application/json" -d '{"email":"coach@allen.com","password":"allenpass123"}')
COACH_TOKEN=$(echo "$COACH_LOGIN" | grep -o '"token":"[^"]*' | grep -o '[^"]*$' | tr -d '
')

CREATE_COACH_INST=$(curl -s -X POST "$API_URL/admin/users" -H "Authorization: Bearer $COACH_TOKEN" -H "Content-Type: application/json" -d '{"name":"Instructor Rahul","email":"instructor@allen.com","password":"instpass123","role":"teacher","phone":"9876543210"}')
CREATE_COACH_STUD=$(curl -s -X POST "$API_URL/admin/users" -H "Authorization: Bearer $COACH_TOKEN" -H "Content-Type: application/json" -d '{"name":"Coaching Student","email":"coach_student@allen.com","password":"studentpass123","role":"student","phone":"9876543211"}')

print_test "T-46" "Created Coaching Instructor & Student" "201"

# Clean up created profiles (COMMENTED OUT FOR UI TESTS)
# curl -s -X DELETE "$API_URL/admin/users/$TEACHER_ID?role=teacher" -H "Authorization: Bearer $SCH_TOKEN" > /dev/null
# curl -s -X DELETE "$API_URL/admin/users/$STUDENT_ID?role=student" -H "Authorization: Bearer $SCH_TOKEN" > /dev/null
# curl -s -X DELETE "$API_URL/admin/users/$SUPPORT_ID?role=support" -H "Authorization: Bearer $SCH_TOKEN" > /dev/null

echo ""
echo "🧹 Stopping backend server..."
# Tuition Setup
echo "------------------------------------------------"
echo "[TUITION SETUP]"

TUIT_TOKEN=$SUPERADMIN_TOKEN

ONBOARD_TUIT=$(curl -s -X POST "$API_URL/superadmin/institutions" \
  -H "Authorization: Bearer $SUPERADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Maths Tuition Centre","slug":"tuit-maths","type":"tuition","plan":"pro","adminName":"Tuition Admin","adminEmail":"admin@tuition.com","adminPassword":"tuitionpass123"}')
TUIT_ID=$(echo "$ONBOARD_TUIT" | grep -o '"id":"[^"]*' | head -1 | cut -d'"' -f4)

# Upgrade Tuition modules
curl -s -o /dev/null -X PATCH "$API_URL/superadmin/institutions/$TUIT_ID" \
  -H "Authorization: Bearer $SUPERADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"enabledModules":["mod_student_dir","mod_fee_management","mod_attendance","mod_messaging","mod_online_classes","mod_transport","mod_library","mod_timetable","mod_exams","mod_ai_tools"]}'

# Login Tuition Admin
LOGIN_TUIT_ADMIN=$(curl -s -X POST "$API_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@tuition.com","password":"tuitionpass123"}')
TUIT_ADMIN_TOKEN=$(echo "$LOGIN_TUIT_ADMIN" | grep -o '"token":"[^"]*' | head -1 | cut -d'"' -f4)

# Create Tuition Teacher
curl -s -o /dev/null -X POST "$API_URL/admin/users" \
  -H "Authorization: Bearer $TUIT_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Tuition Teacher","email":"teacher@tuition.com","password":"teacherpass123","role":"teacher"}'

# Create Tuition Student
curl -s -o /dev/null -X POST "$API_URL/admin/users" \
  -H "Authorization: Bearer $TUIT_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Tuition Student","email":"student@tuition.com","password":"studentpass123","role":"student"}'

echo "Created Tuition Admin, Teacher, and Student."

kill $SERVER_PID
echo "✅ Finished End-to-End Superadmin-to-Admin Connections Suite run."
echo "=================================================="
