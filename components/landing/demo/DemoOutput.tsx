// The digital side of the demo: what the "compiler" has produced so far.
import { AnimatePresence, motion } from "motion/react";
import type { ReactNode } from "react";
import type { WireframeProject } from "@/lib/project/schema";
import { cx } from "../cx";
import { DemoPreview } from "./DemoPreview";
import { depthOf, describe, typeTone, type Task } from "./demo-project";
import type { Stage } from "./useDemoMachine";

export type OutputTab = "preview" | "structure";

type DemoOutputProps = {
  stage: Stage;
  project: WireframeProject;
  tasks: Task[];
  onTasksChange: (tasks: Task[]) => void;
  tab: OutputTab;
  onTab: (tab: OutputTab) => void;
  highlight: string | null;
};

const snap = [0.16, 1, 0.3, 1] as const;

const stageNote: Record<Stage, string> = {
  sketch: "idle",
  reading: "reading regions…",
  structuring: "building structure…",
  interactive: "live",
};

export function DemoOutput({ stage, project, tasks, onTasksChange, tab, onTab, highlight }: DemoOutputProps) {
  return (
    <div className="flex h-full flex-col bg-ink text-chalk shadow-[0_0_0_1px_var(--color-line)]">
      <div className="flex min-h-11 items-center justify-between gap-3 border-b border-line px-3">
        <p className="cs-mono flex items-center gap-2 text-[11px] text-muted">
          <span
            aria-hidden="true"
            className={cx(
              "size-1.5 transition-colors duration-300",
              stage === "interactive" ? "bg-signal" : stage === "sketch" ? "bg-muted/50" : "bg-signal/60",
            )}
          />
          <span className="max-sm:hidden">output · </span>launch-checklist
        </p>
        {stage === "interactive" ? (
          <div role="tablist" aria-label="Output view" className="flex">
            {(["preview", "structure"] as const).map((t) => (
              <button
                key={t}
                id={`demo-tab-${t}`}
                role="tab"
                type="button"
                aria-selected={tab === t}
                aria-controls="demo-output-panel"
                tabIndex={tab === t ? 0 : -1}
                onClick={() => onTab(t)}
                onKeyDown={(e) => {
                  if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
                    e.preventDefault();
                    const next = t === "preview" ? "structure" : "preview";
                    onTab(next);
                    document.getElementById(`demo-tab-${next}`)?.focus();
                  }
                }}
                className={cx(
                  "cs-mono min-h-9 px-3 text-[11px] capitalize transition-colors duration-150",
                  tab === t ? "bg-chalk text-ink" : "text-muted hover:text-chalk",
                )}
              >
                {t}
              </button>
            ))}
          </div>
        ) : (
          <p className="cs-mono text-[11px] text-muted">{stageNote[stage]}</p>
        )}
      </div>

      <div
        id="demo-output-panel"
        role={stage === "interactive" ? "tabpanel" : undefined}
        aria-labelledby={stage === "interactive" ? `demo-tab-${tab}` : undefined}
        className={cx("relative min-h-0 flex-1", stage === "structuring" ? "overflow-visible" : "overflow-hidden")}
      >
        <AnimatePresence mode="popLayout" initial={false}>
          {stage === "sketch" && (
            <Layer key="idle">
              <Idle />
            </Layer>
          )}
          {stage === "reading" && (
            <Layer key="reading">
              <Detections project={project} />
            </Layer>
          )}
          {stage === "structuring" && (
            <Layer key="structuring">
              <Tree project={project} />
            </Layer>
          )}
          {stage === "interactive" && (
            <motion.div
              key="interactive"
              className="absolute inset-0"
              initial={{ clipPath: "inset(0 100% 0 0)" }}
              animate={{ clipPath: "inset(0 0% 0 0)" }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.75, ease: snap }}
            >
              {tab === "preview" ? (
                <DemoPreview project={project} tasks={tasks} onTasksChange={onTasksChange} highlight={highlight} />
              ) : (
                <JsonView value={project} />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function Layer({ children }: { children: ReactNode }) {
  return (
    <motion.div
      className="absolute inset-0"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
    >
      {children}
    </motion.div>
  );
}

function Idle() {
  return (
    <div className="cs-blueprint-fine flex h-full flex-col items-center justify-center gap-3 px-6 text-center">
      <svg viewBox="0 0 64 48" className="w-16 text-line" aria-hidden="true">
        <rect x="1" y="1" width="62" height="46" fill="none" stroke="currentColor" strokeDasharray="4 4" />
        <path d="M12 16h26M12 24h18M12 32h30" stroke="currentColor" strokeWidth="2" />
      </svg>
      <p className="cs-mono text-[12px] text-chalk/80">No structure yet.</p>
      <p className="max-w-[16rem] text-[13px] leading-relaxed text-muted">
        Press <span className="text-chalk">Compile sketch</span>, or step through 01–04 yourself.
      </p>
    </div>
  );
}

function Chip({ type }: { type: keyof typeof typeTone }) {
  return (
    <span className={cx("cs-mono inline-flex h-5 w-[74px] shrink-0 items-center justify-center text-[10px]", typeTone[type])}>
      {type}
    </span>
  );
}

function Detections({ project }: { project: WireframeProject }) {
  return (
    <div className="cs-scroll h-full overflow-y-auto p-3">
      <p className="cs-mono mb-2 text-[10px] tracking-[0.12em] text-muted uppercase">Regions found</p>
      <ol className="flex flex-col gap-1">
        {project.elements.map((el, i) => (
          <motion.li
            key={el.id}
            className="flex min-h-8 items-center gap-2.5 border-b border-line/70 text-[12px]"
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.35 + i * 0.15, duration: 0.3, ease: snap }}
          >
            <Chip type={el.type} />
            <span className="cs-mono text-chalk/90">{el.id}</span>
            <span className="truncate text-muted">{describe(el)}</span>
          </motion.li>
        ))}
      </ol>
    </div>
  );
}

function Tree({ project }: { project: WireframeProject }) {
  return (
    <div className="h-full p-3">
      <p className="cs-mono mb-2 text-[10px] tracking-[0.12em] text-muted uppercase">
        elements[{project.elements.length}] · canvas {project.canvas.width}×{project.canvas.height}
      </p>
      <div className="flex flex-col gap-1.5">
        {project.elements.map((el, i) => {
          const depth = depthOf(el, project.elements);
          return (
            <motion.div
              key={el.id}
              layoutId={`region-${el.id}`}
              className="flex min-h-8 items-center gap-2.5 bg-ink-raised px-2 text-[12px] shadow-[inset_0_0_0_1px_var(--color-line)]"
              style={{ marginLeft: depth * 22 }}
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, ease: snap, delay: i * 0.03 }}
            >
              {depth > 0 && <span className="cs-mono -ml-1 text-muted">└</span>}
              <Chip type={el.type} />
              <span className="cs-mono text-chalk/90">{el.id}</span>
              <span className="cs-mono ml-auto shrink-0 text-[10px] text-muted max-sm:hidden">
                {el.x},{el.y} · {el.width}×{el.height}
              </span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

function JsonView({ value }: { value: unknown }) {
  const text = JSON.stringify(value, null, 2);
  const parts = text.split(/("(?:[^"\\]|\\.)*"|-?\d+(?:\.\d+)?|\btrue\b|\bfalse\b|\bnull\b)/g);
  return (
    <pre className="cs-mono cs-scroll h-full overflow-auto p-3 text-[11.5px] leading-[1.55] text-muted">
      <code>
        {parts.map((part, i) => {
          if (i % 2 === 0) return part;
          const isKey = part.startsWith('"') && /^\s*:/.test(parts[i + 1] ?? "");
          const tone = isKey
            ? "text-chalk/70"
            : part.startsWith('"')
              ? "text-chalk"
              : "text-signal";
          return (
            <span key={i} className={tone}>
              {part}
            </span>
          );
        })}
      </code>
    </pre>
  );
}
