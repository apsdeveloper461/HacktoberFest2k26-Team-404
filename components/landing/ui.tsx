// Shared button styles and the few icons the page needs.
import type { SVGProps } from "react";

const base =
  "inline-flex min-h-12 items-center justify-center gap-2.5 rounded-[2px] px-5 text-[15px] font-medium tracking-[-0.01em] transition-[background-color,color,border-color,translate] duration-200 ease-snap active:translate-y-px";

export const btn = {
  signal: `${base} bg-signal text-ink hover:bg-[#e8ff94]`,
  ghostDark: `${base} border border-chalk/25 text-chalk hover:border-chalk/70 hover:bg-chalk/[0.04]`,
  ghostLight: `${base} border border-ink/25 text-ink hover:border-ink/70 hover:bg-ink/[0.04]`,
  inkSolid: `${base} bg-ink text-chalk hover:bg-graphite`,
} as const;

type IconProps = SVGProps<SVGSVGElement>;

function Icon({ children, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 16 16"
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="square"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      {children}
    </svg>
  );
}

export function ArrowRight(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M2.5 8h10M9 4.5 12.5 8 9 11.5" />
    </Icon>
  );
}

export function ArrowUpRight(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M4.5 11.5 11.5 4.5M5.5 4.5h6v6" />
    </Icon>
  );
}

export function ArrowDown(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M8 2.5v10M4.5 9 8 12.5 11.5 9" />
    </Icon>
  );
}
