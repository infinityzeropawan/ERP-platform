"""
test_admin.py — Tests for School Admin APIs

Endpoints covered:
  GET  /admin/my-institution              — Fetch school profile
  PUT  /admin/my-institution              — Update school details
  POST /admin/users                       — Create teacher/student/support/parent
  GET  /admin/users?role=...              — List users by role
  PUT  /admin/users/:id                   — Update user
  DEL  /admin/users/:id                   — Delete user
  POST /admin/classes                     — Register class
  GET  /admin/classes                     — List computed classes
  PUT  /admin/classes/:id                 — Rename class
  DEL  /admin/classes/:id                 — Delete class (nullifies student.class)
  GET  /admin/payroll                     — Generate/fetch payroll sheet
  PUT  /admin/payroll/:id/pay             — Pay single salary
  PUT  /admin/payroll/pay-all             — Pay all pending salaries
  GET  /admin/enrollment-requests         — List unapproved students
  PUT  /admin/enrollment-requests/:id/approve — Approve student
  DEL  /admin/enrollment-requests/:id    — Reject/delete student
  GET  /admin/parent-messages             — View parent message history
  POST /admin/parent-messages             — Admin posts message to parent
  DEL  /admin/parent-messages/:id        — Delete parent message

Run standalone:
    pytest -v tests/test_admin.py
"""
import requests
import pytest
from conftest import API_BASE, db_connect


# ─────────────────────────────────────────────────────────────────────────────
# Module-level fixture: creates a fresh school for these tests
# ─────────────────────────────────────────────────────────────────────────────
@pytest.fixture(scope="module")
def ctx(backend_server):
    """Create school, get admin token, teardown after all tests in this module."""
    sa_r = requests.post(f"{API_BASE}/auth/login",
                         json={"email": "superadmin@buildroonix.com", "password": "super123"})
    sa_token = sa_r.json()["token"]

    inst_r = requests.post(
        f"{API_BASE}/superadmin/institutions",
        json={
            "name": "Admin Test School", "slug": "admin-test",
            "type": "school", "plan": "basic",
            "adminName": "Admin User",
            "adminEmail": "admin@admintest.com", "adminPassword": "admin123"
        },
        headers={"Authorization": f"Bearer {sa_token}"}
    )
    assert inst_r.status_code == 201, inst_r.text
    inst_id = inst_r.json()["institution"]["id"]

    tok_r = requests.post(f"{API_BASE}/auth/login",
                          json={"email": "admin@admintest.com", "password": "admin123"})
    admin_token = tok_r.json()["token"]

    yield {"token": admin_token, "inst_id": inst_id}

    # Teardown
    conn = db_connect(); cur = conn.cursor()
    cur.execute('DELETE FROM "DailyDiary" WHERE "institutionId"=%s', (inst_id,))
    cur.execute('DELETE FROM "GradebookEntry" WHERE "institutionId"=%s', (inst_id,))
    cur.execute('DELETE FROM "StaffPayroll" WHERE "institutionId"=%s', (inst_id,))
    cur.execute('DELETE FROM "ParentMessage" WHERE "institutionId"=%s', (inst_id,))
    cur.execute('DELETE FROM "SupportStaff" WHERE "institutionId"=%s', (inst_id,))
    cur.execute('DELETE FROM "User" WHERE "institutionId"=%s', (inst_id,))
    cur.execute('DELETE FROM "Institution" WHERE id=%s', (inst_id,))
    conn.commit(); cur.close(); conn.close()


# ─────────────────────────────────────────────────────────────────────────────
class TestMyInstitution:
    """GET + PUT /admin/my-institution"""

    def test_get_my_institution(self, ctx):
        r = requests.get(f"{API_BASE}/admin/my-institution",
                         headers={"Authorization": f"Bearer {ctx['token']}"})
        assert r.status_code == 200
        assert r.json()["slug"] == "admin-test"

    def test_update_my_institution(self, ctx):
        r = requests.put(
            f"{API_BASE}/admin/my-institution",
            json={"phone": "999-1111", "website": "www.admintest.edu"},
            headers={"Authorization": f"Bearer {ctx['token']}"}
        )
        assert r.status_code == 200
        # DB verify
        conn = db_connect(); cur = conn.cursor()
        cur.execute('SELECT phone, website FROM "Institution" WHERE id=%s', (ctx["inst_id"],))
        row = cur.fetchone()
        assert row[0] == "999-1111"
        assert row[1] == "www.admintest.edu"
        cur.connection.close()

    def test_get_requires_auth(self):
        r = requests.get(f"{API_BASE}/admin/my-institution")
        assert r.status_code in (401, 403)


# ─────────────────────────────────────────────────────────────────────────────
class TestUserManagement:
    """POST/GET/PUT/DEL /admin/users"""

    teacher_id = None
    student_id = None
    support_id = None

    def test_create_teacher(self, ctx):
        r = requests.post(
            f"{API_BASE}/admin/users",
            json={"role": "teacher", "name": "T. Smith", "email": "smith@admintest.com",
                  "phone": "9001", "subject": "Physics"},
            headers={"Authorization": f"Bearer {ctx['token']}"}
        )
        assert r.status_code == 201
        TestUserManagement.teacher_id = r.json()["id"]
        # DB verify
        conn = db_connect(); cur = conn.cursor()
        cur.execute('SELECT role, qualification FROM "User" WHERE id=%s', (self.teacher_id,))
        row = cur.fetchone()
        assert row[0] == "teacher"
        assert row[1] == "Physics"
        cur.connection.close()

    def test_create_student(self, ctx):
        r = requests.post(
            f"{API_BASE}/admin/users",
            json={"role": "student", "name": "S. Rao", "email": "rao@admintest.com",
                  "phone": "9002", "class": "Class-X", "section": "A",
                  "rollNo": "001", "fatherName": "Father Rao"},
            headers={"Authorization": f"Bearer {ctx['token']}"}
        )
        assert r.status_code == 201
        TestUserManagement.student_id = r.json()["id"]
        conn = db_connect(); cur = conn.cursor()
        cur.execute('SELECT "fatherName" FROM "User" WHERE id=%s', (self.student_id,))
        assert cur.fetchone()[0] == "Father Rao"
        cur.connection.close()

    def test_create_support_staff(self, ctx):
        r = requests.post(
            f"{API_BASE}/admin/users",
            json={"role": "support", "name": "Guard Raju", "email": "raju@admintest.com",
                  "phone": "9003", "supportRole": "guard", "salary": 15000, "shift": "morning"},
            headers={"Authorization": f"Bearer {ctx['token']}"}
        )
        assert r.status_code == 201
        TestUserManagement.support_id = r.json()["id"]
        conn = db_connect(); cur = conn.cursor()
        cur.execute('SELECT salary FROM "SupportStaff" WHERE id=%s', (self.support_id,))
        assert cur.fetchone()[0] == 15000
        cur.connection.close()

    def test_list_students(self, ctx):
        r = requests.get(f"{API_BASE}/admin/users?role=student",
                         headers={"Authorization": f"Bearer {ctx['token']}"})
        assert r.status_code == 200
        emails = [u["email"] for u in r.json()]
        assert "rao@admintest.com" in emails

    def test_list_teachers(self, ctx):
        r = requests.get(f"{API_BASE}/admin/users?role=teacher",
                         headers={"Authorization": f"Bearer {ctx['token']}"})
        assert r.status_code == 200
        assert any(u["email"] == "smith@admintest.com" for u in r.json())

    def test_list_support_staff(self, ctx):
        r = requests.get(f"{API_BASE}/admin/users?role=support",
                         headers={"Authorization": f"Bearer {ctx['token']}"})
        assert r.status_code == 200
        assert any(u["email"] == "raju@admintest.com" for u in r.json())

    def test_update_student(self, ctx):
        r = requests.put(
            f"{API_BASE}/admin/users/{self.student_id}",
            json={"role": "student", "name": "S. Rao Updated", "email": "rao@admintest.com",
                  "phone": "9999", "fatherName": "Father Rao"},
            headers={"Authorization": f"Bearer {ctx['token']}"}
        )
        assert r.status_code == 200
        conn = db_connect(); cur = conn.cursor()
        cur.execute('SELECT name, phone FROM "User" WHERE id=%s', (self.student_id,))
        row = cur.fetchone()
        assert row[0] == "S. Rao Updated"
        assert row[1] == "9999"
        cur.connection.close()

    def test_duplicate_email_conflict(self, ctx):
        r = requests.post(
            f"{API_BASE}/admin/users",
            json={"role": "teacher", "name": "Dup", "email": "smith@admintest.com"},
            headers={"Authorization": f"Bearer {ctx['token']}"}
        )
        assert r.status_code == 409

    def test_delete_teacher(self, ctx):
        r = requests.delete(f"{API_BASE}/admin/users/{self.teacher_id}?role=teacher",
                            headers={"Authorization": f"Bearer {ctx['token']}"})
        assert r.status_code == 200
        conn = db_connect(); cur = conn.cursor()
        cur.execute('SELECT COUNT(*) FROM "User" WHERE id=%s', (self.teacher_id,))
        assert cur.fetchone()[0] == 0
        cur.connection.close()

    def test_delete_student(self, ctx):
        r = requests.delete(f"{API_BASE}/admin/users/{self.student_id}?role=student",
                            headers={"Authorization": f"Bearer {ctx['token']}"})
        assert r.status_code == 200

    def test_delete_support(self, ctx):
        r = requests.delete(f"{API_BASE}/admin/users/{self.support_id}?role=support",
                            headers={"Authorization": f"Bearer {ctx['token']}"})
        assert r.status_code == 200
        conn = db_connect(); cur = conn.cursor()
        cur.execute('SELECT COUNT(*) FROM "SupportStaff" WHERE id=%s', (self.support_id,))
        assert cur.fetchone()[0] == 0
        cur.connection.close()


# ─────────────────────────────────────────────────────────────────────────────
class TestClassManagement:
    """POST/GET/PUT/DEL /admin/classes"""

    teacher_id = None
    student_id = None

    def test_setup_users(self, ctx):
        """Create teacher + student before class tests."""
        t = requests.post(
            f"{API_BASE}/admin/users",
            json={"role": "teacher", "name": "Class Teacher", "email": "ct@admintest.com",
                  "phone": "8001", "subject": "Maths"},
            headers={"Authorization": f"Bearer {ctx['token']}"}
        ).json()
        TestClassManagement.teacher_id = t["id"]

        s = requests.post(
            f"{API_BASE}/admin/users",
            json={"role": "student", "name": "Class Student", "email": "cs@admintest.com",
                  "phone": "8002", "class": "Class-VIII", "section": "A", "rollNo": "C01"},
            headers={"Authorization": f"Bearer {ctx['token']}"}
        ).json()
        TestClassManagement.student_id = s["id"]

    def test_create_class(self, ctx):
        r = requests.post(
            f"{API_BASE}/admin/classes",
            json={"className": "Class-VIII", "section": "A",
                  "classTeacherId": self.teacher_id},
            headers={"Authorization": f"Bearer {ctx['token']}"}
        )
        assert r.status_code == 201
        # DB: teacher now has class assigned
        conn = db_connect(); cur = conn.cursor()
        cur.execute('SELECT class, section FROM "User" WHERE id=%s', (self.teacher_id,))
        row = cur.fetchone()
        assert row[0] == "Class-VIII"
        assert row[1] == "A"
        cur.connection.close()

    def test_list_classes(self, ctx):
        r = requests.get(f"{API_BASE}/admin/classes",
                         headers={"Authorization": f"Bearer {ctx['token']}"})
        assert r.status_code == 200
        classes = r.json()
        assert any(c["className"] == "Class-VIII" for c in classes)

    def test_rename_class(self, ctx):
        r = requests.put(
            f"{API_BASE}/admin/classes/Class-VIII-A",
            json={"className": "Class-IX", "section": "B",
                  "classTeacherId": self.teacher_id},
            headers={"Authorization": f"Bearer {ctx['token']}"}
        )
        assert r.status_code == 200
        conn = db_connect(); cur = conn.cursor()
        cur.execute('SELECT class, section FROM "User" WHERE id=%s', (self.teacher_id,))
        row = cur.fetchone()
        assert row[0] == "Class-IX"
        assert row[1] == "B"
        cur.connection.close()

    def test_delete_class_nullifies_students(self, ctx):
        r = requests.delete(f"{API_BASE}/admin/classes/Class-IX-B",
                            headers={"Authorization": f"Bearer {ctx['token']}"})
        assert r.status_code == 200
        # Student class reset to null
        conn = db_connect(); cur = conn.cursor()
        cur.execute('SELECT class FROM "User" WHERE id=%s', (self.student_id,))
        assert cur.fetchone()[0] is None
        cur.connection.close()


# ─────────────────────────────────────────────────────────────────────────────
class TestPayroll:
    """GET /admin/payroll + PUT /admin/payroll/:id/pay + PUT /admin/payroll/pay-all"""

    payroll_id = None

    def test_setup_teacher_for_payroll(self, ctx):
        r = requests.post(
            f"{API_BASE}/admin/users",
            json={"role": "teacher", "name": "Pay Teacher", "email": "pay@admintest.com",
                  "phone": "7001", "subject": "Biology"},
            headers={"Authorization": f"Bearer {ctx['token']}"}
        )
        assert r.status_code == 201

    def test_payroll_auto_generated(self, ctx):
        r = requests.get(f"{API_BASE}/admin/payroll?month=July&year=2026",
                         headers={"Authorization": f"Bearer {ctx['token']}"})
        assert r.status_code == 200
        rows = r.json()
        assert len(rows) >= 1
        # Find teacher payroll row
        teacher_rows = [p for p in rows if p["role"] == "teacher"]
        assert len(teacher_rows) >= 1
        TestPayroll.payroll_id = teacher_rows[0]["id"]
        # DB verify
        conn = db_connect(); cur = conn.cursor()
        cur.execute('SELECT status FROM "StaffPayroll" WHERE id=%s', (self.payroll_id,))
        assert cur.fetchone()[0] == "pending"
        cur.connection.close()

    def test_pay_single_salary(self, ctx):
        r = requests.put(
            f"{API_BASE}/admin/payroll/{self.payroll_id}/pay",
            json={"paymentMethod": "bank_transfer"},
            headers={"Authorization": f"Bearer {ctx['token']}"}
        )
        assert r.status_code == 200
        # DB verify paid
        conn = db_connect(); cur = conn.cursor()
        cur.execute('SELECT status, "paymentMethod" FROM "StaffPayroll" WHERE id=%s', (self.payroll_id,))
        row = cur.fetchone()
        assert row[0] == "paid"
        assert row[1] == "bank_transfer"
        cur.connection.close()

    def test_pay_all_pending(self, ctx):
        r = requests.put(
            f"{API_BASE}/admin/payroll/pay-all",
            json={"month": "July", "year": 2026, "paymentMethod": "cash"},
            headers={"Authorization": f"Bearer {ctx['token']}"}
        )
        assert r.status_code == 200


# ─────────────────────────────────────────────────────────────────────────────
class TestEnrollmentApprovals:
    """GET + PUT + DEL /admin/enrollment-requests"""

    pending_id = None

    def test_self_register_student(self, ctx):
        r = requests.post(f"{API_BASE}/auth/register", json={
            "name": "Enroll Student", "email": "enroll@admintest.com",
            "password": "pass123", "institutionSlug": "admin-test"
        })
        assert r.status_code == 201
        # DB verify pending
        conn = db_connect(); cur = conn.cursor()
        cur.execute('SELECT "isApproved" FROM "User" WHERE email=%s', ("enroll@admintest.com",))
        assert cur.fetchone()[0] is False
        cur.connection.close()

    def test_list_enrollment_requests(self, ctx):
        r = requests.get(f"{API_BASE}/admin/enrollment-requests",
                         headers={"Authorization": f"Bearer {ctx['token']}"})
        assert r.status_code == 200
        data = r.json()
        match = [x for x in data if x["email"] == "enroll@admintest.com"]
        assert len(match) == 1
        TestEnrollmentApprovals.pending_id = match[0]["id"]

    def test_approve_enrollment(self, ctx):
        r = requests.put(
            f"{API_BASE}/admin/enrollment-requests/{self.pending_id}/approve",
            headers={"Authorization": f"Bearer {ctx['token']}"}
        )
        assert r.status_code == 200
        # DB verify approved
        conn = db_connect(); cur = conn.cursor()
        cur.execute('SELECT "isApproved" FROM "User" WHERE id=%s', (self.pending_id,))
        assert cur.fetchone()[0] is True
        cur.connection.close()

    def test_reject_enrollment(self, ctx):
        # Register a second student to reject
        requests.post(f"{API_BASE}/auth/register", json={
            "name": "Reject Student", "email": "reject@admintest.com",
            "password": "pass123", "institutionSlug": "admin-test"
        })
        # Get its id
        conn = db_connect(); cur = conn.cursor()
        cur.execute('SELECT id FROM "User" WHERE email=%s', ("reject@admintest.com",))
        reject_id = cur.fetchone()[0]
        cur.connection.close()

        r = requests.delete(f"{API_BASE}/admin/enrollment-requests/{reject_id}",
                            headers={"Authorization": f"Bearer {ctx['token']}"})
        assert r.status_code == 200
        # DB verify deleted
        conn = db_connect(); cur = conn.cursor()
        cur.execute('SELECT COUNT(*) FROM "User" WHERE id=%s', (reject_id,))
        assert cur.fetchone()[0] == 0
        cur.connection.close()


# ─────────────────────────────────────────────────────────────────────────────
class TestAdminParentMessages:
    """GET + POST + DEL /admin/parent-messages"""

    student_id = None
    msg_id     = None

    def test_setup_student(self, ctx):
        r = requests.post(
            f"{API_BASE}/admin/users",
            json={"role": "student", "name": "PM Student", "email": "pm@admintest.com",
                  "phone": "6001", "class": "Class-VII", "section": "A",
                  "rollNo": "PM01", "fatherName": "PM Father"},
            headers={"Authorization": f"Bearer {ctx['token']}"}
        )
        TestAdminParentMessages.student_id = r.json()["id"]

    def test_admin_post_parent_message(self, ctx):
        r = requests.post(
            f"{API_BASE}/admin/parent-messages",
            json={
                "studentId":  self.student_id,
                "parentName": "PM Father",
                "subject":    "Fee Reminder",
                "body":       "Kindly pay term 2 fee by Friday.",
                "category":   "fee",
                "priority":   "urgent"
            },
            headers={"Authorization": f"Bearer {ctx['token']}"}
        )
        assert r.status_code == 201
        TestAdminParentMessages.msg_id = r.json()["id"]
        # DB verify
        conn = db_connect(); cur = conn.cursor()
        cur.execute('SELECT subject, category FROM "ParentMessage" WHERE id=%s', (self.msg_id,))
        row = cur.fetchone()
        assert row[0] == "Fee Reminder"
        assert row[1] == "fee"
        cur.connection.close()

    def test_admin_list_parent_messages(self, ctx):
        r = requests.get(f"{API_BASE}/admin/parent-messages",
                         headers={"Authorization": f"Bearer {ctx['token']}"})
        assert r.status_code == 200
        ids = [m["id"] for m in r.json()]
        assert self.msg_id in ids

    def test_admin_delete_parent_message(self, ctx):
        r = requests.delete(f"{API_BASE}/admin/parent-messages/{self.msg_id}",
                            headers={"Authorization": f"Bearer {ctx['token']}"})
        assert r.status_code == 200
        # DB verify deleted
        conn = db_connect(); cur = conn.cursor()
        cur.execute('SELECT COUNT(*) FROM "ParentMessage" WHERE id=%s', (self.msg_id,))
        assert cur.fetchone()[0] == 0
        cur.connection.close()
