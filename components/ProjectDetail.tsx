"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import type { ProjectLink } from "@/lib/content";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { prefersReducedMotion, store } from "@/lib/store";

export type DetailProject = { title: string; description: string; techs: string[]; links: ProjectLink[] };

type Labels = { close: string; noLink: string; previewSuffix: string };

// Keeps Tab and assistive tech out of the page behind the dialog
const setBackdropInert = (on: boolean) => {
  document.querySelector<HTMLElement>("main")?.toggleAttribute("inert", on);
  document.getElementById("nav")?.toggleAttribute("inert", on);
};

const cardImg = (i: number) => document.querySelector<HTMLImageElement>(`.pcard[data-i="${i}"] .pcard-img`);

/*
  Project detail view. The cover flies out of the ring card into place (FLIP) and
  flies back on close. Opened by the ring through store.openDetail.
*/
export default function ProjectDetail({ projects, labels }: { projects: DetailProject[]; labels: Labels }) {
  const [idx, setIdx] = useState(-1);
  const mediaRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const scrimRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const openIdx = useRef(-1);
  const lastFocus = useRef<HTMLElement | null>(null);
  const closing = useRef(false);

  const close = useCallback(() => {
    const dMedia = mediaRef.current,
      dScrim = scrimRef.current,
      dBody = bodyRef.current,
      dClose = closeRef.current;
    if (!store.detailOpen || closing.current || !dMedia || !dScrim || !dBody || !dClose) return;
    const parts = [dMedia, dScrim, ...Array.from(dBody.children), dClose];
    // A pending delayed open tween must not re-show text during the close
    gsap.killTweensOf([...Array.from(dBody.children), dClose]);
    const done = () => {
      closing.current = false;
      store.detailOpen = false;
      openIdx.current = -1;
      document.documentElement.classList.remove("modal-open");
      setBackdropInert(false);
      store.lenis?.start();
      ScrollTrigger.refresh();
      gsap.set(parts, { clearProps: "all" });
      setIdx(-1);
      lastFocus.current?.focus?.({ preventScroll: true });
    };
    if (prefersReducedMotion()) {
      done();
      return;
    }
    closing.current = true;
    const card = cardImg(openIdx.current);
    const to = dMedia.getBoundingClientRect();
    const from = card ? card.getBoundingClientRect() : to;
    gsap.to(dBody.children, { y: 20, opacity: 0, duration: 0.3, stagger: 0.03 });
    gsap.to(dClose, { opacity: 0, duration: 0.2 });
    gsap.to(dScrim, { opacity: 0, duration: 0.6, delay: 0.25 });
    gsap.to(dMedia, {
      x: from.left - to.left,
      y: from.top - to.top,
      scaleX: from.width / to.width,
      scaleY: from.height / to.height,
      duration: 0.85,
      ease: "expo.inOut",
      onComplete: done,
    });
  }, []);

  useEffect(() => {
    const animated = [mediaRef.current, scrimRef.current, closeRef.current].filter(Boolean);
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
      gsap.killTweensOf(animated);
    };
  }, [projects.length, close]);

  // Runs once the panel is visible, so the FLIP can measure both rects
  useLayoutEffect(() => {
    if (idx < 0) return;
    const dMedia = mediaRef.current,
      dImg = imgRef.current,
      dBody = bodyRef.current,
      dScrim = scrimRef.current,
      dClose = closeRef.current;
    if (!dMedia || !dImg || !dBody || !dScrim || !dClose) return;
    const card = cardImg(idx);
    dImg.src = store.covers[idx] || card?.src || "";
    document.documentElement.classList.add("modal-open");
    setBackdropInert(true);
    store.lenis?.stop();
    if (!prefersReducedMotion()) {
      const to = dMedia.getBoundingClientRect();
      const from = card ? card.getBoundingClientRect() : to;
      gsap.fromTo(
        dMedia,
        { x: from.left - to.left, y: from.top - to.top, scaleX: from.width / to.width, scaleY: from.height / to.height },
        { x: 0, y: 0, scaleX: 1, scaleY: 1, duration: 1, ease: "expo.inOut" },
      );
      gsap.fromTo(dScrim, { opacity: 0 }, { opacity: 1, duration: 0.6, ease: "power2.out" });
      gsap.fromTo(
        dBody.children,
        { y: 34, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9, ease: "expo.out", stagger: 0.07, delay: 0.5 },
      );
      gsap.fromTo(dClose, { opacity: 0, y: -10 }, { opacity: 1, y: 0, duration: 0.5, delay: 0.7 });
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
      data-lenis-prevent=""
    >
      <div className="detail-scrim" id="detail-scrim" ref={scrimRef} onClick={close} />
      <button type="button" className="btn btn-ghost btn-sm detail-close" id="detail-close" ref={closeRef} onClick={close}>
        {labels.close}
      </button>
      <div className="detail-panel wrap">
        <div className="detail-media" id="detail-media" ref={mediaRef}>
          {/* The cover is a canvas-generated data URL, so next/image does not apply */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="detail-img" id="detail-img" ref={imgRef} alt={p ? `${p.title} ${labels.previewSuffix}` : ""} />
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
                <p className="nolink">{labels.noLink}</p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
