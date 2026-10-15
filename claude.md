# claude.md

Guidance for Claude Code when working in this repository. Pairs with `agent.md`;
read both before making changes.

## Application overview

Claude Lazy Starter moves unused Claude usage time out of your sleeping hours
and into your working day. A five hour usage window only starts once you send a
message, so a window that refreshes overnight is wasted if nothing starts it.

The product is `.github/workflows/lazy-start.yml`: every hour it sends a tiny
"Hi" through Claude Code (`claude -p "Hi" --model haiku`) using the
`CLAUDE_CODE_OAUTH_TOKEN` secret from `claude setup-token`. Claude Pro and Max
share one window across claude.ai and Claude Code, so that starts the window
everywhere, even while the laptop sleeps.

The website is a single static landing page. It explains the idea with an
animated film and gives the visitor one prompt to paste into Claude Code, which
creates their private repository, adds the workflow, has them save the token
themselves, and runs it once. There is no backend, dashboard, or settings page.
The source repository is private; the site never links to it.

## Architecture information

- Framework: Next.js App Router, TypeScript, Tailwind CSS v4, one static page.
- Motion: GSAP with ScrollTrigger for reveals and the mobile menu, Framer
  Motion for small transitions, three.js for the film. No Lenis.
- `components/home`: page sections. `SetItUp.tsx` reads the workflow file at
  build time and embeds it in the setup prompt.
- `components/home/film`: `story.ts` (pure script in the film clock),
  `screen.ts` (laptop screen canvas), `WorkflowFilm.tsx` (scene and overlays).
- `components/ui`: `Button`, `CodeBlock`, `WindowTimeline`.
- `lib/seo`: site config and JSON-LD builders.

## Current features

- Hero: horizon artwork with the title baked in, centered numbered contents.
- Film: limit at 11 pm, sleep, the Claude bot sends Hi at 3:07 am (+5 hours),
  sunrise, wake and stretch, work to 90 percent usage, reset to 0 percent at
  8:07 am (+5 hours, celebration). Wide and over the shoulder cameras.
- Timelines, comparison table, hour by hour night, one prompt setup, questions.
- SEO, AEO, GEO fully configured.

## Future improvements

- Live status of the visitor's own workflow runs.
- A recorded clip of the film for sharing.

## Development rules

- Editorial look modeled on the anthropic.com launch articles: ivory paper,
  slate ink, clay accent (`#d97757`), Source Serif 4, Inter, JetBrains Mono.
  Never use Anthropic's logo, licensed fonts, or artwork; the film's Claude bot
  is our own Claude styled model. No dashes or hyphens in user facing text, no
  emojis. Inputs are 16px.
- Server components by default; client components only where required.
- Respect reduced motion everywhere; keep animation subtle outside the film.
- After every completed change, update `agent.md` and `claude.md`, then commit
  with a conventional message and no co author or Claude trailer. Push only
  when the owner approves.
