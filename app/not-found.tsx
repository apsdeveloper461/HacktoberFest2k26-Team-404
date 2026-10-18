import Link from "next/link";
import { buttonClasses } from "@/components/app/Button";

export default function NotFound() {
  return (
    <main className="flex min-h-dvh flex-1 flex-col items-center justify-center bg-ink px-6 py-16 font-sans text-chalk antialiased">
      <div className="w-full max-w-[440px]">
        <svg
          viewBox="0 0 120 72"
          width={120}
          height={72}
          fill="none"
          aria-hidden="true"
          className="text-muted"
        >
          {/* A sketched frame with nothing in it: the page that isn't there. */}
          <path
            d="M6 8.5C38 6.6 81 7.8 113.4 6.9 114.6 27 113.2 46 114.1 65.2 80 66.6 41 65.1 5.6 66.2 4.8 47 6.4 27 6 8.5Z"
            stroke="currentColor"
            strokeWidth={1.5}
            strokeLinejoin="round"
          />
          <path d="M44 26l32 20M76 26 44 46" stroke="#d9ff63" strokeWidth={1.5} strokeLinecap="round" />
        </svg>
        <p className="mt-6 font-tech text-[11px] uppercase tracking-[0.14em] text-muted">
          404 · Not found
        </p>
        <h1 className="mt-2 text-xl font-semibold tracking-tight">
          This page isn&apos;t on the board.
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          The link may be old, or the page was never drawn. Head back, or start a
          new sketch.
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          <Link href="/workspace" className={buttonClasses("primary", "md")}>
            Open the workspace
          </Link>
          <Link href="/" className={buttonClasses("secondary", "md")}>
            Back to home
          </Link>
        </div>
      </div>
    </main>
  );
}
