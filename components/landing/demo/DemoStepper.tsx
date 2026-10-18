// 01 Sketch · 02 Read · 03 Structure · 04 Interact — each step is a button,
// so the transformation can be inspected without watching it play.
import type { CSSProperties } from "react";
import { cx } from "../cx";
import { STAGES, type Stage } from "./useDemoMachine";

const labels: Record<Stage, string> = {
  sketch: "Sketch",
  reading: "Read",
  structuring: "Structure",
  interactive: "Interact",
};

type DemoStepperProps = {
  stage: Stage;
  running: boolean;
  run: number;
  dwell: { reading: number; structuring: number };
  onGo: (stage: Stage) => void;
};

export function DemoStepper({ stage, running, run, dwell, onGo }: DemoStepperProps) {
  const current = STAGES.indexOf(stage);
  return (
    <ol aria-label="Demo stages" className="grid w-full grid-cols-4 gap-px bg-ink/15 shadow-[0_0_0_1px_rgb(17_18_15/0.15)]">
      {STAGES.map((s, i) => {
        const timed = running && s === stage && (s === "reading" || s === "structuring");
        return (
          <li key={s} className="bg-paper-light">
            <button
              type="button"
              onClick={() => onGo(s)}
              aria-current={s === stage ? "step" : undefined}
              className={cx(
                "relative flex min-h-14 w-full flex-col items-start justify-center gap-0.5 px-3 text-left transition-colors duration-200",
                s === stage ? "bg-chalk" : "hover:bg-chalk/60",
              )}
            >
              <span className="cs-mono text-[10px] text-muted-ink">0{i + 1}</span>
              <span className={cx("text-[14px] font-medium", i <= current ? "text-ink" : "text-muted-ink")}>
                {labels[s]}
              </span>
              <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-[3px] overflow-hidden bg-ink/[0.07]">
                {i < current && <span className="absolute inset-0 bg-ink" />}
                {i === current &&
                  (timed ? (
                    <span
                      key={`${run}-${s}`}
                      className="cs-fill absolute inset-0 bg-ink"
                      style={{ "--dur": `${dwell[s as "reading" | "structuring"]}ms` } as CSSProperties}
                    />
                  ) : (
                    <span className="absolute inset-0 bg-signal-deep" />
                  ))}
              </span>
            </button>
          </li>
        );
      })}
    </ol>
  );
}
