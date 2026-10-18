"use client";

// Scroll-linked reading of the pipeline: each plate settles in as the
// connector leading to it is drawn. Content is fully visible without JS or
// with reduced motion; GSAP only sets the "before" state when it runs.
import { useEffect, useRef, type ReactNode } from "react";
import { getGsap, media } from "../motion";

export function PipelineFlow({ children, className }: { children: ReactNode; className?: string }) {
  const root = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const { gsap } = getGsap();
    const mm = gsap.matchMedia();
    mm.add(media.motionOk, () => {
      const plates = gsap.utils.toArray<HTMLElement>(el.querySelectorAll("[data-plate]"));
      const lines = gsap.utils.toArray<SVGPathElement>(el.querySelectorAll("[data-connector] path"));
      gsap.set(plates, { opacity: 0.18, y: 18 });
      gsap.set(lines, { strokeDasharray: "1 1", strokeDashoffset: 1 });
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: { trigger: el, start: "top 78%", end: "bottom 62%", scrub: 0.5 },
      });
      plates.forEach((plate, i) => {
        if (i > 0) {
          const pair = lines.filter((l) => l.closest("[data-connector]")?.getAttribute("data-connector") === String(i));
          tl.to(pair, { strokeDashoffset: 0, duration: 0.6 });
        }
        tl.to(plate, { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }, i === 0 ? 0 : "<0.25");
      });
    });
    return () => mm.revert();
  }, []);

  return (
    <ol ref={root} className={className}>
      {children}
    </ol>
  );
}
