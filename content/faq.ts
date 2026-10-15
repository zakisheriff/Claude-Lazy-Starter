/**
 * Frequently asked questions. Used both to render the FAQ section and to build
 * FAQPage structured data, so answer engines quote the same text a reader sees.
 */
export const faq = [
  {
    question: "What does Claude Lazy Starter actually do?",
    answer:
      "It watches for the moment your Claude usage window refreshes and starts a session for you by sending a short message. Because a window only begins once you send something, starting it early means the five hour clock runs during hours you were not going to use anyway.",
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
    question: "Is my account information stored anywhere?",
    answer:
      "This build is single tenant and runs against your own account. Your settings and activation history are stored locally. A real session is kept on your own machine, never handed to a third party server.",
  },
  {
    question: "Can I control when it activates?",
    answer:
      "It is intentionally simple. With automatic activation on, it starts a fresh window the moment the last one ends, so a window is always running. You can change the short activation message, turn automatic activation off, and start a window by hand from the dashboard whenever you like.",
  },
] as const;
