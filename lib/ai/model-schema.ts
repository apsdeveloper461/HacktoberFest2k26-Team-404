// Owner: Lead. What we ask the vision model for — deliberately richer than the
// project contract (lib/project/schema.ts). Semantic types like "heading" or "nav"
// are easier for the model to recognise; normalize.ts maps them into the contract.
// No secrets here and no server-only import, so it can be exercised in isolation.
import { z } from "zod";

/** The model is asked to place everything on this canvas (same as the contract's default). */
export const MODEL_CANVAS = { width: 900, height: 700 } as const;

export const MODEL_ELEMENT_TYPES = [
  "nav",
  "heading",
  "text",
  "button",
  "input",
  "image",
  "card",
  "container",
] as const;

export type ModelElementType = (typeof MODEL_ELEMENT_TYPES)[number];

/**
 * Structured-output schema sent to the model. Only keywords the Gemini API
 * documents (type, properties, required, enum, description, items).
 */
export const MODEL_RESPONSE_JSON_SCHEMA = {
  type: "object",
  properties: {
    canvas: {
      type: "object",
      properties: {
        width: { type: "number" },
        height: { type: "number" },
      },
      required: ["width", "height"],
    },
    elements: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: { type: "string", description: 'Unique id such as "button-1".' },
          type: { type: "string", enum: [...MODEL_ELEMENT_TYPES] },
          text: {
            type: "string",
            description: 'The handwritten words, exactly as written. "" if none.',
          },
          x: { type: "number" },
          y: { type: "number" },
          width: { type: "number" },
          height: { type: "number" },
        },
        required: ["id", "type", "text", "x", "y", "width", "height"],
      },
    },
  },
  required: ["canvas", "elements"],
} as const;

const finite = z.coerce.number().refine(Number.isFinite);

/** Top level, lenient: elements are checked one by one so one bad item can't sink the rest. */
export const modelSketchSchema = z.object({
  canvas: z
    .object({ width: finite, height: finite })
    .optional()
    .catch(undefined),
  elements: z.array(z.unknown()),
});

/** One element as the model returned it. Unknown `type`s pass through to be counted and dropped. */
export const modelElementSchema = z.object({
  id: z.union([z.string(), z.number()]).transform(String).optional(),
  type: z.string(),
  text: z.string().nullish(),
  x: finite,
  y: finite,
  width: finite,
  height: finite,
});

export type ModelElement = z.infer<typeof modelElementSchema>;
