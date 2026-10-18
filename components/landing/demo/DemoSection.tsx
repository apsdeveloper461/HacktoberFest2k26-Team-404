// 02 — The compile table. Server shell around the interactive demo; the
// paper sketch is rendered here and handed to the client island.
import { DemoSheet } from "./DemoSheet";
import { SketchDemo } from "./SketchDemo";

export function DemoSection() {
  return (
    <section
      id="demo"
      data-theme="light"
      aria-labelledby="demo-title"
      className="cs-on-light relative bg-paper text-ink"
    >
      <div className="mx-auto max-w-[1440px] px-(--gutter) pt-[clamp(64px,9vw,128px)] pb-[clamp(72px,10vw,140px)]">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <p className="cs-eyebrow text-muted-ink">02 — The compile table</p>
            <h2 id="demo-title" className="cs-display mt-5 text-[clamp(2.3rem,4.6vw,4.4rem)] leading-[0.95]">
              Watch one sketch become something you can click.
            </h2>
          </div>
          <div className="lg:col-span-4 lg:col-start-9">
            <p className="text-[16px] leading-relaxed text-ink/75">
              Press compile and follow the page as it’s read, structured and rendered. Then use it:
              add a task, filter the list, rename the heading — every edit lands in the project JSON.
            </p>
            <p className="cs-mono mt-4 flex gap-2 text-[11px] leading-relaxed text-muted-ink">
              <span aria-hidden="true" className="mt-[5px] size-1.5 shrink-0 bg-ink" />
              Interactive concept demo — the transformation is simulated in your browser. Nothing is
              uploaded.
            </p>
          </div>
        </div>

        <div className="mt-12 lg:mt-16">
          <SketchDemo sheet={<DemoSheet />} />
        </div>
      </div>
    </section>
  );
}
