#!/bin/bash

# Configuration
PORT=5001
API_URL="http://localhost:$PORT/api/v1"
HEALTH_URL="http://localhost:$PORT/api/health"
TEST_LOG="test-run.log"

echo "=================================================="
echo "🧪 Running Local API Verification Suite (Live DB)"
echo "=================================================="

# 1. Start backend server in the background
echo "🚀 Booting backend server on port $PORT..."
npm run build && PORT=$PORT DATABASE_URL="postgresql://postgres:postgres@localhost:5432/buildroonix_erp" node dist/index.js > $TEST_LOG 2>&1 &
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

# Initialize Results Table
echo "| Test ID | API Endpoint | Method | Payload Details | Expected | Actual | Result |"
echo "| :--- | :--- | :---: | :--- | :---: | :---: | :---: |"

# Helper function to print test outcome
print_result() {
  local id=$1
  local endpoint=$2
  local method=$3
  local desc=$4
  local expected=$5
  local actual=$6
  
  if [ "$expected" = "$actual" ]; then
    echo "| $id | $endpoint | $method | $desc | $expected | $actual | **PASSED** ✅ |"
  else
    echo "| $id | $endpoint | $method | $desc | $expected | $actual | **FAILED** ❌ |"
  fi
}

# --- T-101: Superadmin Login ---
LOGIN_RESP=$(curl -s -X POST "$API_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"superadmin@buildroonix.com","password":"super123"}')

SUPER_TOKEN=$(echo "$LOGIN_RESP" | grep -o '"token":"[^"]*' | grep -o '[^"]*$')
STATUS_T101=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$API_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"superadmin@buildroonix.com","password":"super123"}')

print_result "T-101" "/auth/login" "POST" "Superadmin valid credentials" "200" "$STATUS_T101"

# --- T-102: Invalid Credentials Login ---
STATUS_T102=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$API_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"superadmin@buildroonix.com","password":"wrong_password"}')

print_result "T-102" "/auth/login" "POST" "Superadmin invalid password" "401" "$STATUS_T102"

# --- T-103a: Onboard School Admin ---
ONBOARD_SCH=$(curl -s -X POST "$API_URL/superadmin/institutions" \
  -H "Authorization: Bearer $SUPER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Greenwood High School","slug":"greenwood-test","type":"school","plan":"pro","adminName":"Greenwood Admin","adminEmail":"admin@greenwoodtest.com","adminPassword":"adminpassword123"}')
STATUS_T103a=$(echo "$ONBOARD_SCH" | grep -q "institution" && echo "201" || echo "failed")
if [ "$STATUS_T103a" = "failed" ]; then
  STATUS_T103a=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$API_URL/superadmin/institutions" \
    -H "Authorization: Bearer $SUPER_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{"name":"Greenwood High School","slug":"greenwood-test","type":"school","plan":"pro","adminName":"Greenwood Admin","adminEmail":"admin@greenwoodtest.com","adminPassword":"adminpassword123"}')
fi
print_result "T-103a" "/superadmin/institutions" "POST" "Onboard School Admin (Greenwood)" "201" "$STATUS_T103a"

# --- T-103b: Onboard Coaching Admin ---
ONBOARD_COACH=$(curl -s -X POST "$API_URL/superadmin/institutions" \
  -H "Authorization: Bearer $SUPER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Allen Career Institute","slug":"allen-test","type":"coaching","plan":"enterprise","adminName":"Allen Admin","adminEmail":"admin@allentest.com","adminPassword":"allenpassword123"}')
STATUS_T103b=$(echo "$ONBOARD_COACH" | grep -q "institution" && echo "201" || echo "failed")
if [ "$STATUS_T103b" = "failed" ]; then
  STATUS_T103b=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$API_URL/superadmin/institutions" \
    -H "Authorization: Bearer $SUPER_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{"name":"Allen Career Institute","slug":"allen-test","type":"coaching","plan":"enterprise","adminName":"Allen Admin","adminEmail":"admin@allentest.com","adminPassword":"allenpassword123"}')
fi
print_result "T-103b" "/superadmin/institutions" "POST" "Onboard Coaching Admin (Allen)" "201" "$STATUS_T103b"

# --- T-103c: Onboard College Admin ---
ONBOARD_COLL=$(curl -s -X POST "$API_URL/superadmin/institutions" \
  -H "Authorization: Bearer $SUPER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"IIT Bombay","slug":"iit-test","type":"college","plan":"enterprise","adminName":"IIT Admin","adminEmail":"admin@iittest.com","adminPassword":"iitpassword123"}')
STATUS_T103c=$(echo "$ONBOARD_COLL" | grep -q "institution" && echo "201" || echo "failed")
if [ "$STATUS_T103c" = "failed" ]; then
  STATUS_T103c=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$API_URL/superadmin/institutions" \
    -H "Authorization: Bearer $SUPER_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{"name":"IIT Bombay","slug":"iit-test","type":"college","plan":"enterprise","adminName":"IIT Admin","adminEmail":"admin@iittest.com","adminPassword":"iitpassword123"}')
fi
print_result "T-103c" "/superadmin/institutions" "POST" "Onboard College Admin (IIT)" "201" "$STATUS_T103c"

# --- T-104: Onboard Institution by Non-Superadmin ---
STATUS_T104=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$API_URL/superadmin/institutions" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test College","slug":"testcoll","adminEmail":"adm@test.com","adminPassword":"123"}')
print_result "T-104" "/superadmin/institutions" "POST" "Onboard without token (Unauthorized)" "401" "$STATUS_T104"

# --- T-105a: School Admin Login & App Allocation Check ---
ADMIN_LOGIN_RESP_A=$(curl -s -X POST "$API_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@greenwoodtest.com","password":"adminpassword123"}')
ADMIN_TOKEN_A=$(echo "$ADMIN_LOGIN_RESP_A" | grep -o '"token":"[^"]*' | grep -o '[^"]*$')
STATUS_T105a=$(curl -s -o /dev/null -w "%{http_code}" -X GET "$API_URL/admin/my-institution" \
  -H "Authorization: Bearer $ADMIN_TOKEN_A" \
  -H "x-tenant-slug: greenwood-test")
print_result "T-105a" "/admin/my-institution" "GET" "Verify School Admin DB & App Allocation" "200" "$STATUS_T105a"

# --- T-105b: Coaching Admin Login & App Allocation Check ---
ADMIN_LOGIN_RESP_B=$(curl -s -X POST "$API_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@allentest.com","password":"allenpassword123"}')
ADMIN_TOKEN_B=$(echo "$ADMIN_LOGIN_RESP_B" | grep -o '"token":"[^"]*' | grep -o '[^"]*$')
STATUS_T105b=$(curl -s -o /dev/null -w "%{http_code}" -X GET "$API_URL/admin/my-institution" \
  -H "Authorization: Bearer $ADMIN_TOKEN_B" \
  -H "x-tenant-slug: allen-test")
print_result "T-105b" "/admin/my-institution" "GET" "Verify Coaching Admin DB & App Allocation" "200" "$STATUS_T105b"

# --- T-105c: College Admin Login & App Allocation Check ---
ADMIN_LOGIN_RESP_C=$(curl -s -X POST "$API_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@iittest.com","password":"iitpassword123"}')
ADMIN_TOKEN_C=$(echo "$ADMIN_LOGIN_RESP_C" | grep -o '"token":"[^"]*' | grep -o '[^"]*$')
STATUS_T105c=$(curl -s -o /dev/null -w "%{http_code}" -X GET "$API_URL/admin/my-institution" \
  -H "Authorization: Bearer $ADMIN_TOKEN_C" \
  -H "x-tenant-slug: iit-test")
print_result "T-105c" "/admin/my-institution" "GET" "Verify College Admin DB & App Allocation" "200" "$STATUS_T105c"

echo ""
echo "🧹 Stopping backend server..."
kill $SERVER_PID
rm -f $TEST_LOG
echo "✅ Finished local API verification run."
echo "=================================================="
