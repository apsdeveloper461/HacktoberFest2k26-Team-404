// Tiny SVG building blocks shared by every sketch. No hooks, no generator:
// safe to use from server and client components alike.
import type { CSSProperties, ReactNode, SVGProps } from "react";
import { cx } from "../cx";

/** CSS custom properties consumed by the draw/reveal keyframes in landing.css. */
export function timing(delay?: number, dur?: number): CSSProperties {
  const style: Record<string, string> = {};
  if (delay !== undefined) style["--d"] = `${delay}ms`;
  if (dur !== undefined) style["--dur"] = `${dur}ms`;
  return style as CSSProperties;
}

type StrokeProps = Omit<SVGProps<SVGPathElement>, "d" | "ref"> & {
  d: string;
  w?: number;
  /** Play the CSS draw-on animation (hero only). */
  draw?: boolean;
  /** Normalise the path length to 1 so dash animations work. Implied by `draw`. */
  measure?: boolean;
  delay?: number;
  dur?: number;
};

export function Stroke({
  d,
  w = 2,
  draw = false,
  measure = false,
  delay,
  dur,
  className,
  style,
  ...rest
}: StrokeProps) {
  return (
    <path
      d={d}
      pathLength={draw || measure ? 1 : undefined}
      fill="none"
      stroke="currentColor"
      strokeWidth={w}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cx(draw && "cs-draw", className)}
      style={{ ...timing(delay, dur), ...style }}
      {...rest}
    />
  );
}

type TextProps = Omit<SVGProps<SVGTextElement>, "ref"> & {
  children: ReactNode;
  size?: number;
  /** Fade the ink in (hero only). */
  reveal?: boolean;
  delay?: number;
};

/** Handwritten label: Recursive with the Casual axis on. */
export function HandText({ children, size = 18, reveal, delay, className, style, ...rest }: TextProps) {
  return (
    <text
      fontSize={size}
      fill="currentColor"
      className={cx("cs-hand", reveal && "cs-ink-in", className)}
      style={{ ...timing(delay), ...style }}
      {...rest}
    >
      {children}
    </text>
  );
}

/** Technical label: Recursive Mono. */
export function MonoText({ children, size = 11, reveal, delay, className, style, ...rest }: TextProps) {
  return (
    <text
      fontSize={size}
      fill="currentColor"
      className={cx("cs-mono", reveal && "cs-ink-in", className)}
      style={{ ...timing(delay), ...style }}
      {...rest}
    >
      {children}
    </text>
  );
}
