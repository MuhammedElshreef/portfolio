"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { fontsReady, lockScroll, prefersReducedMotion, store } from "@/lib/store";

// The mark in viewBox units: "<" spans x 44..78, "/" 98..124, ">" 144..178, centre 111
const VB = { x: 30, w: 162, mid: 111, ltInner: 78, brW: 34 };
const PATHS = { l: "M78 34 L44 70 L78 106", s: "M124 26 L98 114", r: "M144 34 L178 70 L144 106" } as const;
const KEYS = ["l", "s", "r"] as const;

/*
  The splash. Light flows through a glass "</>" in one stream and it glows; then the
  slash spins away, the brackets slide apart and the name rises between them; then the
  splash blurs away and the hero, nav and hint come in. Without motion the splash never
  shows (CSS keys it off html.motion, set by an inline script before first paint).
*/
export default function Intro({ name, role }: { name: string; role: string }) {
  const introRef = useRef<HTMLDivElement>(null);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const intro = introRef.current;
    if (!intro) return;
    if (prefersReducedMotion()) {
      store.go = true;
      store.kineticOn = true;
      return;
    }
    let alive = true;
    store.introActive = true;
    lockScroll(true);
    const nav = document.getElementById("nav");
    const hint = document.getElementById("hero-hint");
    const heroChars = gsap.utils.toArray<HTMLElement>(".hero-title .ch");
    const dataIn = gsap.utils.toArray<HTMLElement>("[data-in]");
    const fade = [nav, hint].filter(Boolean) as HTMLElement[];
    const q = <T extends Element = HTMLElement>(s: string) => intro.querySelector<T>(s)!;
    const qa = <T extends Element = HTMLElement>(s: string) => Array.from(intro.querySelectorAll<T>(s));
    const center = q(".intro-center"),
      stage = q(".intro-stage"),
      mark = q<SVGSVGElement>(".intro-mark"),
      nameEl = q(".intro-name"),
      roleEl = q(".intro-role"),
      head = q<SVGCircleElement>(".intro-head");
    const tubes = qa<SVGPathElement>(".intro-tube"),
      glass = qa<SVGPathElement>(".intro-glass"),
      words = qa(".intro-name i");
    const [gl, gs, gr] = KEYS.map((k) => q<SVGGElement>(`.intro-g-${k}`));

    const ctx = gsap.context(() => {
      gsap.set(heroChars, { yPercent: 118 });
      gsap.set(dataIn, { y: 28, opacity: 0 });
      gsap.set(fade, { opacity: 0 });
    });
    const release = () => {
      store.go = true;
      store.introActive = false;
      lockScroll(false);
      // The scrollbar gutter and fonts may have shifted layout during the intro
      requestAnimationFrame(() => {
        if (alive) ScrollTrigger.refresh();
      });
    };
    const finish = () => {
      if (alive) setGone(true);
    };
    const failsafe = setTimeout(() => {
      finish();
      release();
      store.kineticOn = true;
      gsap.set([...heroChars, ...dataIn, ...fade], { clearProps: "all" });
    }, 5000);

    fontsReady().then(() => {
      if (!alive) return;
      // The timeline is running, so the failsafe is no longer needed
      clearTimeout(failsafe);

      // One stream: the tubes fill one after another at a steady speed
      const lens = tubes.map((t) => t.getTotalLength()),
        total = lens.reduce((a, b) => a + b, 0);
      tubes.forEach((t, i) => {
        t.style.strokeDasharray = `${lens[i]} ${lens[i] + 20}`;
        t.style.strokeDashoffset = String(lens[i]);
      });
      const flow = { d: 0 };
      const renderFlow = () => {
        let before = 0,
          hi = 0,
          hp = 0;
        tubes.forEach((t, i) => {
          const p = Math.min(Math.max((flow.d - before) / lens[i], 0), 1);
          t.style.opacity = p > 0 ? "1" : "0";
          t.style.strokeDashoffset = String(lens[i] * (1 - p));
          if (flow.d >= before) {
            hi = i;
            hp = p;
          }
          before += lens[i];
        });
        const pt = tubes[hi].getPointAtLength(lens[hi] * hp);
        head.setAttribute("cx", String(pt.x));
        head.setAttribute("cy", String(pt.y));
      };

      // How far each bracket slides, in viewBox units, so the name fits between them
      const unit = VB.w / mark.getBoundingClientRect().width;
      const nameW = nameEl.getBoundingClientRect().width * unit;
      const off = Math.max(0, nameW / 2 + 14 - (VB.mid - VB.ltInner));
      // Phones: shrink the stage if the open brackets would not fit the screen
      const need = (nameW + 2 * (14 + VB.brW) + 16) / unit,
        room = intro.clientWidth * 0.92;
      if (need > room) gsap.set(stage, { scale: room / need });

      ctx.add(() => {
        // y: 0 so GSAP does not also keep the CSS start offset as pixels
        gsap.set(words, { y: 0, yPercent: 110 });
        gsap.set(gs, { transformOrigin: "50% 50%" });
        gsap
          .timeline({
            defaults: { ease: "expo.out" },
            onComplete() {
              store.kineticOn = true;
            },
          })
          .to(glass, { opacity: 1, duration: 0.4, ease: "sine.inOut" }, 0)
          .to(head, { opacity: 1, duration: 0.15, ease: "none" }, 0.3)
          .to(flow, { d: total, duration: 1.45, ease: "sine.inOut", onUpdate: renderFlow }, 0.32)
          .to(head, { opacity: 0, duration: 0.2, ease: "none" }, 1.62)
          .add(() => mark.classList.add("lit"), 1.75)
          .to(mark, { scale: 1.06, duration: 0.32, ease: "sine.inOut", yoyo: true, repeat: 1, transformOrigin: "50% 50%" }, 1.75)
          .to(gs, { rotation: 140, scale: 0, opacity: 0, duration: 0.5, ease: "power3.in" }, 2.1)
          .to(gl, { x: -off, duration: 1.15 }, 2.36)
          .to(gr, { x: off, duration: 1.15 }, 2.36)
          .to(words, { yPercent: 0, duration: 1, stagger: 0.1 }, 2.55)
          .to(roleEl, { opacity: 1, y: 0, duration: 0.8 }, 2.95)
          .to(center, { scale: 1.1, filter: "blur(10px)", duration: 0.9 }, 3.95)
          .to(intro, { opacity: 0, duration: 0.8, ease: "power2.inOut", onComplete: finish }, 3.95)
          .add(release, 4.05)
          .to(nav ?? {}, { opacity: 1, duration: 0.8 }, 4.3)
          .to(heroChars, { yPercent: 0, duration: 1.2, stagger: 0.035 }, 4.35)
          .to(dataIn, { opacity: 1, y: 0, duration: 1, stagger: 0.1 }, 4.75)
          .to(hint ?? {}, { opacity: 1, duration: 0.8 }, 5.2);
      });
    });

    return () => {
      alive = false;
      clearTimeout(failsafe);
      ctx.revert();
      store.introActive = false;
      lockScroll(false);
    };
  }, []);

  if (gone) return null;
  const [first, ...rest] = name.split(" ");
  return (
    <div className="intro" ref={introRef} aria-hidden="true">
      <div className="intro-center">
        <div className="intro-stage">
          <svg className="intro-mark" viewBox={`${VB.x} 16 ${VB.w} 108`}>
            <defs>
              <linearGradient id="intro-flow" gradientUnits="userSpaceOnUse" x1="40" x2="182" y1="0" y2="0">
                <stop offset="0" className="intro-s1" />
                <stop offset="1" className="intro-s2" />
              </linearGradient>
              <radialGradient id="intro-glow">
                <stop offset="0" className="intro-h1" />
                <stop offset="0.35" className="intro-h2" />
                <stop offset="1" className="intro-h3" />
              </radialGradient>
            </defs>
            {KEYS.map((k) => (
              <g className={`intro-g-${k}`} key={k}>
                <path className="intro-glass intro-glass-edge" d={PATHS[k]} />
                <path className="intro-glass intro-glass-core" d={PATHS[k]} />
                <g className="intro-flow">
                  <path className="intro-tube" d={PATHS[k]} />
                </g>
              </g>
            ))}
            <circle className="intro-head" r="10" />
          </svg>
          <p className="intro-name">
            <span className="w">
              <i>{first}</i>
            </span>
            {rest.length ? (
              <span className="w">
                <i>{rest.join(" ")}</i>
              </span>
            ) : null}
          </p>
        </div>
        <p className="intro-role">{role}</p>
      </div>
    </div>
  );
}
