import type { ReactNode } from "react";
import { cx } from "./cx";

type BadgeTone = "neutral" | "signal" | "warn";

const tones: Record<BadgeTone, string> = {
  neutral: "border-line text-muted",
  signal: "border-signal/35 bg-signal/10 text-signal",
  warn: "border-[#f2c48d]/35 bg-[#f2c48d]/10 text-[#f2c48d]",
};

export function Badge({
  tone = "neutral",
  children,
  className,
}: {
  tone?: BadgeTone;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cx(
        "inline-flex h-5 items-center gap-1 whitespace-nowrap rounded-[3px] border px-1.5 font-tech text-[10.5px] uppercase tracking-[0.08em]",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

export function Kbd({ children }: { children: ReactNode }) {
  return (
    <kbd className="inline-flex h-[18px] min-w-[18px] items-center justify-center rounded-[3px] border border-line bg-ink-raised px-1 font-tech text-[10px] text-muted">
      {children}
    </kbd>
  );
}
