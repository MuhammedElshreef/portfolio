"use client";

import { useSyncExternalStore } from "react";
import { finePointer } from "@/lib/store";

const noop = () => () => {};

/** The hint under the hero: a mouse hint on fine pointers, a tap hint on touch */
export default function HeroHint({ pointer, touch }: { pointer: string; touch: string }) {
  const fine = useSyncExternalStore(noop, finePointer, () => true);
  return (
    <p className="hero-hint" id="hero-hint">
      {fine ? pointer : touch}
    </p>
  );
}
