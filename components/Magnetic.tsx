"use client";

import { useEffect } from "react";
import { gsap } from "@/lib/gsap";
import { finePointer, prefersReducedMotion } from "@/lib/store";

/** Buttons marked data-magnetic lean toward the pointer and spring back */
export default function Magnetic() {
  useEffect(() => {
    if (!finePointer() || prefersReducedMotion()) return;
    const offs = gsap.utils.toArray<HTMLElement>("[data-magnetic]").map((b) => {
      const xTo = gsap.quickTo(b, "x", { duration: 0.5, ease: "power3.out" }),
        yTo = gsap.quickTo(b, "y", { duration: 0.5, ease: "power3.out" });
      const move = (e: PointerEvent) => {
        const r = b.getBoundingClientRect();
        xTo((e.clientX - r.left - r.width / 2) * 0.3);
        yTo((e.clientY - r.top - r.height / 2) * 0.35);
      };
      const leave = () => {
        gsap.to(b, { x: 0, y: 0, duration: 0.9, ease: "elastic.out(1, 0.35)" });
      };
      b.addEventListener("pointermove", move);
      b.addEventListener("pointerleave", leave);
      return () => {
        b.removeEventListener("pointermove", move);
        b.removeEventListener("pointerleave", leave);
        gsap.killTweensOf(b, "x,y");
        gsap.set(b, { clearProps: "x,y,transform" });
      };
    });
    return () => offs.forEach((off) => off());
  }, []);
  return null;
}
