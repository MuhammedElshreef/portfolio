import { skills } from "@/lib/content";
import Reveal from "../ui/Reveal";
import SectionHeading from "../ui/SectionHeading";
import SkillPills from "../ui/SkillPills";

export default function Skills() {
  return (
    <section id="skills" className="mx-auto max-w-6xl scroll-mt-24 px-6 py-28 sm:px-10">
      <SectionHeading index={skills.index} title={skills.title} />
      <div className="space-y-10">
        {skills.groups.map((group) => (
          <div key={group.name} className="grid gap-4 sm:grid-cols-[140px_1fr]">
            <Reveal>
              <p className="font-mono text-xs uppercase tracking-widest text-ink-muted sm:pt-2.5">
                {group.name}
              </p>
            </Reveal>
            <SkillPills items={group.items} />
          </div>
        ))}
      </div>
    </section>
  );
}
