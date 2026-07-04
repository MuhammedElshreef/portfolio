"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { hero } from "@/lib/content";
import { loaderState } from "../loaderState";
import { sceneEvents } from "../Scene/sceneEvents";

const line = {
  hidden: { y: "110%" },
  show: (i: number) => ({
    y: "0%",
    transition: { duration: 0.9, delay: 0.1 + i * 0.12, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

export default function Hero() {
  const [ready, setReady] = useState(false);
  const section = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => loaderState.onDone(() => setReady(true)), []);

  // As the hero scrolls away, the layers slide up at different speeds and fade
  const { scrollYProgress } = useScroll({
    target: section,
    offset: ["start start", "end start"],
  });
  const yTitle = useTransform(scrollYProgress, [0, 1], ["0%", "-38%"]);
  const ySub = useTransform(scrollYProgress, [0, 1], ["0%", "-16%"]);
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section
      ref={section}
      id="top"
      className="relative flex min-h-svh flex-col justify-center px-6 sm:px-10"
    >
      {/* Settles from a slight zoom as the preloader wipes away */}
      <motion.div
        initial={{ scale: 1.03 }}
        animate={{ scale: ready ? 1 : 1.03 }}
        transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
        style={{ transformOrigin: "left center" }}
      >
        <motion.div initial="hidden" animate={ready ? "show" : "hidden"}>
          <motion.div style={reduceMotion ? undefined : { y: yTitle, opacity: fade }}>
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
          </motion.div>

          <motion.div style={reduceMotion ? undefined : { y: ySub, opacity: fade }}>
            <div className="mt-6 overflow-hidden sm:mt-8">
              <motion.p
                variants={line}
                custom={3}
                className="text-display normal-case italic text-[clamp(1.9rem,4.8vw,3.9rem)] text-blue"
              >
                —{" "}
                <span
                  onClick={() => sceneEvents.burst()}
                  title="✦"
                  className="cursor-pointer transition-colors duration-300 hover:text-blue-bright"
                >
                  {hero.name}
                </span>
              </motion.p>
            </div>

            <div className="mt-8 max-w-2xl overflow-hidden">
              <motion.p
                variants={line}
                custom={4}
                className="text-xl leading-snug text-ink-muted sm:text-2xl"
              >
                {hero.statement}
              </motion.p>
            </div>
          </motion.div>
        </motion.div>
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
