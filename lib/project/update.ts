// Pure, immutable edits to a project. The preview re-renders from the result.
import type { ElementPatch, WireframeProject } from "./schema";

export function updateElement(
  project: WireframeProject,
  id: string,
  patch: ElementPatch,
): WireframeProject {
  return {
    ...project,
    elements: project.elements.map((element) =>
      element.id === id
        ? {
            ...element,
            ...patch,
            style: { ...element.style, ...patch.style },
          }
        : element,
    ),
  };
}

export function removeElement(
  project: WireframeProject,
  id: string,
): WireframeProject {
  return {
    ...project,
    elements: project.elements.filter((element) => element.id !== id),
  };
}
