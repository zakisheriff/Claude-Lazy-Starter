"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { site } from "@/lib/seo/site";
import { prefersReducedMotion } from "@/lib/utils/motion";

/**
 * Full page mobile menu. It opens by revealing downward from the top and closes
 * by retracting upward from the bottom, driven by GSAP. The overlay stays
 * mounted and is made inert while closed so focus never lands inside it.
 */
export function MobileMenu({
  open,
  onClose,
  activePath,
}: {
  open: boolean;
  onClose: () => void;
  activePath: string;
}) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<HTMLUListElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);
  const first = useRef(true);

  useEffect(() => {
    const overlay = overlayRef.current;
    const items = itemsRef.current;
    if (!overlay) return;

    const reduce = prefersReducedMotion();
    const links = items ? Array.from(items.children) : [];

    // Skip animating the very first render into a closed state.
    if (first.current) {
      first.current = false;
      gsap.set(overlay, {
        clipPath: "inset(0 0 100% 0)",
        pointerEvents: "none",
        autoAlpha: 0,
      });
      return;
    }

    if (open) {
      document.body.style.overflow = "hidden";
      gsap.killTweensOf([overlay, ...links, footerRef.current]);
      gsap.set(overlay, { autoAlpha: 1, pointerEvents: "auto" });
      if (reduce) {
        gsap.set(overlay, { clipPath: "inset(0 0 0% 0)" });
        gsap.set(links, { autoAlpha: 1, y: 0 });
        return;
      }
      const tl = gsap.timeline();
      tl.fromTo(
        overlay,
        { clipPath: "inset(0 0 100% 0)" },
        { clipPath: "inset(0 0 0% 0)", duration: 0.55, ease: "power3.inOut" },
      )
        .fromTo(
          links,
          { autoAlpha: 0, y: 18 },
          { autoAlpha: 1, y: 0, duration: 0.4, stagger: 0.06, ease: "power2.out" },
          "-=0.2",
        )
        .fromTo(
          footerRef.current,
          { autoAlpha: 0 },
          { autoAlpha: 1, duration: 0.3 },
          "-=0.2",
        );
    } else {
      document.body.style.overflow = "";
      gsap.killTweensOf([overlay, ...links, footerRef.current]);
      if (reduce) {
        gsap.set(overlay, {
          clipPath: "inset(0 0 100% 0)",
          autoAlpha: 0,
          pointerEvents: "none",
        });
        return;
      }
      gsap.to(overlay, {
        clipPath: "inset(0 0 100% 0)",
        duration: 0.45,
        ease: "power3.inOut",
        onComplete: () => {
          gsap.set(overlay, { autoAlpha: 0, pointerEvents: "none" });
        },
      });
    }
  }, [open]);

  // Close on Escape while open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <div
      ref={overlayRef}
      id="mobile-menu"
      className="fixed inset-0 z-40 flex flex-col bg-panel md:hidden"
      style={{ clipPath: "inset(0 0 100% 0)" }}
      aria-hidden={!open}
    >
      <nav className="flex flex-1 flex-col justify-center px-8">
        <ul ref={itemsRef} className="flex flex-col gap-2">
          {site.nav.map((item) => {
            const active =
              item.href === "/"
                ? activePath === "/"
                : activePath.startsWith(item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onClose}
                  className={
                    active
                      ? "block py-2 text-4xl font-medium tracking-tight text-clay"
                      : "block py-2 text-4xl font-medium tracking-tight text-ink"
                  }
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <div
        ref={footerRef}
        className="border-t border-line px-8 py-8 text-[15px] text-ink-soft"
      >
        <p>Move unused Claude time from sleep into your working day.</p>
      </div>
    </div>
  );
}
