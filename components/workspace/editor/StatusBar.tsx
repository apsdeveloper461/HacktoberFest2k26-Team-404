// Owner: Dev 2. One quiet line of facts about the page.
import type { WireframeElement, WireframeProject } from "@/lib/project/schema";

export function StatusBar({
  project,
  selected,
}: {
  project: WireframeProject;
  selected: WireframeElement | null;
}) {
  const count = project.elements.length;
  return (
    <footer className="flex h-7 shrink-0 items-center gap-4 border-t border-line bg-ink px-3 font-tech text-[11px] text-muted">
      <span className="tabular-nums">
        {project.canvas.width} × {project.canvas.height}
      </span>
      <span className="tabular-nums">
        {count} {count === 1 ? "element" : "elements"}
      </span>
      {selected && (
        <span className="hidden truncate text-chalk sm:inline">
          {selected.type}#{selected.id}
        </span>
      )}
      <span className="ml-auto flex items-center gap-1.5">
        <span aria-hidden="true" className="size-1.5 rounded-full bg-signal" />
        Saved in this browser
      </span>
    </footer>
  );
}
