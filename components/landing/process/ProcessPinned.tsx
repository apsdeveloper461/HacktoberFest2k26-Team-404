"use client";

// Desktop scroll scene: the section pins while one drawing gains structure.
// Registered only for wide screens without reduced motion; everywhere else
// the stacked version in ProcessSection is shown instead (CSS decides).
import { useEffect, useRef, useState, type ReactNode } from "react";
import type { ScrollTrigger as ScrollTriggerType } from "gsap/ScrollTrigger";
import type { ProcessStep } from "../content";
import { cx } from "../cx";
import { getGsap } from "../motion";
import { SCENE_LAYERS, SCENE_STATES, type SceneStage } from "./scene-layout";

// Timeline layout (in timeline seconds): hold, 3 transitions, hold.
const HOLD = 0.6;
const SEG = 1;
const stepAt = [HOLD * 0.5, HOLD + SEG * 0.5, HOLD + SEG * 1.5, HOLD + SEG * 2.5];
const TOTAL = HOLD * 2 + SEG * 3;

type ProcessPinnedProps = {
  steps: ProcessStep[];
  scene: ReactNode;
};

export function ProcessPinned({ steps, scene }: ProcessPinnedProps) {
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<ScrollTriggerType | null>(null);
  const [active, setActive] = useState(steps.length - 1);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const { gsap } = getGsap();
    const mm = gsap.matchMedia();

    mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
      const q = gsap.utils.selector(el);
      const layer = (name: string) => q(`[data-layer="${name}"]`);
      const set = (stage: SceneStage) =>
        Object.fromEntries(SCENE_LAYERS.map((name) => [name, SCENE_STATES[stage][name]]));
      const s1 = set(1);
      SCENE_LAYERS.forEach((name) => gsap.set(layer(name), { opacity: s1[name] }));
      gsap.set(q("[data-boundary]"), { strokeDasharray: "1 1", strokeDashoffset: 1 });
      gsap.set(q("[data-cursor]"), { x: 90, y: 70, opacity: 0 });

      const sync = (self: { progress: number }) => {
        const t = self.progress * TOTAL;
        setActive(t < HOLD + SEG * 0.5 ? 0 : t < HOLD + SEG * 1.5 ? 1 : t < HOLD + SEG * 2.5 ? 2 : 3);
      };

      const tl = gsap.timeline({
        defaults: { ease: "none", duration: SEG },
        scrollTrigger: {
          trigger: el,
          start: "top top",
          end: "+=230%",
          pin: true,
          scrub: 0.6,
          onUpdate: sync,
          onRefresh: sync,
        },
      });

      const to = (stage: SceneStage, at: number) => {
        const target = set(stage);
        // Crossfade in the middle of each segment so every stage gets a clean plateau.
        SCENE_LAYERS.forEach((name) =>
          tl.to(layer(name), { opacity: target[name], duration: SEG * 0.45 }, at + SEG * 0.28),
        );
      };

      tl.to({}, { duration: HOLD }, 0);
      to(2, HOLD);
      to(3, HOLD + SEG);
      tl.to(q("[data-boundary]"), { strokeDashoffset: 0, stagger: 0.03, duration: SEG * 0.5 }, HOLD + SEG + SEG * 0.3);
      to(4, HOLD + SEG * 2);
      tl.to(q("[data-cursor]"), { x: 0, y: 0, opacity: 1, duration: SEG * 0.5, ease: "power2.out" }, HOLD + SEG * 2.6);
      tl.to({}, { duration: HOLD }, HOLD + SEG * 3);

      trigger.current = tl.scrollTrigger ?? null;
      return () => {
        trigger.current = null;
      };
    });

    return () => mm.revert();
  }, []);

  const jump = (i: number) => {
    const st = trigger.current;
    if (!st) return;
    const top = st.start + (st.end - st.start) * (stepAt[i] / TOTAL);
    window.scrollTo({ top, behavior: "smooth" });
  };

  return (
    <div ref={root} className="relative h-svh min-h-[640px] overflow-hidden">
      <div className="mx-auto grid h-full max-w-[1440px] grid-cols-12 gap-8 px-(--gutter) pt-[calc(var(--header-h)+40px)] pb-12">
        <div className="col-span-4 flex flex-col">
          <p className="cs-eyebrow text-muted">03 — From thought to structure</p>
          <h2 id="how-title" className="cs-display mt-5 text-[clamp(2.2rem,3.6vw,3.6rem)] leading-[0.95]">
            Four moves from marker to model.
          </h2>

          <ol className="mt-auto flex flex-col gap-1">
            {steps.map((step, i) => (
              <li key={step.id}>
                <button
                  type="button"
                  onClick={() => jump(i)}
                  aria-current={active === i ? "step" : undefined}
                  className={cx(
                    "group grid w-full grid-cols-[3.2rem_1fr] gap-x-3 py-3 text-left transition-opacity duration-300",
                    active === i ? "opacity-100" : "opacity-40 hover:opacity-70",
                  )}
                >
                  <span className="cs-display row-span-2 text-[2.6rem] leading-[0.85] text-signal tabular-nums">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-[17px] font-semibold tracking-[-0.01em]">{step.title}</span>
                  <span
                    className={cx(
                      "grid text-[14px] leading-relaxed text-chalk/70 transition-[grid-template-rows] duration-500 ease-snap",
                      active === i ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                    )}
                  >
                    <span className="overflow-hidden">
                      {step.body}
                      {step.note && <span className="cs-mono mt-1 block text-[11px] text-muted">{step.note}</span>}
                    </span>
                  </span>
                </button>
              </li>
            ))}
          </ol>
        </div>

        <div className="col-span-8 flex items-center">
          <div className="relative w-full">
            <div className="flex items-center justify-between pb-3">
              <p className="cs-mono text-[11px] text-muted">fig. 03 — sign-up page, one drawing</p>
              <div className="flex items-center gap-1.5" aria-hidden="true">
                {steps.map((step, i) => (
                  <span
                    key={step.id}
                    className={cx("h-[3px] w-8 transition-colors duration-300", i <= active ? "bg-signal" : "bg-line")}
                  />
                ))}
              </div>
            </div>
            <div className="cs-blueprint-fine relative aspect-[4/3] max-h-[calc(100svh-var(--header-h)-140px)] w-full bg-ink-raised shadow-[0_0_0_1px_var(--color-line)]">
              {scene}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
