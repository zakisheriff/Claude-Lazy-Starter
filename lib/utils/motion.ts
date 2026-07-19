/** Shared motion helpers used by both GSAP and Framer Motion code paths. */

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Standard easing for reveals and transitions, matched across the app. */
export const easeOut = [0.22, 1, 0.36, 1] as const;
