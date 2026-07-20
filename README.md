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
  a real Playwright driver.

## Run it locally (simulated)

```bash
npm install
npm run dev
```

Open http://localhost:3000. On the dashboard, Connect, then use Activate now or
leave automatic activation on. In this mode nothing touches claude.ai; it is the
full product with the automation stubbed.

## Make it actually work

For it to fire while you are away, the sender must run on an **always on
machine**, never a laptop that sleeps. This repo is set up to deploy on Render.

**Important honesty:** the real driver stores your claude.ai session on that
machine so it can act as you. Automating claude.ai to pre start windows is a gray
area under Anthropic's usage terms, and claude.ai's bot protection can challenge
or block automated browsers, especially from datacenter IPs like Render's. It may
work, it may get challenged, and worst case the account can be flagged. It is
your own account and your decision.

### 1. Deploy to Render

- Push this repo to GitHub and create a Render Blueprint from `render.yaml`.
- It provisions an always on Docker web service (a paid plan; free ones spin
  down) with a 1 GB persistent disk mounted at `/var/data` so your session and
  history survive restarts.
- Render generates `ADMIN_TOKEN` on first deploy. Copy it from the dashboard.
- Set `NEXT_PUBLIC_SITE_URL` to your Render URL.

### 2. Capture your session once, on your own computer

```bash
npm run capture-session
```

A real browser opens on claude.ai. Log in as you normally would, then press
Enter in the terminal. Your session is saved to `claude-session.json` (already
gitignored, treat it like a password).

### 3. Upload it to the server

```bash
SERVER_URL=https://your-app.onrender.com ADMIN_TOKEN=your-token \
  npm run upload-session
```

Then open the dashboard and press Connect to verify. From there, automatic
activation keeps a window running for you.

### Environment variables

- `NEXT_PUBLIC_SITE_URL` canonical origin for metadata and sitemap.
- `LAZY_DRIVER` `simulated` (default) or `playwright`.
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
