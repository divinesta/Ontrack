-- AlterTable
ALTER TABLE "notification_subscriptions" ALTER COLUMN "provider_player_id" DROP NOT NULL,
ALTER COLUMN "provider_player_id" DROP DEFAULT,
ALTER COLUMN "provider_player_id" SET DATA TYPE TEXT;
