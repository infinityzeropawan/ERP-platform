-- ============================================================
-- BUILDROONIX — MASTER DATABASE SCHEMA
-- Database: buildroonix_master_db
-- Controlled by: Buildroonix Super Admin (you)
-- Purpose: Manages all institutions, subscriptions, billing
-- ============================================================

-- ─────────────────────────────────────────────────────────────
-- TABLE: superadmins
-- The Buildroonix platform owners/operators
-- ─────────────────────────────────────────────────────────────
CREATE TABLE superadmins (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name            VARCHAR(100) NOT NULL,
    email           VARCHAR(150) UNIQUE NOT NULL,
    password_hash   TEXT NOT NULL,
    phone           VARCHAR(20),
    is_active       BOOLEAN DEFAULT TRUE,
    created_at      TIMESTAMP DEFAULT NOW(),
    updated_at      TIMESTAMP DEFAULT NOW()
);

-- ─────────────────────────────────────────────────────────────
-- TABLE: institutions
-- Each row = one school/college using Buildroonix
-- ─────────────────────────────────────────────────────────────
CREATE TABLE institutions (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name                VARCHAR(200) NOT NULL,           -- "Greenwood High School"
    slug                VARCHAR(100) UNIQUE NOT NULL,    -- "greenwood" → greenwood.buildroonix.com
    logo_url            TEXT,
    address             TEXT,
    city                VARCHAR(100),
    state               VARCHAR(100),
    country             VARCHAR(100) DEFAULT 'India',
    pincode             VARCHAR(20),
    phone               VARCHAR(20),
    email               VARCHAR(150),
    website             VARCHAR(200),
    db_name             VARCHAR(100) UNIQUE NOT NULL,    -- "greenwood_db" (tenant DB name)
    db_host             VARCHAR(200),                    -- DB server host for this tenant
    subscription_plan   VARCHAR(50) DEFAULT 'basic',     -- basic | pro | enterprise
    subscription_status VARCHAR(50) DEFAULT 'active',    -- active | expired | suspended | trial
    trial_ends_at       TIMESTAMP,
    subscription_ends_at TIMESTAMP,
    max_students        INT DEFAULT 500,
    max_teachers        INT DEFAULT 50,
    is_active           BOOLEAN DEFAULT TRUE,
    onboarded_at        TIMESTAMP DEFAULT NOW(),
    created_by          UUID REFERENCES superadmins(id),
    created_at          TIMESTAMP DEFAULT NOW(),
    updated_at          TIMESTAMP DEFAULT NOW()
);

-- ─────────────────────────────────────────────────────────────
-- TABLE: subscription_plans
-- Plans offered by Buildroonix to institutions
-- ─────────────────────────────────────────────────────────────
CREATE TABLE subscription_plans (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name            VARCHAR(50) NOT NULL,       -- basic | pro | enterprise
    display_name    VARCHAR(100) NOT NULL,       -- "Basic Plan"
    price_monthly   DECIMAL(10,2) NOT NULL,
    price_yearly    DECIMAL(10,2),
    max_students    INT NOT NULL,
    max_teachers    INT NOT NULL,
    features        JSONB,                       -- {"ai_notes": true, "online_exams": false, ...}
    is_active       BOOLEAN DEFAULT TRUE,
    created_at      TIMESTAMP DEFAULT NOW()
);

-- ─────────────────────────────────────────────────────────────
-- TABLE: billing_invoices
-- Tracks payments from institutions to Buildroonix
-- ─────────────────────────────────────────────────────────────
CREATE TABLE billing_invoices (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institution_id      UUID REFERENCES institutions(id) ON DELETE CASCADE,
    plan_id             UUID REFERENCES subscription_plans(id),
    amount              DECIMAL(10,2) NOT NULL,
    currency            VARCHAR(10) DEFAULT 'INR',
    status              VARCHAR(50) DEFAULT 'pending',  -- pending | paid | failed | refunded
    payment_method      VARCHAR(50),                    -- razorpay | stripe | bank_transfer
    payment_reference   VARCHAR(200),
    invoice_date        DATE NOT NULL,
    due_date            DATE,
    paid_at             TIMESTAMP,
    created_at          TIMESTAMP DEFAULT NOW()
);

-- ─────────────────────────────────────────────────────────────
-- TABLE: platform_activity_log
-- Superadmin audit trail across all institutions
-- ─────────────────────────────────────────────────────────────
CREATE TABLE platform_activity_log (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_id        UUID NOT NULL,
    actor_role      VARCHAR(50) NOT NULL,           -- superadmin
    institution_id  UUID REFERENCES institutions(id),
    action          VARCHAR(200) NOT NULL,           -- "suspended_institution", "updated_plan"
    details         JSONB,
    ip_address      VARCHAR(50),
    created_at      TIMESTAMP DEFAULT NOW()
);

-- ─────────────────────────────────────────────────────────────
-- TABLE: platform_announcements
-- Buildroonix broadcasts to all institutions
-- ─────────────────────────────────────────────────────────────
CREATE TABLE platform_announcements (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title           VARCHAR(200) NOT NULL,
    content         TEXT NOT NULL,
    target          VARCHAR(50) DEFAULT 'all',   -- all | specific_plan | specific_institution
    target_ids      UUID[],                       -- institution IDs if target = specific
    is_published    BOOLEAN DEFAULT FALSE,
    published_at    TIMESTAMP,
    created_by      UUID REFERENCES superadmins(id),
    created_at      TIMESTAMP DEFAULT NOW()
);

-- ─────────────────────────────────────────────────────────────
-- INDEXES — Master DB
-- ─────────────────────────────────────────────────────────────
CREATE INDEX idx_institutions_slug ON institutions(slug);
CREATE INDEX idx_institutions_status ON institutions(subscription_status);
CREATE INDEX idx_billing_institution ON billing_invoices(institution_id);
CREATE INDEX idx_billing_status ON billing_invoices(status);

-- ─────────────────────────────────────────────────────────────
-- NOTE: parent role is stored in tenant DB users table
-- role = 'parent' — same users table, different role value
-- parent_profiles table holds extended parent info
-- student_parent_link table links parent ↔ student
-- ─────────────────────────────────────────────────────────────
