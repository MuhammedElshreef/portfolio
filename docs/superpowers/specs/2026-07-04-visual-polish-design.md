# Visual polish pass — design

Date: 2026-07-04. Approved by Muhammed ("do all of them").

Goal: deepen the existing paper-and-ink editorial identity with motion and detail.
Every item extends the current animation language (line-mask reveals, drawn lines,
mono uppercase labels, Playfair display, blue accent). All motion honors
`prefers-reduced-motion`; pointer effects are fine-pointer only.

## Big impact

1. **Reactive Three.js background** — `CameraRig` lerps the camera a few degrees
   toward the pointer. `ParticleField` gains a `uScroll` uniform fed by
   `scrollState.progress`: tint mix shifts warmer→bluer and the field breathes
   (spread/turbulence) as you travel Hero → Contact. A `sceneEvents` pub/sub
   exposes `burst()` — a radial displacement pulse in the shader (also the easter egg).
2. **Mobile menu** — hamburger on `sm:hidden`, full-screen blue overlay (same blue
   as the preloader), section links in huge Playfair with staggered line-mask
   reveals, indices, CV + email at the bottom. Lenis pauses while open.
3. **Scroll-drawn Experience timeline** — the `border-l` becomes a line that grows
   with scroll (`scaleY` bound to section scroll progress); entry dots spring in
   when reached.
4. **Custom cursor** — ink dot + trailing ring (springs). Ring grows over links;
   over project cards it morphs into a "View ↗" pill. Desktop fine-pointer only,
   hidden for reduced motion; native cursor hidden while active.
5. **Hero exit parallax** — `useScroll` on the hero; the display lines translate up
   at different speeds and fade as the section leaves.

## Medium

- **Marquee ribbon** between Hero and About — infinite mono-uppercase strip
  ("Available for work — Laravel — Angular — …"), hairline top/bottom borders,
  duplicated track at −50% keyframe, static when reduced motion.
- **SectionHeading** upgraded to the hero's masked line-slide; the hairline rule
  draws in (`scaleX` 0→1).
- **Magnetic** wrapper (email pill, CV/social links, scroll-to-top): element eases
  a few px toward the cursor, springs back on leave.
- **Skills pills stagger** — pills pop in one-by-one (30 ms, scale 0.95→1).
- **Drawn underlines** — `.link-draw` background-size underline animating
  left→right on hover for nav/footer/contact links.

## Tiny details

- **Tripoli local time** under the contact email (`Africa/Tripoli`, updates each
  minute, renders post-mount to avoid hydration mismatch).
- **Section counter** — fixed right edge (desktop), mono `02 / 06`, updates via
  IntersectionObserver.
- **Duotone About photo** — grayscale + blue overlay via CSS, full color on hover.
- **Project card tilt** — reuse pointer tracking for a ~2.5° perspective tilt
  (mouse pointer-type only), composed with the existing lift + glow.
- **Preloader → hero handoff** — `loaderState.finish()` fires a beat before the
  wipe; hero settles from scale 1.02 → 1.
- **Easter egg** — clicking the hero name triggers the particle burst.
- **Styled 404** — `app/not-found.tsx`: "Lost the plot." in display type over the
  same background scene, mono `404` eyebrow, link home.

## Non-goals

No new pages besides 404, no content changes beyond a marquee list in
`lib/content.ts`, no new dependencies (motion, three, lenis already cover it).

## Verification

`npm run build` must pass; manual pass over dev server (desktop + mobile widths,
reduced-motion emulation).
