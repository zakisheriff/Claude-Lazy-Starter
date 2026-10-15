"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { site } from "@/lib/seo/site";
import { cn } from "@/lib/utils/cn";
import { MobileMenu } from "./MobileMenu";

/**
 * Top navigation. Over the dark hero on the home page it is transparent with
 * light text; once the page scrolls past the hero it settles onto the ivory
 * paper with dark text. Other pages always use the light treatment.
 */
export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [overHero, setOverHero] = useState(pathname === "/");

  useEffect(() => {
    const update = () => {
      const hero = document.querySelector<HTMLElement>("[data-hero]");
      if (!hero) {
        setOverHero(false);
        return;
      }
      setOverHero(window.scrollY < hero.offsetHeight - 68);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [pathname]);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const dark = overHero && !open;

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-colors duration-300",
          dark
            ? "bg-transparent text-on-night"
            : "border-b border-line bg-paper text-ink",
        )}
      >
        <div className="mx-auto flex h-[68px] max-w-[1400px] items-center justify-between px-6 lg:px-16">
          <Link
            href="/"
            className="font-serif text-[22px] leading-none tracking-[-0.02em]"
          >
            {site.name}
          </Link>

          <div className="hidden items-center gap-8 lg:flex">
            <nav className="flex items-center gap-8">
              {site.nav.map((item) => {
                const active =
                  !item.href.includes("#") && pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "text-[16px] transition-opacity hover:opacity-70",
                      active && "underline underline-offset-[6px]",
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
            <Link
              href="/#set-it-up"
              className={cn(
                "inline-flex h-11 items-center rounded-[var(--radius)] px-5 text-[16px] transition-colors",
                dark
                  ? "bg-white text-night hover:bg-[#e8e6dc]"
                  : "bg-night text-on-night hover:bg-night-soft",
              )}
            >
              Set it up
            </Link>
          </div>

          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
            className="relative z-50 flex h-10 w-10 cursor-pointer flex-col items-center justify-center gap-1.5 lg:hidden"
          >
            <span
              className={cn(
                "block h-px w-6 bg-current transition-transform duration-300",
                open && "translate-y-[3.5px] rotate-45",
              )}
            />
            <span
              className={cn(
                "block h-px w-6 bg-current transition-transform duration-300",
                open && "-translate-y-[3.5px] -rotate-45",
              )}
            />
          </button>
        </div>
      </header>

      <MobileMenu
        open={open}
        onClose={() => setOpen(false)}
        activePath={pathname}
      />
    </>
  );
}
