"use client";

// Accessible tabs with roving tabindex (←/→/Home/End). Panels are rendered by
// the caller with <TabPanel>, so content stays in the parent's hands.
import { useRef, type KeyboardEvent, type ReactNode } from "react";
import { motion } from "motion/react";
import { cx } from "./cx";
import { snap } from "./motion";

export type TabItem<T extends string> = { id: T; label: string };

export function Tabs<T extends string>({
  idPrefix,
  items,
  value,
  onChange,
  label,
  className,
}: {
  idPrefix: string;
  items: TabItem<T>[];
  value: T;
  onChange: (id: T) => void;
  label: string;
  className?: string;
}) {
  const refs = useRef<Array<HTMLButtonElement | null>>([]);

  function onKeyDown(event: KeyboardEvent, index: number) {
    let next = -1;
    if (event.key === "ArrowRight") next = (index + 1) % items.length;
    if (event.key === "ArrowLeft") next = (index - 1 + items.length) % items.length;
    if (event.key === "Home") next = 0;
    if (event.key === "End") next = items.length - 1;
    if (next < 0) return;
    event.preventDefault();
    onChange(items[next].id);
    refs.current[next]?.focus();
  }

  return (
    <div
      role="tablist"
      aria-label={label}
      className={cx("flex h-10 items-stretch gap-1 px-2", className)}
    >
      {items.map((item, index) => {
        const selected = item.id === value;
        return (
          <button
            key={item.id}
            ref={(node) => {
              refs.current[index] = node;
            }}
            type="button"
            role="tab"
            id={`${idPrefix}-tab-${item.id}`}
            aria-selected={selected}
            aria-controls={`${idPrefix}-panel-${item.id}`}
            tabIndex={selected ? 0 : -1}
            onClick={() => onChange(item.id)}
            onKeyDown={(e) => onKeyDown(e, index)}
            className={cx(
              "relative px-2.5 text-[13px] transition-colors duration-150 focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-signal",
              selected ? "text-chalk" : "text-muted hover:text-chalk",
            )}
          >
            {item.label}
            {selected && (
              <motion.span
                layoutId={`${idPrefix}-indicator`}
                transition={snap}
                className="absolute inset-x-2 bottom-0 h-px bg-signal"
              />
            )}
          </button>
        );
      })}
    </div>
  );
}

export function TabPanel({
  idPrefix,
  id,
  active,
  children,
  className,
}: {
  idPrefix: string;
  id: string;
  active: boolean;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      role="tabpanel"
      id={`${idPrefix}-panel-${id}`}
      aria-labelledby={`${idPrefix}-tab-${id}`}
      hidden={!active}
      tabIndex={0}
      className={cx("focus-visible:outline-none", className)}
    >
      {active && children}
    </div>
  );
}
