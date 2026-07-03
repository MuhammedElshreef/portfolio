"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { hero } from "@/lib/content";
import { loaderState } from "../loaderState";

const line = {
  hidden: { y: "110%" },
  show: (i: number) => ({
    y: "0%",
    transition: { duration: 0.9, delay: 0.1 + i * 0.12, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

export default function Hero() {
  const [ready, setReady] = useState(false);

  useEffect(() => loaderState.onDone(() => setReady(true)), []);

  return (
    <section id="top" className="relative flex min-h-svh flex-col justify-center px-6 sm:px-10">
      <motion.div initial="hidden" animate={ready ? "show" : "hidden"}>
        <div className="overflow-hidden">
          <motion.p
            variants={line}
            custom={0}
            className="mb-6 font-mono text-sm uppercase tracking-widest text-ink-muted sm:text-base"
          >
            Tripoli, Libya — open to interesting work
          </motion.p>
        </div>

        <h1 className="text-display text-[clamp(3rem,9.2vw,9rem)] text-ink">
          {hero.role.map((word, i) => (
            <span key={word} className="block overflow-hidden">
              <motion.span variants={line} custom={i + 1} className="block">
                {word}
              </motion.span>
            </span>
          ))}
        </h1>

        <div className="mt-6 overflow-hidden sm:mt-8">
          <motion.p
            variants={line}
            custom={3}
            className="text-display normal-case italic text-[clamp(1.9rem,4.8vw,3.9rem)] text-blue"
          >
            — {hero.name}
          </motion.p>
        </div>

        <div className="mt-8 max-w-2xl overflow-hidden">
          <motion.p variants={line} custom={4} className="text-xl leading-snug text-ink-muted sm:text-2xl">
            {hero.statement}
          </motion.p>
        </div>
      </motion.div>

      <motion.a
        href="#about"
        className="absolute bottom-8 left-6 flex items-center gap-3 font-mono text-xs uppercase tracking-widest text-ink-muted transition-colors hover:text-blue sm:left-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: ready ? 1 : 0 }}
        transition={{ delay: 1.4, duration: 0.8 }}
      >
        <span className="relative block h-8 w-px overflow-hidden bg-hairline">
          <span className="absolute inset-x-0 top-0 h-3 animate-[scrollcue_1.8s_ease-in-out_infinite] bg-blue" />
        </span>
        Scroll
      </motion.a>
    </section>
  );
}
