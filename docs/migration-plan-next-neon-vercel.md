# Remix/Fly/SQLite -> Next.js/Vercel/Neon Migration Plan

## Goals

- Rebuild the site on Next.js (App Router) while preserving current behavior and styling.
- Move data storage from local SQLite volume (`/data/main.db`) to Neon Serverless Postgres.
- Move hosting/runtime from Fly.io + custom Express server to Vercel.
- Keep and continue using `openimg` for image optimization (`/img` endpoint + `openimg/react` usage).
- Perform a low-risk cutover with rollback capability.

## Current State (What Exists Today)

- Framework/runtime: Remix v2 + React Router on Express (`server/index.ts`), built via Vite.
- Hosting: Fly.io (`fly.toml`) with mounted volume (`/data`) for SQLite file persistence.
- Database: Drizzle ORM + `better-sqlite3` + local file DB (`DATABASE_URL` points to `data/main.db`).
- Content model: Markdown files in `contents/articles/*.md`, transformed with Markdoc + stored in `articles` table.
- Dynamic endpoints:
  - `/blog`, `/blog/:slug`
  - `/blog/rss`
  - `/blog/:slug.png` (satori + resvg OG image)
  - `/img` (openimg optimization/proxy endpoint)
  - `/qr.png`, `/demos/qr`
  - `/robots.txt`, `/sitemap.xml`
- Integrations: Sentry, PostHog, openimg.

## Target Architecture

- Framework/runtime: Next.js (App Router), Node.js runtime for server routes requiring native/node libs.
- Hosting: Vercel project deployment.
- Database: Neon Serverless Postgres + Drizzle (`drizzle-orm/neon-http` and `@neondatabase/serverless`).
- Content ingest: Continue reading Markdown from `contents/articles`, seed/upsert into Postgres.
- Images:
  - Keep `openimg/react` components in UI.
  - Keep `openimg/node` route handler in Next route (`/img`).
- Routing parity:
  - Home `/`
  - Blog index `/blog` (+ `?tag=` filtering)
  - Blog article `/blog/[slug]`
  - RSS `/blog/rss`
  - OG image route `/blog/[slug].png`
  - QR endpoints and sitemap/robots.

## Phase 1: Rebuild Site in Next.js

### 1. Bootstrap Next.js in-place

- Add Next.js deps and scripts (`next`, `eslint-config-next` optionally later).
- Add Next config and App Router entry files (`app/layout.tsx`, `app/page.tsx`, etc.).
- Keep current `app/components`, `app/modules`, styles, and public assets to reduce rewrite risk.

### 2. Route migration mapping

- Remix root/layout -> Next `app/layout.tsx`.
- Remix homepage route -> Next `app/page.tsx`.
- Remix blog shell/index/article routes -> Next:
  - `app/blog/layout.tsx`
  - `app/blog/page.tsx`
  - `app/blog/[slug]/page.tsx`
- Remix resource routes -> Next route handlers:
  - `app/blog/rss/route.ts`
  - `app/img/route.ts`
  - `app/qr.png/route.ts` (or rewrite to equivalent if needed)
  - OG image handler (`/blog/[slug].png`) via route handler + rewrite if needed.
- `robots.txt`/`sitemap.xml` -> Next metadata routes (`app/robots.ts`, `app/sitemap.ts`) or explicit route handlers.

### 3. Component compatibility work

- Replace Remix-specific link/navigation hooks with Next equivalents:
  - `@remix-run/react` `Link/NavLink/useNavigation/useRouteLoaderData` -> `next/link`, `usePathname`, etc.
- Preserve styling and behavior for existing design.
- Keep client-only components (`Book3DScene`, QR demo form, progress bar) under `"use client"` boundaries.

### 4. Metadata and canonical behavior

- Convert `getMetaTags` usage to Next `generateMetadata`.
- Add middleware for canonical host + trailing-slash redirects (currently in Remix session middleware).

## Phase 2: Service + Dependency Exchange

### 1. Database driver and schema migration

- Replace SQLite driver usage:
  - Remove runtime dependency on `better-sqlite3` in active path.
  - Add `@neondatabase/serverless`.
  - Use `drizzle-orm/neon-http`.
- Convert schema from `sqliteTable` to `pgTable`:
  - `slug` text PK
  - `date` timestamp
  - `categories` jsonb (string array)
  - self-reference for `new_version_slug`
- Update `drizzle.config.ts` to Postgres dialect and schema path.

### 2. Data migration strategy

- Source of truth remains Markdown under `contents/articles`.
- Implement idempotent seed/upsert script:
  - Parse + validate markdown frontmatter.
  - Upsert current articles into Postgres.
  - Optionally delete removed slugs for parity with current behavior.
- Run seed script after provisioning Neon DB and during deploy pipeline when needed.

### 3. Environment and secrets

- Replace old Fly/volume vars:
  - Remove `VOLUME_PATH` requirement.
- Required runtime vars (target):
  - `DATABASE_URL` (Neon pooled connection)
  - `ORIGIN` (production canonical origin)
  - Optional: `SENTRY_DSN`, `POSTHOG_PUBLIC_API_KEY`, Sentry upload vars.
- Use Vercel CLI:
  - `vercel env pull`/`vercel env add`/`vercel env push` depending on workflow.
  - Neon integration to provision and inject env vars.

### 4. Dependency cleanup after parity

- Decommission Remix/Express-specific runtime deps after full migration:
  - `@remix-run/*`, `express`, `morgan`, `compression`, server entrypoints.
- Keep only if temporarily needed during transition branch.

## Phase 3: Redeployment & Cutover Strategy

### 1. Pre-cutover checks

- Local:
  - `npm run dev` and verify:
    - `/`
    - `/blog`
    - `/blog/[slug]`
    - `/img?src=/profile.png&w=300&h=300`
    - `/blog/[slug].png`
    - `/qr.png?data=...`
- DB:
  - Run migrations and seed against Neon dev DB.
  - Validate row counts and spot-check article rendering.

### 2. Vercel provisioning

- Link project: `vercel link`.
- Provision Neon integration from CLI (`vercel integration add neon` / equivalent command path).
- Ensure env vars exist for `preview` and `production`.
- Deploy preview: `vercel`.
- Smoke-test preview with `curl` and browser checks.

### 3. Production cutover

- Deploy production: `vercel deploy --prod`.
- Validate production endpoints and metadata.
- Update DNS from Fly domain target to Vercel if needed.
- Keep Fly app intact for rollback window (24-72h).

### 4. Rollback plan

- If critical issue appears:
  - Switch DNS back to Fly target.
  - Keep Neon data; no destructive rollback needed.
- Keep previous Fly release and DB snapshot until migration stabilizes.

## Execution Order (Implementation in This Repo)

1. Add Next scaffold + migrate core routes/components.
2. Add Neon/Drizzle Postgres modules + seed script.
3. Validate locally (build + runtime endpoint checks).
4. Provision Vercel + Neon integration.
5. Push env vars and deploy preview/prod.
6. Confirm via HTTP/browser checks and document follow-up cleanup.

