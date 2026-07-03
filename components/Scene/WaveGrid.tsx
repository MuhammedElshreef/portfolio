"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import type { SceneSettings } from "./SceneCanvas";

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform vec2 uPointer;
  varying float vFade;

  void main() {
    vec3 p = position;
    p.y += sin(p.x * 0.22 + uTime * 0.5) * 0.7 + cos(p.z * 0.3 + uTime * 0.35) * 0.55;

    // A soft hill rises under the cursor
    float d = distance(p.xz, uPointer);
    p.y += exp(-d * d * 0.014) * 1.7;

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    // Melt away with distance so the horizon stays soft
    vFade = smoothstep(52.0, 16.0, -mv.z);
  }
`;

const fragmentShader = /* glsl */ `
  uniform vec3 uColor;
  uniform float uOpacity;
  varying float vFade;

  void main() {
    gl_FragColor = vec4(uColor, uOpacity * vFade);
  }
`;

const WIDTH = 96;
const NEAR = 9; // toward the camera
const FAR = -40;
const COLS = 56;
const ROWS = 26;

// A full-width wave-grid "floor" low in the hero background — ambient,
// never an object in the middle of the screen. Rides up with scroll.
export default function WaveGrid({ settings }: { settings: SceneSettings }) {
  const group = useRef<THREE.Group>(null);
  const material = useRef<THREE.ShaderMaterial>(null);
  const pointerNdc = useRef(new THREE.Vector2(0, -10));
  const pointerWorld = useRef(new THREE.Vector2(0, -200));
  const { viewport } = useThree();

  const positions = useMemo(() => {
    const pts: number[] = [];
    const xs = Array.from({ length: COLS + 1 }, (_, i) => -WIDTH / 2 + (WIDTH / COLS) * i);
    const zs = Array.from({ length: ROWS + 1 }, (_, i) => FAR + ((NEAR - FAR) / ROWS) * i);

    for (const z of zs) {
      for (let i = 0; i < COLS; i++) pts.push(xs[i], 0, z, xs[i + 1], 0, z);
    }
    for (const x of xs) {
      for (let i = 0; i < ROWS; i++) pts.push(x, 0, zs[i], x, 0, zs[i + 1]);
    }
    return new Float32Array(pts);
  }, []);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uPointer: { value: new THREE.Vector2(0, -200) },
      uColor: { value: new THREE.Color("#2563eb") },
      uOpacity: { value: 0.26 },
    }),
    []
  );

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointerNdc.current.set(
        (e.clientX / window.innerWidth) * 2 - 1,
        -(e.clientY / window.innerHeight) * 2 + 1
      );
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useFrame((state) => {
    const mat = material.current;
    if (mat && !settings.reducedMotion) {
      mat.uniforms.uTime.value = state.clock.elapsedTime;

      // Map the cursor onto the grid plane: screen x → grid x, screen y → depth
      const ndc = pointerNdc.current;
      const targetX = ndc.x * 26;
      const targetZ = 8 - ((ndc.y + 1) / 2) * 30;
      pointerWorld.current.lerp(new THREE.Vector2(targetX, targetZ), 0.08);
      mat.uniforms.uPointer.value.copy(pointerWorld.current);
    }
    if (group.current) {
      // Scrolls away with the hero (canvas itself is fixed)
      const scrollY = typeof window !== "undefined" ? window.scrollY : 0;
      const vh = typeof window !== "undefined" ? window.innerHeight : 1;
      group.current.position.y = -7.2 + (scrollY / vh) * viewport.height * 1.1;
    }
  });

  return (
    <group ref={group} position={[0, -7.2, 0]}>
      <lineSegments frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>
        <shaderMaterial
          ref={material}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={uniforms}
          transparent
          depthWrite={false}
        />
      </lineSegments>
    </group>
  );
}
