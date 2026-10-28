"use client";

import { useEffect } from "react";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/store";

/** Page-wide scroll reveals: the statement lights up word by word, [data-rise] blocks rise in */
export default function ScrollReveals() {
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".sw",
        { opacity: 0.12 },
        {
          opacity: 1,
          ease: "none",
          stagger: 0.12,
          scrollTrigger: { trigger: "#statement", start: "top 70%", end: "center 45%", scrub: true },
        },
      );
      gsap.utils.toArray<HTMLElement>("[data-rise]").forEach((el) =>
        gsap.from(el, {
          y: 46,
          opacity: 0,
          duration: 1.1,
          ease: "expo.out",
          scrollTrigger: { trigger: el, start: "top 88%" },
        }),
      );
    });
    return () => ctx.revert();
  }, []);
  return null;
}
