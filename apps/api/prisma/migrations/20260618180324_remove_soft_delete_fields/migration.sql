/*
  Warnings:

  - You are about to drop the column `deleted_at` on the `admin_model_configs` table. All the data in the column will be lost.
  - You are about to drop the column `deleted_at` on the `ai_usage_events` table. All the data in the column will be lost.
  - You are about to drop the column `deleted_at` on the `auth_accounts` table. All the data in the column will be lost.
  - You are about to drop the column `deleted_at` on the `calendar_connections` table. All the data in the column will be lost.
  - You are about to drop the column `deleted_at` on the `categories` table. All the data in the column will be lost.
  - You are about to drop the column `deleted_at` on the `entries` table. All the data in the column will be lost.
  - You are about to drop the column `deleted_at` on the `entry_audio` table. All the data in the column will be lost.
  - You are about to drop the column `deleted_at` on the `imported_calendar_events` table. All the data in the column will be lost.
  - You are about to drop the column `deleted_at` on the `reflection_summary_caches` table. All the data in the column will be lost.
  - You are about to drop the column `deleted_at` on the `reflections` table. All the data in the column will be lost.
  - You are about to drop the column `deleted_at` on the `subscriptions` table. All the data in the column will be lost.
  - You are about to drop the column `deleted_at` on the `task_items` table. All the data in the column will be lost.
  - You are about to drop the column `deleted_at` on the `task_plans` table. All the data in the column will be lost.
  - You are about to drop the column `deleted_at` on the `user_settings` table. All the data in the column will be lost.
  - You are about to drop the column `deleted_at` on the `users` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "tracker_frequency" AS ENUM ('daily', 'weekly', 'monthly', 'custom');

-- CreateEnum
CREATE TYPE "tracker_field_type" AS ENUM ('number', 'currency', 'boolean', 'text', 'rating', 'duration', 'count');

-- CreateEnum
CREATE TYPE "tracker_record_origin" AS ENUM ('manual', 'ai');

-- AlterEnum
ALTER TYPE "ai_usage_feature" ADD VALUE 'tracker_extract';

-- DropForeignKey
ALTER TABLE "ai_usage_events" DROP CONSTRAINT "ai_usage_events_user_id_fkey";

-- DropForeignKey
ALTER TABLE "auth_accounts" DROP CONSTRAINT "auth_accounts_user_id_fkey";

-- DropForeignKey
ALTER TABLE "calendar_connections" DROP CONSTRAINT "calendar_connections_user_id_fkey";

-- DropForeignKey
ALTER TABLE "categories" DROP CONSTRAINT "categories_user_id_fkey";

-- DropForeignKey
ALTER TABLE "entries" DROP CONSTRAINT "entries_user_id_fkey";

-- DropForeignKey
ALTER TABLE "entry_audio" DROP CONSTRAINT "entry_audio_entry_id_fkey";

-- DropForeignKey
ALTER TABLE "imported_calendar_events" DROP CONSTRAINT "imported_calendar_events_calendar_connection_id_fkey";

-- DropForeignKey
ALTER TABLE "imported_calendar_events" DROP CONSTRAINT "imported_calendar_events_task_item_id_fkey";

-- DropForeignKey
ALTER TABLE "imported_calendar_events" DROP CONSTRAINT "imported_calendar_events_user_id_fkey";

-- DropForeignKey
ALTER TABLE "reflection_summary_caches" DROP CONSTRAINT "reflection_summary_caches_user_id_fkey";

-- DropForeignKey
ALTER TABLE "reflections" DROP CONSTRAINT "reflections_user_id_fkey";

-- DropForeignKey
ALTER TABLE "subscriptions" DROP CONSTRAINT "subscriptions_user_id_fkey";

-- DropForeignKey
ALTER TABLE "task_items" DROP CONSTRAINT "task_items_user_id_fkey";

-- DropForeignKey
ALTER TABLE "task_plans" DROP CONSTRAINT "task_plans_user_id_fkey";

-- DropForeignKey
ALTER TABLE "user_settings" DROP CONSTRAINT "user_settings_user_id_fkey";

-- AlterTable
ALTER TABLE "admin_model_configs" DROP COLUMN "deleted_at";

-- AlterTable
ALTER TABLE "ai_usage_events" DROP COLUMN "deleted_at";

-- AlterTable
ALTER TABLE "auth_accounts" DROP COLUMN "deleted_at";

-- AlterTable
ALTER TABLE "calendar_connections" DROP COLUMN "deleted_at";

-- AlterTable
ALTER TABLE "categories" DROP COLUMN "deleted_at";

-- AlterTable
ALTER TABLE "entries" DROP COLUMN "deleted_at";

-- AlterTable
ALTER TABLE "entry_audio" DROP COLUMN "deleted_at";

-- AlterTable
ALTER TABLE "imported_calendar_events" DROP COLUMN "deleted_at";

-- AlterTable
ALTER TABLE "reflection_summary_caches" DROP COLUMN "deleted_at";

-- AlterTable
ALTER TABLE "reflections" DROP COLUMN "deleted_at";

-- AlterTable
ALTER TABLE "subscriptions" DROP COLUMN "deleted_at";

-- AlterTable
ALTER TABLE "task_items" DROP COLUMN "deleted_at";

-- AlterTable
ALTER TABLE "task_plans" DROP COLUMN "deleted_at";

-- AlterTable
ALTER TABLE "user_settings" DROP COLUMN "deleted_at";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "deleted_at";

-- CreateTable
CREATE TABLE "tracker_definitions" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "category_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "frequency" "tracker_frequency" NOT NULL,
    "frequency_config" JSONB,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tracker_definitions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tracker_fields" (
    "id" TEXT NOT NULL,
    "tracker_definition_id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "type" "tracker_field_type" NOT NULL,
    "unit" TEXT,
    "required" BOOLEAN NOT NULL DEFAULT false,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "config_json" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tracker_fields_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tracker_records" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "tracker_definition_id" TEXT NOT NULL,
    "category_id" TEXT NOT NULL,
    "source_entry_id" TEXT,
    "record_date" TIMESTAMP(3) NOT NULL,
    "values" JSONB NOT NULL,
    "note" TEXT,
    "origin" "tracker_record_origin" NOT NULL,
    "ai_request_id" TEXT,
    "confidence" DOUBLE PRECISION,
    "created_at" TIMESTAMP(3) NOT NULL,
    "ingested_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tracker_records_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "tracker_definitions_user_id_idx" ON "tracker_definitions"("user_id");

-- CreateIndex
CREATE INDEX "tracker_definitions_category_id_idx" ON "tracker_definitions"("category_id");

-- CreateIndex
CREATE INDEX "tracker_definitions_frequency_idx" ON "tracker_definitions"("frequency");

-- CreateIndex
CREATE INDEX "tracker_definitions_is_active_idx" ON "tracker_definitions"("is_active");

-- CreateIndex
CREATE UNIQUE INDEX "tracker_definitions_user_id_slug_key" ON "tracker_definitions"("user_id", "slug");

-- CreateIndex
CREATE INDEX "tracker_fields_tracker_definition_id_idx" ON "tracker_fields"("tracker_definition_id");

-- CreateIndex
CREATE INDEX "tracker_fields_type_idx" ON "tracker_fields"("type");

-- CreateIndex
CREATE UNIQUE INDEX "tracker_fields_tracker_definition_id_key_key" ON "tracker_fields"("tracker_definition_id", "key");

-- CreateIndex
CREATE INDEX "tracker_records_user_id_record_date_idx" ON "tracker_records"("user_id", "record_date");

-- CreateIndex
CREATE INDEX "tracker_records_tracker_definition_id_record_date_idx" ON "tracker_records"("tracker_definition_id", "record_date");

-- CreateIndex
CREATE INDEX "tracker_records_category_id_idx" ON "tracker_records"("category_id");

-- CreateIndex
CREATE INDEX "tracker_records_source_entry_id_idx" ON "tracker_records"("source_entry_id");

-- CreateIndex
CREATE INDEX "tracker_records_origin_idx" ON "tracker_records"("origin");

-- CreateIndex
CREATE INDEX "tracker_records_ai_request_id_idx" ON "tracker_records"("ai_request_id");

-- AddForeignKey
ALTER TABLE "auth_accounts" ADD CONSTRAINT "auth_accounts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_settings" ADD CONSTRAINT "user_settings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "categories" ADD CONSTRAINT "categories_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "entries" ADD CONSTRAINT "entries_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "entry_audio" ADD CONSTRAINT "entry_audio_entry_id_fkey" FOREIGN KEY ("entry_id") REFERENCES "entries"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tracker_definitions" ADD CONSTRAINT "tracker_definitions_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tracker_definitions" ADD CONSTRAINT "tracker_definitions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tracker_fields" ADD CONSTRAINT "tracker_fields_tracker_definition_id_fkey" FOREIGN KEY ("tracker_definition_id") REFERENCES "tracker_definitions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tracker_records" ADD CONSTRAINT "tracker_records_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tracker_records" ADD CONSTRAINT "tracker_records_source_entry_id_fkey" FOREIGN KEY ("source_entry_id") REFERENCES "entries"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tracker_records" ADD CONSTRAINT "tracker_records_tracker_definition_id_fkey" FOREIGN KEY ("tracker_definition_id") REFERENCES "tracker_definitions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tracker_records" ADD CONSTRAINT "tracker_records_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task_plans" ADD CONSTRAINT "task_plans_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task_items" ADD CONSTRAINT "task_items_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "calendar_connections" ADD CONSTRAINT "calendar_connections_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "imported_calendar_events" ADD CONSTRAINT "imported_calendar_events_calendar_connection_id_fkey" FOREIGN KEY ("calendar_connection_id") REFERENCES "calendar_connections"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "imported_calendar_events" ADD CONSTRAINT "imported_calendar_events_task_item_id_fkey" FOREIGN KEY ("task_item_id") REFERENCES "task_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "imported_calendar_events" ADD CONSTRAINT "imported_calendar_events_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reflections" ADD CONSTRAINT "reflections_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reflection_summary_caches" ADD CONSTRAINT "reflection_summary_caches_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ai_usage_events" ADD CONSTRAINT "ai_usage_events_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
