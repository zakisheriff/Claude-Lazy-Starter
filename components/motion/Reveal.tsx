"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils/cn";
import { prefersReducedMotion } from "@/lib/utils/motion";

type Props = {
  children: React.ReactNode;
  className?: string;
  /** Stagger children instead of revealing the wrapper as one block. */
  stagger?: boolean;
  delay?: number;
  /** Render as a different element, defaults to a div. */
  as?: React.ElementType;
};

/**
 * Subtle scroll reveal. Elements fade and rise a few pixels as they enter the
 * viewport, once. When reduced motion is preferred, content simply appears.
 * Content is fully visible without JavaScript, so nothing is ever hidden.
 */
export default function Reveal({
  children,
  className,
  stagger = false,
  delay = 0,
  as: Tag = "div",
}: Props) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const targets = stagger ? el.children : el;
      gsap.set(targets, { opacity: 0, y: 14 });
      gsap.to(targets, {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: "power2.out",
        delay,
        stagger: stagger ? 0.08 : 0,
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          once: true,
        },
      });
    }, el);

    return () => ctx.revert();
  }, [stagger, delay]);

  return (
    <Tag ref={ref} className={cn(className)} data-reveal>
      {children}
    </Tag>
  );
}
