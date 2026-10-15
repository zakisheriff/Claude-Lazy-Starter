/**
 * Central site configuration. Single source of truth for name, url, and
 * descriptive copy used across metadata, structured data, llms.txt, and the
 * interface.
 */

export const site = {
  name: "Claude Lazy Starter",
  shortName: "Lazy Starter",
  // Production origin. Override per environment with NEXT_PUBLIC_SITE_URL.
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://claudelazystarter.theatom.lk",
  title: "Claude Lazy Starter: start your Claude usage window while you sleep",
  tagline: "Never waste a refreshed Claude window while you sleep.",
  description:
    "Claude Lazy Starter sends one tiny Hi through Claude Code every hour from GitHub Actions, so your five hour Claude usage window starts while you sleep. Wake up to time already waiting, with a fresh window right behind it. Free, for Claude Pro and Max.",
  /** A short, quotable answer for answer and generative engines. */
  summary:
    "Claude Lazy Starter is a free GitHub Actions workflow by The Atom that sends a single Hi through Claude Code once an hour. Because Claude Pro and Max usage windows only start when you send a message, this starts a new five hour window soon after the last one ends, even overnight, so unused hours move from your sleep into your working day.",
  locale: "en_US",
  builder: {
    name: "The Atom",
    url: "https://theatom.lk",
  },
  keywords: [
    "Claude Lazy Starter",
    "Claude usage limit",
    "Claude five hour window",
    "Claude usage window reset",
    "start Claude window automatically",
    "Claude Code GitHub Actions",
    "claude setup-token",
    "Claude Pro usage",
    "Claude Max usage",
    "Claude rate limit while sleeping",
    "The Atom",
  ],
  nav: [
    { label: "How it works", href: "/#how-it-works" },
    { label: "Questions", href: "/#questions" },
  ],
} as const;

export type NavItem = (typeof site.nav)[number];
