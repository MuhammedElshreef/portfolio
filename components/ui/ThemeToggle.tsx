"use client";

import { themeState, type Theme } from "../themeState";

type ViewTransitionLike = { ready: Promise<void>; finished: Promise<void> };

const SPILL_MS = 750;

// Clicking the inkwell spills ink from that exact point: the incoming theme
// is revealed by a circle expanding from the toggle (View Transitions API).
// Toggling back, the dark view drains toward the inkwell instead. Falls back
// to an instant switch without the API or with reduced motion.
function spillTo(next: Theme, x: number, y: number) {
  const doc = document as Document & {
    startViewTransition?: (update: () => void) => ViewTransitionLike;
  };
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!doc.startViewTransition || reduceMotion) {
    themeState.set(next);
    return;
  }

  const root = document.documentElement;
  const toDark = next === "dark";
  if (!toDark) root.classList.add("ink-drain");

  const radius = Math.hypot(
    Math.max(x, window.innerWidth - x),
    Math.max(y, window.innerHeight - y)
  );
  const circles = [
    `circle(0px at ${x}px ${y}px)`,
    `circle(${radius}px at ${x}px ${y}px)`,
  ];

  // Aborted transitions (hidden tab, rapid re-click) reject these promises;
  // the theme itself has already switched, so just swallow and clean up.
  const transition = doc.startViewTransition(() => themeState.set(next));
  transition.ready
    .then(() => {
      root.animate(
        { clipPath: toDark ? circles : [...circles].reverse() },
        {
          duration: SPILL_MS,
          easing: toDark ? "cubic-bezier(0.16, 1, 0.3, 1)" : "cubic-bezier(0.55, 0, 0.55, 0.2)",
          pseudoElement: toDark
            ? "::view-transition-new(root)"
            : "::view-transition-old(root)",
        }
      );
    })
    .catch(() => {});
  transition.finished
    .catch(() => {})
    .finally(() => root.classList.remove("ink-drain"));
}

export default function ThemeToggle() {
  const onClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const next: Theme = themeState.get() === "dark" ? "light" : "dark";
    const rect = e.currentTarget.getBoundingClientRect();
    spillTo(next, rect.left + rect.width / 2, rect.top + rect.height / 2);
  };

  // Reads as a terminal line: dark:false_ ↔ dark:true_. The value is CSS
  // ::after content keyed off [data-theme], so server and client markup
  // always match; the caret reuses the typing logo's blink animation.
  return (
    <button
      onClick={onClick}
      aria-label="Toggle dark mode"
      title="Switch theme"
      className="theme-toggle group flex h-11 items-center px-1 font-mono text-xs tracking-tight text-ink-muted transition-colors hover:text-blue"
    >
      <span aria-hidden>
        {/* Prompt chevron — the "this line runs" cue; nudges forward on hover */}
        <span className="mr-1.5 inline-block text-blue transition-transform duration-300 group-hover:translate-x-[3px]">
          &gt;
        </span>
        dark:
        <span className="val inline-block min-w-[5ch] text-left" />
        <span className="animate-[blink_1.1s_steps(2)_infinite] text-blue">_</span>
      </span>
    </button>
  );
}
