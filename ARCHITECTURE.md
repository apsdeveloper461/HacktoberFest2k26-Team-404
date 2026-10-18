# ChalkScript AI — Code Architecture

How the code is laid out, who owns what, and the rules that let us work in parallel.
Product context lives in [CHALKSCRIPT_AI_PROJECT_PLAN.md](CHALKSCRIPT_AI_PROJECT_PLAN.md) and [CHALKSCRIPT_AI_FULL_FLOW.md](CHALKSCRIPT_AI_FULL_FLOW.md).

## Folder layout

`app/` is **only for routing** (pages, layouts, route handlers). Everything else lives in `components/` and `lib/` at the root and is imported with `@/…`.

```text
app/
  layout.tsx, page.tsx, globals.css  Landing page + root layout        → Landing
  workspace/
    page.tsx, layout.tsx             /workspace route + dark app frame  → Dev 2
    error.tsx                        Crash boundary (Retry / Start over)→ Dev 2
    workspace.css                    Scan line, dialog, view transitions→ Dev 2
  not-found.tsx                      404 page                           → Dev 2
  api/parse/route.ts                 POST /api/parse                    → Lead

components/
  app/                               App UI primitives: Button, Tabs,   → Dev 2
                                     Dialog, Toast, fields, icons, motion tokens
  upload/ImageUploader.tsx           Dropzone, file picker, camera      → Dev 2
  workspace/
    Workspace.tsx                    Stage switch, top bar, all actions → Dev 2
    useWorkspace.ts                  State machine + undo history       → Dev 2
    stages/                          Pick, Review (+ parsing, errors)   → Dev 2
    editor/                          EditorStage, CanvasViewport (zoom),→ Dev 2
                                     SelectionOverlay, Layers, StatusBar
    PreviewCanvas.tsx                Renders project JSON on a canvas   → Dev 2
    ElementRenderer.tsx              One element → React (per type)     → Dev 2
    ElementInspector.tsx             Edit selected element              → Dev 2
    StructurePanel.tsx               JSON view (JSX view = stretch)     → Dev 2
    ExportButton.tsx                 PNG export (html-to-image, 2×)     → Dev 2
  landing/                           Landing page sections              → Landing

lib/
  project/schema.ts                  ★ THE CONTRACT: zod schema + types → Lead + Dev 2
  project/update.ts                  Pure edit helpers (update/remove)
  project/storage.ts                 localStorage save/restore
  project/sample-project.json        Backup parse result for the demo   → Dev 3
  project/sample.ts                  Validated import of the sample
  api/parse.ts                       ParseResponse type + requestParse() (browser)
  ai/                                SERVER ONLY (`import "server-only"`)
    prompt.ts                        Wireframe-parsing prompt           → Lead
    vision.ts                        Model call (OpenAI-compatible)     → Lead
    parse-sketch.ts                  call → JSON.parse → validate       → Lead
  upload.ts                          Accepted types + size limit (client & server)

public/samples/                      Hand-drawn sample wireframe photos → Dev 3
.env.example                         Model config template → copy to .env.local
```

## Data flow

```text
/ (landing) ── "Start with a sketch" ──▶ /workspace
                                            │
                       ImageUploader ──requestParse(file)──▶ POST /api/parse
                                            │                     │
                                            │        validateImageFile → parseSketch
                                            │        (vision.ts → JSON.parse → zod)
                                            ◀──── { ok, project } | { ok:false, error }
                                            │
                Workspace state: project (WireframeProject) + selectedId
                 ├─ PreviewCanvas → ElementRenderer   (renders the JSON)
                 ├─ ElementInspector → updateElement() (edits the JSON)
                 ├─ StructurePanel                     (shows the JSON)
                 └─ ExportButton                       (PNG of the canvas)
                 └─ saved to localStorage on every change
```

The **project JSON is the source of truth**. The photo is only the model's input — nothing renders or edits it.

## The contract (`lib/project/schema.ts`)

- Element types: `text`, `button`, `input`, `image`, `container`.
- Every element: `id`, `type`, optional `text`, `x`, `y`, `width`, `height`, `style` (`fontSize`, `color`, `backgroundColor`).
- Frontend and backend both import these types. The backend validates model output with `wireframeProjectSchema`, so the frontend can trust anything it receives.
- **Don't change this file on your own.** Agree with the other side first, then change it in one commit.

API: `POST /api/parse`, multipart form field `image` → `ParseResponse` (`lib/api/parse.ts`). Errors come back as `{ ok: false, error }` with a message that's safe to show the user.

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in VISION_API_URL / VISION_MODEL / VISION_API_KEY
npm run dev
```

Open http://localhost:3000/workspace. **Open sample** loads `sample-project.json`, so the editor works without the AI.

## Workspace UI

`/workspace` is one route with four stages, driven by `useWorkspace.ts`: **pick → review → parsing → editor**. The project JSON stays the source of truth: every edit goes through `updateElement()` / `removeElement()` and is pushed onto an undo history (rapid typing in one field is grouped into one step).

- **Look:** dark ink chrome around a light canvas, using the brand tokens from `app/globals.css` (`ink`, `chalk`, `signal`, `line`, `font-tech`, `--ease-snap`). Signal is reserved for the primary action, selection and focus. The canvas keeps its own white/near-black colour context, so the app theme never leaks into the user's page or the PNG.
- **Motion:** React `<ViewTransition>` for arriving from `/` and for stage changes (stage dispatches run in `startTransition`); Motion for the selection glide, layer list and toasts. Everything is 120–240 ms and collapses to instant under `prefers-reduced-motion`.
- **Honesty:** the top bar badge says where the project came from (AI parse / Sample / Restored), and the Original tab only shows a photo when there is one.
- **Keyboard:** Esc deselects, Delete removes (with an Undo toast), Ctrl/⌘+Z and Shift+Ctrl/⌘+Z undo and redo; Layers is the keyboard path to selection.

## Where each role starts

- **Lead:** Fill in `.env.local`, then tune `lib/ai/prompt.ts` against `public/samples/`. If your Gemma endpoint isn't OpenAI-compatible, rewrite only `lib/ai/vision.ts`. Its signature stays `(image, prompt) → string`.
- **Dev 2:** Build out `components/workspace/*` and `components/upload/*`. Every component already has typed props and works end-to-end with the sample. Remaining work: PNG export (`html-to-image`), a camera input, size controls, and styling.
- **Dev 3:** Put photos in `public/samples/` and update `lib/project/sample-project.json` to match your best sketch. It's validated on import, so a typo fails at build time instead of on stage.
- **Landing:** Owns `app/page.tsx`, `app/layout.tsx`, `app/globals.css` and `components/landing/`. The CTA links to `/workspace`.

## Rules

1. **Stay in your files.** If you need a change in someone else's folder, ask them.
2. **Keep secrets on the server.** Only `lib/ai/*` and `app/api/*` read `process.env`. Never use `NEXT_PUBLIC_` for the model key.
3. **Add `"use client"` only at the boundary.** Components with state or handlers that a Server Component imports need it (`Workspace`, `ImageUploader`). Their children don't.
4. **This is Next.js 16 with `cacheComponents` on.** Don't add `export const runtime` to any route (it breaks the build). Check `node_modules/next/dist/docs/` before using an API you remember from older versions.
5. Run `npx tsc --noEmit` and `npm run lint` before you push.
