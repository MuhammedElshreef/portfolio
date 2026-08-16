"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import { useMediaQuery } from "./Scene/useMediaQuery";
import { useTheme, type Theme } from "./themeState";

type Mode = "default" | "link" | "view";

type RingStyle = { size: number; backgroundColor: string; borderColor: string };

// blue / resting-ring rgb per theme (framer-motion animates rgba strings)
const inkRgb: Record<Theme, { blue: string; rest: string }> = {
  light: { blue: "37, 99, 235", rest: "70, 56, 42" },
  dark: { blue: "77, 141, 255", rest: "214, 224, 238" },
};

function ringStyles(theme: Theme): Record<Mode, RingStyle> {
  const { blue, rest } = inkRgb[theme];
  return {
    default: { size: 32, backgroundColor: `rgba(${blue}, 0)`, borderColor: `rgba(${rest}, 0.35)` },
    link: { size: 48, backgroundColor: `rgba(${blue}, 0.08)`, borderColor: `rgba(${blue}, 0.65)` },
    view: { size: 76, backgroundColor: `rgba(${blue}, 0.95)`, borderColor: `rgba(${blue}, 0)` },
  };
}

// Ink dot + trailing ring. Fine pointers only; the ring becomes a "View ↗"
// pill over project cards (anything carrying data-cursor="view").
export default function Cursor() {
  const fine = useMediaQuery("(pointer: fine)");
  const reduceMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const enabled = fine && !reduceMotion;

  const [visible, setVisible] = useState(false);
  const [mode, setMode] = useState<Mode>("default");
  const ring = ringStyles(useTheme());

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 350, damping: 30, mass: 0.7 });
  const ringY = useSpring(y, { stiffness: 350, damping: 30, mass: 0.7 });

  useEffect(() => {
    if (!enabled) return;

    document.documentElement.classList.add("cursor-hidden");

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      x.set(e.clientX);
      y.set(e.clientY);
      setVisible(true);
      const target = e.target as HTMLElement;
      if (target.closest('[data-cursor="view"]')) setMode("view");
      else if (target.closest("a, button")) setMode("link");
      else setMode("default");
    };
    const onLeave = () => setVisible(false);

    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      document.documentElement.classList.remove("cursor-hidden");
    };
  }, [enabled, x, y]);

  if (!enabled) return null;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-120">
      {/* Trailing ring */}
      <motion.div className="fixed left-0 top-0" style={{ x: ringX, y: ringY }}>
        <motion.div
          className="flex -translate-x-1/2 -translate-y-1/2 items-center justify-center overflow-hidden rounded-full border"
          animate={{
            width: ring[mode].size,
            height: ring[mode].size,
            backgroundColor: ring[mode].backgroundColor,
            borderColor: ring[mode].borderColor,
            opacity: visible ? 1 : 0,
          }}
          transition={{ type: "spring", stiffness: 350, damping: 26 }}
        >
          <motion.span
            className="whitespace-nowrap font-mono text-[10px] uppercase tracking-widest text-cream"
            animate={{ opacity: mode === "view" ? 1 : 0 }}
            transition={{ duration: 0.2 }}
          >
            View ↗
          </motion.span>
        </motion.div>
      </motion.div>

      {/* Dot rides the pointer exactly */}
      <motion.div
        className="fixed left-0 top-0 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-ink"
        style={{ x, y, opacity: visible && mode !== "view" ? 1 : 0 }}
      />
    </div>
  );
}
