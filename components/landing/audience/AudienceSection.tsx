// 07 — Who it's for. Typographic rows, each with a tiny diagram that
// resolves from sketch to crisp on hover/focus (always resolved on touch).
import type { ReactNode } from "react";
import { audiences, type Audience } from "../content";
import { sketch } from "../sketch/rough";
import { Stroke } from "../sketch/primitives";

function Glyph({ kind, seed }: { kind: Audience["glyph"]; seed: number }) {
  const s = sketch(seed);
  let rough: ReactNode;
  let crisp: ReactNode;

  switch (kind) {
    case "class":
      rough = (
        <>
          <Stroke d={s.rect(18, 8, 84, 64)} w={1.5} />
          <Stroke d={s.line(18, 26, 102, 26, { passes: 1 }) + s.line(18, 50, 102, 50, { passes: 1 })} w={1.3} />
          <Stroke d={s.scribble(26, 38, 50, 1.6) + s.scribble(26, 61, 60, 1.6)} w={1.1} />
        </>
      );
      crisp = (
        <>
          <rect x={18} y={8} width={84} height={64} fill="none" stroke="currentColor" />
          <path d="M18 26h84M18 50h84" stroke="currentColor" />
          <text x={60} y={21} fontSize={9} textAnchor="middle" className="cs-mono" fill="currentColor">Order</text>
          <text x={24} y={41} fontSize={8} className="cs-mono" fill="currentColor">+ id: uuid</text>
          <text x={24} y={64} fontSize={8} className="cs-mono" fill="currentColor">+ total()</text>
        </>
      );
      break;
    case "wireframe":
      rough = (
        <>
          <Stroke d={s.rect(10, 8, 100, 64)} w={1.5} />
          <Stroke d={s.line(10, 20, 110, 20, { passes: 1 })} w={1.2} />
          <Stroke d={s.scribble(18, 34, 56, 2)} w={1.2} />
          <Stroke d={s.rect(18, 46, 50, 14, { passes: 1 }) + s.rect(74, 46, 26, 14)} w={1.3} />
        </>
      );
      crisp = (
        <>
          <rect x={10} y={8} width={100} height={64} fill="none" stroke="currentColor" />
          <path d="M10 20h100" stroke="currentColor" />
          <rect x={18} y={30} width={52} height={6} fill="currentColor" opacity={0.5} />
          <rect x={18} y={46} width={50} height={14} fill="none" stroke="currentColor" />
          <rect x={74} y={46} width={26} height={14} fill="var(--color-signal)" stroke="var(--color-ink)" />
        </>
      );
      break;
    case "flow":
      rough = (
        <>
          <Stroke d={s.ellipse(14, 40, 4, 4)} w={1.5} />
          <Stroke d={s.arrow([[20, 40], [32, 40]], { head: 5 })} w={1.2} />
          <Stroke d={s.rect(34, 30, 30, 20, { passes: 1 })} w={1.4} />
          <Stroke d={s.arrow([[66, 40], [76, 40]], { head: 5 })} w={1.2} />
          <Stroke d={s.polygon([[92, 26], [106, 40], [92, 54], [78, 40]])} w={1.4} />
        </>
      );
      crisp = (
        <>
          <circle cx={14} cy={40} r={4} fill="currentColor" />
          <path d="M19 40h13M64 40h12" stroke="currentColor" />
          <rect x={34} y={30} width={30} height={20} rx={5} fill="none" stroke="currentColor" />
          <path d="M92 26 106 40 92 54 78 40Z" fill="var(--color-signal)" stroke="var(--color-ink)" />
        </>
      );
      break;
    case "er":
      rough = (
        <>
          <Stroke d={s.rect(8, 16, 40, 48, { passes: 1 }) + s.rect(72, 16, 40, 48, { passes: 1 })} w={1.4} />
          <Stroke d={s.line(8, 28, 48, 28, { passes: 1 }) + s.line(72, 28, 112, 28, { passes: 1 })} w={1.2} />
          <Stroke d={s.line(48, 40, 72, 40, { passes: 1 }) + s.line(64, 40, 72, 34, { passes: 1 }) + s.line(64, 40, 72, 46, { passes: 1 })} w={1.2} />
        </>
      );
      crisp = (
        <>
          <rect x={8} y={16} width={40} height={48} fill="none" stroke="currentColor" />
          <rect x={72} y={16} width={40} height={48} fill="none" stroke="currentColor" />
          <rect x={8} y={16} width={40} height={12} fill="currentColor" opacity={0.25} />
          <rect x={72} y={16} width={40} height={12} fill="var(--color-signal)" />
          <path d="M48 40h24M64 40l8-6M64 40l8 6" stroke="currentColor" />
        </>
      );
      break;
  }

  return (
    <svg viewBox="0 0 120 80" className="h-20 w-30 shrink-0 text-ink" aria-hidden="true" focusable="false">
      <g className="cs-glyph-rough text-graphite">{rough}</g>
      <g className="cs-glyph-crisp">{crisp}</g>
    </svg>
  );
}

export function AudienceSection() {
  return (
    <section
      id="who"
      data-theme="light"
      aria-labelledby="who-title"
      className="cs-on-light relative bg-paper text-ink"
    >
      <div className="mx-auto max-w-[1440px] px-(--gutter) pt-[clamp(56px,8vw,112px)] pb-[clamp(72px,10vw,140px)]">
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <p className="cs-eyebrow text-muted-ink">07 — Who it’s for</p>
            <h2 id="who-title" className="cs-display mt-5 text-[clamp(2.3rem,4.6vw,4.4rem)] leading-[0.95]">
              For people who think
              <br />
              with a marker in hand.
            </h2>
          </div>
        </div>

        <ul className="mt-14 border-t border-ink/20">
          {audiences.map((a, i) => (
            <li
              key={a.role}
              className="cs-row group grid gap-4 border-b border-ink/20 py-7 md:grid-cols-12 md:items-center md:gap-8 md:py-9"
            >
              <span className="cs-mono text-[11px] text-muted-ink md:col-span-1">{a.index}</span>
              <h3 className="cs-display text-[clamp(1.7rem,2.8vw,2.6rem)] leading-[1] md:col-span-5">{a.role}</h3>
              <p className="max-w-[34rem] text-[16px] leading-relaxed text-ink/75 md:col-span-4">{a.scenario}</p>
              <div className="md:col-span-2 md:justify-self-end">
                <Glyph kind={a.glyph} seed={6100 + i} />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
