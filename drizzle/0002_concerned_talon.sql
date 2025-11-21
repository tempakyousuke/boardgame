CREATE TABLE "paths" (
	"id" text PRIMARY KEY NOT NULL,
	"from_square_id" text NOT NULL,
	"to_square_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "squares" (
	"id" text PRIMARY KEY NOT NULL,
	"type" text NOT NULL,
	"name" text,
	"x" integer NOT NULL,
	"y" integer NOT NULL,
	"metadata" text
);
--> statement-breakpoint
ALTER TABLE "paths" ADD CONSTRAINT "paths_from_square_id_squares_id_fk" FOREIGN KEY ("from_square_id") REFERENCES "public"."squares"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "paths" ADD CONSTRAINT "paths_to_square_id_squares_id_fk" FOREIGN KEY ("to_square_id") REFERENCES "public"."squares"("id") ON DELETE no action ON UPDATE no action;