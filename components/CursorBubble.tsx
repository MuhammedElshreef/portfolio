"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { finePointer, prefersReducedMotion, store } from "@/lib/store";

/** The "View" bubble that trails the cursor over the front ring card */
export default function CursorBubble({ label }: { label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const bubble = ref.current;
    if (!bubble || prefersReducedMotion() || !finePointer()) return;
    let on = false;
    gsap.set(bubble, { scale: 0, opacity: 0 });
    const bx = gsap.quickTo(bubble, "x", { duration: 0.5, ease: "power3" }),
      by = gsap.quickTo(bubble, "y", { duration: 0.5, ease: "power3" });
    const move = (e: PointerEvent) => {
      bx(e.clientX);
      by(e.clientY);
    };
    addEventListener("pointermove", move, { passive: true });
    store.bubble = {
      show() {
        if (on) return;
        on = true;
        gsap.to(bubble, { scale: 1, opacity: 1, duration: 0.45, ease: "back.out(2)", overwrite: "auto" });
      },
      hide() {
        if (!on) return;
        on = false;
        gsap.to(bubble, { scale: 0, opacity: 0, duration: 0.3, overwrite: "auto" });
      },
      press() {
        if (on) gsap.to(bubble, { scale: 0.85, duration: 0.15 });
      },
    };
    return () => {
      removeEventListener("pointermove", move);
      store.bubble = null;
      gsap.killTweensOf(bubble);
      gsap.set(bubble, { clearProps: "all" });
    };
  }, []);
  return (
    <div className="bubble" id="bubble" ref={ref} aria-hidden="true">
      {label}
    </div>
  );
}
