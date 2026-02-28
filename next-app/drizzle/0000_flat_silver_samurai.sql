CREATE TABLE `batches` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`industry` text NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `media` (
	`id` text PRIMARY KEY NOT NULL,
	`batch_id` text NOT NULL,
	`filename` text NOT NULL,
	`slot` text NOT NULL,
	`industry` text NOT NULL,
	`path` text NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`batch_id`) REFERENCES `batches`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `prospects` (
	`id` text PRIMARY KEY NOT NULL,
	`batch_id` text NOT NULL,
	`slug` text NOT NULL,
	`business_name` text NOT NULL,
	`industry` text NOT NULL,
	`location` text NOT NULL,
	`phone` text,
	`email` text,
	`existing_url` text,
	`notes` text,
	`status` text DEFAULT 'pending' NOT NULL,
	`scraped_raw` text,
	`scraped_branding` text,
	`extracted_data` text,
	`condensed_profile` text,
	`structure` text,
	`site_content` text,
	`site_config` text,
	`custom_palette` text,
	`outreach_sent_at` integer,
	`outreach_responded_at` integer,
	`exported_at` integer,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`batch_id`) REFERENCES `batches`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `prospects_slug_unique` ON `prospects` (`slug`);--> statement-breakpoint
CREATE TABLE `sent_emails` (
	`id` text PRIMARY KEY NOT NULL,
	`prospect_id` text NOT NULL,
	`template_id` text NOT NULL,
	`to_email` text NOT NULL,
	`from_email` text NOT NULL,
	`subject` text NOT NULL,
	`body_html` text NOT NULL,
	`body_text` text NOT NULL,
	`status` text NOT NULL,
	`provider_id` text,
	`sent_at` integer NOT NULL,
	FOREIGN KEY (`prospect_id`) REFERENCES `prospects`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `settings` (
	`key` text PRIMARY KEY NOT NULL,
	`value` text NOT NULL
);
