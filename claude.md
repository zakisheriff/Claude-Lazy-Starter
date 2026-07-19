# claude.md

Guidance for Claude Code when working in this repository. Pairs with `agent.md`;
read both before making changes.

## Application overview

Claude Lazy Starter moves unused Claude usage time out of your sleeping hours and
into your working day. A five hour usage window only starts once you send a
message, so a window that refreshes overnight is wasted if you do not touch it
until midday. The app starts the window for you at refresh time.

Single tenant by design: you connect your own account. The app does not store
anyone else's Claude session, and this build never touches claude.ai; it uses a
simulated automation driver behind a clean interface.

## Architecture information

- Framework: Next.js App Router, TypeScript, Tailwind CSS v4.
- Motion: GSAP with ScrollTrigger for reveals and the mobile menu, Lenis for
  smooth scrolling, Framer Motion for small component transitions.
- Layers:
  - `lib/domain`: pure window, schedule, and decision logic.
  - `lib/store`: `Repository` interface and a file backed store under `.data`.
  - `lib/automation`: `ActivationDriver` interface and the simulated driver,
    plus a shared `runActivation` service.
  - `lib/scheduler`: in process interval started by `instrumentation.ts`.
  - `app/api`: activation, scheduler, connection, settings routes.
  - `lib/seo`: site config and JSON-LD builders.
- UI: reusable primitives in `components/ui`, layout in `components/layout`,
  scroll reveals in `components/motion`, page sections in
  `components/home`, `components/dashboard`, `components/settings`.
- The signature element is `WindowTimeline`, a 24 hour day band reused on the
  landing page and the dashboard.

## Current features

- Home: hero, before and after comparison, ordered how it works, FAQ, closing
  call to action. Every section fills the viewport.
- Dashboard: window status, activation status and reason, next refresh,
  remaining estimate, activation history, daily usage timeline, working and
  sleep schedule, activate now, automatic activation toggle, connect and
  disconnect, expired session prompt.
- Settings: automatic activation, activation behavior, session settings, working
  hours, sleep hours. Saved to the local store.
- SEO, AEO, GEO fully configured.

## Future improvements

- Real Playwright driver, run locally so the session stays on the user's machine.
- Durable job based scheduler.
- Activation and expiry notifications.
- Analytics and longer history.
- Database backed repository.

## Development rules

- Match the claude.ai aesthetic. Warm paper, terracotta accent, Inter only,
  spacious full viewport sections, normal capitalization. No uppercase, no
  dashes or hyphens in user facing text, no emojis, no decorative icons or dots,
  no eyebrow or label headings, no unnecessary cards. Inputs are 16px.
- Server components by default; client components only where required.
- Keep domain logic pure; keep persistence and automation behind their
  interfaces.
- Respect reduced motion everywhere; keep animation subtle.
- After every completed change, update `agent.md` and `claude.md`, then commit
  with a conventional message and no co author or Claude trailer, and push once a
  remote is configured.
