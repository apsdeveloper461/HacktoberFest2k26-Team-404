// Request/response contract for POST /api/parse, plus the browser helper.
import type { WireframeProject } from "@/lib/project/schema";

export type ParseResponse =
  /** `notes`: short remarks for the user, e.g. shapes the parser skipped. */
  | { ok: true; project: WireframeProject; notes?: string[] }
  | { ok: false; error: string };

/** What the browser helper returns: the route's response, or a local cancel. */
export type ParseResult =
  | ParseResponse
  | { ok: false; error: string; cancelled: true };

/**
 * Sends the sketch as multipart form data (field name: "image").
 * Pass an AbortSignal to let the user cancel a slow parse.
 */
export async function requestParse(
  image: File,
  signal?: AbortSignal,
): Promise<ParseResult> {
  const body = new FormData();
  body.append("image", image);

  let res: Response;
  try {
    res = await fetch("/api/parse", { method: "POST", body, signal });
  } catch (error) {
    if (signal?.aborted || isAbortError(error)) {
      return { ok: false, error: "Cancelled.", cancelled: true };
    }
    return {
      ok: false,
      error: "Could not reach the server. Check your connection and try again.",
    };
  }

  // The route always answers with JSON, but a proxy or a crash may not.
  const data: unknown = await res.json().catch(() => null);
  if (isParseResponse(data)) return data;
  return { ok: false, error: messageForStatus(res.status) };
}

function isAbortError(error: unknown) {
  return error instanceof DOMException && error.name === "AbortError";
}

function isParseResponse(data: unknown): data is ParseResponse {
  return typeof data === "object" && data !== null && "ok" in data;
}

function messageForStatus(status: number) {
  if (status === 413) return "That image is too large for the server. Try a smaller photo.";
  if (status === 408 || status === 504) {
    return "Reading the sketch took too long. Try again, or try a simpler photo.";
  }
  if (status >= 500) return "The server couldn't read the sketch right now. Try again in a moment.";
  return `Unexpected response from the server (${status}). Try again.`;
}
