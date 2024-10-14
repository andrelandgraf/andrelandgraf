CREATE TABLE `articles` (
	`slug` text PRIMARY KEY NOT NULL,
	`date` integer NOT NULL,
	`title` text NOT NULL,
	`description` text NOT NULL,
	`categories` text NOT NULL,
	`img_url` text,
	`img_alt_text` text,
	`markdown` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `slug_idx` ON `articles` (`slug`);