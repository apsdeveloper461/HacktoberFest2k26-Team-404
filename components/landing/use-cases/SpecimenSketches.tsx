// The "before" half of each specimen plate: four different kinds of drawing,
// in graphite. Server components (seeded rough paths).
import type { ReactNode } from "react";
import { sketch } from "../sketch/rough";
import { HandText, Stroke } from "../sketch/primitives";

export const SPECIMEN_VIEW = { w: 520, h: 340 } as const;

function Frame({ children, label }: { children: ReactNode; label: string }) {
  return (
    <svg
      viewBox={`0 0 ${SPECIMEN_VIEW.w} ${SPECIMEN_VIEW.h}`}
      className="absolute inset-0 h-full w-full"
      role="img"
      aria-label={label}
    >
      <g className="text-graphite">{children}</g>
    </svg>
  );
}

export function WireframeSketch() {
  const s = sketch(4101);
  return (
    <Frame label="Sketch of a profile settings card with a name field, an email-updates toggle and a Save button.">
      <Stroke d={s.rect(30, 24, 460, 292, { roughness: 1.2 })} w={2} />
      <HandText x={54} y={70} size={24}>
        Profile
      </HandText>
      <Stroke d={s.ellipse(420, 72, 30, 30)} w={1.8} />
      <Stroke d={s.ellipse(420, 64, 10, 10, { roughness: 0.6 }) + s.curve([[400, 96], [420, 84], [440, 96]])} w={1.5} />
      <HandText x={54} y={110} size={13} className="opacity-70">
        name
      </HandText>
      <Stroke d={s.rect(54, 118, 250, 36)} w={1.8} />
      <HandText x={66} y={142} size={14} className="opacity-55">
        Ada L.
      </HandText>
      <Stroke d={s.ellipse(80, 196, 26, 13, { roughness: 0.8 })} w={1.8} />
      <Stroke d={s.ellipse(94, 196, 8, 8, { roughness: 0.6 })} w={1.6} />
      <HandText x={118} y={202} size={15}>
        email updates
      </HandText>
      <HandText x={250} y={244} size={14} className="opacity-70">
        on / off?
      </HandText>
      <Stroke d={s.arrow([[246, 238], [170, 226], [112, 212]], { head: 8 })} w={1.3} className="opacity-70" />
      <Stroke d={s.rect(54, 248, 110, 40, { roughness: 1.3 })} w={2.1} />
      <HandText x={109} y={274} size={16} textAnchor="middle">
        SAVE
      </HandText>
    </Frame>
  );
}

export function ErSketch() {
  const s = sketch(4202);
  const entity = (x: number, y: number, w: number, h: number, name: string, fields: string[]) => (
    <g key={name}>
      <Stroke d={s.rect(x, y, w, h, { roughness: 1.1 })} w={1.9} />
      <Stroke d={s.line(x, y + 32, x + w, y + 32, { passes: 1 })} w={1.5} />
      <HandText x={x + 14} y={y + 23} size={18}>
        {name}
      </HandText>
      {fields.map((f, i) => (
        <HandText key={f} x={x + 14} y={y + 56 + i * 22} size={13} className="opacity-75">
          {f}
        </HandText>
      ))}
    </g>
  );
  const foot = (x: number, y: number, dir: 1 | -1) =>
    s.line(x, y, x + dir * 14, y - 8, { passes: 1, overshoot: 0 }) +
    s.line(x, y, x + dir * 14, y, { passes: 1, overshoot: 0 }) +
    s.line(x, y, x + dir * 14, y + 8, { passes: 1, overshoot: 0 });
  return (
    <Frame label="Sketch of three database tables — users, projects and tasks — joined by crow's-foot relationship lines.">
      {entity(24, 40, 140, 134, "users", ["id", "email", "name"])}
      {entity(196, 176, 142, 134, "projects", ["id", "owner_id", "title"])}
      {entity(368, 36, 132, 156, "tasks", ["id", "project_id", "title", "done"])}
      <Stroke d={s.curve([[164, 124], [184, 160], [180, 226], [196, 238]])} w={1.6} />
      <Stroke d={foot(196, 238, -1)} w={1.4} />
      <Stroke d={s.line(170, 116, 170, 132, { passes: 1 })} w={1.4} />
      <Stroke d={s.curve([[338, 238], [356, 218], [352, 160], [368, 146]])} w={1.6} />
      <Stroke d={foot(368, 146, -1)} w={1.4} />
      <HandText x={210} y={152} size={13} className="opacity-70">
        1 → many
      </HandText>
    </Frame>
  );
}

export function ArchitectureSketch() {
  const s = sketch(4303);
  const box = (x: number, y: number, w: number, h: number, label: string) => (
    <g key={label}>
      <Stroke d={s.rect(x, y, w, h, { roughness: 1.1 })} w={1.9} />
      <HandText x={x + w / 2} y={y + h / 2 + 6} size={17} textAnchor="middle">
        {label}
      </HandText>
    </g>
  );
  return (
    <Frame label="Sketch of a system: a web client calls an API, which talks to orders and users services that both write to one database.">
      {box(22, 142, 92, 56, "web")}
      {box(162, 142, 104, 56, "API")}
      {box(318, 58, 116, 52, "orders")}
      {box(318, 226, 116, 52, "users")}
      <Stroke d={s.cylinder(462, 136, 44, 64)} w={1.8} />
      <HandText x={484} y={230} size={15} textAnchor="middle">
        db
      </HandText>
      <Stroke d={s.arrow([[116, 170], [138, 168], [160, 170]], { head: 9 })} w={1.6} />
      <Stroke d={s.arrow([[266, 156], [292, 120], [316, 92]], { head: 9 })} w={1.6} />
      <Stroke d={s.arrow([[266, 186], [292, 222], [316, 246]], { head: 9 })} w={1.6} />
      <Stroke d={s.arrow([[436, 90], [452, 112], [462, 140]], { head: 9 })} w={1.6} />
      <Stroke d={s.arrow([[436, 250], [452, 228], [462, 204]], { head: 9 })} w={1.6} />
      <HandText x={170} y={128} size={14} className="opacity-70">
        auth here?
      </HandText>
    </Frame>
  );
}

export function FlowSketch() {
  const s = sketch(4404);
  const node = (x: number, y: number, w: number, label: string) => (
    <g key={label}>
      <Stroke d={s.rect(x, y, w, 44, { roughness: 1 })} w={1.8} />
      <HandText x={x + w / 2} y={y + 28} size={16} textAnchor="middle">
        {label}
      </HandText>
    </g>
  );
  return (
    <Frame label="Sketch of a user flow: start, landing page, sign up, a 'verified?' decision leading to the dashboard or to resend email, then end.">
      <circle cx={34} cy={62} r={9} className="fill-graphite" />
      <Stroke d={s.arrow([[46, 62], [64, 62], [80, 62]], { head: 8 })} w={1.6} />
      {node(82, 40, 112, "landing")}
      <Stroke d={s.arrow([[196, 62], [214, 62], [232, 62]], { head: 8 })} w={1.6} />
      {node(234, 40, 112, "sign up")}
      <Stroke d={s.arrow([[290, 86], [290, 104], [290, 122]], { head: 8 })} w={1.6} />
      <Stroke
        d={s.polygon([
          [290, 124],
          [350, 160],
          [290, 196],
          [230, 160],
        ])}
        w={1.8}
      />
      <HandText x={290} y={166} size={14} textAnchor="middle">
        verified?
      </HandText>
      <Stroke d={s.arrow([[352, 160], [372, 160], [390, 160]], { head: 8 })} w={1.6} />
      <HandText x={358} y={150} size={12} className="opacity-70">
        yes
      </HandText>
      {node(392, 138, 116, "dashboard")}
      <Stroke d={s.arrow([[450, 184], [450, 216], [450, 240]], { head: 8 })} w={1.6} />
      <Stroke d={s.ellipse(450, 258, 14, 14, { roughness: 0.6 })} w={1.6} />
      <circle cx={450} cy={258} r={7} className="fill-graphite" />
      <Stroke d={s.arrow([[260, 190], [220, 220], [196, 236]], { head: 8 })} w={1.6} />
      <HandText x={230} y={212} size={12} className="opacity-70">
        no
      </HandText>
      {node(64, 236, 132, "resend email")}
      <Stroke d={s.arrow([[110, 234], [140, 170], [228, 160]], { head: 8 })} w={1.4} className="opacity-70" />
    </Frame>
  );
}
