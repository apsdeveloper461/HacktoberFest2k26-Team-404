// Owner: Dev 2. One React rendering per supported element type.
import type { WireframeElement } from "@/lib/project/schema";

type ElementRendererProps = {
  element: WireframeElement;
  selected: boolean;
  onSelect: () => void;
};

export function ElementRenderer({
  element,
  selected,
  onSelect,
}: ElementRendererProps) {
  const { x, y, width, height, style } = element;

  return (
    <div
      onClick={(event) => {
        event.stopPropagation();
        onSelect();
      }}
      className={`absolute cursor-pointer ${
        selected ? "outline-2 outline-offset-2 outline-blue-500" : ""
      }`}
      style={{
        left: x,
        top: y,
        width,
        height,
        fontSize: style.fontSize,
        color: style.color,
      }}
    >
      {renderContent(element)}
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
          className="h-full w-full rounded-md bg-zinc-900 text-white"
          style={{ backgroundColor, color: element.style.color }}
        >
          {element.text}
        </button>
      );
    case "input":
      return (
        <input
          readOnly
          placeholder={element.text}
          className="h-full w-full rounded-md border border-zinc-300 px-3"
          style={{ backgroundColor }}
        />
      );
    case "image":
      return (
        <div className="flex h-full w-full items-center justify-center border-2 border-dashed border-zinc-300 bg-zinc-50 text-sm text-zinc-400">
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
