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
