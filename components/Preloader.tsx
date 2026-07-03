"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { loaderState } from "./loaderState";

const DURATION = 2400;
const easeOutQuart = (t: number) => 1 - Math.pow(1 - t, 4);

const STATUSES: [threshold: number, label: string][] = [
  [0, "booting up…"],
  [25, "building interfaces…"],
  [55, "drawing the projects…"],
  [80, "polishing pixels…"],
  [96, "ready."],
];

function statusFor(count: number) {
  let label = STATUSES[0][1];
  for (const [threshold, text] of STATUSES) {
    if (count >= threshold) label = text;
  }
  return label;
}

export default function Preloader() {
  const [count, setCount] = useState(0);
  const [visible, setVisible] = useState(true);
  // Reduced motion dismisses instantly instead of animating the wipe
  const [instant, setInstant] = useState(false);

  useEffect(() => {
    let rafId = 0;
    let timeoutId = 0;

    rafId = requestAnimationFrame(() => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        setInstant(true);
        setVisible(false);
        loaderState.finish();
        return;
      }

      const start = performance.now();
      const tick = (now: number) => {
        const t = Math.min((now - start) / DURATION, 1);
        setCount(Math.round(easeOutQuart(t) * 100));
        if (t < 1) {
          rafId = requestAnimationFrame(tick);
        } else {
          // Hold 100 for a beat before the wipe
          timeoutId = window.setTimeout(() => {
            setVisible(false);
            loaderState.finish();
          }, 450);
        }
      };
      rafId = requestAnimationFrame(tick);
    });

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(timeoutId);
    };
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-100 flex flex-col justify-between bg-blue px-6 py-6 sm:px-10 sm:py-10"
          exit={{ y: "-100%" }}
          transition={{ duration: instant ? 0 : 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.p
            className="font-mono text-sm uppercase tracking-widest text-paper sm:text-base"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.6 }}
          >
            Muhammed Alsayed — Portfolio
          </motion.p>

          <div className="flex items-end justify-between gap-6">
            <motion.p
              key={statusFor(count)}
              className="mb-4 font-mono text-sm uppercase tracking-widest text-paper/70 sm:text-base"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
            >
              {statusFor(count)}
            </motion.p>
            <span className="text-display text-[clamp(6rem,20vw,14rem)] leading-none text-paper tabular-nums">
              {count}
            </span>
          </div>

          <div
            className="absolute bottom-0 left-0 h-1 bg-paper transition-[width] duration-100 ease-linear"
            style={{ width: `${count}%` }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
