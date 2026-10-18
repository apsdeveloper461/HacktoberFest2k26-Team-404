// The ChalkScript glyph: a hand-drawn square whose bottom-left corner has
// already snapped into a precise boundary, with one selection handle.
import { cx } from "./cx";

export function BrandGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={cx("shrink-0", className)} aria-hidden="true" focusable="false">
      <path
        d="M3.6 4.3C8.6 3.6 14 4.5 20.3 3.8M19.7 3.3C20.4 8.7 19.5 13.8 20.2 19.6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <path d="M20 20H4V4.6" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <rect x="2.4" y="18.4" width="3.2" height="3.2" fill="var(--color-signal)" stroke="var(--color-ink)" strokeWidth="0.8" />
    </svg>
  );
}

export function BrandMark({ className }: { className?: string }) {
  return (
    <span className={cx("inline-flex items-center gap-2", className)}>
      <BrandGlyph className="size-6" />
      <span className="cs-display text-[19px] leading-none tracking-[-0.02em]">
        ChalkScript
        <span className="cs-mono ml-1 align-[0.32em] text-[10px] font-normal tracking-normal opacity-70">AI</span>
      </span>
    </span>
  );
}
