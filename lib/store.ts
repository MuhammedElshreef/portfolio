/*
  Per-frame values shared between the client leaves. A plain module-level object,
  never React state: the scroll frame writes it, the particle sky reads it every frame.
*/
export type BubbleApi = { show(): void; hide(): void; press(): void };

export const store = {
  /** Particle formation, 0 to 2: night sky, code glyph, globe (the globe only with the skills sphere) */
  stage: 0,
  /** Particle opacity the sky eases toward */
  alpha: 1,
  /** The intro has released the page; particles gather */
  go: false,
  /** Bumped whenever the palette tokens are re-read */
  palV: 0,
  /** How far the skills sphere has settled into its groups, 0 to 1 */
  skillsFlat: 0,
  /** Kinetic type reacts to the pointer only after the intro */
  kineticOn: false,
  /** The intro is holding the scroll */
  introActive: false,
  /** Set by the particle sky while its loop sleeps; wakes it when the page needs it again */
  skyWake: null as (() => void) | null,
  detailOpen: false,
  openDetail: null as ((i: number) => void) | null,
  bubble: null as BubbleApi | null,
};

export const prefersReducedMotion = () =>
  matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Phones, narrow windows and touch screens get the flat skills list instead of the sphere */
export const COMPACT_SKILLS_MQ = "(max-width: 760px), (pointer: coarse)";
export const compactSkills = () => matchMedia(COMPACT_SKILLS_MQ).matches;

/** Holds the page still (intro). Native scroll, so this is plain overflow on <html> */
export const lockScroll = (on: boolean) => document.documentElement.classList.toggle("scroll-lock", on);

export const finePointer = () =>
  matchMedia("(hover: hover) and (pointer: fine)").matches;

export const clamp = (v: number, a: number, b: number) =>
  v < a ? a : v > b ? b : v;

/** Resolves when the web fonts are in, or after a timeout so nothing waits forever */
export const fontsReady = (ms = 2200) =>
  Promise.race([
    document.fonts ? document.fonts.ready.then(() => undefined) : Promise.resolve(),
    new Promise<void>((r) => setTimeout(r, ms)),
  ]);

/**
 * The family list next/font generated for one of the --font-* variables, for canvas
 * drawing. next/font renames families, so the plain name is only a fallback.
 */
export function fontFamily(variable: string, fallback: string) {
  const v = getComputedStyle(document.documentElement).getPropertyValue(variable).trim();
  return v || fallback;
}
