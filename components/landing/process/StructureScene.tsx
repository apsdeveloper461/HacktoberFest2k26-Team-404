// One drawing, four layers of understanding. Server component; `stage` sets
// the static composition (used as-is on mobile / reduced motion, and as the
// no-JS fallback for the pinned desktop timeline).
import { sketch } from "../sketch/rough";
import { HandText, MonoText, Stroke } from "../sketch/primitives";
import { SCENE_STATES, SCENE_VIEW, boxPath, sceneRegions, type SceneStage } from "./scene-layout";

const sans = { fontFamily: "var(--font-geist-sans), system-ui, sans-serif" };

export function StructureScene({ stage, className }: { stage: SceneStage; className?: string }) {
  const s = sketch(3301);
  const o = SCENE_STATES[stage];

  const frame = s.rect(70, 50, 660, 500, { roughness: 1.3 });
  const image = s.rect(110, 100, 250, 190, { roughness: 1.1 }) + s.cross(120, 110, 230, 170, { roughness: 1 });
  const sub = s.scribble(402, 182, 268, 2.6) + s.scribble(402, 198, 196, 2.6);
  const fields = [222, 278, 334].map((y) => s.rect(400, y, 290, 42, { roughness: 1 }));
  const button = s.rect(400, 400, 150, 46, { roughness: 1.3 });
  const under = s.line(400, 492, 590, 492, { passes: 1, roughness: 0.6 });
  const list = s.rect(104, 316, 262, 170, { roughness: 0.9, passes: 1 });
  const bullets = [350, 392, 434].map((y) => s.ellipse(126, y, 4.5, 4.5, { roughness: 0.6 }) + s.scribble(142, y, 190, 2.4));
  const bracket = (x: number, y: number, dx: number, dy: number) => `M${x} ${y + dy}V${y}H${x + dx}`;

  return (
    <svg
      viewBox={`0 0 ${SCENE_VIEW.w} ${SCENE_VIEW.h}`}
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      {/* 0 — the sketch */}
      <g data-layer="sketch" style={{ opacity: o.sketch }} className="text-chalk/85">
        <Stroke d={frame} w={2.2} />
        <Stroke d={image} w={1.9} />
        <HandText x={398} y={152} size={34}>
          Join the beta
        </HandText>
        <Stroke d={sub} w={1.5} className="opacity-70" />
        {fields.map((d, i) => (
          <Stroke key={i} d={d} w={1.9} />
        ))}
        <HandText x={414} y={249} size={15} className="opacity-60">
          name
        </HandText>
        <HandText x={414} y={305} size={15} className="opacity-60">
          email
        </HandText>
        <HandText x={414} y={361} size={15} className="opacity-60">
          password
        </HandText>
        <Stroke d={button} w={2.2} />
        <HandText x={475} y={429} size={17} textAnchor="middle">
          SIGN UP
        </HandText>
        <HandText x={400} y={486} size={14} className="opacity-75">
          already have an account?
        </HandText>
        <Stroke d={under} w={1.2} className="opacity-60" />
        <Stroke d={list} w={1.3} className="opacity-70" />
        {bullets.map((d, i) => (
          <Stroke key={i} d={d} w={1.5} />
        ))}
      </g>

      {/* 1 — capture */}
      <g data-layer="capture" style={{ opacity: o.capture }} className="text-chalk">
        <path
          d={[
            bracket(40, 24, 40, 40),
            "M760 64V24H720",
            "M40 536V576H80",
            "M760 536V576H720",
          ].join("")}
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
        />
        <path d="M392 300h16M400 292v16" stroke="currentColor" strokeWidth={1.2} className="opacity-60" />
        <MonoText x={92} y={40} size={12} className="opacity-80">
          CAPTURE · whiteboard.jpg
        </MonoText>
      </g>

      {/* 2 — interpret: regions + types */}
      <g data-layer="interpret" style={{ opacity: o.interpret }} className="text-signal">
        {sceneRegions.map((r) => (
          <g key={r.id}>
            <path d={boxPath(r)} fill="rgb(217 255 99 / 0.07)" stroke="currentColor" strokeWidth={1.4} strokeDasharray="5 4" />
            <MonoText x={r.x + 2} y={r.y - 5} size={10}>
              {r.type}
            </MonoText>
          </g>
        ))}
      </g>

      {/* 3 — explore: rendered UI */}
      <g data-layer="explore" style={{ opacity: o.explore }}>
        <rect x={70} y={50} width={660} height={500} fill="#F1F0E8" />
        <rect x={104} y={94} width={262} height={202} fill="#2A2B26" />
        <path d="M104 296 186 206l52 52 34-30 94 68Z" fill="#3D3F37" />
        <circle cx={310} cy={150} r={20} fill="#D9FF63" />
        <text x={396} y={152} fontSize={32} fill="#11120F" className="cs-display">
          Join the beta
        </text>
        <text x={398} y={190} fontSize={14} fill="#5C5F56" style={sans}>
          Turn rough sketches into editable previews.
        </text>
        {[
          { y: 222, label: "Name" },
          { y: 278, label: "you@example.com" },
          { y: 334, label: "••••••••" },
        ].map((f) => (
          <g key={f.y}>
            <rect x={400} y={f.y} width={290} height={42} fill="#FFFFFF" stroke="rgb(17 18 15 / 0.22)" />
            <text x={414} y={f.y + 26} fontSize={14} fill="#5C5F56" style={sans}>
              {f.label}
            </text>
          </g>
        ))}
        <rect x={400} y={400} width={150} height={46} fill="#D9FF63" />
        <text x={475} y={428} fontSize={15} fontWeight={600} textAnchor="middle" fill="#11120F" style={sans}>
          Sign up
        </text>
        <text x={400} y={488} fontSize={13} fill="#5C5F56" style={sans}>
          Already have an account? <tspan fill="#11120F" textDecoration="underline">Sign in</tspan>
        </text>
        {["Draw it on paper", "Photograph it", "Edit it as a page"].map((t, i) => (
          <g key={t}>
            <path d={`M120 ${346 + i * 42}l5 5 9-10`} fill="none" stroke="#11120F" strokeWidth={2} />
            <text x={144} y={354 + i * 42} fontSize={14} fill="#11120F" style={sans}>
              {t}
            </text>
          </g>
        ))}
        <g data-cursor="">
          <circle cx={520} cy={424} r={16} fill="none" stroke="#11120F" strokeOpacity={0.35} />
          <path
            d="M520 424v26l7-6 5 11 5-2-5-11h9z"
            fill="#11120F"
            stroke="#F1F0E8"
            strokeWidth={1.2}
            strokeLinejoin="round"
          />
        </g>
      </g>

      {/* 4 — structure: crisp boundaries + ids (drawn over everything) */}
      <g data-layer="structure" style={{ opacity: o.structure }}>
        {sceneRegions.map((r) => (
          <g key={r.id}>
            <path d={boxPath(r)} pathLength={1} fill="none" stroke="#D9FF63" strokeWidth={1.2} data-boundary="" />
            <rect x={r.x - 2.5} y={r.y - 2.5} width={5} height={5} fill="#D9FF63" />
            <rect x={r.x + r.w - 2.5} y={r.y + r.h - 2.5} width={5} height={5} fill="#D9FF63" />
            <MonoText x={r.x + 6} y={r.y + 14} size={10} className="text-chalk/80">
              {r.id}
            </MonoText>
          </g>
        ))}
        <MonoText x={728} y={40} size={11} textAnchor="end" className="text-signal">
          elements[{sceneRegions.length}]
        </MonoText>
      </g>
    </svg>
  );
}
