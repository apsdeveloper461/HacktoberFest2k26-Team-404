"use client";

// Owner: Dev 2. Stages 2–3: check the photo, send it, wait, or recover from an error.
// Parsing reuses the review layout so nothing jumps when the request starts.
import { useEffect, useState } from "react";
import { Button } from "@/components/app/Button";
import { cx } from "@/components/app/cx";
import { UPLOAD_MAX_EDGE, formatBytes, needsResize } from "@/lib/upload";
import { PickImageButton } from "@/components/upload/ImageUploader";
import type { Sketch } from "../useWorkspace";
import { InlineError } from "./InlineError";

export function ReviewStage({
  sketch,
  parsing,
  error,
  onGenerate,
  onCancel,
  onReplace,
  onFileError,
  onRemove,
  onUseSample,
}: {
  sketch: Sketch;
  parsing: boolean;
  error: string | null;
  onGenerate: () => void;
  onCancel: () => void;
  onReplace: (file: File) => void;
  onFileError: (message: string) => void;
  onRemove: () => void;
  onUseSample: () => void;
}) {
  const [size, setSize] = useState<{ w: number; h: number } | null>(null);

  return (
    <div className="grid min-h-0 flex-1 lg:grid-cols-[minmax(0,1fr)_340px] lg:grid-rows-[minmax(0,1fr)]">
      {/* The photo, on the dark "board" */}
      <div className="ws-dots relative flex min-h-[46dvh] items-center justify-center overflow-hidden bg-ink-deep p-6 lg:p-10">
        <div className="relative inline-flex max-h-full">
          {/* eslint-disable-next-line @next/next/no-img-element -- local blob: preview, nothing to optimize */}
          <img
            src={sketch.url}
            alt={`Your sketch: ${sketch.file.name}`}
            onLoad={(e) =>
              setSize({ w: e.currentTarget.naturalWidth, h: e.currentTarget.naturalHeight })
            }
            className={cx(
              "max-h-[40dvh] w-auto max-w-full rounded-[3px] object-contain shadow-[0_20px_60px_-24px_rgba(0,0,0,0.8)] transition-[filter] duration-200 lg:max-h-[calc(100dvh-10rem)]",
              parsing && "brightness-[0.85]",
            )}
          />
          {parsing && <ScanOverlay />}
        </div>
      </div>

      {/* Details + action */}
      <aside className="flex flex-col gap-6 border-t border-line bg-ink p-5 lg:border-l lg:border-t-0">
        <div>
          <p className="font-tech text-[11px] uppercase tracking-[0.14em] text-muted">
            {parsing ? "Step 2 of 2" : "Step 1 of 2"}
          </p>
          <h1 className="mt-1.5 text-[17px] font-semibold tracking-tight text-chalk">
            {parsing ? "Reading your sketch" : "Review your sketch"}
          </h1>
        </div>

        <dl className="grid grid-cols-[88px_minmax(0,1fr)] gap-x-3 gap-y-2 text-[13px]">
          <dt className="text-muted">File</dt>
          <dd className="truncate text-chalk" title={sketch.file.name}>
            {sketch.file.name}
          </dd>
          <dt className="text-muted">Size</dt>
          <dd className="font-tech tabular-nums text-chalk">{formatBytes(sketch.file.size)}</dd>
          <dt className="text-muted">Dimensions</dt>
          <dd className="font-tech tabular-nums text-chalk">
            {size ? `${size.w} × ${size.h}` : "…"}
          </dd>
        </dl>

        {size && needsResize(size.w, size.h, sketch.file.size) && (
          <p className="-mt-3 text-[12px] leading-relaxed text-muted">
            Sent as a compressed JPEG (longest side {UPLOAD_MAX_EDGE}px or less) for a faster
            read. The Original tab keeps your full photo.
          </p>
        )}

        {!parsing && (
          <div className="flex gap-2">
            <PickImageButton onFile={onReplace} onError={onFileError}>
              Replace
            </PickImageButton>
            <Button variant="ghost" onClick={onRemove}>
              Remove
            </Button>
          </div>
        )}

        <div className="mt-auto flex flex-col gap-3">
          {error && !parsing && (
            <InlineError
              title="Couldn't read this sketch"
              actions={
                <>
                  <Button variant="primary" onClick={onGenerate}>
                    Try again
                  </Button>
                  <Button onClick={onUseSample}>Use sample instead</Button>
                </>
              }
            >
              {error}
            </InlineError>
          )}

          {parsing ? (
            <ParsingStatus onCancel={onCancel} />
          ) : (
            !error && (
              <>
                <Button variant="primary" size="md" onClick={onGenerate} className="w-full">
                  Generate preview
                </Button>
                <p className="text-[12px] leading-relaxed text-muted">
                  The photo is sent to the configured vision model, which returns the
                  page structure you can then edit.
                </p>
              </>
            )
          )}
        </div>
      </aside>
    </div>
  );
}

/** Viewfinder corners + a scan line; static under reduced motion (see workspace.css). */
function ScanOverlay() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      {/* The track spans the photo; translateY(100%) moves its top-edge line to the bottom. */}
      <div className="ws-scan absolute inset-0">
        <div className="h-px bg-signal shadow-[0_0_12px_2px_rgba(217,255,99,0.45)]" />
      </div>
      {(["left-0 top-0 border-l border-t", "right-0 top-0 border-r border-t", "bottom-0 left-0 border-b border-l", "bottom-0 right-0 border-b border-r"] as const).map(
        (corner) => (
          <span
            key={corner}
            className={cx("absolute size-4 border-signal", corner)}
          />
        ),
      )}
    </div>
  );
}

function ParsingStatus({ onCancel }: { onCancel: () => void }) {
  const seconds = useSeconds();
  const minutes = Math.floor(seconds / 60);
  const clock = `${minutes}:${String(seconds % 60).padStart(2, "0")}`;

  return (
    <div className="flex flex-col gap-3">
      <div className="h-0.5 overflow-hidden rounded-full bg-line">
        <div className="ws-indeterminate h-full w-1/3 rounded-full bg-signal" />
      </div>
      <div className="flex items-center justify-between gap-3">
        <p role="status" className="text-[13px] text-chalk">
          Reading your sketch…{" "}
          <span className="font-tech tabular-nums text-muted">{clock}</span>
        </p>
        <Button variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
      </div>
      {seconds >= 15 && (
        <p className="text-[12px] leading-relaxed text-muted">
          Busy sketches can take up to a minute. You can cancel and try a simpler
          photo, or keep waiting.
        </p>
      )}
    </div>
  );
}

/** Seconds since mount, ticking once a second. */
function useSeconds() {
  const [seconds, setSeconds] = useState(0);
  useEffect(() => {
    const id = window.setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => window.clearInterval(id);
  }, []);
  return seconds;
}
