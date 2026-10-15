# claude.md

Guidance for Claude Code when working in this repository. Pairs with `agent.md`;
read both before making changes.

## Application overview

Claude Lazy Starter moves unused Claude usage time out of your sleeping hours and
into your working day. A five hour usage window only starts once you send a
message, so a window that refreshes overnight is wasted if you do not touch it
until midday. The app starts the window for you at refresh time.

Single tenant by design: you connect your own account. The app never stores
anyone else's Claude session. It ships with a simulated driver (default), a
recommended Claude Code driver that sends through `claude -p` (Claude Code
shares the five hour window with claude.ai on Pro and Max), and a legacy
Playwright driver, chosen by `LAZY_DRIVER`. The zero server path is the hourly
GitHub Actions workflow in `.github/workflows/lazy-start.yml`, authenticated by
a `CLAUDE_CODE_OAUTH_TOKEN` secret from `claude setup-token`; it fires even
while the user's laptop sleeps. See README.

Core behaviour is deliberately simple: with automatic activation on, the moment
one window ends a fresh one is started by sending a short message (default "Hi"),
so a window is always running and there is always time waiting when you sit down.
There are no sleep or working hours to configure.

## Architecture information

- Framework: Next.js App Router, TypeScript, Tailwind CSS v4.
- Motion: GSAP with ScrollTrigger for reveals and the mobile menu, Lenis for
  smooth scrolling, Framer Motion for small component transitions.
- Layers:
  - `lib/domain`: pure window, schedule, and decision logic.
  - `lib/store`: `Repository` interface and a file backed store under `.data`.
  - `lib/automation`: `ActivationDriver` interface, the simulated, Claude Code,
    and Playwright drivers, and a shared `runActivation` service.
  - `.github/workflows/lazy-start.yml`: hourly cloud ping through Claude Code.
  - `lib/scheduler`: in process interval started by `instrumentation.ts` that
    starts a fresh window as soon as one is available.
  - `app/api`: activation, scheduler, connection, settings, and the guarded
    session upload routes.
  - `lib/seo`: site config and JSON-LD builders.
- UI: reusable primitives in `components/ui`, layout in `components/layout`,
  scroll reveals in `components/motion`, page sections in
  `components/home`, `components/dashboard`, `components/settings`.
- The signature elements are the workflow film and `WindowTimeline`, a 24
  hour day band reused on the landing page and the dashboard.

## Current features

- Home: a long form article. Dark horizon hero with a numbered contents list,
  introduction, how it works (an animated workflow film, before and after
  timelines, a comparison table, an hour by hour night), set it up (five steps:
  create a private repo, paste the workflow, create a token, save the secret,
  run it once), questions, closing call to action. A section rail on the left
  tracks progress on wide screens.
- The source repository is private, so the site never links to it or asks
  visitors to fork. The setup section reads `.github/workflows/lazy-start.yml`
  at build time and shows it with a copy button; visitors paste it into their
  own private repository. Edit that file and the page follows.
- Workflow film (`components/home/film`): a low poly room built in code with
  three.js, loaded lazily on the client. `story.ts` is the pure script (clock,
  captions, terminal lines, bars); `WorkflowFilm.tsx` renders the scene and
  HTML overlays from one film clock. Pauses offscreen, has play, pause, and a
  scrubber, and starts paused at a still frame under reduced motion.
- Dashboard: window status, activation status and reason, next refresh,
  remaining estimate, activation history, daily usage timeline, activate now,
  automatic activation toggle, connect and disconnect, expired session prompt.
- Settings: automatic activation, the activation message, and window length.
- SEO, AEO, GEO fully configured. Branding driven by `public/logo.png`.

## Future improvements

- Read real window state instead of estimating it from the last activation.
- Retire the Playwright driver once the Claude Code path has proven itself.
- Durable job based scheduler in place of the in process interval.
- Activation and expiry notifications.
- In app session capture and upload, instead of the script.
- Database backed repository.

## Development rules

- Editorial look modeled on the anthropic.com
  launch articles: ivory paper (`#faf9f5`), slate ink, clay accent
  (`#d97757`), Source Serif 4 for display and reading text, Inter for interface
  text, JetBrains Mono for code. Dark hero with a glowing horizon, an 800px
  serif reading column, square bordered tables with a clay highlighted column,
  and a dark multi column footer. Never use Anthropic's logo, licensed fonts,
  or artwork; recreate the feel with free fonts and CSS. The only uppercase is
  the small tracked line above the hero title. No dashes or hyphens in user
  facing copy, no emojis. Inputs are 16px.
- Server components by default; client components only where required.
- Keep domain logic pure; keep persistence and automation behind their
  interfaces.
- Respect reduced motion everywhere; keep animation subtle.
- After every completed change, update `agent.md` and `claude.md`, then commit
  with a conventional message and no co author or Claude trailer, and push once a
  remote is configured.
