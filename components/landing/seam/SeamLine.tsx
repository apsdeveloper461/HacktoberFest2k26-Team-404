"use client";

// The page's transition device: a hand-drawn rule that straightens into a
// precise boundary as you scroll past it. Under reduced motion the straight
// rule is shown and nothing moves.
import { useEffect, useRef } from "react";
import { getGsap, media } from "../motion";

const W = 1440;
const MID = 24;

function pathFor(offsets: number[], t: number) {
  const step = W / (offsets.length - 1);
  return offsets
    .map((o, i) => `${i ? "L" : "M"}${(i * step).toFixed(1)} ${(MID + o * (1 - t)).toFixed(2)}`)
    .join("");
}

export function SeamLine({ offsets, label, tone = "ink" }: { offsets: number[]; label: string; tone?: "ink" | "chalk" }) {
  const root = useRef<HTMLDivElement>(null);
  const rough = useRef<SVGPathElement>(null);

  useEffect(() => {
    const el = root.current;
    const line = rough.current;
    if (!el || !line) return;
    const { gsap } = getGsap();
    const mm = gsap.matchMedia();
    mm.add(media.motionOk, () => {
      const ends = el.querySelectorAll("[data-seam-end]");
      gsap.set(ends, { opacity: 0, scale: 0.4 });
      const draw = (self: { progress: number }) => line.setAttribute("d", pathFor(offsets, self.progress));
      draw({ progress: 0 });
      const st = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: "top 92%",
          end: "top 38%",
          scrub: 0.4,
          onUpdate: draw,
          onRefresh: draw,
        },
      });
      st.to(ends, { opacity: 1, scale: 1, duration: 0.2 }, 0.8);
      return () => line.setAttribute("d", pathFor(offsets, 1));
    });
    return () => mm.revert();
  }, [offsets]);

  const color = tone === "ink" ? "text-ink" : "text-chalk";

  return (
    <div ref={root} aria-hidden="true" className={`pointer-events-none relative h-12 w-full ${color}`}>
      <svg viewBox={`0 0 ${W} 48`} preserveAspectRatio="none" className="absolute inset-0 h-full w-full overflow-visible">
        <path
          ref={rough}
          d={pathFor(offsets, 1)}
          fill="none"
          stroke="currentColor"
          strokeOpacity={0.55}
          strokeWidth={1.4}
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      <span data-seam-end="" className="absolute top-[21px] left-(--gutter) size-[7px] border border-current bg-signal" />
      <span data-seam-end="" className="absolute top-[21px] right-(--gutter) size-[7px] border border-current bg-signal" />
      <span data-seam-end="" className="cs-mono absolute top-[30px] right-(--gutter) pt-1 text-[10px] opacity-60">
        {label}
      </span>
    </div>
  );
}
