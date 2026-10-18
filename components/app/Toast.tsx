"use client";

// Lightweight toasts: one polite live region, optional single action (e.g. Undo).
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { cx } from "./cx";
import { snap } from "./motion";

type ToastInput = {
  message: string;
  tone?: "neutral" | "error";
  action?: { label: string; onClick: () => void };
};

type ToastItem = ToastInput & { id: number };

const ToastContext = createContext<((toast: ToastInput) => void) | null>(null);

export function useToast() {
  const toast = useContext(ToastContext);
  if (!toast) throw new Error("useToast must be used inside <ToastProvider>.");
  return toast;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const nextId = useRef(0);

  const dismiss = useCallback((id: number) => {
    setItems((current) => current.filter((item) => item.id !== id));
  }, []);

  const toast = useCallback((input: ToastInput) => {
    nextId.current += 1;
    const id = nextId.current;
    // Keep at most three; the newest replaces the oldest.
    setItems((current) => [...current.slice(-2), { ...input, id }]);
  }, []);

  const value = useMemo(() => toast, [toast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 bottom-4 z-[70] flex flex-col items-center gap-2 px-4 sm:bottom-10"
      >
        <AnimatePresence initial={false}>
          {items.map((item) => (
            <Toast key={item.id} item={item} onDismiss={dismiss} />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

function Toast({
  item,
  onDismiss,
}: {
  item: ToastItem;
  onDismiss: (id: number) => void;
}) {
  const reduce = useReducedMotion();

  useEffect(() => {
    const timer = window.setTimeout(
      () => onDismiss(item.id),
      item.action ? 6000 : 3500,
    );
    return () => window.clearTimeout(timer);
  }, [item.id, item.action, onDismiss]);

  return (
    <motion.div
      layout={!reduce}
      initial={{ opacity: 0, y: reduce ? 0 : 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: reduce ? 0 : 4, transition: { duration: 0.12 } }}
      transition={snap}
      role={item.tone === "error" ? "alert" : "status"}
      className={cx(
        "pointer-events-auto flex min-h-10 max-w-[min(92vw,420px)] items-center gap-3 rounded-[6px] border bg-ink-raised py-2 pl-3.5 pr-2 text-[13px] text-chalk shadow-[0_12px_32px_-12px_rgba(0,0,0,0.6)]",
        item.tone === "error" ? "border-[#ff8a7a]/40" : "border-line",
      )}
    >
      <span className="min-w-0 flex-1">{item.message}</span>
      {item.action && (
        <button
          type="button"
          onClick={() => {
            item.action?.onClick();
            onDismiss(item.id);
          }}
          className="h-7 rounded-[4px] px-2 text-[13px] font-medium text-signal hover:bg-signal/10 focus-visible:outline-2 focus-visible:outline-signal"
        >
          {item.action.label}
        </button>
      )}
    </motion.div>
  );
}
