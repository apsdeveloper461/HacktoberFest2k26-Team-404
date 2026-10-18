# Landing page (`components/landing/`)

The marketing page at `/`. `app/page.tsx` only renders `<LandingPage />`. Everything else for the landing page lives in this folder, so it stays separate from the workspace app. See `ARCHITECTURE.md` for ownership.

## Creative direction

**"The line becomes the boundary."** Every transformation on the page is the same gesture: a loose chalk or marker stroke tightens into a precise component edge with selection handles.

- **Physical world:** seeded hand-drawn SVG (`sketch/rough.ts`), chalk on ink, graphite on paper, and Recursive with the Casual axis on for handwriting.
- **Digital world:** hairlines, a blueprint grid, Recursive Mono labels, and real DOM controls.
- **Signal colour (`#D9FF63`):** appears only where something compiles. That covers scan lines, detected regions, selected elements, the primary CTA, and focus rings.

Tokens (colours and eases) are in `app/globals.css` under `@theme`. Fonts (Bricolage Grotesque, Geist and Recursive) are loaded in `app/layout.tsx`.

## Sections

| # | id | File | Interaction / motion |
|---|---|---|---|
| 01 | `#top` | `hero/Hero.tsx` | CSS-only draw-on: headline rise, chalk strokes, "software" snapping into a component, a scan beam, then the live task card wipes in |
| 02 | `#demo` | `demo/*` | State machine `sketch → reading → structuring → interactive`. Regions lift into the structure tree (Motion `layoutId`). The working preview and the inspector both edit real `WireframeProject` JSON |
| 03 | `#how` | `process/*` | Desktop: GSAP pinned and scrubbed layers. Mobile or reduced motion: four static stages |
| 04 | `#use-cases` | `use-cases/*` | Tablist of specimen plates. Each plate has an interactive output: an editable card, ER entities, a request trace, or a flow stepper |
| 05 | `#inside` | `inside/*` | Scroll-drawn pipeline connectors and the build-status ledger |
| 06 | `#before-after` | `before-after/*` | Draggable / keyboard slider between the opening sketch and its compiled twin |
| 07 | `#who` | `audience/*` | Typographic rows. Glyphs resolve on hover or focus, and are always resolved on touch |
| 08 | `#early-access` | `final/FinalCta.tsx` | The opening figure, resolved, drawn on entering the viewport |

`seam/*` is the transition device between dark and light sections. A rough rule straightens as you scroll past it.

## Rules this folder follows

- **Sketches:** paths are generated in **server components only** (`import "server-only"` in `sketch/rough.ts`). Client islands receive them as `children` or props. The seeds are fixed, so the markup is identical on every render.
- **Without JS / with reduced motion:**
  - Every animation's *base* style is its final state, so content is visible without JS.
  - With `prefers-reduced-motion`, CSS keyframes collapse to their final state.
  - GSAP scenes register only under `gsap.matchMedia("(prefers-reduced-motion: no-preference)")`.
  - Motion components use `MotionConfig reducedMotion="user"`.
- **GSAP lifecycle:** `gsap.matchMedia()` is reverted on unmount, and `MotionRuntime` refreshes ScrollTrigger after web fonts load.
- **Data contract:** the demo uses the real contract types from `@/lib/project/schema` (type-only) and `updateElement()` from `@/lib/project/update`. Neither file is changed here.
- **No env vars:** no `process.env` is read (see `ARCHITECTURE.md` rule 2).

## Placeholders / integration points

- **Early access:** there's no waitlist backend. The CTAs go to `/workspace` (the first build) and to the GitHub repo (`content.ts → links`). Swap `links.repo` for a real waitlist URL when one exists.
- **Sitemap / robots:** none yet, because no production domain is known. Once one is known, add `metadataBase` in `app/layout.tsx` plus `app/sitemap.ts` and `app/robots.ts`.
- **Demo:** the "parse" is simulated and labelled as such. Nothing is uploaded.
- **Use cases 02–04 (ER, architecture, flow):** marked *Planned* and drawn as illustrations.
