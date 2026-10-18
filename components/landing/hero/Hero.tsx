// 01 — An idea is still a sketch.
// The whole opening choreography is CSS: it starts at first paint, needs no
// JavaScript, and collapses to the finished composition under reduced motion.
import type { CSSProperties } from "react";
import Link from "next/link";
import { links } from "../content";
import { DemoLink } from "../DemoLink";
import { BoundaryWord } from "../sketch/BoundaryWord";
import { timing } from "../sketch/primitives";
import { ArrowDown, ArrowRight, btn } from "../ui";
import { HeroLiveCard } from "./HeroLiveCard";
import { HeroSketch } from "./HeroSketch";
import { heroBoxes, pct } from "./hero-layout";

const list = pct(heroBoxes.list);
const listVars = { "--l": list.left, "--t": list.top, "--w": list.width, "--h": list.height } as CSSProperties;

export function Hero() {
  return (
    <section
      id="top"
      data-theme="dark"
      aria-labelledby="hero-title"
      className="cs-dust relative isolate overflow-hidden bg-ink text-chalk"
    >
      <div
        aria-hidden="true"
        className="cs-blueprint pointer-events-none absolute inset-0 [mask-image:radial-gradient(120%_90%_at_70%_40%,black_30%,transparent_80%)]"
      />

      <div className="relative mx-auto flex min-h-[100svh] max-w-[1440px] flex-col px-(--gutter) pt-[calc(var(--header-h)+clamp(28px,7vh,88px))] pb-8">
        <div className="relative z-10 max-w-[44rem] lg:max-w-[52%]">
          <p className="cs-eyebrow cs-fade-in text-muted" style={timing(40)}>
            ChalkScript AI <span className="text-signal">·</span> sketch → prototype
          </p>

          <h1
            id="hero-title"
            className="cs-display mt-7 text-[clamp(2.9rem,6.5vw,7.25rem)] leading-[0.92] text-chalk"
          >
            <span className="cs-line">
              <span className="cs-rise" style={timing(60)}>
                Your whiteboard
              </span>
            </span>
            <span className="cs-line">
              <span className="cs-rise" style={timing(130)}>
                is closer to
              </span>
            </span>
            <span className="block pt-[0.14em] lg:pl-[1.15em]">
              <BoundaryWord tag="<Software />" at={720}>
                <span className="cs-line">
                  <span className="cs-rise" style={timing(200)}>
                    software
                  </span>
                </span>
              </BoundaryWord>
            </span>
            <span className="cs-line">
              <span className="cs-rise" style={timing(270)}>
                than you think.
              </span>
            </span>
          </h1>

          <p
            className="cs-fade-in mt-8 max-w-[33rem] text-[clamp(1.05rem,1.25vw,1.22rem)] leading-[1.6] text-chalk/78"
            style={timing(340, 500)}
          >
            Photograph a hand-drawn wireframe. ChalkScript AI reads the boxes, labels and arrows,
            and turns them into an editable, interactive web preview — something you can click,
            not a wall of generated code.
          </p>

          <div className="cs-fade-in mt-9 flex flex-wrap items-center gap-3" style={timing(420, 500)}>
            <Link href={links.workspace} className={btn.signal}>
              Start with a sketch
              <ArrowRight />
            </Link>
            <DemoLink className={btn.ghostDark}>
              Watch a sketch compile
              <ArrowDown />
            </DemoLink>
          </div>
        </div>

        {/* fig. 01 */}
        <div className="@container relative mt-14 w-full md:mt-12 lg:absolute lg:top-[calc(var(--header-h)+28px)] lg:right-[-1.5vw] lg:mt-0 lg:w-[min(52vw,860px)]">
          <figure className="relative aspect-[4/3] w-full">
            <HeroSketch animate recedeList className="absolute inset-0 h-full w-full" />

            {/* Region detection over the task list */}
            <div aria-hidden="true" className="pointer-events-none absolute" style={list}>
              <div className="absolute inset-0 overflow-hidden">
                <div
                  className="cs-scan-x absolute inset-0 bg-[linear-gradient(to_right,transparent_60%,rgb(217_255_99/0.18)_94%,#d9ff63_100%)]"
                  style={timing(1950, 900)}
                />
              </div>
              <div className="cs-fade-in absolute -inset-[6px] border border-dashed border-signal/80" style={timing(2200, 300)}>
                <span className="cs-mono absolute -top-[5px] right-[-1px] -translate-y-full bg-signal px-1.5 py-[3px] text-[10px] leading-none text-ink">
                  container#task-list
                </span>
                <span className="cs-mono absolute -bottom-[5px] right-0 translate-y-full pt-1 text-[10px] leading-none text-signal/80 max-md:hidden">
                  460 × 156
                </span>
              </div>
            </div>
            <figcaption className="cs-sr">
              A hand-drawn wireframe in chalk: a browser window for a page called Launch checklist,
              with a task input, an Add button, filter tabs and three tasks with checkboxes. The task
              list has been recognised and replaced by a working list you can tick.
            </figcaption>
          </figure>

          <div
            className="cs-wipe relative mt-5 text-[15px] md:absolute md:mt-0 md:left-(--l) md:top-(--t) md:h-(--h) md:w-(--w) md:text-[clamp(10px,1.72cqw,15px)]"
            style={{ ...listVars, ...timing(2420, 820) }}
          >
            <HeroLiveCard />
          </div>
        </div>

        <div className="relative z-10 mt-auto flex flex-wrap items-end justify-between gap-4 pt-12">
          <p className="cs-eyebrow cs-fade-in max-w-[46rem] leading-[1.7] text-muted" style={timing(600)}>
            <span className="text-signal">●</span> Concept preview — the first build reads hand-drawn
            website wireframes.
          </p>
          <p className="cs-eyebrow cs-fade-in text-muted max-lg:hidden" style={timing(2600)}>
            fig. 01 — whiteboard, partly compiled
          </p>
        </div>
      </div>
    </section>
  );
}
