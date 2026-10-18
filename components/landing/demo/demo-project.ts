// The demo's "parse result": a WireframeProject in the real contract shape
// (lib/project/schema.ts), with coordinates taken from the drawing on the
// demo sheet. Type-only import, so zod never reaches the landing bundle.
import type { ElementType, WireframeElement, WireframeProject } from "@/lib/project/schema";

export const SHEET_VIEW = { w: 640, h: 560 } as const;

export const initialProject: WireframeProject = {
  version: 1,
  type: "wireframe",
  canvas: { width: SHEET_VIEW.w, height: SHEET_VIEW.h },
  elements: [
    { id: "nav-1", type: "container", x: 28, y: 28, width: 470, height: 64, style: {} },
    { id: "image-1", type: "image", x: 444, y: 40, width: 42, height: 40, style: {} },
    {
      id: "heading-1",
      type: "text",
      text: "Launch checklist",
      x: 44,
      y: 116,
      width: 304,
      height: 42,
      style: { fontSize: 32, color: "#11120F" },
    },
    {
      id: "text-1",
      type: "text",
      text: "Everything that has to happen before Friday.",
      x: 44,
      y: 164,
      width: 300,
      height: 38,
      style: { fontSize: 15, color: "#5C5F56" },
    },
    { id: "input-1", type: "input", text: "Add a task…", x: 46, y: 210, width: 278, height: 52, style: {} },
    {
      id: "button-1",
      type: "button",
      text: "Add",
      x: 328,
      y: 210,
      width: 148,
      height: 52,
      style: { backgroundColor: "#D9FF63", color: "#11120F" },
    },
    { id: "tabs-1", type: "container", x: 42, y: 282, width: 182, height: 36, style: {} },
    { id: "list-1", type: "container", x: 42, y: 322, width: 438, height: 170, style: {} },
    {
      id: "text-2",
      type: "text",
      text: "2 of 3 done",
      x: 44,
      y: 498,
      width: 140,
      height: 28,
      style: { fontSize: 13, color: "#5C5F56" },
    },
  ],
};

export type Task = { id: number; label: string; done: boolean };

export const initialTasks: Task[] = [
  { id: 1, label: "Sketch the flow", done: true },
  { id: 2, label: "Photograph the board", done: true },
  { id: 3, label: "Open the preview", done: false },
];

/** Short human label for a detected region. */
export function describe(el: WireframeElement): string {
  if (el.text) return `“${el.text}”`;
  if (el.id === "nav-1") return "top bar";
  if (el.id === "tabs-1") return "filter row";
  if (el.id === "list-1") return "3 rows";
  if (el.type === "image") return "avatar";
  return "";
}

export const typeTone: Record<ElementType, string> = {
  text: "bg-chalk text-ink",
  button: "bg-signal text-ink",
  input: "bg-transparent text-chalk ring-1 ring-inset ring-chalk/60",
  image: "bg-muted text-ink",
  container: "bg-transparent text-signal ring-1 ring-inset ring-signal/70",
};

/** Containment depth derived from the boxes (a container that encloses another box is its parent). */
export function depthOf(el: WireframeElement, all: WireframeElement[]): number {
  return all.some(
    (p) =>
      p.id !== el.id &&
      p.type === "container" &&
      el.x >= p.x &&
      el.y >= p.y &&
      el.x + el.width <= p.x + p.width &&
      el.y + el.height <= p.y + p.height,
  )
    ? 1
    : 0;
}

/** Box → CSS percentages on the demo sheet. */
export function sheetPct(el: Pick<WireframeElement, "x" | "y" | "width" | "height">) {
  return {
    left: `${(el.x / SHEET_VIEW.w) * 100}%`,
    top: `${(el.y / SHEET_VIEW.h) * 100}%`,
    width: `${(el.width / SHEET_VIEW.w) * 100}%`,
    height: `${(el.height / SHEET_VIEW.h) * 100}%`,
  };
}
