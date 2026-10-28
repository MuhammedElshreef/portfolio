import { gsap } from "@/lib/gsap";
import { finePointer, prefersReducedMotion, store } from "@/lib/store";

type KineticOptions = { g0: number; g1: number; radius: number };

/**
 * Variable-font weight swells (or thins) in the letters near the pointer.
 * Returns a cleanup that removes the listeners and kills the tweens.
 */
export function kinetic(letters: HTMLElement[], area: HTMLElement, o: KineticOptions) {
  if (prefersReducedMotion() || !finePointer()) return () => {};
  let px = 0,
    py = 0,
    on = false,
    raf = 0;
  const run = () => {
    raf = 0;
    if (!store.kineticOn) return;
    letters.forEach((l) => {
      const r = l.getBoundingClientRect(),
        dx = px - (r.left + r.width / 2),
        dy = py - (r.top + r.height / 2);
      const k = on ? Math.exp(-(dx * dx + dy * dy) / (o.radius * o.radius)) : 0;
      gsap.to(l, { "--g": o.g0 + (o.g1 - o.g0) * k, duration: 0.6, ease: "power3.out", overwrite: "auto" });
    });
  };
  const move = (e: PointerEvent) => {
    px = e.clientX;
    py = e.clientY;
    on = true;
    if (!raf) raf = requestAnimationFrame(run);
  };
  const leave = () => {
    on = false;
    if (!raf) raf = requestAnimationFrame(run);
  };
  area.addEventListener("pointermove", move);
  area.addEventListener("pointerleave", leave);
  return () => {
    area.removeEventListener("pointermove", move);
    area.removeEventListener("pointerleave", leave);
    cancelAnimationFrame(raf);
    gsap.killTweensOf(letters);
    letters.forEach((l) => l.style.removeProperty("--g"));
  };
}
