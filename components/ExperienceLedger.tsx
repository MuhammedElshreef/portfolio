"use client";

import { useEffect, useRef, useSyncExternalStore, type CSSProperties } from "react";
import { prefersReducedMotion } from "@/lib/store";

export type LedgerRow = {
  role: string;
  company: string;
  url?: string;
  color: string;
  from: string;
  to: string;
  current?: boolean;
  description?: string;
};

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** "May 2026" -> 2026 * 12 + 4; a bare year has no month, so it gives null */
function monthIndex(s: string) {
  const m = /^([A-Za-z]{3})\w*\s+(\d{4})$/.exec(s.trim());
  if (!m) return null;
  const mi = MONTHS.indexOf(m[1]);
  return mi < 0 ? null : Number(m[2]) * 12 + mi;
}
const yearOf = (s: string) => /\d{4}/.exec(s)?.[0] ?? s;

function duration(n: number) {
  if (n < 12) return `${n} ${n === 1 ? "month" : "months"}`;
  const y = Math.floor(n / 12),
    m = n % 12;
  return `${y} ${y === 1 ? "yr" : "yrs"}${m ? ` ${m} mo` : ""}`;
}

// The current month, read on the client only, so the server never bakes in a stale count
const noop = () => () => {};
const thisMonth = () => {
  const d = new Date();
  return d.getFullYear() * 12 + d.getMonth();
};

const arrow = (
  <svg viewBox="0 0 12 12" aria-hidden="true">
    <path d="M3 9 9 3M4 3h5v5" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
);

/*
  Experience as ledger rows: a large year range, the dates and time in the role, the
  role and company (linked to its website), and a line in the company colour. Rows
  rise in as they enter. Current roles end in an outlined "Now" and an open-ended line.
*/
export default function ExperienceLedger({ rows, nowLabel }: { rows: LedgerRow[]; nowLabel: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const today = useSyncExternalStore(noop, thisMonth, () => null);

  useEffect(() => {
    const list = ref.current;
    if (!list) return;
    const items = Array.from(list.querySelectorAll<HTMLElement>(".lrow"));
    if (prefersReducedMotion() || !("IntersectionObserver" in window)) {
      items.forEach((r) => r.classList.add("seen"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          e.target.classList.add("seen");
          io.unobserve(e.target);
        }),
      { threshold: 0.3 },
    );
    items.forEach((r) => io.observe(r));
    return () => io.disconnect();
  }, []);

  return (
    <div className="ledger" ref={ref}>
      {rows.map((r) => {
        const ongoing = !!r.current;
        const y0 = yearOf(r.from),
          y1 = yearOf(r.to);
        const s = monthIndex(r.from),
          e = ongoing ? today : monthIndex(r.to);
        const n = s !== null && e !== null && e >= s ? e - s + 1 : 0;
        const domain = r.url?.replace(/^https?:\/\//, "").replace(/\/$/, "");
        return (
          <article
            className={`lrow${ongoing ? " is-open" : ""}`}
            style={{ "--c": r.color } as CSSProperties}
            key={`${r.company}-${r.from}`}
          >
            <div className="lrow-when lrise">
              <p className="lrow-yr">
                {y0}
                {ongoing ? (
                  <>
                    <span className="lrow-dash">-</span>
                    <span className="lrow-now">{nowLabel}</span>
                  </>
                ) : y1 !== y0 ? (
                  <>
                    <span className="lrow-dash">-</span>
                    {y1}
                  </>
                ) : null}
              </p>
              <p className="lrow-dates">
                {r.from} - {r.to}
                {n ? (
                  <>
                    {" · "}
                    <b>{duration(n)}</b>
                  </>
                ) : null}
              </p>
            </div>
            <div className="lrow-role lrise">
              <h3>{r.role}</h3>
              <p className="lrow-co">
                <i aria-hidden="true" />
                {r.url ? (
                  <>
                    <a href={r.url} target="_blank" rel="noopener">
                      {r.company}
                      {arrow}
                    </a>
                    <span className="lrow-dom">{domain}</span>
                  </>
                ) : (
                  r.company
                )}
              </p>
            </div>
            {r.description ? <p className="lrow-desc lrise">{r.description}</p> : null}
            <span className="lrow-rule" aria-hidden="true" />
          </article>
        );
      })}
    </div>
  );
}
