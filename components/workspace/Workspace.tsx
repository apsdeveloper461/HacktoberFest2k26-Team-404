"use client";

// Owner: Dev 2. Holds the project state; every child is a pure view of it.
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { ImageUploader } from "@/components/upload/ImageUploader";
import { sampleProject } from "@/lib/project/sample";
import type { WireframeProject } from "@/lib/project/schema";
import { loadProject, saveProject } from "@/lib/project/storage";
import { removeElement, updateElement } from "@/lib/project/update";
import { ElementInspector } from "./ElementInspector";
import { ExportButton } from "./ExportButton";
import { PreviewCanvas } from "./PreviewCanvas";
import { StructurePanel } from "./StructurePanel";

const subscribeNoop = () => () => {};

export function Workspace() {
  // localStorage only exists in the browser, so mount the editor after hydration.
  const hydrated = useSyncExternalStore(
    subscribeNoop,
    () => true,
    () => false,
  );
  if (!hydrated) return <p className="text-zinc-500">Loading workspace…</p>;
  return <WorkspaceEditor />;
}

function WorkspaceEditor() {
  const [project, setProject] = useState<WireframeProject | null>(loadProject);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => saveProject(project), [project]);

  if (!project) {
    return (
      <ImageUploader
        onParsed={setProject}
        onUseSample={() => setProject(sampleProject)}
      />
    );
  }

  const selected = project.elements.find((el) => el.id === selectedId) ?? null;

  function startOver() {
    if (window.confirm("Start a new sketch? Your current edits will be lost.")) {
      setSelectedId(null);
      setProject(null);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-xl font-semibold">Workspace</h1>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={startOver}
            className="rounded-md border px-3 py-2"
          >
            New sketch
          </button>
          <ExportButton targetRef={canvasRef} />
        </div>
      </div>

      <div className="flex flex-col gap-4 lg:flex-row">
        <div className="flex-1 overflow-auto rounded-lg bg-zinc-100 p-4">
          <PreviewCanvas
            ref={canvasRef}
            project={project}
            selectedId={selectedId}
            onSelect={setSelectedId}
          />
        </div>
        <aside className="flex w-full flex-col gap-4 lg:w-80">
          <ElementInspector
            element={selected}
            onChange={(patch) =>
              selected && setProject(updateElement(project, selected.id, patch))
            }
            onDelete={() => {
              if (!selected) return;
              setSelectedId(null);
              setProject(removeElement(project, selected.id));
            }}
          />
          <StructurePanel project={project} />
        </aside>
      </div>
    </div>
  );
}
