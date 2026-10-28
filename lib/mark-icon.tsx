import { ImageResponse } from "next/og";
import { brand, rakkasArabic } from "@/lib/og-fonts";

/** The "م" mark in Rakkas, cyan on the ground colour, in a rounded square */
export async function markIcon(px: number) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: brand.ground,
          borderRadius: Math.round(px * 0.22),
        }}
      >
        <div
          style={{
            display: "flex",
            fontFamily: "Rakkas",
            fontSize: Math.round(px * 0.92),
            lineHeight: 1,
            color: brand.accent,
            marginTop: Math.round(px * -0.26),
          }}
        >
          م
        </div>
      </div>
    ),
    {
      width: px,
      height: px,
      fonts: [{ name: "Rakkas", data: await rakkasArabic(), weight: 400, style: "normal" }],
    },
  );
}
