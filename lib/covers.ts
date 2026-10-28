import type { CoverMotif } from "@/lib/content";
import type { Palette, PalKey } from "@/lib/store";

export type CoverInput = { title: string; techs: string[]; cover?: CoverMotif };
export type CoverFonts = { display: string; arab: string; mono: string };

function rng(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Generated project cover: canvas art drawn in the live palette, returned as a JPEG data URL */
export function drawCover(p: CoverInput, seed: number, pal: Palette, fonts: CoverFonts, techSep: string) {
  const col = (k: PalKey, a = 1) => {
    const c = pal[k] || [128, 128, 128];
    return `rgba(${c[0]},${c[1]},${c[2]},${a})`;
  };
  const W = 800,
    H = 500,
    c = document.createElement("canvas");
  c.width = W;
  c.height = H;
  const g = c.getContext("2d");
  if (!g) return "";
  const r = rng(seed);
  const rrect = (x: number, y: number, w: number, h: number, rad: number) => {
    if (g.roundRect) g.roundRect(x, y, w, h, rad);
    else g.rect(x, y, w, h);
  };
  const bg = g.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, col("bg2"));
  bg.addColorStop(1, col("bg"));
  g.fillStyle = bg;
  g.fillRect(0, 0, W, H);
  const glow = g.createRadialGradient(W * 0.72, H * 0.36, 10, W * 0.72, H * 0.36, W * 0.62);
  glow.addColorStop(0, col("acc", 0.3));
  glow.addColorStop(0.55, col("acc-lo", 0.12));
  glow.addColorStop(1, col("acc", 0));
  g.fillStyle = glow;
  g.fillRect(0, 0, W, H);
  g.strokeStyle = col("acc");
  g.fillStyle = col("acc");
  g.lineCap = "round";
  g.lineJoin = "round";
  const k = p.cover;
  if (k === "rings") {
    for (let i = 0; i < 16; i++) {
      g.globalAlpha = 0.1 + i * 0.045;
      g.lineWidth = i % 4 === 0 ? 2 : 1;
      g.beginPath();
      g.arc(W * 0.7, H * 0.4, 24 + i * 21, 0, Math.PI * 2);
      g.stroke();
    }
    for (let i = 0; i < 60; i++) {
      const a = r() * Math.PI * 2,
        d = 60 + r() * 300;
      g.globalAlpha = 0.25 + r() * 0.6;
      g.beginPath();
      g.arc(W * 0.7 + Math.cos(a) * d, H * 0.4 + Math.sin(a) * d, 1 + r() * 2.2, 0, Math.PI * 2);
      g.fill();
    }
    g.globalAlpha = 1;
    g.textBaseline = "alphabetic";
    g.font = `800 200px ${fonts.display}`;
    g.fillStyle = col("text");
    g.fillText("A", W * 0.5, H * 0.6);
    g.font = `400 200px ${fonts.arab}`;
    g.fillStyle = col("acc");
    g.fillText("ع", W * 0.72, H * 0.58);
  } else if (k === "ecg") {
    for (let row = 0; row < 11; row++) {
      const y0 = 60 + row * 32,
        main = row === 5;
      g.globalAlpha = main ? 1 : 0.14 + 0.05 * (row % 4);
      g.lineWidth = main ? 3 : 1.3;
      g.beginPath();
      let x = -10;
      g.moveTo(x, y0);
      while (x < W + 40) {
        x += 30 + r() * 80;
        g.lineTo(x, y0);
        if (r() < 0.6) {
          const amp = main ? 90 : 18 + r() * 34;
          g.lineTo(x + 8, y0 - 6);
          g.lineTo(x + 14, y0 + 5);
          g.lineTo(x + 22, y0 - amp);
          g.lineTo(x + 31, y0 + amp * 0.3);
          g.lineTo(x + 40, y0);
          x += 40;
        }
      }
      g.stroke();
    }
    g.globalAlpha = 0.9;
    g.shadowColor = col("acc");
    g.shadowBlur = 24;
    g.beginPath();
    g.arc(W * 0.78, 60 + 5 * 32, 7, 0, Math.PI * 2);
    g.fill();
    g.shadowBlur = 0;
  } else if (k === "bars") {
    g.globalAlpha = 0.12;
    g.lineWidth = 1;
    for (let y = 40; y < H; y += 44) {
      g.beginPath();
      g.moveTo(0, y);
      g.lineTo(W, y);
      g.stroke();
    }
    for (let i = 0; i < 15; i++) {
      const x = 300 + i * 32,
        h = 70 + i * 14 + r() * 110,
        y = H - 70 - h;
      const gr = g.createLinearGradient(0, y, 0, y + h);
      gr.addColorStop(0, col("acc", 0.95));
      gr.addColorStop(1, col("acc", 0.05));
      g.globalAlpha = 1;
      g.fillStyle = gr;
      g.beginPath();
      rrect(x, y, 20, h, 5);
      g.fill();
    }
    g.globalAlpha = 0.85;
    g.strokeStyle = col("text");
    g.lineWidth = 1.4;
    g.beginPath();
    rrect(44, 44, 220, 270, 14);
    g.stroke();
    g.globalAlpha = 0.45;
    for (let i = 0; i < 7; i++) {
      g.beginPath();
      g.moveTo(70, 96 + i * 28);
      g.lineTo(70 + 90 + r() * 70, 96 + i * 28);
      g.stroke();
    }
    g.globalAlpha = 1;
    g.fillStyle = col("acc");
    g.beginPath();
    rrect(70, 268, 100, 24, 12);
    g.fill();
  } else if (k === "hex") {
    const s = 28,
      hw = Math.sqrt(3) * s;
    for (let row = -1; row < H / (s * 1.5) + 1; row++)
      for (let cl = -1; cl < W / hw + 1; cl++) {
        const cx = cl * hw + (row % 2 ? hw / 2 : 0),
          cy = row * s * 1.5;
        const d = Math.hypot(cx - W * 0.7, cy - H * 0.4);
        g.beginPath();
        for (let j = 0; j < 6; j++) {
          const a = Math.PI / 6 + (j * Math.PI) / 3;
          const px = cx + s * 0.92 * Math.cos(a),
            py = cy + s * 0.92 * Math.sin(a);
          if (j) g.lineTo(px, py);
          else g.moveTo(px, py);
        }
        g.closePath();
        if (d < 150 || r() < 0.06) {
          g.globalAlpha = d < 150 ? 0.85 - d / 220 : 0.5;
          g.fill();
        } else {
          g.globalAlpha = 0.22;
          g.lineWidth = 1;
          g.stroke();
        }
      }
  } else if (k === "stars") {
    const star = (cx: number, cy: number, sz: number) => {
      g.beginPath();
      for (let j = 0; j < 16; j++) {
        const a = (j * Math.PI) / 8 - Math.PI / 2,
          rr = j % 2 ? sz * 0.62 : sz;
        const px = cx + rr * Math.cos(a),
          py = cy + rr * Math.sin(a);
        if (j) g.lineTo(px, py);
        else g.moveTo(px, py);
      }
      g.closePath();
    };
    for (let y = 0; y <= H + 100; y += 100)
      for (let x = 0; x <= W + 100; x += 100) {
        g.globalAlpha = 0.32;
        g.lineWidth = 1.2;
        star(x, y, 34);
        g.stroke();
        g.globalAlpha = 0.16;
        g.beginPath();
        g.moveTo(x + 34, y);
        g.lineTo(x + 66, y);
        g.moveTo(x, y + 34);
        g.lineTo(x, y + 66);
        g.stroke();
        g.globalAlpha = 0.5;
        g.beginPath();
        g.arc(x, y, 4, 0, Math.PI * 2);
        g.fill();
      }
    g.globalAlpha = 1;
    g.lineWidth = 2.4;
    g.fillStyle = col("acc", 0.12);
    star(W * 0.7, H * 0.4, 130);
    g.fill();
    g.stroke();
    g.fillStyle = col("acc");
    g.lineWidth = 1.4;
    star(W * 0.7, H * 0.4, 70);
    g.stroke();
  } else if (k === "arch") {
    // Map contours behind an arcade of arches
    for (let i = 0; i < 12; i++) {
      g.globalAlpha = 0.08 + i * 0.022;
      g.lineWidth = 1;
      g.beginPath();
      for (let s = 0; s <= 126; s++) {
        const a = (s / 126) * Math.PI * 2,
          rr = 40 + i * 26 + Math.sin(a * 3 + i * 0.7) * 10 + Math.sin(a * 5 + i) * 6;
        const x = W * 0.72 + Math.cos(a) * rr * 1.3,
          y = H * 0.36 + Math.sin(a) * rr * 0.8;
        if (s) g.lineTo(x, y);
        else g.moveTo(x, y);
      }
      g.closePath();
      g.stroke();
    }
    const n = 5,
      aw = 72,
      gap = 14,
      baseY = H * 0.6,
      topY = H * 0.24,
      x0 = W * 0.72 - (n * aw + (n - 1) * gap) / 2;
    for (let i = 0; i < n; i++) {
      const x = x0 + i * (aw + gap),
        rad = aw / 2,
        mid = i === 2;
      g.globalAlpha = mid ? 1 : 0.7;
      g.lineWidth = mid ? 2.6 : 1.6;
      g.beginPath();
      g.moveTo(x, baseY);
      g.lineTo(x, topY + rad);
      g.arc(x + rad, topY + rad, rad, Math.PI, 0);
      g.lineTo(x + aw, baseY);
      g.stroke();
      if (mid) {
        const gl = g.createLinearGradient(0, topY, 0, baseY);
        gl.addColorStop(0, col("acc", 0.4));
        gl.addColorStop(1, col("acc", 0));
        g.fillStyle = gl;
        g.fill();
        g.fillStyle = col("acc");
      }
    }
    g.globalAlpha = 0.9;
    g.lineWidth = 1.6;
    g.beginPath();
    g.moveTo(x0 - 24, baseY);
    g.lineTo(x0 + n * aw + (n - 1) * gap + 24, baseY);
    g.stroke();
    g.globalAlpha = 0.2;
    g.lineWidth = 1;
    for (let i = 0; i < 6; i++) {
      g.beginPath();
      g.moveTo(x0 + r() * 60, baseY + 14 + i * 9);
      g.lineTo(x0 + n * aw + r() * 40, baseY + 14 + i * 9);
      g.stroke();
    }
  } else if (k === "circuit") {
    // Circuit traces running out of a chip
    const cell = 22,
      cx0 = W * 0.7,
      cy0 = H * 0.38;
    for (let t = 0; t < 30; t++) {
      const side = t % 4;
      let x: number, y: number, dx: number, dy: number;
      if (side === 0) {
        x = cx0 - 70;
        y = cy0 - 44 + r() * 88;
        dx = -1;
        dy = 0;
      } else if (side === 1) {
        x = cx0 + 70;
        y = cy0 - 44 + r() * 88;
        dx = 1;
        dy = 0;
      } else if (side === 2) {
        x = cx0 - 58 + r() * 116;
        y = cy0 - 55;
        dx = 0;
        dy = -1;
      } else {
        x = cx0 - 58 + r() * 116;
        y = cy0 + 55;
        dx = 0;
        dy = 1;
      }
      const hot = r() < 0.25;
      g.globalAlpha = hot ? 0.95 : 0.22 + r() * 0.35;
      g.lineWidth = hot ? 2.2 : 1.2;
      g.beginPath();
      g.moveTo(x, y);
      const segs = 2 + ((r() * 4) | 0);
      for (let q = 0; q < segs; q++) {
        const len = cell * (1 + ((r() * 4) | 0));
        x += dx * len;
        y += dy * len;
        g.lineTo(x, y);
        if (r() < 0.55) {
          const turn = r() < 0.5 ? 1 : -1,
            ndx = dx === 0 ? turn : dx,
            ndy = dy === 0 ? turn : dy,
            l2 = cell * (1 + ((r() * 2) | 0));
          x += ndx * l2;
          y += ndy * l2;
          g.lineTo(x, y);
        }
      }
      g.stroke();
      g.beginPath();
      g.arc(x, y, hot ? 5 : 3.5, 0, Math.PI * 2);
      if (hot) g.fill();
      else g.stroke();
    }
    g.globalAlpha = 1;
    g.fillStyle = col("panel");
    g.lineWidth = 2;
    g.beginPath();
    rrect(cx0 - 70, cy0 - 55, 140, 110, 12);
    g.fill();
    g.stroke();
    g.fillStyle = col("acc");
    g.globalAlpha = 0.9;
    for (let i = 0; i < 6; i++) {
      g.fillRect(cx0 - 52 + i * 20, cy0 - 63, 6, 8);
      g.fillRect(cx0 - 52 + i * 20, cy0 + 55, 6, 8);
    }
    g.globalAlpha = 0.25;
    g.beginPath();
    rrect(cx0 - 40, cy0 - 26, 80, 52, 8);
    g.fill();
  } else if (k === "isobar") {
    // Isobars around two pressure centres, and a sun
    (
      [
        [W * 0.66, H * 0.48, 0],
        [W * 0.95, H * 0.12, 1],
      ] as const
    ).forEach(([cx, cy, ci]) => {
      for (let i = 0; i < 9; i++) {
        const rr = 26 + i * 28;
        g.globalAlpha = 0.55 - i * 0.045;
        g.lineWidth = i === 0 ? 2 : 1.2;
        g.beginPath();
        for (let s = 0; s <= 160; s++) {
          const a = (s / 160) * Math.PI * 2,
            w = rr * (1 + 0.12 * Math.sin(a * 2 + ci * 2 + i * 0.3) + 0.05 * Math.sin(a * 5 + i));
          const x = cx + Math.cos(a) * w * 1.25,
            y = cy + Math.sin(a) * w * 0.85;
          if (s) g.lineTo(x, y);
          else g.moveTo(x, y);
        }
        g.closePath();
        g.stroke();
      }
    });
    const sx = W * 0.3,
      sy = H * 0.3;
    const sg = g.createRadialGradient(sx, sy, 4, sx, sy, 120);
    sg.addColorStop(0, col("acc", 0.85));
    sg.addColorStop(0.35, col("acc", 0.25));
    sg.addColorStop(1, col("acc", 0));
    g.globalAlpha = 1;
    g.fillStyle = sg;
    g.beginPath();
    g.arc(sx, sy, 120, 0, Math.PI * 2);
    g.fill();
    g.fillStyle = col("acc");
    g.beginPath();
    g.arc(sx, sy, 30, 0, Math.PI * 2);
    g.fill();
    g.lineWidth = 2;
    for (let i = 0; i < 16; i++) {
      const a = (i / 16) * Math.PI * 2,
        r1 = 44,
        r2 = i % 2 ? 62 : 76;
      g.globalAlpha = 0.85;
      g.beginPath();
      g.moveTo(sx + Math.cos(a) * r1, sy + Math.sin(a) * r1);
      g.lineTo(sx + Math.cos(a) * r2, sy + Math.sin(a) * r2);
      g.stroke();
    }
  }
  g.globalAlpha = 1;
  g.shadowBlur = 0;
  const sh = g.createLinearGradient(0, H * 0.5, 0, H);
  sh.addColorStop(0, col("bg", 0));
  sh.addColorStop(1, col("bg", 0.9));
  g.fillStyle = sh;
  g.fillRect(0, 0, W, H);
  g.fillStyle = col("acc");
  g.font = `500 17px ${fonts.mono}`;
  g.fillText(p.techs.slice(0, 3).join(techSep), 44, H - 92);
  g.fillStyle = col("text");
  g.font = `800 46px ${fonts.display}`;
  g.fillText(p.title, 42, H - 44);
  for (let i = 0; i < 2600; i++) {
    g.globalAlpha = 0.05;
    g.fillStyle = r() > 0.5 ? col("sparkle") : col("shadow");
    g.fillRect(r() * W, r() * H, 1.4, 1.4);
  }
  return c.toDataURL("image/jpeg", 0.88);
}
