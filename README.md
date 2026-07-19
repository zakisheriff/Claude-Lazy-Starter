# Claude Lazy Starter

Stop losing Claude hours while you sleep. A usage window only starts once you
send a message, so a window that refreshes overnight is wasted if you do not
touch it until midday. Claude Lazy Starter starts the window for you at refresh
time, shifting unused time from your sleeping hours into your working day.

## What it does

- Watches for a refreshed usage window and opens it automatically during your
  sleep hours.
- Shows a live dashboard: window status, remaining time, next refresh,
  activation history, and your daily timeline.
- Lets you configure automatic activation, the activation message and model,
  your window length, and your working and sleep hours.

## How it is built

- Next.js App Router, TypeScript, Tailwind CSS v4.
- GSAP and ScrollTrigger, Lenis smooth scrolling, Framer Motion.
- Pure domain logic, a swappable storage `Repository`, and a swappable
  automation `ActivationDriver`.

## Automation and privacy

This build is single tenant and runs against your own account. It uses a
simulated automation driver, so nothing here touches claude.ai or the Claude
API. A real driver would use browser automation with a session kept on your own
machine, never handed to a third party server.

Two honest caveats for a real driver: automating claude.ai to pre start windows
is a gray area under Anthropic's usage terms, and server side headless
automation is often blocked by bot protection. The real driver is best run
locally or self hosted, behind the same `ActivationDriver` interface.

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000. Connect your account on the dashboard, set your
hours in settings, and use Activate now or leave automatic activation on.

### Useful environment variables

- `NEXT_PUBLIC_SITE_URL` sets the canonical origin for metadata and sitemap.
- `LAZY_SIM_OUTCOME` forces the simulated driver to `success` or `expired`.
- `LAZY_SIM_LATENCY_MS` fixes the simulated activation latency.

## Scripts

- `npm run dev` start the development server.
- `npm run build` production build.
- `npm run start` run the production build.
- `npm run lint` lint the project.

State is stored locally under `.data`, which is gitignored.
