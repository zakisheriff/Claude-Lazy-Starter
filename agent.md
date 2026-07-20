# agent.md

Operating notes for any agent working on Claude Lazy Starter. Read this and
`claude.md` before making changes.

## Application overview

Claude Lazy Starter is a personal productivity tool that stops refreshed Claude
usage windows from going to waste while you sleep. A usage window only begins
once you send a message, so a window that refreshes at 8:00 am but is not used
until noon loses those morning hours. The app starts the window automatically at
refresh time, shifting unused time from sleeping hours into working hours.

It is built hosted shaped and single tenant: you connect your own account. No
other user's session is ever stored.

## Architecture

- Next.js App Router with TypeScript, Tailwind CSS v4, GSAP, Lenis, Framer Motion.
- Server components by default. Client components only where interaction, live
  updates, or animation require them.
- `lib/domain` holds pure logic: window computation, the auto activation
  decision, and schedule math. It is storage and framework agnostic.
- `lib/store` is a persistence boundary. `Repository` is the interface;
  `FileStore` is a file backed implementation under `.data`. Swap it for a
  database without touching the domain or UI.
- `lib/automation` is the automation boundary. `ActivationDriver` is the
  interface. Two implementations: `SimulatedDriver` (default, touches nothing)
  and `PlaywrightDriver` (real, drives claude.ai with a captured session).
  Selected by `LAZY_DRIVER`. Both are interchangeable.
- `lib/scheduler` runs a single in process interval, started from
  `instrumentation.ts`. The rule is simple: the moment a window ends and a fresh
  one is available, it opens it, so a window is always running. Idempotent per
  window. No sleep or working hours are involved.
- API routes under `app/api` orchestrate the store and driver: activation,
  scheduler, connection, settings, and session (the guarded upload of the
  captured Claude login).
- `lib/seo` holds site config and structured data builders.

## Current features

- Landing page explaining the idea with a before and after day timeline.
- Dashboard: live window status, remaining countdown, next refresh, activation
  status and reason, automatic activation toggle, connect and disconnect,
  activate now, daily usage timeline, activation history.
- Settings: intentionally small. Automatic activation on or off, the activation
  message (default "Hi"), and window length. Persisted to the store.
- Real automation path: `PlaywrightDriver`, a one time session capture script
  (`npm run capture-session`), a guarded upload (`npm run upload-session` and
  `POST /api/session` with `ADMIN_TOKEN`), and a Dockerfile plus `render.yaml`
  to deploy on an always on host with a persistent disk.
- Branding: `public/logo.png` drives the app icon, apple icon, favicon, and the
  Open Graph and Twitter share cards (generated into `app/`), and the navbar and
  footer marks.
- Full SEO, AEO, and GEO: metadata, Open Graph, JSON-LD (SoftwareApplication,
  WebSite, Organization, BreadcrumbList, FAQPage), robots, sitemap, semantic
  HTML, accessible controls, reduced motion support.

## Design surface

- One warm background everywhere (the `--panel` colour, matching the footer),
  set on `body`. No near white section backgrounds. Only cards lift above it
  using `--paper-raised`. The navbar shares the same background.
- Every interactive control shows a pointer cursor. Every text input is 16px.

## Future improvements

- Harden the Playwright driver against claude.ai bot detection and selector
  changes (real browser under a virtual display, richer confirmation checks).
- Durable scheduler (a job runner) in place of the in process interval.
- Notifications when a window is opened or a session expires.
- A small in app flow to capture and upload the session, instead of the script.
- Optional database repository (Postgres or SQLite) in place of the file store.

## Development rules

- Design: match the claude.ai feel. Warm paper background, terracotta accent,
  Inter everywhere, generous spacing, full viewport sections. No uppercase text,
  no dashes or hyphens in user facing copy, no emojis, no decorative icons, no
  eyebrow labels, no gratuitous cards. Text inputs are 16px.
- Keep server components the default. Reach for a client component only when
  needed.
- Keep domain logic pure and in `lib/domain`. Keep persistence behind
  `Repository` and automation behind `ActivationDriver`.
- Respect reduced motion in every animation.
- After every completed change, update `agent.md` and `claude.md`, then commit
  with a conventional message (`feat`, `fix`, `style`, `refactor`, `docs`) and
  no co author trailer.
