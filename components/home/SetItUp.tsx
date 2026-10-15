import { readFileSync } from "node:fs";
import path from "node:path";
import Reveal from "@/components/motion/Reveal";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { ArticleSection, Prose } from "./Article";

const WORKFLOW_PATH = ".github/workflows/lazy-start.yml";

/** The workflow a reader pastes into their own repository. Read from the real
 *  file at build time so the page and the workflow can never drift apart. */
const workflow = readFileSync(path.join(process.cwd(), WORKFLOW_PATH), "utf8");

const inlineCode =
  "rounded-[4px] bg-panel px-1.5 py-0.5 font-mono text-[15px] text-ink";

type Step = {
  title: string;
  body: React.ReactNode;
  code?: string;
  file?: { name: string; code: string };
  action?: { label: string; href: string };
};

const steps: Step[] = [
  {
    title: "Create a private repository",
    body: "On GitHub, create a new private repository with any name. It holds a single file, and it lives in your own account, so nobody else ever sees your token.",
    action: { label: "New repository", href: "https://github.com/new" },
  },
  {
    title: "Add the workflow",
    body: (
      <>
        In that repository choose Add file, then Create new file. Name it{" "}
        <code className={inlineCode}>{WORKFLOW_PATH}</code>, paste the workflow
        below, and commit it.
      </>
    ),
    file: { name: WORKFLOW_PATH, code: workflow },
  },
  {
    title: "Create a token",
    body: "On your computer, with Claude Code installed, run the command below. Sign in when the browser opens, then copy the token it prints. It lasts a year.",
    code: "claude setup-token",
  },
  {
    title: "Save it as a secret",
    body: (
      <>
        In your repository open Settings, then Secrets and variables, then
        Actions. Add a repository secret named{" "}
        <code className={inlineCode}>CLAUDE_CODE_OAUTH_TOKEN</code> and paste
        the token.
      </>
    ),
  },
  {
    title: "Run it once",
    body: "Open the Actions tab, choose Lazy start, and press Run workflow to check it. From then on it runs every hour by itself.",
  },
];

export function SetItUp() {
  return (
    <ArticleSection id="set-it-up" title="Set it up">
      <Prose className="mt-10">
        <p>
          Setup takes about three minutes and happens once. You need a Claude
          Pro or Max plan, a free GitHub account, and Claude Code on your
          computer for the one command below.
        </p>
      </Prose>

      <Reveal className="mx-auto mt-14 w-full max-w-[800px]">
        <ol className="border-t border-line-strong">
          {steps.map((step, i) => (
            <li
              key={step.title}
              className="grid gap-3 border-b border-line py-9 md:grid-cols-[72px_1fr] md:gap-6"
            >
              <span className="font-mono text-[14px] text-ink-soft">
                ({i + 1})
              </span>
              <div className="min-w-0">
                <h3 className="font-serif text-[25px] leading-tight text-ink">
                  {step.title}
                </h3>
                <p className="mt-3 font-serif text-[18px] leading-relaxed text-ink-soft">
                  {step.body}
                </p>
                {step.code ? <CodeBlock code={step.code} /> : null}
                {step.file ? (
                  <CodeBlock code={step.file.code} filename={step.file.name} />
                ) : null}
                {step.action ? (
                  <a
                    href={step.action.href}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-6 inline-flex h-11 items-center rounded-[var(--radius)] bg-ink px-5 text-[15px] text-paper transition-opacity hover:opacity-85"
                  >
                    {step.action.label}
                  </a>
                ) : null}
              </div>
            </li>
          ))}
        </ol>
      </Reveal>

      <Prose className="mt-14">
        <p>
          You can change the message or the model with repository variables
          named LAZY_MESSAGE and LAZY_MODEL. The defaults are Hi and Haiku, the
          smallest model, so each run uses as little of your window as possible.
          Prefer to watch it work? The{" "}
          <a href="/dashboard">dashboard</a> can run the same activation from
          any always on machine.
        </p>
      </Prose>
    </ArticleSection>
  );
}
