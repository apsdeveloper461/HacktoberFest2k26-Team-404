// Small stroke icons for the app chrome (16px grid, currentColor).
// Kept inline so the app needs no icon dependency.
import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

function Icon({ children, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 16 16"
      width={16}
      height={16}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      {children}
    </svg>
  );
}

export const UploadIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M8 10.5V2.5M5 5.5l3-3 3 3M2.5 10v2.25c0 .69.56 1.25 1.25 1.25h8.5c.69 0 1.25-.56 1.25-1.25V10" />
  </Icon>
);

export const CameraIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M2.5 5.25c0-.69.56-1.25 1.25-1.25h1.5l1-1.5h3.5l1 1.5h1.5c.69 0 1.25.56 1.25 1.25v6.5c0 .69-.56 1.25-1.25 1.25h-8.5c-.69 0-1.25-.56-1.25-1.25z" />
    <circle cx="8" cy="8.5" r="2.25" />
  </Icon>
);

export const PlusIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M8 3v10M3 8h10" />
  </Icon>
);

export const MinusIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M3 8h10" />
  </Icon>
);

export const FitIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M2.5 5.5v-3h3M10.5 2.5h3v3M13.5 10.5v3h-3M5.5 13.5h-3v-3" />
  </Icon>
);

export const DownloadIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M8 2.5v8M5 7.5l3 3 3-3M2.5 13.5h11" />
  </Icon>
);

export const TrashIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M3 4.5h10M6.5 4.5V3h3v1.5M4.5 4.5l.6 8.1c.05.5.47.9.98.9h3.84c.51 0 .93-.4.98-.9l.6-8.1" />
  </Icon>
);

export const UndoIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M5.5 3.5 2.5 6.5l3 3" />
    <path d="M2.5 6.5h7a4 4 0 0 1 0 8H7" />
  </Icon>
);

export const RedoIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="m10.5 3.5 3 3-3 3" />
    <path d="M13.5 6.5h-7a4 4 0 0 0 0 8H9" />
  </Icon>
);

export const CopyIcon = (p: IconProps) => (
  <Icon {...p}>
    <rect x="5.5" y="5.5" width="8" height="8" rx="1.25" />
    <path d="M10.5 5.5V3.75c0-.69-.56-1.25-1.25-1.25h-5.5c-.69 0-1.25.56-1.25 1.25v5.5c0 .69.56 1.25 1.25 1.25H5.5" />
  </Icon>
);

export const CheckIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="m3 8.5 3 3 7-7" />
  </Icon>
);

export const AlertIcon = (p: IconProps) => (
  <Icon {...p}>
    <circle cx="8" cy="8" r="5.75" />
    <path d="M8 5v3.25M8 10.75v.01" />
  </Icon>
);

export const ArrowLeftIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M13 8H3M7 4 3 8l4 4" />
  </Icon>
);

/* Element-type glyphs, used in Layers and the inspector header. */

export const TextGlyph = (p: IconProps) => (
  <Icon {...p}>
    <path d="M3.5 4V3h9v1M8 3v10M6 13h4" />
  </Icon>
);

export const ButtonGlyph = (p: IconProps) => (
  <Icon {...p}>
    <rect x="2" y="4.5" width="12" height="7" rx="2" />
    <path d="M5.5 8h5" />
  </Icon>
);

export const InputGlyph = (p: IconProps) => (
  <Icon {...p}>
    <rect x="2" y="4.5" width="12" height="7" rx="1" />
    <path d="M5 6.5v3" />
  </Icon>
);

export const ImageGlyph = (p: IconProps) => (
  <Icon {...p}>
    <rect x="2.5" y="3" width="11" height="10" rx="1" />
    <path d="m3 11.5 3.5-3.5 2.5 2.5 1.5-1.5 2.5 2.5" />
    <circle cx="10.25" cy="5.75" r=".9" />
  </Icon>
);

export const ContainerGlyph = (p: IconProps) => (
  <Icon {...p}>
    <rect x="2.5" y="2.5" width="11" height="11" rx="1" strokeDasharray="2 2" />
  </Icon>
);
