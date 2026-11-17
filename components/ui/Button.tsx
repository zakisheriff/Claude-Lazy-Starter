import { GlassButton } from "@zakisheriff/liquid-glass";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

/** The site's accent. Filled glass always sets a white label on it. */
export const CLAY = "#d97757";

type ButtonProps = Omit<
  React.ComponentProps<typeof GlassButton>,
  "variant" | "size" | "tint" | "destructive"
> & {
  variant?: Variant;
  size?: Size;
};

/**
 * The site's button, drawn as Liquid Glass. `primary` is a solid clay pill,
 * `secondary` regular glass, `ghost` clear glass and `danger` red glass. Pass
 * `href` for a link.
 */
export function Button({ variant = "primary", size = "md", ...rest }: ButtonProps) {
  switch (variant) {
    case "primary":
      return <GlassButton variant="filled" tint={CLAY} size={size} {...rest} />;
    case "secondary":
      return <GlassButton variant="glass" size={size} {...rest} />;
    case "ghost":
      return <GlassButton variant="clear" size={size} {...rest} />;
    case "danger":
      return <GlassButton variant="glass" destructive size={size} {...rest} />;
  }
}
