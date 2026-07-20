import Image from "next/image";
import Link from "next/link";
import { site } from "@/lib/seo/site";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-line bg-panel">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-16 lg:flex-row lg:items-start lg:justify-between lg:px-8">
        <div className="max-w-sm">
          <div className="flex items-center gap-2.5">
            <Image
              src="/logo.png"
              alt=""
              width={30}
              height={30}
              className="h-7 w-7 rounded-[7px]"
            />
            <p className="text-[17px] font-semibold text-ink">{site.name}</p>
          </div>
          <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">
            {site.tagline} A personal tool that starts your refreshed window
            while you sleep, so the time is yours when you wake up.
          </p>
        </div>

        <nav className="flex flex-col gap-3">
          {site.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-[15px] text-ink-soft transition-colors hover:text-ink"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="mx-auto max-w-6xl px-6 pb-10 lg:px-8">
        <p className="text-[13px] text-ink-soft">
          {site.name}. Copyright {year}. Built as a personal productivity tool
          for your own Claude account.
        </p>
      </div>
    </footer>
  );
}
