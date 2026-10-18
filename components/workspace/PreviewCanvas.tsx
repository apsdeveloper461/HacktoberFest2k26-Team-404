// Owner: Dev 2. Renders the project JSON — never the uploaded photo.
import type { Ref } from "react";
import type { WireframeProject } from "@/lib/project/schema";
import { ElementRenderer } from "./ElementRenderer";

type PreviewCanvasProps = {
  project: WireframeProject;
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  /** Attached to the canvas node so ExportButton can capture it. */
  ref?: Ref<HTMLDivElement>;
};

export function PreviewCanvas({
  project,
  selectedId,
  onSelect,
  ref,
}: PreviewCanvasProps) {
  return (
    <div
      ref={ref}
      onClick={() => onSelect(null)}
      className="relative mx-auto overflow-hidden bg-white shadow"
      style={{ width: project.canvas.width, height: project.canvas.height }}
    >
      {project.elements.map((element) => (
        <ElementRenderer
          key={element.id}
          element={element}
          selected={element.id === selectedId}
          onSelect={() => onSelect(element.id)}
        />
      ))}
    </div>
  );
}
