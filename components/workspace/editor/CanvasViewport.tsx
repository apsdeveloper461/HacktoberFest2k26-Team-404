"use client";

// Owner: Dev 2. Fits the fixed-size page into whatever space is left, with zoom.
// The page is scaled by a transform on a wrapper; the canvas node itself stays at
// its real pixel size so PNG export and hit-testing are unaffected.
import { useEffect, useRef, useState, type Ref } from "react";
import type { WireframeElement, WireframeProject } from "@/lib/project/schema";
import { IconButton } from "@/components/app/Button";
import { FitIcon, MinusIcon, PlusIcon } from "@/components/app/icons";
import { cx } from "@/components/app/cx";
import { PreviewCanvas } from "../PreviewCanvas";
import { SelectionOverlay } from "./SelectionOverlay";

const PAD = 32;
const STEPS = [0.25, 0.33, 0.5, 0.67, 0.75, 0.9, 1, 1.25, 1.5, 2];

type Zoom = "fit" | number;

export function CanvasViewport({
  project,
  selected,
  onSelect,
  canvasRef,
  className,
}: {
  project: WireframeProject;
  selected: WireframeElement | null;
  onSelect: (id: string | null) => void;
  canvasRef: Ref<HTMLDivElement>;
  className?: string;
}) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const [box, setBox] = useState<{ w: number; h: number } | null>(null);
  const [zoom, setZoom] = useState<Zoom>("fit");

  useEffect(() => {
    const node = viewportRef.current;
    if (!node) return;
    const observer = new ResizeObserver(([entry]) => {
      setBox({ w: entry.contentRect.width, h: entry.contentRect.height });
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const { width, height } = project.canvas;
  const fit = box
    ? clampScale(Math.min((box.w - PAD * 2) / width, (box.h - PAD * 2) / height, 1))
    : 0;
  const scale = zoom === "fit" ? fit : zoom;

  function step(direction: 1 | -1) {
    const next =
      direction === 1
        ? STEPS.find((s) => s > scale + 0.001)
        : [...STEPS].reverse().find((s) => s < scale - 0.001);
    if (next) setZoom(next);
  }

  return (
    <div className={cx("relative min-h-0 min-w-0", className)}>
      <div
        ref={viewportRef}
        onClick={() => onSelect(null)}
        className="ws-dots h-full overflow-auto bg-ink-deep"
      >
        {/* Hidden until measured, so the page never flashes at the wrong size. */}
        <div
          className={cx(
            "flex min-h-full w-max min-w-full items-center justify-center",
            scale === 0 && "invisible",
          )}
          style={{ padding: PAD }}
        >
          <div
            className="relative shrink-0"
            style={{ width: width * scale, height: height * scale }}
          >
            <div
              className="absolute left-0 top-0 origin-top-left shadow-[0_30px_80px_-30px_rgba(0,0,0,0.9)]"
              style={{ transform: `scale(${scale || 1})` }}
            >
              <PreviewCanvas ref={canvasRef} project={project} onSelect={onSelect} />
            </div>
            <SelectionOverlay element={selected} scale={scale} />
          </div>
        </div>
      </div>

      <div className="absolute bottom-3 right-3 flex items-center gap-0.5 rounded-[6px] border border-line bg-ink/95 p-0.5 shadow-[0_8px_24px_-12px_rgba(0,0,0,0.7)]">
        <IconButton label="Zoom out" onClick={() => step(-1)} disabled={scale <= STEPS[0]}>
          <MinusIcon />
        </IconButton>
        <span
          aria-live="polite"
          className="w-11 text-center font-tech text-[11px] tabular-nums text-chalk"
        >
          {Math.round(scale * 100)}%
        </span>
        <IconButton label="Zoom in" onClick={() => step(1)} disabled={scale >= STEPS.at(-1)!}>
          <PlusIcon />
        </IconButton>
        <span aria-hidden="true" className="mx-0.5 h-4 w-px bg-line" />
        <IconButton
          label="Zoom to fit"
          onClick={() => setZoom("fit")}
          aria-pressed={zoom === "fit"}
          className={zoom === "fit" ? "text-signal" : undefined}
        >
          <FitIcon />
        </IconButton>
      </div>
    </div>
  );
}

function clampScale(n: number) {
  return Math.max(0.1, Math.round(n * 1000) / 1000);
}
