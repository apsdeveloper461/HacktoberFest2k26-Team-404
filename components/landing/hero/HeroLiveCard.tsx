"use client";

// The first piece of the sketch that has become real DOM: the task list.
import { useState } from "react";
import { heroTasks } from "./hero-layout";

export function HeroLiveCard() {
  const [done, setDone] = useState<boolean[]>([true, true, false]);

  return (
    <div className="cs-on-light flex h-full flex-col justify-center bg-chalk px-[1.1em] py-[0.7em] text-ink shadow-[0_0_0_1px_rgb(17_18_15/0.12)]">
      <ul className="flex flex-col" aria-label="Launch checklist">
        {heroTasks.map((label, i) => (
          <li key={label}>
            <label className="flex min-h-[2.35em] cursor-pointer items-center gap-[0.75em] border-b border-ink/10 last:border-b-0">
              <input
                type="checkbox"
                checked={done[i]}
                onChange={() => setDone((d) => d.map((v, j) => (j === i ? !v : v)))}
                className="size-[1.15em] shrink-0 accent-ink"
              />
              <span
                className={
                  done[i]
                    ? "text-muted-ink line-through decoration-ink/40"
                    : "font-medium"
                }
              >
                {label}
              </span>
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}
