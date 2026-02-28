# ProspectForge — Project Summary

## Overview

ProspectForge is a local-first AI-driven CRM and landing page generator for web development agencies targeting small service businesses. It automates the prospect-to-outreach workflow: import a batch of prospects → AI crawls their existing sites → generates tailored production-ready landing pages → preview and edit → export standalone Next.js projects → send personalized cold outreach emails. The entire pipeline runs on a developer's local machine at near-zero cost (~$0.015/prospect for Anthropic API; all scraping and image sourcing is free).

## Main Features

1. **Batch Import** — Paste a CSV of prospects (business name, industry, location, URL, etc.) or enter individually. Includes a media library for uploading curated stock images.
2. **AI Generation Pipeline** — 6-stage pipeline: web scraping (Crawlee, free, local) → data condensation → structure decision (AI selects 7–10 from 21 section types) → content generation (industry + location specific) → image sourcing (3-tier: uploads > scraped > Pexels) → color theming (brand-derived or AI palette).
3. **Component Library** — 21 section types (~40 variants) with a common props interface, CSS custom property theming, and 8–10 pre-built palettes. Shared between the admin preview and all exported sites.
4. **Preview & Edit** — Full-width site preview with an edit sidebar: swap variants, reorder/remove sections, switch palettes instantly, edit content in a drawer, regenerate sections or all copy.
5. **Export** — One-click export produces a standalone Next.js project in `/exports/[slug]/`, ready to `npm run dev` or deploy.
6. **Outreach Email** — Three editable cold email templates with variable interpolation. Mock mode (default) logs emails to DB; live mode sends via Resend. Never accidentally sends.
7. **Settings** — Manage API keys, email templates, and email mode (mock/live).

## Key User Flows

1. **Import** → New Batch → Paste CSV → Parse & review → Create Batch
2. **Generate** → Batch detail → Generate All → Watch status progress → Preview/Edit/Export links appear
3. **Edit** → Edit page → Swap variant / palette / content → Regenerate section → Export
4. **Export** → One click → Standalone Next.js project written to `/exports/[slug]/`
5. **Outreach** → Select prospect → Choose template → Preview email → Send (mock or live)

## Key Requirements

- Next.js 16.1.6 + Tailwind CSS 4.2.1 + shadcn/ui for the admin dashboard
- Vercel AI SDK (`ai` + `@ai-sdk/anthropic`) with `generateObject` + Zod schemas — no manual JSON parsing
- Crawlee `CheerioCrawler` in a sidecar Express server (port 3001) for free local scraping
- Drizzle ORM with SQLite (`better-sqlite3`) — repository pattern isolates all DB access for easy Supabase migration later
- All pipeline stages start with a single `npm dev` via `concurrently`
- `EMAIL_MODE=mock` default prevents accidental sends; flip to `live` for Resend
- Vitest unit tests (utilities, pipeline logic, repository, email service, components) + Playwright E2E (batch import, generation, preview, edit, export)
- Minimum 7 sections per generated site; 21 section types available; hero always first, contact/CTA always last
