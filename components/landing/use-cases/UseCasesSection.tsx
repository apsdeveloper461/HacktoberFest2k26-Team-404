// 04 — One sketch, different possibilities.
import { ArchitectureSketch, ErSketch, FlowSketch, WireframeSketch } from "./SpecimenSketches";
import { UseCaseExplorer } from "./UseCaseExplorer";

export function UseCasesSection() {
  return (
    <section
      id="use-cases"
      data-theme="light"
      aria-labelledby="use-cases-title"
      className="cs-on-light relative bg-chalk text-ink"
    >
      <div className="mx-auto max-w-[1440px] px-(--gutter) pt-[clamp(64px,9vw,128px)] pb-[clamp(72px,10vw,140px)]">
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <p className="cs-eyebrow text-muted-ink">04 — One sketch, many shapes</p>
            <h2 id="use-cases-title" className="cs-display mt-5 text-[clamp(2.3rem,4.6vw,4.4rem)] leading-[0.95]">
              Different drawings.
              <br />
              Different software.
            </h2>
          </div>
          <p className="max-w-[30rem] text-[16px] leading-relaxed text-ink/75 lg:col-span-4 lg:col-start-9">
            Every kind of technical drawing carries a different structure. The first build reads
            website wireframes; the other plates show where the same idea is headed.
          </p>
        </div>

        <div className="mt-12 lg:mt-20">
          <UseCaseExplorer
            sketches={{
              wireframe: <WireframeSketch />,
              er: <ErSketch />,
              architecture: <ArchitectureSketch />,
              flow: <FlowSketch />,
            }}
          />
        </div>
      </div>
    </section>
  );
}
