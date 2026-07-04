import { experience } from "@/lib/content";
import Reveal from "../ui/Reveal";
import SectionHeading from "../ui/SectionHeading";
import { TimelineDot, TimelineLine } from "../ui/Timeline";

export default function Experience() {
  return (
    <section id="experience" className="mx-auto max-w-6xl scroll-mt-24 px-6 py-28 sm:px-10">
      <SectionHeading index={experience.index} title={experience.title} />
      <ol className="relative space-y-14 pl-8 sm:pl-12">
        <TimelineLine />
        {experience.items.map((item, i) => (
          <li key={item.company} className="relative">
            <TimelineDot
              color={item.color}
              className="absolute -left-[37px] top-2 sm:-left-[53px]"
            />
            <Reveal delay={i * 0.08}>
              <p className="font-mono text-xs uppercase tracking-widest text-ink-muted">{item.date}</p>
              <h3 className="mt-2 text-2xl font-semibold text-ink">
                {item.role}{" "}
                <span className="text-ink-muted font-normal">at</span>{" "}
                {item.companyUrl ? (
                  <a
                    href={item.companyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline decoration-2 underline-offset-4 transition-opacity hover:opacity-70"
                    style={{ color: item.color, textDecorationColor: item.color }}
                  >
                    {item.company}
                  </a>
                ) : (
                  <span style={{ color: item.color }}>{item.company}</span>
                )}
              </h3>
              {item.description && (
                <p className="mt-3 max-w-2xl leading-relaxed text-ink-muted">{item.description}</p>
              )}
            </Reveal>
          </li>
        ))}
      </ol>
      <Reveal delay={0.2} className="mt-16 border-t border-hairline pt-8">
        <p className="font-mono text-xs uppercase tracking-widest text-ink-muted">Education</p>
        <p className="mt-2 text-lg text-ink">
          {experience.education.degree} — {experience.education.institution}{" "}
          <span className="font-mono text-sm text-ink-muted">({experience.education.date})</span>
        </p>
      </Reveal>
    </section>
  );
}
