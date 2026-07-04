"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";

// Shared so the particle field can read scroll velocity without re-renders.
export const scrollState = { velocity: 0, progress: 0 };

let activeLenis: Lenis | null = null;

// Lets overlays (mobile menu) freeze the page under them.
export const scrollControl = {
  stop() {
    activeLenis?.stop();
    document.documentElement.style.overflow = "hidden";
  },
  start() {
    activeLenis?.start();
    document.documentElement.style.overflow = "";
  },
};

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => 1 - Math.pow(1 - t, 4),
      anchors: true,
    });
    lenisRef.current = lenis;
    activeLenis = lenis;

    lenis.on("scroll", ({ velocity, progress }: { velocity: number; progress: number }) => {
      scrollState.velocity = velocity;
      scrollState.progress = progress;
    });

    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      lenisRef.current = null;
      activeLenis = null;
    };
  }, []);

  return <>{children}</>;
}
