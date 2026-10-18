---
name: sketch-to-chalkscript
description: Converts a photo or screenshot of a hand-drawn website wireframe (whiteboard, paper or napkin sketch) into a ChalkScript AI project JSON file (version 1, type "wireframe", text / button / input / image / container elements on a 900×700 canvas) and checks it with the bundled zero-dependency validator. Use when someone shares a wireframe sketch and wants an editable ChalkScript project, asks to "turn this sketch into ChalkScript JSON", needs lib/project/sample-project.json rebuilt from a sample photo, or wants to debug a parse result from POST /api/parse.
license: MIT
metadata:
  project: ChalkScript AI
  contract: lib/project/schema.ts (version 1)
  model-convention: Gemma 4 0–1000 box grid
---

# Sketch → ChalkScript project JSON

ChalkScript AI turns a photo of a hand-drawn website wireframe into an editable web preview. The editable source of truth is a small JSON document — the **project contract**. This skill produces that document directly from an image, following the same rules as the app's own Gemma 4 pipeline (`lib/ai/prompt.ts` → `lib/ai/normalize.ts` → `lib/project/schema.ts`), so the result opens in the ChalkScript workspace unchanged.

## When to use

- A user shares a sketch photo and wants a ChalkScript project or "the JSON for this wireframe".
- A teammate needs `lib/project/sample-project.json` updated to match a sample in `public/samples/`.
- A parse from `POST /api/parse` looks wrong and you want a hand-made reference to compare against.

Do **not** use it for architecture, ER or flow diagrams: the contract only describes website wireframes today.

## Output contract (summary)

```json
{
  "version": 1,
  "type": "wireframe",
  "canvas": { "width": 900, "height": 700 },
  "elements": [
    { "id": "heading-1", "type": "text", "text": "Welcome", "x": 60, "y": 40, "width": 300, "height": 56, "style": { "fontSize": 32 } }
  ]
}
```

- `type` is one of `text`, `button`, `input`, `image`, `container` — nothing else.
- Every element has a unique `id`, numeric `x`, `y` (≥ 0) and `width`, `height` (> 0), and a `style` object (write `{}` when there is no style).
- `style` may only contain `fontSize` (positive number), `color`, `backgroundColor` (CSS colour strings).
- `text` is optional; omit it for `image` and plain `container` elements.

Full field rules: [references/contract.md](references/contract.md). A complete worked example: [assets/example-project.json](assets/example-project.json).

## Workflow

Copy this checklist and tick it off as you go:

```
- [ ] 1. Find the drawing
- [ ] 2. List elements with semantic types on a 0–1000 grid
- [ ] 3. Map semantic types to contract types
- [ ] 4. Scale boxes to the 900×700 canvas
- [ ] 5. Assign ids and order the elements
- [ ] 6. Validate with scripts/validate.mjs and fix every error
```

### 1. Find the drawing

Look only at the wireframe. Ignore the paper edge, shadows, hands, the table and anything outside the drawn frame. If the photo is rotated, read it upright.

### 2. List elements on a 0–1000 grid

Describe every UI element you can see with a **semantic** type — these are easier to recognise than the contract types:

| Semantic type | What it looks like |
|---|---|
| `nav` | A bar across the top holding a logo or menu links |
| `heading` | A large or underlined title |
| `text` | Smaller handwritten lines, paragraphs or labels |
| `button` | A small box, often rounded or shaded, with a short label |
| `input` | An empty box or underline meant for typing ("Email", "Search") |
| `image` | A box with an X through it, a mountain/sun doodle, or the word "image" |
| `card` | A bordered box that groups other content |
| `container` | A large region with no more specific role |

Measure each box as thousandths of the drawing: `(0, 0)` is the top-left of the drawing, `(1000, 1000)` its bottom-right. This is the grid Gemma models use natively and the one the app's prompt asks for.

Rules:
- Copy handwritten words **exactly as written** (fix nothing). Use `""` when an element has no words.
- Things drawn inside a card or container are separate elements with their own boxes.
- Commit to a best guess for messy handwriting or ambiguous shapes. Never invent elements that are not drawn.

### 3. Map semantic types to contract types

Mirror `lib/ai/normalize.ts`:

| Semantic | Contract element(s) | Style |
|---|---|---|
| `heading` | `text` | `fontSize` = round(box height × 0.62), clamped to 24–48 |
| `text` | `text` | `fontSize` = round(box height × 0.6), clamped to 14–20 |
| `button` | `button` (text defaults to `"Button"`) | `{}` |
| `input` | `input` (its label or placeholder goes in `text`) | `{}` |
| `image` | `image` (no `text`) | `{}` |
| `container` | `container` (no `text`) | `{}` |
| `nav` | `container` + optional `text` child `"<id>-links"` inset 16 px, max 28 px tall | bar: `backgroundColor: "#f4f4f5"`; links: `fontSize: 15` |
| `card` | `container` + optional `text` child `"<id>-title"` at 12 px from the left and 10 px from the top, max 28 px tall | card: `backgroundColor: "#ffffff"`; title: `fontSize: 16` |

Font sizes use the box height **after** scaling (step 4).

### 4. Scale to the 900×700 canvas

For every box: `x × 0.9`, `y × 0.7`, `width × 0.9`, `height × 0.7`. Round to integers, then keep the box inside the canvas: `0 ≤ x ≤ 899`, `0 ≤ y ≤ 699`, `width ≤ 900 − x`, `height ≤ 700 − y`, each side at least 1.

### 5. Assign ids and order the elements

- ids: lowercase, `type-n` style (`heading-1`, `button-2`), only `a–z 0–9 _ -`, unique (append `-2`, `-3` on clashes).
- Order: all `container` elements first, largest area first; then everything else top-to-bottom, then left-to-right. This keeps backgrounds from covering their content in the preview.
- Trim whitespace in `text`, collapse internal runs of spaces, cap at 200 characters.

### 6. Validate

Save the project, then run the bundled validator (Node 18+, no install needed):

```bash
node skills/sketch-to-chalkscript/scripts/validate.mjs path/to/project.json
```

It exits `0` and prints a summary when the file matches the contract; otherwise it lists every problem with its JSON path and exits `1`. Fix each error and re-run until it passes. Warnings (for example an element sticking out of the canvas) are worth fixing too.

## Using the result

- **In the app:** open `/workspace`, then in the browser console run
  `localStorage.setItem("chalkscript:project", JSON.stringify(<project>))` and reload. The workspace restores it (the top bar shows **Restored**) and the inspector, layers, undo and PNG export all work on it.
- **As the demo fallback:** replace `lib/project/sample-project.json`. It is validated at import time, so `npm run build` fails loudly if it no longer matches.
- **To compare with the model:** `POST /api/parse` with a multipart `image` field returns `{ ok: true, project, notes? }` in the same shape.

## Gotchas

- The canvas is always `900 × 700` in version 1, whatever the photo's size.
- Never put `text` on an `image`; the renderer ignores it and the validator warns.
- Do not add keys outside the contract (`label`, `children`, `zIndex`…). The app's schema strips unknown keys silently, so they would just disappear.
- An empty `elements` array is valid JSON but useless: if nothing is recognisable, say so instead of returning an empty project.
