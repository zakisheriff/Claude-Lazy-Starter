import Image from "next/image";
import Link from "next/link";
import { site } from "@/lib/seo/site";

const columns = [
  {
    title: "Product",
    links: [
      { label: "How it works", href: "/#how-it-works" },
      { label: "Set it up", href: "/#set-it-up" },
      { label: "Dashboard", href: "/dashboard" },
      { label: "Settings", href: "/settings" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Questions", href: "/#questions" },
      { label: "Claude Code", href: "https://docs.claude.com/en/docs/claude-code/overview" },
      { label: "Claude plans", href: "https://claude.com/pricing" },
    ],
  },
  {
    title: "Project",
    links: [
      { label: "The Atom", href: "https://theatom.lk" },
    ],
  },
] as const;

function FooterLink({ href, label }: { href: string; label: string }) {
  const external = href.startsWith("http");
  const className =
    "text-[15px] text-on-night-soft transition-colors hover:text-on-night";
  return external ? (
    <a href={href} target="_blank" rel="noreferrer" className={className}>
      {label}
    </a>
  ) : (
    <Link href={href} className={className}>
      {label}
    </Link>
  );
}

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-night text-on-night">
      <div className="mx-auto grid max-w-[1400px] gap-14 px-6 pt-24 pb-12 lg:grid-cols-[1.4fr_1fr_1fr_1fr] lg:px-16">
        <div className="flex flex-col justify-between gap-10">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt=""
              width={40}
              height={40}
              className="h-10 w-10 rounded-[8px]"
            />
            <span className="text-[18px] font-medium">{site.name}</span>
          </Link>
        </div>

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

      <div className="mx-auto flex max-w-[1400px] flex-col gap-2 px-6 pb-14 text-[14px] text-on-night-soft lg:flex-row lg:justify-between lg:px-16">
        <p>Copyright {year} {site.name}</p>
        <p>
          An independent project. Not affiliated with or endorsed by
          Anthropic.
        </p>
      </div>
    </footer>
  );
}
