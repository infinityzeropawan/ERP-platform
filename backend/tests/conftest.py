"""
conftest.py — Shared pytest fixtures for all Buildroonix ERP API test modules.

Every individual test file imports fixtures from here automatically.
Run a single file like:
    pytest -v tests/test_auth.py
    pytest -v tests/test_admin.py
    pytest -v tests/test_teacher.py
    ... etc.
"""
import time
import subprocess
import os
import psycopg2
import pytest
import requests

# ── Server & DB config ──────────────────────────────────────────────────────
API_BASE  = "http://localhost:5002/api/v1"
DB_CONN   = "postgresql://postgres:postgres@localhost:5432/buildroonix_erp"
BACKEND_DIR = os.path.join(os.path.dirname(__file__), "..")  # backend/

# ── Helpers ─────────────────────────────────────────────────────────────────
def db_connect():
    return psycopg2.connect(DB_CONN)

def purge_test_data():
    """Wipe all test rows except the permanent superadmin account."""
    conn = db_connect()
    cur  = conn.cursor()
    cur.execute('DELETE FROM "DailyDiary";')
    cur.execute('DELETE FROM "GradebookEntry";')
    cur.execute('DELETE FROM "StaffPayroll";')
    cur.execute('DELETE FROM "ParentMessage";')
    cur.execute('DELETE FROM "SupportStaff";')
    cur.execute("DELETE FROM \"User\" WHERE email != 'superadmin@buildroonix.com';")
    cur.execute('DELETE FROM "Institution";')
    conn.commit()
    cur.close()
    conn.close()

def get_token(email, password):
    r = requests.post(f"{API_BASE}/auth/login", json={"email": email, "password": password})
    assert r.status_code == 200, f"Login failed for {email}: {r.text}"
    return r.json()["token"]

# ── Session-scoped server fixture ────────────────────────────────────────────
@pytest.fixture(scope="session", autouse=True)
def backend_server():
    """
    Starts the compiled Express backend on port 5002 once per session,
    purges data before and after all tests run.
    """
    purge_test_data()

    env = os.environ.copy()
    env["PORT"] = "5002"
    env["DATABASE_URL"] = DB_CONN
    env["JWT_SECRET"] = "pytest-only-secret-that-is-never-used-outside-the-test-suite"
    env["FRONTEND_URL"] = "http://localhost:3000"

    proc = subprocess.Popen(
        ["node", "dist/index.js"],
        cwd=BACKEND_DIR,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        env=env
    )
    time.sleep(3)   # allow Express to bind

    yield proc

    proc.terminate()
    proc.wait()
    purge_test_data()

# ── Shared institution + admin token ─────────────────────────────────────────
@pytest.fixture(scope="session")
def school_setup(backend_server):
    """
    Creates one institution + admin account for the whole session.
    Returns a dict with { admin_token, inst_id, inst_slug }.
    Other fixtures may extend this further.
    """
    sa_token = get_token("superadmin@buildroonix.com", "super123")

    r = requests.post(
        f"{API_BASE}/superadmin/institutions",
        json={
            "name": "Pytest School",
            "slug": "pytest-school",
            "type": "school",
            "plan": "basic",
            "adminName": "Pytest Admin",
            "adminEmail": "admin@pytestschool.com",
            "adminPassword": "admin123"
        },
        headers={"Authorization": f"Bearer {sa_token}"}
    )
    assert r.status_code == 201, f"School onboard failed: {r.text}"
    data = r.json()

    admin_token = get_token("admin@pytestschool.com", "admin123")

    return {
        "sa_token":    sa_token,
        "admin_token": admin_token,
        "inst_id":     data["institution"]["id"],
        "inst_slug":   "pytest-school"
    }

# ── Teacher fixture ───────────────────────────────────────────────────────────
@pytest.fixture(scope="session")
def teacher_fixture(school_setup):
    """Creates a teacher in the school, returns teacher_id + token."""
    admin_token = school_setup["admin_token"]
    r = requests.post(
        f"{API_BASE}/admin/users",
        json={
            "role": "teacher",
            "name": "Teacher Ramesh",
            "email": "ramesh@pytestschool.com",
            "phone": "9000000001",
            "subject": "Mathematics"
        },
        headers={"Authorization": f"Bearer {admin_token}"}
    )
    assert r.status_code == 201, f"Teacher creation failed: {r.text}"
    teacher_id = r.json()["id"]
    # default password = email-prefix + "123"
    teacher_token = get_token("ramesh@pytestschool.com", "ramesh123")
    return {"id": teacher_id, "token": teacher_token}

# ── Student fixture ───────────────────────────────────────────────────────────
@pytest.fixture(scope="session")
def student_fixture(school_setup, teacher_fixture):
    """Creates a student and assigns class, returns student_id + token."""
    admin_token = school_setup["admin_token"]

    # Assign class to teacher first
    requests.post(
        f"{API_BASE}/admin/classes",
        json={"className": "Class-X", "section": "A", "classTeacherId": teacher_fixture["id"]},
        headers={"Authorization": f"Bearer {admin_token}"}
    )

    r = requests.post(
        f"{API_BASE}/admin/users",
        json={
            "role": "student",
            "name": "Student Aman",
            "email": "aman@pytestschool.com",
            "phone": "9000000002",
            "class": "Class-X",
            "section": "A",
            "rollNo": "S001",
            "fatherName": "Parent Ramesh"
        },
        headers={"Authorization": f"Bearer {admin_token}"}
    )
    assert r.status_code == 201, f"Student creation failed: {r.text}"
    student_id = r.json()["id"]
    student_token = get_token("aman@pytestschool.com", "aman123")
    return {"id": student_id, "token": student_token}

# ── Parent fixture ────────────────────────────────────────────────────────────
@pytest.fixture(scope="session")
def parent_fixture(school_setup, student_fixture):
    """Creates a parent user linked to student via fatherName, returns token."""
    admin_token = school_setup["admin_token"]
    r = requests.post(
        f"{API_BASE}/admin/users",
        json={
            "role": "parent",
            "name": "Parent Ramesh",
            "email": "parent@pytestschool.com",
            "phone": "9000000003"
        },
        headers={"Authorization": f"Bearer {admin_token}"}
    )
    assert r.status_code == 201, f"Parent creation failed: {r.text}"
    parent_id = r.json()["id"]
    parent_token = get_token("parent@pytestschool.com", "parent123")
    return {"id": parent_id, "token": parent_token}
