"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/store";

/** Duotone portrait: true colour shows under the pointer, a click shows it all */
export default function Portrait({ src, alt }: { src: string; alt: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [full, setFull] = useState(false);

  useEffect(() => {
    const photo = ref.current;
    if (!photo) return;
    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const r = photo.getBoundingClientRect();
      photo.style.setProperty("--mx", `${e.clientX - r.left}px`);
      photo.style.setProperty("--my", `${e.clientY - r.top}px`);
    };
    const leave = () => {
      photo.style.setProperty("--mx", "-999px");
      photo.style.setProperty("--my", "-999px");
    };
    photo.addEventListener("pointermove", move);
    photo.addEventListener("pointerleave", leave);
    const ctx = gsap.context(() => {
      if (prefersReducedMotion()) return;
      gsap.fromTo(
        photo,
        { clipPath: "inset(100% 0% 0% 0% round 18px)" },
        {
          clipPath: "inset(0% 0% 0% 0% round 18px)",
          duration: 1.6,
          ease: "expo.out",
          scrollTrigger: { trigger: photo, start: "top 80%" },
        },
      );
      gsap.fromTo(
        photo.querySelectorAll("img"),
        { yPercent: -5 },
        { yPercent: 5, ease: "none", scrollTrigger: { trigger: photo, start: "top bottom", end: "bottom top", scrub: true } },
      );
    });
    return () => {
      photo.removeEventListener("pointermove", move);
      photo.removeEventListener("pointerleave", leave);
      ctx.revert();
    };
  }, []);

  return (
    <div
      className={full ? "photo full" : "photo"}
      id="photo"
      ref={ref}
      role="button"
      tabIndex={0}
      aria-pressed={full}
      aria-label="Show portrait in full colour"
      onClick={() => setFull((f) => !f)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          setFull((f) => !f);
        }
      }}
    >
      <Image className="photo-base" src={src} alt={alt} width={834} height={853} sizes="(max-width: 860px) 440px, 42vw" />
      <Image
        className="photo-color"
        src={src}
        alt=""
        aria-hidden="true"
        width={834}
        height={853}
        sizes="(max-width: 860px) 440px, 42vw"
      />
    </div>
  );
}
