-- ==============================================================================
-- SPORTS CENTER MANAGEMENT SYSTEM - DATABASE SCHEMA (POSTGRESQL)
-- Version: V1
-- Description: Complete initial schema with Users, Packages, Classes,
--              Attendances, Workouts, and Audit Logs.
-- ==============================================================================

-- 1. USERS & ROLES
CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) UNIQUE,
    avatar_url TEXT,
    dob DATE,
    gender VARCHAR(20) CHECK (gender IN ('MALE', 'FEMALE', 'OTHER')),
    role VARCHAR(30) NOT NULL CHECK (role IN ('ADMIN', 'COACH', 'RECEPTIONIST', 'MEMBER')),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_is_active ON users(is_active);

-- 2. PACKAGES & SUBSCRIPTIONS
CREATE TABLE IF NOT EXISTS membership_packages (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    duration_months INT NOT NULL CHECK (duration_months > 0),
    price NUMERIC(12, 2) NOT NULL CHECK (price >= 0),
    max_class_per_week INT DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS member_subscriptions (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    package_id BIGINT NOT NULL REFERENCES membership_packages(id) ON DELETE RESTRICT,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'EXPIRED', 'SUSPENDED', 'CANCELLED')),
    total_amount NUMERIC(12, 2) NOT NULL CHECK (total_amount >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_subscriptions_user ON member_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_package ON member_subscriptions(package_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON member_subscriptions(status);

-- 3. PAYMENTS & TRANSACTIONS
CREATE TABLE IF NOT EXISTS payments (
    id BIGSERIAL PRIMARY KEY,
    subscription_id BIGINT REFERENCES member_subscriptions(id) ON DELETE SET NULL,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    amount NUMERIC(12, 2) NOT NULL CHECK (amount >= 0),
    payment_method VARCHAR(30) NOT NULL CHECK (payment_method IN ('CASH', 'CREDIT_CARD', 'BANK_TRANSFER', 'MOMO', 'VNPAY')),
    status VARCHAR(30) NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'SUCCESS', 'FAILED')),
    transaction_code VARCHAR(100) UNIQUE,
    paid_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_payments_user ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_subscription ON payments(subscription_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);

-- 4. FACILITY ROOMS & SPORT CATEGORIES
CREATE TABLE IF NOT EXISTS facility_rooms (
    id BIGSERIAL PRIMARY KEY,
    room_name VARCHAR(100) NOT NULL,
    capacity INT NOT NULL DEFAULT 20,
    floor INT NOT NULL DEFAULT 1,
    status VARCHAR(30) NOT NULL DEFAULT 'AVAILABLE' CHECK (status IN ('AVAILABLE', 'MAINTENANCE', 'OCCUPIED')),
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS sport_categories (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 5. CLASSES & SCHEDULES
CREATE TABLE IF NOT EXISTS sport_classes (
    id BIGSERIAL PRIMARY KEY,
    category_id BIGINT NOT NULL REFERENCES sport_categories(id) ON DELETE RESTRICT,
    coach_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    max_capacity INT NOT NULL DEFAULT 20,
    level VARCHAR(30) NOT NULL DEFAULT 'BEGINNER' CHECK (level IN ('BEGINNER', 'INTERMEDIATE', 'ADVANCED')),
    status VARCHAR(30) NOT NULL DEFAULT 'OPEN' CHECK (status IN ('OPEN', 'IN_PROGRESS', 'CLOSED')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_sport_classes_category ON sport_classes(category_id);
CREATE INDEX IF NOT EXISTS idx_sport_classes_coach ON sport_classes(coach_id);

CREATE TABLE IF NOT EXISTS class_schedules (
    id BIGSERIAL PRIMARY KEY,
    class_id BIGINT NOT NULL REFERENCES sport_classes(id) ON DELETE CASCADE,
    room_id BIGINT NOT NULL REFERENCES facility_rooms(id) ON DELETE RESTRICT,
    day_of_week INT NOT NULL CHECK (day_of_week BETWEEN 1 AND 7), -- 1: Monday ... 7: Sunday
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_class_schedules_class ON class_schedules(class_id);
CREATE INDEX IF NOT EXISTS idx_class_schedules_room ON class_schedules(room_id);

-- 6. CLASS REGISTRATIONS
CREATE TABLE IF NOT EXISTS class_registrations (
    id BIGSERIAL PRIMARY KEY,
    class_id BIGINT NOT NULL REFERENCES sport_classes(id) ON DELETE CASCADE,
    member_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    registered_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(30) NOT NULL DEFAULT 'ENROLLED' CHECK (status IN ('ENROLLED', 'CANCELLED', 'COMPLETED')),
    CONSTRAINT uq_class_member UNIQUE (class_id, member_id)
);

CREATE INDEX IF NOT EXISTS idx_class_registrations_member ON class_registrations(member_id);
CREATE INDEX IF NOT EXISTS idx_class_registrations_class ON class_registrations(class_id);

-- 7. ATTENDANCES
CREATE TABLE IF NOT EXISTS facility_attendances (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    check_in_time TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    check_out_time TIMESTAMPTZ,
    notes TEXT
);

CREATE INDEX IF NOT EXISTS idx_facility_attendances_user ON facility_attendances(user_id);
CREATE INDEX IF NOT EXISTS idx_facility_attendances_checkin ON facility_attendances(check_in_time);

CREATE TABLE IF NOT EXISTS class_attendances (
    id BIGSERIAL PRIMARY KEY,
    class_id BIGINT NOT NULL REFERENCES sport_classes(id) ON DELETE CASCADE,
    member_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    session_date DATE NOT NULL DEFAULT CURRENT_DATE,
    status VARCHAR(30) NOT NULL DEFAULT 'PRESENT' CHECK (status IN ('PRESENT', 'ABSENT', 'EXCUSED')),
    check_in_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_class_attendances_session ON class_attendances(class_id, session_date);
CREATE INDEX IF NOT EXISTS idx_class_attendances_member ON class_attendances(member_id);

-- 8. WORKOUT PLANS & PROGRESS
CREATE TABLE IF NOT EXISTS workout_plans (
    id BIGSERIAL PRIMARY KEY,
    member_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    coach_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
    title VARCHAR(150) NOT NULL,
    description TEXT,
    start_date DATE NOT NULL,
    end_date DATE,
    status VARCHAR(30) NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'COMPLETED', 'ARCHIVED')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_workout_plans_member ON workout_plans(member_id);
CREATE INDEX IF NOT EXISTS idx_workout_plans_coach ON workout_plans(coach_id);

CREATE TABLE IF NOT EXISTS workout_progress (
    id BIGSERIAL PRIMARY KEY,
    plan_id BIGINT REFERENCES workout_plans(id) ON DELETE CASCADE,
    member_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    recorded_date DATE NOT NULL DEFAULT CURRENT_DATE,
    weight_kg NUMERIC(5, 2),
    height_cm NUMERIC(5, 2),
    body_fat_pct NUMERIC(4, 2),
    muscle_mass_kg NUMERIC(5, 2),
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_workout_progress_member ON workout_progress(member_id);
CREATE INDEX IF NOT EXISTS idx_workout_progress_plan ON workout_progress(plan_id);

-- 9. AUDIT LOGS
CREATE TABLE IF NOT EXISTS audit_logs (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT,
    action VARCHAR(100) NOT NULL,
    resource VARCHAR(100) NOT NULL,
    payload_diff JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at);
