// The paper side of the demo: a graphite wireframe of the Launch checklist
// page, with an engineer's notes in the margin. Server component.
import { sketch } from "../sketch/rough";
import { HandText, Stroke } from "../sketch/primitives";
import { SHEET_VIEW, initialTasks } from "./demo-project";

export function DemoSheet() {
  const s = sketch(2207);

  const page = s.rect(28, 28, 470, 504, { roughness: 1.2 });
  const links = s.line(300, 62, 336, 62, { passes: 1 }) + s.line(352, 62, 402, 62, { passes: 1 });
  const avatar = s.ellipse(465, 60, 19, 18, { roughness: 1 }) + s.ellipse(465, 55, 6, 6, { roughness: 0.6 });
  const divider = s.line(28, 96, 498, 96, { roughness: 1 });
  const sub = s.scribble(50, 178, 282, 2.4) + s.scribble(50, 194, 196, 2.4);
  const input = s.rect(50, 214, 270, 44, { roughness: 1 });
  const button = s.rect(332, 214, 140, 44, { roughness: 1.3 });
  const tabsUnderline = s.line(48, 311, 76, 311, { bowing: 2, passes: 1 });
  const list = s.rect(44, 324, 434, 166, { roughness: 0.9, passes: 1 });
  const rows = initialTasks.map((task, i) => {
    const y = 358 + i * 46;
    return {
      y,
      box: s.rect(62, y - 13, 24, 24, { roughness: 0.7 }),
      check: task.done ? s.check(66, y - 10, 16) : "",
    };
  });

  const toButton = s.arrow(
    [
      [512, 226],
      [494, 230],
      [480, 236],
    ],
    { roughness: 0.5, head: 9 },
  );
  const toTabs = s.arrow(
    [
      [508, 300],
      [360, 296],
      [214, 300],
    ],
    { roughness: 1, head: 9 },
  );
  const brace = s.brace(488, 330, 486, 1);
  const toCount = s.arrow(
    [
      [512, 520],
      [330, 526],
      [158, 514],
    ],
    { roughness: 1, head: 9 },
  );

  return (
    <svg
      viewBox={`0 0 ${SHEET_VIEW.w} ${SHEET_VIEW.h}`}
      className="absolute inset-0 h-full w-full"
      aria-hidden="true"
      focusable="false"
    >
      <g className="text-graphite">
        <Stroke d={page} w={2} />
        <HandText x={48} y={70} size={20} className="cs-read">
          Launchpad
        </HandText>
        <Stroke d={links} w={1.6} />
        <Stroke d={avatar} w={1.6} />
        <Stroke d={divider} w={1.6} />

        <HandText x={46} y={148} size={31} className="cs-read">
          Launch checklist
        </HandText>
        <Stroke d={sub} w={1.4} className="opacity-60" />

        <Stroke d={input} w={1.8} />
        <HandText x={66} y={242} size={15} className="cs-read opacity-55">
          add a task…
        </HandText>
        <Stroke d={button} w={2.1} />
        <HandText x={402} y={243} size={18} textAnchor="middle" className="cs-read">
          ADD
        </HandText>

        <HandText x={50} y={304} size={16} className="cs-read">
          All
        </HandText>
        <HandText x={88} y={304} size={16} className="cs-read opacity-65">
          Open
        </HandText>
        <HandText x={146} y={304} size={16} className="cs-read opacity-65">
          Done
        </HandText>
        <Stroke d={tabsUnderline} w={1.6} />

        <Stroke d={list} w={1.3} className="opacity-70" />
        {rows.map((row, i) => (
          <g key={row.y}>
            <Stroke d={row.box} w={1.6} />
            {row.check && <Stroke d={row.check} w={1.8} />}
            <HandText x={100} y={row.y + 6} size={17} className="cs-read">
              {initialTasks[i].label}
            </HandText>
          </g>
        ))}
        <HandText x={48} y={516} size={13} className="cs-read opacity-70">
          2 of 3 done
        </HandText>
      </g>

      {/* Margin notes */}
      <g className="text-muted-ink">
        <HandText x={30} y={18} size={12}>
          p.1 — launch page, v0
        </HandText>
        <HandText x={514} y={230} size={15}>
          primary!
        </HandText>
        <Stroke d={toButton} w={1.3} />
        <HandText x={514} y={304} size={15}>
          filters
        </HandText>
        <Stroke d={toTabs} w={1.2} className="opacity-70" />
        <Stroke d={brace} w={1.3} />
        <HandText x={514} y={402} size={14}>
          list =
        </HandText>
        <HandText x={514} y={420} size={14}>
          container
        </HandText>
        <HandText x={516} y={524} size={14}>
          live count
        </HandText>
        <Stroke d={toCount} w={1.2} className="opacity-70" />
      </g>
    </svg>
  );
}
