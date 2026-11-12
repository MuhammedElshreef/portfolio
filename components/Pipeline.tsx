"use client";

import { useEffect, useRef } from "react";
import { ScrollTrigger } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/store";

export type PipelineStep = { name: string; text: string; log: string };
export type PipelineStates = { wait: string; run: string; ok: string };
type State = keyof PipelineStates;

const check = (
  <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M2.5 7.5l3 3 6-7" />
  </svg>
);

/*
  How I work, drawn as a deploy pipeline. Scrolling through it runs the build: the line
  fills and each step goes from queued to running to passed, and back again on the way
  up. Without motion (or before the script runs) every step simply shows as passed.
*/
export default function Pipeline({ steps, states }: { steps: PipelineStep[]; states: PipelineStates }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const pipe = ref.current;
    if (!pipe || prefersReducedMotion()) return;
    const items = Array.from(pipe.querySelectorAll<HTMLElement>(".pstep"));
    const labels = items.map((el) => el.querySelector<HTMLElement>(".pstate"));
    const n = items.length;
    const cur: State[] = items.map(() => "ok");
    const apply = (p: number) => {
      pipe.style.setProperty("--p", p.toFixed(4));
      items.forEach((el, i) => {
        const s: State = p >= (i + 1) / n - 0.002 ? "ok" : p > i / n ? "run" : "wait";
        if (s === cur[i]) return;
        cur[i] = s;
        el.classList.remove("is-wait", "is-run", "is-ok");
        el.classList.add(`is-${s}`);
        const label = labels[i];
        if (label) label.textContent = states[s];
      });
    };
    const st = ScrollTrigger.create({
      trigger: pipe,
      start: "top 80%",
      end: "bottom 55%",
      onUpdate: (self) => apply(self.progress),
      onRefresh: (self) => apply(self.progress),
    });
    apply(st.progress);
    return () => {
      st.kill();
      apply(1);
    };
  }, [states]);

  return (
    <div className="pipe" ref={ref}>
      <span className="pipe-fill" aria-hidden="true" />
      <ol className="pipe-steps">
        {steps.map((s) => (
          <li className="pstep is-ok" key={s.name}>
            <span className="pdot">{check}</span>
            <span className="pstate" aria-hidden="true">
              {states.ok}
            </span>
            <h3 className="pname">{s.name}</h3>
            <p className="ptext">{s.text}</p>
            <p className="plog">{s.log}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
