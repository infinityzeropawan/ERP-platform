"""
test_superadmin.py — Tests for Superadmin APIs

Endpoints covered:
  POST /superadmin/institutions            — Onboard new institution
  GET  /superadmin/institutions            — List all institutions
  PUT  /superadmin/institutions/:id/status — Change status
  PUT  /superadmin/institutions/:id/modules — Change enabled modules
  PUT  /superadmin/institutions/:id/plan   — Change plan

Run standalone:
    pytest -v tests/test_superadmin.py
"""
import requests
import pytest
from conftest import API_BASE, db_connect

SLUG = "sa-test-school"

@pytest.fixture(scope="module")
def sa_token(backend_server):
    r = requests.post(f"{API_BASE}/auth/login",
                      json={"email": "superadmin@buildroonix.com", "password": "super123"})
    return r.json()["token"]

@pytest.fixture(scope="module")
def inst_id(sa_token):
    """Onboard a test institution, return its id, cleanup after module tests."""
    r = requests.post(
        f"{API_BASE}/superadmin/institutions",
        json={
            "name":          "SA Test School",
            "slug":          SLUG,
            "type":          "school",
            "plan":          "basic",
            "adminName":     "SA Admin",
            "adminEmail":    "saadmin@satest.com",
            "adminPassword": "pass123"
        },
        headers={"Authorization": f"Bearer {sa_token}"}
    )
    assert r.status_code == 201, f"Setup failed: {r.text}"
    inst = r.json()["institution"]["id"]

    yield inst

    # Teardown — remove institution + admin user
    conn = db_connect()
    cur = conn.cursor()
    cur.execute("DELETE FROM \"User\" WHERE \"institutionId\"=%s", (inst,))
    cur.execute("DELETE FROM \"Institution\" WHERE id=%s", (inst,))
    conn.commit()
    cur.close()
    conn.close()


# ─────────────────────────────────────────────────────────────────────────────
# POST /superadmin/institutions
# ─────────────────────────────────────────────────────────────────────────────
class TestOnboardInstitution:

    def test_onboard_returns_201(self, sa_token, inst_id):
        """Fixture already onboarded — verify 201 was received in fixture."""
        assert inst_id is not None

    def test_db_institution_created(self, inst_id):
        """Row exists in Institution table with correct slug."""
        conn = db_connect()
        cur  = conn.cursor()
        cur.execute('SELECT slug, type, plan FROM "Institution" WHERE id=%s', (inst_id,))
        row = cur.fetchone()
        assert row is not None
        assert row[0] == SLUG
        assert row[1] == "school"
        assert row[2] == "basic"
        cur.connection.close()

    def test_db_admin_user_created(self, inst_id):
        """Admin user row created in User table linked to institution."""
        conn = db_connect()
        cur  = conn.cursor()
        cur.execute('SELECT role, "isApproved" FROM "User" WHERE email=%s', ("saadmin@satest.com",))
        row = cur.fetchone()
        assert row is not None
        assert row[0] == "school_admin"
        assert row[1] is True          # admins are pre-approved
        cur.connection.close()

    def test_duplicate_slug_409(self, sa_token, inst_id):
        """Duplicate slug → 409 ConflictError."""
        r = requests.post(
            f"{API_BASE}/superadmin/institutions",
            json={"name": "Dup", "slug": SLUG, "adminEmail": "x@x.com", "adminPassword": "p"},
            headers={"Authorization": f"Bearer {sa_token}"}
        )
        assert r.status_code == 409
        assert r.json()["error"] == "ConflictError"

    def test_missing_fields_400(self, sa_token):
        """Missing slug → 400 ValidationError."""
        r = requests.post(
            f"{API_BASE}/superadmin/institutions",
            json={"name": "No Slug"},
            headers={"Authorization": f"Bearer {sa_token}"}
        )
        assert r.status_code == 400


# ─────────────────────────────────────────────────────────────────────────────
# GET /superadmin/institutions
# ─────────────────────────────────────────────────────────────────────────────
class TestListInstitutions:

    def test_list_returns_200(self, sa_token, inst_id):
        r = requests.get(f"{API_BASE}/superadmin/institutions",
                         headers={"Authorization": f"Bearer {sa_token}"})
        assert r.status_code == 200
        data = r.json()
        assert isinstance(data, list)
        assert len(data) >= 1

    def test_list_contains_created_inst(self, sa_token, inst_id):
        r = requests.get(f"{API_BASE}/superadmin/institutions",
                         headers={"Authorization": f"Bearer {sa_token}"})
        slugs = [i["slug"] for i in r.json()]
        assert SLUG in slugs

    def test_list_requires_auth(self):
        r = requests.get(f"{API_BASE}/superadmin/institutions")
        assert r.status_code in (401, 403)


# ─────────────────────────────────────────────────────────────────────────────
# PUT /superadmin/institutions/:id/status
# ─────────────────────────────────────────────────────────────────────────────
class TestUpdateStatus:

    def test_suspend_institution(self, sa_token, inst_id):
        r = requests.put(
            f"{API_BASE}/superadmin/institutions/{inst_id}/status",
            json={"status": "suspended"},
            headers={"Authorization": f"Bearer {sa_token}"}
        )
        assert r.status_code == 200
        # DB verify
        conn = db_connect(); cur = conn.cursor()
        cur.execute('SELECT status FROM "Institution" WHERE id=%s', (inst_id,))
        assert cur.fetchone()[0] == "suspended"
        cur.connection.close()

    def test_reactivate_institution(self, sa_token, inst_id):
        r = requests.put(
            f"{API_BASE}/superadmin/institutions/{inst_id}/status",
            json={"status": "active"},
            headers={"Authorization": f"Bearer {sa_token}"}
        )
        assert r.status_code == 200
        conn = db_connect(); cur = conn.cursor()
        cur.execute('SELECT status FROM "Institution" WHERE id=%s', (inst_id,))
        assert cur.fetchone()[0] == "active"
        cur.connection.close()

    def test_missing_status_400(self, sa_token, inst_id):
        r = requests.put(
            f"{API_BASE}/superadmin/institutions/{inst_id}/status",
            json={},
            headers={"Authorization": f"Bearer {sa_token}"}
        )
        assert r.status_code == 400


# ─────────────────────────────────────────────────────────────────────────────
# PUT /superadmin/institutions/:id/modules
# ─────────────────────────────────────────────────────────────────────────────
class TestUpdateModules:

    def test_update_modules(self, sa_token, inst_id):
        modules = ["mod_gradebook", "mod_diary", "mod_payroll"]
        r = requests.put(
            f"{API_BASE}/superadmin/institutions/{inst_id}/modules",
            json={"enabledModules": modules},
            headers={"Authorization": f"Bearer {sa_token}"}
        )
        assert r.status_code == 200
        # DB verify
        conn = db_connect(); cur = conn.cursor()
        cur.execute('SELECT "enabledModules" FROM "Institution" WHERE id=%s', (inst_id,))
        db_modules = cur.fetchone()[0]
        cur.connection.close()
        assert "mod_gradebook" in db_modules
        assert "mod_payroll" in db_modules

    def test_invalid_modules_not_array(self, sa_token, inst_id):
        r = requests.put(
            f"{API_BASE}/superadmin/institutions/{inst_id}/modules",
            json={"enabledModules": "not-an-array"},
            headers={"Authorization": f"Bearer {sa_token}"}
        )
        assert r.status_code == 400


# ─────────────────────────────────────────────────────────────────────────────
# PUT /superadmin/institutions/:id/plan
# ─────────────────────────────────────────────────────────────────────────────
class TestUpdatePlan:

    def test_upgrade_to_enterprise(self, sa_token, inst_id):
        r = requests.put(
            f"{API_BASE}/superadmin/institutions/{inst_id}/plan",
            json={"plan": "enterprise"},
            headers={"Authorization": f"Bearer {sa_token}"}
        )
        assert r.status_code == 200
        conn = db_connect(); cur = conn.cursor()
        cur.execute('SELECT plan FROM "Institution" WHERE id=%s', (inst_id,))
        assert cur.fetchone()[0] == "enterprise"
        cur.connection.close()

    def test_downgrade_to_basic(self, sa_token, inst_id):
        r = requests.put(
            f"{API_BASE}/superadmin/institutions/{inst_id}/plan",
            json={"plan": "basic"},
            headers={"Authorization": f"Bearer {sa_token}"}
        )
        assert r.status_code == 200

    def test_missing_plan_400(self, sa_token, inst_id):
        r = requests.put(
            f"{API_BASE}/superadmin/institutions/{inst_id}/plan",
            json={},
            headers={"Authorization": f"Bearer {sa_token}"}
        )
        assert r.status_code == 400
