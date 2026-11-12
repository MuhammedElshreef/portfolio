"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { ScrollTrigger } from "@/lib/gsap";
import { clamp, finePointer, fontsReady, onViewportResize, prefersReducedMotion, store } from "@/lib/store";
import Terminal, { type TerminalLabels, type TerminalProject } from "./Terminal";

type Labels = { open: string; terminal: TerminalLabels };

const pad = (n: number) => String(n).padStart(2, "0");

/*
  Projects as a horizontal track. On wide screens the section holds still (CSS sticky)
  while scrolling down slides the cards sideways. The track follows the scroll position
  on a soft spring, so separate wheel notches blend into one glide, and the spring is
  stepped by real time, so it feels the same on a 60Hz and a 144Hz screen. Only the
  track's transform changes while it moves. Each card is a terminal whose command
  types itself out the first time it comes into view. Narrow screens, touch and reduced
  motion get a plain swipe row that snaps to each card. Clicking a card opens the detail view.
*/
export default function ProjectTrack({
  projects,
  labels,
  children,
}: {
  projects: TerminalProject[];
  labels: Labels;
  children: ReactNode;
}) {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const stick = section.querySelector<HTMLElement>(".track-stick")!;
    const track = section.querySelector<HTMLElement>(".track")!;
    const cards = Array.from(section.querySelectorAll<HTMLButtonElement>(".tcard"));
    const num = section.querySelector<HTMLElement>(".track-n")!;
    const bar = section.querySelector<HTMLElement>(".track-bar")!;
    const RM = prefersReducedMotion();
    const wide = matchMedia("(min-width: 900px) and (hover: hover) and (pointer: fine)");
    let alive = true;
    const offs: (() => void)[] = [];
    const listen = <T extends EventTarget>(t: T, type: string, fn: EventListener, opts?: AddEventListenerOptions) => {
      t.addEventListener(type, fn, opts);
      offs.push(() => t.removeEventListener(type, fn, opts));
    };

    // The command types itself out the first time a card comes into view
    let seenIO: IntersectionObserver | null = null;
    if (!RM && "IntersectionObserver" in window) {
      seenIO = new IntersectionObserver(
        (entries) =>
          entries.forEach((e) => {
            if (!e.isIntersecting) return;
            e.target.classList.add("is-seen");
            seenIO?.unobserve(e.target);
          }),
        { threshold: 0.35 },
      );
      cards.forEach((c) => seenIO!.observe(c));
    } else cards.forEach((c) => c.classList.add("is-seen"));

    // Written only when the value changes: a text write every frame costs a layout
    let barP = -1,
      numN = 0;
    const setProgress = (p: number) => {
      if (Math.abs(p - barP) > 0.0004) {
        barP = p;
        bar.style.transform = `scaleX(${p.toFixed(4)})`;
      }
      const n = Math.min(cards.length, 1 + Math.round(p * (cards.length - 1)));
      if (n !== numN) {
        numN = n;
        num.textContent = pad(n);
      }
    };

    // ---------- Wide screens: vertical scroll drives the track ----------
    // GLIDE is roughly how long, in seconds, the track takes to catch up with the scroll
    const GLIDE = 0.22;
    let on = false,
      dist = 0,
      room = 1,
      top0 = 0,
      x = -1,
      vel = 0,
      last = 0,
      raf = 0,
      centres: number[] = [];
    function tick(now: number) {
      raf = 0;
      if (!on) return;
      const target = clamp((window.scrollY - top0) / room, 0, 1) * dist;
      if (x < 0) {
        x = target;
        vel = 0;
      } else {
        // A critically damped spring: it speeds up and slows down gradually and never overshoots
        const dt = clamp((now - last) / 1000, 0.001, 0.05);
        const w = 2 / GLIDE,
          k = w * dt,
          decay = 1 / (1 + k + 0.48 * k * k + 0.235 * k * k * k),
          gap = x - target,
          push = (vel + w * gap) * dt;
        vel = (vel - w * push) * decay;
        x = target + (gap + push) * decay;
        if (Math.abs(target - x) < 0.1 && Math.abs(vel) < 2) {
          x = target;
          vel = 0;
        }
      }
      last = now;
      track.style.transform = `translate3d(${(-x).toFixed(2)}px,0,0)`;
      setProgress(dist ? x / dist : 0);
      if (x !== target) raf = requestAnimationFrame(tick);
    }
    const kick = () => {
      if (!on || raf) return;
      last = performance.now();
      raf = requestAnimationFrame(tick);
    };
    function setup() {
      on = !RM && wide.matches;
      section!.classList.toggle("track-on", on);
      cancelAnimationFrame(raf);
      raf = 0;
      if (!on) {
        section!.style.height = "";
        track.style.transform = "";
        onSwipe();
      } else {
        dist = Math.max(0, track.offsetWidth - stick.clientWidth);
        section!.style.height = `${stick.offsetHeight + dist}px`;
        room = Math.max(1, section!.offsetHeight - stick.offsetHeight);
        centres = cards.map((c) => c.offsetLeft + c.offsetWidth / 2);
        top0 = section!.getBoundingClientRect().top + window.scrollY;
        x = -1;
        tick(performance.now());
      }
      // The sections below move when this one changes height
      ScrollTrigger.refresh();
    }
    // A focused card off to the side: scroll the page to where the track shows it
    function onFocus(e: Event) {
      if (!on) return;
      const c = (e.target as Element).closest<HTMLElement>(".tcard");
      if (!c) return;
      stick.scrollLeft = 0;
      const r = c.getBoundingClientRect();
      if (r.left >= 0 && r.right <= stick.clientWidth) return;
      const i = cards.indexOf(c as HTMLButtonElement);
      const want = clamp((centres[i] - stick.clientWidth / 2) / (dist || 1), 0, 1);
      window.scrollTo({ top: top0 + want * room, behavior: RM ? "auto" : "smooth" });
    }

    // ---------- Narrow screens: a native swipe row ----------
    function onSwipe() {
      if (on) return;
      const max = track.scrollWidth - track.clientWidth;
      setProgress(max > 0 ? clamp(track.scrollLeft / max, 0, 1) : 0);
    }

    let rz = 0;
    const onResize = () => {
      clearTimeout(rz);
      rz = window.setTimeout(setup, 160);
    };
    listen(window, "scroll", kick, { passive: true });
    offs.push(onViewportResize(onResize));
    listen(wide, "change", setup);
    listen(track, "scroll", onSwipe, { passive: true });
    listen(track, "focusin", onFocus);

    // ---------- Cards: open the detail view, "View" bubble on a fine pointer ----------
    cards.forEach((c, i) => {
      listen(c, "click", () => store.openDetail?.(i));
      if (finePointer()) {
        listen(c, "pointerenter", () => store.bubble?.show());
        listen(c, "pointerleave", () => store.bubble?.hide());
        listen(c, "pointerdown", () => store.bubble?.press());
      }
    });

    // Content above can shift after a refresh (fonts, the intro); keep the start point true
    const remeasure = () => {
      if (on) top0 = section.getBoundingClientRect().top + window.scrollY;
    };
    ScrollTrigger.addEventListener("refresh", remeasure);
    offs.push(() => ScrollTrigger.removeEventListener("refresh", remeasure));

    setup();
    fontsReady().then(() => {
      if (alive) setup();
    });

    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      clearTimeout(rz);
      offs.forEach((f) => f());
      section.classList.remove("track-on");
      section.style.height = "";
      track.style.transform = "";
      seenIO?.disconnect();
    };
  }, [projects]);

  return (
    <section id="work" className="work" aria-labelledby="work-title" ref={sectionRef}>
      <div className="track-stick">
        {children}
        <ul className="track" role="list">
          {projects.map((p, i) => (
            <li className="tcard-li" key={p.slug}>
              <button type="button" className="tcard" data-i={i} aria-label={`${labels.open} ${p.title}`}>
                <Terminal project={p} index={i} labels={labels.terminal} maxTechs={3} />
              </button>
            </li>
          ))}
        </ul>
        <div className="wrap track-prog" aria-hidden="true">
          <b className="track-n">01</b>
          <span className="track-line">
            <i className="track-bar" />
          </span>
          <span>{pad(projects.length)}</span>
        </div>
      </div>
    </section>
  );
}
