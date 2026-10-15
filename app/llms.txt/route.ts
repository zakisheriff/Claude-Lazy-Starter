import { faq } from "@/content/faq";
import { site } from "@/lib/seo/site";

export const dynamic = "force-static";

/**
 * llms.txt: a plain text summary for language models and generative engines,
 * built from the same site config and FAQ as the page so it never drifts.
 */
export function GET() {
  const body = `# ${site.name}

> ${site.summary}

Built by ${site.builder.name} (${site.builder.url}). An independent project, not affiliated with Anthropic.

## How it works

- A Claude Pro or Max usage window lasts five hours and only starts when you send your first message.
- Claude Lazy Starter is a GitHub Actions workflow that runs once an hour.
- Each run installs Claude Code and sends one short message ("Hi") on Haiku, the smallest model, using the CLAUDE_CODE_OAUTH_TOKEN secret created with claude setup-token.
- Claude Pro and Max share one usage window across claude.ai and Claude Code, so that message starts the window everywhere.
- If the window has ended, a new one starts within the hour, even overnight. If a window is running, the message uses a sliver of it and nothing resets.
- Result: you wake up to time already waiting, and a fresh five hour window opens right after it.

## Set it up

1. Paste the setup prompt from ${site.url}/#set-it-up into Claude Code.
2. Claude installs the GitHub CLI if it is missing, has you sign in to GitHub in your browser, creates a private repository, and adds the Lazy start workflow.
3. In your own terminal, run claude setup-token and save the token with gh secret set CLAUDE_CODE_OAUTH_TOKEN.
4. Claude runs the workflow once to check it. It then runs every hour by itself.

Requirements: a Claude Pro or Max plan, a free GitHub account, and Claude Code. Cost: free.

## Questions

${faq.map((f) => `### ${f.question}\n\n${f.answer}`).join("\n\n")}

## Links

- Website: ${site.url}
- Setup: ${site.url}/#set-it-up
- Built by: ${site.builder.url}
`;
  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
