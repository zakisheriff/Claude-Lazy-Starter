# agent.md

Operating notes for any agent working on Claude Lazy Starter. Read this and
`claude.md` before making changes.

## Application overview

Claude Lazy Starter stops refreshed Claude usage windows going to waste while
you sleep. A window only begins once you send a message, so the product is one
GitHub Actions workflow that sends a tiny "Hi" through Claude Code every hour.
The website is a single landing page that explains the idea and hands the
visitor one prompt to paste into Claude Code, which sets everything up.

There is no backend, dashboard, or settings page: nobody runs this from the
website. The source repository is private, so the site never links to it.

## Architecture

- `.github/workflows/lazy-start.yml` is the product. Hourly cron, installs
  Claude Code, runs `claude -p "Hi" --model haiku` with the
  `CLAUDE_CODE_OAUTH_TOKEN` secret, treats a still exhausted limit as success.
- Next.js App Router with TypeScript and Tailwind CSS v4, one static page.
- `components/home`: the article sections (`Hero`, `Introduction`,
  `HowItWorks`, `SetItUp`, `Faq`, `Cta`) plus `Article.tsx` primitives and
  `sections.ts` for the hero contents list.
- `components/home/SetItUp.tsx` reads the workflow file at build time and embeds
  it in the setup prompt, so the prompt and the workflow never drift apart.
- `components/home/film`: the workflow film.
  - `story.ts` is the pure script: film clock, captions, wall clock, usage,
    pops, the person's pose curves, the bot's moves, and the camera blend.
  - `screen.ts` draws the laptop screen onto a canvas texture (chat that hits
    the limit, the terminal sending the Hi, the morning session with a usage
    meter that climbs to 90 percent, then the reset).
  - `WorkflowFilm.tsx` builds the three.js scene lazily on the client and
    drives the HTML overlays (clock, hours unlocked, +5 hours pop, caption,
    usage bar, play and scrub controls). Pauses offscreen; under reduced
    motion it starts paused on a still frame.
- `components/ui`: `Button`, `CodeBlock` (copy button, file and wrap modes),
  `WindowTimeline` (the 24 hour band).
- `lib/seo`: site config and JSON-LD builders. `lib/utils`: helpers.

## Current features

- Hero: the atmospheric horizon artwork (`public/hero-horizon.jpg`, which
  carries the title), with a centered numbered contents list below. The h1 is
  kept for search engines and screen readers. Phones get a squarer crop under
  a navy band.
- The film: 11 pm limit, sleep, 3:07 am Claude bot sends Hi (+5 hours), sunrise,
  he wakes and stretches, works up to 90 percent of the window, 8:07 am reset
  to 0 percent (+5 hours, he celebrates). Two cameras: a wide room shot and an
  over the shoulder screen shot, with a separate framing for tall screens.
- Before and after timelines, a comparison table, an hour by hour night.
- Setup: one prompt for Claude Code with a copy button.
- Questions, closing call to action, dark footer.
- Full SEO, AEO, and GEO: metadata, Open Graph, JSON-LD (SoftwareApplication,
  WebSite, Organization, FAQPage, HowTo), robots, sitemap.

## Design surface

- Ivory `--paper` on `body`. The hero and the footer are dark. The navbar shows
  the name only (no logo), transparent over the hero and ivory after it.
- Tokens live in `app/globals.css`; `.prose-article` sets the serif reading
  column. Smooth anchor scrolling is plain CSS; there is no Lenis.

## Future improvements

- Show live status of the visitor's own workflow runs, read from GitHub.
- A short recorded version of the film for social sharing.

## Development rules

- Design: editorial look modeled on the anthropic.com launch articles. Ivory
  paper (`#faf9f5`), slate ink, clay accent (`#d97757`), Source Serif 4 for
  display and reading, Inter for interface, JetBrains Mono for code. Never use
  Anthropic's logo, licensed fonts, or artwork. The Claude bot in the film is
  Claude styled but is our own model, not a copy of the mascot. No dashes or
  hyphens in user facing copy, no emojis. Inputs are 16px.
- Keep server components the default. Reach for a client component only when
  needed.
- Respect reduced motion in every animation.
- After every completed change, update `agent.md` and `claude.md`, then commit
  with a conventional message (`feat`, `fix`, `style`, `refactor`, `docs`) and
  no co author trailer. Only push when the owner says so.
