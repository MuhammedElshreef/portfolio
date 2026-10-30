"use client";

import { useEffect } from "react";
import { ScrollTrigger } from "@/lib/gsap";
import { clamp, compactSkills, prefersReducedMotion, store } from "@/lib/store";

/*
  Native scrolling: in-page links glide to their section, the nav's scrolled and hide
  states, and the particle sky's stage and opacity read from the scroll position.
  Rendered last in the page so its effect runs after every other leaf has made its
  ScrollTriggers; it then sorts them into page order and refreshes once.
*/
const smooth = (a: number, b: number, x: number) => {
  const t = clamp((x - a) / (b - a), 0, 1);
  return t * t * (3 - 2 * t);
};

export default function SmoothScroll() {
  useEffect(() => {
    const RM = prefersReducedMotion();
    const nav = document.getElementById("nav");

    // A pinned section is position: fixed while pinned, so measure its pin spacer instead
    const docTop = (sel: string) => {
      let el = document.querySelector<HTMLElement>(sel);
      if (el?.parentElement?.classList.contains("pin-spacer")) el = el.parentElement;
      return el ? el.getBoundingClientRect().top + window.scrollY : null;
    };

    // ---------- In-page links ----------
    const goTo = (top: number) => window.scrollTo({ top: Math.max(0, top), behavior: RM ? "auto" : "smooth" });
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
      const top = id && id.length > 1 ? docTop(id) : null;
      if (top === null) return;
      e.preventDefault();
      goTo(top);
    };
    document.addEventListener("click", onClick);

    // ---------- Particle stage and opacity from scroll (read by the particle sky) ----------
    // Stage 0 night sky -> 1 code glyph at the statement -> 2 globe at the skills sphere.
    // The sky shows behind the hero and statement, and behind the skills sphere on
    // desktop; everywhere else it fades to 0 and the sky stops its loop. The sky itself
    // dims further as the sphere settles (store.skillsFlat), since that is scrubbed.
    let marks: { start: number; span: number }[] = [];
    let fades = { outA: 0, outB: 0, inA: 0, inB: 0, out2A: 0, out2B: 0 };
    let compact = compactSkills();
    function computeAnchors() {
      const H = innerHeight;
      compact = compactSkills();
      const statement = docTop("#statement") ?? H;
      const work = docTop("#work") ?? statement + H;
      const skills = docTop("#skills") ?? work + H;
      const after = docTop("#about") ?? skills + H;
      const ends = compact ? [statement - H * 0.2] : [statement - H * 0.2, skills + H * 0.05];
      marks = ends.map((end, i) => {
        const start = Math.max(i === 0 ? H * 0.12 : 0, end - H * 0.9);
        return { start, span: Math.max(1, end - start) };
      });
      fades = {
        outA: work - H * 0.75,
        outB: work - H * 0.2,
        inA: skills - H * 0.6,
        inB: skills - H * 0.05,
        out2A: after - H * 0.7,
        out2B: after - H * 0.2,
      };
      update();
    }
    const stageFor = (s: number) => marks.reduce((acc, m) => acc + clamp((s - m.start) / m.span, 0, 1), 0);
    function alphaFor(s: number) {
      const top = 1 - smooth(fades.outA, fades.outB, s);
      if (compact) return top;
      return Math.max(top, smooth(fades.inA, fades.inB, s) * (1 - smooth(fades.out2A, fades.out2B, s)));
    }

    let lastS = window.scrollY,
      travel = 0;
    function update() {
      const s = window.scrollY;
      if (marks.length) {
        store.stage = stageFor(s);
        store.alpha = alphaFor(s);
        if (store.alpha > 0) store.skyWake?.();
      }
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
    addEventListener("scroll", update, { passive: true });
    addEventListener("resize", computeAnchors);
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
    computeAnchors();

    return () => {
      mounted = false;
      document.removeEventListener("click", onClick);
      removeEventListener("scroll", update);
      removeEventListener("resize", computeAnchors);
      removeEventListener("load", refresh);
      cancelAnimationFrame(refreshRaf);
      ScrollTrigger.removeEventListener("refresh", computeAnchors);
      nav?.classList.remove("scrolled", "hide");
    };
  }, []);

  return null;
}
