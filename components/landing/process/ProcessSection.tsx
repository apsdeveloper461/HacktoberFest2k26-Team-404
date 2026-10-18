// 03 — From thought to structure.
// Desktop with motion: a pinned, scrubbed scene (ProcessPinned).
// Mobile, tablet or reduced motion: four stacked steps, each with the drawing
// at that stage. CSS picks one; both are real content.
import { processSteps } from "../content";
import { ProcessPinned } from "./ProcessPinned";
import { StructureScene } from "./StructureScene";

export function ProcessSection() {
  return (
    <section
      id="how"
      data-theme="dark"
      aria-labelledby="how-title"
      className="cs-blueprint relative bg-ink text-chalk"
    >
      <div className="hidden lg:motion-safe:block">
        <ProcessPinned
          steps={processSteps}
          scene={<StructureScene stage={4} className="absolute inset-0 h-full w-full" />}
        />
      </div>

      <div className="mx-auto max-w-[1440px] px-(--gutter) py-[clamp(72px,10vw,128px)] lg:motion-safe:hidden">
        <p className="cs-eyebrow text-muted">03 — From thought to structure</p>
        <h2 className="cs-display mt-5 max-w-[14ch] text-[clamp(2.2rem,6vw,3.6rem)] leading-[0.95] lg:motion-safe:hidden">
          Four moves from marker to model.
        </h2>
        <ol className="mt-12 flex flex-col gap-14 md:gap-20">
          {processSteps.map((step, i) => (
            <li key={step.id} className="grid gap-6 md:grid-cols-12 md:items-center md:gap-8">
              <div className={i % 2 ? "md:order-2 md:col-span-5 md:col-start-8" : "md:col-span-5"}>
                <p className="cs-display text-[3.2rem] leading-none text-signal tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-3 text-[22px] font-semibold tracking-[-0.015em]">{step.title}</h3>
                <p className="mt-2 max-w-[34rem] text-[16px] leading-relaxed text-chalk/75">{step.body}</p>
                {step.note && <p className="cs-mono mt-2 text-[11px] text-muted">{step.note}</p>}
              </div>
              <div className={i % 2 ? "md:order-1 md:col-span-7" : "md:col-span-7 md:col-start-6"}>
                <div className="cs-blueprint-fine relative aspect-[4/3] w-full bg-ink-raised shadow-[0_0_0_1px_var(--color-line)]">
                  <StructureScene stage={(i + 1) as 1 | 2 | 3 | 4} className="absolute inset-0 h-full w-full" />
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
