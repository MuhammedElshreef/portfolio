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
  /** The splash still covers the page, so the sky skips its work behind it */
  introCover: false,
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

/*
  Holds the page still (intro) by swallowing scroll input. The scrollbar stays where it
  is, so nothing shifts or blinks when the hold ends.
*/
const SCROLL_KEYS = new Set(["ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End", " "]);
const stopScroll = (e: Event) => e.preventDefault();
const stopScrollKeys = (e: KeyboardEvent) => {
  if (SCROLL_KEYS.has(e.key)) e.preventDefault();
};
export const lockScroll = (on: boolean) => {
  if (on) {
    addEventListener("wheel", stopScroll, { passive: false });
    addEventListener("touchmove", stopScroll, { passive: false });
    addEventListener("keydown", stopScrollKeys);
  } else {
    removeEventListener("wheel", stopScroll);
    removeEventListener("touchmove", stopScroll);
    removeEventListener("keydown", stopScrollKeys);
  }
};

/**
 * A resize listener that ignores a phone's address bar showing or hiding (a height-only
 * change on a touch screen), which would otherwise re-measure the page mid-scroll.
 * Returns the function that removes it.
 */
export function onViewportResize(fn: () => void) {
  let w = innerWidth;
  const coarse = matchMedia("(pointer: coarse)");
  const handler = () => {
    if (coarse.matches && innerWidth === w) return;
    w = innerWidth;
    fn();
  };
  addEventListener("resize", handler);
  return () => removeEventListener("resize", handler);
}

/** Resolves once the particle sky has built itself (or given up), so the splash can start on a quiet main thread */
let skyDone: () => void = () => {};
export const skyReady = new Promise<void>((resolve) => {
  skyDone = resolve;
});
export const markSkyReady = () => skyDone();

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
