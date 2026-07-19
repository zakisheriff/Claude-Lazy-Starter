import { cn } from "@/lib/utils/cn";

const controlBase =
  "w-full rounded-[var(--radius-sm)] border border-line-strong bg-paper px-4 py-2.5 text-ink placeholder:text-ink-soft/70 transition-colors focus:border-clay focus:outline-none";

export function Field({
  label,
  htmlFor,
  description,
  children,
  className,
}: {
  label: string;
  htmlFor?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <label htmlFor={htmlFor} className="text-[15px] font-medium text-ink">
        {label}
      </label>
      {description ? (
        <p className="text-[14px] leading-relaxed text-ink-soft">
          {description}
        </p>
      ) : null}
      {children}
    </div>
  );
}

export function Input({
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(controlBase, className)} {...props} />;
}

export function Textarea({
  className,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(controlBase, "min-h-24 resize-y leading-relaxed", className)}
      {...props}
    />
  );
}

export function Select({
  className,
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select className={cn(controlBase, "appearance-none pr-10", className)} {...props}>
      {children}
    </select>
  );
}
