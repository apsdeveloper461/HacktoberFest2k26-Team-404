// 08 — Final invitation. The hero composition returns, resolved: the same
// figure, every chalk line now a precise boundary.
import Link from "next/link";
import type { CSSProperties } from "react";
import { links } from "../content";
import { EnterReveal } from "../EnterReveal";
import { HERO_VIEW, heroBoxes as b, type Box } from "../hero/hero-layout";
import { BoundaryWord } from "../sketch/BoundaryWord";
import { ArrowRight, ArrowUpRight, btn } from "../ui";

const rectPath = ({ x, y, w, h }: Box) => `M${x} ${y}h${w}v${h}h${-w}Z`;
const d = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;

const labelled: Array<[keyof typeof b, string]> = [
  ["nav", "nav-1"],
  ["heading", "heading-1"],
  ["sub", "text-1"],
  ["input", "input-1"],
  ["button", "button-1"],
  ["tabs", "tabs-1"],
  ["list", "list-1"],
  ["image", "image-1"],
  ["footer", "text-2"],
];

function ResolvedFigure() {
  return (
    <svg viewBox={`0 0 ${HERO_VIEW.w} ${HERO_VIEW.h}`} className="h-auto w-full" aria-hidden="true" focusable="false">
      <path d="M40 22H760M40 16v12M760 16v12" stroke="var(--color-muted)" strokeWidth={1} className="cs-on-enter" style={d(100)} />
      <text x={400} y={14} textAnchor="middle" fontSize={11} fill="var(--color-muted)" className="cs-mono cs-on-enter" style={d(150)}>
        720 × 528
      </text>

      <path d={rectPath(b.frame)} pathLength={1} fill="none" stroke="var(--color-chalk)" strokeOpacity={0.9} strokeWidth={1.5} className="cs-draw-on-enter" style={d(0)} />
      <path d={`M40 78H760`} pathLength={1} fill="none" stroke="var(--color-chalk)" strokeOpacity={0.5} className="cs-draw-on-enter" style={d(250)} />

      {labelled.map(([key, id], i) => {
        const box = b[key];
        const isButton = key === "button";
        return (
          <g key={key}>
            {isButton && <rect x={box.x} y={box.y} width={box.w} height={box.h} fill="var(--color-signal)" className="cs-on-enter" style={d(700 + i * 90)} />}
            <path
              d={rectPath(box)}
              pathLength={1}
              fill="none"
              stroke={isButton ? "var(--color-signal)" : "var(--color-signal)"}
              strokeOpacity={isButton ? 1 : 0.75}
              strokeWidth={1.2}
              className="cs-draw-on-enter"
              style={{ ...d(300 + i * 90), "--dur": "700ms" } as CSSProperties}
            />
            <rect x={box.x - 3} y={box.y - 3} width={6} height={6} fill="var(--color-signal)" className="cs-on-enter" style={d(500 + i * 90)} />
            <text
              x={box.x + 6}
              y={box.y + 14}
              fontSize={10}
              fill={isButton ? "var(--color-ink)" : "var(--color-chalk)"}
              fillOpacity={isButton ? 1 : 0.65}
              className="cs-mono cs-on-enter"
              style={d(600 + i * 90)}
            >
              {isButton ? "button-1 · Add" : id}
            </text>
          </g>
        );
      })}

      {[410, 452, 494].map((y, i) => (
        <g key={y} className="cs-on-enter" style={d(1300 + i * 80)}>
          <rect x={78} y={y - 9} width={16} height={16} fill={i < 2 ? "var(--color-chalk)" : "none"} stroke="var(--color-chalk)" strokeOpacity={0.8} />
          <rect x={108} y={y - 2} width={i === 1 ? 150 : 120} height={4} fill="var(--color-chalk)" fillOpacity={i < 2 ? 0.35 : 0.8} />
        </g>
      ))}

      <text x={756} y={556} textAnchor="end" fontSize={11} fill="var(--color-signal)" className="cs-mono cs-on-enter" style={d(1500)}>
        elements[9] · validated
      </text>
    </svg>
  );
}

export function FinalCta() {
  return (
    <section
      id="early-access"
      data-theme="dark"
      aria-labelledby="final-title"
      className="cs-dust relative isolate overflow-hidden bg-ink text-chalk"
    >
      <div
        aria-hidden="true"
        className="cs-blueprint pointer-events-none absolute inset-0 [mask-image:radial-gradient(110%_80%_at_30%_60%,black_25%,transparent_80%)]"
      />
      <div className="relative mx-auto grid max-w-[1440px] gap-14 px-(--gutter) pt-[clamp(80px,11vw,160px)] pb-[clamp(72px,9vw,120px)] lg:grid-cols-12 lg:items-center lg:gap-8">
        <div className="lg:col-span-6">
          <p className="cs-eyebrow text-muted">08 — Early access</p>
          <h2 id="final-title" className="cs-display mt-7 text-[clamp(2.7rem,5.6vw,6rem)] leading-[0.94]">
            Put the marker down.
            <span className="block pt-[22px] md:pt-[0.2em]">
              Open the{" "}
              <span className="inline-block">
                <BoundaryWord tag="<Prototype />" variant="resolved">
                  prototype
                </BoundaryWord>
                <span className="ml-[0.12em]">.</span>
              </span>
            </span>
          </h2>
          <p className="mt-8 max-w-[34rem] text-[17px] leading-[1.65] text-chalk/78">
            ChalkScript AI is in early development. The first build turns hand-drawn website
            wireframes into editable previews; architecture, ER and flow diagrams are on the roadmap.
            Early access opens as the first build firms up — watch the repo to follow along.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link href={links.workspace} className={btn.signal}>
              Start with a sketch
              <ArrowRight />
            </Link>
            <a href={links.repo} target="_blank" rel="noopener noreferrer" className={btn.ghostDark}>
              Follow the build on GitHub
              <ArrowUpRight />
              <span className="cs-sr">(opens in a new tab)</span>
            </a>
          </div>
          <p className="cs-mono mt-6 text-[11px] text-muted">
            <span className="text-signal">●</span> /workspace is the in-progress first build · no account needed
          </p>
        </div>

        <EnterReveal className="lg:col-span-6">
          <figure>
            <ResolvedFigure />
            <figcaption className="cs-mono mt-3 text-[11px] text-muted">
              fig. 01, resolved — every chalk line is now a boundary.
            </figcaption>
          </figure>
        </EnterReveal>
      </div>
    </section>
  );
}
