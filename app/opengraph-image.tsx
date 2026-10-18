import { ImageResponse } from "next/og";

// Social card for the landing page (generated at build time).
export const alt = "ChalkScript AI — Your whiteboard is closer to software than you think.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const handle = { position: "absolute", width: 14, height: 14, background: "#D9FF63", border: "2px solid #11120F" } as const;

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          width: "100%",
          height: "100%",
          padding: "64px 72px",
          background: "#11120F",
          color: "#F1F0E8",
          backgroundImage:
            "linear-gradient(to right, rgba(241,240,232,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(241,240,232,0.05) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 30 }}>
          <div style={{ display: "flex", width: 34, height: 34, borderLeft: "3px solid #F1F0E8", borderBottom: "3px solid #F1F0E8", position: "relative" }}>
            <div style={{ ...handle, left: -9, bottom: -9 }} />
          </div>
          ChalkScript AI
        </div>

        <div style={{ display: "flex", flexDirection: "column", fontSize: 88, lineHeight: 1.02, letterSpacing: -3 }}>
          <div style={{ display: "flex" }}>Your whiteboard is</div>
          <div style={{ display: "flex", alignItems: "center" }}>
            closer to
            <div style={{ display: "flex", position: "relative", marginLeft: 26, padding: "0 16px", border: "3px solid #D9FF63" }}>
              software
              <div style={{ ...handle, left: -9, top: -9 }} />
              <div style={{ ...handle, right: -9, bottom: -9 }} />
            </div>
          </div>
          <div style={{ display: "flex" }}>than you think.</div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 24, color: "#92958B" }}>
          <div style={{ display: "flex" }}>Hand-drawn wireframes in · editable web previews out</div>
          <div style={{ display: "flex", color: "#D9FF63" }}>concept preview</div>
        </div>
      </div>
    ),
    size,
  );
}
