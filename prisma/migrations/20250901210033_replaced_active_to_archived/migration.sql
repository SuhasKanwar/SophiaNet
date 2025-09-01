/*
  Warnings:

  - You are about to drop the column `isActive` on the `Conversation` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "public"."Conversation_isActive_idx";

-- AlterTable
ALTER TABLE "public"."Conversation" DROP COLUMN "isActive",
ADD COLUMN     "isArchived" BOOLEAN NOT NULL DEFAULT true;

-- CreateIndex
CREATE INDEX "Conversation_isArchived_idx" ON "public"."Conversation"("isArchived");
