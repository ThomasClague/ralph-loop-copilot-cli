# ProspectForge — Product Requirements Document

## 1. App Overview

ProspectForge is a **local-first AI-driven CRM and landing page generator** for web development agencies and freelancers who pitch website redesigns to small service businesses. It automates the prospect-to-outreach pipeline: import a batch of prospects → AI crawls their existing sites → generates tailored, production-grade landing pages → enable preview/edit → export standalone Next.js projects → send personalized outreach emails.

### Objectives

1. Eliminate manual effort in creating prospect-specific landing page demos
2. Reduce time-to-outreach from days to minutes per prospect
3. Produce professional, industry-specific sites that look bespoke, not templated
4. Enable batch processing of 20–100 prospects per campaign at near-zero cost

### Success Criteria / KPIs

- Full pipeline (scrape → generate → preview-ready) completes in under 60 seconds per prospect
- AI cost per prospect under $0.02 (Anthropic only)
- Exported sites pass `npm run build` without errors
- Zero accidental email sends when `EMAIL_MODE=mock`
- Core pipeline covered by Vitest unit tests + Playwright E2E tests

---

## 2. Target Audience

Web development agencies and freelancers who:
- Pitch website redesigns to small service businesses (roofers, plumbers, electricians, landscapers, etc.)
- Need to demonstrate value **before the sale** with a live preview link
- Process batches of 20–100 cold prospects per outreach campaign
- Work locally on their own machine — no cloud infra required

---

## 3. Core Features

### F1 — Batch Import (TASK-1 scope)

- **Tab A — Paste List:** textarea accepting CSV/TSV/one-per-line input. Columns: `business_name` (required), `industry` (required), `location`, `phone`, `email`, `existing_url`, `notes`. Parse → preview table with duplicate detection.
- **Tab B — Single Entry:** form with toggle "Has existing website?" → URL field.
- **Media Library:** file upload area. Images named `{slot}-{industry}-{descriptor}.{ext}` (e.g. `hero-roofing-tiles.jpg`). Priority over Pexels for image assignment.

### F2 — AI Generation Pipeline (TASK-2 scope)

**Stage 1 — Data Gathering:** Next.js API calls Express scraping API at `http://localhost:3001/api/crawl`. If URL provided: full Crawlee crawl. If no URL: skip scraping.

**Stage 1b — Scraped Data Condensation:**
- Part A (no API call): programmatic extraction from scraped pages → structured object (business name, phones, emails, addresses, service keywords, testimonial paragraphs, headings, image URLs).
- Part B (optional AI): if combined text > ~4,000 tokens, `generateObject` (cheap Sonnet call) compresses to a ~500-token structured business profile.

**Stage 2 — Structure Decision:** `generateObject` with AI SDK. Claude selects and orders 7–10 sections from 21 available types. Rules: hero always first; contact/cta always last; minimum 7, maximum 10. Output: ordered section list + reasoning + tone + palette suggestion. Validated by Zod schema.

**Stage 3 — Content Generation:** `generateObject` with AI SDK. Generates all copy for every selected section. Instructions: specific to area and trade, mention city and surrounding areas, reference actual services/materials/techniques, expand beyond existing site, never generic. Validated by Zod schema.

**Stage 4 — Image Sourcing:** Three-tier priority:
1. Manual uploads (batch media library) — matched by filename convention
2. Scraped images (from crawl) — filtered for quality (skip tiny icons)
3. Pexels API — industry-specific predefined queries per image slot, free, 200 req/hr

**Stage 5 — Variant Assignment:** Deterministic hash of `business_name + industry` → consistent variant per component type.

**Stage 6 — Color Theming:** If branding extracted: derive palette from existing colors (improved contrast, full token set). If no branding: map AI palette suggestion to a pre-defined palette JSON file.

### F3 — Component Library (TASK-3 scope)

**21 section types:** `hero` · `services` · `about` · `trust_indicators` · `testimonials` · `process` · `service_area` · `gallery` · `faq` · `cta_banner` · `contact` · `pricing` · `team` · `certifications` · `emergency` · `benefits` · `comparison` · `brands` · `blog_preview` · `video` · `guarantee`

**~40 total variants** across all types.

**Common interface:** every variant of the same section type accepts the same `content` props (union of all fields any variant needs). Two props per component: `content` (typed per section) and `business` (global: name, phone, email, location). Colors come from CSS custom properties — never as props. Variants are interchangeable.

**Palette system:** 22 CSS custom property tokens per palette. 8–10 pre-built palettes as JSON files in `/config/palettes/`. Extensible: add a JSON file, it appears in the palette picker. Tokens:
```
--color-primary, --color-primary-hover, --color-primary-light, --color-primary-dark
--color-secondary, --color-secondary-hover
--color-accent
--color-background, --color-surface, --color-surface-alt
--color-text-primary, --color-text-secondary, --color-text-inverted
--color-border, --color-border-light
--color-heading, --color-link
--color-success, --color-warning, --color-error
--color-overlay
```

**Section renderer:** shared between admin preview and exported sites. Maps `section.type + section.variant` → React component from a registry.

### F4 — Preview & Edit (TASK-7 scope)

- **Preview:** `/preview/[slug]` — full-width site rendering with no chrome.
- **Edit page:** `/edit/[slug]` — preview + edit sidebar/top bar.
  - Section list with: variant swap dropdowns, regenerate copy button, remove toggle, move up/down arrows.
  - Palette picker (instant switch between all palettes).
  - Regenerate all copy button.
  - Content editor drawer (form for all text fields).
  - Business info editor.
  - Export button.
  - Status dropdown.

### F5 — Export (TASK-8 scope)

1. Copy site template scaffold → `/exports/[slug]/`
2. Write `site.config.json` with all site data
3. Download external images → `/public/images/`
4. Result: runnable with `npm run dev`, deployable to Vercel/Netlify/any host.

### F6 — Outreach Email (TASK-9 scope)

**Architecture:** `EmailService` interface with two implementations:
- `MockEmailService` (default): writes to DB + JSON file, never sends externally
- `ResendEmailService`: live sending via Resend
Controlled by `EMAIL_MODE=mock|live` in `.env.local`.

**Three templates:**

1. **Competitor Research** — "We've been doing competitor analysis for a client in the `{{industry}}` space around `{{location}}`, and `{{business_name}}` came up..."
2. **Portfolio Building** — "We're building out our portfolio in the `{{industry}}` sector. We came across `{{business_name}}`..."
3. **Direct Value** (no-site prospects) — "I noticed `{{business_name}}` doesn't currently have a website..."

Templates stored in settings, editable, with variable reference guide.

### F7 — Settings

- API keys: Anthropic, Pexels, Resend
- Email template management
- Email mode toggle (mock/live)

---

## 4. Key User Flows

### Flow 1: Batch Import
1. Dashboard → "New Batch"
2. Enter batch name + industry
3. Tab A: paste CSV → click "Parse" → review table with duplicate warnings; OR Tab B: fill single-entry form
4. Optionally upload media library images
5. Click "Create Batch" → redirects to batch detail page

### Flow 2: Generation
1. Batch detail page → "Generate All" (bulk) or per-row "Generate"
2. Status indicator per row: `pending → scraping → analyzing → generating → sourcing images → assembling → ready`
3. On `ready`: "Preview" / "Edit" / "Export" links appear per row

### Flow 3: Preview & Edit
1. Click "Preview" → `/preview/[slug]` opens full-width site
2. Click "Edit" → `/edit/[slug]` opens same preview with edit sidebar
3. Swap variants via dropdown → preview updates
4. Reorder/remove sections
5. Pick palette → instant CSS swap
6. Click section content → content drawer opens with form fields
7. Edit fields → save → preview updates
8. Click "Regenerate Section" → AI regenerates copy for that section
9. Click "Regenerate All" → AI regenerates all copy
10. Click "Export" → triggers export pipeline

### Flow 4: Export
1. Click "Export" in edit page or batch table
2. API copies scaffold, injects config, downloads images
3. Status updates to `exported`
4. `/exports/[slug]/` contains runnable standalone Next.js project

### Flow 5: Outreach Email
1. From batch detail, select prospect(s) or open single prospect
2. Choose template (dropdown)
3. Click "Preview Email" → rendered preview with variables interpolated
4. Click "Send" → `MockEmailService` logs to DB (no external send) or `ResendEmailService` sends if `EMAIL_MODE=live`
5. `outreach_sent_at` timestamp recorded on prospect

---

## 5. Technical Stack

| Layer | Technology | Notes |
|-------|-----------|-------|
| Frontend + API | Next.js 16.1.6 | App Router |
| Styling | Tailwind CSS 4.2.1 | |
| UI Components | shadcn/ui | Copied into project, not a dep |
| AI | Vercel AI SDK (`ai` + `@ai-sdk/anthropic`) | `generateObject` + Zod schemas |
| AI Model | `anthropic('claude-sonnet-4-20250514')` | All pipeline calls |
| Scraping | Crawlee (`CheerioCrawler`) | Free, local, no headless browser |
| Sidecar server | Express | Port 3001 — gives Crawlee a proper Node.js env |
| Images | Pexels REST API | Free, 200 req/hr |
| Email | Resend + MockEmailService | Opt-in live sending |
| ORM | Drizzle ORM | `drizzle-orm/sqlite-core` |
| Database | SQLite via better-sqlite3 | File: `./data/prospectforge.db` |
| Testing (unit) | Vitest + React Testing Library | |
| Testing (E2E) | Playwright | |
| Process mgmt | concurrently | Starts Next.js + Express together |
| Runtime | Node.js ≥ 22 | |
| Package manager | npm | |

**Scaffolded project assumption:** The project is already scaffolded with Next.js 16.1.6, Tailwind 4.2.1, Playwright, Vitest, and npm configured. All work described here is built on top of that scaffold.

---

## 6. Conceptual Data Model

### `batches`
| Field | Type | Constraints |
|-------|------|-------------|
| id | text | PK |
| name | text | NOT NULL |
| industry | text | NOT NULL |
| created_at | integer | NOT NULL |

### `prospects`
| Field | Type | Notes |
|-------|------|-------|
| id | text | PK |
| batch_id | text | FK → batches.id |
| slug | text | UNIQUE, url-safe |
| business_name | text | NOT NULL |
| industry | text | NOT NULL |
| location | text | nullable |
| phone | text | nullable |
| email | text | nullable |
| existing_url | text | nullable |
| notes | text | nullable |
| status | text | pending\|scraping\|analyzing\|generating\|sourcing_images\|assembling\|ready\|failed |
| scraped_raw | text | JSON blob |
| scraped_branding | text | JSON blob |
| extracted_data | text | JSON |
| condensed_profile | text | JSON |
| structure | text | JSON |
| site_content | text | JSON |
| site_config | text | JSON |
| custom_palette | text | JSON, nullable |
| outreach_sent_at | integer | nullable |
| outreach_responded_at | integer | nullable |
| exported_at | integer | nullable |
| created_at | integer | NOT NULL |
| updated_at | integer | NOT NULL |

### `media`
| Field | Type | Notes |
|-------|------|-------|
| id | text | PK |
| batch_id | text | FK → batches.id |
| filename | text | NOT NULL |
| slot | text | hero, gallery, about, etc. |
| industry | text | NOT NULL |
| path | text | local file path |
| created_at | integer | NOT NULL |

### `sent_emails`
| Field | Type | Notes |
|-------|------|-------|
| id | text | PK |
| prospect_id | text | FK → prospects.id |
| template_id | text | NOT NULL |
| to_email | text | NOT NULL |
| from_email | text | NOT NULL |
| subject | text | NOT NULL |
| body_html | text | NOT NULL |
| body_text | text | NOT NULL |
| status | text | sent\|failed\|mock |
| provider_id | text | nullable (Resend message ID) |
| sent_at | integer | NOT NULL |

### `settings`
| Field | Type | Notes |
|-------|------|-------|
| key | text | PK |
| value | text | NOT NULL |

**Supabase migration path (v2+):** Create `schema.pg.ts` using `pgTable` equivalents. Swap Drizzle client in `src/db/index.ts` from `better-sqlite3` to `postgres`. Update `drizzle.config.ts` dialect to `postgresql`. Only `schema.ts`, `index.ts`, `repository.ts`, and `drizzle.config.ts` change — rest of app untouched (repository pattern ensures isolation).

---

## 7. API Endpoints

### Next.js API Routes (port 3000)
```
POST   /api/batches                            Create batch
GET    /api/batches                            List batches
POST   /api/prospects                          Create prospect(s)
GET    /api/prospects                          List prospects (filter by batch_id)
GET    /api/prospects/[id]                     Get prospect
PATCH  /api/prospects/[id]                     Update prospect
POST   /api/prospects/[id]/generate            Trigger full generation pipeline
POST   /api/prospects/[id]/regenerate-section  Regenerate single section copy
POST   /api/prospects/[id]/regenerate-all      Regenerate all copy
POST   /api/prospects/[id]/export              Trigger export
POST   /api/email/send                         Send outreach email
GET    /api/email/preview                      Render email preview
GET    /api/settings                           Read settings
PUT    /api/settings                           Write settings
```

### Express Sidecar API (port 3001)
```
POST   /api/crawl    Full site crawl + extraction
GET    /api/health   Health check
```

---

## 8. Project Structure

```
prospectforge/
├── package.json
├── next.config.ts
├── vitest.config.ts
├── playwright.config.ts
├── drizzle.config.ts
├── .env.local                          ← API keys + EMAIL_MODE
├── components.json                     ← shadcn/ui config
├── config/
│   └── palettes/                       ← palette JSON files (extensible)
├── site-template/                      ← exportable Next.js scaffold
│   ├── package.json
│   ├── src/
│   │   ├── app/
│   │   ├── components/                 ← full component library copy
│   │   ├── lib/
│   │   └── types/
│   └── site.config.json
├── src/
│   ├── app/                            ← Next.js admin app
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── batches/
│   │   ├── preview/[slug]/
│   │   ├── edit/[slug]/
│   │   ├── settings/
│   │   └── api/
│   ├── components/
│   │   ├── ui/                         ← shadcn/ui components
│   │   ├── shared/                     ← site section components (shared with site-template)
│   │   └── admin/                      ← admin-only UI components
│   ├── lib/
│   │   ├── ai/
│   │   │   ├── client.ts
│   │   │   ├── generate-structure.ts
│   │   │   ├── generate-content.ts
│   │   │   ├── condense.ts
│   │   │   ├── regenerate-section.ts
│   │   │   └── prompts.ts
│   │   ├── scraping/
│   │   │   ├── client.ts
│   │   │   └── types.ts
│   │   ├── images/
│   │   │   ├── pexels.ts
│   │   │   ├── industry-queries.ts
│   │   │   └── assign.ts
│   │   ├── email/
│   │   │   ├── interface.ts
│   │   │   ├── mock.ts
│   │   │   ├── resend.ts
│   │   │   ├── factory.ts
│   │   │   └── templates.ts
│   │   ├── pipeline.ts
│   │   ├── export.ts
│   │   ├── palettes.ts
│   │   └── component-map.ts
│   ├── scraper/                        ← Express sidecar process
│   │   ├── server.ts
│   │   ├── crawlee-service.ts
│   │   ├── extract.ts
│   │   ├── branding.ts
│   │   └── types.ts
│   ├── db/
│   │   ├── index.ts
│   │   ├── schema.ts
│   │   ├── repository.ts
│   │   └── migrate.ts
│   └── types/
│       └── site.ts
├── __tests__/
│   ├── lib/
│   └── components/
├── e2e/
├── uploads/
├── exports/
└── data/
    └── prospectforge.db
```

---

## 9. Security Considerations

- All API keys stored in `.env.local` — never committed (add to `.gitignore`)
- `EMAIL_MODE=mock` by default — prevents accidental sends
- Crawler enforces same-domain policy — only follows links on input domain
- Max pages cap (default 10) + 30-second timeout on crawler
- Input validation and sanitization on all CSV/form imports
- No user authentication required (local-only tool)

---

## 10. Development Phases / Milestones

| Phase | Work | Est. |
|-------|------|------|
| 1 | Infrastructure: Drizzle + SQLite + repository + Express sidecar + concurrently + shadcn/ui | 1 day |
| 2 | Scraping API: Crawlee, extraction, branding, health endpoint | 2 days |
| 3 | Component library: 21 section types, ~40 variants, theming, palette system | 4–5 days |
| 4 | AI pipeline: AI SDK, Zod schemas, prompts, condensation, structure, content gen | 2 days |
| 5 | Image sourcing: Pexels client, industry queries, media upload, assignment | 1 day |
| 6 | Admin dashboard: batch import, prospect table, status tracking, settings | 2 days |
| 7 | Preview + Edit: preview route, edit sidebar, all edit controls | 2 days |
| 8 | Export engine: template scaffold, config injection, image downloading | 1 day |
| 9 | Email system: interface, mock, Resend, templates, preview | 1 day |
| 10 | Testing: Vitest unit tests + Playwright E2E | 2 days |
| 11 | Polish: error handling, loading states, real prospect testing | 1 day |

---

## 11. Assumptions & Dependencies

- Next.js 16.1.6 project already scaffolded with Tailwind 4.2.1, Playwright, Vitest configured
- Target prospects have old HTML/WordPress/Wix/Squarespace sites — CheerioCrawler is sufficient
- Anthropic API key available (only mandatory paid service ~$0.015/prospect)
- Pexels API key available (free)
- Resend API key optional (only needed for `EMAIL_MODE=live`)
- Node.js ≥ 22 installed locally
- Local machine has sufficient disk space for exports and SQLite DB
- No multi-user or authentication requirements (strictly local tool)

---

## 12. Non-Goals (v2+)

- Cloud deployment of ProspectForge itself
- Supabase / Postgres migration (documented and designed for, but not implemented in v1)
- Multi-user support
- PlaywrightCrawler for JS-heavy sites
- Multi-page exports (separate /about, /services routes)
- Batch scheduling (overnight processing)
- CRM integrations (Google Sheets, HubSpot)
- Google Business Profile scraping for real reviews
- Analytics on response rates
- Custom domain preview hosting
