"use client";

// Owner: Dev 2. Getting a sketch photo into the app: drop, choose, or take a photo.
// Validation lives in lib/upload.ts so the browser and /api/parse agree.
import {
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
  type ReactNode,
} from "react";
import { Button, type ButtonVariant } from "@/components/app/Button";
import { cx } from "@/components/app/cx";
import { CameraIcon, UploadIcon } from "@/components/app/icons";
import { ACCEPTED_IMAGE_TYPES, validatePickedImage } from "@/lib/upload";

type PickHandlers = {
  onFile: (file: File) => void;
  onError: (message: string) => void;
};

const ACCEPT = ACCEPTED_IMAGE_TYPES.join(",");

/** Validates the first file of a FileList and reports it. */
export function takeFirstImage(files: FileList | null | undefined, handlers: PickHandlers) {
  const file = files?.[0];
  if (!file) return;
  const invalid = validatePickedImage(file);
  if (invalid) handlers.onError(invalid);
  else handlers.onFile(file);
}

/** A button that opens the file picker (or the camera, with `capture`). */
export function PickImageButton({
  children,
  variant = "secondary",
  capture = false,
  disabled,
  className,
  ...handlers
}: PickHandlers & {
  children: ReactNode;
  variant?: ButtonVariant;
  capture?: boolean;
  disabled?: boolean;
  className?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  function onChange(event: ChangeEvent<HTMLInputElement>) {
    takeFirstImage(event.target.files, handlers);
    // Reset so choosing the same file again still fires a change.
    event.target.value = "";
  }

  return (
    <>
      <Button
        variant={variant}
        disabled={disabled}
        onClick={() => inputRef.current?.click()}
        className={className}
      >
        {children}
      </Button>
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT}
        capture={capture ? "environment" : undefined}
        onChange={onChange}
        tabIndex={-1}
        aria-hidden="true"
        className="sr-only"
      />
    </>
  );
}

export function ImageUploader({ disabled, ...handlers }: PickHandlers & { disabled?: boolean }) {
  const [over, setOver] = useState(false);
  const depth = useRef(0);

  function onDragEnter(event: DragEvent) {
    if (!event.dataTransfer.types.includes("Files")) return;
    event.preventDefault();
    depth.current += 1;
    setOver(true);
  }

  function onDragLeave() {
    depth.current = Math.max(0, depth.current - 1);
    if (depth.current === 0) setOver(false);
  }

  function onDrop(event: DragEvent) {
    event.preventDefault();
    depth.current = 0;
    setOver(false);
    if (!disabled) takeFirstImage(event.dataTransfer.files, handlers);
  }

  return (
    <div
      onDragEnter={onDragEnter}
      onDragOver={(e) => e.preventDefault()}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      className={cx(
        "relative flex flex-col items-center justify-center gap-4 rounded-[6px] border border-dashed px-6 py-10 text-center transition-colors duration-150 ease-snap sm:py-14",
        over
          ? "border-signal bg-signal/[0.05]"
          : "border-[#45473f] bg-ink-raised/60",
      )}
    >
      <SketchGlyph active={over} />
      <div className="flex flex-col gap-1">
        <p className="text-[15px] font-medium text-chalk">
          {over ? "Drop to use this photo" : "Drop a photo of your sketch"}
        </p>
        <p className="font-tech text-[11px] tracking-wide text-muted">
          PNG, JPEG or WebP · large photos are resized for upload · or paste with Ctrl+V
        </p>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-2">
        <PickImageButton variant="primary" disabled={disabled} {...handlers}>
          <UploadIcon />
          Choose image
        </PickImageButton>
        {/* Phones and tablets only: opens the rear camera directly. */}
        <span className="hidden pointer-coarse:contents">
          <PickImageButton capture disabled={disabled} {...handlers}>
            <CameraIcon />
            Take photo
          </PickImageButton>
        </span>
      </div>
    </div>
  );
}

/** A tiny hand-drawn wireframe; its frame snaps straight when a file hovers. */
function SketchGlyph({ active }: { active: boolean }) {
  return (
    <svg
      viewBox="0 0 64 48"
      width={64}
      height={48}
      fill="none"
      aria-hidden="true"
      className={cx(
        "transition-colors duration-150",
        active ? "text-signal" : "text-muted",
      )}
    >
      <path
        d={
          active
            ? "M4 4H60V44H4Z"
            : "M4.5 4.8C20 3.6 41 4.4 59.6 3.9 60.4 17 59.5 30 60.2 43.6 41 44.5 22 43.4 4.2 44.3 3.6 31 4.6 17 4.5 4.8Z"
        }
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinejoin="round"
        className="transition-[d] duration-200 ease-snap"
      />
      <path d="M10 12h22M10 19h14" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" />
      <rect x="10" y="27" width="16" height="8" rx="2" stroke="currentColor" strokeWidth={1.5} />
      <path d="M36 12h18v23H36z" stroke="currentColor" strokeWidth={1.5} strokeDasharray="2.5 2.5" />
    </svg>
  );
}
