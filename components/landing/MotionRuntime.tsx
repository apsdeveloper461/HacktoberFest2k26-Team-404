"use client";

// Page-level motion housekeeping: re-measure scroll scenes once web fonts
// have settled (line breaks move when the display face arrives).
import { useEffect } from "react";
import { getGsap } from "./motion";

export function MotionRuntime() {
  useEffect(() => {
    const { ScrollTrigger } = getGsap();
    let cancelled = false;
    document.fonts?.ready.then(() => {
      if (!cancelled) ScrollTrigger.refresh();
    });
    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener("load", onLoad);
    return () => {
      cancelled = true;
      window.removeEventListener("load", onLoad);
    };
  }, []);
  return null;
}
