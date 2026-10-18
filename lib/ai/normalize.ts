// Owner: Lead. Turns whatever the model returned into a project that fits the
// contract (lib/project/schema.ts). Pure and deterministic: no I/O, no env, no
// randomness — the same model output always gives the same project.
import type {
  ElementStyle,
  ElementType,
  WireframeElement,
  WireframeProject,
} from "@/lib/project/schema";
import {
  MODEL_CANVAS,
  modelElementSchema,
  modelSketchSchema,
  type ModelElement,
  type ModelElementType,
} from "./model-schema";

export type NormalizeResult =
  | {
      ok: true;
      project: WireframeProject;
      /** Short, user-facing remarks (shown once after parsing). */
      notes: string[];
      /** For server logs only. */
      stats: { received: number; kept: number; unknownType: number; invalid: number; rescaled: boolean };
    }
  | { ok: false; reason: string };

const { width: W, height: H } = MODEL_CANVAS;
const MAX_TEXT = 200;

/** Words models commonly use for the types we ask for. */
const TYPE_ALIASES: Record<string, ModelElementType> = {
  nav: "nav",
  navbar: "nav",
  navigation: "nav",
  menu: "nav",
  header: "nav",
  heading: "heading",
  title: "heading",
  h1: "heading",
  h2: "heading",
  text: "text",
  paragraph: "text",
  label: "text",
  link: "text",
  caption: "text",
  button: "button",
  btn: "button",
  cta: "button",
  input: "input",
  textbox: "input",
  textfield: "input",
  field: "input",
  search: "input",
  textarea: "input",
  image: "image",
  img: "image",
  picture: "image",
  photo: "image",
  icon: "image",
  logo: "image",
  card: "card",
  panel: "card",
  container: "container",
  section: "container",
  box: "container",
  div: "container",
  group: "container",
  hero: "container",
  footer: "container",
  sidebar: "container",
};

type Box = { x: number; y: number; width: number; height: number };
type Draft = { id: string; type: ElementType; text?: string; box: Box; style: ElementStyle };

export function normalizeSketch(raw: unknown): NormalizeResult {
  const root = Array.isArray(raw) ? { elements: raw } : raw;
  const parsed = modelSketchSchema.safeParse(root);
  if (!parsed.success) return { ok: false, reason: "response has no elements array" };

  let unknownType = 0;
  let invalid = 0;
  const found: Array<{ el: ModelElement; type: ModelElementType }> = [];

  for (const item of parsed.data.elements) {
    const el = modelElementSchema.safeParse(item);
    if (!el.success || el.data.width <= 0 || el.data.height <= 0) {
      invalid += 1;
      continue;
    }
    const type = TYPE_ALIASES[el.data.type.trim().toLowerCase()];
    if (!type) {
      unknownType += 1;
      continue;
    }
    found.push({ el: el.data, type });
  }

  // The model is asked for a 900×700 canvas, but may report (or use) another one,
  // e.g. the photo's own pixel size. Scale so every element lands on the canvas.
  const reported = parsed.data.canvas;
  let srcW = reported && reported.width > 0 ? reported.width : W;
  let srcH = reported && reported.height > 0 ? reported.height : H;
  const maxX = Math.max(0, ...found.map(({ el }) => el.x + el.width));
  const maxY = Math.max(0, ...found.map(({ el }) => el.y + el.height));
  if (maxX > srcW * 1.05) srcW = maxX;
  if (maxY > srcH * 1.05) srcH = maxY;
  const sx = W / srcW;
  const sy = H / srcH;
  const rescaled = Math.abs(sx - 1) > 0.01 || Math.abs(sy - 1) > 0.01;

  const ids = new Set<string>();
  const drafts: Draft[] = [];

  for (const { el, type } of found) {
    const box = fitBox({
      x: el.x * sx,
      y: el.y * sy,
      width: el.width * sx,
      height: el.height * sy,
    });
    const text = cleanText(el.text);
    const id = uniqueId(el.id, type, ids);
    drafts.push(...toContract(id, type, text, box, ids));
  }

  // Backgrounds first (largest first), then content top-to-bottom, left-to-right,
  // so containers never cover what is drawn inside them.
  drafts.sort((a, b) => {
    const aBack = a.type === "container";
    const bBack = b.type === "container";
    if (aBack !== bBack) return aBack ? -1 : 1;
    if (aBack) return area(b.box) - area(a.box);
    return a.box.y - b.box.y || a.box.x - b.box.x;
  });

  const elements: WireframeElement[] = drafts.map(({ id, type, text, box, style }) => ({
    id,
    type,
    ...(text !== undefined && { text }),
    ...box,
    style,
  }));

  const notes: string[] = [];
  const skipped = unknownType + invalid;
  if (skipped > 0) {
    notes.push(`Skipped ${skipped} ${skipped === 1 ? "shape" : "shapes"} that couldn't be turned into page elements.`);
  }

  return {
    ok: true,
    project: { version: 1, type: "wireframe", canvas: { width: W, height: H }, elements },
    notes,
    stats: { received: parsed.data.elements.length, kept: elements.length, unknownType, invalid, rescaled },
  };
}

/** Maps one semantic element to one or two contract elements. */
function toContract(
  id: string,
  type: ModelElementType,
  text: string,
  box: Box,
  ids: Set<string>,
): Draft[] {
  switch (type) {
    case "heading":
      return [{ id, type: "text", text, box, style: { fontSize: clamp(Math.round(box.height * 0.62), 24, 48) } }];
    case "text":
      return [{ id, type: "text", text, box, style: { fontSize: clamp(Math.round(box.height * 0.6), 14, 20) } }];
    case "button":
      return [{ id, type: "button", text: text || "Button", box, style: {} }];
    case "input":
      return [{ id, type: "input", text, box, style: {} }];
    case "image":
      return [{ id, type: "image", box, style: {} }];
    case "container":
      return [{ id, type: "container", box, style: {} }];
    case "nav": {
      const bar: Draft = { id, type: "container", box, style: { backgroundColor: "#f4f4f5" } };
      if (!text) return [bar];
      const height = Math.min(box.height, 28);
      const label = fitBox({
        x: box.x + 16,
        y: box.y + (box.height - height) / 2,
        width: box.width - 32,
        height,
      });
      return [bar, { id: uniqueId(`${id}-links`, "text", ids), type: "text", text, box: label, style: { fontSize: 15 } }];
    }
    case "card": {
      const card: Draft = { id, type: "container", box, style: { backgroundColor: "#ffffff" } };
      if (!text) return [card];
      const title = fitBox({
        x: box.x + 12,
        y: box.y + 10,
        width: box.width - 24,
        height: Math.min(28, Math.max(1, box.height - 10)),
      });
      return [card, { id: uniqueId(`${id}-title`, "text", ids), type: "text", text, box: title, style: { fontSize: 16 } }];
    }
  }
}

/** Integer box, fully inside the canvas, at least 1×1. */
function fitBox({ x, y, width, height }: Box): Box {
  const left = clamp(Math.round(x), 0, W - 1);
  const top = clamp(Math.round(y), 0, H - 1);
  return {
    x: left,
    y: top,
    width: clamp(Math.round(width), 1, W - left),
    height: clamp(Math.round(height), 1, H - top),
  };
}

function cleanText(text: string | null | undefined) {
  return (text ?? "").replace(/\s+/g, " ").trim().slice(0, MAX_TEXT);
}

function uniqueId(raw: string | undefined, fallback: string, used: Set<string>) {
  const base =
    (raw ?? "")
      .toLowerCase()
      .replace(/[^a-z0-9_-]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 40) || fallback;
  let id = base;
  for (let n = 2; used.has(id); n += 1) id = `${base}-${n}`;
  used.add(id);
  return id;
}

function area(box: Box) {
  return box.width * box.height;
}

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}
