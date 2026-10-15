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

Work through these steps one at a time. Tell me what you are doing, check each step really worked before moving on, and fix anything that is missing instead of stopping. Whenever I need to type something myself, give me the exact command to copy and wait until I say it is done.

1. Check my computer. Find out my operating system. Check that the GitHub CLI (gh) is installed with gh --version. If it is missing, install it for me: on macOS use brew install gh (if Homebrew itself is missing, give me the official Homebrew install command to run in my own terminal, because it needs my password); on Windows use winget install --id GitHub.cli; on Linux follow the official instructions at cli.github.com. Then confirm gh --version works.

2. Sign me in to GitHub. Run gh auth status. If I am not signed in, or the token does not include the workflow scope, ask me to run this in a separate terminal window and finish the sign in in my browser:
gh auth login --hostname github.com --git-protocol https --web --scopes workflow
(If I am already signed in but only the workflow scope is missing, ask me to run gh auth refresh --hostname github.com --scopes workflow instead.) If I do not have a GitHub account, tell me to create a free one at github.com/signup first. When I am done, run gh auth status again and find my username with gh api user --jq .login.

3. Create a private GitHub repository named claude-lazy-starter in my account with gh repo create claude-lazy-starter --private --add-readme. If it already exists, reuse it.

4. Add the file .github/workflows/lazy-start.yml to that repository with exactly the content below. Upload it with the GitHub API (gh api, the repository contents endpoint, base64 encoded content) so git is not needed. If the file already exists, update it. Then confirm it shows up with gh workflow list --repo MY_USERNAME/claude-lazy-starter.

\`\`\`yaml
${workflow}
\`\`\`

5. Create my Claude token. Ask me to run claude setup-token in a separate terminal window and finish the sign in in my browser with the Claude account that has my Pro or Max plan. It prints a long token. Do not ask me to paste the token into this chat.

6. Save the token in GitHub. Give me this exact command with my real username filled in, ask me to run it in that same terminal, and paste the token when it asks:
gh secret set CLAUDE_CODE_OAUTH_TOKEN --repo MY_USERNAME/claude-lazy-starter
When I am done, check it with gh secret list --repo MY_USERNAME/claude-lazy-starter (it only shows the name, never the value).

7. Test it. Start the workflow once with gh workflow run lazy-start.yml --repo MY_USERNAME/claude-lazy-starter, wait a few seconds, find the run with gh run list, follow it with gh run watch, and tell me whether it succeeded. If it failed, read the logs with gh run view --log-failed, explain the problem in plain words, help me fix it, and run it again until it passes.

8. Finish by giving me the repository link and the Actions page link, and confirm it will now run every hour on its own. Tell me how to check it worked: the next morning, Settings then Usage on claude.ai should show my window resetting early in the day.`;

export function SetItUp() {
  return (
    <ArticleSection id="set-it-up" title="Set it up">
      <Prose className="mt-10">
        <p>
          You need a Claude Pro or Max plan and Claude Code. Open Claude Code
          in any folder, paste the prompt below, and follow along. Claude
          checks your computer and installs the GitHub CLI if it is missing,
          walks you through signing in to GitHub, creates a private
          repository, adds the workflow, and runs it once to check. The two
          sign ins happen in your own browser, and you save your token
          yourself, so it never passes through the chat.
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
