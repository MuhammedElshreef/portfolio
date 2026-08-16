// Theme pub/sub in the loaderState mold. The <html data-theme> attribute is
// the source of truth — an inline script in layout.tsx sets it before first
// paint, so this store just reads/writes the DOM and fans out changes to the
// Three.js scene and the custom cursor.
import { useSyncExternalStore } from "react";

export type Theme = "light" | "dark";

type Listener = () => void;
const listeners = new Set<Listener>();

const read = (): Theme =>
  typeof document !== "undefined" && document.documentElement.dataset.theme === "dark"
    ? "dark"
    : "light";

export const themeState = {
  get: read,
  set(theme: Theme) {
    document.documentElement.dataset.theme = theme;
    try {
      localStorage.setItem("theme", theme);
    } catch {
      // Private mode — theme lives for the session only
    }
    listeners.forEach((l) => l());
  },
  toggle(): Theme {
    const next: Theme = read() === "dark" ? "light" : "dark";
    themeState.set(next);
    return next;
  },
  subscribe(listener: Listener) {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
};

export function useTheme(): Theme {
  return useSyncExternalStore(themeState.subscribe, themeState.get, () => "light");
}
