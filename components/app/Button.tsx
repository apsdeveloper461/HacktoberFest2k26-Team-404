// App buttons: compact, one accent (signal) for the primary action only.
import type { ButtonHTMLAttributes } from "react";
import { cx } from "./cx";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
export type ButtonSize = "sm" | "md";

const base =
  "inline-flex select-none items-center justify-center gap-1.5 whitespace-nowrap rounded-[4px] font-medium transition-[background-color,border-color,color,opacity] duration-150 ease-snap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal disabled:pointer-events-none disabled:opacity-40";

const variants: Record<ButtonVariant, string> = {
  primary: "bg-signal text-ink hover:bg-[#e3ff86] active:bg-signal-deep",
  secondary:
    "border border-line bg-ink-raised text-chalk hover:border-[#4b4d44] hover:bg-[#21221d]",
  ghost: "text-muted hover:bg-white/[0.06] hover:text-chalk",
  danger: "bg-[#ff8a7a] text-ink hover:bg-[#ff9d8f] active:bg-[#f2705e]",
};

const sizes: Record<ButtonSize, string> = {
  sm: "h-8 px-2.5 text-[13px]",
  md: "h-9 px-3.5 text-sm",
};

/** Shared with links styled as buttons (`<Link className={buttonClasses()}>`). */
export function buttonClasses(
  variant: ButtonVariant = "secondary",
  size: ButtonSize = "sm",
  className?: string,
) {
  return cx(base, variants[variant], sizes[size], className);
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

export function Button({
  variant = "secondary",
  size = "sm",
  className,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={buttonClasses(variant, size, className)}
      {...props}
    />
  );
}

type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  /** Required: icon-only controls need an accessible name. */
  label: string;
};

export function IconButton({
  label,
  className,
  type = "button",
  ...props
}: IconButtonProps) {
  return (
    <button
      type={type}
      aria-label={label}
      title={label}
      className={cx(
        base,
        "size-8 text-muted hover:bg-white/[0.06] hover:text-chalk",
        className,
      )}
      {...props}
    />
  );
}
