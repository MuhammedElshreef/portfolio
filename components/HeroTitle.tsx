"use client";

import { Fragment, useEffect, useRef } from "react";
import { kinetic } from "@/lib/kinetic";

/** The name, split into masked words and letters. Its weight thins near the pointer. */
export default function HeroTitle({ lines, label }: { lines: string[]; label: string }) {
  const ref = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    const h1 = ref.current;
    if (!h1) return;
    return kinetic(Array.from(h1.querySelectorAll<HTMLElement>(".ch")), h1, { g0: 800, g1: 420, radius: 200 });
  }, []);
  return (
    <h1 className="hero-title" aria-label={label} ref={ref}>
      {lines.map((line, li) => (
        <span className="line" aria-hidden="true" key={li}>
          {line.split(" ").map((w, wi) => (
            <Fragment key={wi}>
              {wi > 0 ? " " : null}
              <span className="word" aria-hidden="true">
                {[...w].map((c, ci) => (
                  <span className="ch" key={ci}>
                    {c}
                  </span>
                ))}
              </span>
            </Fragment>
          ))}
        </span>
      ))}
    </h1>
  );
}
