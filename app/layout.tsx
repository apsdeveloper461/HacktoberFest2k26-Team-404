import type { Metadata, Viewport } from "next";
import {
  Bricolage_Grotesque,
  Geist,
  Geist_Mono,
  Recursive,
} from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Landing display face: variable width + optical size for editorial headlines.
const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  axes: ["opsz", "wdth"],
});

// One family, two voices: MONO 1 for technical labels, CASL 1 for hand notes.
const recursive = Recursive({
  variable: "--font-recursive",
  subsets: ["latin"],
  axes: ["CASL", "MONO"],
});

const description =
  "Photograph a hand-drawn website wireframe and ChalkScript AI turns it into an editable, interactive web preview. An experimental sketch-to-prototype tool, in early development.";

export const metadata: Metadata = {
  title: "ChalkScript AI — Turn whiteboard sketches into editable prototypes",
  description,
  applicationName: "ChalkScript AI",
  openGraph: {
    type: "website",
    siteName: "ChalkScript AI",
    title: "ChalkScript AI — Your whiteboard is closer to software than you think",
    description,
  },
  twitter: {
    card: "summary_large_image",
    title: "ChalkScript AI — Your whiteboard is closer to software than you think",
    description,
  },
};

export const viewport: Viewport = {
  themeColor: "#11120f",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable} ${bricolage.variable} ${recursive.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
