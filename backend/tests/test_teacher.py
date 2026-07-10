"""
test_teacher.py — Tests for Teacher APIs

Endpoints covered:
  GET  /teacher/payroll             — View own salary slips
  GET  /teacher/diaries             — List class diary entries
  POST /teacher/diaries             — Create diary entry
  PUT  /teacher/diaries/:id         — Update diary entry
  DEL  /teacher/diaries/:id         — Delete diary entry
  GET  /teacher/gradebook           — Pivot gradebook grid by class/subject
  POST /teacher/gradebook/batch     — Batch upsert marks
  GET  /teacher/students            — Dropdown student list
  GET  /teacher/parent-messages     — List parent communication messages
  POST /teacher/parent-messages     — Post alert to parent

Run standalone:
    pytest -v tests/test_teacher.py
"""
import requests
import pytest
from conftest import API_BASE, db_connect


@pytest.fixture(scope="module")
def ctx(backend_server):
    """Create school → teacher → student, return tokens. Teardown after module."""
    # Superadmin
    sa_tok = requests.post(f"{API_BASE}/auth/login",
                           json={"email": "superadmin@buildroonix.com", "password": "super123"}
                           ).json()["token"]

    # Onboard school
    inst_r = requests.post(
        f"{API_BASE}/superadmin/institutions",
        json={"name": "Teacher Test School", "slug": "teacher-test",
              "type": "school", "plan": "basic",
              "adminName": "TT Admin",
              "adminEmail": "admin@teachertest.com", "adminPassword": "admin123"},
        headers={"Authorization": f"Bearer {sa_tok}"}
    )
    assert inst_r.status_code == 201, inst_r.text
    inst_id = inst_r.json()["institution"]["id"]

    admin_tok = requests.post(f"{API_BASE}/auth/login",
                              json={"email": "admin@teachertest.com", "password": "admin123"}
                              ).json()["token"]

    # Create teacher
    t_r = requests.post(
        f"{API_BASE}/admin/users",
        json={"role": "teacher", "name": "Test Teacher", "email": "tteacher@teachertest.com",
              "phone": "8800", "subject": "Science"},
        headers={"Authorization": f"Bearer {admin_tok}"}
    )
    assert t_r.status_code == 201
    teacher_id = t_r.json()["id"]

    # Assign class to teacher
    requests.post(f"{API_BASE}/admin/classes",
                  json={"className": "Class-VII", "section": "A", "classTeacherId": teacher_id},
                  headers={"Authorization": f"Bearer {admin_tok}"})

    teacher_tok = requests.post(f"{API_BASE}/auth/login",
                                json={"email": "tteacher@teachertest.com", "password": "tteacher123"}
                                ).json()["token"]

    # Create student
    s_r = requests.post(
        f"{API_BASE}/admin/users",
        json={"role": "student", "name": "Test Student", "email": "tstudent@teachertest.com",
              "phone": "8801", "class": "Class-VII", "section": "A",
              "rollNo": "T01", "fatherName": "Test Parent"},
        headers={"Authorization": f"Bearer {admin_tok}"}
    )
    assert s_r.status_code == 201
    student_id = s_r.json()["id"]

    yield {
        "inst_id":     inst_id,
        "admin_tok":   admin_tok,
        "teacher_tok": teacher_tok,
        "teacher_id":  teacher_id,
        "student_id":  student_id,
    }

    # Teardown
    conn = db_connect(); cur = conn.cursor()
    cur.execute('DELETE FROM "DailyDiary"       WHERE "institutionId"=%s', (inst_id,))
    cur.execute('DELETE FROM "GradebookEntry"   WHERE "institutionId"=%s', (inst_id,))
    cur.execute('DELETE FROM "StaffPayroll"     WHERE "institutionId"=%s', (inst_id,))
    cur.execute('DELETE FROM "ParentMessage"    WHERE "institutionId"=%s', (inst_id,))
    cur.execute('DELETE FROM "SupportStaff"    WHERE "institutionId"=%s', (inst_id,))
    cur.execute('DELETE FROM "User"            WHERE "institutionId"=%s', (inst_id,))
    cur.execute('DELETE FROM "Institution"     WHERE id=%s',              (inst_id,))
    conn.commit(); cur.close(); conn.close()


# ─────────────────────────────────────────────────────────────────────────────
class TestTeacherPayroll:
    """GET /teacher/payroll"""

    def test_payroll_requires_auth(self):
        r = requests.get(f"{API_BASE}/teacher/payroll")
        assert r.status_code in (401, 403)

    def test_payroll_empty_before_generation(self, ctx):
        r = requests.get(f"{API_BASE}/teacher/payroll",
                         headers={"Authorization": f"Bearer {ctx['teacher_tok']}"})
        assert r.status_code == 200
        assert isinstance(r.json(), list)

    def test_payroll_after_admin_generates(self, ctx):
        """Admin triggers generation + payment, teacher can see paid slip."""
        admin_h = {"Authorization": f"Bearer {ctx['admin_tok']}"}
        rows = requests.get(f"{API_BASE}/admin/payroll?month=July&year=2026",
                            headers=admin_h).json()
        teacher_rows = [p for p in rows if p["staffId"] == ctx["teacher_id"]]
        assert len(teacher_rows) >= 1
        pid = teacher_rows[0]["id"]

        requests.put(f"{API_BASE}/admin/payroll/{pid}/pay",
                     json={"paymentMethod": "cash"}, headers=admin_h)

        r = requests.get(f"{API_BASE}/teacher/payroll",
                         headers={"Authorization": f"Bearer {ctx['teacher_tok']}"})
        assert r.status_code == 200
        paid = [p for p in r.json() if p["status"] == "paid"]
        assert len(paid) >= 1
        # DB verify
        conn = db_connect(); cur = conn.cursor()
        cur.execute('SELECT status FROM "StaffPayroll" WHERE id=%s', (pid,))
        assert cur.fetchone()[0] == "paid"
        cur.connection.close()


# ─────────────────────────────────────────────────────────────────────────────
class TestDailyDiary:
    """CRUD on /teacher/diaries"""

    diary_id = None

    def test_create_diary(self, ctx):
        r = requests.post(
            f"{API_BASE}/teacher/diaries",
            json={"className": "Class-VII", "section": "A", "subject": "Science",
                  "homework": "Read chapter 4", "date": "2026-07-09", "isPublished": True},
            headers={"Authorization": f"Bearer {ctx['teacher_tok']}"}
        )
        assert r.status_code == 201
        TestDailyDiary.diary_id = r.json()["id"]
        # DB verify
        conn = db_connect(); cur = conn.cursor()
        cur.execute('SELECT homework FROM "DailyDiary" WHERE id=%s', (self.diary_id,))
        assert cur.fetchone()[0] == "Read chapter 4"
        cur.connection.close()

    def test_list_diaries(self, ctx):
        r = requests.get(f"{API_BASE}/teacher/diaries",
                         headers={"Authorization": f"Bearer {ctx['teacher_tok']}"})
        assert r.status_code == 200
        assert any(d["id"] == self.diary_id for d in r.json())

    def test_update_diary(self, ctx):
        r = requests.put(
            f"{API_BASE}/teacher/diaries/{self.diary_id}",
            json={"className": "Class-VII", "section": "A", "subject": "Science",
                  "homework": "Read chapter 5 + summary", "date": "2026-07-09"},
            headers={"Authorization": f"Bearer {ctx['teacher_tok']}"}
        )
        assert r.status_code == 200
        conn = db_connect(); cur = conn.cursor()
        cur.execute('SELECT homework FROM "DailyDiary" WHERE id=%s', (self.diary_id,))
        assert cur.fetchone()[0] == "Read chapter 5 + summary"
        cur.connection.close()

    def test_delete_diary(self, ctx):
        r = requests.delete(f"{API_BASE}/teacher/diaries/{self.diary_id}",
                            headers={"Authorization": f"Bearer {ctx['teacher_tok']}"})
        assert r.status_code == 200
        conn = db_connect(); cur = conn.cursor()
        cur.execute('SELECT COUNT(*) FROM "DailyDiary" WHERE id=%s', (self.diary_id,))
        assert cur.fetchone()[0] == 0
        cur.connection.close()

    def test_create_diary_requires_auth(self):
        r = requests.post(f"{API_BASE}/teacher/diaries",
                          json={"className": "X", "section": "A"})
        assert r.status_code in (401, 403)


# ─────────────────────────────────────────────────────────────────────────────
class TestGradebook:
    """GET /teacher/gradebook + POST /teacher/gradebook/batch"""

    def test_batch_requires_subject(self, ctx):
        r = requests.post(
            f"{API_BASE}/teacher/gradebook/batch",
            json={"entries": []},
            headers={"Authorization": f"Bearer {ctx['teacher_tok']}"}
        )
        assert r.status_code == 400

    def test_batch_save_marks(self, ctx):
        r = requests.post(
            f"{API_BASE}/teacher/gradebook/batch",
            json={
                "subject": "Science",
                "entries": [{
                    "id":          ctx["student_id"],
                    "studentName": "Test Student",
                    "unitTest1": 22, "unitTest2": 20,
                    "midTerm": 85, "assignment": 18, "practical": 24,
                    "remarks": "Excellent"
                }]
            },
            headers={"Authorization": f"Bearer {ctx['teacher_tok']}"}
        )
        assert r.status_code == 200
        assert r.json()["count"] >= 1
        # DB verify
        conn = db_connect(); cur = conn.cursor()
        cur.execute('SELECT marks FROM "GradebookEntry" WHERE "studentId"=%s AND "examName"=%s',
                    (ctx["student_id"], "Unit Test 1"))
        assert cur.fetchone()[0] == 22
        cur.connection.close()

    def test_pivot_gradebook(self, ctx):
        r = requests.get(
            f"{API_BASE}/teacher/gradebook?class=Class-VII&section=A&subject=Science",
            headers={"Authorization": f"Bearer {ctx['teacher_tok']}"}
        )
        assert r.status_code == 200
        data = r.json()
        student_row = next((x for x in data if x["id"] == ctx["student_id"]), None)
        assert student_row is not None
        assert student_row["unitTest1"] == 22
        assert student_row["midTerm"] == 85
        assert student_row["grade"] in ["A", "A+", "B+", "B", "C", "D", "F"]

    def test_gradebook_missing_params(self, ctx):
        r = requests.get(f"{API_BASE}/teacher/gradebook?class=Class-VII",
                         headers={"Authorization": f"Bearer {ctx['teacher_tok']}"})
        assert r.status_code == 400

    def test_batch_upsert_marks(self, ctx):
        """Second batch call updates existing entries."""
        r = requests.post(
            f"{API_BASE}/teacher/gradebook/batch",
            json={
                "subject": "Science",
                "entries": [{
                    "id": ctx["student_id"], "studentName": "Test Student",
                    "unitTest1": 25, "remarks": "Updated"
                }]
            },
            headers={"Authorization": f"Bearer {ctx['teacher_tok']}"}
        )
        assert r.status_code == 200
        conn = db_connect(); cur = conn.cursor()
        cur.execute('SELECT marks FROM "GradebookEntry" WHERE "studentId"=%s AND "examName"=%s',
                    (ctx["student_id"], "Unit Test 1"))
        assert cur.fetchone()[0] == 25
        cur.connection.close()


# ─────────────────────────────────────────────────────────────────────────────
class TestTeacherStudentList:
    """GET /teacher/students"""

    def test_student_list_returns_200(self, ctx):
        r = requests.get(f"{API_BASE}/teacher/students",
                         headers={"Authorization": f"Bearer {ctx['teacher_tok']}"})
        assert r.status_code == 200
        data = r.json()
        assert isinstance(data, list)
        assert any(s["id"] == ctx["student_id"] for s in data)

    def test_student_list_requires_auth(self):
        r = requests.get(f"{API_BASE}/teacher/students")
        assert r.status_code in (401, 403)


# ─────────────────────────────────────────────────────────────────────────────
class TestTeacherParentMessages:
    """GET + POST /teacher/parent-messages"""

    msg_id = None

    def test_post_parent_message(self, ctx):
        r = requests.post(
            f"{API_BASE}/teacher/parent-messages",
            json={
                "studentId":  ctx["student_id"],
                "parentName": "Test Parent",
                "subject":    "Weekly Progress",
                "body":       "Student is performing well in Science.",
                "category":   "academic",
                "priority":   "normal"
            },
            headers={"Authorization": f"Bearer {ctx['teacher_tok']}"}
        )
        assert r.status_code == 201
        TestTeacherParentMessages.msg_id = r.json()["id"]
        # DB verify
        conn = db_connect(); cur = conn.cursor()
        cur.execute('SELECT subject, "teacherId" FROM "ParentMessage" WHERE id=%s',
                    (self.msg_id,))
        row = cur.fetchone()
        assert row[0] == "Weekly Progress"
        assert row[1] == ctx["teacher_id"]
        cur.connection.close()

    def test_list_parent_messages(self, ctx):
        r = requests.get(f"{API_BASE}/teacher/parent-messages",
                         headers={"Authorization": f"Bearer {ctx['teacher_tok']}"})
        assert r.status_code == 200
        assert any(m["id"] == self.msg_id for m in r.json())

    def test_post_message_missing_fields(self, ctx):
        r = requests.post(
            f"{API_BASE}/teacher/parent-messages",
            json={"studentId": ctx["student_id"]},   # missing parentName, subject, body
            headers={"Authorization": f"Bearer {ctx['teacher_tok']}"}
        )
        assert r.status_code == 400
        assert r.json()["error"] == "ValidationError"
