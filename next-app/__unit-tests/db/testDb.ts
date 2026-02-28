import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "../../src/db/schema";

const DDL = `
CREATE TABLE IF NOT EXISTS batches (
  id TEXT PRIMARY KEY NOT NULL,
  name TEXT NOT NULL,
  industry TEXT NOT NULL,
  created_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS prospects (
  id TEXT PRIMARY KEY NOT NULL,
  batch_id TEXT NOT NULL,
  slug TEXT NOT NULL,
  business_name TEXT NOT NULL,
  industry TEXT NOT NULL,
  location TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  existing_url TEXT,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  scraped_raw TEXT,
  scraped_branding TEXT,
  extracted_data TEXT,
  condensed_profile TEXT,
  structure TEXT,
  site_content TEXT,
  site_config TEXT,
  custom_palette TEXT,
  outreach_sent_at INTEGER,
  outreach_responded_at INTEGER,
  exported_at INTEGER,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  FOREIGN KEY (batch_id) REFERENCES batches(id)
);

CREATE UNIQUE INDEX IF NOT EXISTS prospects_slug_unique ON prospects (slug);

CREATE TABLE IF NOT EXISTS media (
  id TEXT PRIMARY KEY NOT NULL,
  batch_id TEXT NOT NULL,
  filename TEXT NOT NULL,
  slot TEXT NOT NULL,
  industry TEXT NOT NULL,
  path TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  FOREIGN KEY (batch_id) REFERENCES batches(id)
);

CREATE TABLE IF NOT EXISTS sent_emails (
  id TEXT PRIMARY KEY NOT NULL,
  prospect_id TEXT NOT NULL,
  template_id TEXT NOT NULL,
  to_email TEXT NOT NULL,
  from_email TEXT NOT NULL,
  subject TEXT NOT NULL,
  body_html TEXT NOT NULL,
  body_text TEXT NOT NULL,
  status TEXT NOT NULL,
  provider_id TEXT,
  sent_at INTEGER NOT NULL,
  FOREIGN KEY (prospect_id) REFERENCES prospects(id)
);

CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY NOT NULL,
  value TEXT NOT NULL
);
`;

export function createTestDb() {
  const sqlite = new Database(":memory:");
  sqlite.exec(DDL);
  const db = drizzle(sqlite, { schema });
  return { sqlite, db };
}
