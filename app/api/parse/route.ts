// POST /api/parse — multipart form data with an "image" field.
// Owner: Lead. No `runtime` export: cacheComponents requires Node.js.
import { parseSketch, SketchParseError } from "@/lib/ai/parse-sketch";
import type { ParseResponse } from "@/lib/api/parse";
import { validateImageFile } from "@/lib/upload";

/** The success body may also carry short notes for the user (e.g. skipped shapes). */
type ParseBody = ParseResponse & { notes?: string[] };

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
    const { project, notes } = await parseSketch(image);
    return reply(notes.length ? { ok: true, project, notes } : { ok: true, project });
  } catch (error) {
    if (error instanceof SketchParseError) {
      return reply({ ok: false, error: error.message }, error.status);
    }
    console.error("[api/parse] unexpected error", error);
    return reply({ ok: false, error: "Something went wrong while reading the sketch." }, 500);
  }
}

function reply(body: ParseBody, status = 200) {
  return Response.json(body, { status });
}
