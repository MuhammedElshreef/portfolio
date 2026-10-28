"use client";

import { useEffect, useRef } from "react";

/** Film grain over everything: a noise tile drawn once on a canvas */
export default function Grain() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    try {
      const c = document.createElement("canvas");
      c.width = c.height = 160;
      const g = c.getContext("2d");
      if (!g) return;
      const img = g.createImageData(160, 160);
      for (let i = 0; i < img.data.length; i += 4) {
        const v = Math.random() * 255;
        img.data[i] = img.data[i + 1] = img.data[i + 2] = v;
        img.data[i + 3] = 255;
      }
      g.putImageData(img, 0, 0);
      el.style.backgroundImage = `url(${c.toDataURL("image/png")})`;
    } catch {}
    return () => {
      el.style.backgroundImage = "";
    };
  }, []);
  return <div className="grain" ref={ref} aria-hidden="true" />;
}
