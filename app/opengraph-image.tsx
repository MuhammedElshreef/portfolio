import { ImageResponse } from "next/og";
import { hero, seo } from "@/lib/content";
import { bricolage, brand, jetbrainsMono, rakkasArabic } from "@/lib/og-fonts";

export const alt = seo.title;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// A light, fixed scatter of cyan stars (seeded, so every build draws the same sky)
function stars(count: number) {
  let s = 7;
  const r = () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  return Array.from({ length: count }, () => {
    const big = r() < 0.12;
    return {
      x: r() * size.width,
      y: r() * size.height,
      d: big ? 3 + r() * 2 : 1.2 + r() * 1.6,
      o: big ? 0.75 + r() * 0.25 : 0.2 + r() * 0.45,
      hi: r() < 0.3,
    };
  });
}

// Share card in the Ice palette. The full Arabic name is left out: Satori does not
// shape Rakkas's joined letters the way browsers do, while the single "م" renders true.
export default async function Image() {
  const [display800, display500, mono, arab] = await Promise.all([
    bricolage(800),
    bricolage(500),
    jetbrainsMono(),
    rakkasArabic(),
  ]);
  const domain = new URL(seo.url).host;
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          background: `radial-gradient(900px 560px at 78% 18%, rgba(51,199,216,0.16), rgba(7,9,12,0) 62%), radial-gradient(700px 520px at 6% 110%, rgba(14,127,142,0.28), rgba(7,9,12,0) 60%), ${brand.ground}`,
          color: brand.text,
          fontFamily: "Bricolage",
        }}
      >
        {stars(150).map((st, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: st.x,
              top: st.y,
              width: st.d,
              height: st.d,
              borderRadius: 999,
              background: st.hi ? brand.accentHi : brand.accent,
              opacity: st.o,
              boxShadow: st.d > 3 ? `0 0 ${st.d * 3}px ${brand.accent}` : "none",
            }}
          />
        ))}
        <div
          style={{
            position: "absolute",
            right: 96,
            top: 165,
            width: 300,
            height: 300,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 66,
            background: "rgba(11,26,30,0.85)",
            border: "2px solid rgba(51,199,216,0.42)",
            boxShadow: "0 0 90px rgba(51,199,216,0.25)",
          }}
        >
          <div
            style={{
              display: "flex",
              fontFamily: "Rakkas",
              fontSize: 276,
              lineHeight: 1,
              marginTop: -95,
              color: brand.accent,
            }}
          >
            م
          </div>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            paddingLeft: 96,
            height: "100%",
          }}
        >
          <div style={{ display: "flex", fontSize: 104, fontWeight: 800, lineHeight: 0.92, letterSpacing: -4.5 }}>
            {hero.titleLines[0]}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 104,
              fontWeight: 800,
              lineHeight: 0.92,
              letterSpacing: -4.5,
              color: brand.accent,
            }}
          >
            {hero.titleLines[1]}
          </div>
          <div style={{ display: "flex", marginTop: 34, fontSize: 40, fontWeight: 500, color: brand.muted }}>
            {seo.role}
          </div>
        </div>
        <div
          style={{
            position: "absolute",
            left: 96,
            bottom: 56,
            display: "flex",
            fontFamily: "JetBrains Mono",
            fontSize: 26,
            letterSpacing: 2,
            color: brand.accent,
          }}
        >
          {domain}
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Bricolage", data: display800, weight: 800, style: "normal" },
        { name: "Bricolage", data: display500, weight: 500, style: "normal" },
        { name: "JetBrains Mono", data: mono, weight: 500, style: "normal" },
        { name: "Rakkas", data: arab, weight: 400, style: "normal" },
      ],
    },
  );
}
