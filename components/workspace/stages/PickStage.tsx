"use client";

// Owner: Dev 2. Stage 1: get a sketch photo in, or open the prepared sample.
import { useEffect } from "react";
import { Button } from "@/components/app/Button";
import { ImageUploader, takeFirstImage } from "@/components/upload/ImageUploader";
import { InlineError } from "./InlineError";

export function PickStage({
  error,
  onFile,
  onError,
  onUseSample,
}: {
  error: string | null;
  onFile: (file: File) => void;
  onError: (message: string) => void;
  onUseSample: () => void;
}) {
  // Paste an image from the clipboard (e.g. a screenshot of a whiteboard photo).
  useEffect(() => {
    function onPaste(event: ClipboardEvent) {
      const files = event.clipboardData?.files;
      if (!files?.length) return;
      event.preventDefault();
      takeFirstImage(files, { onFile, onError });
    }
    window.addEventListener("paste", onPaste);
    return () => window.removeEventListener("paste", onPaste);
  }, [onFile, onError]);

  return (
    <div className="mx-auto flex w-full max-w-[560px] flex-col px-4 py-10 sm:py-16">
      <p className="font-tech text-[11px] uppercase tracking-[0.14em] text-muted">
        New sketch
      </p>
      <h1 className="mt-2 text-xl font-semibold tracking-tight text-chalk">
        Start with a sketch
      </h1>
      <p className="mt-1.5 text-sm leading-relaxed text-muted">
        Upload a photo of a hand-drawn website wireframe. ChalkScript reads the
        boxes, labels and buttons and turns them into a page you can edit.
      </p>

      <div className="mt-6">
        <ImageUploader onFile={onFile} onError={onError} />
      </div>

      {error && <InlineError className="mt-3">{error}</InlineError>}

      <div className="mt-8 flex items-center gap-3 font-tech text-[11px] uppercase tracking-[0.14em] text-muted">
        <span className="h-px flex-1 bg-line" />
        or
        <span className="h-px flex-1 bg-line" />
      </div>

      <div className="mt-6 flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-chalk">Try the sample wireframe</p>
          <p className="text-[13px] text-muted">
            Loads a prepared parse result. No photo or AI call needed.
          </p>
        </div>
        <Button onClick={onUseSample}>Open sample</Button>
      </div>

      <section aria-labelledby="tips-title" className="mt-10 border-t border-line pt-5">
        <h2
          id="tips-title"
          className="font-tech text-[11px] uppercase tracking-[0.14em] text-muted"
        >
          For a clean read
        </h2>
        <ul className="mt-3 grid gap-2 text-[13px] text-muted sm:grid-cols-3">
          <li className="flex gap-2">
            <span aria-hidden="true" className="mt-[7px] size-1 shrink-0 bg-signal" />
            Dark marker on light paper or a clean board.
          </li>
          <li className="flex gap-2">
            <span aria-hidden="true" className="mt-[7px] size-1 shrink-0 bg-signal" />
            One page per photo, shot straight on.
          </li>
          <li className="flex gap-2">
            <span aria-hidden="true" className="mt-[7px] size-1 shrink-0 bg-signal" />
            Write labels like “Button” or “Email” inside boxes.
          </li>
        </ul>
      </section>
    </div>
  );
}
