// 05 — Inside the transformation. A concept visualization of the planned
// pipeline, annotated with what's real today and what's next.
import { Fragment, type ReactNode } from "react";
import { ledger } from "../content";
import { cx } from "../cx";
import { sketch } from "../sketch/rough";
import { Stroke } from "../sketch/primitives";
import { PipelineFlow } from "./PipelineFlow";

const VIEW = "0 0 240 180";

function MiniSketch({ dim = false }: { dim?: boolean }) {
  const s = sketch(5101);
  return (
    <g className={cx("text-graphite", dim && "opacity-45")}>
      <Stroke d={s.rect(30, 22, 180, 136, { roughness: 1 })} w={1.6} />
      <Stroke d={s.scribble(44, 46, 90, 2.4)} w={1.4} />
      <Stroke d={s.rect(44, 66, 96, 22, { roughness: 0.8 })} w={1.4} />
      <Stroke d={s.rect(146, 66, 50, 22, { roughness: 1 })} w={1.6} />
      {[104, 122, 140].map((y) => (
        <Stroke key={y} d={s.rect(44, y - 6, 10, 10, { roughness: 0.5, passes: 1 }) + s.line(62, y - 1, 150, y - 1, { passes: 1 })} w={1.2} />
      ))}
    </g>
  );
}

const regions = [
  { x: 40, y: 36, w: 100, h: 20 },
  { x: 40, y: 62, w: 104, h: 30 },
  { x: 142, y: 62, w: 58, h: 30 },
  { x: 40, y: 94, w: 120, h: 56 },
];

const plates: { title: string; note: string; tech: string; art: ReactNode }[] = [
  {
    title: "Input",
    note: "A photo of the sketch.",
    tech: "multipart · field “image”",
    art: (
      <>
        <rect x={20} y={12} width={200} height={156} fill="#F5F4EE" transform="rotate(-2 120 90)" />
        <g transform="rotate(-2 120 90)">
          <MiniSketch />
        </g>
      </>
    ),
  },
  {
    title: "Regions",
    note: "The vision model marks what it sees.",
    tech: "Gemma 4 · intended model",
    art: (
      <>
        <rect x={20} y={12} width={200} height={156} fill="#F5F4EE" />
        <MiniSketch dim />
        {regions.map((r, i) => (
          <rect key={i} x={r.x} y={r.y} width={r.w} height={r.h} fill="rgb(217 255 99 / 0.45)" stroke="#11120F" strokeWidth={1} strokeDasharray="3 2" />
        ))}
      </>
    ),
  },
  {
    title: "Relations",
    note: "Boxes are grouped into a hierarchy.",
    tech: "layout · containment",
    art: (
      <g className="text-chalk">
        <rect x={86} y={18} width={68} height={22} fill="none" stroke="currentColor" />
        <text x={120} y={33} textAnchor="middle" fontSize={10} className="cs-mono" fill="currentColor">page</text>
        <path d="M120 40v16M42 56h156M42 56v14M98 56v14M152 56v14M198 56v14" stroke="var(--color-muted)" fill="none" />
        {[
          { x: 20, t: "text" },
          { x: 76, t: "input" },
          { x: 130, t: "button" },
          { x: 176, t: "list" },
        ].map((n) => (
          <g key={n.t}>
            <rect x={n.x} y={70} width={44} height={20} fill={n.t === "button" ? "#D9FF63" : "none"} stroke={n.t === "button" ? "#D9FF63" : "currentColor"} strokeOpacity={0.7} />
            <text x={n.x + 22} y={84} textAnchor="middle" fontSize={9} className="cs-mono" fill={n.t === "button" ? "#11120F" : "currentColor"}>
              {n.t}
            </text>
          </g>
        ))}
        <path d="M198 90v14M178 104h40M178 104v10M198 104v10M218 104v10" stroke="var(--color-muted)" fill="none" />
        {[170, 190, 210].map((x) => (
          <rect key={x} x={x} y={114} width={16} height={12} fill="none" stroke="currentColor" strokeOpacity={0.45} />
        ))}
        <text x={20} y={160} fontSize={10} className="cs-mono" fill="var(--color-muted)">depth from bounding boxes</text>
      </g>
    ),
  },
  {
    title: "Contract",
    note: "Checked before anything renders.",
    tech: "zod · wireframeProjectSchema",
    art: (
      <foreignObject x={0} y={0} width={240} height={180}>
        <pre className="cs-mono h-full overflow-hidden px-4 pt-6 pb-3 text-[10.5px] leading-[1.55] text-muted">
          {"{\n  "}
          <span className="text-chalk/70">&quot;id&quot;</span>: <span className="text-chalk">&quot;button-1&quot;</span>,{"\n  "}
          <span className="text-chalk/70">&quot;type&quot;</span>: <span className="text-chalk">&quot;button&quot;</span>,{"\n  "}
          <span className="text-chalk/70">&quot;text&quot;</span>: <span className="text-chalk">&quot;Add&quot;</span>,{"\n  "}
          <span className="text-chalk/70">&quot;x&quot;</span>: <span className="text-signal">328</span>, <span className="text-chalk/70">&quot;y&quot;</span>: <span className="text-signal">210</span>,{"\n  "}
          <span className="text-chalk/70">&quot;width&quot;</span>: <span className="text-signal">148</span>,{"\n  "}
          <span className="text-chalk/70">&quot;height&quot;</span>: <span className="text-signal">52</span>,{"\n  "}
          <span className="text-chalk/70">&quot;style&quot;</span>: {"{ … }\n}"}
        </pre>
      </foreignObject>
    ),
  },
  {
    title: "Preview",
    note: "React renders the JSON as a page.",
    tech: "/workspace · editable",
    art: (
      <>
        <rect x={20} y={12} width={200} height={156} fill="#F1F0E8" />
        <rect x={20} y={12} width={200} height={20} fill="#E3E3D9" />
        <text x={34} y={58} fontSize={15} fill="#11120F" className="cs-display">Launch checklist</text>
        <rect x={34} y={70} width={108} height={22} fill="#fff" stroke="rgb(17 18 15 / 0.2)" />
        <rect x={148} y={70} width={58} height={22} fill="#D9FF63" />
        <text x={177} y={85} fontSize={10} textAnchor="middle" fill="#11120F" fontWeight={600}>Add</text>
        {[108, 126, 144].map((y, i) => (
          <g key={y}>
            <rect x={34} y={y - 7} width={10} height={10} fill={i < 2 ? "#11120F" : "none"} stroke="#11120F" />
            <rect x={52} y={y - 4} width={i === 1 ? 70 : 92} height={4} fill={i < 2 ? "#92958B" : "#11120F"} />
          </g>
        ))}
      </>
    ),
  },
];

function Connector({ index }: { index: number }) {
  return (
    <li aria-hidden="true" data-connector={index} className="flex items-center justify-center max-lg:h-12 lg:w-8 lg:shrink-0 lg:pb-24">
      <svg viewBox="0 0 32 12" className="hidden w-8 overflow-visible lg:block">
        <path d="M0 6H30M25 1l5 5-5 5" pathLength={1} fill="none" stroke="var(--color-signal)" strokeWidth={1.5} />
      </svg>
      <svg viewBox="0 0 12 40" className="h-10 overflow-visible lg:hidden">
        <path d="M6 0V38M1 33l5 5 5-5" pathLength={1} fill="none" stroke="var(--color-signal)" strokeWidth={1.5} />
      </svg>
    </li>
  );
}

export function PipelineSection() {
  return (
    <section
      id="inside"
      data-theme="dark"
      aria-labelledby="inside-title"
      className="relative bg-ink text-chalk"
    >
      <div className="mx-auto max-w-[1440px] px-(--gutter) pt-[clamp(72px,10vw,140px)] pb-[clamp(72px,10vw,128px)]">
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-6">
            <p className="cs-eyebrow text-muted">05 — Inside the transformation</p>
            <h2 id="inside-title" className="cs-display mt-5 text-[clamp(2.3rem,4.6vw,4.4rem)] leading-[0.95]">
              Pixels in.
              <br />
              Structure out.
            </h2>
          </div>
          <div className="lg:col-span-5 lg:col-start-8">
            <p className="text-[16px] leading-relaxed text-chalk/75">
              The photo goes to a server route that asks a multimodal vision model to name the
              elements it can see and where they sit. Its answer is parsed and validated against the
              project schema — only then does the browser render anything. The JSON, not the photo,
              is what you edit.
            </p>
          </div>
        </div>

        <div className="mt-14 hidden grid-cols-[4fr_1fr] gap-8 lg:grid" aria-hidden="true">
          <p className="cs-mono flex items-center gap-3 text-[11px] text-muted">
            <span className="h-px flex-1 bg-line" />
            POST /api/parse — server route
            <span className="h-px flex-1 bg-line" />
          </p>
          <p className="cs-mono flex items-center gap-3 text-[11px] text-muted">
            <span className="h-px flex-1 bg-line" />
            browser
            <span className="h-px flex-1 bg-line" />
          </p>
        </div>

        <PipelineFlow className="mt-6 flex flex-col lg:flex-row lg:items-stretch">
          {plates.map((plate, i) => (
            <Fragment key={plate.title}>
              {i > 0 && <Connector index={i} />}
              <li data-plate="" className="grid gap-4 md:grid-cols-2 md:items-center lg:flex lg:min-w-0 lg:flex-1 lg:flex-col lg:items-stretch">
                <div className="cs-blueprint-fine relative aspect-[4/3] bg-ink-raised shadow-[0_0_0_1px_var(--color-line)]">
                  <svg viewBox={VIEW} className="absolute inset-0 h-full w-full" aria-hidden="true">
                    {plate.art}
                  </svg>
                  <span className="cs-mono absolute top-0 left-0 bg-ink px-1.5 py-0.5 text-[10px] text-muted">0{i + 1}</span>
                </div>
                <div>
                  <h3 className="text-[17px] font-semibold tracking-[-0.01em]">{plate.title}</h3>
                  <p className="mt-1 text-[14px] leading-snug text-chalk/70">{plate.note}</p>
                  <p className="cs-mono mt-2 text-[10.5px] text-signal/85">{plate.tech}</p>
                </div>
              </li>
            </Fragment>
          ))}
        </PipelineFlow>

        <p className="cs-mono mt-8 text-[11px] text-muted">
          Concept visualization of the planned pipeline. Real model output will vary with the sketch.
        </p>

        <div className="mt-16 grid gap-10 border-t border-line pt-10 md:grid-cols-2">
          {(
            [
              ["First build — in development", ledger.today],
              ["Next — roadmap", ledger.next],
            ] as const
          ).map(([title, items]) => (
            <div key={title}>
              <h3 className="cs-eyebrow text-muted">{title}</h3>
              <ul className="mt-4 flex flex-col">
                {items.map((item) => (
                  <li key={item.label} className="flex min-h-11 items-center justify-between gap-4 border-b border-line text-[15px]">
                    <span className={item.state === "next" ? "text-chalk/70" : "text-chalk"}>{item.label}</span>
                    <span
                      className={cx(
                        "cs-mono shrink-0 text-[10px] tracking-[0.08em] uppercase",
                        item.state === "today" ? "text-signal" : item.state === "progress" ? "text-chalk/70" : "text-muted",
                      )}
                    >
                      {item.state === "today" ? "● first build" : item.state === "progress" ? "◐ in progress" : "○ planned"}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
