import "server-only";
import {
  wireframeProjectSchema,
  type WireframeProject,
} from "@/lib/project/schema";
import { MODEL_RESPONSE_JSON_SCHEMA } from "./model-schema";
import { normalizeSketch } from "./normalize";
import { SYSTEM_INSTRUCTION, WIREFRAME_PROMPT } from "./prompt";
import { callVisionModel, VisionError, type VisionErrorKind } from "./vision";

// Owner: Lead. photo → model → JSON → normalize → zod contract → project.

/** Thrown with a message that is safe to show the user, plus the HTTP status to answer with. */
export class SketchParseError extends Error {
  constructor(
    message: string,
    readonly status = 502,
  ) {
    super(message);
    this.name = "SketchParseError";
  }
}

export type ParsedSketch = {
  project: WireframeProject;
  /** Short remarks for the user, e.g. how many shapes were skipped. */
  notes: string[];
};

const USER_ERRORS: Record<VisionErrorKind, [string, number]> = {
  config: ["The AI isn't set up on this server yet. Use the sample to try the editor.", 503],
  auth: ["The AI service rejected this server's API key. Ask the team to check it.", 502],
  rate_limit: ["The AI is busy right now. Try again in a minute.", 429],
  timeout: ["Reading the sketch took too long. Try again, or try a simpler photo.", 504],
  bad_request: ["The AI couldn't process this image. Try a different photo.", 502],
  empty: ["The AI returned an empty answer. Try again.", 502],
  upstream: ["The AI service had a problem. Try again in a moment.", 502],
};

/** One retry when the model's answer can't be used; API errors are not retried. */
const MAX_ATTEMPTS = 2;

export async function parseSketch(image: File): Promise<ParsedSketch> {
  const started = performance.now();
  let problem = "";

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
    const raw = await askModel(image);

    const json = extractJson(raw);
    if (json === undefined) {
      problem = "response was not JSON";
      continue;
    }

    const normalized = normalizeSketch(json);
    if (!normalized.ok) {
      problem = normalized.reason;
      continue;
    }

    const result = wireframeProjectSchema.safeParse(normalized.project);
    if (!result.success) {
      // normalize.ts should make this impossible; log loudly if it ever happens.
      console.error("[parseSketch] normalized project failed the contract", result.error.issues);
      problem = "contract validation failed";
      continue;
    }

    if (result.data.elements.length === 0) {
      throw new SketchParseError(
        "No wireframe elements were found in this photo. Try a clearer shot with dark marker on light paper.",
        422,
      );
    }

    console.info("[parseSketch] ok", {
      attempt,
      ms: Math.round(performance.now() - started),
      ...normalized.stats,
    });
    return { project: result.data, notes: normalized.notes };
  }

  console.error("[parseSketch] unusable model output", { problem });
  throw new SketchParseError(
    "The AI's answer couldn't be turned into a page. Try again, or try a clearer photo.",
    502,
  );
}

async function askModel(image: File): Promise<string> {
  try {
    return await callVisionModel(image, WIREFRAME_PROMPT, {
      system: SYSTEM_INSTRUCTION,
      jsonSchema: MODEL_RESPONSE_JSON_SCHEMA,
    });
  } catch (error) {
    const kind = error instanceof VisionError ? error.kind : "upstream";
    console.error("[parseSketch] model call failed", {
      kind,
      status: error instanceof VisionError ? error.status : undefined,
      message: error instanceof Error ? error.message : String(error),
    });
    const [message, status] = USER_ERRORS[kind];
    throw new SketchParseError(message, status);
  }
}

/** Parses the model's text as JSON, tolerating code fences or prose around the object. */
function extractJson(text: string): unknown {
  const unfenced = text
    .replace(/^\s*```(?:json)?\s*/i, "")
    .replace(/\s*```\s*$/, "")
    .trim();
  try {
    return JSON.parse(unfenced);
  } catch {
    const start = unfenced.indexOf("{");
    const end = unfenced.lastIndexOf("}");
    if (start === -1 || end <= start) return undefined;
    try {
      return JSON.parse(unfenced.slice(start, end + 1));
    } catch {
      return undefined;
    }
  }
}
