// Browser-only persistence so a refresh restores the current project.
import { wireframeProjectSchema, type WireframeProject } from "./schema";

const STORAGE_KEY = "chalkscript:project";

export function loadProject(): WireframeProject | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const result = wireframeProjectSchema.safeParse(JSON.parse(raw));
    return result.success ? result.data : null;
  } catch {
    return null;
  }
}

export function saveProject(project: WireframeProject | null): void {
  try {
    if (project) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(project));
    } else {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  } catch {
    // Storage full or blocked — the in-memory project still works.
  }
}
