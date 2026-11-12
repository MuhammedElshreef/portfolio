const GLYPHS = "</>{}[]#$_=+01";

/**
 * A heading settles out of code characters into its words, left to right, in under a
 * second. The element must hold plain text. Screen readers get the real text throughout.
 * Returns a function that ends the effect at once.
 */
export function decode(el: HTMLElement) {
  const text = el.textContent ?? "";
  if (!text.trim()) return () => {};
  const dur = 420 + text.length * 34;
  const scr = document.createElement("span");
  scr.className = "scr";
  scr.setAttribute("aria-hidden", "true");
  let raf = 0,
    last = 0,
    done = false;
  const paint = (n: number) => {
    let rest = "";
    for (let i = n; i < text.length; i++) rest += text[i] === " " ? " " : GLYPHS[(Math.random() * GLYPHS.length) | 0];
    el.textContent = text.slice(0, n);
    if (rest) {
      scr.textContent = rest;
      el.appendChild(scr);
    }
  };
  const finish = () => {
    if (done) return;
    done = true;
    cancelAnimationFrame(raf);
    clearTimeout(end);
    el.textContent = text;
    el.removeAttribute("aria-label");
  };
  const t0 = performance.now();
  const frame = (now: number) => {
    const p = Math.min(1, (now - t0) / dur);
    if (p >= 1) {
      finish();
      return;
    }
    if (now - last > 45) {
      last = now;
      paint(Math.floor(p * text.length));
    }
    raf = requestAnimationFrame(frame);
  };
  // If frames stop (a background tab), still end on the real words
  const end = window.setTimeout(finish, dur + 500);
  el.setAttribute("aria-label", text);
  paint(0);
  raf = requestAnimationFrame(frame);
  return finish;
}
