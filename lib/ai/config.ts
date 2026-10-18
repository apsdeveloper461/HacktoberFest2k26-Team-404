import "server-only";

// Owner: Lead. The only place that reads the vision-model env vars (.env.local).
// Read at call time, never at import time, so a missing key can't crash the route.

/** The two Gemma 4 models on the Gemini API. The MoE model is faster and was
 * the reliable one in testing (Oct 2026); the dense 31B model is the fallback. */
export const GEMMA_MODELS = ["gemma-4-26b-a4b-it", "gemma-4-31b-it"] as const;
export const DEFAULT_GEMMA_MODEL = GEMMA_MODELS[0];

export type VisionConfig =
  | {
      provider: "gemini";
      apiKey: string;
      model: string;
      /** Tried once when `model` is overloaded (429/500/503). Null = no fallback. */
      fallbackModel: string | null;
      /** Gemma 4 thinking: off by default for speed (VISION_THINKING=on enables it). */
      thinking: boolean;
    }
  | {
      provider: "openai-compatible";
      url: string;
      apiKey: string | undefined;
      model: string;
    };

/**
 * Gemini API key (GEMINI_API_KEY, or GEMMA_API_KEY as an alias) wins; otherwise any
 * OpenAI-compatible endpoint; otherwise null.
 */
export function readVisionConfig(): VisionConfig | null {
  const model = process.env.VISION_MODEL?.trim();

  const geminiKey =
    process.env.GEMINI_API_KEY?.trim() || process.env.GEMMA_API_KEY?.trim();
  if (geminiKey) {
    const primary = model || DEFAULT_GEMMA_MODEL;
    return {
      provider: "gemini",
      apiKey: geminiKey,
      model: primary,
      fallbackModel: readFallback(primary),
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

/** VISION_FALLBACK_MODEL, "off" to disable; by default the other Gemma 4 model. */
function readFallback(primary: string): string | null {
  const configured = process.env.VISION_FALLBACK_MODEL?.trim();
  if (configured === "off") return null;
  const primaryIsGemma = (GEMMA_MODELS as readonly string[]).includes(primary);
  const fallback =
    configured || (primaryIsGemma ? GEMMA_MODELS.find((m) => m !== primary) : undefined);
  return fallback && fallback !== primary ? fallback : null;
}
