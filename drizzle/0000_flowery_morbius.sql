-- Add display_name column to existing user table
ALTER TABLE "user" ADD COLUMN "display_name" text;
--> statement-breakpoint
-- Copy username to display_name for existing users
UPDATE "user" SET "display_name" = "username" WHERE "display_name" IS NULL;
--> statement-breakpoint
-- Make display_name NOT NULL after setting default values
ALTER TABLE "user" ALTER COLUMN "display_name" SET NOT NULL;