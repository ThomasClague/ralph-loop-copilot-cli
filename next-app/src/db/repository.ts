import { eq, and } from 'drizzle-orm';
import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import { db } from './index';
import { batches, prospects, media, sentEmails, settings } from './schema';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type Batch = InferSelectModel<typeof batches>;
export type NewBatch = InferInsertModel<typeof batches>;

export type Prospect = InferSelectModel<typeof prospects>;
export type NewProspect = InferInsertModel<typeof prospects>;
export type UpdateProspect = Partial<Omit<NewProspect, 'id' | 'createdAt'>>;

export type Media = InferSelectModel<typeof media>;
export type NewMedia = InferInsertModel<typeof media>;

export type SentEmail = InferSelectModel<typeof sentEmails>;
export type NewSentEmail = InferInsertModel<typeof sentEmails>;

// ---------------------------------------------------------------------------
// Batch CRUD
// ---------------------------------------------------------------------------

export async function createBatch(data: NewBatch): Promise<Batch> {
  const row = { ...data, id: data.id ?? crypto.randomUUID(), createdAt: data.createdAt ?? Date.now() };
  await db.insert(batches).values(row);
  return row as Batch;
}

export async function getBatch(id: string): Promise<Batch | undefined> {
  return db.query.batches.findFirst({ where: eq(batches.id, id) });
}

export async function listBatches(): Promise<Batch[]> {
  return db.select().from(batches);
}

// ---------------------------------------------------------------------------
// Prospect CRUD
// ---------------------------------------------------------------------------

/** Parse JSON blob fields back to objects on the way out. */
function parseProspect(row: Prospect): Prospect {
  return {
    ...row,
    scrapedRaw: row.scrapedRaw ? JSON.parse(row.scrapedRaw as string) as string : row.scrapedRaw,
    scrapedBranding: row.scrapedBranding ? JSON.parse(row.scrapedBranding as string) as string : row.scrapedBranding,
    extractedData: row.extractedData ? JSON.parse(row.extractedData as string) as string : row.extractedData,
    condensedProfile: row.condensedProfile ? JSON.parse(row.condensedProfile as string) as string : row.condensedProfile,
    structure: row.structure ? JSON.parse(row.structure as string) as string : row.structure,
    siteContent: row.siteContent ? JSON.parse(row.siteContent as string) as string : row.siteContent,
    siteConfig: row.siteConfig ? JSON.parse(row.siteConfig as string) as string : row.siteConfig,
    customPalette: row.customPalette ? JSON.parse(row.customPalette as string) as string : row.customPalette,
  };
}

/** Serialize JSON blob fields to strings before insert/update. */
function serializeProspect<T extends Partial<NewProspect>>(data: T): T {
  const jsonFields: (keyof NewProspect)[] = [
    'scrapedRaw', 'scrapedBranding', 'extractedData', 'condensedProfile',
    'structure', 'siteContent', 'siteConfig', 'customPalette',
  ];
  const out = { ...data } as Record<string, unknown>;
  for (const field of jsonFields) {
    if (field in out && out[field] !== null && out[field] !== undefined && typeof out[field] !== 'string') {
      out[field] = JSON.stringify(out[field]);
    }
  }
  return out as T;
}

export async function createProspect(data: NewProspect): Promise<Prospect> {
  const now = Date.now();
  const row = serializeProspect({
    ...data,
    id: data.id ?? crypto.randomUUID(),
    createdAt: data.createdAt ?? now,
    updatedAt: data.updatedAt ?? now,
  });
  await db.insert(prospects).values(row);
  return parseProspect(row as Prospect);
}

export async function createProspects(data: NewProspect[]): Promise<Prospect[]> {
  return Promise.all(data.map(createProspect));
}

export async function getProspect(id: string): Promise<Prospect | undefined> {
  const row = await db.query.prospects.findFirst({ where: eq(prospects.id, id) });
  return row ? parseProspect(row) : undefined;
}

export async function getProspectBySlug(slug: string): Promise<Prospect | undefined> {
  const row = await db.query.prospects.findFirst({ where: eq(prospects.slug, slug) });
  return row ? parseProspect(row) : undefined;
}

export async function listProspects(batchId: string): Promise<Prospect[]> {
  const rows = await db.select().from(prospects).where(eq(prospects.batchId, batchId));
  return rows.map(parseProspect);
}

export async function updateProspect(id: string, data: UpdateProspect): Promise<void> {
  const serialized = serializeProspect({ ...data, updatedAt: Date.now() });
  await db.update(prospects).set(serialized).where(eq(prospects.id, id));
}

export async function updateProspectStatus(id: string, status: string): Promise<void> {
  await db.update(prospects).set({ status, updatedAt: Date.now() }).where(eq(prospects.id, id));
}

// ---------------------------------------------------------------------------
// Media CRUD
// ---------------------------------------------------------------------------

export async function createMedia(data: NewMedia): Promise<Media> {
  const row = { ...data, id: data.id ?? crypto.randomUUID(), createdAt: data.createdAt ?? Date.now() };
  await db.insert(media).values(row);
  return row as Media;
}

export async function listMediaByBatch(batchId: string): Promise<Media[]> {
  return db.select().from(media).where(eq(media.batchId, batchId));
}

export async function getMediaBySlotAndIndustry(
  batchId: string,
  slot: string,
  industry: string,
): Promise<Media[]> {
  return db
    .select()
    .from(media)
    .where(and(eq(media.batchId, batchId), eq(media.slot, slot), eq(media.industry, industry)));
}

// ---------------------------------------------------------------------------
// Sent Email CRUD
// ---------------------------------------------------------------------------

export async function createSentEmail(data: NewSentEmail): Promise<SentEmail> {
  const row = { ...data, id: data.id ?? crypto.randomUUID() };
  await db.insert(sentEmails).values(row);
  return row as SentEmail;
}

export async function listSentEmailsByProspect(prospectId: string): Promise<SentEmail[]> {
  return db.select().from(sentEmails).where(eq(sentEmails.prospectId, prospectId));
}

export interface SentEmailWithProspect extends SentEmail {
  prospectSlug: string;
  businessName: string;
}

export async function listAllSentEmails(): Promise<SentEmailWithProspect[]> {
  const rows = await db
    .select({
      id: sentEmails.id,
      prospectId: sentEmails.prospectId,
      templateId: sentEmails.templateId,
      toEmail: sentEmails.toEmail,
      fromEmail: sentEmails.fromEmail,
      subject: sentEmails.subject,
      bodyHtml: sentEmails.bodyHtml,
      bodyText: sentEmails.bodyText,
      status: sentEmails.status,
      providerId: sentEmails.providerId,
      sentAt: sentEmails.sentAt,
      prospectSlug: prospects.slug,
      businessName: prospects.businessName,
    })
    .from(sentEmails)
    .innerJoin(prospects, eq(sentEmails.prospectId, prospects.id));
  return rows;
}

// ---------------------------------------------------------------------------
// Settings CRUD
// ---------------------------------------------------------------------------

export async function getSetting(key: string): Promise<string | undefined> {
  const row = await db.query.settings.findFirst({ where: eq(settings.key, key) });
  return row?.value;
}

export async function setSetting(key: string, value: string): Promise<void> {
  await db.insert(settings).values({ key, value }).onConflictDoUpdate({ target: settings.key, set: { value } });
}

export async function getAllSettings(): Promise<Record<string, string>> {
  const rows = await db.select().from(settings);
  return Object.fromEntries(rows.map((r) => [r.key, r.value]));
}
