"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { fontsReady, prefersReducedMotion, store } from "@/lib/store";

/*
  The Arabic name writes itself in with a 000 to 100 counter, then the curtain lifts
  and the hero, nav and hint come in. Without motion the intro never shows (CSS keys
  it off html.motion, set by an inline script before first paint).
*/
export default function Intro({ name }: { name: string }) {
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
    store.lenis?.stop();
    const nav = document.getElementById("nav");
    const hint = document.getElementById("hero-hint");
    const heroChars = gsap.utils.toArray<HTMLElement>(".hero-title .ch");
    const dataIn = gsap.utils.toArray<HTMLElement>("[data-in]");
    const ar = intro.querySelector<HTMLElement>(".intro-ar");
    const countEl = intro.querySelector<HTMLElement>(".intro-count");
    const fade = [nav, hint].filter(Boolean) as HTMLElement[];

    const ctx = gsap.context(() => {
      gsap.set(heroChars, { yPercent: 118 });
      gsap.set(dataIn, { y: 28, opacity: 0 });
      gsap.set(fade, { opacity: 0 });
    });
    const release = () => {
      store.go = true;
      store.introActive = false;
      store.lenis?.start();
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
      const cnt = { v: 0 };
      ctx.add(() => {
        gsap
          .timeline({
            defaults: { ease: "expo.out" },
            onComplete() {
              store.kineticOn = true;
            },
          })
          .to(ar, { clipPath: "inset(-30% -10% -30% -10%)", duration: 1, ease: "power2.inOut" }, 0)
          .to(
            cnt,
            {
              v: 100,
              duration: 1,
              ease: "power2.inOut",
              onUpdate() {
                if (countEl) countEl.textContent = String(Math.round(cnt.v)).padStart(3, "0");
              },
            },
            0,
          )
          .to(ar, { scale: 1.08, opacity: 0, filter: "blur(6px)", duration: 0.55, ease: "power3.in" }, 1.05)
          .add(release, 1.15)
          .fromTo(
            intro,
            { clipPath: "inset(0% 0% 0% 0%)" },
            { clipPath: "inset(0% 0% 100% 0%)", duration: 0.8, ease: "expo.inOut", onComplete: finish },
            1.1,
          )
          .to(nav ?? {}, { opacity: 1, duration: 0.8 }, 1.6)
          .to(heroChars, { yPercent: 0, duration: 1.2, stagger: 0.035 }, 1.9)
          .to(dataIn, { opacity: 1, y: 0, duration: 1, stagger: 0.1 }, 2.3)
          .to(hint ?? {}, { opacity: 1, duration: 0.8 }, 2.8);
      });
    });

    return () => {
      alive = false;
      clearTimeout(failsafe);
      ctx.revert();
      store.introActive = false;
      store.lenis?.start();
    };
  }, []);

  if (gone) return null;
  return (
    <div className="intro" ref={introRef} aria-hidden="true">
      <p className="intro-ar" lang="ar" dir="rtl">
        {name}
      </p>
      <span className="intro-count">000</span>
    </div>
  );
}
