"use client";

import { Canvas } from "@react-three/fiber";
import { useMemo } from "react";
import ParticleField from "./ParticleField";
import WaveGrid from "./WaveGrid";
import { useMediaQuery } from "./useMediaQuery";

export type SceneSettings = {
  reducedMotion: boolean;
  particleCount: number;
};

export default function SceneCanvas() {
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const smallScreen = useMediaQuery("(max-width: 768px)");

  const settings = useMemo<SceneSettings>(
    () => ({
      reducedMotion,
      particleCount: reducedMotion ? 900 : smallScreen ? 1800 : 4500,
    }),
    [reducedMotion, smallScreen]
  );

  return (
    <div className="fixed inset-0 -z-10" aria-hidden>
      <Canvas
        camera={{ position: [0, 0, 14], fov: 50 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      >
        <ParticleField settings={settings} />
        <WaveGrid settings={settings} />
      </Canvas>
    </div>
  );
}
