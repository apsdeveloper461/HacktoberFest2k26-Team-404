"use client";

// Owner: Dev 2. Downloads the preview canvas as a PNG (2× for sharp text).
import { useState, type RefObject } from "react";
import { Button } from "@/components/app/Button";
import { DownloadIcon } from "@/components/app/icons";
import { useToast } from "@/components/app/Toast";

type ExportButtonProps = {
  targetRef: RefObject<HTMLDivElement | null>;
  fileName?: string;
};

/** Renders the node to a PNG data URL. Exposed for checks and future exports. */
export async function renderPng(node: HTMLElement) {
  // Loaded on demand: most visits never export.
  const { toPng } = await import("html-to-image");
  return toPng(node, { pixelRatio: 2, cacheBust: true, backgroundColor: "#ffffff" });
}

export function ExportButton({
  targetRef,
  fileName = "chalkscript-preview.png",
}: ExportButtonProps) {
  const toast = useToast();
  const [busy, setBusy] = useState(false);

  async function handleExport() {
    const node = targetRef.current;
    if (!node || busy) return;
    setBusy(true);
    try {
      const url = await renderPng(node);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      link.click();
      toast({ message: `Exported ${fileName}` });
    } catch {
      toast({ message: "Export failed. Try again.", tone: "error" });
    } finally {
      setBusy(false);
    }
  }

  return (
    <Button variant="primary" onClick={handleExport} disabled={busy} aria-busy={busy}>
      <DownloadIcon />
      <span className="max-sm:sr-only">{busy ? "Exporting…" : "Export PNG"}</span>
    </Button>
  );
}
