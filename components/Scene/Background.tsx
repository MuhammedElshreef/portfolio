"use client";

import dynamic from "next/dynamic";

// Three.js touches WebGL/window — client-only, no SSR.
const SceneCanvas = dynamic(() => import("./SceneCanvas"), { ssr: false });

export default function Background() {
  return <SceneCanvas />;
}
