import type { Metadata } from "next";
import { Workspace } from "@/components/workspace/Workspace";

export const metadata: Metadata = {
  title: "Workspace · ChalkScript AI",
};

// The landing page's "Start with a sketch" button links here.
export default function WorkspacePage() {
  return (
    <main className="flex flex-1 flex-col p-6">
      <Workspace />
    </main>
  );
}
