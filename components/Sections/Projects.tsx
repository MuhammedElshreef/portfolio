import { projects } from "@/lib/content";
import Reveal from "../ui/Reveal";
import SectionHeading from "../ui/SectionHeading";
import ProjectCard from "./ProjectCard";

export default function Projects() {
  return (
    <section id="projects" className="mx-auto max-w-6xl scroll-mt-24 px-6 py-28 sm:px-10">
      <SectionHeading index={projects.index} title={projects.title} />
      <Reveal>
        <p className="mb-14 max-w-xl text-lg text-ink-muted">{projects.tagline}</p>
      </Reveal>
      <div className="grid gap-6 md:grid-cols-2">
        {projects.items.map((project, i) => (
          <Reveal key={project.slug} delay={(i % 2) * 0.08}>
            <ProjectCard project={project} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
