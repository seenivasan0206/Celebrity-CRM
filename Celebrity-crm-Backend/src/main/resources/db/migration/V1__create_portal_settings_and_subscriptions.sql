-- =============================================================================
-- Migration: V1__create_portal_settings_and_subscriptions.sql
-- Description: Creates user_settings, crm_subscriptions, and adds agency_id to users
-- Module: Portal Settings & Preferences
-- =============================================================================

-- 1. Create user_settings table
CREATE TABLE IF NOT EXISTS user_settings (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    theme VARCHAR(30) NOT NULL DEFAULT 'DARK_LUXE',
    shoot_schedule_reminders BOOLEAN NOT NULL DEFAULT TRUE,
    contract_milestone_alerts BOOLEAN NOT NULL DEFAULT TRUE,
    campaign_progress_reports BOOLEAN NOT NULL DEFAULT TRUE,
    casting_call_submissions BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_user_settings_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Create crm_subscriptions table
CREATE TABLE IF NOT EXISTS crm_subscriptions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    plan_name VARCHAR(100) NOT NULL DEFAULT 'Zenve VIP Enterprise',
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
    renewal_date DATE NULL,
    description TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_crm_subscriptions_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

