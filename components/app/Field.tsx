"use client";

// Form fields for the inspector: one height (h-8), one border token, signal focus.
import { useId, useState, type KeyboardEvent, type ReactNode } from "react";
import { cx } from "./cx";

export const inputClasses =
  "h-8 w-full min-w-0 rounded-[4px] border border-line bg-ink px-2.5 text-[13px] text-chalk placeholder:text-muted/60 transition-colors duration-150 hover:border-[#4b4d44] focus-visible:border-signal focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-signal/60";

export function FieldLabel({
  htmlFor,
  hidden = false,
  children,
}: {
  htmlFor?: string;
  /** Keep the accessible name but hide it visually (e.g. when a prefix says it). */
  hidden?: boolean;
  children: ReactNode;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className={cx(
        "font-tech text-[10.5px] uppercase tracking-[0.1em] text-muted",
        hidden && "sr-only",
      )}
    >
      {children}
    </label>
  );
}

export function TextField({
  label,
  value,
  onChange,
  multiline = false,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  multiline?: boolean;
  placeholder?: string;
}) {
  const id = useId();
  return (
    <div className="flex flex-col gap-1.5">
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      {multiline ? (
        <textarea
          id={id}
          value={value}
          rows={3}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className={cx(inputClasses, "h-auto resize-y py-1.5 leading-snug")}
        />
      ) : (
        <input
          id={id}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className={inputClasses}
        />
      )}
    </div>
  );
}

/**
 * Number input that commits on Enter/blur and steps with the arrow keys
 * (Shift = ×10). Typing stays local until committed, so half-typed values
 * never reach the project.
 */
export function NumberField({
  label,
  prefix,
  hideLabel = false,
  value,
  placeholder,
  min,
  max,
  onCommit,
}: {
  label: string;
  hideLabel?: boolean;
  /** Short visual prefix inside the field, e.g. "X". The label stays the accessible name. */
  prefix?: string;
  value: number | undefined;
  placeholder?: string;
  min: number;
  max?: number;
  onCommit: (value: number) => void;
}) {
  const id = useId();
  const [draft, setDraft] = useState<string | null>(null);
  const shown = draft ?? (value === undefined ? "" : String(round(value)));

  function clamp(n: number) {
    const low = Math.max(min, n);
    return max === undefined ? low : Math.min(max, low);
  }

  function commit() {
    if (draft === null) return;
    const parsed = Number.parseFloat(draft);
    setDraft(null);
    if (Number.isFinite(parsed)) onCommit(clamp(round(parsed)));
  }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      commit();
      return;
    }
    if (event.key === "Escape") {
      setDraft(null);
      return;
    }
    if (event.key === "ArrowUp" || event.key === "ArrowDown") {
      event.preventDefault();
      const step = (event.shiftKey ? 10 : 1) * (event.key === "ArrowUp" ? 1 : -1);
      const current = Number.parseFloat(shown);
      const base = Number.isFinite(current) ? current : (value ?? min);
      setDraft(null);
      onCommit(clamp(round(base + step)));
    }
  }

  return (
    <div className="flex min-w-0 flex-col gap-1.5">
      <FieldLabel htmlFor={id} hidden={hideLabel}>
        {label}
      </FieldLabel>
      <div className="relative">
        {prefix && (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-2.5 flex items-center font-tech text-[11px] text-muted"
          >
            {prefix}
          </span>
        )}
        <input
          id={id}
          inputMode="decimal"
          value={shown}
          placeholder={placeholder}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commit}
          onKeyDown={onKeyDown}
          className={cx(inputClasses, "font-tech tabular-nums", prefix && "pl-6")}
        />
      </div>
    </div>
  );
}

function round(n: number) {
  return Math.round(n * 100) / 100;
}
