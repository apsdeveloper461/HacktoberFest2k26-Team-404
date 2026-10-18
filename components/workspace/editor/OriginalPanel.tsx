// Owner: Dev 2. "View original": the photo the project was parsed from.
import type { ProjectSource, Sketch } from "../useWorkspace";

export function OriginalPanel({
  sketch,
  source,
}: {
  sketch: Sketch | null;
  source: ProjectSource | null;
}) {
  if (sketch && source === "ai") {
    return (
      <figure className="flex flex-col gap-3 p-4">
        {/* eslint-disable-next-line @next/next/no-img-element -- local blob: preview, nothing to optimize */}
        <img
          src={sketch.url}
          alt={`Original sketch: ${sketch.file.name}`}
          className="w-full rounded-[4px] border border-line object-contain"
        />
        <figcaption className="text-[12px] leading-relaxed text-muted">
          <span className="block truncate text-chalk">{sketch.file.name}</span>
          The photo is only the model&apos;s input. Edits change the project JSON, never
          this image.
        </figcaption>
      </figure>
    );
  }

  return (
    <div className="px-4 py-5">
      <p className="text-[13px] font-medium text-chalk">No original photo</p>
      <p className="mt-1 text-[13px] leading-relaxed text-muted">
        {source === "sample"
          ? "This project is the prepared sample, so there's no photo behind it."
          : "Only the editable project is saved in this browser; the original photo isn't kept between visits."}
      </p>
    </div>
  );
}
