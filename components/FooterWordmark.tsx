"use client";

import { useEffect, useRef } from "react";
import { clamp, fontsReady, prefersReducedMotion } from "@/lib/store";

/*
  The handle as one huge outlined word across the foot of the page, fitted to the column
  width. It fills with colour as the page reaches its end. The fill is a pseudo-element
  reading data-text, so the word is in the page only once.
*/
export default function FooterWordmark({ text }: { text: string }) {
  const ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const el = ref.current;
    const out = el?.querySelector<HTMLElement>(".foot-wm-out");
    if (!el || !out) return;
    let alive = true;
    // The typeface changes its letter shapes with size, so fit in a few passes
    const fit = () => {
      let size = 96;
      for (let i = 0; i < 4; i++) {
        el.style.fontSize = `${size}px`;
        const w = out.getBoundingClientRect().width || 1;
        size = Math.max(28, (size * el.clientWidth * 0.985) / w);
      }
      el.style.fontSize = `${size.toFixed(2)}px`;
    };
    fit();
    fontsReady().then(() => {
      if (!alive) return;
      fit();
      if (motion) fill();
    });
    let lastW = el.clientWidth;
    const ro = new ResizeObserver(() => {
      if (el.clientWidth === lastW) return;
      lastW = el.clientWidth;
      fit();
    });
    ro.observe(el);

    // Measured on every scroll, not cached: the page's height still changes after load
    // (fonts, the fit above), and a stale end left the fill short at the very bottom.
    const fill = () => {
      const vh = window.innerHeight;
      const start = el.getBoundingClientRect().top + window.scrollY - vh;
      // Within a pixel of the end counts as the end (zoomed pages scroll in fractions)
      const span = document.documentElement.scrollHeight - vh - 1 - start;
      const p = span > 0 ? clamp((window.scrollY - start) / span, 0, 1) : 1;
      el.style.setProperty("--p", p.toFixed(4));
    };
    const motion = !prefersReducedMotion();
    if (motion) {
      fill();
      addEventListener("scroll", fill, { passive: true });
      addEventListener("resize", fill);
    }
    return () => {
      alive = false;
      ro.disconnect();
      if (motion) {
        removeEventListener("scroll", fill);
        removeEventListener("resize", fill);
      }
      el.style.removeProperty("--p");
      el.style.fontSize = "";
    };
  }, []);

  return (
    <p className="foot-wm" ref={ref} data-text={text}>
      <span className="foot-wm-out">{text}</span>
    </p>
  );
}
