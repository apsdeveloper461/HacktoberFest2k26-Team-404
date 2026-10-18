// Owner: Dev 2. One React rendering per supported element type.
// The rendered controls are `inert`: they show what the page will look like, while
// the wrapper handles selection (and keyboard users select from Layers).
import type { WireframeElement } from "@/lib/project/schema";

type ElementRendererProps = {
  element: WireframeElement;
  onSelect: () => void;
};

export function ElementRenderer({ element, onSelect }: ElementRendererProps) {
  const { x, y, width, height, style } = element;

  return (
    <div
      data-element-id={element.id}
      onClick={(event) => {
        event.stopPropagation();
        onSelect();
      }}
      className="absolute cursor-default hover:outline hover:outline-1 hover:outline-offset-1 hover:outline-[#11120f]/35"
      style={{
        left: x,
        top: y,
        width,
        height,
        fontSize: style.fontSize,
        color: style.color,
      }}
    >
      <div inert className="h-full w-full">
        {renderContent(element)}
      </div>
    </div>
  );
}

function renderContent(element: WireframeElement) {
  const { backgroundColor } = element.style;

  switch (element.type) {
    case "text":
      return <p className="h-full w-full leading-tight">{element.text}</p>;
    case "button":
      return (
        <button
          type="button"
          tabIndex={-1}
          className="h-full w-full rounded-md bg-zinc-900 px-3 font-medium text-white"
          style={{ backgroundColor, color: element.style.color }}
        >
          {element.text}
        </button>
      );
    case "input":
      return (
        <input
          readOnly
          tabIndex={-1}
          placeholder={element.text}
          aria-label={element.text || "Input"}
          className="h-full w-full rounded-md border border-zinc-300 bg-white px-3 placeholder:text-zinc-400"
          style={{ backgroundColor }}
        />
      );
    case "image":
      return (
        <div className="flex h-full w-full flex-col items-center justify-center gap-1 border-2 border-dashed border-zinc-300 bg-zinc-50 text-sm text-zinc-400">
          <svg viewBox="0 0 24 24" width={28} height={28} fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
            <rect x="3" y="4" width="18" height="16" rx="1.5" />
            <path d="m3.5 17 5-5 4 4 2.5-2.5 5.5 5.5" />
            <circle cx="16" cy="8.5" r="1.5" />
          </svg>
          Image
        </div>
      );
    case "container":
      return (
        <div
          className="h-full w-full rounded-md border border-zinc-200"
          style={{ backgroundColor }}
        />
      );
  }
}
