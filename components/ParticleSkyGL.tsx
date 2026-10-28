"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { fontFamily, prefersReducedMotion, store } from "@/lib/store";

/*
  The fixed particle sky behind the whole page, in raw three.js.
  The hero is a rotating night-sky galaxy with constellation lines that reach for the
  cursor, and a click shockwave. Scroll (store.stage) morphs the particles into "</>",
  then a globe with an orbit ring, then a starfield.
*/

const pointVS = /* glsl */ `
  attribute float aSize;
  attribute float aSeed;
  attribute float aSpeed;
  uniform float uTime;
  uniform float uPx;
  uniform float uScale;
  uniform float uSizeK;
  uniform float uTw;
  uniform float uAlpha;
  uniform vec3 uC1;
  uniform vec3 uC2;
  uniform vec3 uC3;
  uniform vec3 uC4;
  uniform vec3 uSpark;
  uniform vec3 uHot;
  varying vec3 vColor;
  varying float vA;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mv;
    float tw = (1.0 - uTw) + uTw * sin(uTime * 2.3 + aSeed * 43.0);
    gl_PointSize = max(1.0, aSize * uScale * uSizeK * uPx * tw * (1.0 + aSpeed * 0.9) / -mv.z);
    vec3 baseC = aSeed < 0.28 ? uC1 : aSeed < 0.6 ? uC2 : aSeed < 0.86 ? uC3 : aSeed < 0.97 ? uC4 : uSpark;
    vColor = mix(baseC, uHot, clamp(aSpeed, 0.0, 1.0));
    vA = uAlpha * (0.55 + 0.45 * tw) * smoothstep(30.0, 3.5, -mv.z);
  }
`;
const pointFS = /* glsl */ `
  uniform vec3 uSpark;
  varying vec3 vColor;
  varying float vA;
  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float d2 = dot(uv, uv);
    if (d2 > 0.25) discard;
    float halo = exp(-d2 * 18.0) * 0.55;
    float core = exp(-d2 * 140.0);
    vec3 col = mix(vColor, uSpark, core * 0.55);
    gl_FragColor = vec4(col, (halo + core) * vA);
  }
`;
const lineVS = /* glsl */ `
  attribute float aAlpha;
  varying float vAl;
  void main() { vAl = aAlpha; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
`;
const lineFS = /* glsl */ `
  uniform float uLine;
  uniform vec3 uLineC;
  varying float vAl;
  void main() { gl_FragColor = vec4(uLineC, vAl * uLine); }
`;

export default function ParticleSkyGL() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvasEl = ref.current;
    if (!canvasEl) return;
    const canvas: HTMLCanvasElement = canvasEl;
    const root = document.documentElement;
    const fallback = () => root.classList.add("no-gl");
    let dead = false;
    const disposers: (() => void)[] = [];
    const on = <K extends keyof WindowEventMap>(
      t: Window,
      type: K,
      fn: (e: WindowEventMap[K]) => void,
      opts?: AddEventListenerOptions,
    ) => {
      t.addEventListener(type, fn, opts);
      disposers.push(() => t.removeEventListener(type, fn, opts));
    };

    if (prefersReducedMotion()) fallback();
    else
      start().catch((err) => {
        if (dead) return;
        console.warn("Particles disabled:", err);
        fallback();
      });

    async function start() {
      let renderer: THREE.WebGLRenderer;
      try {
        renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: true, powerPreference: "high-performance" });
      } catch {
        fallback();
        return;
      }
      disposers.push(() => renderer.dispose());
      if (!renderer.getContext()) {
        fallback();
        return;
      }

      const coarse = matchMedia("(pointer: coarse)").matches;
      const mobile = coarse || Math.min(innerWidth, innerHeight) < 700;
      const N = mobile ? 8000 : 20000;
      // DPR cap
      const DPR = Math.min(window.devicePixelRatio || 1, 2);
      renderer.setPixelRatio(DPR);
      renderer.setSize(innerWidth, innerHeight, false);
      renderer.setClearColor(0x000000, 0);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(45, innerWidth / innerHeight, 0.1, 100);
      camera.position.set(0, 0, 10);

      // ---------- Particle buffers ----------
      const pos = new Float32Array(N * 3),
        vel = new Float32Array(N * 3);
      const speed = new Float32Array(N),
        size = new Float32Array(N),
        seed = new Float32Array(N),
        delay = new Float32Array(N);
      for (let i = 0; i < N; i++) {
        seed[i] = Math.random();
        size[i] = 0.4 + Math.random() * 0.8;
      }
      const geo = new THREE.BufferGeometry();
      const posAttr = new THREE.BufferAttribute(pos, 3);
      posAttr.setUsage(THREE.DynamicDrawUsage);
      const speedAttr = new THREE.BufferAttribute(speed, 1);
      speedAttr.setUsage(THREE.DynamicDrawUsage);
      geo.setAttribute("position", posAttr);
      geo.setAttribute("aSpeed", speedAttr);
      geo.setAttribute("aSize", new THREE.BufferAttribute(size, 1));
      geo.setAttribute("aSeed", new THREE.BufferAttribute(seed, 1));
      const V3 = () => new THREE.Vector3(0.5, 0.5, 0.5);
      const U = {
        uTime: { value: 0 },
        uPx: { value: DPR },
        uScale: { value: mobile ? 30 : 34 },
        uSizeK: { value: 1 },
        uTw: { value: 0.4 },
        uAlpha: { value: 0 },
        uC1: { value: V3() },
        uC2: { value: V3() },
        uC3: { value: V3() },
        uC4: { value: V3() },
        uSpark: { value: V3() },
        uHot: { value: V3() },
      };
      const mat = new THREE.ShaderMaterial({
        uniforms: U,
        vertexShader: pointVS,
        fragmentShader: pointFS,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });
      const points = new THREE.Points(geo, mat);
      points.frustumCulled = false;
      scene.add(points);
      disposers.push(() => {
        geo.dispose();
        mat.dispose();
      });

      // ---------- Constellation lines ----------
      const MAXP = mobile ? 70 : 130,
        MAXC = 26,
        MAXV = (MAXP + MAXC) * 2;
      const lpos = new Float32Array(MAXV * 3),
        lal = new Float32Array(MAXV);
      const lgeo = new THREE.BufferGeometry();
      const lposAttr = new THREE.BufferAttribute(lpos, 3);
      lposAttr.setUsage(THREE.DynamicDrawUsage);
      const lalAttr = new THREE.BufferAttribute(lal, 1);
      lalAttr.setUsage(THREE.DynamicDrawUsage);
      lgeo.setAttribute("position", lposAttr);
      lgeo.setAttribute("aAlpha", lalAttr);
      lgeo.setDrawRange(0, 0);
      const LU = { uLine: { value: 0 }, uLineC: { value: V3() } };
      // Read the palette tokens straight from CSS, so the sky follows any palette switch
      let palV = -1;
      function syncPalette() {
        const cs = getComputedStyle(root);
        const get = (k: string): number[] => {
          const v = cs
            .getPropertyValue(`--${k}-rgb`)
            .trim()
            .split(/[\s,/]+/)
            .map(Number);
          return v.length >= 3 && v.slice(0, 3).every((n) => Number.isFinite(n))
            ? v.slice(0, 3).map((n) => n / 255)
            : [0.5, 0.5, 0.5];
        };
        const set = (u: { value: THREE.Vector3 }, c: number[]) => u.value.set(c[0], c[1], c[2]);
        const lo = get("acc-lo"),
          a2 = get("acc2"),
          ac = get("acc"),
          hi = get("acc-hi"),
          sp = get("sparkle");
        set(U.uC1, lo);
        set(U.uC2, a2);
        set(U.uC3, ac);
        set(U.uC4, hi);
        set(U.uSpark, sp);
        set(U.uHot, [hi[0] * 0.45 + sp[0] * 0.55, hi[1] * 0.45 + sp[1] * 0.55, hi[2] * 0.45 + sp[2] * 0.55]);
        set(LU.uLineC, hi);
      }
      syncPalette();
      const lmat = new THREE.ShaderMaterial({
        uniforms: LU,
        vertexShader: lineVS,
        fragmentShader: lineFS,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });
      const lines = new THREE.LineSegments(lgeo, lmat);
      lines.frustumCulled = false;
      scene.add(lines);
      disposers.push(() => {
        lgeo.dispose();
        lmat.dispose();
      });
      let pairs = new Int32Array(0);

      // ---------- The code glyph is sampled from type ----------
      const mono = fontFamily("--font-jetbrains", '"JetBrains Mono"');
      if (document.fonts && document.fonts.load) {
        await Promise.race([
          document.fonts.load(`800 200px ${mono}`, "</>"),
          new Promise((r) => setTimeout(r, 2500)),
        ]).catch(() => {});
      }
      if (dead) return;
      function sampleTextRaw(text: string, family: string, weight: number, step: number) {
        const cw = 1400,
          ch = 600;
        const c = document.createElement("canvas");
        c.width = cw;
        c.height = ch;
        const g = c.getContext("2d", { willReadFrequently: true });
        if (!g) return null;
        let fs = 300;
        g.font = `${weight} ${fs}px ${family}, monospace`;
        const m = g.measureText(text).width || 1;
        fs = Math.min((fs * cw * 0.86) / m, ch * 0.6);
        g.font = `${weight} ${fs}px ${family}, monospace`;
        g.fillStyle = "#fff";
        g.textAlign = "center";
        g.textBaseline = "middle";
        g.fillText(text, cw / 2, ch / 2);
        const data = g.getImageData(0, 0, cw, ch).data;
        const pts: number[] = [];
        let minX = 1e9,
          maxX = -1e9,
          minY = 1e9,
          maxY = -1e9;
        for (let y = 0; y < ch; y += step)
          for (let x = 0; x < cw; x += step) {
            if (data[(y * cw + x) * 4 + 3] < 128) continue;
            pts.push(x, y);
            if (x < minX) minX = x;
            if (x > maxX) maxX = x;
            if (y < minY) minY = y;
            if (y > maxY) maxY = y;
          }
        const n = pts.length / 2;
        if (!n) return null;
        const out = new Float32Array(N * 2),
          bw = Math.max(1, maxX - minX),
          bh = Math.max(1, maxY - minY),
          mx = (minX + maxX) / 2,
          my = (minY + maxY) / 2;
        for (let i = 0; i < N; i++) {
          const k = ((Math.random() * n) | 0) * 2;
          out[i * 2] = (pts[k] - mx + (Math.random() - 0.5) * step) / bw;
          out[i * 2 + 1] = -(pts[k + 1] - my + (Math.random() - 0.5) * step) / bw;
        }
        return { pts: out, aspect: bh / bw };
      }
      const CODE = sampleTextRaw("</>", mono, 800, 3);

      // ---------- Formations: night sky, code glyph, globe, starfield ----------
      const F = [new Float32Array(N * 3), new Float32Array(N * 3), new Float32Array(N * 3), new Float32Array(N * 3)];
      const GAL = new Float32Array(N * 3),
        galStatic = new Uint8Array(N),
        SPH = new Float32Array(N * 3),
        ROT0 = new Float32Array(N * 3);
      let view = { w: 1, h: 1 },
        wide = true,
        galCenter: [number, number] = [0, 0];
      const visible = () => {
        const h = 2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.position.z;
        return { h, w: h * camera.aspect };
      };

      function placeText(
        raw: { pts: Float32Array; aspect: number } | null,
        out: Float32Array,
        maxW: number,
        maxH: number,
        cx: number,
        cy: number,
        zj: number,
      ) {
        if (!raw) {
          sphereInto(out, Math.min(maxW, maxH) * 0.5);
          return;
        }
        const sc = Math.min(maxW, maxH / raw.aspect);
        for (let i = 0; i < N; i++) {
          out[i * 3] = raw.pts[i * 2] * sc + cx;
          out[i * 3 + 1] = raw.pts[i * 2 + 1] * sc + cy;
          out[i * 3 + 2] = (Math.random() - 0.5) * zj;
        }
      }
      function sphereInto(out: Float32Array, r: number) {
        for (let i = 0; i < N; i++) {
          if (i % 7 === 0) {
            const a = Math.random() * Math.PI * 2,
              rr = r * (1.42 + (Math.random() - 0.5) * 0.08);
            out[i * 3] = Math.cos(a) * rr;
            out[i * 3 + 1] = (Math.random() - 0.5) * 0.04;
            out[i * 3 + 2] = Math.sin(a) * rr;
          } else {
            const y = 1 - (2 * (i + 0.5)) / N,
              rad = Math.sqrt(1 - y * y),
              phi = i * 2.399963,
              j = 1 + (Math.random() - 0.5) * 0.03;
            out[i * 3] = Math.cos(phi) * rad * r * j;
            out[i * 3 + 1] = y * r * j;
            out[i * 3 + 2] = Math.sin(phi) * rad * r * j;
          }
        }
      }
      function starsInto(out: Float32Array) {
        for (let i = 0; i < N; i++) {
          out[i * 3] = (Math.random() - 0.5) * view.w * 1.7;
          out[i * 3 + 1] = (Math.random() - 0.5) * view.h * 1.7;
          out[i * 3 + 2] = -9 + Math.random() * 11;
        }
      }
      const gauss = () => {
        let u = 0,
          v = 0;
        while (!u) u = Math.random();
        while (!v) v = Math.random();
        return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
      };
      function galaxyInto() {
        const Rg = Math.min(view.w, view.h) * (wide ? 0.62 : 0.55);
        // Portrait screens: the galaxy sits behind the vertically centred name
        galCenter = wide ? [view.w * 0.22, view.h * 0.02] : [0, view.h * 0.04];
        for (let i = 0; i < N; i++) {
          const i3 = i * 3;
          if (i % 8 === 0) {
            galStatic[i] = 1;
            GAL[i3] = (Math.random() - 0.5) * view.w * 1.5;
            GAL[i3 + 1] = (Math.random() - 0.5) * view.h * 1.5;
            GAL[i3 + 2] = -7 + Math.random() * 7;
          } else {
            galStatic[i] = 0;
            const arm = i % 3,
              t = Math.pow(Math.random(), 0.65),
              r = t * Rg + 0.04;
            const ang = arm * 2.0944 + t * 5.4 + gauss() * 0.24 * (1.1 - t * 0.6);
            GAL[i3] = Math.cos(ang) * r + gauss() * 0.04 * Rg;
            GAL[i3 + 2] = Math.sin(ang) * r + gauss() * 0.04 * Rg;
            GAL[i3 + 1] = gauss() * 0.045 * Rg * (1.2 - t);
          }
        }
      }
      function rotateGalaxy(t: number) {
        const a = t * 0.07,
          ca = Math.cos(a),
          sa = Math.sin(a),
          tilt = 1.08,
          ct = Math.cos(tilt),
          st = Math.sin(tilt);
        const [cx, cy] = galCenter;
        for (let i = 0; i < N; i++) {
          const i3 = i * 3;
          if (galStatic[i]) {
            ROT0[i3] = GAL[i3];
            ROT0[i3 + 1] = GAL[i3 + 1];
            ROT0[i3 + 2] = GAL[i3 + 2];
            continue;
          }
          const x = GAL[i3],
            y = GAL[i3 + 1],
            z = GAL[i3 + 2];
          const x1 = x * ca + z * sa,
            z1 = -x * sa + z * ca;
          ROT0[i3] = x1 + cx;
          ROT0[i3 + 1] = y * ct - z1 * st + cy;
          ROT0[i3 + 2] = y * st + z1 * ct;
        }
      }
      function rotateSphere(t: number) {
        const a = t * 0.18,
          ca = Math.cos(a),
          sa = Math.sin(a),
          tilt = 0.42,
          ct = Math.cos(tilt),
          st = Math.sin(tilt),
          src = F[2];
        for (let i = 0; i < N; i++) {
          const i3 = i * 3,
            x = src[i3],
            y = src[i3 + 1],
            z = src[i3 + 2];
          const x1 = x * ca + z * sa,
            z1 = -x * sa + z * ca;
          SPH[i3] = x1;
          SPH[i3 + 1] = y * ct - z1 * st;
          SPH[i3 + 2] = y * st + z1 * ct;
        }
      }
      // Constellations: pairs of near neighbours among the fixed background stars
      function buildPairs(arr: Float32Array, count: number, dmin: number, dmax: number, only: Uint8Array | null) {
        const cell = dmax,
          grid = new Map<string, number[]>(),
          out: number[] = [],
          pool: number[] = [];
        for (let i = 0; i < N; i++) {
          if (only && !only[i]) continue;
          pool.push(i);
          const k = `${Math.floor(arr[i * 3] / cell)},${Math.floor(arr[i * 3 + 1] / cell)}`;
          let b = grid.get(k);
          if (!b) grid.set(k, (b = []));
          b.push(i);
        }
        if (!pool.length) return new Int32Array(0);
        let tries = 0;
        while (out.length < count * 2 && tries < count * 12) {
          tries++;
          const i = pool[(Math.random() * pool.length) | 0];
          const gx = Math.floor(arr[i * 3] / cell),
            gy = Math.floor(arr[i * 3 + 1] / cell),
            cand: number[] = [];
          for (let ox = -1; ox <= 1; ox++)
            for (let oy = -1; oy <= 1; oy++) {
              const b = grid.get(`${gx + ox},${gy + oy}`);
              if (b) for (let q = 0; q < b.length && cand.length < 40; q++) cand.push(b[q]);
            }
          if (!cand.length) continue;
          const j = cand[(Math.random() * cand.length) | 0];
          if (j === i) continue;
          const dx = arr[i * 3] - arr[j * 3],
            dy = arr[i * 3 + 1] - arr[j * 3 + 1],
            dz = arr[i * 3 + 2] - arr[j * 3 + 2];
          const dd = Math.sqrt(dx * dx + dy * dy + dz * dz);
          if (dd > dmin && dd < dmax) out.push(i, j);
        }
        return new Int32Array(out.slice(0, count * 2));
      }
      function build() {
        view = visible();
        wide = view.w > view.h * 1.05;
        galaxyInto();
        rotateGalaxy(0);
        F[0].set(ROT0);
        pairs = buildPairs(GAL, MAXP, view.h * 0.03, view.h * 0.13, galStatic);
        if (wide) placeText(CODE, F[1], view.w * 0.3, view.h * 0.42, view.w * 0.24, 0, 0.45);
        else placeText(CODE, F[1], view.w * 0.72, view.h * 0.26, 0, view.h * 0.2, 0.45);
        sphereInto(F[2], Math.min(view.w, view.h) * (wide ? 0.3 : 0.34));
        starsInto(F[3]);
        for (let i = 0; i < N; i++) {
          const xn = F[0][i * 3] / view.w + 0.5;
          delay[i] = Math.min(1, Math.max(0, 0.65 * xn + 0.35 * Math.random()));
        }
      }
      build();
      pos.set(F[3]);

      // ---------- Pointer and shockwave ----------
      const mouse = { x: 0, y: 0, t: -1e9 };
      on(
        window,
        "pointermove",
        (e) => {
          mouse.x = (e.clientX / innerWidth) * 2 - 1;
          mouse.y = -(e.clientY / innerHeight) * 2 + 1;
          mouse.t = performance.now();
        },
        { passive: true },
      );
      const tmp = new THREE.Vector3(),
        dir = new THREE.Vector3();
      function toWorld(nx: number, ny: number): [number, number] {
        tmp.set(nx, ny, 0.5).unproject(camera);
        dir.copy(tmp).sub(camera.position).normalize();
        const d = -camera.position.z / dir.z;
        return [camera.position.x + dir.x * d, camera.position.y + dir.y * d];
      }
      let flash = 0;
      function burst(clientX: number, clientY: number) {
        const [bx, by] = toWorld((clientX / innerWidth) * 2 - 1, -(clientY / innerHeight) * 2 + 1);
        for (let i = 0; i < N; i++) {
          const i3 = i * 3,
            dx = pos[i3] - bx,
            dy = pos[i3 + 1] - by,
            dz = pos[i3 + 2];
          const d = Math.sqrt(dx * dx + dy * dy + dz * dz) + 1e-3,
            imp = 0.75 * Math.exp(-d * 0.42) + 0.05;
          vel[i3] += (dx / d) * imp;
          vel[i3 + 1] += (dy / d) * imp;
          vel[i3 + 2] += (Math.random() - 0.3) * imp * 1.6;
        }
        flash = 1;
      }
      const hero = document.getElementById("hero");
      if (hero) {
        const down = (e: PointerEvent) => {
          if ((e.target as Element).closest("a, button, h1, .hero-side")) return;
          burst(e.clientX, e.clientY);
        };
        hero.addEventListener("pointerdown", down);
        disposers.push(() => hero.removeEventListener("pointerdown", down));
      }

      // Hero feel eases toward the scroll formations as you leave the hero
      type Feel = { sizeK: number; tw: number; R: number; push: number; zpush: number; damp: number };
      const HERO: Feel = { sizeK: 0.95, tw: 0.42, R: 0.8, push: 0.03, zpush: 0.4, damp: 0.88 };
      const SCROLLK: Feel = { sizeK: 1, tw: 0.38, R: 0.95, push: 0.05, zpush: 0.7, damp: 0.87 };
      const FEEL_KEYS = Object.keys(HERO) as (keyof Feel)[];
      const cur: Feel = { ...HERO };
      const cursorIdx = new Int32Array(MAXC),
        cursorA = new Float32Array(MAXC);

      let time = 0,
        last = performance.now(),
        raf = 0,
        stageS = 0,
        alphaS = 1,
        intro = 0,
        lineS = 0;
      const goAt = performance.now() + 6000;
      function tick(now: number) {
        raf = requestAnimationFrame(tick);
        const dt = Math.min(0.05, (now - last) / 1000);
        last = now;
        const k60 = dt * 60;
        time += dt;
        if (store.go || now > goAt) intro = Math.min(1, intro + dt / 2.6);
        stageS += (store.stage - stageS) * Math.min(1, dt * 3.5);
        alphaS += (store.alpha - alphaS) * Math.min(1, dt * 2.5);
        flash *= Math.pow(0.92, k60);

        const heroW = 1 - Math.min(1, Math.max(0, stageS / 0.45));
        for (const k of FEEL_KEYS) {
          const want = SCROLLK[k] + (HERO[k] - SCROLLK[k]) * heroW;
          cur[k] += (want - cur[k]) * Math.min(1, dt * 4);
        }
        lineS += (heroW * intro - lineS) * Math.min(1, dt * 3);

        if (store.palV !== palV) {
          palV = store.palV;
          syncPalette();
        }
        U.uTime.value = time;
        U.uSizeK.value = cur.sizeK;
        U.uTw.value = cur.tw;
        U.uAlpha.value = alphaS * (0.15 + 0.85 * intro) * (1 + flash * 0.6) * 0.85;
        LU.uLine.value = lineS * 0.5;

        camera.position.x += (mouse.x * 0.5 - camera.position.x) * 0.035 * k60;
        camera.position.y += (mouse.y * 0.32 - camera.position.y) * 0.035 * k60;
        camera.lookAt(0, 0, 0);

        const st = Math.max(0, Math.min(3, stageS));
        let a = Math.floor(st);
        if (a > 2) a = 2;
        const f = st - a;
        if (a === 1 || a === 2) rotateSphere(time);
        if (a === 0) rotateGalaxy(time);
        const A = a === 0 ? ROT0 : a === 2 ? SPH : F[a];
        const B = a + 1 === 2 ? SPH : F[a + 1];

        const mOn = now - mouse.t < 2500;
        let mwx = 1e6,
          mwy = 1e6;
        if (mOn) [mwx, mwy] = toWorld(mouse.x, mouse.y);
        const R = (mobile ? 0.6 : 1) * cur.R,
          R2 = R * R,
          push = cur.push * k60,
          zp = cur.zpush;
        const stiff = (0.006 + 0.034 * intro * intro) * k60;
        const damp = Math.pow(cur.damp, k60);
        const tw = time * 0.7;
        const wantCursor = mOn && lineS > 0.05;
        const RC = 1.6,
          RC2 = RC * RC;
        let nc = 0;

        for (let i = 0; i < N; i++) {
          const i3 = i * 3;
          let e = f * 1.55 - delay[i] * 0.55;
          e = e < 0 ? 0 : e > 1 ? 1 : e;
          e = e * e * (3 - 2 * e);
          const sd = seed[i] * 20;
          const tx = A[i3] + (B[i3] - A[i3]) * e + Math.sin(tw + sd) * 0.014;
          const ty = A[i3 + 1] + (B[i3 + 1] - A[i3 + 1]) * e + Math.cos(tw * 1.3 + sd) * 0.014;
          const tz = A[i3 + 2] + (B[i3 + 2] - A[i3 + 2]) * e;
          let px = pos[i3],
            py = pos[i3 + 1],
            pz = pos[i3 + 2];
          let vx = vel[i3] + (tx - px) * stiff,
            vy = vel[i3 + 1] + (ty - py) * stiff,
            vz = vel[i3 + 2] + (tz - pz) * stiff;
          if (mOn) {
            const dx = px - mwx,
              dy = py - mwy,
              d2 = dx * dx + dy * dy;
            if (d2 < R2) {
              const d = Math.sqrt(d2) + 1e-4,
                fo = (1 - d / R) * push;
              vx += (dx / d) * fo;
              vy += (dy / d) * fo;
              vz += fo * zp;
            }
            if (wantCursor && nc < MAXC && d2 < RC2 && d2 > 0.04 && (i & 7) === 0) {
              cursorIdx[nc] = i;
              cursorA[nc] = 1 - Math.sqrt(d2) / RC;
              nc++;
            }
          }
          vx *= damp;
          vy *= damp;
          vz *= damp;
          px += vx * k60;
          py += vy * k60;
          pz += vz * k60;
          pos[i3] = px;
          pos[i3 + 1] = py;
          pos[i3 + 2] = pz;
          vel[i3] = vx;
          vel[i3 + 1] = vy;
          vel[i3 + 2] = vz;
          const s = Math.sqrt(vx * vx + vy * vy + vz * vz) * 14;
          speed[i] = s > 1 ? 1 : s;
        }

        // Lines: twinkling constellations plus threads to the cursor
        let v = 0;
        if (lineS > 0.01) {
          const np = pairs.length >> 1;
          for (let k = 0; k < np; k++) {
            const i = pairs[k * 2] * 3,
              j = pairs[k * 2 + 1] * 3,
              o = v * 3;
            lpos[o] = pos[i];
            lpos[o + 1] = pos[i + 1];
            lpos[o + 2] = pos[i + 2];
            lpos[o + 3] = pos[j];
            lpos[o + 4] = pos[j + 1];
            lpos[o + 5] = pos[j + 2];
            const al = 0.25 + 0.75 * (0.5 + 0.5 * Math.sin(time * 1.4 + k * 1.7));
            lal[v] = al;
            lal[v + 1] = al;
            v += 2;
          }
          for (let c = 0; c < nc; c++) {
            const i = cursorIdx[c] * 3,
              o = v * 3;
            lpos[o] = mwx;
            lpos[o + 1] = mwy;
            lpos[o + 2] = 0;
            lpos[o + 3] = pos[i];
            lpos[o + 4] = pos[i + 1];
            lpos[o + 5] = pos[i + 2];
            lal[v] = cursorA[c] * 1.6;
            lal[v + 1] = cursorA[c] * 0.6;
            v += 2;
          }
        }
        lgeo.setDrawRange(0, v);
        lposAttr.needsUpdate = true;
        lalAttr.needsUpdate = true;
        posAttr.needsUpdate = true;
        speedAttr.needsUpdate = true;
        renderer.render(scene, camera);
      }

      let resizeT = 0;
      let builtW = innerWidth,
        builtH = innerHeight;
      on(window, "resize", () => {
        renderer.setSize(innerWidth, innerHeight, false);
        camera.aspect = innerWidth / innerHeight;
        camera.updateProjectionMatrix();
        // Rebuild only for a real resize: a mobile URL bar collapsing must not re-randomise the sky
        if (innerWidth === builtW && Math.abs(innerHeight - builtH) <= 150) return;
        clearTimeout(resizeT);
        resizeT = window.setTimeout(() => {
          builtW = innerWidth;
          builtH = innerHeight;
          build();
        }, 180);
      });
      // Pause while the tab is hidden
      const onVis = () => {
        if (document.hidden) {
          cancelAnimationFrame(raf);
          raf = 0;
        } else if (!raf) {
          last = performance.now();
          raf = requestAnimationFrame(tick);
        }
      };
      document.addEventListener("visibilitychange", onVis);
      disposers.push(() => {
        document.removeEventListener("visibilitychange", onVis);
        cancelAnimationFrame(raf);
        raf = 0;
        clearTimeout(resizeT);
      });

      root.classList.add("gl-on");
      raf = requestAnimationFrame(tick);
    }

    return () => {
      dead = true;
      disposers.reverse().forEach((d) => d());
      disposers.length = 0;
      root.classList.remove("gl-on", "no-gl");
    };
  }, []);

  return <canvas id="gl" ref={ref} aria-hidden="true" />;
}
