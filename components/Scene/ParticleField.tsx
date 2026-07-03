"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { scrollState } from "../SmoothScroll";
import type { SceneSettings } from "./SceneCanvas";

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uDrift;
  uniform vec2 uMouse;
  attribute float aScale;
  attribute float aTint;
  varying float vTint;
  varying float vFade;

  void main() {
    vec3 p = position;

    // Slow layered wave drift
    float t = uTime * 0.18;
    p.y += sin(p.x * 0.35 + t) * 0.6 + cos(p.z * 0.3 + t * 1.3) * 0.4;
    p.x += sin(p.y * 0.25 + t * 0.7) * 0.35;

    // Gentle pull toward the mouse
    p.x += uMouse.x * (0.6 + p.z * 0.04);
    p.y += uMouse.y * (0.4 + p.z * 0.03);

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = aScale * (26.0 / -mv.z) * (1.0 + uDrift * 0.6);

    vTint = aTint;
    vFade = smoothstep(28.0, 6.0, -mv.z);
  }
`;

const fragmentShader = /* glsl */ `
  uniform vec3 uBlue;
  uniform vec3 uInk;
  varying float vTint;
  varying float vFade;

  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);
    float alpha = smoothstep(0.5, 0.15, d) * vFade;
    vec3 color = mix(uInk, uBlue, step(0.35, vTint));
    gl_FragColor = vec4(color, alpha * mix(0.35, 0.6, vTint));
  }
`;

// Deterministic PRNG keeps the particle layout pure across renders.
function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export default function ParticleField({ settings }: { settings: SceneSettings }) {
  const points = useRef<THREE.Points>(null);
  const material = useRef<THREE.ShaderMaterial>(null);
  const mouse = useRef(new THREE.Vector2(0, 0));
  const smoothedMouse = useRef(new THREE.Vector2(0, 0));
  const drift = useRef(0);
  const { viewport } = useThree();

  const { positions, scales, tints } = useMemo(() => {
    const count = settings.particleCount;
    const rand = mulberry32(20260703);
    const positions = new Float32Array(count * 3);
    const scales = new Float32Array(count);
    const tints = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (rand() - 0.5) * 44;
      positions[i * 3 + 1] = (rand() - 0.5) * 26;
      positions[i * 3 + 2] = (rand() - 0.5) * 18;
      scales[i] = 0.5 + rand() * 1.5;
      // ~65% blue, ~35% warm ink for depth on the cream paper
      tints[i] = rand();
    }
    return { positions, scales, tints };
  }, [settings.particleCount]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uDrift: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uBlue: { value: new THREE.Color("#2563eb") },
      uInk: { value: new THREE.Color("#46382a") },
    }),
    []
  );

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      mouse.current.set(
        (e.clientX / window.innerWidth) * 2 - 1,
        -(e.clientY / window.innerHeight) * 2 + 1
      );
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useFrame((state) => {
    if (settings.reducedMotion) return;
    const mat = material.current;
    if (mat) {
      mat.uniforms.uTime.value = state.clock.elapsedTime;

      // Scroll velocity feeds a smoothed "drift" that livens the field while scrolling
      const target = Math.min(Math.abs(scrollState.velocity) * 0.02, 1);
      drift.current += (target - drift.current) * 0.06;
      mat.uniforms.uDrift.value = drift.current;

      smoothedMouse.current.lerp(mouse.current, 0.04);
      mat.uniforms.uMouse.value.copy(smoothedMouse.current);
    }

    if (points.current) {
      points.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.03) * 0.08;
      points.current.position.y = scrollState.progress * viewport.height * 0.4;
    }
  });

  return (
    <points ref={points} frustumCulled={false}>
      <bufferGeometry key={settings.particleCount}>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aScale" args={[scales, 1]} />
        <bufferAttribute attach="attributes-aTint" args={[tints, 1]} />
      </bufferGeometry>
      <shaderMaterial
        ref={material}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
      />
    </points>
  );
}
