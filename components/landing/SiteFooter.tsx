// Restrained footer: identity, the page's own anchors, and the real
// destinations we have (the repo and its license). No invented accounts.
import Link from "next/link";
import { BrandMark } from "./BrandMark";
import { links, navItems } from "./content";
import { ArrowUpRight } from "./ui";

export function SiteFooter() {
  return (
    <footer data-theme="dark" className="relative bg-ink text-chalk">
      <div className="mx-auto max-w-[1440px] px-(--gutter) pt-16 pb-10">
        <div className="grid gap-10 border-t border-line pt-10 md:grid-cols-12">
          <div className="md:col-span-5">
            <BrandMark />
            <p className="mt-4 max-w-[26rem] text-[15px] leading-relaxed text-muted">
              Hand-drawn wireframes in, editable web previews out. An experimental sketch-to-prototype
              tool, in early development.
            </p>
          </div>

          <nav aria-label="Footer" className="md:col-span-3">
            <p className="cs-eyebrow text-muted">On this page</p>
            <ul className="mt-4 flex flex-col">
              {navItems.map((item) => (
                <li key={item.id}>
                  <a href={`#${item.id}`} className="inline-flex min-h-10 items-center text-[15px] text-chalk/85 hover:text-chalk">
                    {item.label}
                  </a>
                </li>
              ))}
              <li>
                <Link href={links.workspace} className="inline-flex min-h-10 items-center text-[15px] text-chalk/85 hover:text-chalk">
                  Workspace
                </Link>
              </li>
            </ul>
          </nav>

          <div className="md:col-span-4">
            <p className="cs-eyebrow text-muted">Project</p>
            <ul className="mt-4 flex flex-col">
              <li>
                <a
                  href={links.repo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-10 items-center gap-1.5 text-[15px] text-chalk/85 hover:text-chalk"
                >
                  Source on GitHub
                  <ArrowUpRight className="size-3.5" />
                  <span className="cs-sr">(opens in a new tab)</span>
                </a>
              </li>
              <li>
                <a
                  href={links.license}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-10 items-center gap-1.5 text-[15px] text-chalk/85 hover:text-chalk"
                >
                  MIT License
                  <ArrowUpRight className="size-3.5" />
                  <span className="cs-sr">(opens in a new tab)</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-6">
          <p className="cs-eyebrow text-muted">A Team 404 project · Hacktoberfest 2026</p>
          <p className="cs-eyebrow text-muted">
            <span className="text-signal">■</span> end of sketch — © 2026 ChalkScript AI
          </p>
        </div>
      </div>
    </footer>
  );
}
