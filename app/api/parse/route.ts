// POST /api/parse — multipart form data with an "image" field.
// Owner: Lead. No `runtime` export: cacheComponents requires Node.js.
import { parseSketch, SketchParseError } from "@/lib/ai/parse-sketch";
import type { ParseResponse } from "@/lib/api/parse";
import { validateImageFile } from "@/lib/upload";

export async function POST(request: Request) {
  const form = await request.formData().catch(() => null);
  const image = form?.get("image");

  if (!(image instanceof File)) {
    return reply({ ok: false, error: "No image was provided." }, 400);
  }

  const invalid = validateImageFile(image);
  if (invalid) {
    return reply({ ok: false, error: invalid }, 400);
  }

  try {
    const project = await parseSketch(image);
    return reply({ ok: true, project });
  } catch (error) {
    const message =
      error instanceof SketchParseError
        ? error.message
        : "Something went wrong while reading the sketch.";
    return reply({ ok: false, error: message }, 502);
  }
}

function reply(body: ParseResponse, status = 200) {
  return Response.json(body, { status });
}
