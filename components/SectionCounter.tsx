"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

const pad = (n: number) => String(n).padStart(2, "0");

// Fixed on the right edge (desktop): which chapter of the page you're in.
export default function SectionCounter() {
  const [current, setCurrent] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>("main section[id]"));

    // A section "owns" the counter while it crosses the middle band of the viewport
    const observer = new IntersectionObserver(
      (entries) => {
        setTotal(sections.length);
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setCurrent(sections.indexOf(entry.target as HTMLElement) + 1);
          }
        }
      },
      { rootMargin: "-45% 0px -45% 0px" }
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  if (total === 0) return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed right-6 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-center gap-3 font-mono text-[10px] tracking-widest text-ink-muted lg:flex"
    >
      <span className="relative block h-[1.2em] w-[2ch] overflow-hidden text-ink">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={current}
            className="absolute inset-0"
            initial={{ y: "110%" }}
            animate={{ y: "0%" }}
            exit={{ y: "-110%" }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          >
            {pad(current)}
          </motion.span>
        </AnimatePresence>
      </span>
      <span className="block h-8 w-px bg-hairline" />
      <span>{pad(total)}</span>
    </div>
  );
}
