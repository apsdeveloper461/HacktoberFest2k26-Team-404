"use client";

// Owner: Dev 2. Edits the selected element. Only fields that make sense for the
// element's type are shown; every change goes through updateElement().
import type { ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";
import type {
  ElementPatch,
  WireframeElement,
  WireframeProject,
} from "@/lib/project/schema";
import { Button } from "@/components/app/Button";
import { Kbd } from "@/components/app/Badge";
import { ColorField } from "@/components/app/ColorField";
import { NumberField, TextField } from "@/components/app/Field";
import { TrashIcon } from "@/components/app/icons";
import { dur, ease } from "@/components/app/motion";
import {
  TEXT_FIELD_LABEL,
  TYPE_LABEL,
  TypeGlyph,
} from "./elementMeta";

type ElementInspectorProps = {
  project: WireframeProject;
  element: WireframeElement | null;
  /** `field` groups rapid edits (typing) into one undo step. */
  onChange: (patch: ElementPatch, field: string) => void;
  onDelete: () => void;
};

export function ElementInspector({
  project,
  element,
  onChange,
  onDelete,
}: ElementInspectorProps) {
  const reduce = useReducedMotion();

  if (!element) return <ProjectSummary project={project} />;

  const textLabel = TEXT_FIELD_LABEL[element.type];
  const hasFont = element.type === "text" || element.type === "button" || element.type === "input";
  const hasTextColor = hasFont;
  const hasBackground =
    element.type === "button" || element.type === "input" || element.type === "container";
  const { width: cw, height: ch } = project.canvas;

  return (
    <motion.div
      key={element.id}
      initial={{ opacity: reduce ? 1 : 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: dur.fast, ease: ease.snap }}
      className="flex flex-col"
    >
      <div className="flex items-center gap-2 border-b border-line px-4 py-3">
        <span className="flex size-7 items-center justify-center rounded-[4px] border border-line text-chalk">
          <TypeGlyph type={element.type} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[13px] font-medium text-chalk">{TYPE_LABEL[element.type]}</p>
          <p className="truncate font-tech text-[11px] text-muted">#{element.id}</p>
        </div>
      </div>

      <div className="flex flex-col gap-5 px-4 py-4">
        {textLabel && (
          <Section title="Content">
            <TextField
              label={textLabel}
              value={element.text ?? ""}
              multiline={element.type === "text"}
              onChange={(text) => onChange({ text }, "text")}
            />
          </Section>
        )}

        {(hasFont || hasBackground) && (
          <Section title="Style">
            {hasFont && (
              <NumberField
                label="Font size"
                value={element.style.fontSize}
                placeholder="16"
                min={8}
                max={200}
                onCommit={(fontSize) => onChange({ style: { fontSize } }, "fontSize")}
              />
            )}
            <div className="grid grid-cols-1 gap-3">
              {hasTextColor && (
                <ColorField
                  label="Text colour"
                  value={element.style.color}
                  fallback={element.type === "button" ? "#ffffff" : "#171717"}
                  onChange={(color) => onChange({ style: { color } }, "color")}
                />
              )}
              {hasBackground && (
                <ColorField
                  label="Background"
                  value={element.style.backgroundColor}
                  fallback={element.type === "button" ? "#18181b" : "#ffffff"}
                  onChange={(backgroundColor) =>
                    onChange({ style: { backgroundColor } }, "backgroundColor")
                  }
                />
              )}
            </div>
          </Section>
        )}

        <Section title="Position & size">
          <div className="grid grid-cols-2 gap-2.5">
            <NumberField
              label="X position"
              hideLabel
              prefix="X"
              value={element.x}
              min={0}
              max={cw - 1}
              onCommit={(x) => onChange({ x }, "x")}
            />
            <NumberField
              label="Y position"
              hideLabel
              prefix="Y"
              value={element.y}
              min={0}
              max={ch - 1}
              onCommit={(y) => onChange({ y }, "y")}
            />
            <NumberField
              label="Width"
              hideLabel
              prefix="W"
              value={element.width}
              min={1}
              max={cw}
              onCommit={(width) => onChange({ width }, "width")}
            />
            <NumberField
              label="Height"
              hideLabel
              prefix="H"
              value={element.height}
              min={1}
              max={ch}
              onCommit={(height) => onChange({ height }, "height")}
            />
          </div>
        </Section>

        <div className="flex items-center justify-between border-t border-line pt-4">
          <Button variant="ghost" onClick={onDelete} className="-ml-2 text-[#ff8a7a] hover:bg-[#ff8a7a]/10 hover:text-[#ff9d8f]">
            <TrashIcon />
            Delete element
          </Button>
          <Kbd>Del</Kbd>
        </div>
      </div>
    </motion.div>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-3">
      <h3 className="text-[12px] font-medium text-chalk">{title}</h3>
      {children}
    </section>
  );
}

/** Nothing selected: a quick read of the page instead of an empty panel. */
function ProjectSummary({ project }: { project: WireframeProject }) {
  const counts = new Map<string, number>();
  for (const el of project.elements) {
    counts.set(TYPE_LABEL[el.type], (counts.get(TYPE_LABEL[el.type]) ?? 0) + 1);
  }

  return (
    <div className="flex flex-col gap-5 px-4 py-5">
      <div>
        <p className="text-[13px] font-medium text-chalk">Nothing selected</p>
        <p className="mt-1 text-[13px] leading-relaxed text-muted">
          Click an element on the page, or pick one from Layers, to edit its text,
          colours and size.
        </p>
      </div>
      <dl className="grid grid-cols-[1fr_auto] gap-y-2 border-t border-line pt-4 text-[13px]">
        <dt className="text-muted">Page</dt>
        <dd className="font-tech tabular-nums text-chalk">
          {project.canvas.width} × {project.canvas.height}
        </dd>
        {[...counts].map(([label, count]) => (
          <div key={label} className="contents">
            <dt className="text-muted">{label}</dt>
            <dd className="font-tech tabular-nums text-chalk">{count}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
