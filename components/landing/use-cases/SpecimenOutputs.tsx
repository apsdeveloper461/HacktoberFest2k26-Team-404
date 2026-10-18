"use client";

// The "after" half of each specimen plate: precise, interactive outputs.
// Wireframes are the first build; the other three illustrate planned output.
import { useEffect, useRef, useState } from "react";
import { cx } from "../cx";
import { useReducedMotionPref } from "../motion";

const VIEW = "0 0 520 340";

/* ---------- 01 Wireframe → editable controls ---------- */

export function WireframeOutput() {
  const [name, setName] = useState("Ada Lovelace");
  const [updates, setUpdates] = useState(true);
  const [saved, setSaved] = useState(false);
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => {
    const t = timer;
    return () => window.clearTimeout(t.current);
  }, []);

  return (
    <div className="flex h-full flex-col justify-center gap-4 p-5 sm:p-7">
      <div className="flex items-center justify-between">
        <p className="text-[20px] font-semibold tracking-[-0.02em]">Profile</p>
        <span aria-hidden="true" className="grid size-11 place-items-center rounded-full bg-chalk/10 text-[13px] font-semibold text-chalk">
          {name.trim().slice(0, 1).toUpperCase() || "?"}
        </span>
      </div>
      <label className="block">
        <span className="cs-mono text-[10px] text-muted">input#name</span>
        <input
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setSaved(false);
          }}
          maxLength={32}
          className="mt-1 min-h-10 w-full rounded-[2px] border border-chalk/20 bg-ink-raised px-3 text-[14px] text-chalk focus:border-chalk/70 focus:outline-none"
        />
      </label>
      <div className="flex items-center gap-3">
        <button
          type="button"
          role="switch"
          aria-checked={updates}
          aria-labelledby="specimen-updates-label"
          onClick={() => {
            setUpdates((u) => !u);
            setSaved(false);
          }}
          className={cx(
            "relative h-7 w-12 shrink-0 rounded-full transition-colors duration-200",
            updates ? "bg-signal" : "bg-chalk/20",
          )}
        >
          <span
            className={cx(
              "absolute top-1 left-1 size-5 rounded-full bg-ink transition-transform duration-200 ease-snap",
              updates && "translate-x-5",
            )}
          />
        </button>
        <span id="specimen-updates-label" className="text-[14px]">
          Email updates
        </span>
      </div>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => {
            setSaved(true);
            window.clearTimeout(timer.current);
            timer.current = window.setTimeout(() => setSaved(false), 2400);
          }}
          className="min-h-10 rounded-[2px] bg-chalk px-5 text-[14px] font-semibold text-ink transition-colors hover:bg-white"
        >
          Save
        </button>
        <span aria-live="polite" className="cs-mono text-[11px] text-muted">
          {saved ? "kept in this page’s state ✓" : ""}
        </span>
      </div>
    </div>
  );
}

/* ---------- 02 ER diagram → entities + relations ---------- */

type Entity = { id: string; x: number; y: number; w: number; fields: { name: string; key?: "PK" | "FK" }[] };

const entities: Entity[] = [
  { id: "users", x: 20, y: 34, w: 150, fields: [{ name: "id", key: "PK" }, { name: "email" }, { name: "name" }] },
  { id: "projects", x: 186, y: 176, w: 156, fields: [{ name: "id", key: "PK" }, { name: "owner_id", key: "FK" }, { name: "title" }] },
  {
    id: "tasks",
    x: 356,
    y: 26,
    w: 150,
    fields: [{ name: "id", key: "PK" }, { name: "project_id", key: "FK" }, { name: "title" }, { name: "done" }],
  },
];

const relations = [
  { from: "users", to: "projects", label: "users.id → projects.owner_id", d: "M170 112 C 200 112, 170 230, 186 236" },
  { from: "projects", to: "tasks", label: "projects.id → tasks.project_id", d: "M342 236 C 372 236, 340 132, 356 124" },
];

export function ErOutput() {
  const [selected, setSelected] = useState<string>("projects");
  const related = new Set(
    relations.flatMap((r) => (r.from === selected || r.to === selected ? [r.from, r.to] : [])),
  );

  return (
    <div className="flex h-full flex-col">
      <div className="relative flex-1">
        <svg viewBox={VIEW} className="absolute inset-0 h-full w-full" aria-hidden="true">
          {relations.map((r) => {
            const on = r.from === selected || r.to === selected;
            return (
              <g key={r.label} className={cx("transition-colors duration-300", on ? "text-signal" : "text-line")}>
                <path d={r.d} fill="none" stroke="currentColor" strokeWidth={on ? 1.6 : 1.2} />
              </g>
            );
          })}
        </svg>
        {entities.map((e) => {
          const on = e.id === selected;
          const near = related.has(e.id) && !on;
          return (
            <button
              key={e.id}
              type="button"
              aria-pressed={on}
              onClick={() => setSelected(e.id)}
              className={cx(
                "absolute flex flex-col text-left transition-[box-shadow,opacity] duration-300",
                on
                  ? "bg-ink-raised shadow-[0_0_0_1.5px_var(--color-signal)]"
                  : near
                    ? "bg-ink-raised shadow-[0_0_0_1px_rgb(217_255_99/0.5)]"
                    : "bg-ink-raised opacity-70 shadow-[0_0_0_1px_var(--color-line)] hover:opacity-100",
              )}
              style={{ left: `${(e.x / 520) * 100}%`, top: `${(e.y / 340) * 100}%`, width: `${(e.w / 520) * 100}%` }}
            >
              <span className={cx("cs-mono px-2 py-1.5 text-[11px]", on ? "bg-signal text-ink" : "text-chalk")}>{e.id}</span>
              {e.fields.map((f) => (
                <span
                  key={f.name}
                  className={cx(
                    "cs-mono flex items-center justify-between border-t border-line px-2 py-1 text-[10px]",
                    f.key === "FK" && (on || near) ? "text-signal" : "text-chalk/75",
                  )}
                >
                  {f.name}
                  {f.key && <span className="text-[9px] text-muted">{f.key}</span>}
                </span>
              ))}
            </button>
          );
        })}
      </div>
      <p className="cs-mono border-t border-line px-3 py-2 text-[10.5px] text-muted" aria-live="polite">
        {relations
          .filter((r) => r.from === selected || r.to === selected)
          .map((r) => r.label)
          .join("  ·  ")}
      </p>
    </div>
  );
}

/* ---------- 03 Architecture → traceable system map ---------- */

const nodes = [
  { id: "web", x: 18, y: 140, w: 92, h: 56 },
  { id: "api", x: 160, y: 140, w: 104, h: 56 },
  { id: "orders", x: 316, y: 56, w: 118, h: 52 },
  { id: "users", x: 316, y: 228, w: 118, h: 52 },
  { id: "db", x: 462, y: 132, w: 44, h: 72 },
] as const;

const edges = [
  { id: "web-api", d: "M110 168H160" },
  { id: "api-orders", d: "M264 158C290 158 290 82 316 82" },
  { id: "api-users", d: "M264 178C290 178 290 254 316 254" },
  { id: "orders-db", d: "M434 82C452 82 446 150 462 150" },
  { id: "users-db", d: "M434 254C452 254 446 186 462 186" },
];

const trace = ["web", "web-api", "api", "api-orders", "orders", "orders-db", "db"];

export function ArchitectureOutput() {
  const reduce = useReducedMotionPref();
  const [lit, setLit] = useState<string[]>([]);
  const timers = useRef<number[]>([]);
  useEffect(() => {
    const t = timers;
    return () => t.current.forEach((id) => window.clearTimeout(id));
  }, []);

  const run = () => {
    timers.current.forEach((t) => window.clearTimeout(t));
    if (reduce) {
      setLit(trace);
      return;
    }
    setLit([]);
    timers.current = trace.map((id, i) => window.setTimeout(() => setLit((l) => [...l, id]), 120 + i * 240));
  };

  const on = (id: string) => lit.includes(id);

  return (
    <div className="flex h-full flex-col">
      <div className="relative flex-1">
        <svg viewBox={VIEW} className="absolute inset-0 h-full w-full" role="img" aria-label="System map: web, API, orders and users services, database.">
          {edges.map((e) => (
            <path
              key={e.id}
              d={e.d}
              fill="none"
              strokeWidth={on(e.id) ? 2 : 1.2}
              className={cx("transition-[stroke] duration-200", on(e.id) ? "stroke-signal" : "stroke-line")}
            />
          ))}
          {nodes.map((n) =>
            n.id === "db" ? (
              <g key={n.id} className={cx("transition-colors duration-200", on(n.id) ? "text-signal" : "text-chalk/70")}>
                <ellipse cx={n.x + n.w / 2} cy={n.y} rx={n.w / 2} ry={7} fill="var(--color-ink-raised)" stroke="currentColor" />
                <path d={`M${n.x} ${n.y}v${n.h}a${n.w / 2} 7 0 0 0 ${n.w} 0v${-n.h}`} fill="var(--color-ink-raised)" stroke="currentColor" />
                <ellipse cx={n.x + n.w / 2} cy={n.y} rx={n.w / 2} ry={7} fill="none" stroke="currentColor" />
                <text x={n.x + n.w / 2} y={n.y + n.h + 22} textAnchor="middle" fontSize={12} className="cs-mono" fill="currentColor">
                  postgres
                </text>
              </g>
            ) : (
              <g key={n.id}>
                <rect
                  x={n.x}
                  y={n.y}
                  width={n.w}
                  height={n.h}
                  className={cx("transition-[fill,stroke] duration-200", on(n.id) ? "fill-signal stroke-signal" : "fill-ink-raised stroke-chalk/40")}
                />
                <text
                  x={n.x + n.w / 2}
                  y={n.y + n.h / 2 + 4}
                  textAnchor="middle"
                  fontSize={12}
                  className={cx("cs-mono transition-[fill] duration-200", on(n.id) ? "fill-ink" : "fill-chalk")}
                >
                  {n.id === "api" ? "api-gateway" : n.id === "web" ? "web client" : `${n.id}-svc`}
                </text>
              </g>
            ),
          )}
        </svg>
      </div>
      <div className="flex items-center justify-between gap-3 border-t border-line px-3 py-2">
        <p className="cs-mono text-[10.5px] text-muted" aria-live="polite">
          {lit.length === trace.length ? "GET /orders → api-gateway → orders-svc → postgres" : lit.length ? "tracing…" : "idle"}
        </p>
        <button
          type="button"
          onClick={run}
          className="cs-mono min-h-9 rounded-[2px] border border-chalk/30 px-3 text-[11px] text-chalk transition-colors hover:border-chalk"
        >
          Trace a request
        </button>
      </div>
    </div>
  );
}

/* ---------- 04 User flow → navigable interaction map ---------- */

type FlowNode = { id: string; label: string; x: number; y: number; w: number; kind?: "start" | "end" | "decision" };

const flow: FlowNode[] = [
  { id: "start", label: "start", x: 34, y: 62, w: 0, kind: "start" },
  { id: "landing", label: "Landing", x: 82, y: 40, w: 112 },
  { id: "signup", label: "Sign up", x: 234, y: 40, w: 112 },
  { id: "verified", label: "verified?", x: 290, y: 160, w: 0, kind: "decision" },
  { id: "dashboard", label: "Dashboard", x: 392, y: 138, w: 116 },
  { id: "resend", label: "Resend email", x: 64, y: 236, w: 132 },
  { id: "end", label: "end", x: 450, y: 258, w: 0, kind: "end" },
];

const next: Record<string, string | null> = {
  start: "landing",
  landing: "signup",
  signup: "verified",
  dashboard: "end",
  resend: "verified",
  end: null,
};

const flowEdges = [
  { from: "start", to: "landing", d: "M43 62H82" },
  { from: "landing", to: "signup", d: "M194 62H234" },
  { from: "signup", to: "verified", d: "M290 84V124" },
  { from: "verified", to: "dashboard", d: "M350 160H392" },
  { from: "verified", to: "resend", d: "M262 180C240 206 214 228 196 240" },
  { from: "resend", to: "verified", d: "M112 236C126 178 180 160 230 160" },
  { from: "dashboard", to: "end", d: "M450 182V244" },
];

export function FlowOutput() {
  const [path, setPath] = useState<string[]>(["start"]);
  const current = path[path.length - 1];
  const node = flow.find((n) => n.id === current)!;
  const visited = new Set(path);

  const go = (id: string) => setPath((p) => [...p, id]);
  const back = () => setPath((p) => (p.length > 1 ? p.slice(0, -1) : p));

  const walked = (from: string, to: string) =>
    path.some((id, i) => id === from && path[i + 1] === to);

  return (
    <div className="flex h-full flex-col">
      <div className="relative flex-1">
        <svg viewBox={VIEW} className="absolute inset-0 h-full w-full" role="img" aria-label={`User flow map. Current step: ${node.label}.`}>
          {flowEdges.map((e) => (
            <path
              key={`${e.from}-${e.to}`}
              d={e.d}
              fill="none"
              strokeWidth={walked(e.from, e.to) ? 2 : 1.2}
              className={walked(e.from, e.to) ? "stroke-signal" : "stroke-line"}
              markerEnd="url(#flow-arrow)"
            />
          ))}
          <defs>
            <marker id="flow-arrow" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto">
              <path d="M0 0 8 4 0 8z" fill="var(--color-muted)" />
            </marker>
          </defs>
          {flow.map((n) => {
            const isCurrent = n.id === current;
            const seen = visited.has(n.id);
            if (n.kind === "start") return <circle key={n.id} cx={n.x} cy={n.y} r={9} className={isCurrent ? "fill-signal" : "fill-chalk"} />;
            if (n.kind === "end")
              return (
                <g key={n.id}>
                  <circle cx={n.x} cy={n.y} r={14} fill="none" className={isCurrent ? "stroke-signal" : "stroke-chalk/60"} strokeWidth={1.5} />
                  <circle cx={n.x} cy={n.y} r={7} className={isCurrent ? "fill-signal" : "fill-chalk/60"} />
                </g>
              );
            if (n.kind === "decision")
              return (
                <g key={n.id}>
                  <path
                    d={`M${n.x} 124 ${n.x + 60} 160 ${n.x} 196 ${n.x - 60} 160Z`}
                    className={cx(isCurrent ? "fill-signal stroke-signal" : seen ? "fill-ink-raised stroke-chalk/70" : "fill-ink-raised stroke-chalk/35")}
                  />
                  <text x={n.x} y={164} textAnchor="middle" fontSize={11} className={cx("cs-mono", isCurrent ? "fill-ink" : "fill-chalk")}>
                    {n.label}
                  </text>
                </g>
              );
            return (
              <g key={n.id}>
                <rect
                  x={n.x}
                  y={n.y}
                  width={n.w}
                  height={44}
                  rx={10}
                  className={cx(isCurrent ? "fill-signal stroke-signal" : seen ? "fill-ink-raised stroke-chalk/70" : "fill-ink-raised stroke-chalk/35")}
                />
                <text x={n.x + n.w / 2} y={n.y + 27} textAnchor="middle" fontSize={13} className={isCurrent ? "fill-ink" : "fill-chalk"} style={{ fontFamily: "var(--font-geist-sans)" }}>
                  {n.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-line px-3 py-2">
        <p className="cs-mono text-[10.5px] text-muted" aria-live="polite">
          step {path.length} · {node.label}
        </p>
        <div className="flex gap-1.5">
          <button type="button" onClick={back} disabled={path.length === 1} className="cs-mono min-h-9 rounded-[2px] px-3 text-[11px] text-chalk/80 hover:text-chalk disabled:opacity-35">
            Back
          </button>
          {current === "verified" ? (
            <>
              <button type="button" onClick={() => go("dashboard")} className="cs-mono min-h-9 rounded-[2px] bg-signal px-3 text-[11px] text-ink">
                Yes → Dashboard
              </button>
              <button type="button" onClick={() => go("resend")} className="cs-mono min-h-9 rounded-[2px] border border-chalk/30 px-3 text-[11px] text-chalk">
                No → Resend
              </button>
            </>
          ) : next[current] ? (
            <button type="button" onClick={() => go(next[current]!)} className="cs-mono min-h-9 rounded-[2px] bg-signal px-3 text-[11px] text-ink">
              Next step
            </button>
          ) : (
            <button type="button" onClick={() => setPath(["start"])} className="cs-mono min-h-9 rounded-[2px] border border-chalk/30 px-3 text-[11px] text-chalk">
              Start over
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
