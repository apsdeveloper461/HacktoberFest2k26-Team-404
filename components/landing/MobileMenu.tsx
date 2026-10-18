"use client";

// Full-screen menu for small screens: dialog semantics, focus trap, Esc to close.
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, type MouseEvent } from "react";
import { BrandMark } from "./BrandMark";
import { links, navItems } from "./content";
import { ArrowRight, ArrowUpRight, btn } from "./ui";

type MobileMenuProps = {
  open: boolean;
  active: string | null;
  onClose: () => void;
};

export function MobileMenu({ open, active, onClose }: MobileMenuProps) {
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const root = panel.current;
    if (!root) return;
    const html = document.documentElement;
    const previous = html.style.overflow;
    html.style.overflow = "hidden";

    const focusables = () =>
      Array.from(root.querySelectorAll<HTMLElement>("a[href], button:not([disabled])"));
    focusables()[0]?.focus();

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== "Tab") return;
      const items = focusables();
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      html.style.overflow = previous;
    };
  }, [open, onClose]);

  const go = (event: MouseEvent<HTMLAnchorElement>, id: string) => {
    const target = document.getElementById(id);
    if (!target) return;
    event.preventDefault();
    document.documentElement.style.removeProperty("overflow");
    onClose();
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    target.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    window.history.pushState(null, "", `#${id}`);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={panel}
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          className="cs-blueprint fixed inset-0 z-60 flex flex-col bg-ink text-chalk lg:hidden"
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="flex h-(--header-h) items-center justify-between px-(--gutter)">
            <BrandMark />
            <button
              type="button"
              onClick={onClose}
              className="cs-eyebrow -mr-2 inline-flex min-h-11 items-center gap-2 px-2"
            >
              Close
              <span aria-hidden="true" className="text-signal">
                ✕
              </span>
            </button>
          </div>

          <nav aria-label="Menu" className="flex-1 px-(--gutter) pt-8">
            <ol className="flex flex-col">
              {navItems.map((item, i) => (
                <li key={item.id} className="border-t border-line last:border-b">
                  <a
                    href={`#${item.id}`}
                    onClick={(event) => go(event, item.id)}
                    aria-current={active === item.id ? "true" : undefined}
                    className="flex min-h-16 items-baseline gap-4 py-3"
                  >
                    <span className="cs-mono text-[11px] text-muted">0{i + 1}</span>
                    <span className="cs-display text-[2.1rem] leading-none">{item.label}</span>
                    {active === item.id && (
                      <span aria-hidden="true" className="ml-auto size-2 self-center bg-signal" />
                    )}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <div className="flex flex-col gap-3 px-(--gutter) pt-6 pb-[max(24px,env(safe-area-inset-bottom))]">
            <Link href={links.workspace} className={btn.signal}>
              Start with a sketch
              <ArrowRight />
            </Link>
            <a href={links.repo} target="_blank" rel="noopener noreferrer" className={btn.ghostDark}>
              Follow the build on GitHub
              <ArrowUpRight />
              <span className="cs-sr">(opens in a new tab)</span>
            </a>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
