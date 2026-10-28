import type Lenis from "lenis";

/*
  Per-frame values shared between the client leaves. A plain module-level object,
  never React state: the scroll frame writes it, the particle sky reads it every frame.
*/
export type BubbleApi = { show(): void; hide(): void; press(): void };

export const store = {
  /** Particle formation, 0 to 3: night sky, code glyph, globe, starfield */
  stage: 0,
  /** Particle opacity the sky eases toward */
  alpha: 1,
  /** The intro has released the page; particles gather */
  go: false,
  /** Bumped whenever the palette tokens are re-read */
  palV: 0,
  workOn: false,
  aboutOn: false,
  /** How far the skills sphere has settled into its groups, 0 to 1 */
  skillsFlat: 0,
  /** Kinetic type reacts to the pointer only after the intro */
  kineticOn: false,
  /** The intro is holding the scroll */
  introActive: false,
  lenis: null as Lenis | null,
  /** Generated cover data URLs, by ring index */
  covers: [] as string[],
  detailOpen: false,
  openDetail: null as ((i: number) => void) | null,
  bubble: null as BubbleApi | null,
};

export const prefersReducedMotion = () =>
  matchMedia("(prefers-reduced-motion: reduce)").matches;

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

export type RGB = [number, number, number];
export const PAL_KEYS = [
  "bg",
  "bg2",
  "panel",
  "panel2",
  "acc",
  "acc2",
  "acc-hi",
  "acc-lo",
  "text",
  "muted",
  "shadow",
  "sparkle",
] as const;
export type PalKey = (typeof PAL_KEYS)[number];
export type Palette = Record<PalKey, RGB>;

/** Read the "r g b" channel tokens from :root so canvas and WebGL match the page */
export function readPalette(): Palette {
  const cs = getComputedStyle(document.documentElement);
  const pal = {} as Palette;
  PAL_KEYS.forEach((k) => {
    const v = cs
      .getPropertyValue(`--${k}-rgb`)
      .trim()
      .split(/[\s,/]+/)
      .map(Number);
    pal[k] =
      v.length >= 3 && v.slice(0, 3).every((n) => Number.isFinite(n))
        ? [v[0], v[1], v[2]]
        : [128, 128, 128];
  });
  return pal;
}
