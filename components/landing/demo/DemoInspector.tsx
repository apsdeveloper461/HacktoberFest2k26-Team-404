// A pocket version of the workspace inspector: every change is a patch to
// the project JSON via the shared updateElement() helper.
import type { ElementPatch, WireframeProject } from "@/lib/project/schema";
import { cx } from "../cx";

const swatches = [
  { name: "Signal", bg: "#D9FF63", fg: "#11120F" },
  { name: "Ink", bg: "#11120F", fg: "#F1F0E8" },
  { name: "Chalk", bg: "#F1F0E8", fg: "#11120F" },
] as const;

type DemoInspectorProps = {
  project: WireframeProject;
  enabled: boolean;
  onPatch: (id: string, patch: ElementPatch) => void;
  onFocusElement: (id: string | null) => void;
};

const field =
  "mt-1.5 min-h-10 w-full rounded-[2px] border border-ink/25 bg-chalk px-3 text-[14px] text-ink focus:border-ink focus:outline-none disabled:cursor-not-allowed";

export function DemoInspector({ project, enabled, onPatch, onFocusElement }: DemoInspectorProps) {
  const heading = project.elements.find((e) => e.id === "heading-1");
  const button = project.elements.find((e) => e.id === "button-1");
  const currentBg = button?.style.backgroundColor?.toUpperCase();

  return (
    <fieldset
      disabled={!enabled}
      className={cx("mt-4 border-t border-ink/15 pt-4 transition-opacity duration-300", !enabled && "opacity-55")}
    >
      <legend className="cs-eyebrow float-left w-full pb-3 text-muted-ink">
        Inspector <span aria-hidden="true">·</span>{" "}
        {enabled ? "edits the project JSON" : "available once the sketch is compiled"}
      </legend>
      <div className="clear-both grid gap-3 sm:grid-cols-2">
        <label className="block">
          <span className="cs-mono text-[10px] text-muted-ink">text#heading-1 → text</span>
          <input
            className={field}
            value={heading?.text ?? ""}
            maxLength={40}
            onChange={(e) => onPatch("heading-1", { text: e.target.value })}
            onFocus={() => onFocusElement("heading-1")}
            onBlur={() => onFocusElement(null)}
          />
        </label>
        <label className="block">
          <span className="cs-mono text-[10px] text-muted-ink">button#button-1 → text</span>
          <input
            className={field}
            value={button?.text ?? ""}
            maxLength={18}
            onChange={(e) => onPatch("button-1", { text: e.target.value })}
            onFocus={() => onFocusElement("button-1")}
            onBlur={() => onFocusElement(null)}
          />
        </label>
      </div>
      <div className="mt-3">
        <p id="demo-color-label" className="cs-mono text-[10px] text-muted-ink">
          button#button-1 → style.backgroundColor
        </p>
        <div role="radiogroup" aria-labelledby="demo-color-label" className="mt-1.5 flex flex-wrap gap-2">
          {swatches.map((s) => (
            <label key={s.name} className="relative cursor-pointer">
              <input
                type="radio"
                name="demo-button-color"
                className="peer sr-only"
                checked={currentBg === s.bg}
                onChange={() => onPatch("button-1", { style: { backgroundColor: s.bg, color: s.fg } })}
                onFocus={() => onFocusElement("button-1")}
                onBlur={() => onFocusElement(null)}
              />
              <span className="flex min-h-10 items-center gap-2 rounded-[2px] border border-ink/20 bg-chalk px-3 text-[13px] text-ink peer-checked:border-ink peer-checked:shadow-[inset_0_0_0_1px_var(--color-ink)] peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ink">
                <span aria-hidden="true" className="size-4 shadow-[0_0_0_1px_rgb(17_18_15/0.3)]" style={{ background: s.bg }} />
                {s.name}
              </span>
            </label>
          ))}
        </div>
      </div>
    </fieldset>
  );
}
