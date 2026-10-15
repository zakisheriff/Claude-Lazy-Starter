# Claude Lazy Starter

Never lose a refreshed Claude window again. A five hour usage window only starts
once you send a message, so time slips away whenever a window is sitting idle.
Claude Lazy Starter keeps a window always running: the moment one ends, it sends
a short message to start the next. So whenever you sit down, the current window
still has time left and a fresh one is already queued behind it.

## What it does

- Watches your usage window and, the instant it is free, opens a new one by
  sending a short message (a plain "Hi" is all it takes).
- Shows a live dashboard: window status, remaining time, next refresh, and
  activation history.
- Keeps configuration tiny: automatic activation on or off, the message, and the
  window length. No hours to set, nothing to schedule.

## How it is built

- Next.js App Router, TypeScript, Tailwind CSS v4.
- GSAP and ScrollTrigger, Lenis smooth scrolling, Framer Motion.
- Pure domain logic, a swappable storage `Repository`, and a swappable
  automation `ActivationDriver` with two implementations: a simulated driver and
  a real Claude Code driver, and a legacy Playwright driver.

## Run it locally (simulated)

```bash
npm install
npm run dev
```

Open http://localhost:3000. On the dashboard, Connect, then use Activate now or
leave automatic activation on. In this mode nothing touches claude.ai; it is the
full product with the automation stubbed.

## Make it actually work

The reliable way uses the official Claude Code CLI instead of a browser. On Pro
and Max plans, Claude Code and claude.ai share the same five hour usage window,
so one tiny "Hi" sent through `claude -p` starts the window everywhere. No
scraped session, no bot protection, no server to pay for.

### The easy way: GitHub Actions (works while your computer sleeps)

This repo ships `.github/workflows/lazy-start.yml`, which sends "Hi" on Haiku
once an hour. If your window has ended, that starts a fresh one within the hour.
If a window is already running, the ping just uses a sliver of it.

1. On your computer, create a long lived token for your subscription:

   ```bash
   claude setup-token
   ```

2. In your GitHub repo open Settings, Secrets and variables, Actions, and add a
   repository secret named `CLAUDE_CODE_OAUTH_TOKEN` with that token.
3. Open the Actions tab, pick Lazy start, and press Run workflow once to check
   it. After that it runs by itself every hour.

Optional repository variables: `LAZY_MESSAGE` (default `Hi`) and `LAZY_MODEL`
(default `haiku`). GitHub pauses scheduled workflows after 60 days without
commits on the repo, so push something now and then, or re enable it from the
Actions tab.

### Run the dashboard on a real driver

The web app can drive real activations too. On any always on machine with
Claude Code installed and logged in (or with `CLAUDE_CODE_OAUTH_TOKEN` set):

```bash
LAZY_DRIVER=claude-code npm run dev
```

Press Connect on the dashboard; from then on the scheduler starts a window the
moment the previous one ends.

### Legacy: the Playwright browser driver

`LAZY_DRIVER=playwright` drives the claude.ai web page with a captured login.
It is kept for reference but is fragile: claude.ai bot protection can block it,
selectors drift, and automating the consumer web app is a gray area. Prefer the
Claude Code driver above. If you still want it:

```bash
npm run capture-session
SERVER_URL=https://your-app.onrender.com ADMIN_TOKEN=your-token \
  npm run upload-session
```

See `render.yaml` and the `Dockerfile` for an always on Render deployment.

### Environment variables

- `NEXT_PUBLIC_SITE_URL` canonical origin for metadata and sitemap.
- `LAZY_DRIVER` `simulated` (default), `claude-code` (recommended), or `playwright`.
- `CLAUDE_CODE_OAUTH_TOKEN` token from `claude setup-token`, for the Claude Code
  driver on a machine where you are not logged in.
- `LAZY_CLAUDE_MODEL` model for the ping, default `haiku`.
- `LAZY_CLAUDE_BIN`, `LAZY_CLAUDE_TIMEOUT_MS` tune the Claude Code driver.
- `LAZY_DATA_DIR` where the file store lives; point at the mounted disk on Render.
- `LAZY_HEADLESS` `false` to watch the real browser locally.
- `ADMIN_TOKEN` guards the session upload endpoint. Use a long random value.
- `LAZY_CLAUDE_URL`, `LAZY_NAV_TIMEOUT_MS`, `LAZY_COMPOSER_SELECTOR`,
  `LAZY_SEND_SELECTOR` tune the real driver if Claude's page changes.
- `LAZY_SIM_OUTCOME`, `LAZY_SIM_LATENCY_MS` simulated driver diagnostics.

## Scripts

- `npm run dev` start the development server.
- `npm run build` production build.
- `npm run start` run the production build.
- `npm run capture-session` capture your Claude login locally.
- `npm run upload-session` upload the captured session to your server.

State is stored under `LAZY_DATA_DIR` (default `.data`), which is gitignored.
