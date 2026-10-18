"use client";

// Owner: Dev 2. Holds the project state; every child is a pure view of it.
// Stages: pick → review → parsing → editor (see useWorkspace.ts).
import {
  ViewTransition,
  startTransition,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { Badge } from "@/components/app/Badge";
import { Button, IconButton } from "@/components/app/Button";
import { Dialog } from "@/components/app/Dialog";
import { PlusIcon, RedoIcon, UndoIcon } from "@/components/app/icons";
import { ToastProvider, useToast } from "@/components/app/Toast";
import { requestParse } from "@/lib/api/parse";
import { sampleProject } from "@/lib/project/sample";
import type { ElementPatch } from "@/lib/project/schema";
import { saveProject } from "@/lib/project/storage";
import { prepareImageForUpload, validateImageFile } from "@/lib/upload";
import { removeElement, updateElement } from "@/lib/project/update";
import { ExportButton } from "./ExportButton";
import { WorkspaceBar } from "./WorkspaceBar";
import { EditorStage } from "./editor/EditorStage";
import { elementTitle } from "./elementMeta";
import { PickStage } from "./stages/PickStage";
import { ReviewStage } from "./stages/ReviewStage";
import {
  useWorkspace,
  type ProjectSource,
  type WorkspaceAction,
} from "./useWorkspace";

const subscribeNoop = () => () => {};

export function Workspace() {
  // localStorage only exists in the browser, so mount the editor after hydration.
  const hydrated = useSyncExternalStore(
    subscribeNoop,
    () => true,
    () => false,
  );
  return (
    <ToastProvider>
      {hydrated ? <WorkspaceApp /> : <WorkspaceSkeleton />}
    </ToastProvider>
  );
}

/** Server/prerender shell: the app frame without state, so nothing jumps on load. */
function WorkspaceSkeleton() {
  return (
    <>
      <WorkspaceBar title="Workspace" />
      <div className="ws-dots flex-1 bg-ink-deep" aria-busy="true" />
    </>
  );
}

const SOURCE_BADGE: Record<ProjectSource, { label: string; tone: "signal" | "neutral" }> = {
  ai: { label: "AI parse", tone: "signal" },
  sample: { label: "Sample · prepared", tone: "neutral" },
  restored: { label: "Restored", tone: "neutral" },
};

function WorkspaceApp() {
  const [state, dispatch] = useWorkspace();
  const toast = useToast();
  const canvasRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const [confirmNew, setConfirmNew] = useState(false);

  const { stage, sketch, project, source } = state;

  // Autosave: the project JSON is the only thing persisted.
  useEffect(() => saveProject(project), [project]);

  /** Stage changes run in a transition so <ViewTransition> can animate them. */
  function go(action: WorkspaceAction) {
    startTransition(() => dispatch(action));
  }

  function pickFile(file: File) {
    if (sketch) URL.revokeObjectURL(sketch.url);
    go({ type: "pickSketch", sketch: { file, url: URL.createObjectURL(file) } });
  }

  function removeSketch() {
    if (sketch) URL.revokeObjectURL(sketch.url);
    go({ type: "removeSketch" });
  }

  function openSample() {
    abortRef.current?.abort();
    abortRef.current = null;
    go({ type: "loadProject", project: sampleProject, source: "sample" });
  }

  async function generate() {
    if (!sketch || stage === "parsing") return;
    const controller = new AbortController();
    abortRef.current = controller;
    dispatch({ type: "parseStart" });

    // Big phone photos are shrunk first; the Original tab keeps the full file.
    const upload = await prepareImageForUpload(sketch.file);
    if (abortRef.current !== controller) return;
    const tooBig = validateImageFile(upload);
    if (tooBig) {
      abortRef.current = null;
      dispatch({ type: "parseFail", error: tooBig });
      return;
    }

    const result = await requestParse(upload, controller.signal);
    // A newer request, a cancel, or "use sample" already took over.
    if (abortRef.current !== controller) return;
    abortRef.current = null;

    if (result.ok) {
      go({ type: "loadProject", project: result.project, source: "ai" });
      const count = result.project.elements.length;
      toast({ message: `Read ${count} ${count === 1 ? "element" : "elements"} from your sketch.` });
      const note = result.notes?.[0];
      if (note) toast({ message: note });
    } else if (!("cancelled" in result)) {
      dispatch({ type: "parseFail", error: result.error });
    }
  }

  function cancelParse() {
    abortRef.current?.abort();
    abortRef.current = null;
    dispatch({ type: "parseCancel" });
  }

  function select(id: string | null) {
    dispatch({ type: "select", id });
  }

  function patch(id: string, change: ElementPatch, field: string) {
    if (!project) return;
    dispatch({
      type: "edit",
      project: updateElement(project, id, change),
      key: `${id}:${field}`,
      at: Date.now(),
    });
  }

  function deleteElement(id: string) {
    if (!project) return;
    const element = project.elements.find((el) => el.id === id);
    if (!element) return;
    dispatch({
      type: "edit",
      project: removeElement(project, id),
      selectedId: null,
      at: Date.now(),
    });
    toast({
      message: `Deleted “${elementTitle(element)}”`,
      action: { label: "Undo", onClick: () => dispatch({ type: "undo" }) },
    });
  }

  function requestNewSketch() {
    // Only an untouched sample is safe to drop without asking.
    if (source === "sample" && !state.dirty) startNewSketch();
    else setConfirmNew(true);
  }

  function startNewSketch() {
    setConfirmNew(false);
    if (sketch) URL.revokeObjectURL(sketch.url);
    go({ type: "newSketch" });
  }

  const title =
    stage === "editor"
      ? "Untitled sketch"
      : stage === "pick"
        ? "New sketch"
        : (sketch?.file.name ?? "New sketch");
  const badge = stage === "editor" && source ? SOURCE_BADGE[source] : null;

  // Review and parsing share one view, so starting a parse doesn't animate.
  const viewKey = stage === "parsing" ? "review" : stage;

  return (
    <>
      <WorkspaceBar
        title={title}
        badge={badge && <Badge tone={badge.tone}>{badge.label}</Badge>}
      >
        {stage === "editor" && (
          <>
            <span className="hidden items-center sm:flex">
              <IconButton
                label="Undo (Ctrl+Z)"
                onClick={() => dispatch({ type: "undo" })}
                disabled={state.past.length === 0}
              >
                <UndoIcon />
              </IconButton>
              <IconButton
                label="Redo (Ctrl+Shift+Z)"
                onClick={() => dispatch({ type: "redo" })}
                disabled={state.future.length === 0}
              >
                <RedoIcon />
              </IconButton>
            </span>
            <Button variant="ghost" onClick={requestNewSketch}>
              <PlusIcon />
              <span className="max-sm:sr-only">New sketch</span>
            </Button>
            <ExportButton targetRef={canvasRef} />
          </>
        )}
      </WorkspaceBar>

      <ViewTransition key={viewKey} enter="ws-stage-in" exit="ws-stage-out" default="none">
        <div className="flex min-h-0 flex-1 flex-col">
          {stage === "editor" && project ? (
            <EditorStage
              project={project}
              selectedId={state.selectedId}
              sketch={sketch}
              source={source}
              canvasRef={canvasRef}
              onSelect={select}
              onPatch={patch}
              onDelete={deleteElement}
              onUndo={() => dispatch({ type: "undo" })}
              onRedo={() => dispatch({ type: "redo" })}
            />
          ) : (stage === "review" || stage === "parsing") && sketch ? (
            <ReviewStage
              sketch={sketch}
              parsing={stage === "parsing"}
              error={state.error}
              onGenerate={generate}
              onCancel={cancelParse}
              onReplace={pickFile}
              onFileError={(error) => dispatch({ type: "fileError", error })}
              onRemove={removeSketch}
              onUseSample={openSample}
            />
          ) : (
            <PickStage
              error={state.error}
              onFile={pickFile}
              onError={(error) => dispatch({ type: "fileError", error })}
              onUseSample={openSample}
            />
          )}
        </div>
      </ViewTransition>

      <Dialog
        open={confirmNew}
        onClose={() => setConfirmNew(false)}
        title="Start a new sketch?"
        description="This clears the current project from this browser. Export a PNG first if you want to keep a copy."
      >
        <Button onClick={() => setConfirmNew(false)}>Keep editing</Button>
        <Button variant="danger" onClick={startNewSketch}>
          Discard and start new
        </Button>
      </Dialog>
    </>
  );
}
