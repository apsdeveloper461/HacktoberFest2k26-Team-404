"use client";

// Marks its subtree data-enter="wait" | "go" so CSS can play one-shot
// reveals when it scrolls into view. Server/no-JS render: attribute absent,
// content fully shown.
import { useRef, type ReactNode } from "react";
import { useEnterState } from "./motion";

export function EnterReveal({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const state = useEnterState(ref);
  return (
    <div ref={ref} data-enter={state} className={className}>
      {children}
    </div>
  );
}
