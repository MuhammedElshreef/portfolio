"use client";

import dynamic from "next/dynamic";

// three.js is only ever loaded in the browser, in its own chunk
const ParticleSkyGL = dynamic(() => import("./ParticleSkyGL"), { ssr: false });

export default function ParticleSky() {
  return <ParticleSkyGL />;
}
