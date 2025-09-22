-- CreateEnum
CREATE TYPE "public"."ChatType" AS ENUM ('text', 'image');

-- AlterTable
ALTER TABLE "public"."Chat" ADD COLUMN     "imageUrl" TEXT,
ADD COLUMN     "type" "public"."ChatType" NOT NULL DEFAULT 'text',
ALTER COLUMN "content" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."Conversation" ALTER COLUMN "isArchived" SET DEFAULT false;

-- CreateIndex
CREATE INDEX "Chat_conversationId_createdAt_idx" ON "public"."Chat"("conversationId", "createdAt");

-- CreateIndex
CREATE INDEX "Conversation_userId_lastUpdated_idx" ON "public"."Conversation"("userId", "lastUpdated");
