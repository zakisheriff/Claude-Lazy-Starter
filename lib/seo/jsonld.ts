import { site } from "./site";

/**
 * Structured data builders. Entities link to each other by @id so search,
 * answer, and generative engines read one connected graph: The Atom builds
 * Claude Lazy Starter, which the website and the page are about, with a HowTo
 * for setup and a FAQPage for questions.
 */

const ids = {
  org: `${site.builder.url}/#organization`,
  website: `${site.url}/#website`,
  page: `${site.url}/#webpage`,
  app: `${site.url}/#software`,
  howTo: `${site.url}/#setup`,
  faq: `${site.url}/#faq`,
};

export function organizationLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": ids.org,
    name: site.builder.name,
    url: site.builder.url,
  };
}

export function webSiteLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": ids.website,
    name: site.name,
    url: site.url,
    description: site.description,
    inLanguage: "en",
    publisher: { "@id": ids.org },
  };
}

export function softwareApplicationLd() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "@id": ids.app,
    name: site.name,
    url: site.url,
    description: site.summary,
    applicationCategory: "DeveloperApplication",
    applicationSubCategory: "Productivity automation",
    operatingSystem: "Any (runs on GitHub Actions)",
    softwareRequirements:
      "A Claude Pro or Max plan, a GitHub account, and Claude Code for one time setup",
    isAccessibleForFree: true,
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    author: { "@id": ids.org },
    publisher: { "@id": ids.org },
    image: `${site.url}/opengraph-image.jpg`,
    featureList: [
      "Starts a fresh five hour Claude usage window soon after the last one ends",
      "Runs every hour on GitHub Actions, so it works while your computer sleeps",
      "Sends one short message on Haiku, the smallest model, to use as little as possible",
      "Uses Claude Code with your own subscription token, stored as an encrypted secret",
      "One prompt for Claude Code sets everything up",
    ],
  };
}

/** The home page itself, with speakable sections for voice assistants. */
export function webPageLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": ids.page,
    url: site.url,
    name: site.title,
    description: site.description,
    inLanguage: "en",
    isPartOf: { "@id": ids.website },
    about: { "@id": ids.app },
    mainEntity: { "@id": ids.app },
    author: { "@id": ids.org },
    primaryImageOfPage: `${site.url}/opengraph-image.jpg`,
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["#introduction", "#questions"],
    },
  };
}

/** HowTo for the one prompt setup, mirroring the Set it up section. */
export function howToLd() {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "@id": ids.howTo,
    name: "How to start your Claude usage window automatically while you sleep",
    description:
      "Set up Claude Lazy Starter so a fresh five hour Claude window starts within an hour of the last one ending, even overnight.",
    totalTime: "PT5M",
    estimatedCost: { "@type": "MonetaryAmount", currency: "USD", value: "0" },
    supply: [
      { "@type": "HowToSupply", name: "A Claude Pro or Max plan" },
      { "@type": "HowToSupply", name: "A free GitHub account" },
    ],
    tool: [
      { "@type": "HowToTool", name: "Claude Code" },
      { "@type": "HowToTool", name: "GitHub CLI" },
    ],
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: "Paste the prompt into Claude Code",
        text: "Copy the setup prompt from the Set it up section and paste it into Claude Code in any folder.",
        url: `${site.url}/#set-it-up`,
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "Let Claude set up GitHub",
        text: "Claude installs the GitHub CLI if it is missing, has you sign in to GitHub in your browser, then creates a private repository named claude-lazy-starter-runner and adds the Lazy start workflow.",
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: "Save your token yourself",
        text: "In your own terminal run claude setup-token, then save the token as the CLAUDE_CODE_OAUTH_TOKEN repository secret with gh secret set.",
      },
      {
        "@type": "HowToStep",
        position: 4,
        name: "Run it once",
        text: "Claude runs the workflow once to check it. From then on it sends a Hi every hour on its own.",
      },
    ],
  };
}

export function faqLd(items: readonly { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": ids.faq,
    isPartOf: { "@id": ids.page },
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}

/** Serialize a schema object for a JSON-LD script tag. Escapes "<" so the
 *  content can never close the script tag early. */
export function ldScript(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
