"use client";

import { useEffect, useRef, type ReactNode } from "react";
import type { CoverMotif, ProjectLink } from "@/lib/content";
import { drawCover } from "@/lib/covers";
import { drag } from "@/lib/drag";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { finePointer, fontFamily, fontsReady, prefersReducedMotion, readPalette, store } from "@/lib/store";

export type RingProject = { title: string; techs: string[]; links: ProjectLink[]; cover?: CoverMotif };

type Labels = {
  ring: string;
  prev: string;
  next: string;
  index: string;
  techSeparator: string;
};

/*
  Pinned 3D ring of project cards with generated canvas covers. It turns on scroll
  and can be dragged or flung. The front project's title rises above the ring, the
  name index below it has an underline that slides and stretches with the ring, and
  clicking the front card opens the detail view.
*/
export default function ProjectRing({
  projects,
  labels,
  children,
}: {
  projects: RingProject[];
  labels: Labels;
  children: ReactNode;
}) {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const RM = prefersReducedMotion();
    const MOTION = !RM;
    const FINE = finePointer();
    const q = <T extends Element = HTMLElement>(s: string) => section.querySelector<T>(s)!;
    const qa = <T extends Element = HTMLElement>(s: string) => Array.from(section.querySelectorAll<T>(s));
    const ringStage = q("#ring-stage"),
      ringEl = q("#ring");
    const cards = qa<HTMLButtonElement>(".pcard");
    const cardImgs = cards.map((c) => c.querySelector<HTMLImageElement>(".pcard-img")!);
    const pindex = q("#pindex");
    const indexBtns = qa<HTMLButtonElement>("[data-go]");
    const ink = q("#pindex-ink");
    const nowTitle = q("#now-title"),
      nowTech = q("#now-tech");
    const N = cards.length,
      STEP = 360 / N;
    const imgSrc: string[] = projects.map(() => "");
    store.covers = imgSrc;
    let alive = true;
    const offs: (() => void)[] = [];
    function listen<K extends keyof HTMLElementEventMap>(
      t: HTMLElement | Document,
      type: K,
      fn: (e: HTMLElementEventMap[K]) => void,
      opts?: AddEventListenerOptions,
    ) {
      t.addEventListener(type, fn as EventListener, opts);
      offs.push(() => t.removeEventListener(type, fn as EventListener, opts));
    }
    const ctx = gsap.context(() => {}, section);

    // Covers are drawn from the live palette tokens once the fonts are in
    function drawCovers() {
      const pal = readPalette();
      const fonts = {
        display: `${fontFamily("--font-bricolage", '"Bricolage Grotesque"')}, sans-serif`,
        arab: `${fontFamily("--font-rakkas", '"Rakkas"')}, serif`,
        mono: `${fontFamily("--font-jetbrains", '"JetBrains Mono"')}, monospace`,
      };
      projects.forEach((p, i) => {
        imgSrc[i] = drawCover(p, 101 + i * 17, pal, fonts, labels.techSeparator);
        cardImgs[i].src = imgSrc[i];
      });
    }

    const ring = { drag: 0, scroll: 0, R: 0 };
    let active = 0;
    const total = () => ring.scroll + ring.drag;
    function layoutRing() {
      const w = cards[0].offsetWidth;
      ring.R = Math.round((w / 2 / Math.tan(Math.PI / N)) * 1.16);
      cards.forEach((c, i) => {
        c.style.transform = `rotateY(${i * STEP}deg) translateZ(${ring.R}px)`;
      });
      renderRing(true);
    }
    function renderRing(force?: boolean) {
      const a = total();
      ringEl.style.transform = `translateZ(${-ring.R}px) rotateY(${-a}deg)`;
      cards.forEach((c, i) => {
        const cs = Math.cos(((i * STEP - a) * Math.PI) / 180);
        c.style.setProperty("--face", cs.toFixed(3));
        c.classList.toggle("is-back", cs < 0.08);
      });
      const idx = ((Math.round(a / STEP) % N) + N) % N;
      if (idx !== active || force === true) setActive(idx, force === true);
      updateInk(a);
    }
    const render = () => renderRing();

    // The underline reads the same ring angle as the title: it slides and stretches between names
    let nowTl: gsap.core.Timeline | null = null;
    let inkM: { x: number; w: number }[] = [];
    // Measure against the whole row (each button sits in its own wrapper, so offsetLeft alone is 0)
    function measureInk() {
      const pr = pindex.getBoundingClientRect();
      inkM = indexBtns.map((b) => {
        const r = b.getBoundingClientRect();
        return { x: r.left - pr.left + pindex.scrollLeft - pindex.clientLeft, w: b.offsetWidth };
      });
    }
    function updateInk(a: number) {
      if (!inkM.length) return;
      const p = a / STEP,
        fl = Math.floor(p),
        fr = p - fl;
      const i0 = ((fl % N) + N) % N,
        i1 = (i0 + 1) % N,
        A0 = inkM[i0],
        A1 = inkM[i1];
      let L: number, Rt: number;
      if (i1 === 0) {
        const B = fr < 0.5 ? A0 : A1;
        L = B.x;
        Rt = B.x + B.w;
      } else {
        const eIn = fr * fr,
          eOut = 1 - (1 - fr) * (1 - fr);
        L = A0.x + (A1.x - A0.x) * eIn;
        Rt = A0.x + A0.w + (A1.x + A1.w - A0.x - A0.w) * eOut;
      }
      ink.style.transform = `translate3d(${L.toFixed(1)}px, 0, 0) scaleX(${Math.max(0.01, (Rt - L) / 100).toFixed(4)})`;
    }
    function scrollIndexTo(i: number, instant?: boolean) {
      const b = indexBtns[i];
      if (!b || pindex.scrollWidth <= pindex.clientWidth + 2) return;
      const bx = inkM[i] ? inkM[i].x : (b.parentElement?.offsetLeft ?? 0);
      pindex.scrollTo({ left: bx - (pindex.clientWidth - b.offsetWidth) / 2, behavior: instant || RM ? "auto" : "smooth" });
    }
    // Big title swaps with a mask rise; the index lights up
    function setActive(i: number, instant?: boolean) {
      active = i;
      // Fresh positions on every change, in case the row moved since the last measure
      measureInk();
      cards.forEach((c, j) => c.classList.toggle("is-active", j === i));
      indexBtns.forEach((b, j) => b.setAttribute("aria-current", String(j === i)));
      scrollIndexTo(i, instant);
      const title = projects[i].title,
        tech = projects[i].techs.join(labels.techSeparator);
      if (!MOTION || instant) {
        nowTitle.textContent = title;
        nowTech.textContent = tech;
        return;
      }
      nowTl?.kill();
      nowTl = gsap
        .timeline()
        .to([nowTitle, nowTech], { yPercent: -110, duration: 0.26, ease: "power3.in" })
        .add(() => {
          nowTitle.textContent = title;
          nowTech.textContent = tech;
        })
        .fromTo([nowTitle, nowTech], { yPercent: 115 }, { yPercent: 0, duration: 0.8, ease: "expo.out", stagger: 0.06 });
    }
    function snapTo(angle: number, dur = 1) {
      if (!MOTION) {
        ring.drag = angle - ring.scroll;
        renderRing();
        return;
      }
      gsap.to(ring, { drag: angle - ring.scroll, duration: dur, ease: "expo.out", onUpdate: render, overwrite: true });
    }
    const nearestFor = (i: number) => {
      const t = total();
      return i * STEP + 360 * Math.round((t - i * STEP) / 360);
    };
    const stepBy = (d: number) => snapTo(Math.round(total() / STEP) * STEP + d * STEP, 0.9);
    const openDetail = (i: number) => store.openDetail?.(i);
    listen(q<HTMLButtonElement>("#ring-prev"), "click", () => stepBy(-1));
    listen(q<HTMLButtonElement>("#ring-next"), "click", () => stepBy(1));
    indexBtns.forEach((b, i) => listen(b, "click", () => snapTo(nearestFor(i), 1.1)));
    const pickCard = (i: number) => {
      if (i === active) openDetail(i);
      else snapTo(nearestFor(i), 0.9);
    };
    cards.forEach((c, i) => {
      listen(c, "focus", () => {
        if (i !== active) snapTo(nearestFor(i), 0.9);
      });
      // Keyboard activation only; pointer clicks are resolved by the drag handler
      listen(c, "click", (e) => {
        if (e.detail === 0) pickCard(i);
      });
    });
    listen(ringStage, "keydown", (e) => {
      if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
      if (e.key === "ArrowRight") {
        e.preventDefault();
        stepBy(1);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        stepBy(-1);
      } else if (e.key === "Enter" && e.target === ringStage) {
        e.preventDefault();
        openDetail(active);
      }
    });
    // Arrow keys also turn the ring while it fills the screen
    let workVisible = false;
    const io = new IntersectionObserver(
      (entries) => {
        workVisible = entries[entries.length - 1].intersectionRatio > 0.5;
      },
      { threshold: [0, 0.5, 1] },
    );
    io.observe(section);
    listen(document, "keydown", (e) => {
      if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
      if (!workVisible || store.detailOpen || ringStage.contains(document.activeElement)) return;
      const tag = (document.activeElement && document.activeElement.tagName) || "";
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (e.key === "ArrowRight") {
        e.preventDefault();
        stepBy(1);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        stepBy(-1);
      }
    });

    let d0 = 0,
      dragging = false;
    const degPerPx = () => STEP / (cards[0].offsetWidth * 0.85);
    offs.push(
      drag(ringStage, {
        start() {
          gsap.killTweensOf(ring);
          d0 = ring.drag;
        },
        begin() {
          dragging = true;
          ringStage.classList.add("grabbing");
          store.bubble?.hide();
        },
        move(dx, _dy, moved) {
          if (!moved) return;
          ring.drag = d0 - dx * degPerPx();
          renderRing();
        },
        end(vx, _vy, moved, target, cancelled) {
          ringStage.classList.remove("grabbing");
          dragging = false;
          if (!moved) {
            const c = target.closest<HTMLElement>(".pcard");
            if (c && !cancelled) pickCard(Number(c.dataset.i));
            return;
          }
          const proj = total() - vx * degPerPx() * 0.28;
          snapTo(Math.round(proj / STEP) * STEP, 1.2);
        },
      }),
    );
    measureInk();
    layoutRing();
    const onResize = () => {
      measureInk();
      layoutRing();
      scrollIndexTo(active, true);
    };
    addEventListener("resize", onResize);
    offs.push(() => removeEventListener("resize", onResize));
    // Names can change width without a window resize (late font swap, style updates),
    // so re-measure the underline whenever the row or any name changes size
    const inkRO = new ResizeObserver(() => {
      measureInk();
      updateInk(total());
    });
    inkRO.observe(pindex);
    indexBtns.forEach((b) => inkRO.observe(b));
    offs.push(() => inkRO.disconnect());

    fontsReady().then(() => {
      if (!alive) return;
      drawCovers();
      measureInk();
      renderRing();
      scrollIndexTo(active, true);
    });

    // "View" bubble follows the cursor over the front card
    if (MOTION && FINE) {
      listen(ringStage, "pointermove", (e) => {
        const c = (e.target as Element).closest<HTMLElement>(".pcard");
        if (!dragging && c && Number(c.dataset.i) === active) store.bubble?.show();
        else store.bubble?.hide();
      });
      listen(ringStage, "pointerleave", () => store.bubble?.hide());
      listen(ringStage, "pointerdown", () => store.bubble?.press());
    }

    // ---------- Scroll choreography ----------
    // The ring turns continuously with scroll; the scrub smoothing lets it glide.
    // Phones get a little less scroll room per turn and a lighter smoothing
    const narrow = matchMedia("(max-width: 760px)").matches;
    const pinScreens = narrow ? 1.4 : 1.8;
    ctx.add(() => {
      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: () => `+=${Math.round(innerHeight * pinScreens)}`,
        pin: true,
        scrub: RM ? false : narrow ? 0.6 : 1,
        anticipatePin: 1,
        onUpdate: (self) => {
          ring.scroll = self.progress * STEP * (N - 1);
          renderRing();
        },
      });
      ScrollTrigger.create({
        trigger: section,
        start: "top 70%",
        // From 70% of a screen before the pin, to 70% of a screen after it ends
        end: () => `+=${Math.round(innerHeight * (0.7 + pinScreens + 0.7))}`,
        onToggle: (self) => {
          store.workOn = self.isActive;
        },
      });
      if (MOTION) {
        gsap.from(qa(".pcard-frame"), {
          opacity: 0,
          y: 140,
          rotateX: -25,
          duration: 1.4,
          ease: "expo.out",
          stagger: 0.06,
          scrollTrigger: { trigger: section, start: "top 75%" },
        });
        gsap.from([q(".now-mask"), ...qa(".pindex-item")], {
          yPercent: 60,
          opacity: 0,
          duration: 1.1,
          ease: "expo.out",
          stagger: 0.04,
          scrollTrigger: { trigger: section, start: "top 65%" },
        });
      }
    });

    return () => {
      alive = false;
      offs.forEach((off) => off());
      io.disconnect();
      gsap.killTweensOf(ring);
      nowTl?.kill();
      ctx.revert();
      store.workOn = false;
      if (store.covers === imgSrc) store.covers = [];
    };
  }, [projects, labels]);

  const first = projects[0];
  return (
    <section id="work" className="work" aria-labelledby="work-title" ref={sectionRef}>
      {children}
      <div className="wrap now" aria-live="polite">
        <span className="now-mask">
          <span className="now-title" id="now-title">
            {first.title}
          </span>
        </span>
        <span className="now-tech-mask">
          <span className="now-tech" id="now-tech">
            {first.techs.join(labels.techSeparator)}
          </span>
        </span>
      </div>
      <div className="ring-stage" id="ring-stage" tabIndex={0} aria-label={labels.ring}>
        <div className="ring" id="ring">
          {projects.map((p, i) => {
            const label = p.links.length ? p.links[0].url.replace(/^https?:\/\//, "").replace(/\/$/, "") : p.title;
            return (
              <button type="button" className="pcard" data-i={i} aria-label={p.title} key={p.title}>
                <span className="pcard-frame">
                  <span className="pcard-bar">
                    <span className="pcard-url">{label}</span>
                  </span>
                  {/* The cover is a canvas-generated data URL set after the fonts load, so next/image does not apply */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img className="pcard-img" alt="" draggable={false} />
                </span>
                <span className="pcard-shade" />
              </button>
            );
          })}
        </div>
        <button type="button" className="edge-arrow edge-prev" id="ring-prev" aria-label={labels.prev}>
          &larr;
        </button>
        <button type="button" className="edge-arrow edge-next" id="ring-next" aria-label={labels.next}>
          &rarr;
        </button>
      </div>
      <div className="wrap pindex-wrap">
        <div className="pindex" id="pindex" role="list" aria-label={labels.index}>
          {projects.map((p, i) => (
            <div className="pindex-item" role="listitem" key={p.title}>
              <button type="button" data-go={i} aria-current={i === 0 ? "true" : "false"}>
                {p.title}
              </button>
            </div>
          ))}
          <span className="pindex-ink" id="pindex-ink" aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}
