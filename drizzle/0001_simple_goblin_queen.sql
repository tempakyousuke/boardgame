-- Drop the old integer column and add new boolean column
ALTER TABLE "user" DROP COLUMN IF EXISTS "is_admin";
ALTER TABLE "user" ADD COLUMN "is_admin" boolean DEFAULT false NOT NULL;