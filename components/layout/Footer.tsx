import Link from "next/link";
import { site } from "@/lib/seo/site";

const columns = [
  {
    title: "Product",
    links: [
      { label: "Introduction", href: "/#introduction" },
      { label: "How it works", href: "/#how-it-works" },
      { label: "Set it up", href: "/#set-it-up" },
      { label: "Questions", href: "/#questions" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Claude Code", href: "https://docs.claude.com/en/docs/claude-code/overview" },
      { label: "Claude plans", href: "https://claude.com/pricing" },
      { label: "GitHub Actions", href: "https://docs.github.com/en/actions" },
    ],
  },
  {
    title: "The Atom",
    links: [{ label: "theatom.lk", href: site.builder.url }],
  },
] as const;

function FooterLink({ href, label }: { href: string; label: string }) {
  const className =
    "text-[16px] text-on-night-soft transition-colors hover:text-on-night";
  return href.startsWith("http") ? (
    <a href={href} target="_blank" rel="noreferrer" className={className}>
      {label}
    </a>
  ) : (
    <Link href={href} className={className}>
      {label}
    </Link>
  );
}

/**
 * The closing page: a full viewport dark footer with the link columns, a large
 * wordmark, and the credit to The Atom, who builds Claude Lazy Starter.
 */
export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="flex min-h-[100svh] flex-col bg-night text-on-night">
      <div className="mx-auto grid w-full max-w-[1400px] gap-12 px-6 pt-24 sm:grid-cols-3 lg:px-16 lg:pt-32">
        {columns.map((col) => (
          <nav key={col.title} aria-label={col.title}>
            <p className="text-[15px] font-semibold">{col.title}</p>
            <ul className="mt-6 flex flex-col gap-4">
              {col.links.map((l) => (
                <li key={l.label}>
                  <FooterLink href={l.href} label={l.label} />
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      <div className="mt-auto flex w-full justify-center overflow-hidden px-4 pt-24">
        <p
          aria-hidden
          className="font-serif text-[clamp(38px,10vw,156px)] leading-none tracking-[-0.03em] whitespace-nowrap text-on-night"
        >
          {site.name}
        </p>
      </div>

      <div className="mx-auto mt-16 w-full max-w-[1400px] px-6 pb-10 lg:px-16">
      <div className="flex flex-col gap-3 border-t border-white/10 pt-8 text-[14px] text-on-night-soft lg:flex-row lg:items-center lg:justify-between">
        <p>
          {site.name} is built by{" "}
          <a
            href={site.builder.url}
            target="_blank"
            rel="noreferrer"
            className="text-on-night underline underline-offset-4 transition-opacity hover:opacity-80"
          >
            {site.builder.name}
          </a>
          . Copyright {year}.
        </p>
        <p>An independent project. Not affiliated with or endorsed by Anthropic.</p>
      </div>
      </div>
    </footer>
  );
}
