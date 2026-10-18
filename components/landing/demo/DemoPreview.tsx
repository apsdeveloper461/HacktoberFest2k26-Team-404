// The compiled result: a small, working page rendered from the project JSON.
// Heading, copy, placeholder, button label/colour and the count all come from
// `project`; the task list is local application state.
import { useState, type FormEvent } from "react";
import type { WireframeElement, WireframeProject } from "@/lib/project/schema";
import { cx } from "../cx";
import type { Task } from "./demo-project";

type Filter = "all" | "open" | "done";

type DemoPreviewProps = {
  project: WireframeProject;
  tasks: Task[];
  onTasksChange: (tasks: Task[]) => void;
  highlight: string | null;
};

function finder(project: WireframeProject) {
  return (id: string): WireframeElement | undefined => project.elements.find((e) => e.id === id);
}

function Selected({ id, active }: { id: string; active: boolean }) {
  if (!active) return null;
  return (
    <span aria-hidden="true" className="pointer-events-none absolute -inset-1 border border-ink">
      <span className="cs-mono absolute -top-px left-[-1px] -translate-y-full bg-ink px-1 py-px text-[9px] leading-tight text-signal">
        {id}
      </span>
      {["-left-[3px] -top-[3px]", "-right-[3px] -top-[3px]", "-left-[3px] -bottom-[3px]", "-right-[3px] -bottom-[3px]"].map((p) => (
        <span key={p} className={cx("absolute size-[5px] border border-ink bg-signal", p)} />
      ))}
    </span>
  );
}

export function DemoPreview({ project, tasks, onTasksChange, highlight }: DemoPreviewProps) {
  const el = finder(project);
  const [filter, setFilter] = useState<Filter>("all");
  const [draft, setDraft] = useState("");

  const heading = el("heading-1");
  const copy = el("text-1");
  const input = el("input-1");
  const button = el("button-1");
  const count = el("text-2");

  const visible = tasks.filter((t) => (filter === "all" ? true : filter === "done" ? t.done : !t.done));

  const add = (event: FormEvent) => {
    event.preventDefault();
    const label = draft.trim().slice(0, 48);
    if (!label || tasks.length >= 7) return;
    onTasksChange([...tasks, { id: Math.max(0, ...tasks.map((t) => t.id)) + 1, label, done: false }]);
    setDraft("");
    setFilter((f) => (f === "done" ? "all" : f));
  };

  return (
    <div className="cs-on-light flex h-full flex-col bg-chalk text-ink">
      <div className="flex items-center justify-between border-b border-ink/10 px-4 py-2.5">
        <span className="text-[13px] font-semibold tracking-[-0.01em]">Launchpad</span>
        <span aria-hidden="true" className="size-6 rounded-full bg-paper ring-1 ring-ink/15" />
      </div>

      <div className="cs-scroll flex-1 overflow-y-auto px-4 pt-4 pb-3">
        <h3
          className="relative w-fit leading-[1.05] font-semibold tracking-[-0.025em]"
          style={{
            fontSize: `${Math.round((heading?.style.fontSize ?? 32) * 0.78)}px`,
            color: heading?.style.color,
          }}
        >
          {heading?.text}
          <Selected id="text#heading-1" active={highlight === "heading-1"} />
        </h3>
        <p className="mt-1.5 text-[13px] leading-snug" style={{ color: copy?.style.color }}>
          {copy?.text}
        </p>

        <form onSubmit={add} className="mt-4 flex gap-2">
          <label className="sr-only" htmlFor="demo-new-task">
            New task
          </label>
          <input
            id="demo-new-task"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder={input?.text}
            maxLength={48}
            className="min-h-10 min-w-0 flex-1 rounded-[2px] border border-ink/25 bg-white/60 px-3 text-[14px] placeholder:text-muted-ink focus:border-ink focus:outline-none"
          />
          <button
            type="submit"
            className="relative min-h-10 shrink-0 rounded-[2px] px-4 text-[14px] font-semibold transition-[filter] duration-150 hover:brightness-95"
            style={{
              backgroundColor: button?.style.backgroundColor,
              color: button?.style.color,
              boxShadow: button?.style.backgroundColor?.toUpperCase() === "#F1F0E8" ? "inset 0 0 0 1px #11120F" : undefined,
            }}
          >
            {button?.text}
            <Selected id="button#button-1" active={highlight === "button-1"} />
          </button>
        </form>

        <div role="group" aria-label="Filter tasks" className="mt-4 flex gap-1">
          {(["all", "open", "done"] as const).map((f) => (
            <button
              key={f}
              type="button"
              aria-pressed={filter === f}
              onClick={() => setFilter(f)}
              className={cx(
                "min-h-8 rounded-[2px] px-2.5 text-[12px] capitalize transition-colors duration-150",
                filter === f ? "bg-ink text-chalk" : "text-muted-ink hover:bg-ink/5",
              )}
            >
              {f}
            </button>
          ))}
        </div>

        <ul className="mt-2 flex flex-col border-t border-ink/10">
          {visible.map((task) => (
            <li key={task.id} className="group flex min-h-10 items-center gap-3 border-b border-ink/10">
              <label className="flex flex-1 cursor-pointer items-center gap-3 py-2">
                <input
                  type="checkbox"
                  checked={task.done}
                  onChange={() =>
                    onTasksChange(tasks.map((t) => (t.id === task.id ? { ...t, done: !t.done } : t)))
                  }
                  className="size-4 shrink-0 accent-ink"
                />
                <span className={cx("text-[14px]", task.done && "text-muted-ink line-through decoration-ink/40")}>
                  {task.label}
                </span>
              </label>
              <button
                type="button"
                onClick={() => onTasksChange(tasks.filter((t) => t.id !== task.id))}
                aria-label={`Remove “${task.label}”`}
                className="cs-mono min-h-8 px-2 text-[12px] text-muted-ink opacity-60 transition-opacity hover:opacity-100 focus-visible:opacity-100 md:opacity-0 md:group-hover:opacity-100"
              >
                ✕
              </button>
            </li>
          ))}
          {visible.length === 0 && (
            <li className="cs-mono py-3 text-[12px] text-muted-ink">Nothing here — try another filter.</li>
          )}
        </ul>
      </div>

      <p className="cs-mono border-t border-ink/10 px-4 py-2 text-[11px] text-muted-ink" aria-live="polite">
        {count?.text}
      </p>
    </div>
  );
}
