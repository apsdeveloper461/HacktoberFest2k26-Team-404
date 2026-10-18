"use client";

// Owner: Dev 2. The workspace state machine: pick → review → parsing → editor.
// The project JSON stays the source of truth; history holds past projects for undo.
import { useReducer } from "react";
import type { WireframeProject } from "@/lib/project/schema";
import { loadProject } from "@/lib/project/storage";

export type Stage = "pick" | "review" | "parsing" | "editor";

/** Where the current project came from; shown as a badge so the demo stays honest. */
export type ProjectSource = "ai" | "sample" | "restored";

export type Sketch = {
  file: File;
  /** Object URL for previews. Revoked by the caller when the sketch is replaced. */
  url: string;
};

type Snapshot = { project: WireframeProject; selectedId: string | null };

export type WorkspaceState = {
  stage: Stage;
  sketch: Sketch | null;
  error: string | null;
  project: WireframeProject | null;
  source: ProjectSource | null;
  selectedId: string | null;
  past: Snapshot[];
  future: Snapshot[];
  /** Edited since it was loaded or parsed. */
  dirty: boolean;
  /** Groups rapid edits to one field (typing) into a single undo step. */
  lastEdit: { key: string; at: number } | null;
};

export type WorkspaceAction =
  | { type: "pickSketch"; sketch: Sketch }
  | { type: "removeSketch" }
  | { type: "fileError"; error: string }
  | { type: "parseStart" }
  | { type: "parseFail"; error: string }
  | { type: "parseCancel" }
  | { type: "loadProject"; project: WireframeProject; source: ProjectSource }
  | { type: "select"; id: string | null }
  | {
      type: "edit";
      project: WireframeProject;
      selectedId?: string | null;
      /** Same key within the coalescing window → merged into the previous undo step. */
      key?: string;
      at: number;
    }
  | { type: "undo" }
  | { type: "redo" }
  | { type: "newSketch" };

const HISTORY_LIMIT = 50;
const COALESCE_MS = 1200;

function emptyState(): WorkspaceState {
  return {
    stage: "pick",
    sketch: null,
    error: null,
    project: null,
    source: null,
    selectedId: null,
    past: [],
    future: [],
    dirty: false,
    lastEdit: null,
  };
}

function initialState(): WorkspaceState {
  const restored = loadProject();
  if (!restored) return emptyState();
  return { ...emptyState(), stage: "editor", project: restored, source: "restored" };
}

function reducer(state: WorkspaceState, action: WorkspaceAction): WorkspaceState {
  switch (action.type) {
    case "pickSketch":
      return { ...state, stage: "review", sketch: action.sketch, error: null };

    case "removeSketch":
      return { ...state, stage: "pick", sketch: null, error: null };

    case "fileError":
      return { ...state, error: action.error };

    case "parseStart":
      if (!state.sketch) return state;
      return { ...state, stage: "parsing", error: null };

    case "parseFail":
      return { ...state, stage: "review", error: action.error };

    case "parseCancel":
      return state.stage === "parsing" ? { ...state, stage: "review" } : state;

    case "loadProject":
      return {
        ...state,
        stage: "editor",
        error: null,
        project: action.project,
        source: action.source,
        selectedId: null,
        past: [],
        future: [],
        dirty: false,
        lastEdit: null,
      };

    case "select":
      return state.selectedId === action.id ? state : { ...state, selectedId: action.id };

    case "edit": {
      if (!state.project) return state;
      const coalesce =
        action.key !== undefined &&
        state.lastEdit?.key === action.key &&
        action.at - state.lastEdit.at < COALESCE_MS;
      const past = coalesce
        ? state.past
        : [...state.past, { project: state.project, selectedId: state.selectedId }].slice(
            -HISTORY_LIMIT,
          );
      return {
        ...state,
        project: action.project,
        selectedId:
          action.selectedId === undefined ? state.selectedId : action.selectedId,
        past,
        future: [],
        dirty: true,
        lastEdit: action.key ? { key: action.key, at: action.at } : null,
      };
    }

    case "undo": {
      const previous = state.past.at(-1);
      if (!previous || !state.project) return state;
      return {
        ...state,
        project: previous.project,
        selectedId: keepSelection(previous),
        past: state.past.slice(0, -1),
        future: [{ project: state.project, selectedId: state.selectedId }, ...state.future],
        dirty: true,
        lastEdit: null,
      };
    }

    case "redo": {
      const next = state.future[0];
      if (!next || !state.project) return state;
      return {
        ...state,
        project: next.project,
        selectedId: keepSelection(next),
        past: [...state.past, { project: state.project, selectedId: state.selectedId }],
        future: state.future.slice(1),
        dirty: true,
        lastEdit: null,
      };
    }

    case "newSketch":
      return emptyState();
  }
}

function keepSelection(snapshot: Snapshot) {
  const { selectedId, project } = snapshot;
  return selectedId && project.elements.some((el) => el.id === selectedId)
    ? selectedId
    : null;
}

/** Must run client-side only: the initial state reads localStorage. */
export function useWorkspace() {
  return useReducer(reducer, undefined, initialState);
}
