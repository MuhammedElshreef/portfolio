"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import type { ProjectLink } from "@/lib/content";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion, store } from "@/lib/store";
import Terminal, { type TerminalLabels } from "./Terminal";

export type DetailProject = {
  slug: string;
  title: string;
  kind?: string;
  description: string;
  techs: string[];
  links: ProjectLink[];
  soon?: boolean;
};

type Labels = { close: string; noLink: string; soonNote: string; terminal: TerminalLabels };

// Keeps Tab and assistive tech out of the page behind the dialog
const setBackdropInert = (on: boolean) => {
  document.querySelector<HTMLElement>("main")?.toggleAttribute("inert", on);
  document.getElementById("nav")?.toggleAttribute("inert", on);
};

const cardOf = (i: number) => document.querySelector<HTMLElement>(`.tcard[data-i="${i}"]`);
const moving = (on: boolean) => document.getElementById("detail")?.classList.toggle("is-moving", on);
// Opened from the command palette, the card can be far off screen: then there is nothing to fly from
const onScreen = (el: Element) => {
  const r = el.getBoundingClientRect();
  return r.bottom > 0 && r.top < innerHeight && r.right > 0 && r.left < innerWidth;
};

// Where a terminal sits and how its corners are cut, as values the ghost frame can take
const box = (el: Element) => {
  const r = el.getBoundingClientRect();
  const cs = getComputedStyle(el);
  return {
    left: r.left,
    top: r.top,
    width: r.width,
    height: r.height,
    "--t": cs.getPropertyValue("--t").trim(),
    "--k": cs.getPropertyValue("--k").trim(),
  };
};

/*
  Project detail view. The card and the detail terminal have different proportions and
  different text layouts, so one is never stretched into the other. An empty terminal
  frame (the ghost) travels between them, sized in real pixels: it fades in over the
  card, grows to where the detail terminal sits, and the detail terminal fades in on top.
  Closing runs the same steps backwards. Opened by the track through store.openDetail.
*/
export default function ProjectDetail({ projects, labels }: { projects: DetailProject[]; labels: Labels }) {
  const [idx, setIdx] = useState(-1);
  const mediaRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const scrimRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const ghostRef = useRef<HTMLSpanElement>(null);
  const flight = useRef<gsap.core.Timeline | null>(null);
  const openIdx = useRef(-1);
  const lastFocus = useRef<HTMLElement | null>(null);
  const closing = useRef(false);

  const close = useCallback(() => {
    const dMedia = mediaRef.current,
      dScrim = scrimRef.current,
      dBody = bodyRef.current,
      dClose = closeRef.current,
      ghost = ghostRef.current;
    if (!store.detailOpen || closing.current || !dMedia || !dScrim || !dBody || !dClose || !ghost) return;
    const card = cardOf(openIdx.current);
    const parts = [dMedia, dScrim, ...Array.from(dBody.children), dClose, ghost];
    // A pending delayed open tween must not re-show anything during the close
    gsap.killTweensOf([...Array.from(dBody.children), dClose]);
    const midFlight = !!flight.current?.isActive();
    flight.current?.kill();
    const done = () => {
      closing.current = false;
      store.detailOpen = false;
      openIdx.current = -1;
      flight.current = null;
      document.documentElement.classList.remove("modal-open");
      moving(false);
      setBackdropInert(false);
      card?.classList.remove("is-open");
      // Hide the panel before the tween styles are cleared. Cleared while it is still
      // shown, the scrim and the terminal go back to full strength for one frame.
      flushSync(() => setIdx(-1));
      gsap.set(parts, { clearProps: "all" });
      lastFocus.current?.focus?.({ preventScroll: true });
    };
    if (prefersReducedMotion()) {
      done();
      return;
    }
    closing.current = true;
    moving(true);
    gsap.to(dBody.children, { y: 20, opacity: 0, duration: 0.3, stagger: 0.03 });
    gsap.to(dClose, { opacity: 0, duration: 0.2 });
    gsap.to(dScrim, { opacity: 0, duration: 0.6, delay: 0.25 });
    const cardTerm = card?.querySelector<HTMLElement>(".term");
    const bigTerm = dMedia.querySelector<HTMLElement>(".term");
    if (!cardTerm || !bigTerm || !(midFlight || card?.classList.contains("is-open")) || !onScreen(cardTerm)) {
      gsap.to(dMedia, { opacity: 0, duration: 0.3, onComplete: done });
      return;
    }
    // Closed while still opening: the ghost carries on from wherever it is
    if (!midFlight) gsap.set(ghost, { display: "flex", opacity: 1, ...box(bigTerm) });
    flight.current = gsap
      .timeline({ onComplete: done })
      // The detail terminal fades away over the ghost, which sits right behind it
      .to(dMedia, { opacity: 0, duration: 0.16, ease: "none" }, 0)
      .to(ghost, { ...box(cardTerm), duration: 0.7, ease: "expo.inOut" }, 0.06)
      // The ghost has landed on the card: bring the card back under it, then let go
      .add(() => card?.classList.remove("is-open"))
      .to(ghost, { opacity: 0, duration: 0.22, ease: "power1.out" });
  }, []);

  useEffect(() => {
    const animated = [mediaRef.current, scrimRef.current, closeRef.current, ghostRef.current].filter(Boolean);
    store.openDetail = (i: number) => {
      if (i < 0 || i >= projects.length || store.detailOpen) return;
      store.detailOpen = true;
      openIdx.current = i;
      lastFocus.current = document.activeElement as HTMLElement | null;
      store.bubble?.hide();
      setIdx(i);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      store.openDetail = null;
      store.detailOpen = false;
      document.documentElement.classList.remove("modal-open");
      setBackdropInert(false);
      flight.current?.kill();
      gsap.killTweensOf(animated);
      document.querySelector(".tcard.is-open")?.classList.remove("is-open");
    };
  }, [projects.length, close]);

  // Runs once the panel is visible, so both terminals can be measured
  useLayoutEffect(() => {
    if (idx < 0) return;
    const dMedia = mediaRef.current,
      dBody = bodyRef.current,
      dScrim = scrimRef.current,
      dClose = closeRef.current,
      ghost = ghostRef.current;
    if (!dMedia || !dBody || !dScrim || !dClose || !ghost) return;
    const card = cardOf(idx);
    document.documentElement.classList.add("modal-open");
    setBackdropInert(true);
    if (!prefersReducedMotion()) {
      const cardTerm = card?.querySelector<HTMLElement>(".term");
      const bigTerm = dMedia.querySelector<HTMLElement>(".term");
      moving(true);
      gsap.fromTo(dScrim, { opacity: 0 }, { opacity: 1, duration: 0.6, ease: "power2.out" });
      if (card && cardTerm && bigTerm && onScreen(cardTerm)) {
        gsap.set(ghost, { display: "flex", opacity: 0, ...box(cardTerm) });
        gsap.set(dMedia, { opacity: 0 });
        flight.current = gsap
          .timeline()
          // The ghost fades in over the card, then the card steps aside
          .to(ghost, { opacity: 1, duration: 0.18, ease: "none" }, 0)
          .add(() => card.classList.add("is-open"), 0.18)
          .to(ghost, { ...box(bigTerm), duration: 0.8, ease: "expo.inOut" }, 0.06)
          // It has arrived: the real terminal fades in on top of it
          .to(dMedia, { opacity: 1, duration: 0.3, ease: "power1.out" }, 0.82)
          .set(ghost, { display: "none" }, 1.14);
      } else {
        gsap.fromTo(dMedia, { opacity: 0 }, { opacity: 1, duration: 0.5, ease: "power1.out" });
      }
      gsap.fromTo(
        dBody.children,
        { y: 34, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9, ease: "expo.out", stagger: 0.07, delay: 0.5 },
      );
      gsap.fromTo(dClose, { opacity: 0, y: -10 }, { opacity: 1, y: 0, duration: 0.5, delay: 0.7 });
      // The text finishes rising at about 1.6s; the panel may scroll again after that
      gsap.delayedCall(1.65, () => {
        if (!closing.current) moving(false);
      });
    }
    dClose.focus({ preventScroll: true });
  }, [idx]);

  const p = idx >= 0 ? projects[idx] : null;
  return (
    <div
      className="detail"
      id="detail"
      hidden={idx < 0}
      role="dialog"
      aria-modal="true"
      aria-labelledby="detail-title"
    >
      <div className="detail-scrim" id="detail-scrim" ref={scrimRef} onClick={close} />
      <span className="term detail-ghost" ref={ghostRef} aria-hidden="true">
        <span className="term-in">
          <span className="term-tab" />
          <span className="term-body" />
        </span>
      </span>
      <button type="button" className="btn btn-ghost btn-sm detail-close" id="detail-close" ref={closeRef} onClick={close}>
        {labels.close}
      </button>
      <div className="detail-panel wrap">
        <div className="detail-media" id="detail-media" ref={mediaRef} aria-hidden="true">
          {p && <Terminal project={{ ...p, live: p.links.length > 0 }} index={idx} labels={labels.terminal} big />}
        </div>
        <div className="detail-body" id="detail-body" ref={bodyRef}>
          {p && (
            <>
              <h3 id="detail-title">{p.title}</h3>
              <p>{p.description}</p>
              <div className="chips">
                {p.techs.map((t) => (
                  <span className="chip" key={t}>
                    {t}
                  </span>
                ))}
              </div>
              {p.links.length ? (
                <div className="dlinks">
                  {p.links.map((l, j) => (
                    <a className={`btn ${j ? "btn-ghost" : "btn-acc"} btn-sm`} href={l.url} target="_blank" rel="noopener" key={l.url}>
                      {l.title} {"↗"}
                    </a>
                  ))}
                </div>
              ) : (
                <p className="nolink">{p.soon ? labels.soonNote : labels.noLink}</p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
