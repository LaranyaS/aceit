/*
  Warnings:

  - The values [FRONTEND,BACKEND,FULLSTACK,DSA,SYSTEM_DESIGN,DEVOPS,MOBILE] on the enum `InterviewCategory` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "InterviewCategory_new" AS ENUM ('BEHAVIORAL', 'TECHNICAL', 'CASE_STUDY', 'LEADERSHIP', 'SITUATIONAL', 'PANEL', 'GENERAL');
ALTER TABLE "InterviewerProfile" ALTER COLUMN "categories" TYPE "InterviewCategory_new"[] USING ("categories"::text::"InterviewCategory_new"[]);
ALTER TYPE "InterviewCategory" RENAME TO "InterviewCategory_old";
ALTER TYPE "InterviewCategory_new" RENAME TO "InterviewCategory";
DROP TYPE "public"."InterviewCategory_old";
COMMIT;
