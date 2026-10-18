// 06 — Before / after: the opening sketch returns, now with its compiled twin.
import { HeroSketch } from "../hero/HeroSketch";
import { BeforeAfter } from "./BeforeAfter";

export function BeforeAfterSection() {
  return (
    <section id="before-after" data-theme="dark" aria-labelledby="before-after-title" className="relative bg-ink text-chalk">
      <div className="mx-auto grid max-w-[1440px] gap-6 px-(--gutter) pt-[clamp(64px,9vw,120px)] pb-10 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-7">
          <p className="cs-eyebrow text-muted">06 — Before / after</p>
          <h2 id="before-after-title" className="cs-display mt-5 text-[clamp(2.3rem,4.6vw,4.4rem)] leading-[0.95]">
            Same idea.
            <br />
            Now it has edges.
          </h2>
        </div>
        <p className="max-w-[30rem] text-[16px] leading-relaxed text-chalk/75 lg:col-span-4 lg:col-start-9">
          fig. 01 from the top of the page, beside the interface it describes. Every boundary on the
          right sits exactly where a chalk line was. Drag the divider, or focus it and use the arrow
          keys.
        </p>
      </div>
      <BeforeAfter before={<HeroSketch className="absolute inset-0 h-full w-full" />} />
      <p className="cs-sr">
        On the left, the hand-drawn Launch checklist wireframe. On the right, the same layout as a
        finished interface: navigation, heading, task input with an Add button, filters, three tasks
        and an image, each outlined where its sketched box used to be.
      </p>
    </section>
  );
}
