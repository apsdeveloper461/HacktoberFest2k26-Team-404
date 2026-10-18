"use client";

// Modal built on the native <dialog>: focus trap, Esc and top-layer for free.
// Entrance styles live in app/workspace/workspace.css (.app-dialog).
import { useEffect, useId, useRef, type ReactNode } from "react";

export function Dialog({
  open,
  onClose,
  title,
  description,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: ReactNode;
  /** Footer actions. */
  children: ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      aria-describedby={description ? descriptionId : undefined}
      onClose={onClose}
      onClick={(event) => {
        // A click on the backdrop lands on the <dialog> element itself.
        if (event.target === event.currentTarget) onClose();
      }}
      className="app-dialog m-auto w-[min(92vw,420px)] rounded-[6px] border border-line bg-ink-raised p-0 text-chalk shadow-[0_24px_64px_-16px_rgba(0,0,0,0.6)]"
    >
      <div className="p-5">
        <h2 id={titleId} className="text-[15px] font-semibold tracking-tight">
          {title}
        </h2>
        {description && (
          <div id={descriptionId} className="mt-1.5 text-[13px] leading-relaxed text-muted">
            {description}
          </div>
        )}
      </div>
      <div className="flex justify-end gap-2 border-t border-line px-5 py-3">
        {children}
      </div>
    </dialog>
  );
}
