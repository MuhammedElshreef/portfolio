"use client";

import { motion } from "motion/react";

const ease = [0.16, 1, 0.3, 1] as const;

// whileInView lives on the wrapper: the clipped title span starts fully
// hidden by overflow, so observing it directly would never fire.
const variants = {
  index: {
    hidden: { opacity: 0, y: 12 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease } },
  },
  title: {
    hidden: { y: "110%" },
    show: { y: "0%", transition: { duration: 0.9, ease } },
  },
  rule: {
    hidden: { scaleX: 0 },
    show: { scaleX: 1, transition: { duration: 1, delay: 0.25, ease } },
  },
};

export default function SectionHeading({ index, title }: { index: string; title: string }) {
  return (
    <motion.div
      className="mb-12 flex items-baseline gap-4"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
    >
      <motion.span variants={variants.index} className="font-mono text-sm text-blue">
        {index}
      </motion.span>
      <h2 className="text-display overflow-hidden text-4xl text-ink sm:text-7xl">
        <motion.span variants={variants.title} className="block">
          {title}
        </motion.span>
      </h2>
      <motion.span
        variants={variants.rule}
        className="mt-auto hidden h-px flex-1 origin-left bg-hairline sm:block"
      />
    </motion.div>
  );
}
