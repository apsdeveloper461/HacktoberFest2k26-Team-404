"use client";

// Owner: Dev 2. Every element as a list: the keyboard path to selection.
// ↑/↓ move through layers; Delete and Esc are handled by the editor.
import { useRef, type KeyboardEvent } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type { WireframeElement } from "@/lib/project/schema";
import { cx } from "@/components/app/cx";
import { snap } from "@/components/app/motion";
import { TypeGlyph, elementTitle } from "../elementMeta";

type LayersProps = {
  elements: WireframeElement[];
  selectedId: string | null;
  onSelect: (id: string) => void;
};

function useArrowNavigation({ elements, selectedId, onSelect }: LayersProps) {
  const refs = useRef(new Map<string, HTMLButtonElement>());

  function onKeyDown(event: KeyboardEvent, index: number, keys: [string, string]) {
    const [back, forward] = keys;
    let next = -1;
    if (event.key === forward) next = Math.min(elements.length - 1, index + 1);
    if (event.key === back) next = Math.max(0, index - 1);
    if (event.key === "Home") next = 0;
    if (event.key === "End") next = elements.length - 1;
    if (next < 0) return;
    event.preventDefault();
    const id = elements[next].id;
    onSelect(id);
    refs.current.get(id)?.focus();
  }

  const register = (id: string) => (node: HTMLButtonElement | null) => {
    if (node) refs.current.set(id, node);
    else refs.current.delete(id);
  };

  // One tab stop: the selected layer, or the first one.
  const tabTarget = selectedId ?? elements[0]?.id;

  return { onKeyDown, register, tabTarget };
}

export function LayersPanel(props: LayersProps) {
  const { elements, selectedId, onSelect } = props;
  const reduce = useReducedMotion();
  const nav = useArrowNavigation(props);

  return (
    <nav aria-label="Layers" className="flex min-h-0 flex-col">
      <div className="flex h-10 shrink-0 items-center justify-between border-b border-line px-3">
        <h2 className="text-[13px] font-medium text-chalk">Layers</h2>
        <span className="font-tech text-[11px] tabular-nums text-muted">{elements.length}</span>
      </div>
      <ul className="min-h-0 flex-1 overflow-y-auto p-1.5">
        <AnimatePresence initial={false}>
          {elements.map((element, index) => {
            const selected = element.id === selectedId;
            return (
              <motion.li
                key={element.id}
                layout={reduce ? false : "position"}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.1 } }}
                transition={snap}
              >
                <button
                  ref={nav.register(element.id)}
                  type="button"
                  aria-current={selected ? "true" : undefined}
                  tabIndex={element.id === nav.tabTarget ? 0 : -1}
                  onClick={() => onSelect(element.id)}
                  onKeyDown={(e) => nav.onKeyDown(e, index, ["ArrowUp", "ArrowDown"])}
                  className={cx(
                    "relative flex h-8 w-full items-center gap-2 rounded-[4px] pl-2.5 pr-2 text-left text-[13px] transition-colors duration-150 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-signal",
                    selected
                      ? "bg-signal/[0.09] text-chalk"
                      : "text-muted hover:bg-white/[0.04] hover:text-chalk",
                  )}
                >
                  {selected && (
                    <span aria-hidden="true" className="absolute inset-y-1.5 left-0 w-0.5 rounded-full bg-signal" />
                  )}
                  <TypeGlyph type={element.type} className="shrink-0 opacity-80" />
                  <span className="min-w-0 flex-1 truncate">{elementTitle(element)}</span>
                  <span className="max-w-[76px] truncate font-tech text-[10.5px] text-muted/80">
                    {element.id}
                  </span>
                </button>
              </motion.li>
            );
          })}
        </AnimatePresence>
      </ul>
    </nav>
  );
}

/** Below 1024px: the same layers as a horizontal strip above the canvas. */
export function LayersStrip(props: LayersProps) {
  const { elements, selectedId, onSelect } = props;
  const nav = useArrowNavigation(props);

  return (
    <nav aria-label="Layers" className="border-b border-line bg-ink">
      <ul className="flex gap-1.5 overflow-x-auto px-3 py-2 [scrollbar-width:none]">
        {elements.map((element, index) => {
          const selected = element.id === selectedId;
          return (
            <li key={element.id} className="shrink-0">
              <button
                ref={nav.register(element.id)}
                type="button"
                aria-current={selected ? "true" : undefined}
                tabIndex={element.id === nav.tabTarget ? 0 : -1}
                onClick={() => onSelect(element.id)}
                onKeyDown={(e) => nav.onKeyDown(e, index, ["ArrowLeft", "ArrowRight"])}
                className={cx(
                  "flex h-9 max-w-[180px] items-center gap-1.5 rounded-[4px] border px-2.5 text-[13px] transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-signal",
                  selected
                    ? "border-signal/50 bg-signal/10 text-chalk"
                    : "border-line text-muted",
                )}
              >
                <TypeGlyph type={element.type} className="shrink-0" />
                <span className="truncate">{elementTitle(element)}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
