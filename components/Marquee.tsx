"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { clamp, prefersReducedMotion } from "@/lib/store";

/** One marquee line. It speeds up, skews and flips direction with your scroll. */
export default function Marquee({ text }: { text: string }) {
  const rowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const row = rowRef.current;
    if (!row || prefersReducedMotion()) return;
    let mqSettle: gsap.core.Tween | null = null;
    const ctx = gsap.context(() => {
      const loop = gsap.to(row, { xPercent: -50, duration: 28, ease: "none", repeat: -1 });
      loop.totalTime(loop.duration() * 40);
      const rowSkew = gsap.quickTo(row, "skewX", { duration: 0.5, ease: "power3" });
      ScrollTrigger.create({
        trigger: row.closest(".contact") ?? row,
        start: "top bottom",
        end: "bottom top",
        onUpdate(self) {
          const v = self.getVelocity(),
            dir = self.direction;
          gsap.to(loop, { timeScale: dir * (1 + Math.min(5, Math.abs(v) / 300)), duration: 0.2, overwrite: true });
          rowSkew(clamp(v / -250, -10, 10));
          mqSettle?.kill();
          mqSettle = gsap.delayedCall(0.2, () => {
            gsap.to(loop, { timeScale: dir, duration: 1.2, overwrite: true });
            rowSkew(0);
          });
        },
      });
    });
    return () => {
      mqSettle?.kill();
      ctx.revert();
    };
  }, []);

  const group = (
    <span className="mq-group">
      <span>{text}</span>
      <span className="mq-sep" />
      <span className="mq-out">{text}</span>
      <span className="mq-sep" />
    </span>
  );
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee-row" id="marquee-row" ref={rowRef}>
        {group}
        {group}
      </div>
    </div>
  );
}
