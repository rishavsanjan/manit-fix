-- CreateEnum
CREATE TYPE "public"."CommentReactionType" AS ENUM ('like');

-- AlterTable
ALTER TABLE "public"."Comment" ADD COLUMN     "parentId" TEXT;

-- CreateTable
CREATE TABLE "public"."CommentReactions" (
    "id" TEXT NOT NULL,
    "type" "public"."CommentReactionType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "commentId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "postId" TEXT NOT NULL,

    CONSTRAINT "CommentReactions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CommentReactions_commentId_userId_key" ON "public"."CommentReactions"("commentId", "userId");

-- AddForeignKey
ALTER TABLE "public"."Comment" ADD CONSTRAINT "Comment_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "public"."Comment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CommentReactions" ADD CONSTRAINT "CommentReactions_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "public"."Comment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CommentReactions" ADD CONSTRAINT "CommentReactions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CommentReactions" ADD CONSTRAINT "CommentReactions_postId_fkey" FOREIGN KEY ("postId") REFERENCES "public"."Posts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
