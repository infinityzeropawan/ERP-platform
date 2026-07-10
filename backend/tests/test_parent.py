"""
test_parent.py — Tests for Parent APIs

Endpoints covered:
  GET  /parent/child-info   — Resolve child student profile for logged-in parent
  GET  /parent/messages     — Parent inbox (messages from teacher/admin)
  POST /parent/messages     — Parent sends message to admin

Run standalone:
    pytest -v tests/test_parent.py
"""
import requests
import pytest
from conftest import API_BASE, db_connect


@pytest.fixture(scope="module")
def ctx(backend_server):
    """
    Setup:
      - School institution
      - Teacher, Student (fatherName="Parent John")
      - Parent user (name="Parent John")
      - Teacher posts one message for student
    Teardown: all data wiped after module.
    """
    sa_tok = requests.post(f"{API_BASE}/auth/login",
                           json={"email": "superadmin@buildroonix.com", "password": "super123"}
                           ).json()["token"]

    inst_r = requests.post(
        f"{API_BASE}/superadmin/institutions",
        json={"name": "Parent Test School", "slug": "parent-test",
              "type": "school", "plan": "basic",
              "adminName": "PT Admin",
              "adminEmail": "admin@parenttest.com", "adminPassword": "admin123"},
        headers={"Authorization": f"Bearer {sa_tok}"}
    )
    assert inst_r.status_code == 201, inst_r.text
    inst_id = inst_r.json()["institution"]["id"]

    admin_tok = requests.post(f"{API_BASE}/auth/login",
                              json={"email": "admin@parenttest.com", "password": "admin123"}
                              ).json()["token"]
    admin_h = {"Authorization": f"Bearer {admin_tok}"}

    # Teacher
    t_r = requests.post(f"{API_BASE}/admin/users",
                        json={"role": "teacher", "name": "PT Teacher", "email": "ptteacher@parenttest.com",
                              "phone": "6600", "subject": "Hindi"},
                        headers=admin_h)
    teacher_id = t_r.json()["id"]
    teacher_tok = requests.post(f"{API_BASE}/auth/login",
                                json={"email": "ptteacher@parenttest.com", "password": "ptteacher123"}
                                ).json()["token"]

    # Student — fatherName MUST match parent's name for resolveChild() to work
    s_r = requests.post(f"{API_BASE}/admin/users",
                        json={"role": "student", "name": "PT Student", "email": "ptstudent@parenttest.com",
                              "phone": "6601", "class": "Class-V", "section": "A",
                              "rollNo": "PT01", "fatherName": "Parent John"},
                        headers=admin_h)
    student_id = s_r.json()["id"]

    # Parent — name MUST match student.fatherName
    p_r = requests.post(f"{API_BASE}/admin/users",
                        json={"role": "parent", "name": "Parent John",
                              "email": "parent@parenttest.com", "phone": "6602"},
                        headers=admin_h)
    parent_id = p_r.json()["id"]
    parent_tok = requests.post(f"{API_BASE}/auth/login",
                               json={"email": "parent@parenttest.com", "password": "parent123"}
                               ).json()["token"]

    # Teacher posts a message for student
    msg_r = requests.post(f"{API_BASE}/teacher/parent-messages",
                          json={"studentId": student_id, "parentName": "Parent John",
                                "subject": "Progress Report", "body": "Student is doing great.",
                                "category": "academic", "priority": "normal"},
                          headers={"Authorization": f"Bearer {teacher_tok}"})
    msg_id = msg_r.json()["id"]

    yield {
        "inst_id":    inst_id,
        "teacher_id": teacher_id,
        "student_id": student_id,
        "parent_id":  parent_id,
        "parent_tok": parent_tok,
        "admin_tok":  admin_tok,
        "msg_id":     msg_id,
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
class TestParentChildInfo:
    """GET /parent/child-info"""

    def test_child_info_returns_200(self, ctx):
        r = requests.get(f"{API_BASE}/parent/child-info",
                         headers={"Authorization": f"Bearer {ctx['parent_tok']}"})
        assert r.status_code == 200
        data = r.json()
        assert "child" in data
        assert "parentName" in data

    def test_child_info_resolves_correct_student(self, ctx):
        r = requests.get(f"{API_BASE}/parent/child-info",
                         headers={"Authorization": f"Bearer {ctx['parent_tok']}"})
        assert r.json()["child"]["id"] == ctx["student_id"]

    def test_child_info_parent_name(self, ctx):
        r = requests.get(f"{API_BASE}/parent/child-info",
                         headers={"Authorization": f"Bearer {ctx['parent_tok']}"})
        assert r.json()["parentName"] == "Parent John"

    def test_child_info_student_has_class(self, ctx):
        r = requests.get(f"{API_BASE}/parent/child-info",
                         headers={"Authorization": f"Bearer {ctx['parent_tok']}"})
        child = r.json()["child"]
        assert child["class"] == "Class-V"
        assert child["section"] == "A"

    def test_child_info_requires_auth(self):
        r = requests.get(f"{API_BASE}/parent/child-info")
        assert r.status_code in (401, 403)


# ─────────────────────────────────────────────────────────────────────────────
class TestParentMessages:
    """GET /parent/messages — Read inbox from teacher/admin"""

    def test_get_messages_returns_200(self, ctx):
        r = requests.get(f"{API_BASE}/parent/messages",
                         headers={"Authorization": f"Bearer {ctx['parent_tok']}"})
        assert r.status_code == 200
        assert isinstance(r.json(), list)

    def test_inbox_contains_teacher_message(self, ctx):
        r = requests.get(f"{API_BASE}/parent/messages",
                         headers={"Authorization": f"Bearer {ctx['parent_tok']}"})
        ids = [m["id"] for m in r.json()]
        assert ctx["msg_id"] in ids

    def test_message_has_expected_fields(self, ctx):
        r = requests.get(f"{API_BASE}/parent/messages",
                         headers={"Authorization": f"Bearer {ctx['parent_tok']}"})
        msg = next((m for m in r.json() if m["id"] == ctx["msg_id"]), None)
        assert msg is not None
        assert msg["subject"] == "Progress Report"
        assert msg["category"] == "academic"

    def test_messages_db_match(self, ctx):
        """Row exists in DB with matching subject."""
        conn = db_connect(); cur = conn.cursor()
        cur.execute('SELECT subject FROM "ParentMessage" WHERE id=%s', (ctx["msg_id"],))
        assert cur.fetchone()[0] == "Progress Report"
        cur.connection.close()

    def test_get_messages_requires_auth(self):
        r = requests.get(f"{API_BASE}/parent/messages")
        assert r.status_code in (401, 403)


# ─────────────────────────────────────────────────────────────────────────────
class TestParentPostMessage:
    """POST /parent/messages — Parent sends message to admin"""

    reply_id = None

    def test_parent_post_message(self, ctx):
        r = requests.post(
            f"{API_BASE}/parent/messages",
            json={
                "subject":  "Query about exam date",
                "body":     "When is the next unit test scheduled?",
                "category": "academic",
                "priority": "normal"
            },
            headers={"Authorization": f"Bearer {ctx['parent_tok']}"}
        )
        assert r.status_code == 201
        TestParentPostMessage.reply_id = r.json()["id"]
        # DB verify
        conn = db_connect(); cur = conn.cursor()
        cur.execute('SELECT subject, body FROM "ParentMessage" WHERE id=%s', (self.reply_id,))
        row = cur.fetchone()
        assert row[0] == "Query about exam date"
        assert row[1] == "When is the next unit test scheduled?"
        cur.connection.close()

    def test_reply_student_id_resolved(self, ctx):
        """Parent message must have child's studentId linked."""
        conn = db_connect(); cur = conn.cursor()
        cur.execute('SELECT "studentId" FROM "ParentMessage" WHERE id=%s', (self.reply_id,))
        assert cur.fetchone()[0] == ctx["student_id"]
        cur.connection.close()

    def test_reply_teacherId_is_admin(self):
        """Messages sent by parent are addressed to 'admin' teacherId."""
        conn = db_connect(); cur = conn.cursor()
        cur.execute('SELECT "teacherId" FROM "ParentMessage" WHERE id=%s', (TestParentPostMessage.reply_id,))
        assert cur.fetchone()[0] == "admin"
        cur.connection.close()

    def test_reply_appears_in_admin_list(self, ctx):
        r = requests.get(f"{API_BASE}/admin/parent-messages",
                         headers={"Authorization": f"Bearer {ctx['admin_tok']}"})
        assert r.status_code == 200
        ids = [m["id"] for m in r.json()]
        assert self.reply_id in ids

    def test_post_message_missing_subject(self, ctx):
        r = requests.post(
            f"{API_BASE}/parent/messages",
            json={"body": "No subject here"},
            headers={"Authorization": f"Bearer {ctx['parent_tok']}"}
        )
        assert r.status_code == 400
        assert r.json()["error"] == "ValidationError"

    def test_post_message_requires_auth(self):
        r = requests.post(f"{API_BASE}/parent/messages",
                          json={"subject": "Hi", "body": "Hello"})
        assert r.status_code in (401, 403)
