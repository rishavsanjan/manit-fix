-- CreateEnum
CREATE TYPE "public"."AdminstrativeCommentType" AS ENUM ('internal', 'status', 'public');

-- CreateTable
CREATE TABLE "public"."AdminstrativeComments" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "postId" TEXT NOT NULL,
    "comment" TEXT NOT NULL,
    "type" "public"."AdminstrativeCommentType" NOT NULL,

    CONSTRAINT "AdminstrativeComments_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."AdminstrativeComments" ADD CONSTRAINT "AdminstrativeComments_postId_fkey" FOREIGN KEY ("postId") REFERENCES "public"."Posts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
