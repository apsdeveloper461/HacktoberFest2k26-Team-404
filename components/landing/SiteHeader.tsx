"use client";

// Compact header. Inverts to match the section underneath it and marks the
// section currently in view.
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { BrandMark } from "./BrandMark";
import { links, navItems } from "./content";
import { cx } from "./cx";
import { MobileMenu } from "./MobileMenu";

export function SiteHeader() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      setScrolled(window.scrollY > 8);

      const probe = 32; // header midline
      for (const el of document.querySelectorAll<HTMLElement>("[data-theme]")) {
        const r = el.getBoundingClientRect();
        if (r.top <= probe && r.bottom > probe) {
          setTheme(el.dataset.theme === "light" ? "light" : "dark");
          break;
        }
      }

      const mid = window.innerHeight * 0.45;
      let current: string | null = null;
      for (const { id } of navItems) {
        const r = document.getElementById(id)?.getBoundingClientRect();
        if (r && r.top <= mid && r.bottom > mid) current = id;
      }
      setActive(current);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    menuButton.current?.focus({ preventScroll: true });
  }, []);

  const light = theme === "light";

  return (
    <>
      <header
        className={cx(
          "fixed inset-x-0 top-0 z-50 transition-[background-color,color,box-shadow] duration-300",
          light ? "text-ink" : "text-chalk",
          scrolled &&
            (light
              ? "bg-chalk/95 shadow-[0_1px_0_rgb(17_18_15/0.12)]"
              : "bg-ink/92 shadow-[0_1px_0_rgb(241_240_232/0.08)]"),
        )}
      >
        <div className="mx-auto flex h-(--header-h) max-w-[1440px] items-center justify-between gap-4 px-(--gutter)">
          <a href="#top" className="-m-1 p-1" aria-label="ChalkScript AI, back to top">
            <BrandMark />
          </a>

          <nav aria-label="Primary" className="max-lg:hidden">
            <ul className="flex items-center">
              {navItems.map((item) => {
                const current = active === item.id;
                return (
                  <li key={item.id}>
                    <a
                      href={`#${item.id}`}
                      aria-current={current ? "true" : undefined}
                      className={cx(
                        "cs-eyebrow relative inline-flex min-h-11 items-center px-3 transition-opacity duration-200",
                        current ? "opacity-100" : "opacity-65 hover:opacity-100",
                      )}
                    >
                      {item.label}
                      <span
                        aria-hidden="true"
                        className={cx(
                          "absolute inset-x-3 bottom-2 h-px origin-left transition-transform duration-300 ease-snap",
                          light ? "bg-ink" : "bg-signal",
                          current ? "scale-x-100" : "scale-x-0",
                        )}
                      />
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href={links.workspace}
              className="inline-flex min-h-10 items-center rounded-[2px] bg-signal px-3.5 text-[13px] font-medium whitespace-nowrap text-ink transition-colors duration-200 hover:bg-[#e8ff94] max-sm:hidden"
            >
              Start with a sketch
            </Link>
            <button
              ref={menuButton}
              type="button"
              aria-expanded={open}
              aria-controls="mobile-menu"
              onClick={() => setOpen(true)}
              className="cs-eyebrow -mr-2 inline-flex min-h-11 items-center gap-2 px-2 lg:hidden"
            >
              Menu
              <span aria-hidden="true" className="flex flex-col gap-[3px]">
                <span className="block h-px w-4 bg-current" />
                <span className="block h-px w-4 bg-current" />
              </span>
            </button>
          </div>
        </div>
      </header>
      <MobileMenu open={open} active={active} onClose={close} />
    </>
  );
}
