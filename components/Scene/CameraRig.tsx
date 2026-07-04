"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import type { SceneSettings } from "./SceneCanvas";

// Drifts the camera a touch toward the pointer so the whole scene parallaxes,
// not just the particles. The drift is small — atmosphere, not a game camera.
export default function CameraRig({ settings }: { settings: SceneSettings }) {
  const pointer = useRef(new THREE.Vector2(0, 0));

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.current.set(
        (e.clientX / window.innerWidth) * 2 - 1,
        -(e.clientY / window.innerHeight) * 2 + 1
      );
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useFrame(({ camera }) => {
    if (settings.reducedMotion) return;
    camera.position.x += (pointer.current.x * 0.9 - camera.position.x) * 0.025;
    camera.position.y += (pointer.current.y * 0.55 - camera.position.y) * 0.025;
    camera.lookAt(0, 0, 0);
  });

  return null;
}
