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
  interface; `SimulatedDriver` is the current implementation. It behaves like a
  real browser session without touching claude.ai and can report expired
  sessions to exercise reconnect handling. A real Playwright driver implements
  the same interface.
- `lib/scheduler` runs a single in process interval, started from
  `instrumentation.ts`, that opens a window during sleep hours when one is
  available. Idempotent per window.
- API routes under `app/api` orchestrate the store and driver: activation,
  scheduler, connection, settings.
- `lib/seo` holds site config and structured data builders.

## Current features

- Landing page explaining the idea with a before and after day timeline.
- Dashboard: live window status, remaining countdown, next refresh, activation
  status and reason, automatic activation toggle, connect and disconnect,
  activate now, daily usage timeline, schedule summary, activation history.
- Settings: automatic activation, activation behavior (message and model),
  session settings (window length, time zone), working hours, sleep hours.
  Persisted to the local store.
- Full SEO, AEO, and GEO: metadata, Open Graph, generated OG image, JSON-LD
  (SoftwareApplication, WebSite, Organization, BreadcrumbList, FAQPage), robots,
  sitemap, semantic HTML, accessible controls, reduced motion support.

## Future improvements

- Real Playwright driver behind `ActivationDriver`, run as a local or self
  hosted agent so the session never leaves the user's machine.
- Durable scheduler (a job runner) in place of the in process interval.
- Notifications when a window is opened or a session expires.
- Multiple day history and usage analytics.
- Optional database repository (Postgres or SQLite).

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
