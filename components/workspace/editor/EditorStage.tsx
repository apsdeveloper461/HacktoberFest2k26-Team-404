"use client";

// Owner: Dev 2. Stage 4: layers · canvas · inspector/JSON/original, plus shortcuts.
import { useEffect, useState, type Ref } from "react";
import type { ElementPatch, WireframeProject } from "@/lib/project/schema";
import { TabPanel, Tabs } from "@/components/app/Tabs";
import { cx } from "@/components/app/cx";
import { ElementInspector } from "../ElementInspector";
import { StructurePanel } from "../StructurePanel";
import type { ProjectSource, Sketch } from "../useWorkspace";
import { CanvasViewport } from "./CanvasViewport";
import { LayersPanel, LayersStrip } from "./LayersPanel";
import { OriginalPanel } from "./OriginalPanel";
import { StatusBar } from "./StatusBar";

type PanelTab = "inspect" | "json" | "original";

const TABS: { id: PanelTab; label: string }[] = [
  { id: "inspect", label: "Inspect" },
  { id: "json", label: "JSON" },
  { id: "original", label: "Original" },
];

export function EditorStage({
  project,
  selectedId,
  sketch,
  source,
  canvasRef,
  onSelect,
  onPatch,
  onDelete,
  onUndo,
  onRedo,
}: {
  project: WireframeProject;
  selectedId: string | null;
  sketch: Sketch | null;
  source: ProjectSource | null;
  canvasRef: Ref<HTMLDivElement>;
  onSelect: (id: string | null) => void;
  onPatch: (id: string, patch: ElementPatch, field: string) => void;
  onDelete: (id: string) => void;
  onUndo: () => void;
  onRedo: () => void;
}) {
  const [tab, setTab] = useState<PanelTab>("inspect");
  const selected = project.elements.find((el) => el.id === selectedId) ?? null;

  // Shortcuts, ignored while typing or while a dialog is open.
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.defaultPrevented) return;
      const target = event.target;
      if (
        target instanceof Element &&
        target.closest("input, textarea, select, [contenteditable='true']")
      ) {
        return;
      }
      if (document.querySelector("dialog[open]")) return;

      const mod = event.metaKey || event.ctrlKey;
      const key = event.key.toLowerCase();
      if (mod && key === "z") {
        event.preventDefault();
        if (event.shiftKey) onRedo();
        else onUndo();
      } else if (mod && key === "y") {
        event.preventDefault();
        onRedo();
      } else if (event.key === "Escape") {
        onSelect(null);
      } else if ((event.key === "Delete" || event.key === "Backspace") && selectedId) {
        event.preventDefault();
        onDelete(selectedId);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [selectedId, onSelect, onDelete, onUndo, onRedo]);

  const layers = {
    elements: project.elements,
    selectedId,
    onSelect: (id: string) => onSelect(id),
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <h1 className="sr-only">Edit your page</h1>
      <div className="lg:hidden">
        <LayersStrip {...layers} />
      </div>

      {/* minmax(0,1fr) row: long panels scroll inside instead of stretching the grid. */}
      <div className="grid min-h-0 flex-1 lg:grid-cols-[232px_minmax(0,1fr)_320px] lg:grid-rows-[minmax(0,1fr)]">
        <aside className="hidden min-h-0 flex-col border-r border-line bg-ink lg:flex">
          <LayersPanel {...layers} />
        </aside>

        <CanvasViewport
          project={project}
          selected={selected}
          onSelect={onSelect}
          canvasRef={canvasRef}
          className="h-[56dvh] lg:h-auto"
        />

        <aside
          aria-label="Element details"
          className="flex min-h-0 flex-col border-t border-line bg-ink lg:border-l lg:border-t-0"
        >
          <Tabs
            idPrefix="panel"
            label="Panels"
            items={TABS}
            value={tab}
            onChange={setTab}
            className="shrink-0 border-b border-line"
          />
          {TABS.map(({ id }) => (
            <TabPanel
              key={id}
              idPrefix="panel"
              id={id}
              active={tab === id}
              className={cx(
                "min-h-0 flex-1",
                id === "json" ? "max-lg:h-[60dvh]" : "overflow-y-auto",
              )}
            >
              {id === "inspect" && (
                <ElementInspector
                  project={project}
                  element={selected}
                  onChange={(patch, field) => selected && onPatch(selected.id, patch, field)}
                  onDelete={() => selected && onDelete(selected.id)}
                />
              )}
              {id === "json" && <StructurePanel project={project} selectedId={selectedId} />}
              {id === "original" && <OriginalPanel sketch={sketch} source={source} />}
            </TabPanel>
          ))}
        </aside>
      </div>

      <StatusBar project={project} selected={selected} />
    </div>
  );
}
