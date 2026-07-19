/**
 * Minimal class name joiner. Filters out falsy values so conditional classes
 * read cleanly at the call site.
 */
export function cn(
  ...values: Array<string | false | null | undefined>
): string {
  return values.filter(Boolean).join(" ");
}
