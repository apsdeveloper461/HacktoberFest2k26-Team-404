"use client";

// Owner: Dev 2. The selection frame, drawn in screen space (not scaled with the
// canvas) so the outline and handles stay crisp at any zoom. It glides between
// elements instead of jumping.
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type { WireframeElement } from "@/lib/project/schema";
import { snap } from "@/components/app/motion";
import { TYPE_LABEL } from "../elementMeta";

const HANDLE = "absolute size-[7px] border border-ink bg-signal";

export function SelectionOverlay({
  element,
  scale,
}: {
  element: WireframeElement | null;
  scale: number;
}) {
  const reduce = useReducedMotion();

  return (
    <AnimatePresence>
      {element && (
        <motion.div
          key="selection"
          aria-hidden="true"
          className="pointer-events-none absolute left-0 top-0"
          initial={{ opacity: 0, ...frame(element, scale) }}
          animate={{ opacity: 1, ...frame(element, scale) }}
          exit={{ opacity: 0, transition: { duration: 0.1 } }}
          transition={reduce ? { duration: 0 } : snap}
        >
          <div className="absolute -inset-px rounded-[1px] border-[1.5px] border-ink shadow-[0_0_0_3px_rgba(217,255,99,0.65)]" />
          <span className={`${HANDLE} -left-1 -top-1`} />
          <span className={`${HANDLE} -right-1 -top-1`} />
          <span className={`${HANDLE} -bottom-1 -left-1`} />
          <span className={`${HANDLE} -bottom-1 -right-1`} />
          <span
            className={`absolute -left-px flex h-5 items-center gap-1 whitespace-nowrap rounded-[3px] bg-ink px-1.5 font-tech text-[10.5px] text-signal ${
              element.y * scale < 26 ? "top-[calc(100%+6px)]" : "-top-6"
            }`}
          >
            {TYPE_LABEL[element.type].toLowerCase()}
            <span className="text-muted">#{element.id}</span>
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function frame(element: WireframeElement, scale: number) {
  return {
    x: element.x * scale,
    y: element.y * scale,
    width: element.width * scale,
    height: element.height * scale,
  };
}
