-- CreateEnum
CREATE TYPE "notification_channel" AS ENUM ('push', 'email');

-- CreateEnum
CREATE TYPE "notification_delivery_status" AS ENUM ('queued', 'sent', 'failed', 'skipped');

-- CreateEnum
CREATE TYPE "notification_type" AS ENUM ('morning_reminder', 'night_reminder', 'follow_up_nudge', 'pending_task_nudge', 'weekly_reflection', 'monthly_reflection');

-- CreateTable
CREATE TABLE "notification_subscriptions" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "provider_external_id" TEXT NOT NULL,
    "provider_player_id" BOOLEAN NOT NULL DEFAULT true,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "notification_subscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notification_deliveries" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "type" "notification_type" NOT NULL,
    "channel" "notification_channel" NOT NULL,
    "status" "notification_delivery_status" NOT NULL DEFAULT 'queued',
    "provider" TEXT,
    "provider_message_id" TEXT,
    "title" TEXT,
    "body" TEXT,
    "payload_json" JSONB,
    "error_message" TEXT,
    "scheduled_for" TIMESTAMP(3),
    "sent_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "notification_deliveries_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "notification_subscriptions_user_id_idx" ON "notification_subscriptions"("user_id");

-- CreateIndex
CREATE INDEX "notification_subscriptions_is_active_idx" ON "notification_subscriptions"("is_active");

-- CreateIndex
CREATE UNIQUE INDEX "notification_subscriptions_provider_provider_external_id_key" ON "notification_subscriptions"("provider", "provider_external_id");

-- CreateIndex
CREATE INDEX "notification_deliveries_user_id_created_at_idx" ON "notification_deliveries"("user_id", "created_at");

-- CreateIndex
CREATE INDEX "notification_deliveries_status_idx" ON "notification_deliveries"("status");

-- CreateIndex
CREATE INDEX "notification_deliveries_type_idx" ON "notification_deliveries"("type");

-- CreateIndex
CREATE INDEX "notification_deliveries_scheduled_for_idx" ON "notification_deliveries"("scheduled_for");

-- AddForeignKey
ALTER TABLE "notification_subscriptions" ADD CONSTRAINT "notification_subscriptions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notification_deliveries" ADD CONSTRAINT "notification_deliveries_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
