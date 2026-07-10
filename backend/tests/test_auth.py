"""
test_auth.py — Tests for Authentication APIs

Endpoints covered:
  POST /auth/register   — Student self-registration (isApproved=false)
  POST /auth/login      — Login with credential validation + approval gate

Run standalone:
    pytest -v tests/test_auth.py
"""
import requests
import pytest
from conftest import API_BASE, db_connect

# ─────────────────────────────────────────────────────────────────────────────
# POST /auth/register
# ─────────────────────────────────────────────────────────────────────────────

class TestAuthRegister:
    """POST /auth/register — Student self-registration"""

    REG_EMAIL = "selfstudent@pytestschool.com"
    DUP_EMAIL = "dupstudent@pytestschool.com"

    @classmethod
    def teardown_class(cls):
        """Wipe all test users created during this class after ALL tests finish."""
        conn = db_connect()
        cur = conn.cursor()
        cur.execute("DELETE FROM \"User\" WHERE email IN (%s, %s)",
                    (cls.REG_EMAIL, cls.DUP_EMAIL))
        conn.commit()
        cur.close()
        conn.close()

    def test_register_success(self, school_setup):
        """Valid registration returns 201 with pending message."""
        r = requests.post(f"{API_BASE}/auth/register", json={
            "name":            "New Self Student",
            "email":           self.REG_EMAIL,
            "password":        "pass1234",
            "institutionSlug": school_setup["inst_slug"],
            "fatherName":      "Self Father",
            "class":           "Class-IX"
        })
        assert r.status_code == 201
        assert "Pending admin approval" in r.json()["message"]

        # ── DB verify: isApproved must be false ──
        conn = db_connect()
        cur = conn.cursor()
        cur.execute('SELECT "isApproved", role FROM "User" WHERE email=%s', (self.REG_EMAIL,))
        row = cur.fetchone()
        assert row is not None
        assert row[0] is False
        assert row[1] == "student"
        cur.close()
        conn.close()

    def test_register_invalid_slug(self):
        """Unknown institution slug → 404."""
        r = requests.post(f"{API_BASE}/auth/register", json={
            "name": "Ghost", "email": "ghost@x.com",
            "password": "pass", "institutionSlug": "no-such-school"
        })
        assert r.status_code == 404

    def test_register_missing_fields(self, school_setup):
        """Missing required fields → 400 validation error."""
        r = requests.post(f"{API_BASE}/auth/register", json={
            "email": "incomplete@pytestschool.com",
            "institutionSlug": school_setup["inst_slug"]
        })
        assert r.status_code == 400
        assert r.json()["error"] == "ValidationError"

    def test_register_duplicate_email(self, school_setup):
        """Duplicate email → 400 EmailTaken (registers fresh user then tries again)."""
        # Step 1: Register DUP_EMAIL for the first time
        r1 = requests.post(f"{API_BASE}/auth/register", json={
            "name": "Dup User", "email": self.DUP_EMAIL,
            "password": "pass", "institutionSlug": school_setup["inst_slug"]
        })
        assert r1.status_code == 201

        # Step 2: Try to register the exact same email again
        r2 = requests.post(f"{API_BASE}/auth/register", json={
            "name": "Dup User Again", "email": self.DUP_EMAIL,
            "password": "pass2", "institutionSlug": school_setup["inst_slug"]
        })
        assert r2.status_code == 400
        assert r2.json()["error"] == "EmailTaken"


# ─────────────────────────────────────────────────────────────────────────────
# POST /auth/login
# ─────────────────────────────────────────────────────────────────────────────

class TestAuthLogin:
    """POST /auth/login — Login logic + approval gate"""

    def test_superadmin_login_success(self):
        """Superadmin login returns 200 with token."""
        r = requests.post(f"{API_BASE}/auth/login",
                          json={"email": "superadmin@buildroonix.com", "password": "super123"})
        assert r.status_code == 200
        data = r.json()
        assert "token" in data
        assert data["user"]["role"] == "superadmin"

    def test_login_wrong_password(self):
        """Wrong password → 401 InvalidCredentials."""
        r = requests.post(f"{API_BASE}/auth/login",
                          json={"email": "superadmin@buildroonix.com", "password": "wrongpass"})
        assert r.status_code == 401
        assert r.json()["error"] == "InvalidCredentials"

    def test_login_unknown_email(self):
        """Unknown email → 401 InvalidCredentials."""
        r = requests.post(f"{API_BASE}/auth/login",
                          json={"email": "nobody@nowhere.com", "password": "pass"})
        assert r.status_code == 401

    def test_login_missing_fields(self):
        """Missing email/password → 400 ValidationError."""
        r = requests.post(f"{API_BASE}/auth/login", json={"email": "a@b.com"})
        assert r.status_code == 400
        assert r.json()["error"] == "ValidationError"

    def test_login_blocked_before_approval(self, school_setup):
        """Unapproved student gets 403 PendingApproval."""
        # Register a fresh unapproved student
        requests.post(f"{API_BASE}/auth/register", json={
            "name": "Blocked User", "email": "blocked@pytestschool.com",
            "password": "pass123", "institutionSlug": school_setup["inst_slug"]
        })
        r = requests.post(f"{API_BASE}/auth/login",
                          json={"email": "blocked@pytestschool.com", "password": "pass123"})
        assert r.status_code == 403
        assert r.json()["error"] == "PendingApproval"

        # Cleanup
        conn = db_connect()
        cur = conn.cursor()
        cur.execute("DELETE FROM \"User\" WHERE email='blocked@pytestschool.com'")
        conn.commit()
        cur.close()
        conn.close()

    def test_login_success_after_approval(self, school_setup):
        """Student can login after admin approves the account."""
        # Register
        requests.post(f"{API_BASE}/auth/register", json={
            "name": "Approved User", "email": "approved@pytestschool.com",
            "password": "pass123", "institutionSlug": school_setup["inst_slug"]
        })
        # Manually approve in DB
        conn = db_connect()
        cur = conn.cursor()
        cur.execute("UPDATE \"User\" SET \"isApproved\"=true WHERE email='approved@pytestschool.com'")
        conn.commit()
        cur.close()
        conn.close()

        r = requests.post(f"{API_BASE}/auth/login",
                          json={"email": "approved@pytestschool.com", "password": "pass123"})
        assert r.status_code == 200
        assert "token" in r.json()

        # Cleanup
        conn = db_connect()
        cur = conn.cursor()
        cur.execute("DELETE FROM \"User\" WHERE email='approved@pytestschool.com'")
        conn.commit()
        cur.close()
        conn.close()
