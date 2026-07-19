import { cn } from "@/lib/utils/cn";

/**
 * A quiet surface used to group related content. Panels are used sparingly,
 * only where grouping genuinely helps, never as decoration.
 */
export function Panel({
  className,
  children,
  raised = false,
  as: Tag = "div",
}: {
  className?: string;
  children: React.ReactNode;
  raised?: boolean;
  as?: React.ElementType;
}) {
  return (
    <Tag
      className={cn(
        "rounded-[var(--radius)] border border-line bg-paper-raised",
        raised && "shadow-[var(--shadow-soft)]",
        className,
      )}
    >
      {children}
    </Tag>
  );
}
