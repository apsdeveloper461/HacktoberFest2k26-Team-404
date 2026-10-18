"use client";

// 02 — The signature demo. A simulated, clearly labelled transformation of a
// paper sketch into a working page, driven by a small state machine and the
// real project-JSON contract.
import { LayoutGroup, MotionConfig, motion, useReducedMotion } from "motion/react";
import { useState, type CSSProperties, type ReactNode } from "react";
import type { ElementPatch } from "@/lib/project/schema";
import { updateElement } from "@/lib/project/update";
import { cx } from "../cx";
import { DemoInspector } from "./DemoInspector";
import { DemoOutput, type OutputTab } from "./DemoOutput";
import { DemoStepper } from "./DemoStepper";
import { initialProject, initialTasks, sheetPct, type Task } from "./demo-project";
import { useDemoMachine, type Stage } from "./useDemoMachine";

const DWELL = { reading: 2600, structuring: 2100 };
const DWELL_REDUCED = { reading: 900, structuring: 900 };
const snap = [0.16, 1, 0.3, 1] as const;

const announce: Record<Stage, string> = {
  sketch: "Sketch ready. Press Compile sketch to start.",
  reading: `Reading the sketch: ${initialProject.elements.length} regions found.`,
  structuring: `Structuring: ${initialProject.elements.length} elements written to the project JSON.`,
  interactive: "Interactive preview ready. Add tasks, filter the list, or edit the heading and button in the inspector.",
};

export function SketchDemo({ sheet }: { sheet: ReactNode }) {
  const reduce = useReducedMotion();
  const dwell = reduce ? DWELL_REDUCED : DWELL;
  const { stage, running, run, dispatch } = useDemoMachine(dwell);

  const [project, setProject] = useState(initialProject);
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [tab, setTab] = useState<OutputTab>("preview");
  const [focused, setFocused] = useState<string | null>(null);

  const restore = () => {
    setProject(initialProject);
    setTasks(initialTasks);
    setTab("preview");
    setFocused(null);
  };
  const compile = () => {
    if (running) return;
    restore();
    dispatch({ type: "compile" });
  };
  const reset = () => {
    restore();
    dispatch({ type: "reset" });
  };
  const changeTasks = (next: Task[]) => {
    setTasks(next);
    const done = next.filter((t) => t.done).length;
    setProject((p) => updateElement(p, "text-2", { text: `${done} of ${next.length} done` }));
  };
  const patch = (id: string, p: ElementPatch) => setProject((prev) => updateElement(prev, id, p));

  const compiled = stage === "structuring" || stage === "interactive";

  return (
    <MotionConfig reducedMotion="user">
      <LayoutGroup id="sketch-demo">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-stretch lg:justify-between">
          <div className="lg:w-[min(620px,58%)]">
            <DemoStepper stage={stage} running={running} run={run} dwell={dwell} onGo={(s) => dispatch({ type: "goto", stage: s })} />
          </div>
          <div className="flex gap-2">
            <button
              id="demo-compile"
              type="button"
              onClick={compile}
              aria-disabled={running}
              className={cx(
                "inline-flex min-h-14 flex-1 items-center justify-center gap-2.5 rounded-[2px] bg-ink px-6 text-[15px] font-medium text-chalk transition-colors duration-200 lg:flex-none",
                running ? "cursor-progress" : "hover:bg-graphite",
              )}
            >
              <span aria-hidden="true" className={cx("size-2 bg-signal", running && "animate-pulse")} />
              {running ? "Compiling…" : stage === "sketch" ? "Compile sketch" : "Compile again"}
            </button>
            <button
              type="button"
              onClick={reset}
              className="inline-flex min-h-14 items-center justify-center rounded-[2px] border border-ink/25 px-5 text-[15px] font-medium text-ink transition-colors duration-200 hover:border-ink"
            >
              Reset
            </button>
          </div>
        </div>
        <p aria-live="polite" className="cs-sr">
          {announce[stage]}
        </p>

        <div className="relative mt-8 grid gap-6 lg:mt-12 lg:grid-cols-12 lg:gap-x-8">
          {/* Paper */}
          <div data-stage={stage} className="lg:col-span-6 lg:row-start-1">
            <div
              className={cx(
                "relative transition-transform duration-700 ease-snap",
                stage === "sketch" ? "-rotate-[1.4deg]" : "rotate-0",
              )}
            >
              <div className="cs-dotgrid relative aspect-[640/560] w-full overflow-hidden bg-[#f5f4ee] shadow-[0_1px_0_rgb(17_18_15/0.06),0_30px_60px_-34px_rgb(17_18_15/0.55)]">
                {sheet}

                {stage === "reading" && (
                  <div
                    key={`scan-${run}`}
                    aria-hidden="true"
                    className="cs-scan-y pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,transparent_70%,rgb(217_255_99/0.35)_97%,#11120f_100%)]"
                    style={{ "--dur": `${Math.min(1600, dwell.reading - 400)}ms` } as CSSProperties}
                  />
                )}

                {stage === "reading" &&
                  project.elements.map((el, i) => (
                    <motion.div
                      key={el.id}
                      layoutId={`region-${el.id}`}
                      aria-hidden="true"
                      className="absolute border-[1.5px] border-dashed border-ink bg-signal/45"
                      style={sheetPct(el)}
                      initial={{ opacity: 0, scale: 1.04 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.35 + i * 0.15, duration: 0.3, ease: snap }}
                    >
                      <span className="cs-mono absolute -top-px left-[-1.5px] -translate-y-full bg-ink px-1 py-px text-[9px] leading-tight text-signal max-sm:hidden">
                        {el.type}
                      </span>
                    </motion.div>
                  ))}

                {compiled &&
                  project.elements.map((el) => (
                    <div
                      key={`trace-${el.id}`}
                      aria-hidden="true"
                      className="cs-fade-in pointer-events-none absolute shadow-[inset_0_0_0_1px_rgb(17_18_15/0.38)]"
                      style={{ ...sheetPct(el), "--d": "250ms" } as CSSProperties}
                    />
                  ))}

                {/* Tape */}
                <span aria-hidden="true" className="absolute -top-1 left-[8%] h-6 w-20 -rotate-6 bg-paper/70 shadow-[0_0_0_1px_rgb(17_18_15/0.06)]" />
                <span aria-hidden="true" className="absolute -top-1 right-[10%] h-6 w-16 rotate-3 bg-paper/70 shadow-[0_0_0_1px_rgb(17_18_15/0.06)]" />
              </div>
            </div>
            <p className="cs-mono mt-4 text-[11px] text-muted-ink">
              fig. 02 — the same idea on paper (illustration). Labels turn mono once they’re read.
            </p>
            <p className="cs-sr">
              Hand-drawn wireframe of the Launch checklist page: a top bar with an avatar, a heading,
              a line of copy, a task input with an Add button, All / Open / Done filters, a list of
              three tasks and a count. Margin notes say the button is primary, the list is a
              container and the count is live.
            </p>
          </div>

          {/* Compile path */}
          <svg
            aria-hidden="true"
            viewBox="0 0 100 160"
            preserveAspectRatio="none"
            className="hidden h-64 w-[calc(100%+4rem)] -translate-x-8 self-center lg:col-start-7 lg:row-start-1 lg:block"
          >
            <path
              d="M0 28 C 58 28, 42 132, 100 132"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeDasharray="4 6"
              vectorEffect="non-scaling-stroke"
              className={cx(
                "transition-colors duration-500",
                stage === "structuring" ? "cs-march text-ink" : compiled ? "text-ink/55" : "text-ink/20",
              )}
            />
            <rect x="96" y="128" width="8" height="8" className={compiled ? "fill-ink" : "fill-ink/20"} />
          </svg>

          {/* Output */}
          <div className="lg:col-span-5 lg:col-start-8 lg:row-start-1 lg:mt-16">
            <div className="h-[480px] sm:h-[520px]">
              <DemoOutput
                stage={stage}
                project={project}
                tasks={tasks}
                onTasksChange={changeTasks}
                tab={tab}
                onTab={setTab}
                highlight={focused}
              />
            </div>
            <DemoInspector project={project} enabled={stage === "interactive"} onPatch={patch} onFocusElement={setFocused} />
          </div>
        </div>
      </LayoutGroup>
    </MotionConfig>
  );
}
