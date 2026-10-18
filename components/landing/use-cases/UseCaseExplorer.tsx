"use client";

// An editorial index of specimen plates. Selecting a sketch type swaps the
// plate: its drawing, its interactive output, its explanation and status.
import { AnimatePresence, MotionConfig, motion } from "motion/react";
import { useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { useCases, type UseCaseId } from "../content";
import { cx } from "../cx";
import { ArchitectureOutput, ErOutput, FlowOutput, WireframeOutput } from "./SpecimenOutputs";

const outputs: Record<UseCaseId, () => ReactNode> = {
  wireframe: () => <WireframeOutput />,
  er: () => <ErOutput />,
  architecture: () => <ArchitectureOutput />,
  flow: () => <FlowOutput />,
};

const snap = [0.16, 1, 0.3, 1] as const;

export function UseCaseExplorer({ sketches }: { sketches: Record<UseCaseId, ReactNode> }) {
  const [selected, setSelected] = useState<UseCaseId>("wireframe");
  const tabs = useRef<Array<HTMLButtonElement | null>>([]);
  const index = useCases.findIndex((u) => u.id === selected);
  const current = useCases[index];

  const onKey = (event: KeyboardEvent<HTMLButtonElement>) => {
    const keys: Record<string, number> = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 };
    let to: number | undefined;
    if (event.key in keys) to = (index + keys[event.key] + useCases.length) % useCases.length;
    if (event.key === "Home") to = 0;
    if (event.key === "End") to = useCases.length - 1;
    if (to === undefined) return;
    event.preventDefault();
    setSelected(useCases[to].id);
    tabs.current[to]?.focus();
  };

  return (
    <MotionConfig reducedMotion="user">
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
        <div
          role="tablist"
          aria-label="Sketch types"
          className="cs-no-scrollbar -mx-(--gutter) flex snap-x gap-2 overflow-x-auto px-(--gutter) lg:col-span-5 lg:mx-0 lg:flex-col lg:gap-0 lg:overflow-visible lg:px-0"
        >
          {useCases.map((u, i) => {
            const on = u.id === selected;
            return (
              <button
                key={u.id}
                ref={(el) => {
                  tabs.current[i] = el;
                }}
                id={`usecase-tab-${u.id}`}
                role="tab"
                type="button"
                aria-selected={on}
                aria-controls="usecase-panel"
                tabIndex={on ? 0 : -1}
                onClick={() => setSelected(u.id)}
                onKeyDown={onKey}
                className={cx(
                  "group relative shrink-0 snap-start text-left transition-colors duration-300",
                  "max-lg:min-h-11 max-lg:rounded-[2px] max-lg:border max-lg:px-3.5 max-lg:py-2",
                  on ? "max-lg:border-ink max-lg:bg-ink max-lg:text-chalk" : "max-lg:border-ink/20 max-lg:text-ink",
                  "lg:grid lg:grid-cols-[3rem_1fr_auto] lg:items-baseline lg:gap-x-4 lg:border-t lg:border-ink/15 lg:py-6 lg:last:border-b",
                )}
              >
                <span className={cx("cs-mono text-[11px] max-lg:hidden", on ? "text-ink" : "text-muted-ink")}>{u.index}</span>
                <span
                  className={cx(
                    "relative w-fit text-[15px] font-medium lg:text-[clamp(1.8rem,2.7vw,2.7rem)] lg:leading-[1] lg:font-[600]",
                    on ? "lg:text-ink" : "lg:text-ink/40 lg:group-hover:text-ink/70",
                  )}
                >
                  <span className="max-lg:hidden cs-display">{u.title}</span>
                  <span className="lg:hidden">{u.title}</span>
                  <span
                    aria-hidden="true"
                    className={cx(
                      "absolute -bottom-1.5 left-0 h-[3px] w-full origin-left bg-signal-deep transition-transform duration-500 ease-snap max-lg:hidden",
                      on ? "scale-x-100" : "scale-x-0",
                    )}
                  />
                </span>
                <span
                  className={cx(
                    "cs-mono text-[10px] tracking-[0.08em] uppercase max-lg:hidden",
                    u.status === "First build" ? "bg-signal px-1.5 py-0.5 text-ink" : "border border-ink/30 px-1.5 py-0.5 text-muted-ink",
                  )}
                >
                  {u.status}
                </span>
              </button>
            );
          })}
        </div>

        <div
          id="usecase-panel"
          role="tabpanel"
          aria-labelledby={`usecase-tab-${selected}`}
          className="lg:col-span-7"
        >
          <div className="flex items-center justify-between border-b border-ink/15 pb-3">
            <p className="cs-mono text-[11px] text-muted-ink">
              plate {current.index} · {current.title.toLowerCase()}
            </p>
            <p
              className={cx(
                "cs-mono text-[10px] tracking-[0.08em] uppercase",
                current.status === "First build" ? "bg-signal px-1.5 py-0.5 text-ink" : "border border-ink/30 px-1.5 py-0.5 text-muted-ink",
              )}
            >
              {current.status === "First build" ? "First build" : "Planned — illustration"}
            </p>
          </div>

          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={selected}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.35, ease: snap }}
            >
              <div className="relative mt-6 grid gap-4 md:block md:aspect-[16/11]">
                <div className="cs-dotgrid relative aspect-[520/340] bg-paper-light shadow-[0_0_0_1px_rgb(17_18_15/0.12)] md:absolute md:top-0 md:left-0 md:w-[64%]">
                  {sketches[selected]}
                  <span className="cs-mono absolute bottom-2 left-2.5 text-[10px] text-muted-ink">sketch</span>
                </div>
                <div className="relative aspect-[520/340] bg-ink text-chalk shadow-[0_0_0_1px_var(--color-line),0_30px_60px_-30px_rgb(17_18_15/0.6)] md:absolute md:right-0 md:bottom-0 md:w-[64%]">
                  {outputs[selected]()}
                  <span className="cs-mono pointer-events-none absolute top-0 right-0 -translate-y-full bg-ink px-1.5 py-0.5 text-[10px] text-signal">output</span>
                </div>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-[1fr_auto] sm:items-start">
                <p className="max-w-[36rem] text-[16px] leading-relaxed text-ink/80">{current.summary}</p>
                <ul className="flex flex-wrap gap-1.5 sm:max-w-[15rem] sm:justify-end" aria-label="Produces">
                  {current.produces.map((p) => (
                    <li key={p} className="cs-mono border border-ink/20 px-1.5 py-0.5 text-[10px] text-muted-ink">
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </MotionConfig>
  );
}
