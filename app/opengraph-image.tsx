import { ImageResponse } from "next/og";
import { hero, seo } from "@/lib/content";

export const alt = seo.title;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Share-card rendition of the site's warm-paper hero
export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "0 96px",
          background: "#f5f1e8",
          color: "#46382a",
        }}
      >
        <div style={{ fontSize: 30, color: "#8a7a6a", letterSpacing: 6, textTransform: "uppercase" }}>
          Tripoli, Libya
        </div>
        <div style={{ fontSize: 96, fontWeight: 700, marginTop: 24, lineHeight: 1.05 }}>
          {hero.role.join(" ")}
        </div>
        <div style={{ fontSize: 54, fontStyle: "italic", color: "#2563eb", marginTop: 24 }}>
          {`— ${hero.name}`}
        </div>
        <div
          style={{
            position: "absolute",
            bottom: 48,
            left: 96,
            fontSize: 28,
            color: "#8a7a6a",
            letterSpacing: 3,
          }}
        >
          alsayed.ly
        </div>
      </div>
    ),
    size
  );
}
