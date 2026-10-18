"use client";

// Owner: Dev 2. Shows the JSON that drives the preview — the real source of truth.
// The selected element's block is highlighted, and lines that just changed flash.
// TODO (stretch): a "JSX preview" tab generated from the elements.
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import type { WireframeProject } from "@/lib/project/schema";
import { Button } from "@/components/app/Button";
import { CheckIcon, CopyIcon } from "@/components/app/icons";
import { cx } from "@/components/app/cx";

type Range = { start: number; end: number };

export function StructurePanel({
  project,
  selectedId,
}: {
  project: WireframeProject;
  selectedId: string | null;
}) {
  const text = useMemo(() => JSON.stringify(project, null, 2), [project]);
  const lines = useMemo(() => text.split("\n"), [text]);
  const blocks = useMemo(() => elementBlocks(lines), [lines]);
  const selected = selectedId ? blocks.get(selectedId) : undefined;

  const scrollRef = useRef<HTMLDivElement>(null);
  const previous = useRef<string[] | null>(null);
  const [copied, setCopied] = useState(false);

  // Flash lines whose text changed (same line count = an in-place edit).
  useEffect(() => {
    const before = previous.current;
    previous.current = lines;
    const root = scrollRef.current;
    if (!before || !root || before.length !== lines.length) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    lines.forEach((line, index) => {
      if (line === before[index]) return;
      root
        .querySelector<HTMLElement>(`[data-line="${index}"]`)
        ?.animate(
          [{ backgroundColor: "rgba(217, 255, 99, 0.22)" }, { backgroundColor: "rgba(217, 255, 99, 0)" }],
          { duration: 900, easing: "cubic-bezier(0.16, 1, 0.3, 1)" },
        );
    });
  }, [lines]);

  // Bring the selected element's block into view inside the panel only.
  useEffect(() => {
    const root = scrollRef.current;
    if (!root || !selected) return;
    const first = root.querySelector<HTMLElement>(`[data-line="${selected.start}"]`);
    if (!first) return;
    const top = first.offsetTop;
    const visible = top >= root.scrollTop && top < root.scrollTop + root.clientHeight - 40;
    if (!visible) root.scrollTo({ top: Math.max(0, top - 48) });
  }, [selected]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard blocked: the JSON is still selectable by hand.
    }
  }

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex h-10 shrink-0 items-center justify-between gap-2 border-b border-line pl-4 pr-2">
        <p className="font-tech text-[11px] text-muted">
          project.json · <span className="tabular-nums">{lines.length}</span> lines
        </p>
        <Button variant="ghost" onClick={copy} aria-live="polite">
          {copied ? <CheckIcon className="text-signal" /> : <CopyIcon />}
          {copied ? "Copied" : "Copy"}
        </Button>
      </div>
      <div
        ref={scrollRef}
        className="relative min-h-0 flex-1 overflow-auto py-2 font-tech text-[11.5px] leading-[1.7]"
      >
        <pre className="min-w-max">
          <code>
            {lines.map((line, index) => {
              const inSelection =
                selected !== undefined && index >= selected.start && index <= selected.end;
              return (
                <span
                  key={index}
                  data-line={index}
                  className={cx(
                    "flex border-l-2 pr-4",
                    inSelection ? "border-signal bg-signal/[0.06]" : "border-transparent",
                  )}
                >
                  <span
                    aria-hidden="true"
                    className="w-9 shrink-0 select-none pr-3 text-right tabular-nums text-muted/50"
                  >
                    {index + 1}
                  </span>
                  <span className="whitespace-pre">{highlight(line)}</span>
                </span>
              );
            })}
          </code>
        </pre>
      </div>
    </div>
  );
}

/** Line ranges of each element object inside `"elements": [ … ]` (2-space JSON). */
function elementBlocks(lines: string[]) {
  const blocks = new Map<string, Range>();
  let start = -1;
  let id: string | null = null;
  lines.forEach((line, index) => {
    if (line === "    {") {
      start = index;
      id = null;
    } else if (start >= 0 && id === null) {
      const match = /^ {6}"id": "(.*)",?$/.exec(line);
      if (match) id = JSON.parse(`"${match[1]}"`) as string;
    }
    if (start >= 0 && (line === "    }" || line === "    },")) {
      if (id) blocks.set(id, { start, end: index });
      start = -1;
    }
  });
  return blocks;
}

const TOKEN =
  /("(?:[^"\\]|\\.)*")(\s*:)?|(-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)|\b(true|false|null)\b/g;

/** Minimal JSON colouring: keys, strings, numbers, literals. */
function highlight(line: string) {
  const parts: ReactNode[] = [];
  let last = 0;
  for (const match of line.matchAll(TOKEN)) {
    const at = match.index ?? 0;
    if (at > last) parts.push(<span key={`p${last}`} className="text-muted">{line.slice(last, at)}</span>);
    const [whole, str, colon, num, literal] = match;
    if (str && colon) {
      parts.push(
        <span key={at} className="text-chalk/85">
          {str}
        </span>,
        <span key={`c${at}`} className="text-muted">
          {colon}
        </span>,
      );
    } else if (str) {
      parts.push(
        <span key={at} className="text-[#cfe39a]">
          {str}
        </span>,
      );
    } else if (num) {
      parts.push(
        <span key={at} className="text-[#e8c28e]">
          {num}
        </span>,
      );
    } else if (literal) {
      parts.push(
        <span key={at} className="text-[#a9c7ff]">
          {literal}
        </span>,
      );
    }
    last = at + whole.length;
  }
  if (last < line.length) parts.push(<span key={`p${last}`} className="text-muted">{line.slice(last)}</span>);
  return parts;
}
