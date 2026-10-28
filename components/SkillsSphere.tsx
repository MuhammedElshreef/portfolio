"use client";

import { useEffect, useRef, type ReactNode } from "react";
import type { SkillGroupKey } from "@/lib/content";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { clamp, fontsReady, prefersReducedMotion, store } from "@/lib/store";

export type SphereTag = { name: string; key: SkillGroupKey };

/*
  A tag sphere you can drag. The section pins, and by its end the tags fly into
  three labelled groups (Front-end, Back-end, Tools); scrolling back unwinds them.
*/
export default function SkillsSphere({
  tags,
  groups,
  listLabel,
  children,
}: {
  tags: SphereTag[];
  groups: { key: SkillGroupKey; name: string }[];
  listLabel: string;
  children: ReactNode;
}) {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const RM = prefersReducedMotion();
    const MOTION = !RM;
    const sph = section.querySelector<HTMLElement>("#sphere")!,
      tagsUl = section.querySelector<HTMLElement>("#tags")!,
      sgrid = section.querySelector<HTMLElement>("#skills-grid")!,
      legend = section.querySelector<HTMLElement>(".legend");
    const tagEls = Array.from(tagsUl.querySelectorAll<HTMLElement>(".tag")),
      tn = tagEls.length;
    const base = tagEls.map((_, i) => {
      const y = 1 - ((i + 0.5) * 2) / tn,
        rr = Math.sqrt(1 - y * y),
        phi = i * 2.399963;
      return [Math.cos(phi) * rr, y, Math.sin(phi) * rr];
    });
    const sp = { rx: 0.35, ry: 0, vx: 0, vy: 0.004, dragging: false, hover: false, R: 200, inView: false, raf: 0 };
    const flat = { v: MOTION ? 0 : 1 };
    const smooth = (a: number, b: number, x: number) => {
      const t = clamp((x - a) / (b - a), 0, 1);
      return t * t * (3 - 2 * t);
    };
    let alive = true;
    let goff: [number, number][] = [];
    function measureGrid() {
      const sr = sph.getBoundingClientRect(),
        cx = sr.left + sr.width / 2,
        cy = sr.top + sr.height / 2;
      goff = [];
      sgrid.querySelectorAll<HTMLElement>(".slot").forEach((sl) => {
        const r = sl.getBoundingClientRect();
        goff[Number(sl.dataset.k)] = [r.left + r.width / 2 - cx, r.top + r.height / 2 - cy];
      });
    }
    function renderSphere() {
      const m = smooth(0.2, 0.85, flat.v);
      store.skillsFlat = m;
      const cx = Math.cos(sp.rx),
        sx = Math.sin(sp.rx),
        cy = Math.cos(sp.ry),
        sy = Math.sin(sp.ry);
      for (let i = 0; i < tn; i++) {
        const [x, y, z] = base[i];
        const x1 = x * cy + z * sy,
          z1 = -x * sy + z * cy;
        const y1 = y * cx - z1 * sx,
          z2 = y * sx + z1 * cx;
        const depth = (z2 + 1) / 2,
          s0 = 0.6 + 0.45 * depth,
          o0 = 0.22 + 0.78 * depth;
        const mi = smooth(0, 1, m * 1.35 - (i / tn) * 0.35);
        const px = x1 * sp.R,
          py = y1 * sp.R,
          go = goff[i] || [px, py];
        const X = px + (go[0] - px) * mi,
          Y = py + (go[1] - py) * mi,
          sc = s0 + (1 - s0) * mi,
          op = o0 + (1 - o0) * mi;
        const el = tagEls[i];
        el.style.transform = `translate(-50%, -50%) translate3d(${X.toFixed(1)}px, ${Y.toFixed(1)}px, 0) scale(${sc.toFixed(3)})`;
        el.style.opacity = op.toFixed(3);
        el.style.zIndex = String(mi > 0.5 ? 300 + i : 100 + Math.round(z2 * 100));
      }
      const lab = smooth(0.6, 1, m);
      sgrid.style.setProperty("--lab", lab.toFixed(3));
      if (legend) legend.style.opacity = String(1 - lab);
      sph.classList.toggle("is-flat", m > 0.02);
    }
    function sizeSphere() {
      sp.R = sph.clientWidth * 0.4;
      measureGrid();
      renderSphere();
    }
    function sphereLoop() {
      if (!sp.inView) {
        sp.raf = 0;
        return;
      }
      sp.raf = requestAnimationFrame(sphereLoop);
      if (!sp.dragging) {
        const spin = 1 - store.skillsFlat,
          auto = (sp.hover ? 0.0006 : 0.004) * spin;
        sp.vy += (auto - sp.vy) * 0.03;
        sp.vx *= 0.94;
        sp.ry += sp.vy;
        sp.rx += sp.vx;
        sp.rx += (0.35 - sp.rx) * 0.004;
      }
      renderSphere();
    }

    let lastP: { x: number; y: number; m: boolean } | null = null;
    const down = (e: PointerEvent) => {
      if (RM || store.skillsFlat > 0.02) return;
      sp.dragging = true;
      lastP = { x: e.clientX, y: e.clientY, m: e.pointerType === "mouse" };
      sph.classList.add("grabbing");
      try {
        sph.setPointerCapture(e.pointerId);
      } catch {}
    };
    const move = (e: PointerEvent) => {
      if (!sp.dragging || !lastP) return;
      const dx = e.clientX - lastP.x,
        dy = e.clientY - lastP.y;
      sp.ry += dx * 0.006;
      sp.vy = dx * 0.006;
      if (lastP.m) {
        sp.rx += dy * 0.006;
        sp.vx = dy * 0.006;
      }
      lastP.x = e.clientX;
      lastP.y = e.clientY;
      if (!sp.raf) renderSphere();
    };
    const endSphere = () => {
      sp.dragging = false;
      lastP = null;
      sph.classList.remove("grabbing");
    };
    const hoverOn = () => {
      sp.hover = true;
    };
    const hoverOff = () => {
      sp.hover = false;
    };
    sph.addEventListener("pointerdown", down);
    sph.addEventListener("pointermove", move);
    sph.addEventListener("pointerup", endSphere);
    sph.addEventListener("pointercancel", endSphere);
    tagEls.forEach((t) => {
      t.addEventListener("pointerenter", hoverOn);
      t.addEventListener("pointerleave", hoverOff);
    });
    sizeSphere();
    fontsReady().then(() => {
      if (alive) sizeSphere();
    });
    addEventListener("resize", sizeSphere);
    let io: IntersectionObserver | null = null;
    if (!RM) {
      io = new IntersectionObserver((entries) => {
        sp.inView = entries[entries.length - 1].isIntersecting;
        if (sp.inView && !sp.raf) sp.raf = requestAnimationFrame(sphereLoop);
      });
      io.observe(sph);
    }

    // Skills pin: the sphere settles into three readable groups by the end, and unwinds on the way back up
    const ctx = gsap.context(() => {
      if (MOTION)
        gsap.to(flat, {
          v: 1,
          ease: "none",
          onUpdate: () => {
            if (!sp.raf) renderSphere();
          },
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => `+=${Math.round(innerHeight * 1.3)}`,
            pin: true,
            scrub: 0.8,
            anticipatePin: 1,
          },
        });
    }, section);
    ScrollTrigger.addEventListener("refresh", sizeSphere);

    return () => {
      alive = false;
      sp.inView = false;
      cancelAnimationFrame(sp.raf);
      sp.raf = 0;
      io?.disconnect();
      sph.removeEventListener("pointerdown", down);
      sph.removeEventListener("pointermove", move);
      sph.removeEventListener("pointerup", endSphere);
      sph.removeEventListener("pointercancel", endSphere);
      tagEls.forEach((t) => {
        t.removeEventListener("pointerenter", hoverOn);
        t.removeEventListener("pointerleave", hoverOff);
      });
      removeEventListener("resize", sizeSphere);
      ScrollTrigger.removeEventListener("refresh", sizeSphere);
      ctx.revert();
      store.skillsFlat = 0;
    };
  }, []);

  return (
    <section id="skills" className="skills" aria-labelledby="skills-title" ref={sectionRef}>
      {children}
      <div className="skills-stage" id="skills-stage">
        <div className="skills-grid" id="skills-grid" aria-hidden="true">
          {groups.map((g) => (
            <div className={`sg-group sg-${g.key}`} key={g.key}>
              <p className="sg-label">{g.name}</p>
              <div className="sg-row">
                {tags.map((t, i) =>
                  t.key === g.key ? (
                    <span className={`tag ${t.key} slot`} data-k={i} key={t.name}>
                      {t.name}
                    </span>
                  ) : null,
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="sphere" id="sphere">
          <ul className="tags" id="tags" aria-label={listLabel}>
            {tags.map((t) => (
              <li className={`tag ${t.key}`} key={t.name}>
                {t.name}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
