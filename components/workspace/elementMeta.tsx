// Owner: Dev 2. Names and glyphs per element type, shared by Layers and the inspector.
import type { ElementType, WireframeElement } from "@/lib/project/schema";
import {
  ButtonGlyph,
  ContainerGlyph,
  ImageGlyph,
  InputGlyph,
  TextGlyph,
} from "@/components/app/icons";

export const TYPE_LABEL: Record<ElementType, string> = {
  text: "Text",
  button: "Button",
  input: "Input",
  image: "Image",
  container: "Container",
};

/** What the element's `text` means for each type (null = no text field). */
export const TEXT_FIELD_LABEL: Record<ElementType, string | null> = {
  text: "Text",
  button: "Label",
  input: "Placeholder",
  image: null,
  container: null,
};

export function elementTitle(element: WireframeElement) {
  return element.text?.trim() || TYPE_LABEL[element.type];
}

export function TypeGlyph({ type, className }: { type: ElementType; className?: string }) {
  switch (type) {
    case "text":
      return <TextGlyph className={className} />;
    case "button":
      return <ButtonGlyph className={className} />;
    case "input":
      return <InputGlyph className={className} />;
    case "image":
      return <ImageGlyph className={className} />;
    case "container":
      return <ContainerGlyph className={className} />;
  }
}
