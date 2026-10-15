import Reveal from "@/components/motion/Reveal";
import { ArticleSection, Prose } from "./Article";

export function Introduction() {
  return (
    <ArticleSection id="introduction" className="pt-28 md:pt-40">
      <Reveal className="mx-auto w-full max-w-[800px]">
        <p className="font-serif text-[26px] leading-[1.32] tracking-[-0.01em] text-ink md:text-[34px]">
          Claude Lazy Starter keeps a Claude usage window running while you
          sleep, so the time you already pay for is waiting when you sit down,
          with a fresh window right behind it.
        </p>
      </Reveal>

      <Prose className="mt-14">
        <p>
          Claude Pro and Max plans meter usage in five hour windows. A window
          only begins when you send your first message, so the clock sits idle
          whenever you do. Sleep through a reset and those hours are simply gone.
        </p>
        <p>
          <strong>The trick.</strong> Lazy Starter sends one short message, a
          plain Hi, soon after each window ends. The next window starts on its
          own in the middle of the night. By the time you wake, the clock has
          run most of it down but you have not. You spend what is left, and the
          moment it ends a brand new five hour window opens.
        </p>
        <p>
          <strong>Official tools only.</strong> The message goes through{" "}
          <a
            href="https://docs.claude.com/en/docs/claude-code/overview"
            target="_blank"
            rel="noreferrer"
          >
            Claude Code
          </a>
          , the command line tool from Anthropic, signed in with your own
          subscription. Claude Code and the Claude apps share one usage window,
          so a Hi from Claude Code starts your window everywhere. No browser
          automation and no scraped sessions.
        </p>
        <p>
          <strong>Runs while your laptop sleeps.</strong> A scheduled GitHub
          Actions workflow sends the Hi once an hour from GitHub&rsquo;s servers.
          It costs nothing, needs no server of your own, and your token stays in
          your own repository as an encrypted secret.
        </p>
      </Prose>
    </ArticleSection>
  );
}
