"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { ScrollTrigger } from "@/lib/gsap";
import { clamp, prefersReducedMotion } from "@/lib/store";

const COLS = 56; // dots across the photo
const FLY = 1.15; // seconds one dot takes to land
const SHOW_AT = 1.75; // seconds in, the photo starts to take over from the dots
const SHOW_FOR = 0.7;
const CORNERS = ["tl", "tr", "bl", "br"];

/*
  The portrait, in its real colours. The first time it scrolls into view it arrives as
  the same cyan dots as the night sky: they fly in from outside the frame, each one sized
  by how bright the photo is at that spot, so together they draw the picture. Then the
  dots fade out while the photo fades in. Without motion the photo is simply there.
*/
export default function Portrait({ src, alt }: { src: string; alt: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    const box = root?.querySelector<HTMLElement>(".photo-box");
    const img = box?.querySelector("img");
    const cv = box?.querySelector("canvas");
    const ctx = cv?.getContext("2d");
    if (!root || !box || !img || !cv || !ctx) return;
    const show = () => root.classList.add("is-in");
    if (prefersReducedMotion()) {
      show();
      return;
    }
    let raf = 0,
      alive = true;

    const play = () => {
      const w = box.clientWidth,
        h = box.clientHeight,
        rows = Math.max(1, Math.round((COLS * h) / Math.max(1, w)));
      // Read the photo at one pixel per dot. The box has the same proportions as the photo.
      let px: Uint8ClampedArray;
      try {
        const small = document.createElement("canvas");
        small.width = COLS;
        small.height = rows;
        const sctx = small.getContext("2d");
        if (!sctx) throw new Error("no 2d context");
        sctx.drawImage(img, 0, 0, COLS, rows);
        px = sctx.getImageData(0, 0, COLS, rows).data;
      } catch {
        show();
        return;
      }
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      cv.width = Math.round(w * dpr);
      cv.height = Math.round(h * dpr);
      const cell = w / COLS,
        reach = Math.max(w, h);
      // Six numbers per dot: where it lands (x, y), where it starts (x, y), its radius, its delay
      const dots = new Float32Array(COLS * rows * 6);
      for (let i = 0; i < COLS * rows; i++) {
        const x = i % COLS,
          y = (i - x) / COLS,
          q = i * 4,
          j = i * 6;
        const lum = (0.2126 * px[q] + 0.7152 * px[q + 1] + 0.0722 * px[q + 2]) / 255;
        const angle = Math.random() * Math.PI * 2,
          far = (0.7 + Math.random() * 0.9) * reach;
        dots[j] = (x + 0.5) * cell;
        dots[j + 1] = (y + 0.5) * cell;
        dots[j + 2] = w / 2 + Math.cos(angle) * far;
        dots[j + 3] = h / 2 + Math.sin(angle) * far;
        dots[j + 4] = cell * (0.1 + 0.42 * lum);
        // Scattered, with the top of the picture a little ahead of the bottom
        dots[j + 5] = Math.random() * 0.5 + (y / rows) * 0.3;
      }
      ctx.fillStyle = getComputedStyle(cv).color;
      const t0 = performance.now();
      const frame = (now: number) => {
        const t = (now - t0) / 1000,
          fade = clamp((t - SHOW_AT) / SHOW_FOR, 0, 1);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.clearRect(0, 0, w, h);
        if (fade >= 1) {
          img.style.opacity = "";
          show();
          return;
        }
        ctx.globalAlpha = 1 - fade;
        ctx.beginPath();
        for (let j = 0; j < dots.length; j += 6) {
          const u = clamp((t - dots[j + 5]) / FLY, 0, 1);
          if (u <= 0) continue;
          const e = 1 - (1 - u) ** 4,
            x = dots[j + 2] + (dots[j] - dots[j + 2]) * e,
            y = dots[j + 3] + (dots[j + 1] - dots[j + 3]) * e;
          ctx.moveTo(x + dots[j + 4], y);
          ctx.arc(x, y, dots[j + 4], 0, 6.2832);
        }
        ctx.fill();
        img.style.opacity = fade.toFixed(3);
        raf = requestAnimationFrame(frame);
      };
      raf = requestAnimationFrame(frame);
    };

    // The photo loads lazily, so it may still be on its way when the section arrives
    const start = () => {
      const go = () => {
        if (!alive) return;
        if (img.naturalWidth) play();
        else show();
      };
      if (img.complete) go();
      else {
        img.addEventListener("load", go, { once: true });
        img.addEventListener("error", go, { once: true });
      }
    };
    const st = ScrollTrigger.create({ trigger: root, start: "top 78%", once: true, onEnter: start });
    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      st.kill();
      img.style.opacity = "";
    };
  }, []);

  return (
    <div className="photo" id="photo" ref={ref}>
      <div className="photo-box">
        <Image src={src} alt={alt} width={834} height={853} sizes="(max-width: 860px) 440px, 42vw" />
        <canvas aria-hidden="true" />
      </div>
      {CORNERS.map((c) => (
        <span className={`photo-c ${c}`} aria-hidden="true" key={c} />
      ))}
    </div>
  );
}
