// Motion tokens + small client helpers for the landing page.
// CSS mirrors these values as --ease-snap / --ease-draw (app/globals.css).
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useCallback, useEffect, useState, useSyncExternalStore, type RefObject } from "react";

export const ease = {
  /** Digital settle: precise, decisive. */
  snap: "expo.out",
  /** Hand stroke: accelerates and lands like a marker. */
  draw: "power2.inOut",
} as const;

export const dur = { micro: 0.18, reveal: 0.6, major: 1.1 } as const;

export const media = {
  desktop: "(min-width: 1024px)",
  motionOk: "(prefers-reduced-motion: no-preference)",
  reduce: "(prefers-reduced-motion: reduce)",
} as const;

let registered = false;

/** Register plugins lazily, from effects only (never during render). */
export function getGsap() {
  if (!registered) {
    gsap.registerPlugin(ScrollTrigger);
    registered = true;
  }
  return { gsap, ScrollTrigger };
}

export function useMediaQuery(query: string) {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const list = window.matchMedia(query);
      list.addEventListener("change", onChange);
      return () => list.removeEventListener("change", onChange);
    },
    [query],
  );
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false,
  );
}

export function useReducedMotionPref() {
  return useMediaQuery(media.reduce);
}

/**
 * "wait" until the element is about to enter the viewport, then "go" (once).
 * Server render and no-JS visitors get `undefined`, which CSS treats as "already shown".
 */
export function useEnterState(ref: RefObject<Element | null>, rootMargin = "0px 0px -15% 0px") {
  const [state, setState] = useState<"wait" | "go" | undefined>(undefined);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setState("go");
          io.disconnect();
        } else {
          setState((s) => s ?? "wait");
        }
      },
      { rootMargin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, rootMargin]);
  return state;
}
