// Owner: Dev 2. Shows the JSON that drives the preview.
// TODO (stretch): a "JSX preview" tab generated from the elements.
import type { WireframeProject } from "@/lib/project/schema";

export function StructurePanel({ project }: { project: WireframeProject }) {
  return (
    <section className="rounded-lg border p-4">
      <h2 className="mb-2 text-sm font-semibold">Structure</h2>
      <pre className="max-h-96 overflow-auto rounded bg-zinc-950 p-3 font-mono text-xs text-zinc-100">
        {JSON.stringify(project, null, 2)}
      </pre>
    </section>
  );
}
