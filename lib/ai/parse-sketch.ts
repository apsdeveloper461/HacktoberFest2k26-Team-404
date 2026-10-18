import "server-only";
import {
  wireframeProjectSchema,
  type WireframeProject,
} from "@/lib/project/schema";
import { WIREFRAME_PROMPT } from "./prompt";
import { callVisionModel } from "./vision";

/** Thrown with a message that is safe to show the user. */
export class SketchParseError extends Error {}

export async function parseSketch(image: File): Promise<WireframeProject> {
  let raw: string;
  try {
    raw = await callVisionModel(image, WIREFRAME_PROMPT);
  } catch (error) {
    console.error("[parseSketch] model call failed", error);
    throw new SketchParseError("The AI could not read this sketch. Try again.");
  }

  let json: unknown;
  try {
    json = JSON.parse(stripCodeFences(raw));
  } catch {
    throw new SketchParseError("The AI returned something that isn't JSON.");
  }

  const result = wireframeProjectSchema.safeParse(json);
  if (!result.success) {
    console.error("[parseSketch] invalid project", result.error.issues);
    throw new SketchParseError("The AI response didn't match the project format.");
  }
  return result.data;
}

function stripCodeFences(text: string): string {
  return text.replace(/^\s*```(?:json)?\s*/i, "").replace(/\s*```\s*$/, "");
}
