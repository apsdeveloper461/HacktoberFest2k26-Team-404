# ChalkScript project contract — version 1

Source of truth in the app: `lib/project/schema.ts` (zod). This file restates it for agents working without the codebase. If the two ever disagree, the schema wins.

## Contents

- [Project](#project)
- [Element](#element)
- [Style](#style)
- [Ordering and ids](#ordering-and-ids)
- [What the app does with it](#what-the-app-does-with-it)

## Project

| Field | Type | Rule |
|---|---|---|
| `version` | number | Always `1` |
| `type` | string | Always `"wireframe"` |
| `canvas.width` | number | Positive. The app always uses `900` |
| `canvas.height` | number | Positive. The app always uses `700` |
| `elements` | array | Zero or more elements (see below). Should not be empty in practice |

## Element

| Field | Type | Rule |
|---|---|---|
| `id` | string | Non-empty, unique within the project. Convention: lowercase `type-n` (`button-2`) |
| `type` | string | One of `text`, `button`, `input`, `image`, `container` |
| `text` | string | Optional. Visible words: heading/paragraph text, button label, input placeholder or label. Omit for `image` and plain `container` |
| `x`, `y` | number | ≥ 0. Top-left corner on the canvas, in canvas pixels |
| `width`, `height` | number | > 0. Should keep the box inside the canvas (`x + width ≤ 900`, `y + height ≤ 700`) |
| `style` | object | Defaults to `{}` when missing; parse output always includes it. See [Style](#style) |

Element types and how the preview renders them:

| `type` | Rendered as | Typical `text` |
|---|---|---|
| `text` | Paragraph / heading, sized by `style.fontSize` | `"Launch checklist"` |
| `button` | Clickable button | `"Sign up"` |
| `input` | Text field; `text` is shown as the placeholder | `"Email"` |
| `image` | Image placeholder | — |
| `container` | Box that groups or backs other elements | — |

## Style

Only three keys are allowed, all optional:

| Key | Type | Example |
|---|---|---|
| `fontSize` | positive number (px) | `32` |
| `color` | CSS colour string | `"#171717"` |
| `backgroundColor` | CSS colour string | `"#f4f4f5"` |

Defaults used by the parser: headings 24–48 px, body text 14–20 px, nav bars `#f4f4f5`, cards `#ffffff`. Leave colours out unless the sketch clearly calls for one (a shaded button, a dark header).

## Ordering and ids

The preview paints elements in array order, so:

1. `container` elements first, largest area first (backgrounds go behind).
2. Everything else top-to-bottom, then left-to-right.

ids are lowercased and limited to `a–z`, `0–9`, `_` and `-`. On a clash, append `-2`, `-3`, … Generated children use the parent id plus a suffix: `nav-1-links`, `card-1-title`.

## What the app does with it

- `POST /api/parse` (multipart field `image`, PNG / JPEG / WebP ≤ 8 MB) returns `{ "ok": true, "project": …, "notes"?: [...] }` or `{ "ok": false, "error": "…" }`.
- `/workspace` renders the project on a canvas, edits it through `updateElement()` / `removeElement()` with undo/redo, shows the JSON in the Structure panel and exports a PNG.
- The browser keeps the current project in `localStorage` under `chalkscript:project`; a valid project stored there is restored on the next visit.
- Unknown keys are stripped by the schema; a project that fails the schema is ignored on restore.
