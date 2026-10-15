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
  interface. Three implementations, selected by `LAZY_DRIVER`:
  `SimulatedDriver` (default, touches nothing), `ClaudeCodeDriver`
  (recommended real driver, sends through `claude -p`, which shares the five
  hour window with claude.ai on Pro and Max), and `PlaywrightDriver` (legacy,
  drives the claude.ai page with a captured session). All are interchangeable.
- `.github/workflows/lazy-start.yml` is the zero server path: an hourly GitHub
  Actions job that sends "Hi" on Haiku with `CLAUDE_CODE_OAUTH_TOKEN` (from
  `claude setup-token`), so a window starts within an hour of the last one
  ending, even while the user's computer sleeps.
- `lib/scheduler` runs a single in process interval, started from
  `instrumentation.ts`. The rule is simple: the moment a window ends and a fresh
  one is available, it opens it, so a window is always running. Idempotent per
  window. No sleep or working hours are involved.
- API routes under `app/api` orchestrate the store and driver: activation,
  scheduler, connection, settings, and session (the guarded upload of the
  captured Claude login).
- `lib/seo` holds site config and structured data builders.

## Current features

- Landing page as a long form article: horizon hero, introduction, how it
  works with an animated three.js workflow film (`components/home/film`),
  before and after timelines, a comparison table, the five setup steps, and
  questions.
- Setup without the source repo: the repository is private, so the site never
  links to it. Visitors create their own private repository and paste the
  workflow, which the page reads from `.github/workflows/lazy-start.yml` at
  build time and shows with a copy button.
- Dashboard: live window status, remaining countdown, next refresh, activation
  status and reason, automatic activation toggle, connect and disconnect,
  activate now, daily usage timeline, activation history.
- Settings: intentionally small. Automatic activation on or off, the activation
  message (default "Hi"), and window length. Persisted to the store.
- Real automation path: `ClaudeCodeDriver` plus the hourly `lazy-start`
  GitHub Actions workflow (recommended).
- Legacy real automation path: `PlaywrightDriver`, a one time session capture script
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

- Ivory `--paper` on `body`. The home hero and the footer are dark
  (`--night`). The navbar is transparent with light text over the hero and
  settles onto translucent ivory once the page scrolls past it.
- Tokens live in `app/globals.css`; `.prose-article` sets the serif reading
  column and `.leader` draws the dotted contents leaders.
- Every interactive control shows a pointer cursor. Every text input is 16px.

## Future improvements

- Let the web app read real window state (for example from Claude Code usage
  output) instead of estimating it from the last activation.
- Retire the Playwright driver once the Claude Code path has proven itself.
- Durable scheduler (a job runner) in place of the in process interval.
- Notifications when a window is opened or a session expires.
- A small in app flow to capture and upload the session, instead of the script.
- Optional database repository (Postgres or SQLite) in place of the file store.

## Development rules

- Design: Editorial look modeled on the anthropic.com
  launch articles: ivory paper (`#faf9f5`), slate ink, clay accent
  (`#d97757`), Source Serif 4 for display and reading text, Inter for interface
  text, JetBrains Mono for code. Dark hero with a glowing horizon, an 800px
  serif reading column, square bordered tables with a clay highlighted column,
  and a dark multi column footer. Never use Anthropic's logo, licensed fonts,
  or artwork; recreate the feel with free fonts and CSS. The only uppercase is
  the small tracked line above the hero title. No dashes or hyphens in user
  facing copy, no emojis. Inputs are 16px.
- Keep server components the default. Reach for a client component only when
  needed.
- Keep domain logic pure and in `lib/domain`. Keep persistence behind
  `Repository` and automation behind `ActivationDriver`.
- Respect reduced motion in every animation.
- After every completed change, update `agent.md` and `claude.md`, then commit
  with a conventional message (`feat`, `fix`, `style`, `refactor`, `docs`) and
  no co author trailer.
