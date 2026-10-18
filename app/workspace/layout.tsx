import "./workspace.css";

// The app frame: full height, dark chrome, independent of the landing page styles.
export default function WorkspaceLayout({ children }: LayoutProps<"/workspace">) {
  return (
    // Desktop: exactly one screen tall, panels scroll inside (flex-none so the
    // body's flex column can't stretch it). Mobile: the page scrolls normally.
    <div className="ws-root flex min-h-dvh flex-1 flex-col bg-ink font-sans text-chalk antialiased lg:h-dvh lg:flex-none lg:overflow-hidden">
      {children}
    </div>
  );
}
