// Owner: Dev 2. Edits the selected element. MVP: text + colors.
// TODO: width/height and font size controls if time allows.
import type { ElementPatch, WireframeElement } from "@/lib/project/schema";

type ElementInspectorProps = {
  element: WireframeElement | null;
  onChange: (patch: ElementPatch) => void;
  onDelete: () => void;
};

export function ElementInspector({
  element,
  onChange,
  onDelete,
}: ElementInspectorProps) {
  if (!element) {
    return (
      <section className="rounded-lg border p-4 text-sm text-zinc-500">
        Select an element in the preview to edit it.
      </section>
    );
  }

  const hasText = element.type !== "image" && element.type !== "container";

  return (
    <section className="flex flex-col gap-3 rounded-lg border p-4 text-sm">
      <h2 className="font-semibold">
        {element.type} <span className="text-zinc-400">#{element.id}</span>
      </h2>

      {hasText && (
        <label className="flex flex-col gap-1">
          Text
          <input
            value={element.text ?? ""}
            onChange={(e) => onChange({ text: e.target.value })}
            className="rounded-md border px-2 py-1"
          />
        </label>
      )}

      <label className="flex items-center justify-between">
        Text color
        <input
          type="color"
          value={element.style.color ?? "#171717"}
          onChange={(e) => onChange({ style: { color: e.target.value } })}
        />
      </label>

      <label className="flex items-center justify-between">
        Background
        <input
          type="color"
          value={element.style.backgroundColor ?? "#ffffff"}
          onChange={(e) =>
            onChange({ style: { backgroundColor: e.target.value } })
          }
        />
      </label>

      <button
        type="button"
        onClick={onDelete}
        className="self-start text-red-600 hover:underline"
      >
        Delete element
      </button>
    </section>
  );
}
