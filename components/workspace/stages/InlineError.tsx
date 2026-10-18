import type { ReactNode } from "react";
import { cx } from "@/components/app/cx";
import { AlertIcon } from "@/components/app/icons";

export function InlineError({
  title,
  children,
  actions,
  className,
}: {
  title?: string;
  children: ReactNode;
  actions?: ReactNode;
  className?: string;
}) {
  return (
    <div
      role="alert"
      className={cx(
        "rounded-[6px] border border-[#ff8a7a]/30 bg-[#ff8a7a]/[0.06] p-3 text-[13px]",
        className,
      )}
    >
      <div className="flex gap-2.5">
        <AlertIcon className="mt-px shrink-0 text-[#ff8a7a]" />
        <div className="min-w-0 flex-1">
          {title && <p className="font-medium text-chalk">{title}</p>}
          <p className={cx("leading-relaxed", title ? "mt-0.5 text-muted" : "text-chalk")}>
            {children}
          </p>
          {actions && <div className="mt-3 flex flex-wrap gap-2">{actions}</div>}
        </div>
      </div>
    </div>
  );
}
