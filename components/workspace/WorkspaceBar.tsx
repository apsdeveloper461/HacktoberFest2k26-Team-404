// Owner: Dev 2. The 48px app bar: brand → home, what you're working on, actions.
import Link from "next/link";
import type { ReactNode } from "react";

export function WorkspaceBar({
  title,
  badge,
  children,
}: {
  title: string;
  badge?: ReactNode;
  /** Right-aligned actions for the current stage. */
  children?: ReactNode;
}) {
  return (
    <header className="flex h-12 shrink-0 items-center gap-3 border-b border-line bg-ink px-3 sm:px-4">
      <Link
        href="/"
        aria-label="ChalkScript AI home"
        className="flex items-center gap-2 rounded-[4px] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-signal"
      >
        <AppMark />
        <span className="font-display text-[15px] font-semibold tracking-tight text-chalk max-sm:hidden">
          ChalkScript
        </span>
      </Link>
      <span aria-hidden="true" className="h-4 w-px bg-line" />
      <div className="flex min-w-0 items-center gap-2">
        <p className="truncate text-[13px] text-chalk">{title}</p>
        {badge}
      </div>
      {children && <div className="ml-auto flex shrink-0 items-center gap-1.5">{children}</div>}
    </header>
  );
}

/** A loose chalk square whose last corner has been snapped crisp. */
function AppMark() {
  return (
    <svg viewBox="0 0 20 20" width={20} height={20} fill="none" aria-hidden="true">
      <path
        d="M3.2 15.6C3 11.4 3.4 7.3 3.1 3.4c3.7-.4 7.6.3 11.6-.1"
        stroke="#f1f0e8"
        strokeWidth={1.6}
        strokeLinecap="round"
      />
      <path d="M16.5 3.5v13h-13" stroke="#d9ff63" strokeWidth={1.6} />
      <rect x="14.75" y="14.75" width="3.5" height="3.5" fill="#d9ff63" />
    </svg>
  );
}
