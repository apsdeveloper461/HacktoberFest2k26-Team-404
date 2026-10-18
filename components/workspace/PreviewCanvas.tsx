// Owner: Dev 2. Renders the project JSON — never the uploaded photo.
// The canvas keeps its own colour context (white page, near-black text) so the
// app's dark theme never leaks into the user's page or the PNG export.
import type { Ref } from "react";
import type { WireframeProject } from "@/lib/project/schema";
import { ElementRenderer } from "./ElementRenderer";

type PreviewCanvasProps = {
  project: WireframeProject;
  onSelect: (id: string | null) => void;
  /** Attached to the unscaled canvas node so ExportButton captures it at full size. */
  ref?: Ref<HTMLDivElement>;
};

export function PreviewCanvas({ project, onSelect, ref }: PreviewCanvasProps) {
  return (
    <div
      ref={ref}
      onClick={(event) => {
        event.stopPropagation();
        onSelect(null);
      }}
      className="relative overflow-hidden bg-white font-sans text-base leading-normal text-[#171717] antialiased"
      style={{ width: project.canvas.width, height: project.canvas.height }}
    >
      {project.elements.map((element) => (
        <ElementRenderer
          key={element.id}
          element={element}
          onSelect={() => onSelect(element.id)}
        />
      ))}
    </div>
  );
}
