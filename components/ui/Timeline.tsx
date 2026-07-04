"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll } from "motion/react";

// The blue line draws itself down the resting hairline as the section scrolls by.
export function TimelineLine() {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.8", "end 0.5"],
  });

  return (
    <div ref={ref} aria-hidden className="absolute inset-y-0 left-0 w-px bg-hairline">
      <motion.div
        className="absolute inset-0 origin-top bg-blue"
        style={{ scaleY: reduceMotion ? 1 : scrollYProgress }}
      />
    </div>
  );
}

// Entry marker that pops when the drawn line reaches it
export function TimelineDot({ color, className }: { color: string; className?: string }) {
  return (
    <motion.span
      className={`block h-2.5 w-2.5 rounded-full ${className ?? ""}`}
      style={{ backgroundColor: color }}
      initial={{ scale: 0 }}
      whileInView={{ scale: 1 }}
      viewport={{ once: true, margin: "-35% 0px -35% 0px" }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    />
  );
}
