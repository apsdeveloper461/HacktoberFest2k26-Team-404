"use client";

// Swatch + hex input. Model output may use "#fff" or "blue", but the native
// colour picker only understands #rrggbb, so values are normalised for display.
import { useId, useState } from "react";
import { FieldLabel, inputClasses } from "./Field";
import { cx } from "./cx";

const resolved = new Map<string, string | null>();

/** Returns a lowercase #rrggbb for any CSS colour the browser understands, else null. */
export function toHex6(value: string | undefined): string | null {
  if (!value) return null;
  const trimmed = value.trim().toLowerCase();
  if (/^#[0-9a-f]{6}$/.test(trimmed)) return trimmed;
  const short = /^#([0-9a-f])([0-9a-f])([0-9a-f])$/.exec(trimmed);
  if (short) return `#${short[1]}${short[1]}${short[2]}${short[2]}${short[3]}${short[3]}`;
  if (typeof document === "undefined") return null;

  const cached = resolved.get(trimmed);
  if (cached !== undefined) return cached;
  const ctx = document.createElement("canvas").getContext("2d");
  let result: string | null = null;
  if (ctx) {
    ctx.fillStyle = "#000001";
    ctx.fillStyle = trimmed;
    const out = String(ctx.fillStyle);
    // An invalid colour leaves the sentinel in place.
    result = out !== "#000001" && /^#[0-9a-f]{6}$/.test(out) ? out : null;
  }
  resolved.set(trimmed, result);
  return result;
}

export function ColorField({
  label,
  value,
  fallback,
  onChange,
}: {
  label: string;
  value: string | undefined;
  /** What the canvas shows when no colour is set. */
  fallback: string;
  onChange: (hex: string) => void;
}) {
  const id = useId();
  const [draft, setDraft] = useState<string | null>(null);
  const hex = toHex6(value) ?? fallback;
  const shown = draft ?? (value ? hex : "");

  function commit() {
    if (draft === null) return;
    const next = toHex6(draft.startsWith("#") ? draft : `#${draft}`);
    setDraft(null);
    if (next) onChange(next);
  }

  return (
    <div className="flex min-w-0 flex-col gap-1.5">
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <div className="flex gap-1.5">
        <span className="relative size-8 shrink-0 overflow-hidden rounded-[4px] border border-line focus-within:ring-1 focus-within:ring-signal">
          <span
            aria-hidden="true"
            className="absolute inset-[3px] rounded-[2px]"
            style={{ backgroundColor: hex }}
          />
          <input
            type="color"
            aria-label={`${label} picker`}
            value={hex}
            onChange={(e) => {
              setDraft(null);
              onChange(e.target.value);
            }}
            className="absolute inset-0 size-full cursor-pointer opacity-0"
          />
        </span>
        <input
          id={id}
          value={shown}
          placeholder={`${fallback} (default)`}
          spellCheck={false}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => {
            if (e.key === "Enter") commit();
            if (e.key === "Escape") setDraft(null);
          }}
          className={cx(inputClasses, "font-tech uppercase")}
        />
      </div>
    </div>
  );
}
