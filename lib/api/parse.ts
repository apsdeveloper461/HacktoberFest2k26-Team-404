// Request/response contract for POST /api/parse, plus the browser helper.
import type { WireframeProject } from "@/lib/project/schema";

export type ParseResponse =
  | { ok: true; project: WireframeProject }
  | { ok: false; error: string };

/** Sends the sketch as multipart form data (field name: "image"). */
export async function requestParse(image: File): Promise<ParseResponse> {
  const body = new FormData();
  body.append("image", image);

  try {
    const res = await fetch("/api/parse", { method: "POST", body });
    return (await res.json()) as ParseResponse;
  } catch {
    return { ok: false, error: "Could not reach the server. Try again." };
  }
}
