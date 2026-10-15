/**
 * Frequently asked questions. Used both to render the FAQ section and to build
 * FAQPage structured data, so answer engines quote the same text a reader sees.
 */
export const faq = [
  {
    question: "What does Claude Lazy Starter actually do?",
    answer:
      "Once an hour it sends a short Hi to Claude on your behalf. If your usage window has ended, that starts the next one. Because a window only begins once you send something, starting it early means the five hour clock runs during hours you were not going to use anyway.",
  },
  {
    question: "Why would I want my window to start while I sleep?",
    answer:
      "A usage window lasts a fixed length once it opens. If it refreshes at eight in the morning but you do not start until noon, those four hours are lost. Starting the window at refresh time shifts that time back toward your working day.",
  },
  {
    question: "Does this use the Claude API?",
    answer:
      "No. It sends one short message through Claude Code, the official Claude command line tool, signed in with your own subscription. Claude Code and the Claude app share the same usage window, so that one line starts your window everywhere. Nothing else is sent and your work never leaves your account.",
  },
  {
    question: "Where is my token kept?",
    answer:
      "Only in your own GitHub repository, as an encrypted Actions secret. This site never sees it, and there is no shared server holding anyone's account. Each person runs the workflow in their own private repository.",
  },
  {
    question: "Does the hourly message use up my limit?",
    answer:
      "Barely. Each run sends a single Hi on Haiku, the smallest model, which is a tiny slice of a window. If a window is already running the message simply uses a sliver of it; nothing resets.",
  },
  {
    question: "Why every hour instead of the exact moment?",
    answer:
      "The workflow cannot see when your window ends, so it checks in every hour. That means a fresh window starts at most about an hour after the last one ends, while keeping the number of messages low.",
  },
  {
    question: "Can I change the message or turn it off?",
    answer:
      "Yes. Set the LAZY_MESSAGE and LAZY_MODEL repository variables to change what is sent, or disable the Lazy start workflow from the Actions tab to pause it at any time.",
  },
  {
    question: "Is this made by Anthropic?",
    answer:
      "No. Claude Lazy Starter is an independent project. It only uses Claude Code, the official command line tool, with your own subscription.",
  },
] as const;
