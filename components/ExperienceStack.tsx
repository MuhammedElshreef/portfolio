"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/store";

export type Job = {
  from: string;
  to: string;
  role: string;
  company: string;
  url?: string;
  current?: boolean;
  description?: string;
};

/** Sticky stacking cards: each one shrinks and dims as the next slides over it */
export default function ExperienceStack({ jobs, currentBadge }: { jobs: Job[]; currentBadge: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const list = ref.current;
    if (!list || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      const items = gsap.utils.toArray<HTMLElement>(".job", list);
      items.forEach((j, i) => {
        gsap.from(j.querySelector(".job-when"), {
          yPercent: 40,
          opacity: 0,
          duration: 1.1,
          ease: "expo.out",
          scrollTrigger: { trigger: j, start: "top 85%" },
        });
        if (i === items.length - 1) return;
        const st = { trigger: items[i + 1], start: "top bottom", end: "top 30%", scrub: true };
        gsap.to(j.querySelector(".job-card"), { scale: 0.92, ease: "none", scrollTrigger: st });
        gsap.to(j.querySelector(".job-dim"), { opacity: 0.6, ease: "none", scrollTrigger: { ...st } });
      });
    }, list);
    return () => ctx.revert();
  }, []);

  return (
    <div className="jobs" id="jobs" ref={ref}>
      {jobs.map((j, i) => (
        <article className="job" style={{ "--i": i } as React.CSSProperties} key={`${j.company}-${j.from}`}>
          <div className="job-card">
            <p className="job-when">
              {j.from}
              <span className="to">{j.to}</span>
            </p>
            <div className="job-what">
              <h3>{j.role}</h3>
              <p className="job-co">
                {j.url ? (
                  <a href={j.url} target="_blank" rel="noopener">
                    {j.company}
                  </a>
                ) : (
                  j.company
                )}
                {j.current ? (
                  <>
                    {" "}
                    <span className="live">{currentBadge}</span>
                  </>
                ) : null}
              </p>
              {j.description ? <p className="job-desc">{j.description}</p> : null}
            </div>
            <span className="job-dim" aria-hidden="true" />
          </div>
        </article>
      ))}
    </div>
  );
}
