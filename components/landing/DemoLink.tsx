"use client";

// Secondary hero action: travel to the demo and put focus on its Compile button.
import type { ReactNode } from "react";

export function DemoLink({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <a
      href="#demo"
      className={className}
      onClick={(event) => {
        const section = document.getElementById("demo");
        if (!section) return;
        event.preventDefault();
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        section.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
        window.history.pushState(null, "", "#demo");
        document.getElementById("demo-compile")?.focus({ preventScroll: true });
      }}
    >
      {children}
    </a>
  );
}
