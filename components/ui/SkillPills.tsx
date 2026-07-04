"use client";

import { motion } from "motion/react";

export default function SkillPills({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-wrap gap-2.5">
      {items.map((skill, i) => (
        <motion.li
          key={skill}
          initial={{ opacity: 0, y: 10, scale: 0.94 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.45, delay: i * 0.03, ease: [0.16, 1, 0.3, 1] }}
          className="cursor-default rounded-full border border-hairline px-4 py-2 font-mono text-sm text-ink transition-all duration-300 hover:-translate-y-0.5 hover:border-blue hover:text-blue hover:shadow-[0_8px_20px_-8px_rgba(37,99,235,0.4)]"
        >
          {skill}
        </motion.li>
      ))}
    </ul>
  );
}
