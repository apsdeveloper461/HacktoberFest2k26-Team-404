"use client";

// 06 — Before / after. The opening sketch and its compiled interface share
// one coordinate system; a divider wipes between them. Pointer, touch and
// keyboard all drive the same value.
import { animate } from "motion/react";
import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent, type ReactNode } from "react";
import { cx } from "../cx";
import { useReducedMotionPref } from "../motion";
import { heroBoxes as b, heroTasks, pct, type Box } from "../hero/hero-layout";

const clamp = (v: number) => Math.min(100, Math.max(0, v));

function Bound({ box, id }: { box: Box; id: string }) {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute shadow-[0_0_0_1px_#9fc21f]" style={pct(box)}>
      <span className="absolute -top-[3px] -left-[3px] size-[5px] border border-ink bg-signal" />
      <span className="absolute -right-[3px] -bottom-[3px] size-[5px] border border-ink bg-signal" />
      <span className="cs-mono absolute -top-px left-[6px] -translate-y-full text-[max(8px,1.1cqw)] leading-none text-[#6f8a12] max-md:hidden">
        {id}
      </span>
    </div>
  );
}

function Compiled() {
  return (
    <div className="absolute inset-0 text-ink" style={{ fontSize: "1.6cqw" }}>
      <div className="absolute border border-ink/15 bg-white/50" style={pct(b.frame)} />
      <div className="absolute flex items-center gap-[0.5em] border-b border-ink/10 bg-paper/60 px-[1em]" style={pct(b.titlebar)}>
        {[0, 1, 2].map((i) => (
          <span key={i} className="size-[0.6em] rounded-full bg-ink/25" />
        ))}
        <span className="cs-mono ml-[1em] rounded-full bg-white/70 px-[0.8em] py-[0.15em] text-[0.7em] text-muted-ink">
          preview · launch-checklist
        </span>
      </div>
      <div className="absolute flex items-center justify-between border-b border-ink/10 px-[1.6em]" style={pct(b.nav)}>
        <span className="text-[1.05em] font-semibold tracking-[-0.01em]">Launchpad</span>
        <span className="flex items-center gap-[1.4em] text-[0.8em] text-muted-ink">
          <span>Docs</span>
          <span>Team</span>
          <span className="size-[2em] rounded-full bg-paper ring-1 ring-ink/15" />
        </span>
      </div>
      <p className="cs-display absolute flex items-end text-[2.15em] leading-none" style={pct(b.heading)}>
        Launch checklist
      </p>
      <p className="absolute pt-[0.3em] text-[0.8em] leading-snug text-muted-ink" style={pct(b.sub)}>
        Everything that has to happen before Friday’s launch.
      </p>
      <div className="absolute flex items-center rounded-[2px] border border-ink/25 bg-white px-[0.9em] text-[0.85em] text-muted-ink" style={pct(b.input)}>
        Add a task…
      </div>
      <div className="absolute flex items-center justify-center rounded-[2px] bg-signal text-[0.95em] font-semibold" style={pct(b.button)}>
        Add
      </div>
      <div className="absolute flex items-center gap-[0.4em] text-[0.78em]" style={pct(b.tabs)}>
        <span className="rounded-[2px] bg-ink px-[0.7em] py-[0.2em] text-chalk">All</span>
        <span className="px-[0.5em] text-muted-ink">Open</span>
        <span className="px-[0.5em] text-muted-ink">Done</span>
      </div>
      <ul className="absolute flex flex-col justify-center" style={pct(b.list)}>
        {heroTasks.map((t, i) => (
          <li key={t} className="flex items-center gap-[0.8em] border-b border-ink/10 px-[1em] py-[0.62em] text-[0.95em] last:border-0">
            <span className={cx("grid size-[1.1em] place-items-center border border-ink", i < 2 && "bg-ink")}>
              {i < 2 && <span className="h-[0.3em] w-[0.55em] -translate-y-[0.06em] -rotate-45 border-b-2 border-l-2 border-chalk" />}
            </span>
            <span className={i < 2 ? "text-muted-ink line-through" : ""}>{t}</span>
          </li>
        ))}
      </ul>
      <div className="absolute overflow-hidden bg-graphite" style={pct(b.image)}>
        <svg viewBox="0 0 172 140" className="h-full w-full" aria-hidden="true">
          <path d="M0 140 58 70l34 34 22-18 58 54Z" fill="#3d3f37" />
          <circle cx={128} cy={40} r={14} fill="#d9ff63" />
        </svg>
      </div>
      <p className="cs-mono absolute text-[0.72em] text-muted-ink" style={pct(b.footer)}>
        2 of 3 done
      </p>

      <Bound box={b.nav} id="nav-1" />
      <Bound box={b.heading} id="heading-1" />
      <Bound box={b.input} id="input-1" />
      <Bound box={b.button} id="button-1" />
      <Bound box={b.tabs} id="tabs-1" />
      <Bound box={b.list} id="list-1" />
      <Bound box={b.image} id="image-1" />
    </div>
  );
}

export function BeforeAfter({ before }: { before: ReactNode }) {
  const [split, setSplit] = useState(42);
  const stage = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const touched = useRef(false);
  const reduce = useReducedMotionPref();

  // One gentle hint the first time the stage comes into view.
  useEffect(() => {
    const el = stage.current;
    if (!el || reduce) return;
    let stop: (() => void) | undefined;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        if (touched.current) return;
        const controls = animate(42, [42, 30, 42], {
          duration: 1.4,
          ease: [0.65, 0, 0.35, 1],
          onUpdate: (v: number) => {
            if (!touched.current) setSplit(v);
          },
        });
        stop = () => controls.stop();
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      stop?.();
    };
  }, [reduce]);

  const fromClientX = (x: number) => {
    const r = stage.current?.getBoundingClientRect();
    if (!r) return;
    setSplit(clamp(((x - r.left) / r.width) * 100));
  };

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    const r = e.currentTarget.getBoundingClientRect();
    const handleX = r.left + (r.width * split) / 100;
    // On touch, only grab near the divider so vertical scrolling still works.
    if (e.pointerType !== "mouse" && Math.abs(e.clientX - handleX) > 44) return;
    touched.current = true;
    dragging.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
    fromClientX(e.clientX);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const step = e.shiftKey ? 10 : 2;
    const map: Record<string, number> = {
      ArrowLeft: split - step,
      ArrowDown: split - step,
      ArrowRight: split + step,
      ArrowUp: split + step,
      PageDown: split - 10,
      PageUp: split + 10,
      Home: 0,
      End: 100,
    };
    if (!(e.key in map)) return;
    e.preventDefault();
    touched.current = true;
    setSplit(clamp(map[e.key]));
  };

  return (
    <div
      ref={stage}
      onPointerDown={onPointerDown}
      onPointerMove={(e) => dragging.current && fromClientX(e.clientX)}
      onPointerUp={() => (dragging.current = false)}
      onPointerCancel={() => (dragging.current = false)}
      className="relative cursor-ew-resize touch-pan-y select-none"
    >
      {/* Before: chalk on the board */}
      <div className="cs-dust bg-ink py-[clamp(28px,5vw,64px)]">
        <div className="relative mx-auto aspect-[4/3] w-[min(calc(100%-2*var(--gutter)),calc((100svh-180px)*4/3),1100px)]">
          {before}
        </div>
      </div>

      {/* After: the compiled interface, same coordinates */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-chalk py-[clamp(28px,5vw,64px)]"
        style={{ clipPath: `inset(0 0 0 ${split}%)` }}
      >
        <div className="@container relative mx-auto aspect-[4/3] w-[min(calc(100%-2*var(--gutter)),calc((100svh-180px)*4/3),1100px)]">
          <Compiled />
        </div>
      </div>

      <p className="cs-eyebrow pointer-events-none absolute top-4 left-(--gutter) text-chalk/70">
        Before<span className="max-sm:hidden"> · whiteboard</span>
      </p>
      <p
        className="cs-eyebrow pointer-events-none absolute top-4 right-(--gutter) text-ink/70"
        style={{ clipPath: `inset(0 0 0 ${Math.max(0, split - 70) * 3.3}%)` }}
      >
        After<span className="max-sm:hidden"> · editable preview</span>
      </p>

      {/* Divider */}
      <div className="pointer-events-none absolute inset-y-0 w-px bg-signal" style={{ left: `${split}%` }}>
        <div
          role="slider"
          tabIndex={0}
          aria-label="Reveal the compiled interface"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(split)}
          aria-valuetext={`${Math.round(100 - split)}% compiled`}
          onKeyDown={onKeyDown}
          className="pointer-events-auto absolute top-1/2 left-1/2 flex h-14 w-11 -translate-x-1/2 -translate-y-1/2 touch-none items-center justify-center gap-[3px] rounded-[2px] bg-signal text-ink shadow-[0_0_0_1px_var(--color-ink)]"
        >
          <span className="h-5 w-px bg-ink" />
          <span className="h-5 w-px bg-ink" />
          <span className="h-5 w-px bg-ink" />
        </div>
      </div>
    </div>
  );
}
