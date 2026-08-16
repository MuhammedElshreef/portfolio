# Dark Mode — "Ink Spill" Toggle

**Date:** 2026-08-16
**Status:** Approved

## Concept

Light mode is ink on paper; dark mode is paper soaked in ink. Clicking an
inkwell icon in the nav "spills" darkness from the click point — a circular
ink-wash floods the viewport using the View Transitions API. Toggling back
drains the ink toward the inkwell. The dark palette stays warm (ink-black,
cream text) so the site keeps its paper/ink identity.

## Palette

| Token            | Light                  | Dark                        |
| ---------------- | ---------------------- | --------------------------- |
| `--paper`        | `#f5f1e8`              | `#161210`                   |
| `--paper-raised` | `#ede7da`              | `#211b16`                   |
| `--ink`          | `#46382a`              | `#ece5d8`                   |
| `--ink-muted`    | `#8a7a6a`              | `#9a8b7a`                   |
| `--blue`         | `#2563eb`              | `#4d8dff`                   |
| `--blue-bright`  | `#3b82f6`              | `#6ea3ff`                   |
| `--hairline`     | `rgba(70,56,42,0.14)`  | `rgba(236,229,216,0.14)`    |
| `--card-shadow`  | `rgba(70,56,42,0.35)`  | `rgba(0,0,0,0.55)`          |

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
- **Toggle component:** `components/ui/ThemeToggle.tsx` — an inkwell SVG
  (line-art style matching the site's self-drawing SVG language) with an
  ink drop that tips on hover. Rendered in the desktop nav and mobile menu.
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
