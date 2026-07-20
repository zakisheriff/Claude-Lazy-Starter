import { site } from "./site";

/**
 * Structured data builders. Keeping these as plain objects lets any server
 * component drop the right schema into a script tag. Covers the entities that
 * search, answer, and generative engines look for: the app, the site, the
 * organization, breadcrumbs, and the FAQ.
 */

export function softwareApplicationLd() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: site.name,
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Web",
    url: site.url,
    description: site.description,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    featureList: [
      "Automatic activation of refreshed Claude usage windows",
      "Working hours and sleep hours scheduling",
      "Activation history and daily usage timeline",
      "Live window status and next refresh estimate",
    ],
  };
}

export function webSiteLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: site.name,
    url: site.url,
    description: site.description,
  };
}

export function organizationLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.name,
    url: site.url,
    logo: `${site.url}/logo.png`,
  };
}

/**
 * HowTo schema for the setup sequence. Answer and generative engines use this
 * to present the steps directly, so it mirrors the on page how it works copy.
 */
export function howToLd() {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "How to keep a Claude usage window always running",
    description:
      "Set up Claude Lazy Starter so a fresh five hour window starts the moment the last one ends.",
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: "Connect your account",
        text: "Link your own Claude web account once. It is used only to send a short message that opens a window.",
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "Turn on automatic activation",
        text: "Flip one switch. There are no hours to set and nothing to schedule.",
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: "Always sit down to a running window",
        text: "The moment a window ends, a short message starts the next one, so time is always waiting for you.",
      },
    ],
  };
}

export function breadcrumbLd(
  items: { name: string; path: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${site.url}${item.path}`,
    })),
  };
}

export function faqLd(items: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

/** Serialize a schema object for a JSON-LD script tag. */
export function ldScript(data: unknown): string {
  return JSON.stringify(data);
}
