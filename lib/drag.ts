type DragHandlers = {
  start(e: PointerEvent): void;
  begin?(): void;
  move(dx: number, dy: number, moved: boolean, e: PointerEvent): void;
  end(vx: number, vy: number, moved: boolean, target: Element, cancelled: boolean): void;
};

/** Pointer drag with a 6px dead zone and a release velocity. Returns a cleanup. */
export function drag(el: HTMLElement, h: DragHandlers) {
  let detach: (() => void) | null = null;
  const down = (e: PointerEvent) => {
    const t = e.target as Element;
    if (e.button !== 0 || t.closest(".edge-arrow")) return;
    const sx = e.clientX,
      sy = e.clientY,
      target = t;
    let moved = false;
    const hist = [{ x: sx, y: sy, t: performance.now() }];
    try {
      el.setPointerCapture(e.pointerId);
    } catch {}
    h.start(e);
    const move = (ev: PointerEvent) => {
      const dx = ev.clientX - sx,
        dy = ev.clientY - sy;
      if (!moved && Math.hypot(dx, dy) > 6) {
        moved = true;
        h.begin?.();
      }
      hist.push({ x: ev.clientX, y: ev.clientY, t: performance.now() });
      if (hist.length > 6) hist.shift();
      h.move(dx, dy, moved, ev);
    };
    const off = () => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerup", end);
      el.removeEventListener("pointercancel", end);
      detach = null;
    };
    const end = (ev: PointerEvent) => {
      off();
      const a = hist[0],
        b = hist[hist.length - 1],
        dt = Math.max(16, b.t - a.t),
        stale = performance.now() - b.t > 90;
      h.end(
        stale ? 0 : ((b.x - a.x) / dt) * 1000,
        stale ? 0 : ((b.y - a.y) / dt) * 1000,
        moved,
        target,
        ev.type === "pointercancel",
      );
    };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerup", end);
    el.addEventListener("pointercancel", end);
    detach = off;
  };
  el.addEventListener("pointerdown", down);
  return () => {
    el.removeEventListener("pointerdown", down);
    detach?.();
  };
}
