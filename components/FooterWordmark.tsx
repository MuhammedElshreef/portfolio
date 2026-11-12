"use client";

import { useEffect, useRef } from "react";
import { ScrollTrigger } from "@/lib/gsap";
import { fontsReady, prefersReducedMotion } from "@/lib/store";

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
      if (alive) fit();
    });
    let lastW = el.clientWidth;
    const ro = new ResizeObserver(() => {
      if (el.clientWidth === lastW) return;
      lastW = el.clientWidth;
      fit();
    });
    ro.observe(el);

    let st: ScrollTrigger | null = null;
    if (!prefersReducedMotion()) {
      const fill = (self: ScrollTrigger) => el.style.setProperty("--p", self.progress.toFixed(4));
      st = ScrollTrigger.create({ trigger: el, start: "top bottom", end: "max", onUpdate: fill, onRefresh: fill });
    }
    return () => {
      alive = false;
      ro.disconnect();
      st?.kill();
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
