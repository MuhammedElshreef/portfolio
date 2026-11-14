import { ImageResponse } from "next/og";
import { brand, jetbrainsMono } from "@/lib/og-fonts";

/** The ">_" prompt mark, the same one the header uses, in a rounded square */
export function PromptMark({ size }: { size: number }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        fontFamily: "JetBrains Mono",
        fontWeight: 800,
        fontSize: Math.round(size * 0.5),
        lineHeight: 1,
        letterSpacing: Math.round(size * -0.02),
        color: brand.accent,
      }}
    >
      {">_"}
    </div>
  );
}

export const promptMarkFont = async () => ({
  name: "JetBrains Mono",
  data: await jetbrainsMono(800),
  weight: 800 as const,
  style: "normal" as const,
});

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
        <PromptMark size={px} />
      </div>
    ),
    { width: px, height: px, fonts: [await promptMarkFont()] },
  );
}
