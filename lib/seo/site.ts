/**
 * Central site configuration. Single source of truth for name, url, and
 * descriptive copy used across metadata, structured data, and the interface.
 */

export const site = {
  name: "Claude Lazy Starter",
  shortName: "Lazy Starter",
  // Production origin. Override per environment with NEXT_PUBLIC_SITE_URL.
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://claudelazystarter.theatom.lk",
  tagline: "Never waste a refreshed Claude window while you sleep.",
  description:
    "Claude Lazy Starter watches for your refreshed Claude usage window and starts it automatically, so the five hour clock begins during your sleeping hours instead of your working ones.",
  locale: "en_US",
  author: "Claude Lazy Starter",
  keywords: [
    "Claude usage window",
    "Claude session automation",
    "reclaim Claude usage time",
    "Claude usage limit scheduler",
    "automatic Claude activation",
    "developer productivity tool",
  ],
  nav: [
    { label: "How it works", href: "/#how-it-works" },
    { label: "Questions", href: "/#questions" },
    { label: "Dashboard", href: "/dashboard" },
    { label: "Settings", href: "/settings" },
  ],
} as const;

export type NavItem = (typeof site.nav)[number];
