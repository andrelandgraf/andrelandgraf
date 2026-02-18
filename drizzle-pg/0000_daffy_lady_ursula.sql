CREATE TABLE IF NOT EXISTS "articles" (
	"slug" text PRIMARY KEY NOT NULL,
	"date" timestamp NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"categories" jsonb NOT NULL,
	"img_url" text,
	"img_alt_text" text,
	"markdown" text NOT NULL,
	"new_version_slug" text
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "articles" ADD CONSTRAINT "articles_new_version_slug_articles_slug_fk" FOREIGN KEY ("new_version_slug") REFERENCES "public"."articles"("slug") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "slug_idx" ON "articles" USING btree ("slug");