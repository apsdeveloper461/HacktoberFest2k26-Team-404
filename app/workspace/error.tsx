"use client";

// Crash boundary for /workspace. Parse failures are handled inline; this only
// catches render errors (e.g. a corrupted saved project).
import Link from "next/link";
import { Button, buttonClasses } from "@/components/app/Button";
import { saveProject } from "@/lib/project/storage";

export default function WorkspaceError({
  error,
  retry,
}: {
  error: unknown;
  retry: () => void;
}) {
  const digest =
    error instanceof Error && "digest" in error && typeof error.digest === "string"
      ? error.digest
      : null;

  return (
    <main className="flex flex-1 items-center justify-center px-4 py-16">
      <div className="w-full max-w-[420px]">
        <p className="font-tech text-[11px] uppercase tracking-[0.14em] text-[#ff8a7a]">
          Workspace error
        </p>
        <h1 className="mt-2 text-xl font-semibold tracking-tight text-chalk">
          Something broke in the workspace
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          Try again first. If it keeps happening, starting over clears the project
          saved in this browser.
        </p>
        {digest && (
          <p className="mt-3 font-tech text-[11px] text-muted">Reference: {digest}</p>
        )}
        <div className="mt-6 flex flex-wrap gap-2">
          <Button variant="primary" size="md" onClick={() => retry()}>
            Try again
          </Button>
          <Button
            size="md"
            onClick={() => {
              saveProject(null);
              retry();
            }}
          >
            Start over
          </Button>
          <Link href="/" className={buttonClasses("ghost", "md")}>
            Back to home
          </Link>
        </div>
      </div>
    </main>
  );
}
