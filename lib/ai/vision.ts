import "server-only";

// Owner: Lead. Calls an OpenAI-compatible chat completions endpoint
// (works with Ollama, vLLM, OpenRouter, Google AI Studio's compat API).
// Swap the body of this function if the team's Gemma endpoint differs —
// nothing else in the app needs to change.

export async function callVisionModel(
  image: File,
  prompt: string,
): Promise<string> {
  const url = process.env.VISION_API_URL;
  const model = process.env.VISION_MODEL;
  if (!url || !model) {
    throw new Error("Vision model is not configured (see .env.example).");
  }

  const base64 = Buffer.from(await image.arrayBuffer()).toString("base64");

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(process.env.VISION_API_KEY && {
        Authorization: `Bearer ${process.env.VISION_API_KEY}`,
      }),
    },
    body: JSON.stringify({
      model,
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: prompt },
            {
              type: "image_url",
              image_url: { url: `data:${image.type};base64,${base64}` },
            },
          ],
        },
      ],
    }),
    signal: AbortSignal.timeout(60_000),
  });

  if (!res.ok) {
    throw new Error(`Vision model request failed (${res.status}).`);
  }

  const data = await res.json();
  const content = data?.choices?.[0]?.message?.content;
  if (typeof content !== "string" || !content.trim()) {
    throw new Error("Vision model returned an empty response.");
  }
  return content;
}
