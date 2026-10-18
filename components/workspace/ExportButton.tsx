// Owner: Dev 2. Downloads the preview canvas as a PNG.
import type { RefObject } from "react";

type ExportButtonProps = {
  targetRef: RefObject<HTMLDivElement | null>;
};

export function ExportButton({ targetRef }: ExportButtonProps) {
  function handleExport() {
    const node = targetRef.current;
    if (!node) return;
    // TODO: `npm i html-to-image`, then `const url = await toPng(node)`
    // and trigger a download of `url` as "chalkscript-preview.png".
    window.alert("PNG export is not implemented yet.");
  }

  return (
    <button
      type="button"
      onClick={handleExport}
      className="rounded-md bg-zinc-900 px-3 py-2 text-white"
    >
      Export PNG
    </button>
  );
}
