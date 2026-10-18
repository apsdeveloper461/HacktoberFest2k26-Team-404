import type { Metadata } from "next";
import { ViewTransition } from "react";
import { Workspace } from "@/components/workspace/Workspace";

export const metadata: Metadata = {
  title: "Workspace · ChalkScript AI",
  description:
    "Upload a photo of a hand-drawn website wireframe and edit the generated page.",
};

// The landing page's "Start with a sketch" button links here.
export default function WorkspacePage() {
  return (
    <ViewTransition enter="ws-page-in" default="none">
      <main className="flex min-h-0 flex-1 flex-col">
        <Workspace />
      </main>
    </ViewTransition>
  );
}
