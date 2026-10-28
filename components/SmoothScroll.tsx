"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { clamp, prefersReducedMotion, store } from "@/lib/store";

/*
  Lenis smooth scroll wired to the GSAP ticker and ScrollTrigger, in-page links,
  the nav's scrolled and hide states, and the particle stage read from scroll.
  Rendered last in the page so its effect runs after every other leaf has made its
  ScrollTriggers; it then sorts them into page order and refreshes once.
*/
export default function SmoothScroll() {
  useEffect(() => {
    const RM = prefersReducedMotion();
    const MOTION = !RM;
    const root = document.documentElement;
    const nav = document.getElementById("nav");
    const ctx = gsap.context(() => {});

    // ---------- Smooth scroll ----------
    let lenis: Lenis | null = null;
    const raf = (t: number) => lenis?.raf(t * 1000);
    if (MOTION) {
      lenis = new Lenis({ lerp: 0.09, smoothWheel: true });
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add(raf);
      gsap.ticker.lagSmoothing(0);
      store.lenis = lenis;
      if (store.introActive || store.detailOpen) lenis.stop();
    }
    const scrollPos = () => (lenis ? lenis.scroll : window.scrollY);
    const goTo = (t: HTMLElement | 0) => {
      if (lenis) lenis.scrollTo(t, { duration: 1.6 });
      else if (t === 0) scrollTo({ top: 0, behavior: RM ? "auto" : "smooth" });
      else t.scrollIntoView({ behavior: RM ? "auto" : "smooth" });
    };
    const onClick = (e: MouseEvent) => {
      const el = e.target as Element | null;
      if (!el || !el.closest) return;
      if (el.closest("#foot-top")) {
        goTo(0);
        return;
      }
      const a = el.closest<HTMLAnchorElement>("a[data-scroll]");
      if (!a) return;
      const id = a.getAttribute("href");
      const t = id && id.length > 1 ? document.querySelector<HTMLElement>(id) : null;
      if (!t) return;
      e.preventDefault();
      goTo(t);
    };
    document.addEventListener("click", onClick);

    // ---------- Particle stage from scroll (read by the particle sky) ----------
    let marks: { start: number; span: number }[] = [];
    function computeAnchors() {
      const H = innerHeight,
        sc = scrollPos();
      // A pinned section is position: fixed, so measure its pin spacer instead
      const top = (sel: string) => {
        let el = document.querySelector(sel);
        if (el && el.parentElement?.classList.contains("pin-spacer")) el = el.parentElement;
        return el ? el.getBoundingClientRect().top + sc : 0;
      };
      const ends = [top("#statement") - H * 0.2, top("#skills") + H * 0.05, top("#contact") - H * 0.25];
      marks = ends.map((end, i) => {
        const start = Math.max(i === 0 ? H * 0.12 : 0, end - H * 0.9);
        return { start, span: Math.max(1, end - start) };
      });
    }
    const stageFor = (s: number) => marks.reduce((acc, m) => acc + clamp((s - m.start) / m.span, 0, 1), 0);
    const narrow = matchMedia("(max-width: 760px)");
    let lastS = 0,
      travel = 0;
    function frame() {
      const s = scrollPos();
      if (marks.length) store.stage = stageFor(s);
      // On narrow screens the ring fills the view, so the sky steps further back behind it
      store.alpha = (store.workOn ? (narrow.matches ? 0.1 : 0.26) : store.aboutOn ? 0.5 : 1) * (1 - 0.55 * store.skillsFlat);
      if (nav) {
        nav.classList.toggle("scrolled", s > 30);
        // Accumulate distance in one direction so slow scrolling still counts
        const d = s - lastS;
        if (d !== 0) {
          travel = Math.sign(d) === Math.sign(travel) ? travel + d : d;
          if (travel > 40 && s > 320) nav.classList.add("hide");
          else if (travel < -12) nav.classList.remove("hide");
        }
      }
      lastS = s;
    }
    gsap.ticker.add(frame);
    computeAnchors();
    addEventListener("resize", computeAnchors);

    ctx.add(() => {
      ScrollTrigger.create({
        trigger: "#about",
        start: "top 60%",
        endTrigger: "#experience",
        end: "bottom 40%",
        onToggle: (self) => {
          store.aboutOn = self.isActive;
        },
      });
    });
    ScrollTrigger.addEventListener("refresh", computeAnchors);
    const refresh = () => ScrollTrigger.refresh();
    // Web fonts change the layout height: re-measure once they are in
    let mounted = true;
    document.fonts?.ready.then(() => {
      if (mounted) ScrollTrigger.refresh();
    });
    let refreshRaf = 0;
    if (document.readyState === "complete") refreshRaf = requestAnimationFrame(refresh);
    else addEventListener("load", refresh);
    // Every leaf has registered its triggers by now: refresh them in page order
    ScrollTrigger.sort();
    ScrollTrigger.refresh();

    return () => {
      mounted = false;
      document.removeEventListener("click", onClick);
      removeEventListener("resize", computeAnchors);
      removeEventListener("load", refresh);
      cancelAnimationFrame(refreshRaf);
      ScrollTrigger.removeEventListener("refresh", computeAnchors);
      gsap.ticker.remove(frame);
      gsap.ticker.remove(raf);
      gsap.ticker.lagSmoothing(500, 33);
      ctx.revert();
      if (lenis) {
        lenis.destroy();
        if (store.lenis === lenis) store.lenis = null;
      }
      nav?.classList.remove("scrolled", "hide");
      root.classList.remove("lenis", "lenis-smooth", "lenis-stopped");
    };
  }, []);

  return null;
}
