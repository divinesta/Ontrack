-- CreateEnum
CREATE TYPE "subscription_tier" AS ENUM ('free', 'paid');

-- CreateEnum
CREATE TYPE "subscription_status" AS ENUM ('active', 'canceled', 'past_due', 'incomplete', 'trialing');

-- CreateEnum
CREATE TYPE "auth_provider" AS ENUM ('google', 'apple');

-- CreateEnum
CREATE TYPE "category_kind" AS ENUM ('system', 'user');

-- CreateEnum
CREATE TYPE "entry_status" AS ENUM ('draft', 'finalized');

-- CreateEnum
CREATE TYPE "entry_input_type" AS ENUM ('text', 'voice', 'text_voice');

-- CreateEnum
CREATE TYPE "task_plan_status" AS ENUM ('draft', 'saving', 'finalized', 'failed');

-- CreateEnum
CREATE TYPE "task_item_status" AS ENUM ('pending', 'done', 'skipped');

-- CreateEnum
CREATE TYPE "task_origin" AS ENUM ('manual', 'ai', 'copied', 'imported');

-- CreateEnum
CREATE TYPE "import_source" AS ENUM ('google_calendar');

-- CreateEnum
CREATE TYPE "imported_event_state" AS ENUM ('active', 'cancelled', 'removed');

-- CreateEnum
CREATE TYPE "reflection_period_type" AS ENUM ('weekly', 'monthly');

-- CreateEnum
CREATE TYPE "reflection_status" AS ENUM ('draft', 'published');

-- CreateEnum
CREATE TYPE "ai_usage_feature" AS ENUM ('auto_categorize', 'entry_refine', 'task_generate', 'task_regenerate', 'reflection_generate', 'reflection_update');

-- CreateEnum
CREATE TYPE "ai_usage_status" AS ENUM ('success', 'failed');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "display_name" TEXT,
    "photo_url" TEXT,
    "timezone" TEXT,
    "subscription_tier" "subscription_tier" NOT NULL DEFAULT 'free',
    "ai_quota_used_month" INTEGER NOT NULL DEFAULT 0,
    "ai_quota_reset_at" TIMESTAMP(3),
    "onboarding_completed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auth_accounts" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "provider" "auth_provider" NOT NULL,
    "provider_account_id" TEXT NOT NULL,
    "email" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "auth_accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subscriptions" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "provider_customer_id" TEXT,
    "provider_subscription_id" TEXT,
    "tier" "subscription_tier" NOT NULL,
    "status" "subscription_status" NOT NULL,
    "current_period_start" TIMESTAMP(3),
    "current_period_end" TIMESTAMP(3),
    "cancel_at_period_end" BOOLEAN NOT NULL DEFAULT false,
    "canceled_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "subscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_settings" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "timezone" TEXT,
    "follow_device_timezone" BOOLEAN NOT NULL DEFAULT true,
    "morning_reminder_time" TEXT,
    "night_reminder_time" TEXT,
    "follow_up_nudge_count" INTEGER NOT NULL DEFAULT 1,
    "quiet_hours_start" TEXT,
    "quiet_hours_end" TEXT,
    "weekly_reflection_enabled" BOOLEAN NOT NULL DEFAULT false,
    "monthly_reflection_enabled" BOOLEAN NOT NULL DEFAULT true,
    "pending_task_reminder_enabled" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "user_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categories" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "kind" "category_kind" NOT NULL DEFAULT 'user',
    "is_hidden" BOOLEAN NOT NULL DEFAULT false,
    "is_default" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "entries" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "category_id" TEXT,
    "entry_date" TIMESTAMP(3) NOT NULL,
    "status" "entry_status" NOT NULL,
    "input_type" "entry_input_type" NOT NULL,
    "source_text" TEXT,
    "raw_transcript" TEXT,
    "refined_text" TEXT,
    "final_text" TEXT,
    "used_ai_refine" BOOLEAN NOT NULL DEFAULT false,
    "ai_request_id" TEXT,
    "is_backdated" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL,
    "ingested_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "entries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "entry_audio" (
    "id" TEXT NOT NULL,
    "entry_id" TEXT NOT NULL,
    "storage_key" TEXT NOT NULL,
    "mime_type" TEXT NOT NULL,
    "duration_seconds" INTEGER,
    "file_size_bytes" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "entry_audio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "task_plans" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "plan_date" TIMESTAMP(3) NOT NULL,
    "tasks_json" JSONB,
    "former_tasks_json" JSONB,
    "status" "task_plan_status" NOT NULL,
    "ai_status" TEXT,
    "ai_request_id" TEXT,
    "last_operation_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL,
    "ingested_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "task_plans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "task_items" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "task_plan_id" TEXT,
    "category_id" TEXT,
    "task_date" TIMESTAMP(3) NOT NULL,
    "title" TEXT NOT NULL,
    "notes" TEXT,
    "status" "task_item_status" NOT NULL DEFAULT 'pending',
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "origin" "task_origin" NOT NULL,
    "starts_at" TIMESTAMP(3),
    "ends_at" TIMESTAMP(3),
    "is_all_day" BOOLEAN NOT NULL DEFAULT true,
    "source_timezone" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL,
    "ingested_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "task_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "calendar_connections" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "provider" "import_source" NOT NULL,
    "provider_account_email" TEXT,
    "access_token" TEXT,
    "refresh_token" TEXT,
    "token_expires_at" TIMESTAMP(3),
    "connected_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "disconnected_at" TIMESTAMP(3),
    "last_synced_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "calendar_connections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "imported_calendar_events" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "calendar_connection_id" TEXT NOT NULL,
    "task_item_id" TEXT NOT NULL,
    "provider" "import_source" NOT NULL,
    "provider_calendar_id" TEXT,
    "provider_event_id" TEXT NOT NULL,
    "provider_recurring_event_id" TEXT,
    "provider_occurrence_start" TIMESTAMP(3),
    "state" "imported_event_state" NOT NULL DEFAULT 'active',
    "raw_payload" JSONB,
    "last_seen_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "imported_calendar_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reflections" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "period_type" "reflection_period_type" NOT NULL,
    "period_start_date" TIMESTAMP(3) NOT NULL,
    "period_end_date" TIMESTAMP(3) NOT NULL,
    "status" "reflection_status" NOT NULL,
    "current_text" TEXT,
    "previous_text" TEXT,
    "stats_json" JSONB,
    "ai_request_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "reflections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reflection_summary_caches" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "period_type" "reflection_period_type" NOT NULL,
    "period_start_date" TIMESTAMP(3) NOT NULL,
    "period_end_date" TIMESTAMP(3) NOT NULL,
    "summary_json" JSONB NOT NULL,
    "refreshed_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "reflection_summary_caches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai_usage_events" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "ai_request_id" TEXT,
    "feature" "ai_usage_feature" NOT NULL,
    "status" "ai_usage_status" NOT NULL,
    "provider" TEXT,
    "model" TEXT,
    "count_toward_quota" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "ai_usage_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admin_model_configs" (
    "id" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "model_name" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT false,
    "config_json" JSONB NOT NULL,
    "rollback_from_config_id" TEXT,
    "created_by_user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "admin_model_configs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "auth_accounts_user_id_idx" ON "auth_accounts"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "auth_accounts_provider_provider_account_id_key" ON "auth_accounts"("provider", "provider_account_id");

-- CreateIndex
CREATE INDEX "subscriptions_user_id_idx" ON "subscriptions"("user_id");

-- CreateIndex
CREATE INDEX "subscriptions_provider_provider_subscription_id_idx" ON "subscriptions"("provider", "provider_subscription_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_settings_user_id_key" ON "user_settings"("user_id");

-- CreateIndex
CREATE INDEX "categories_user_id_idx" ON "categories"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "categories_user_id_slug_key" ON "categories"("user_id", "slug");

-- CreateIndex
CREATE INDEX "entries_user_id_entry_date_idx" ON "entries"("user_id", "entry_date");

-- CreateIndex
CREATE INDEX "entries_category_id_idx" ON "entries"("category_id");

-- CreateIndex
CREATE INDEX "entries_status_idx" ON "entries"("status");

-- CreateIndex
CREATE UNIQUE INDEX "entry_audio_entry_id_key" ON "entry_audio"("entry_id");

-- CreateIndex
CREATE INDEX "task_plans_status_idx" ON "task_plans"("status");

-- CreateIndex
CREATE UNIQUE INDEX "task_plans_user_id_plan_date_key" ON "task_plans"("user_id", "plan_date");

-- CreateIndex
CREATE INDEX "task_items_user_id_task_date_idx" ON "task_items"("user_id", "task_date");

-- CreateIndex
CREATE INDEX "task_items_task_plan_id_idx" ON "task_items"("task_plan_id");

-- CreateIndex
CREATE INDEX "task_items_category_id_idx" ON "task_items"("category_id");

-- CreateIndex
CREATE INDEX "task_items_status_idx" ON "task_items"("status");

-- CreateIndex
CREATE INDEX "task_items_origin_idx" ON "task_items"("origin");

-- CreateIndex
CREATE INDEX "calendar_connections_user_id_idx" ON "calendar_connections"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "imported_calendar_events_task_item_id_key" ON "imported_calendar_events"("task_item_id");

-- CreateIndex
CREATE INDEX "imported_calendar_events_user_id_idx" ON "imported_calendar_events"("user_id");

-- CreateIndex
CREATE INDEX "imported_calendar_events_calendar_connection_id_idx" ON "imported_calendar_events"("calendar_connection_id");

-- CreateIndex
CREATE INDEX "imported_calendar_events_state_idx" ON "imported_calendar_events"("state");

-- CreateIndex
CREATE UNIQUE INDEX "imported_calendar_events_provider_provider_event_id_provide_key" ON "imported_calendar_events"("provider", "provider_event_id", "provider_occurrence_start");

-- CreateIndex
CREATE INDEX "reflections_status_idx" ON "reflections"("status");

-- CreateIndex
CREATE UNIQUE INDEX "reflections_user_id_period_type_period_start_date_period_en_key" ON "reflections"("user_id", "period_type", "period_start_date", "period_end_date");

-- CreateIndex
CREATE UNIQUE INDEX "reflection_summary_caches_user_id_period_type_period_start__key" ON "reflection_summary_caches"("user_id", "period_type", "period_start_date", "period_end_date");

-- CreateIndex
CREATE INDEX "ai_usage_events_user_id_created_at_idx" ON "ai_usage_events"("user_id", "created_at");

-- CreateIndex
CREATE INDEX "ai_usage_events_ai_request_id_idx" ON "ai_usage_events"("ai_request_id");

-- CreateIndex
CREATE INDEX "admin_model_configs_is_active_idx" ON "admin_model_configs"("is_active");

-- CreateIndex
CREATE INDEX "admin_model_configs_created_by_user_id_idx" ON "admin_model_configs"("created_by_user_id");

-- AddForeignKey
ALTER TABLE "auth_accounts" ADD CONSTRAINT "auth_accounts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_settings" ADD CONSTRAINT "user_settings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "categories" ADD CONSTRAINT "categories_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "entries" ADD CONSTRAINT "entries_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "entries" ADD CONSTRAINT "entries_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "entry_audio" ADD CONSTRAINT "entry_audio_entry_id_fkey" FOREIGN KEY ("entry_id") REFERENCES "entries"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task_plans" ADD CONSTRAINT "task_plans_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task_items" ADD CONSTRAINT "task_items_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task_items" ADD CONSTRAINT "task_items_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task_items" ADD CONSTRAINT "task_items_task_plan_id_fkey" FOREIGN KEY ("task_plan_id") REFERENCES "task_plans"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "calendar_connections" ADD CONSTRAINT "calendar_connections_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "imported_calendar_events" ADD CONSTRAINT "imported_calendar_events_calendar_connection_id_fkey" FOREIGN KEY ("calendar_connection_id") REFERENCES "calendar_connections"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "imported_calendar_events" ADD CONSTRAINT "imported_calendar_events_task_item_id_fkey" FOREIGN KEY ("task_item_id") REFERENCES "task_items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "imported_calendar_events" ADD CONSTRAINT "imported_calendar_events_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reflections" ADD CONSTRAINT "reflections_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reflection_summary_caches" ADD CONSTRAINT "reflection_summary_caches_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ai_usage_events" ADD CONSTRAINT "ai_usage_events_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "admin_model_configs" ADD CONSTRAINT "admin_model_configs_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
