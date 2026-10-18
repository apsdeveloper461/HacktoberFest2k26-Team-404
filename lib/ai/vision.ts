import "server-only";
import { ApiError, GoogleGenAI, ThinkingLevel, type GenerateContentConfig } from "@google/genai";
import { readVisionConfig, type VisionConfig } from "./config";

// Owner: Lead. Sends one image + prompt to the vision model and returns its raw text.
// Gemma 4 runs through the Gemini API (@google/genai) when GEMINI_API_KEY is set;
// any OpenAI-compatible endpoint (Ollama, vLLM, OpenRouter…) works via VISION_API_URL.
// The signature stays (image, prompt) → string; nothing else in the app depends on the provider.

export type VisionErrorKind =
  | "config"
  | "auth"
  | "rate_limit"
  | "timeout"
  | "bad_request"
  | "empty"
  | "upstream";

/** Internal error. Its message is for server logs; parse-sketch.ts picks what users see. */
export class VisionError extends Error {
  constructor(
    readonly kind: VisionErrorKind,
    message: string,
    readonly status?: number,
  ) {
    super(message);
    this.name = "VisionError";
  }
}

export type VisionOptions = {
  /** System instruction (Gemini) / system message (OpenAI-compatible). */
  system?: string;
  /** Ask for JSON matching this schema. Dropped automatically if the model rejects it. */
  jsonSchema?: unknown;
};

const TIMEOUT_MS = 60_000;

export async function callVisionModel(
  image: File,
  prompt: string,
  options: VisionOptions = {},
): Promise<string> {
  const config = readVisionConfig();
  if (!config) {
    throw new VisionError(
      "config",
      "Vision model is not configured. Set GEMINI_API_KEY in .env.local (see .env.example).",
    );
  }

  const base64 = Buffer.from(await image.arrayBuffer()).toString("base64");
  return config.provider === "gemini"
    ? callGemini(config, image.type, base64, prompt, options)
    : callOpenAICompatible(config, image.type, base64, prompt, options);
}

/* ------------------------------ Gemini API ------------------------------ */

async function callGemini(
  config: Extract<VisionConfig, { provider: "gemini" }>,
  mimeType: string,
  data: string,
  prompt: string,
  options: VisionOptions,
): Promise<string> {
  const ai = new GoogleGenAI({ apiKey: config.apiKey });
  const contents = [
    { role: "user", parts: [{ inlineData: { mimeType, data } }, { text: prompt }] },
  ];
  const base = (): GenerateContentConfig => ({
    systemInstruction: options.system,
    temperature: 0.2,
    abortSignal: AbortSignal.timeout(TIMEOUT_MS),
  });
  const structured = (): GenerateContentConfig => ({
    ...base(),
    responseMimeType: "application/json",
    ...(options.jsonSchema !== undefined && { responseJsonSchema: options.jsonSchema }),
    thinkingConfig: {
      thinkingLevel: config.thinking ? ThinkingLevel.HIGH : ThinkingLevel.MINIMAL,
    },
  });

  try {
    const response = await ai.models.generateContent({
      model: config.model,
      contents,
      config: structured(),
    });
    return requireText(response.text);
  } catch (error) {
    // Structured output and thinking control aren't documented for every Gemma
    // model. If the request shape is rejected, retry once as a plain prompt —
    // the prompt still asks for JSON and zod still validates the result.
    if (error instanceof ApiError && error.status === 400 && !isKeyProblem(error)) {
      console.warn("[vision] structured request rejected; retrying as plain prompt", {
        model: config.model,
        detail: error.message.slice(0, 200),
      });
      try {
        const response = await ai.models.generateContent({
          model: config.model,
          contents,
          config: base(),
        });
        return requireText(response.text);
      } catch (retryError) {
        throw toVisionError(retryError);
      }
    }
    throw toVisionError(error);
  }
}

/* ------------------------- OpenAI-compatible API ------------------------- */

async function callOpenAICompatible(
  config: Extract<VisionConfig, { provider: "openai-compatible" }>,
  mimeType: string,
  data: string,
  prompt: string,
  options: VisionOptions,
): Promise<string> {
  const send = (jsonMode: boolean) =>
    fetch(config.url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(config.apiKey && { Authorization: `Bearer ${config.apiKey}` }),
      },
      body: JSON.stringify({
        model: config.model,
        temperature: 0.2,
        ...(jsonMode && { response_format: { type: "json_object" } }),
        messages: [
          ...(options.system ? [{ role: "system", content: options.system }] : []),
          {
            role: "user",
            content: [
              { type: "text", text: prompt },
              { type: "image_url", image_url: { url: `data:${mimeType};base64,${data}` } },
            ],
          },
        ],
      }),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });

  let res: Response;
  try {
    res = await send(true);
    // Not every server supports response_format; fall back to a plain request.
    if (res.status === 400) res = await send(false);
  } catch (error) {
    throw toVisionError(error);
  }

  if (!res.ok) throw statusError(res.status, `Vision model request failed (${res.status}).`);
  const body = await res.json().catch(() => null);
  return requireText(body?.choices?.[0]?.message?.content);
}

/* -------------------------------- helpers -------------------------------- */

function requireText(text: unknown): string {
  if (typeof text !== "string" || !text.trim()) {
    throw new VisionError("empty", "Vision model returned an empty response.");
  }
  return text;
}

function statusError(status: number, message: string) {
  if (status === 401 || status === 403) return new VisionError("auth", message, status);
  if (status === 429) return new VisionError("rate_limit", message, status);
  if (status === 408 || status === 504) return new VisionError("timeout", message, status);
  if (status === 400 || status === 404 || status === 413) {
    return new VisionError("bad_request", message, status);
  }
  return new VisionError("upstream", message, status);
}

function isKeyProblem(error: ApiError) {
  return /api[ _-]?key/i.test(error.message);
}

function toVisionError(error: unknown): VisionError {
  if (error instanceof VisionError) return error;
  if (error instanceof ApiError) {
    const message = `Gemini API error ${error.status}: ${error.message.slice(0, 300)}`;
    // The Gemini API answers an invalid key with 400, not 401.
    if (isKeyProblem(error)) return new VisionError("auth", message, error.status);
    return statusError(error.status, message);
  }
  if (error instanceof Error && (error.name === "TimeoutError" || error.name === "AbortError")) {
    return new VisionError("timeout", "Vision model request timed out.");
  }
  return new VisionError(
    "upstream",
    error instanceof Error ? error.message.slice(0, 300) : "Vision model request failed.",
  );
}
