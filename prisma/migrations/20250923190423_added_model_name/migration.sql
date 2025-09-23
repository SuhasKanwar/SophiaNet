-- DropIndex
DROP INDEX "public"."Chat_conversationId_createdAt_idx";

-- DropIndex
DROP INDEX "public"."Conversation_userId_lastUpdated_idx";

-- AlterTable
ALTER TABLE "public"."Chat" ADD COLUMN     "model" TEXT;
