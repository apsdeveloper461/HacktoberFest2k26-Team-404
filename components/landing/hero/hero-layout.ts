// Geometry of "fig. 01", the whiteboard wireframe that opens the page.
// Shared by the rough sketch (hero, before/after) and every crisp version of
// it (live card, before/after "after" layer, final CTA), so the boundaries line
// up exactly: the line becomes the boundary.

export const HERO_VIEW = { w: 800, h: 600 } as const;

export type Box = { x: number; y: number; w: number; h: number };

export const heroBoxes = {
  frame: { x: 40, y: 36, w: 720, h: 528 },
  titlebar: { x: 40, y: 36, w: 720, h: 42 },
  url: { x: 132, y: 47, w: 280, h: 20 },
  nav: { x: 40, y: 78, w: 720, h: 62 },
  logo: { x: 66, y: 96, w: 120, h: 30 },
  avatar: { x: 680, y: 94, w: 40, h: 32 },
  heading: { x: 66, y: 160, w: 330, h: 46 },
  sub: { x: 66, y: 214, w: 330, h: 40 },
  input: { x: 72, y: 274, w: 300, h: 46 },
  button: { x: 386, y: 274, w: 124, h: 46 },
  tabs: { x: 66, y: 336, w: 160, h: 30 },
  list: { x: 60, y: 376, w: 460, h: 156 },
  image: { x: 560, y: 166, w: 172, h: 140 },
  footer: { x: 66, y: 538, w: 140, h: 20 },
} satisfies Record<string, Box>;

export type HeroBoxId = keyof typeof heroBoxes;

export const heroTasks = ["Sketch the flow", "Photograph the board", "Open the preview"] as const;

/** Box → CSS percentages inside a container that has the hero's aspect ratio. */
export function pct(box: Box) {
  return {
    left: `${(box.x / HERO_VIEW.w) * 100}%`,
    top: `${(box.y / HERO_VIEW.h) * 100}%`,
    width: `${(box.w / HERO_VIEW.w) * 100}%`,
    height: `${(box.h / HERO_VIEW.h) * 100}%`,
  };
}
