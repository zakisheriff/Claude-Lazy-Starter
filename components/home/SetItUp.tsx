import { readFileSync } from "node:fs";
import path from "node:path";
import Reveal from "@/components/motion/Reveal";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { ArticleSection, Prose } from "./Article";

/** The workflow, read from the real file at build time so the prompt and the
 *  workflow in this repository can never drift apart. */
const workflow = readFileSync(
  path.join(process.cwd(), ".github/workflows/lazy-start.yml"),
  "utf8",
).trim();

/** One prompt that has Claude Code set everything up. The token is created
 *  and saved by the reader in their own terminal, never pasted into chat. */
const prompt = `Set up Claude Lazy Starter for me. It keeps my Claude usage window running by sending a tiny "Hi" through Claude Code once an hour from GitHub Actions, so a fresh five hour window starts even while I sleep.

Work through these steps one at a time and tell me what you are doing:

1. Check that the GitHub CLI (gh) is installed and logged in. If it is missing, install it (brew install gh on macOS, otherwise follow cli.github.com). If it is not logged in, ask me to run gh auth login in my own terminal and wait for me.

2. Create a new private GitHub repository named claude-lazy-starter in my account and clone it into a temporary folder.

3. In that repository create the file .github/workflows/lazy-start.yml with exactly this content, then commit and push it:

\`\`\`yaml
${workflow}
\`\`\`

4. Ask me to open a separate terminal window, run claude setup-token, and finish the sign in. Do not ask me to paste the token into this chat.

5. Ask me to run this in that same terminal, replacing OWNER with my GitHub username, and to paste the token when it prompts:
gh secret set CLAUDE_CODE_OAUTH_TOKEN --repo OWNER/claude-lazy-starter
Wait until I confirm it is done.

6. Start the workflow once with gh workflow run lazy-start.yml, follow it with gh run watch, and tell me whether it succeeded. If it failed, read the logs with gh run view --log-failed, explain the problem, and help me fix it.

7. Finish by giving me the repository link and confirming it will now run every hour on its own.`;

export function SetItUp() {
  return (
    <ArticleSection id="set-it-up" title="Set it up">
      <Prose className="mt-10">
        <p>
          You need a Claude Pro or Max plan, a free GitHub account, and Claude
          Code. Open Claude Code in any folder, paste the prompt below, and
          follow along. Claude creates a private repository, adds the workflow,
          and runs it once to check. You save your token yourself, so it never
          passes through the chat.
        </p>
      </Prose>

      <Reveal className="mx-auto mt-10 w-full max-w-[800px]">
        <CodeBlock
          code={prompt}
          filename="Paste into Claude Code"
          copyLabel="Copy prompt"
          wrap
        />
      </Reveal>

      <Prose className="mt-10">
        <p>
          That is all. From then on it runs every hour by itself. The prompt
          includes the full workflow, so you can read exactly what will run
          before you paste it.
        </p>
      </Prose>
    </ArticleSection>
  );
}
