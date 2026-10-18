// THE CONTRACT between the parser (backend) and the preview (frontend).
// Change this file only after Lead + Dev 2 agree — both sides depend on it.
import { z } from "zod";

export const ELEMENT_TYPES = [
  "text",
  "button",
  "input",
  "image",
  "container",
] as const;

export const elementStyleSchema = z.object({
  fontSize: z.number().positive().optional(),
  color: z.string().optional(),
  backgroundColor: z.string().optional(),
});

export const wireframeElementSchema = z.object({
  id: z.string().min(1),
  type: z.enum(ELEMENT_TYPES),
  text: z.string().optional(),
  x: z.number().min(0),
  y: z.number().min(0),
  width: z.number().positive(),
  height: z.number().positive(),
  style: elementStyleSchema.default({}),
});

export const wireframeProjectSchema = z.object({
  version: z.literal(1),
  type: z.literal("wireframe"),
  canvas: z.object({
    width: z.number().positive(),
    height: z.number().positive(),
  }),
  elements: z.array(wireframeElementSchema),
});

export type ElementType = (typeof ELEMENT_TYPES)[number];
export type ElementStyle = z.infer<typeof elementStyleSchema>;
export type WireframeElement = z.infer<typeof wireframeElementSchema>;
export type WireframeProject = z.infer<typeof wireframeProjectSchema>;

/** Fields the inspector is allowed to change on an element. */
export type ElementPatch = Partial<Omit<WireframeElement, "id" | "style">> & {
  style?: Partial<ElementStyle>;
};
