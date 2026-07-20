"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils/cn";

/**
 * An accessible switch. The knob animates with a spring; motion is subtle and
 * respects the platform reduced-motion setting through Framer Motion defaults.
 */
export function Toggle({
  checked,
  onChange,
  label,
  disabled = false,
  id,
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
  label: string;
  disabled?: boolean;
  id?: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      id={id}
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative inline-flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full border transition-colors duration-200",
        checked
          ? "border-clay bg-clay"
          : "border-line-strong bg-panel-strong",
        disabled && "cursor-not-allowed opacity-50",
      )}
    >
      <motion.span
        layout
        transition={{ type: "spring", stiffness: 520, damping: 34 }}
        className={cn(
          "block h-5 w-5 rounded-full bg-white shadow-sm",
          checked ? "ml-6" : "ml-1",
        )}
      />
    </button>
  );
}
