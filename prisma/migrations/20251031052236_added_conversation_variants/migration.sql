-- CreateEnum
CREATE TYPE "public"."ConversationVariant" AS ENUM ('chat', 'notes_tool', 'youtube_tool', 'diagram_tool', 'image_filter_tool');

-- AlterTable
ALTER TABLE "public"."Conversation" ADD COLUMN     "variant" "public"."ConversationVariant" NOT NULL DEFAULT 'chat';
