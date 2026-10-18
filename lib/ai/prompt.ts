import "server-only";
import { ELEMENT_TYPES } from "@/lib/project/schema";

// Owner: Lead. Tune this against the sample sketches in public/samples/.
export const WIREFRAME_PROMPT = `You are reading a photo of a hand-drawn website wireframe.
Identify only these element types: ${ELEMENT_TYPES.join(", ")}.
Estimate each element's position and size on a 900 x 700 canvas.

Respond with JSON only — no prose, no markdown fences — in exactly this shape:
{
  "version": 1,
  "type": "wireframe",
  "canvas": { "width": 900, "height": 700 },
  "elements": [
    {
      "id": "button-1",
      "type": "button",
      "text": "Get started",
      "x": 60, "y": 130, "width": 160, "height": 48,
      "style": { "fontSize": 16, "color": "#ffffff", "backgroundColor": "#2563eb" }
    }
  ]
}

Rules:
- Give every element a unique id such as "text-1", "button-2".
- Use the handwritten words as "text". Omit "text" for images and containers.
- "style" may only contain fontSize, color, backgroundColor (use {} if unsure).
- Skip anything that is not one of the supported types.`;
