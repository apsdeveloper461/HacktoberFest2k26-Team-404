// Geometry + per-stage layer opacities for the "From thought to structure"
// scene (a sign-up page sketch). Shared by the server-rendered SVG and the
// client scroll timeline.

export const SCENE_VIEW = { w: 800, h: 600 } as const;

export type SceneRegion = {
  id: string;
  type: "text" | "button" | "input" | "image" | "container";
  x: number;
  y: number;
  w: number;
  h: number;
};

export const sceneRegions: SceneRegion[] = [
  { id: "image-1", type: "image", x: 104, y: 94, w: 262, h: 202 },
  { id: "heading-1", type: "text", x: 396, y: 116, w: 276, h: 46 },
  { id: "text-1", type: "text", x: 396, y: 166, w: 290, h: 40 },
  { id: "input-1", type: "input", x: 400, y: 222, w: 290, h: 42 },
  { id: "input-2", type: "input", x: 400, y: 278, w: 290, h: 42 },
  { id: "input-3", type: "input", x: 400, y: 334, w: 290, h: 42 },
  { id: "button-1", type: "button", x: 400, y: 400, w: 150, h: 46 },
  { id: "list-1", type: "container", x: 104, y: 316, w: 262, h: 170 },
  { id: "text-2", type: "text", x: 396, y: 468, w: 214, h: 28 },
];

export const SCENE_LAYERS = ["sketch", "capture", "interpret", "explore", "structure"] as const;
export type SceneLayer = (typeof SCENE_LAYERS)[number];
export type SceneStage = 1 | 2 | 3 | 4;

export const SCENE_STATES: Record<SceneStage, Record<SceneLayer, number>> = {
  1: { sketch: 1, capture: 1, interpret: 0, explore: 0, structure: 0 },
  2: { sketch: 1, capture: 0.3, interpret: 1, explore: 0, structure: 0 },
  3: { sketch: 0.2, capture: 0, interpret: 0, explore: 0, structure: 1 },
  4: { sketch: 0.12, capture: 0, interpret: 0, explore: 1, structure: 0 },
};

/** Crisp rectangle as a path (so it can take pathLength for draw-on). */
export function boxPath({ x, y, w, h }: Pick<SceneRegion, "x" | "y" | "w" | "h">) {
  return `M${x} ${y}h${w}v${h}h${-w}Z`;
}
