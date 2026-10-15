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
      "Set up Claude Lazy Starter so a fresh five hour window starts within an hour of the last one ending, even while you sleep.",
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: "Get your own copy",
        text: "Fork the Claude Lazy Starter repository into your GitHub account.",
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "Create a token",
        text: "Run claude setup-token on your computer, sign in, and copy the token.",
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: "Save it as a secret",
        text: "Add the token as a repository secret named CLAUDE_CODE_OAUTH_TOKEN.",
      },
      {
        "@type": "HowToStep",
        position: 4,
        name: "Turn it on",
        text: "Enable workflows in the Actions tab and run Lazy start once. It then runs every hour.",
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
