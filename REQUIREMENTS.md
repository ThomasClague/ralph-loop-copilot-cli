# ProspectForge — Technical Specification v5

## AI-Driven Outreach CRM & Site Generator

**Architecture:** Hybrid — Next.js Admin App + Sidecar Express Scraping API + Exportable Standalone Next.js Sites
**Stack:** Next.js 16.1.6 · Tailwind CSS 4.2.1 · shadcn/ui · Vercel AI SDK (`ai` + `@ai-sdk/anthropic`) · Crawlee (free/local scraping) · Pexels API · Resend (with test harness) · Drizzle ORM · SQLite (Supabase-ready) · Vitest + Playwright · pnpm
**Runtime:** Local machine — zero cost for scraping

---

### Tooling Decisions

**Vercel AI SDK** (`ai` + `@ai-sdk/anthropic`): Replaces direct `@anthropic-ai/sdk` usage. Provides a unified interface for LLM calls via `generateText`, `generateObject` (structured JSON output with Zod schemas — eliminates manual JSON parsing/validation), and `streamText`. Switching model providers in future is a one-line change. We use `generateObject` for all pipeline calls (structure decision, content generation, condensation) since we always want typed JSON output. This removes the need for our custom JSON parsing/retry logic — the AI SDK handles schema validation and retries natively.

**shadcn/ui**: Component library for the admin dashboard UI. Pre-built, accessible, Tailwind-styled components (tables, forms, dropdowns, dialogs, sidebars, badges, buttons, etc.). Not a dependency — components are copied into the project and fully customisable. Keeps the admin UI looking professional with minimal effort.

**Vitest**: Unit and integration testing. Officially recommended by Next.js alongside Jest. Faster than Jest, native ESM support, same Vite config, works with React Testing Library for component tests. We use Vitest for: utility functions (extraction, condensation, template interpolation), API route handlers (mocked DB), email service (mock implementation assertions), component rendering (section renderer, component variants).

**Playwright**: End-to-end testing. Officially recommended by Next.js. We use Playwright for: full pipeline flow (import → generate → preview → export), preview rendering (does the generated site actually render correctly), edit flow (swap variant, edit content, regenerate), export validation (does the exported project build successfully).

**pnpm**: Package manager. Faster installs, strict dependency resolution, disk-efficient.

**Database — SQLite now, Supabase later**: Drizzle ORM supports both SQLite and PostgreSQL with the same query API. The migration path:

1. **Now:** Schema defined with `drizzle-orm/sqlite-core` (`sqliteTable`). Local `.db` file. Zero setup.
2. **Later:** Duplicate schema file using `drizzle-orm/pg-core` (`pgTable`). Swap the Drizzle client instantiation from `better-sqlite3` to `postgres` (pointing at Supabase). Run `drizzle-kit push`. Done.

To make this swap painless, we use a **repository pattern**: all database access goes through repository functions (e.g., `getProspect(id)`, `updateProspectStatus(id, status)`, `createBatch(data)`). The rest of the app never imports Drizzle directly — only the repository. When we swap SQLite for Postgres, only the repository + schema + drizzle config change. Everything else stays identical.

**Scaffolded project assumption**: The project will already be scaffolded with Next.js 16.1.6, Tailwind 4.2.1, Playwright, Vitest, and pnpm configured. The spec describes what to build on top of that scaffold.

---

## 1. System Overview

ProspectForge is a local-first application that automates web development outreach for service-based businesses. Paste in a batch of prospects → AI generates tailored, production-grade landing pages → preview, tweak, export → each export is a standalone Next.js project ready to deploy.

**Three processes run locally:**

| Process | Purpose | Port |
|---------|---------|------|
| **Next.js Admin App** | CRM dashboard, preview rendering, editing, export | `3000` |
| **Express Scraping API** | Crawlee-powered site crawling + data extraction | `3001` |
| **Worker** | AI pipeline orchestration (can be merged into Express process) | (internal) |

All three start with a single `pnpm dev` command via `concurrently`.

**Why a sidecar Express app for scraping:**

Crawlee (`crawlee` npm package, by Apify) is the best free open-source Node.js crawling library. It handles link discovery, queue management, retries, rate limiting, and outputs structured JSON. However, it uses full-fat Node.js APIs (filesystem for queue persistence, long-running processes, `got-scraping` HTTP client) that are incompatible with Next.js Edge/Serverless runtime. A separate Express API gives Crawlee a proper Node.js environment while the Next.js app calls it over HTTP on localhost.

---

## 2. Scraping Architecture — Crawlee

### 2.1 Crawlee (Free, Local)

**Package:** `crawlee` (specifically `CheerioCrawler` — no headless browser needed)
**Cost:** $0. Runs entirely on your machine.
**Capability:** Crawls a site following internal links, extracts HTML per page, parses with Cheerio (jQuery for Node.js), returns structured JSON.

**Target market context:** We're targeting service businesses with old (15+ year old), static, poorly built sites — or no site at all. These are WordPress, Wix, Squarespace, hand-coded HTML sites. CheerioCrawler handles all of these with zero issues. If a prospect somehow has a modern JS SPA, they likely don't need our services anyway — skip them.

**How it works in ProspectForge:**

The Express API exposes a single endpoint: `POST /api/crawl`

Input: `{ url: string, maxPages: number }`
Output:
```json
{
  "success": true,
  "pages": [
    {
      "url": "https://smithroofing.co.uk/",
      "title": "Smith Roofing | Austin Roof Repairs",
      "metaDescription": "Professional roofing services...",
      "headings": { "h1": ["Smith Roofing"], "h2": ["Our Services", "About Us", ...] },
      "bodyText": "Full text content of the page...",
      "links": ["https://smithroofing.co.uk/services", ...],
      "images": [{ "src": "https://...", "alt": "Roof repair" }],
      "phones": ["+44 1234 567890"],
      "emails": ["info@smithroofing.co.uk"]
    }
  ],
  "branding": {
    "colors": ["#2563eb", "#ffffff", "#0f172a"],
    "fonts": ["Inter", "Georgia"],
    "logoUrl": "https://smithroofing.co.uk/logo.png"
  }
}
```

The Express scraping API does all the heavy lifting:

1. **Crawlee CheerioCrawler** crawls the site (capped at `maxPages`, default 10)
2. For each page, the `requestHandler` extracts: title, meta description, all headings (h1-h6), full body text (stripped of scripts/styles/nav), all internal links (for further crawling), all image URLs with alt text, phone numbers (regex), email addresses (regex)
3. **Branding extraction** (on the homepage only): parse `<style>` tags and inline styles for color values (hex/rgb regex), extract `<link>` font references and `font-family` CSS declarations, find logo by checking `<img>` tags near `<header>` or with "logo" in src/alt/class
4. Return the combined result as JSON

---

## 3. User Flows

### 3.1 Batch Import Flow

**Entry point:** Dashboard → "New Batch"

**Step 1 — Input**

Two tabs:

**Tab A: Paste List** — Textarea for CSV/TSV/one-per-line. Columns: `business_name` (required), `industry` (required, dropdown), `location`, `phone`, `email`, `existing_url`, `notes`. Parse button → preview table. Duplicate detection.

**Tab B: Single Entry** — Form. Toggle for "Has existing website?" → URL field.

**Media Library (optional):** File upload area on the batch creation page. Upload curated stock images with naming convention `{slot}-{industry}-{descriptor}.{ext}` (e.g., `hero-roofing-tiles.jpg`). These get priority over Pexels for image assignment.

**Step 2 — Queue Review**

Table of prospects. Bulk "Generate All" or per-row "Generate". Progress indicator per row: `pending → scraping → analyzing → generating → sourcing images → assembling → ready`

**Step 3 — Generation complete**

Preview, Edit, Export links appear per prospect.

---

### 3.2 AI Generation Pipeline (per prospect)

#### Stage 1: Data Gathering

Next.js API route calls the Express scraping API at `http://localhost:3001/api/crawl`.

If URL provided: full crawl → returns structured page data + branding.
If no URL: skip scraping, proceed with input fields only.

#### Stage 1b: Scraped Data Condensation

Crawling 10 pages can produce a lot of text. Before passing to the AI:

**Step A: Programmatic extraction (no API call)** — From the scraped pages, extract into a structured object: business name, phones, emails, addresses (UK postcode regex), service keywords (matched against industry-specific dictionaries), testimonial-like paragraphs, headings structure, image URLs.

**Step B: AI condensation (`generateObject`, optional)** — Only if combined text exceeds ~4,000 tokens. A cheap Sonnet call via `generateObject` with a Zod schema compresses all scraped content into a ~500-token structured business profile.

If data is small: skip condensation, pass extracted data directly.

#### Stage 2: Structure Decision (`generateObject`)

**Model:** `anthropic('claude-sonnet-4-20250514')` via AI SDK

AI selects and orders sections from 21 available component types:

`hero` · `services` · `about` · `trust_indicators` · `testimonials` · `process` · `service_area` · `gallery` · `faq` · `cta_banner` · `contact` · `pricing` · `team` · `certifications` · `emergency` · `benefits` · `comparison` · `brands` · `blog_preview` · `video` · `guarantee`

**Enforced rules:** hero always first; contact/cta last; **minimum 7 sections, maximum 10**; be generous — always produce something more substantial than their existing site; be specific to the industry and location.

Output validated by Zod schema: ordered section list + reasoning + tone + palette suggestion.

#### Stage 3: Content Generation (`generateObject`)

**Model:** `anthropic('claude-sonnet-4-20250514')` via AI SDK

Generates all copy for every section. Key instructions: be specific to area and trade; mention the city, surrounding areas; mention actual services, materials, techniques; if scraped data is thin, generate plausible industry-appropriate content; expand beyond what they currently have; never be generic or salesy.

Output validated by Zod schema matching per-section content types.

#### Stage 4: Image Sourcing

Three-tier priority:

1. **Manual uploads** (from batch media library) — matched by filename convention
2. **Scraped images** (from crawl) — filtered for quality (skip tiny icons)
3. **Pexels API** — industry-specific search queries, free, 200 req/hr

Each industry has predefined Pexels queries per image slot (hero, gallery, about, etc.).

#### Stage 5: Variant Assignment

Deterministic hash of `business_name + industry` → consistent variant selection per component type. Same business always gets same layout.

#### Stage 6: Color Theming

If branding data was extracted: derive a palette from their existing colors (improved contrast, full token set).
If no branding: use AI's palette suggestion mapped to a pre-defined palette.

**Palette system:** Each palette is a JSON file in `/config/palettes/`. Full set of CSS custom properties:

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

Ship with 8-10 palettes. Extensible — add a JSON file, it appears in the palette picker. The AI generates properly designed palettes with correct contrast ratios and complementary relationships, so even the full set works harmoniously — each token has a clear purpose.

---

### 3.3 API Cost Summary Per Prospect

| Item | Cost |
|------|------|
| Crawlee scraping | $0 (local) |
| AI condensation (optional) | ~$0.005 |
| AI structure decision | ~$0.003 |
| AI content generation | ~$0.01 |
| Pexels images | $0 (free API) |
| **Total per prospect** | **~$0.013–0.018** |

**Batch of 20:** ~$0.26–0.36 (Anthropic only). Scraping is free.

---

### 3.4 Preview & Edit Flow

**Preview:** `/preview/[slug]` — full-width site rendering.

**Edit controls (top bar/sidebar):**
- Section list with variant swap dropdowns, regenerate copy button, remove toggle, move up/down arrows
- Palette picker (instant switch between all palettes)
- Regenerate all copy
- Edit content (drawer with form for all text fields)
- Business info editor
- Export button
- Status dropdown

---

### 3.5 Export Flow

Always exports as a standalone Next.js project:

1. Copy site template scaffold → `/exports/[slug]/`
2. Write `site.config.json` with all data
3. Download external images to `/public/images/`
4. Result: runnable with `pnpm dev`, deployable anywhere

---

### 3.6 Outreach & Email Flow

**Architecture:** `EmailService` interface with `MockEmailService` (default) and `ResendEmailService` (opt-in). Controlled by `EMAIL_MODE=mock|live` env var. Mock writes to DB + JSON file, never sends. Fully unit-testable.

**Three email template approaches:**

**Template 1: "Competitor Research"**
> We've been doing competitor analysis for a client in the {{industry}} space around {{location}}, and {{business_name}} came up. We put together a concept of what a refreshed site could look like... [preview link]. A strong website typically generates 30-40% more enquiries. Happy to chat if interested.

**Template 2: "Portfolio Building"**
> We're building out our portfolio in the {{industry}} sector. We came across {{business_name}} while researching businesses in {{location}} and thought you'd be a great fit. Here's a concept... [preview link]. Competitive rates as we're keen to add more {{industry}} projects.

**Template 3: "Direct Value" (for no-site prospects)**
> I noticed {{business_name}} doesn't currently have a website. Most homeowners in {{location}} search online before calling a {{industry_noun}}. We put together a concept... [preview link]. Could have it live within a week or two.

Templates are stored in settings, editable, with variable reference guide.

---

## 4. Component Library

### 4.1 Common Interface Principle

Every variant of the same section type accepts the **same `content` props type**. This makes variants interchangeable — swap `hero-centered` to `hero-split`, same data works.

Two props per component:
1. `content` — typed per section type (e.g., `HeroContent`). The type is the **union of all fields any variant needs**. Some variants ignore fields they don't use. Optional fields typed as `?`.
2. `business` — global business info (name, phone, email, location).

Colors come from CSS custom properties, never as props. Palette changes are instant and global.

### 4.2 Component Variants

21 section types, ~40 total variants. Full list in v2 spec (Section 4.2) — unchanged. Key additions from the expanded set: `pricing`, `team`, `certifications`, `emergency`, `benefits`, `comparison`, `brands`, `blog_preview`, `video`, `guarantee`.

### 4.3 Section Renderer

Shared between admin preview and exported sites. Maps `section.type + section.variant` → React component from a registry. Iterates visible sections, renders each with content + business props.

---

## 5. Database Schema

SQLite via Drizzle ORM. File: `./data/prospectforge.db`. Schema uses `sqliteTable` from `drizzle-orm/sqlite-core`.

**Supabase migration path:** Schema defined in `src/db/schema.ts` using `sqliteTable`. To migrate: create `schema.pg.ts` using `pgTable` equivalents, swap the Drizzle client in `src/db/index.ts` from `better-sqlite3` to `postgres`, update `drizzle.config.ts` dialect to `postgresql`. The **repository** (`src/db/repository.ts`) is the only file that imports from `schema.ts` and `index.ts` — the rest of the app calls repository functions only.

**`batches`** — id, name, industry, created_at

**`prospects`** — id, batch_id, slug, business_name, industry, location, phone, email, existing_url, notes, status, scraped_raw (JSON blob), scraped_branding (JSON blob), extracted_data (JSON), condensed_profile (JSON), structure (JSON), site_content (JSON), site_config (JSON), custom_palette (JSON, nullable), outreach_sent_at, outreach_responded_at, exported_at, created_at, updated_at

**`media`** — id, batch_id, filename, slot, industry, path, created_at

**`sent_emails`** — id, prospect_id, template_id, to_email, from_email, subject, body_html, body_text, status, provider_id, sent_at

**`settings`** — key, value

Scraped data stored as JSON blobs because it's semi-structured and variable per site. Condensation step produces a normalized `condensed_profile` that's consistent.

**Schema constraints for portability:** Use only types that map cleanly to both SQLite and Postgres: `text`, `integer`, `real`. Avoid SQLite-specific features. JSON blobs stored as `text` (both SQLite and Postgres handle JSON-as-text fine; Postgres has native `jsonb` but `text` works for the swap).

---

## 6. Express Scraping API Detail

### 6.1 Routes

```
POST /api/crawl         → Full site crawl + extraction
  Body: { url: string, maxPages?: number }
  Response: normalized crawl result JSON

GET  /api/health        → Health check
```

### 6.2 Implementation

The Express app is a small, focused service. It imports Crawlee's `CheerioCrawler`, runs a crawl, collects results, and returns them.

**Key implementation details:**

- **Same-domain enforcement:** Only follow links on the same domain as the input URL. Prevents crawling off to Facebook, Google, etc.
- **Max pages cap:** Default 10, configurable. Prevents runaway crawls on large sites.
- **Timeout:** 30-second overall timeout. If the crawl takes longer, return whatever pages have been collected so far.
- **Rate limiting:** Crawlee has built-in rate limiting. We set `maxRequestsPerCrawl: 10` and `maxConcurrency: 3`.
- **User-Agent:** Set to a realistic browser UA string.
- **Branding extraction:** On the homepage response specifically, run regex patterns over the raw HTML (before Cheerio strips styles) to extract color hex codes from CSS, font-family declarations, and logo candidates.

### 6.3 Startup

```json
// package.json scripts
{
  "dev": "concurrently \"next dev\" \"tsx src/scraper/server.ts\"",
  "build": "next build",
  "start": "concurrently \"next start\" \"tsx src/scraper/server.ts\"",
  "test": "vitest",
  "test:e2e": "playwright test"
}
```

The scraper server lives in `src/scraper/` within the same repo — no separate package.json needed. It just can't run inside the Next.js process.

---

## 7. Project Structure

```
prospectforge/
├── package.json                    ← pnpm
├── pnpm-lock.yaml
├── next.config.ts
├── vitest.config.ts
├── playwright.config.ts
├── drizzle.config.ts
├── .env.local                      ← API keys + EMAIL_MODE
├── components.json                 ← shadcn/ui config
├── config/
│   └── palettes/                   ← palette JSON files (extensible)
├── site-template/                  ← exportable Next.js scaffold
│   ├── package.json
│   ├── src/
│   │   ├── app/
│   │   ├── components/             ← full component library
│   │   ├── lib/
│   │   └── types/
│   └── site.config.json
├── src/
│   ├── app/                        ← Next.js admin UI + API routes
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── batches/
│   │   ├── preview/
│   │   ├── edit/
│   │   ├── settings/
│   │   └── api/
│   ├── components/
│   │   ├── ui/                     ← shadcn/ui components
│   │   ├── shared/                 ← site component library (shared with site-template)
│   │   └── admin/                  ← admin-only UI
│   ├── lib/
│   │   ├── ai/
│   │   │   ├── client.ts           ← AI SDK anthropic provider init
│   │   │   ├── generate-structure.ts ← generateObject with Zod schema
│   │   │   ├── generate-content.ts   ← generateObject with Zod schema
│   │   │   ├── condense.ts           ← generateObject for condensation
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
│   ├── scraper/                    ← Express sidecar process
│   │   ├── server.ts
│   │   ├── crawlee-service.ts
│   │   ├── extract.ts
│   │   ├── branding.ts
│   │   └── types.ts
│   ├── db/
│   │   ├── index.ts                ← Drizzle client (SQLite now, Postgres later)
│   │   ├── schema.ts               ← sqliteTable defs (swap to pgTable for Supabase)
│   │   ├── repository.ts           ← ALL db access goes through here
│   │   └── migrate.ts
│   └── types/
│       └── site.ts
├── __tests__/                      ← Vitest unit/integration tests
│   ├── lib/
│   │   ├── ai/
│   │   ├── email/
│   │   └── pipeline.test.ts
│   └── components/
├── e2e/                            ← Playwright E2E tests
│   ├── batch-flow.spec.ts
│   ├── preview.spec.ts
│   └── export.spec.ts
├── uploads/
├── exports/
└── data/
    └── prospectforge.db
```

---

## 8. Admin App Routes

```
/                           → Dashboard
/batches                    → Batch list
/batches/new                → New batch (import + media upload)
/batches/[id]               → Batch detail (prospect table)
/preview/[slug]             → Full-width site preview
/edit/[slug]                → Preview + edit controls
/settings                   → Settings
/api/prospects              → CRUD
/api/batches                → CRUD
/api/prospects/[id]/generate         → Trigger generation
/api/prospects/[id]/regenerate-section → Regen single section
/api/prospects/[id]/regenerate-all   → Regen all copy
/api/prospects/[id]/export           → Trigger export
/api/email/send             → Send outreach (via EmailService)
/api/email/preview          → Preview rendered email
/api/settings               → Read/write settings
```

---

## 9. External Services

| Service | Package | Cost | Required? |
|---------|---------|------|-----------|
| **Anthropic Claude** (via AI SDK) | `ai` + `@ai-sdk/anthropic` | ~$0.015/prospect | Yes |
| **Crawlee** | `crawlee` | $0 (local) | Yes |
| **Pexels** | REST API | $0 | Yes |
| **Resend** | `resend` | Free tier: 100/day | No — only in live email mode |

**Only mandatory cost:** Anthropic API (~$0.015/prospect). Everything else is free.

---

## 10. Key Design Decisions

| Decision | Rationale |
|----------|-----------|
| **Vercel AI SDK** | Unified interface, `generateObject` with Zod schemas eliminates manual JSON parsing. Provider-swappable. Handles retries and validation. |
| **shadcn/ui for admin** | Copy-paste components, not a dependency. Professional data tables, forms, dialogs out of the box. Fully customisable. Tailwind-native. |
| **Vitest for unit/integration** | Officially recommended by Next.js. Fast, native ESM, works with React Testing Library. Covers: utilities, API routes, email service, component rendering. |
| **Playwright for E2E** | Officially recommended by Next.js. Covers: full pipeline flow, preview rendering, edit flow, export validation. |
| **pnpm** | Faster installs, strict deps, disk-efficient. |
| **Repository pattern for DB** | All DB access through `repository.ts`. When swapping SQLite → Supabase Postgres, only `schema.ts`, `index.ts`, `repository.ts`, and `drizzle.config.ts` change. Rest of app untouched. |
| **Crawlee for scraping** | Free, local, no recurring cost. CheerioCrawler handles plain HTML sites perfectly — which is what our target market uses. Old WordPress, Wix, Squarespace, hand-coded HTML. If someone has a modern SPA, they don't need us. |
| **Sidecar Express API** | Crawlee needs full Node.js. Next.js routes may be Edge/Serverless. Express gives Crawlee a proper runtime while keeping the architecture simple — same repo, one `pnpm dev` command. |
| **Branding extraction in Express** | Parse raw HTML for CSS colors/fonts before Cheerio strips style tags. Simple regex approach — free and sufficient for extracting the dominant palette from old sites. |
| **Full palette token set** | A real site needs hover states, surfaces, borders, etc. AI generates the complete set based on a primary color, ensuring harmony. Each token has a clear purpose — this is what makes the exported sites look professional, not like a template. |
| **Palettes as JSON files** | Drop-in extensible. No code changes to add palettes. |
| **Common component interface** | All variants of a type accept same props. Swap variants via config, not code. |
| **Minimum 7 sections** | Always produce something more comprehensive than their existing site. |
| **Email test harness** | Never accidentally send. Fully unit-testable. Toggle to live with env var. |
| **Always export as Next.js** | Consistent deliverable. The export IS the production site. |

---

## 11. Testing Strategy

### Vitest — Unit & Integration

Tests live in `__tests__/` at project root. Run with `pnpm test`.

**What we test:**
- **Utility functions:** branding regex extraction, template variable interpolation, slug generation, palette token generation, industry query mapping
- **AI pipeline logic:** mock the AI SDK calls, test that prompts are assembled correctly, test Zod schema validation catches malformed responses
- **Repository functions:** use an in-memory SQLite DB, test CRUD operations, test status transitions
- **Email service:** mock implementation captures all calls, test template rendering, test variable substitution
- **Component rendering:** React Testing Library, test that section renderer picks correct variant, test that components render with given props

**What we don't unit test** (covered by E2E instead): async server components, actual AI responses, actual scraping results.

### Playwright — End-to-End

Tests live in `e2e/`. Run with `pnpm test:e2e`.

**What we test:**
- **Batch import flow:** upload CSV → prospects appear in table with "pending" status
- **Generation flow:** click generate → status updates through pipeline → preview renders
- **Preview rendering:** generated site renders all sections, images load, links work
- **Edit flow:** swap variant → preview updates; edit content → preview updates; regenerate section → new content appears
- **Export:** click export → zip downloads → contains valid Next.js project structure

---

## 12. Implementation Order

| Phase | Work | Est. |
|-------|------|------|
| **1** | Scaffold additions: Drizzle + SQLite + repository + Express sidecar + concurrently + shadcn/ui init | 1 day |
| **2** | Express scraping API: Crawlee integration, data extraction, branding extraction, health endpoint | 2 days |
| **3** | Component library: all variants with common interfaces, theming, palette system | 4-5 days |
| **4** | AI pipeline: AI SDK + Anthropic, Zod schemas, prompts, condensation, structure, content generation | 2 days |
| **5** | Image sourcing: Pexels client, industry query maps, media upload, assignment logic | 1 day |
| **6** | Admin dashboard (shadcn/ui): batch import, prospect table, settings, status tracking | 2 days |
| **7** | Preview + Edit: preview route, edit sidebar, variant swapping, content editing, regen | 2 days |
| **8** | Export engine: template scaffold, config injection, image downloading | 1 day |
| **9** | Email system: interface, mock, Resend, templates, preview | 1 day |
| **10** | Testing: Vitest unit tests for core logic + Playwright E2E for key flows | 2 days |
| **11** | Polish: error handling, loading states, testing with real prospects | 1 day |
| **Total** | | **~19-21 days** |

---

## 13. Future (v2+)

- **Supabase migration** — swap schema to `pgTable`, point Drizzle at Supabase Postgres, deploy. Repository pattern means zero app-level changes.
- Live email sending (switch `EMAIL_MODE=live`)
- Custom domain preview hosting (Cloudflare Tunnel / ngrok)
- Google Business Profile scraping for real reviews
- PlaywrightCrawler mode in Express API for JS-heavy sites (free but heavier)
- Image optimization at export (sharp/squoosh)
- Multi-page exports (separate /about, /services routes)
- Batch scheduling (overnight processing)
- CRM integrations (Google Sheets, HubSpot)
- Analytics on response rates by template/industry/region

## Docs

@docs/crawlee