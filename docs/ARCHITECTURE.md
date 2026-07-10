# BUILDROONIX — COMPLETE SYSTEM ARCHITECTURE & DATABASE SCHEMA
# ============================================================
# Author: Buildroonix Platform
# Purpose: Direction document for backend implementation
# Status: Reference only — not connected to any live DB yet
# ============================================================

# ─────────────────────────────────────────────────────────────
# SYSTEM OVERVIEW
# ─────────────────────────────────────────────────────────────
#
#  BUILDROONIX (Super Admin Layer)
#       │
#       ├── Institution A (School/College) ──► Own DB (institution_a_db)
#       │       ├── School Admin (1 or more)
#       │       ├── Teachers (many)
#       │       └── Students (many, under teachers/classes)
#       │
#       ├── Institution B ──────────────────► Own DB (institution_b_db)
#       │       ├── School Admin
#       │       ├── Teachers
#       │       └── Students
#       │
#       └── Institution N ──────────────────► Own DB (institution_n_db)
#
#  MAIN DB (buildroonix_master_db)
#       └── Stores: Institutions, Subscriptions, Billing, Platform Config
#
# ─────────────────────────────────────────────────────────────
# DATABASE STRATEGY
# ─────────────────────────────────────────────────────────────
#
#  - 1 MASTER DATABASE  → Buildroonix controls this
#  - N TENANT DATABASES → One per institution (isolated data)
#  - Connection routing → Based on institution slug/subdomain
#  - Example:
#      greenwood.buildroonix.com → greenwood_db
#      sunrise.buildroonix.com   → sunrise_db
#
# ─────────────────────────────────────────────────────────────
# ROLES HIERARCHY
# ─────────────────────────────────────────────────────────────
#
#  superadmin     → Buildroonix owner (you) — sees ALL institutions
#  school_admin   → Institution owner — sees their institution only
#  teacher        → Sees their own classes, students, assignments
#  student        → Sees their own data only
#
