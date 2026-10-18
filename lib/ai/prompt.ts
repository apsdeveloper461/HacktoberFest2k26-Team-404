import "server-only";
import { MODEL_GRID } from "./model-schema";

// Owner: Lead. Tune this against the sample sketches in public/samples/.
// The model answers in the shape of MODEL_RESPONSE_JSON_SCHEMA (model-schema.ts);
// normalize.ts turns that into the project contract.

export const SYSTEM_INSTRUCTION =
  "You turn photos of hand-drawn website wireframes into structured layout data. " +
  "You always answer with a single JSON object and nothing else.";

const G = MODEL_GRID;

export const WIREFRAME_PROMPT = `Read this photo of a hand-drawn website wireframe and list every UI element you can see.

Coordinates: report every box on a 0–${G} grid, where (0, 0) is the top-left corner of the drawing and (${G}, ${G}) its bottom-right. x and width are thousandths of the drawing's width; y and height are thousandths of its height. Ignore the paper edges, shadows, hands and background around the drawing.

Use exactly one of these types per element:
- "nav": a bar across the top holding a logo or menu links.
- "heading": a large or underlined title.
- "text": smaller handwritten lines, paragraphs or labels.
- "button": a small box, often rounded or shaded, with a short label such as "Sign up".
- "input": an empty box or underline meant for typing, often labelled "Email", "Search" or "Password". Put that label in "text".
- "image": a box with an X through it, a mountain or sun doodle, or the word "image".
- "card": a bordered box that groups other content.
- "container": a large section or region with no more specific role.

For each element give id, type, text, x, y, width and height.

Rules:
- Use the handwritten words exactly as written for "text"; use "" when there are none.
- Give every element a unique id such as "heading-1" or "button-2".
- Things drawn inside a card or container are separate elements with their own boxes.
- Always commit to your best guess for messy handwriting or unclear shapes. Never skip an element.
- Answer with JSON only — no prose, no markdown — in this shape:
{"canvas":{"width":${G},"height":${G}},"elements":[{"id":"button-1","type":"button","text":"Sign up","x":60,"y":180,"width":180,"height":70}]}`;
