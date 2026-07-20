"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { site } from "@/lib/seo/site";
import { cn } from "@/lib/utils/cn";
import { Button } from "@/components/ui/Button";
import { MobileMenu } from "./MobileMenu";

/**
 * Sticky top navigation. It stays quiet, thickening its background only once
 * the page has scrolled. The hamburger opens a full page menu on small screens.
 */
export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the menu on navigation.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-colors duration-300",
          scrolled
            ? "border-b border-line bg-panel/85 backdrop-blur-md"
            : "border-b border-transparent",
        )}
      >
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6 lg:px-8">
          <Link
            href="/"
            className="flex items-center gap-2.5 text-[17px] font-semibold tracking-tight text-ink"
          >
            <Image
              src="/logo.png"
              alt=""
              width={30}
              height={30}
              priority
              className="h-7 w-7 rounded-[7px]"
            />
            {site.name}
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {site.nav.map((item) => {
              const active =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "rounded-full px-4 py-2 text-[15px] transition-colors",
                    active
                      ? "text-ink"
                      : "text-ink-soft hover:text-ink",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="hidden md:block">
            <Button href="/dashboard" size="md">
              Open dashboard
            </Button>
          </div>

          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
            className="relative z-50 flex h-10 w-10 cursor-pointer flex-col items-center justify-center gap-1.5 md:hidden"
          >
            <span
              className={cn(
                "block h-0.5 w-6 bg-ink transition-transform duration-300",
                open && "translate-y-2 rotate-45",
              )}
            />
            <span
              className={cn(
                "block h-0.5 w-6 bg-ink transition-opacity duration-200",
                open && "opacity-0",
              )}
            />
            <span
              className={cn(
                "block h-0.5 w-6 bg-ink transition-transform duration-300",
                open && "-translate-y-2 -rotate-45",
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
