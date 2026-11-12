"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { clamp, prefersReducedMotion } from "@/lib/store";

/*
  The contact headline builds itself. Its letters start loose (scattered, turned and
  outlined) and lock into the sentence one after another as the line scrolls up the
  screen, each filling with colour as it lands. The last word lands in the accent.
  The server renders the finished sentence, which is also what shows without motion.
*/
export default function AssembleLine({ text }: { text: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const cut = text.lastIndexOf(" ");
  const rows = cut < 0 ? [text] : [text.slice(0, cut + 1), text.slice(cut + 1)];

  useEffect(() => {
    const line = ref.current;
    if (!line || prefersReducedMotion()) return;
    const letters = Array.from(line.querySelectorAll<HTMLElement>(".ch"));
    const n = letters.length;
    // A fixed seed: the same scatter on every visit
    let seed = 7;
    const rnd = () => {
      seed = (seed * 16807) % 2147483647;
      return seed / 2147483647;
    };
    const from = letters.map(() => ({ x: rnd() - 0.5, y: rnd() - 0.5, turn: (rnd() - 0.5) * 150, size: 0.5 + rnd() * 1.3 }));
    let spreadX = 0,
      spreadY = 0;
    const measure = () => {
      spreadX = Math.min(line.clientWidth * 0.6, 640);
      spreadY = Math.min(window.innerHeight * 0.42, 330);
    };
    // p runs 0 to 1. Each letter gets its own stretch of it, so they land left to right.
    const apply = (p: number) => {
      letters.forEach((el, i) => {
        const u = clamp((p - (i / n) * 0.6) / 0.4, 0, 1),
          k = (1 - u) ** 3,
          f = from[i];
        el.style.transform =
          k > 0.0005
            ? `translate(${(f.x * spreadX * k).toFixed(1)}px,${(f.y * spreadY * k).toFixed(1)}px) rotate(${(f.turn * k).toFixed(1)}deg) scale(${(1 + (f.size - 1) * k).toFixed(3)})`
            : "";
        el.style.opacity = clamp(0.3 + u * 2, 0, 1).toFixed(2);
        el.classList.toggle("in", u >= 1);
      });
    };
    measure();
    const state = { p: 0 };
    const ctx = gsap.context(() => {
      gsap.to(state, {
        p: 1,
        ease: "none",
        onUpdate: () => apply(state.p),
        scrollTrigger: { trigger: line, start: "top 95%", end: "top 42%", scrub: 0.6, onRefresh: measure },
      });
    });
    apply(state.p);
    return () => {
      ctx.revert();
      letters.forEach((el) => {
        el.style.transform = "";
        el.style.opacity = "";
        el.classList.add("in");
      });
    };
  }, []);

  return (
    <p className="asm" ref={ref}>
      <span className="sr-only">{text}</span>
      {rows.map((row, r) => (
        <span className={`asm-row${rows.length > 1 && r === rows.length - 1 ? " acc" : ""}`} aria-hidden="true" key={r}>
          {[...row].map((c, i) =>
            c === " " ? (
              " "
            ) : (
              <span className="ch in" key={i}>
                {c}
              </span>
            ),
          )}
        </span>
      ))}
    </p>
  );
}
