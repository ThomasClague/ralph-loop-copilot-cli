import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const batches = sqliteTable('batches', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  industry: text('industry').notNull(),
  createdAt: integer('created_at').notNull(),
});

export const prospects = sqliteTable('prospects', {
  id: text('id').primaryKey(),
  batchId: text('batch_id')
    .notNull()
    .references(() => batches.id),
  slug: text('slug').notNull().unique(),
  businessName: text('business_name').notNull(),
  industry: text('industry').notNull(),
  location: text('location').notNull(),
  phone: text('phone'),
  email: text('email'),
  existingUrl: text('existing_url'),
  notes: text('notes'),
  status: text('status').notNull().default('pending'),
  scrapedRaw: text('scraped_raw'),
  scrapedBranding: text('scraped_branding'),
  extractedData: text('extracted_data'),
  condensedProfile: text('condensed_profile'),
  structure: text('structure'),
  siteContent: text('site_content'),
  siteConfig: text('site_config'),
  customPalette: text('custom_palette'),
  outreachSentAt: integer('outreach_sent_at'),
  outreachRespondedAt: integer('outreach_responded_at'),
  exportedAt: integer('exported_at'),
  createdAt: integer('created_at').notNull(),
  updatedAt: integer('updated_at').notNull(),
});

export const media = sqliteTable('media', {
  id: text('id').primaryKey(),
  batchId: text('batch_id')
    .notNull()
    .references(() => batches.id),
  filename: text('filename').notNull(),
  slot: text('slot').notNull(),
  industry: text('industry').notNull(),
  path: text('path').notNull(),
  createdAt: integer('created_at').notNull(),
});

export const sentEmails = sqliteTable('sent_emails', {
  id: text('id').primaryKey(),
  prospectId: text('prospect_id')
    .notNull()
    .references(() => prospects.id),
  templateId: text('template_id').notNull(),
  toEmail: text('to_email').notNull(),
  fromEmail: text('from_email').notNull(),
  subject: text('subject').notNull(),
  bodyHtml: text('body_html').notNull(),
  bodyText: text('body_text').notNull(),
  status: text('status').notNull(),
  providerId: text('provider_id'),
  sentAt: integer('sent_at').notNull(),
});

export const settings = sqliteTable('settings', {
  key: text('key').primaryKey(),
  value: text('value').notNull(),
});
