// fig. 01: the whiteboard wireframe, in chalk. Server component — the rough
// paths are generated once at prerender with a fixed seed.
import type { CSSProperties } from "react";
import { sketch } from "../sketch/rough";
import { HandText, Stroke } from "../sketch/primitives";
import { HERO_VIEW, heroBoxes as b, heroTasks } from "./hero-layout";

type HeroSketchProps = {
  /** Play the draw-on choreography (the opening hero only). */
  animate?: boolean;
  /** Fade the list strokes once the live card has replaced them. */
  recedeList?: boolean;
  className?: string;
};

export function HeroSketch({ animate = false, recedeList = false, className }: HeroSketchProps) {
  const s = sketch(1101);
  const a = animate;

  const frame = s.rect(b.frame.x, b.frame.y, b.frame.w, b.frame.h, { roughness: 1.3 });
  const titlebar = s.line(b.frame.x, 78, b.frame.x + b.frame.w, 78, { roughness: 1.1 });
  const dots = [62, 82, 102].map((x) => s.ellipse(x, 57, 5.5, 5.5, { roughness: 0.8 }));
  const url = s.rect(b.url.x, b.url.y, b.url.w, b.url.h, { roughness: 0.7, passes: 1 });
  const navLinks = s.line(530, 112, 572, 112, { passes: 1 }) + s.line(592, 112, 646, 112, { passes: 1 });
  const avatar = s.rect(b.avatar.x, b.avatar.y, b.avatar.w, b.avatar.h, { passes: 1, roughness: 0.8 });
  const avatarX = s.cross(b.avatar.x + 4, b.avatar.y + 4, b.avatar.w - 8, b.avatar.h - 8, { roughness: 0.6 });
  const divider = s.line(b.frame.x, 140, b.frame.x + b.frame.w, 140, { roughness: 1 });
  const sub = s.scribble(72, 226, 318, 2.6) + s.scribble(72, 246, 250, 2.6);
  const input = s.rect(b.input.x, b.input.y, b.input.w, b.input.h, { roughness: 1 });
  const button = s.rect(b.button.x, b.button.y, b.button.w, b.button.h, { roughness: 1.2 });
  const tabsUnderline = s.line(70, 362, 100, 362, { bowing: 2, passes: 1 });
  const rows = heroTasks.map((_, i) => {
    const y = 410 + i * 42;
    return {
      y,
      box: s.rect(78, y - 12, 24, 24, { roughness: 0.7 }),
      check: i < 2 ? s.check(82, y - 9, 16) : "",
    };
  });
  const image = s.rect(b.image.x, b.image.y, b.image.w, b.image.h, { roughness: 1.1 });
  const imageX = s.cross(b.image.x + 8, b.image.y + 8, b.image.w - 16, b.image.h - 16, { roughness: 1 });

  // Engineer's annotations, drawn last.
  const dimension =
    s.line(40, 24, 356, 24, { passes: 1, overshoot: 0 }) +
    s.line(444, 24, 760, 24, { passes: 1, overshoot: 0 }) +
    s.line(40, 16, 40, 32, { passes: 1, overshoot: 0 }) +
    s.line(760, 16, 760, 32, { passes: 1, overshoot: 0 });
  const toButton = s.arrow(
    [
      [552, 398],
      [532, 372],
      [528, 330],
      [517, 304],
    ],
    { roughness: 0.8 },
  );
  const toList = s.arrow(
    [
      [550, 494],
      [536, 470],
      [528, 455],
    ],
    { roughness: 0.7, head: 9 },
  );
  const listBrace = s.brace(48, 388, 520, -1);

  return (
    <svg
      viewBox={`0 0 ${HERO_VIEW.w} ${HERO_VIEW.h}`}
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <g className="text-chalk/85">
        <Stroke d={frame} w={2.3} draw={a} delay={200} dur={1100} />
        <Stroke d={titlebar} w={1.9} draw={a} delay={620} dur={500} />
        {dots.map((d, i) => (
          <Stroke key={i} d={d} w={1.7} draw={a} delay={720 + i * 60} dur={260} />
        ))}
        <Stroke d={url} w={1.5} draw={a} delay={760} dur={500} />

        <HandText x={70} y={120} size={22} reveal={a} delay={860}>
          Launchpad
        </HandText>
        <Stroke d={navLinks} w={1.8} draw={a} delay={900} dur={400} />
        <Stroke d={avatar + avatarX} w={1.6} draw={a} delay={940} dur={450} />
        <Stroke d={divider} w={1.7} draw={a} delay={880} dur={600} />

        <HandText x={68} y={196} size={36} reveal={a} delay={1000}>
          Launch checklist
        </HandText>
        <Stroke d={sub} w={1.6} draw={a} delay={1080} dur={600} className="opacity-70" />

        <Stroke d={input} w={2} draw={a} delay={1140} dur={600} />
        <HandText x={88} y={303} size={17} reveal={a} delay={1320} className="opacity-60">
          add a task…
        </HandText>
        <Stroke d={button} w={2.2} draw={a} delay={1240} dur={600} />
        <HandText x={448} y={305} size={20} textAnchor="middle" reveal={a} delay={1420}>
          ADD
        </HandText>

        <g>
          <HandText x={70} y={356} size={17} reveal={a} delay={1340}>
            All
          </HandText>
          <HandText x={118} y={356} size={17} reveal={a} delay={1380} className="opacity-70">
            Open
          </HandText>
          <HandText x={184} y={356} size={17} reveal={a} delay={1420} className="opacity-70">
            Done
          </HandText>
          <Stroke d={tabsUnderline} w={1.8} draw={a} delay={1460} dur={300} />
        </g>

        <g
          className={recedeList ? "cs-recede" : undefined}
          style={recedeList ? ({ "--d": "2650ms", "--to": "0.16" } as CSSProperties) : undefined}
        >
          {rows.map((row, i) => (
            <g key={row.y}>
              <Stroke d={row.box} w={1.8} draw={a} delay={1460 + i * 110} dur={320} />
              {row.check && <Stroke d={row.check} w={2} draw={a} delay={1620 + i * 110} dur={260} />}
              <HandText x={116} y={row.y + 6} size={18} reveal={a} delay={1520 + i * 110}>
                {heroTasks[i]}
              </HandText>
            </g>
          ))}
        </g>

        <Stroke d={image + imageX} w={1.9} draw={a} delay={1180} dur={800} />
        <HandText x={68} y={556} size={14} reveal={a} delay={1760} className="opacity-70">
          2 of 3 done
        </HandText>
      </g>

      <g className="text-chalk/60">
        <Stroke d={dimension} w={1.3} draw={a} delay={1900} dur={600} />
        <HandText x={400} y={29} size={14} textAnchor="middle" reveal={a} delay={2050}>
          ≈ 720px
        </HandText>
        <HandText x={566} y={334} size={15} reveal={a} delay={2000}>
          hero img?
        </HandText>
        <Stroke d={toButton} w={1.6} draw={a} delay={2080} dur={500} />
        <HandText x={556} y={414} size={16} reveal={a} delay={2160}>
          make ADD the
        </HandText>
        <HandText x={556} y={434} size={16} reveal={a} delay={2200}>
          main action
        </HandText>
        <Stroke d={toList} w={1.5} draw={a} delay={2260} dur={400} />
        <HandText x={556} y={512} size={16} reveal={a} delay={2320}>
          tick = done
        </HandText>
        <Stroke d={listBrace} w={1.4} draw={a} delay={2300} dur={400} />
      </g>
    </svg>
  );
}
