import "server-only";

// Owner: Lead. The only place that reads the vision-model env vars (.env.local).
// Read at call time, never at import time, so a missing key can't crash the route.

export const DEFAULT_GEMMA_MODEL = "gemma-4-31b-it";

export type VisionConfig =
  | {
      provider: "gemini";
      apiKey: string;
      model: string;
      /** Gemma 4 thinking: off by default for speed (VISION_THINKING=on enables it). */
      thinking: boolean;
    }
  | {
      provider: "openai-compatible";
      url: string;
      apiKey: string | undefined;
      model: string;
    };

/** Gemini API (GEMINI_API_KEY) wins; otherwise any OpenAI-compatible endpoint; otherwise null. */
export function readVisionConfig(): VisionConfig | null {
  const model = process.env.VISION_MODEL?.trim();

  const geminiKey = process.env.GEMINI_API_KEY?.trim();
  if (geminiKey) {
    return {
      provider: "gemini",
      apiKey: geminiKey,
      model: model || DEFAULT_GEMMA_MODEL,
      thinking: process.env.VISION_THINKING?.trim() === "on",
    };
  }

  const url = process.env.VISION_API_URL?.trim();
  if (url && model) {
    return {
      provider: "openai-compatible",
      url,
      apiKey: process.env.VISION_API_KEY?.trim() || undefined,
      model,
    };
  }

  return null;
}
