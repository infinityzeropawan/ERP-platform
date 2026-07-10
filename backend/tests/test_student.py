"""
test_student.py — Tests for Student APIs

Endpoints covered:
  GET /student/class-info   — Classmates + teachers directory
  GET /student/results      — Personal academic result grades
  GET /student/diaries      — Class diary entries for student's class

Run standalone:
    pytest -v tests/test_student.py
"""
import requests
import pytest
from conftest import API_BASE, db_connect


@pytest.fixture(scope="module")
def ctx(backend_server):
    """Setup: school → teacher+class → student → grades+diary. Teardown after all tests."""
    sa_tok = requests.post(f"{API_BASE}/auth/login",
                           json={"email": "superadmin@buildroonix.com", "password": "super123"}
                           ).json()["token"]

    inst_r = requests.post(
        f"{API_BASE}/superadmin/institutions",
        json={"name": "Student Test School", "slug": "student-test",
              "type": "school", "plan": "basic",
              "adminName": "ST Admin",
              "adminEmail": "admin@studenttest.com", "adminPassword": "admin123"},
        headers={"Authorization": f"Bearer {sa_tok}"}
    )
    assert inst_r.status_code == 201, inst_r.text
    inst_id = inst_r.json()["institution"]["id"]

    admin_tok = requests.post(f"{API_BASE}/auth/login",
                              json={"email": "admin@studenttest.com", "password": "admin123"}
                              ).json()["token"]
    admin_h = {"Authorization": f"Bearer {admin_tok}"}

    # Teacher
    t_r = requests.post(f"{API_BASE}/admin/users",
                        json={"role": "teacher", "name": "ST Teacher", "email": "stteacher@studenttest.com",
                              "phone": "7700", "subject": "English"},
                        headers=admin_h)
    teacher_id = t_r.json()["id"]

    # Assign class to teacher
    requests.post(f"{API_BASE}/admin/classes",
                  json={"className": "Class-VI", "section": "A", "classTeacherId": teacher_id},
                  headers=admin_h)

    teacher_tok = requests.post(f"{API_BASE}/auth/login",
                                json={"email": "stteacher@studenttest.com", "password": "stteacher123"}
                                ).json()["token"]

    # Student
    s_r = requests.post(f"{API_BASE}/admin/users",
                        json={"role": "student", "name": "ST Student", "email": "ststudent@studenttest.com",
                              "phone": "7701", "class": "Class-VI", "section": "A",
                              "rollNo": "ST01", "fatherName": "ST Father"},
                        headers=admin_h)
    student_id = s_r.json()["id"]
    student_tok = requests.post(f"{API_BASE}/auth/login",
                                json={"email": "ststudent@studenttest.com", "password": "ststudent123"}
                                ).json()["token"]

    # Seed gradebook marks for student
    requests.post(f"{API_BASE}/teacher/gradebook/batch",
                  json={"subject": "English",
                        "entries": [{"id": student_id, "studentName": "ST Student",
                                     "unitTest1": 23, "midTerm": 78, "assignment": 19,
                                     "practical": 22, "remarks": "Good"}]},
                  headers={"Authorization": f"Bearer {teacher_tok}"})

    # Seed a published diary
    requests.post(f"{API_BASE}/teacher/diaries",
                  json={"className": "Class-VI", "section": "A", "subject": "English",
                        "homework": "Write an essay on nature", "date": "2026-07-09",
                        "isPublished": True},
                  headers={"Authorization": f"Bearer {teacher_tok}"})

    yield {
        "inst_id":     inst_id,
        "teacher_id":  teacher_id,
        "student_id":  student_id,
        "student_tok": student_tok,
        "teacher_tok": teacher_tok,
        "admin_tok":   admin_tok,
    }

    # Teardown
    conn = db_connect(); cur = conn.cursor()
    cur.execute('DELETE FROM "DailyDiary"    WHERE "institutionId"=%s', (inst_id,))
    cur.execute('DELETE FROM "GradebookEntry" WHERE "institutionId"=%s', (inst_id,))
    cur.execute('DELETE FROM "StaffPayroll"  WHERE "institutionId"=%s', (inst_id,))
    cur.execute('DELETE FROM "ParentMessage" WHERE "institutionId"=%s', (inst_id,))
    cur.execute('DELETE FROM "SupportStaff" WHERE "institutionId"=%s', (inst_id,))
    cur.execute('DELETE FROM "User"          WHERE "institutionId"=%s', (inst_id,))
    cur.execute('DELETE FROM "Institution"   WHERE id=%s',              (inst_id,))
    conn.commit(); cur.close(); conn.close()


# ─────────────────────────────────────────────────────────────────────────────
class TestStudentClassInfo:
    """GET /student/class-info"""

    def test_class_info_returns_200(self, ctx):
        r = requests.get(f"{API_BASE}/student/class-info",
                         headers={"Authorization": f"Bearer {ctx['student_tok']}"})
        assert r.status_code == 200
        data = r.json()
        assert data["className"] == "Class-VI"
        assert data["section"]   == "A"

    def test_classmates_list(self, ctx):
        r = requests.get(f"{API_BASE}/student/class-info",
                         headers={"Authorization": f"Bearer {ctx['student_tok']}"})
        classmates = r.json()["classmates"]
        assert any(c["id"] == ctx["student_id"] for c in classmates)

    def test_teachers_list(self, ctx):
        r = requests.get(f"{API_BASE}/student/class-info",
                         headers={"Authorization": f"Bearer {ctx['student_tok']}"})
        teachers = r.json()["teachers"]
        assert any(t["id"] == ctx["teacher_id"] for t in teachers)

    def test_teachers_have_subject_field(self, ctx):
        r = requests.get(f"{API_BASE}/student/class-info",
                         headers={"Authorization": f"Bearer {ctx['student_tok']}"})
        for t in r.json()["teachers"]:
            assert "subject" in t

    def test_requires_auth(self):
        r = requests.get(f"{API_BASE}/student/class-info")
        assert r.status_code in (401, 403)


# ─────────────────────────────────────────────────────────────────────────────
class TestStudentResults:
    """GET /student/results"""

    def test_results_returns_200(self, ctx):
        r = requests.get(f"{API_BASE}/student/results",
                         headers={"Authorization": f"Bearer {ctx['student_tok']}"})
        assert r.status_code == 200
        data = r.json()
        assert isinstance(data, list)
        assert len(data) >= 1

    def test_results_contain_expected_marks(self, ctx):
        r = requests.get(f"{API_BASE}/student/results",
                         headers={"Authorization": f"Bearer {ctx['student_tok']}"})
        marks_values = [row["obtainedMarks"] for row in r.json()]
        assert 23 in marks_values   # unit test 1
        assert 78 in marks_values   # mid term

    def test_results_have_grade_field(self, ctx):
        r = requests.get(f"{API_BASE}/student/results",
                         headers={"Authorization": f"Bearer {ctx['student_tok']}"})
        for row in r.json():
            assert "grade" in row
            assert row["grade"] in ["A+", "A", "B+", "B", "C", "D", "F"]

    def test_results_match_db_entries(self, ctx):
        """Verify DB has same entries as API returns."""
        conn = db_connect(); cur = conn.cursor()
        cur.execute('SELECT marks FROM "GradebookEntry" WHERE "studentId"=%s',
                    (ctx["student_id"],))
        db_marks = set(row[0] for row in cur.fetchall())
        cur.connection.close()

        r = requests.get(f"{API_BASE}/student/results",
                         headers={"Authorization": f"Bearer {ctx['student_tok']}"})
        api_marks = set(row["obtainedMarks"] for row in r.json())
        assert db_marks == api_marks

    def test_results_requires_auth(self):
        r = requests.get(f"{API_BASE}/student/results")
        assert r.status_code in (401, 403)


# ─────────────────────────────────────────────────────────────────────────────
class TestStudentDiaries:
    """GET /student/diaries"""

    def test_diaries_returns_200(self, ctx):
        r = requests.get(f"{API_BASE}/student/diaries",
                         headers={"Authorization": f"Bearer {ctx['student_tok']}"})
        assert r.status_code == 200
        assert isinstance(r.json(), list)

    def test_diaries_contains_seeded_entry(self, ctx):
        r = requests.get(f"{API_BASE}/student/diaries",
                         headers={"Authorization": f"Bearer {ctx['student_tok']}"})
        homework_list = [d["homework"] for d in r.json()]
        assert "Write an essay on nature" in homework_list

    def test_diaries_only_published(self, ctx):
        """All returned entries must have isPublished=true."""
        r = requests.get(f"{API_BASE}/student/diaries",
                         headers={"Authorization": f"Bearer {ctx['student_tok']}"})
        for d in r.json():
            assert d["isPublished"] is True

    def test_diaries_db_match(self, ctx):
        """API count equals DB count of published diaries for student's class."""
        conn = db_connect(); cur = conn.cursor()
        cur.execute(
            'SELECT COUNT(*) FROM "DailyDiary" '
            'WHERE "institutionId"=%s AND "className"=%s AND section=%s AND "isPublished"=true',
            (ctx["inst_id"], "Class-VI", "A")
        )
        db_count = cur.fetchone()[0]
        cur.connection.close()

        r = requests.get(f"{API_BASE}/student/diaries",
                         headers={"Authorization": f"Bearer {ctx['student_tok']}"})
        assert len(r.json()) == db_count

    def test_diaries_requires_auth(self):
        r = requests.get(f"{API_BASE}/student/diaries")
        assert r.status_code in (401, 403)
