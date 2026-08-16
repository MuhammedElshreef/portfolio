# Dark Mode — "Ink Spill" Toggle

**Date:** 2026-08-16
**Status:** Approved

## Concept

Light mode is ink on paper; dark mode is dim midnight blue-ink — a
softened night-sky navy (dark but not black, in the spirit of Twitter's
"Dim") with gently warm cream text. Clicking a sun/moon toggle in the nav
"spills" darkness from the click point — a circular ink-wash floods the
viewport using the View Transitions API. Toggling back drains the dark
view toward the toggle.

*(Revised 2026-08-16 three times on user feedback: warm brown-black +
inkwell → midnight blue-ink + sun ↔ moon morph → true black studio with
glow → dim midnight blue-ink, chosen from a ten-theme sample gallery.)*

## Palette

| Token            | Light                  | Dark                        |
| ---------------- | ---------------------- | --------------------------- |
| `--paper`        | `#f5f1e8`              | `#151c26`                   |
| `--paper-raised` | `#ede7da`              | `#1e2836`                   |
| `--ink`          | `#46382a`              | `#e6e0d4`                   |
| `--ink-muted`    | `#8a7a6a`              | `#8e99a8`                   |
| `--blue`         | `#2563eb`              | `#4d8dff`                   |
| `--blue-bright`  | `#3b82f6`              | `#6ea3ff`                   |
| `--hairline`     | `rgba(70,56,42,0.14)`  | `rgba(214,224,238,0.14)`    |
| `--card-shadow`  | `rgba(70,56,42,0.35)`  | `rgba(0,0,0,0.45)`          |

## Architecture

- **Theme attribute:** `data-theme="dark"` on `<html>`. `globals.css`
  redefines the existing CSS variables under `[data-theme="dark"]`. All
  Tailwind colors already flow through these variables via `@theme inline`,
  so components restyle automatically.
- **No-flash boot:** a tiny inline script in the `<head>` (in `layout.tsx`)
  reads `localStorage.theme`, falling back to `prefers-color-scheme`, and
  sets the attribute before first paint.
- **Persistence:** explicit toggle click writes `localStorage.theme`
  (`"light"` / `"dark"`). First visit follows the system preference.
- **Theme store:** `components/themeState.ts`, a module-level
  subscribe/notify store following the existing `loaderState.ts` pattern.
  Exposes current theme + `toggleTheme(originX, originY)` + `subscribe()`.
- **Toggle component:** `components/ui/ThemeToggle.tsx` — a code-boolean
  in mono type: `> dark:false_` ↔ `> dark:true_`, the value turning blue
  when true, with a blinking caret reusing the typing logo's animation and
  a blue prompt chevron (the clickability cue) that nudges forward on
  hover. The value is CSS `::after` content keyed off `[data-theme]`, so
  server and client markup always match. Rendered in the nav on all
  breakpoints. *(Fourth icon revision: inkwell → sun ↔ moon morph →
  half-ink disc → code boolean, picked from IT-themed sample pages.)*
- **Ink spill animation:** on click, `document.startViewTransition()` with a
  custom `::view-transition-new(root)` animation: `clip-path: circle()`
  expanding from the click coordinates to cover the viewport (~700ms,
  ease-out-expo). Reverse (drain) when going back to light. Fallback: if
  `startViewTransition` is missing or `prefers-reduced-motion`, switch
  instantly.
- **Three.js scene:** `WaveGrid` (`uColor` blue) and `ParticleField`
  (`uInk` uniform) subscribe to the theme store and update their uniforms.
- **Cursor:** `Cursor.tsx` ring/dot rgba colors become theme-dependent via
  the store.
- **Browser chrome:** `viewport.themeColor` uses media-query entries for
  light/dark.

## Error handling

- No `localStorage` (privacy mode): fall back to system preference,
  in-memory only.
- No View Transitions API: instant switch, no animation.
- SSR: server renders without the attribute; the head script runs before
  paint so there is no visible flash or hydration mismatch (attribute is
  set outside React's purview via `suppressHydrationWarning` on `<html>`).

## Testing

- `npm run build` passes; lint passes.
- Manual: toggle in both directions (animation + palette), reload
  persistence, system-preference first visit, reduced-motion instant
  switch, scene/cursor colors update, mobile menu toggle.

## Out of scope

Per-section themes, a three-way (system/light/dark) selector, theming of
the OG image, and any transition beyond the global reveal.
