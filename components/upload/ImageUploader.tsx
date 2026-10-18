"use client";

// Owner: Dev 2. Pick an image → preview it → "Generate preview" → /api/parse.
// TODO: a "Take photo" button (second <input capture="environment">).
import { useState, type ChangeEvent } from "react";
import { requestParse } from "@/lib/api/parse";
import type { WireframeProject } from "@/lib/project/schema";
import { ACCEPTED_IMAGE_TYPES, validateImageFile } from "@/lib/upload";

type ImageUploaderProps = {
  onParsed: (project: WireframeProject) => void;
  /** Demo fallback: loads the prepared sample instead of calling the AI. */
  onUseSample: () => void;
};

export function ImageUploader({ onParsed, onUseSample }: ImageUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  function handleFile(event: ChangeEvent<HTMLInputElement>) {
    const next = event.target.files?.[0];
    if (!next) return;

    const invalid = validateImageFile(next);
    if (invalid) {
      setError(invalid);
      return;
    }
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setFile(next);
    setPreviewUrl(URL.createObjectURL(next));
    setError(null);
  }

  async function generate() {
    if (!file || pending) return;
    setPending(true);
    setError(null);
    const result = await requestParse(file);
    setPending(false);
    if (result.ok) onParsed(result.project);
    else setError(result.error);
  }

  return (
    <section className="mx-auto flex w-full max-w-xl flex-col gap-4">
      <h1 className="text-2xl font-semibold">Add your sketch</h1>

      <input
        type="file"
        accept={ACCEPTED_IMAGE_TYPES.join(",")}
        onChange={handleFile}
        disabled={pending}
      />

      {previewUrl && (
        // eslint-disable-next-line @next/next/no-img-element -- local blob: preview, nothing to optimize
        <img
          src={previewUrl}
          alt="Selected sketch"
          className="max-h-80 w-full rounded-lg border object-contain"
        />
      )}

      {error && (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}

      <div className="flex gap-2">
        <button
          type="button"
          onClick={generate}
          disabled={!file || pending}
          className="rounded-md bg-zinc-900 px-4 py-2 text-white disabled:opacity-50"
        >
          {pending ? "Reading your sketch…" : "Generate preview"}
        </button>
        <button
          type="button"
          onClick={onUseSample}
          disabled={pending}
          className="rounded-md border px-4 py-2"
        >
          Use sample
        </button>
      </div>
    </section>
  );
}
