// A word in a headline that becomes a component: a hand-drawn box is traced
// around it, then a precise boundary with selection handles snaps into place.
import type { CSSProperties, ReactNode } from "react";
import { cx } from "../cx";
import { sketch } from "./rough";
import { Stroke, timing } from "./primitives";

type BoundaryWordProps = {
  children: ReactNode;
  /** Component name shown on the selection tag, e.g. "<Software />". */
  tag: string;
  /** "compile": rough → crisp on load. "resolved": already crisp, no rough trace. */
  variant?: "compile" | "resolved";
  /** ms offset for the whole sequence. */
  at?: number;
  seed?: number;
  className?: string;
};

const handle = "absolute size-[7px] border border-signal bg-ink";

export function BoundaryWord({
  children,
  tag,
  variant = "compile",
  at = 0,
  seed = 7,
  className,
}: BoundaryWordProps) {
  const compile = variant === "compile";
  const rough = compile ? sketch(seed).rect(8, 10, 384, 92, { roughness: 2.6, bowing: 2 }) : "";
  const crispAt = at + 560;

  return (
    <span className={cx("relative inline-block", className)}>
      {children}
      {compile && (
        <svg
          viewBox="0 0 400 112"
          preserveAspectRatio="none"
          aria-hidden="true"
          focusable="false"
          className="pointer-events-none absolute -inset-x-[0.14em] -top-[0.02em] -bottom-[0.1em] h-[calc(100%+0.12em)] w-[calc(100%+0.28em)] overflow-visible text-chalk"
        >
          <g
            className="cs-recede"
            style={{ "--d": `${crispAt + 120}ms`, "--to": "0.28", "--dur": "500ms" } as CSSProperties}
          >
            <Stroke d={rough} w={2.4} draw delay={at} dur={540} />
          </g>
        </svg>
      )}
      <span
        aria-hidden="true"
        className={cx(
          "pointer-events-none absolute -inset-x-[0.08em] top-[0.06em] -bottom-[0.04em] border border-signal",
          compile && "cs-snap-in",
        )}
        style={compile ? timing(crispAt, 360) : undefined}
      >
        {(["-left-[4px] -top-[4px]", "-right-[4px] -top-[4px]", "-left-[4px] -bottom-[4px]", "-right-[4px] -bottom-[4px]"] as const).map(
          (pos, i) => (
            <span
              key={pos}
              className={cx(handle, pos, compile && "cs-pop-in")}
              style={compile ? timing(crispAt + 120 + i * 40) : undefined}
            />
          ),
        )}
        <span
          className={cx(
            "cs-mono absolute -top-[4px] left-[-1px] -translate-y-full bg-signal px-1.5 py-[3px] text-[11px] leading-none tracking-normal text-ink",
            compile && "cs-fade-in",
          )}
          style={compile ? timing(crispAt + 220, 300) : undefined}
        >
          {tag}
        </span>
      </span>
    </span>
  );
}
