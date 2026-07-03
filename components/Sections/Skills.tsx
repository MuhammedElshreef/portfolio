import { skills } from "@/lib/content";
import Reveal from "../ui/Reveal";
import SectionHeading from "../ui/SectionHeading";

export default function Skills() {
  return (
    <section id="skills" className="mx-auto max-w-6xl scroll-mt-24 px-6 py-28 sm:px-10">
      <SectionHeading index={skills.index} title={skills.title} />
      <div className="space-y-10">
        {skills.groups.map((group, gi) => (
          <Reveal key={group.name} delay={gi * 0.08}>
            <div className="grid gap-4 sm:grid-cols-[140px_1fr]">
              <p className="font-mono text-xs uppercase tracking-widest text-ink-muted sm:pt-2.5">
                {group.name}
              </p>
              <ul className="flex flex-wrap gap-2.5">
                {group.items.map((skill) => (
                  <li
                    key={skill}
                    className="cursor-default rounded-full border border-hairline px-4 py-2 font-mono text-sm text-ink transition-all duration-300 hover:-translate-y-0.5 hover:border-blue hover:text-blue hover:shadow-[0_8px_20px_-8px_rgba(37,99,235,0.4)]"
                  >
                    {skill}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
