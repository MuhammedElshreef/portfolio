import { contact } from "@/lib/content";
import Reveal from "../ui/Reveal";
import SectionHeading from "../ui/SectionHeading";

export default function Contact() {
  return (
    <section id="contact" className="mx-auto max-w-6xl scroll-mt-24 px-6 pb-16 pt-28 sm:px-10">
      <SectionHeading index={contact.index} title={contact.title} />
      <Reveal>
        <h3 className="text-display text-[clamp(2.6rem,8vw,7rem)] text-ink">
          {contact.heading.split(" ").slice(0, -1).join(" ")}{" "}
          <span className="normal-case italic text-blue">{contact.heading.split(" ").at(-1)}</span>
        </h3>
      </Reveal>
      <Reveal delay={0.1}>
        <p className="mt-6 max-w-xl text-lg text-ink-muted">{contact.subheading}</p>
      </Reveal>
      <Reveal delay={0.2}>
        <div className="mt-10 flex flex-wrap items-center gap-8">
          <a
            href={`mailto:${contact.email}`}
            className="rounded-full bg-blue px-8 py-4 font-mono text-sm text-paper transition-all duration-300 hover:-translate-y-0.5 hover:bg-blue-bright hover:shadow-[0_12px_28px_-10px_rgba(37,99,235,0.6)]"
          >
            {contact.email}
          </a>
          <a
            href={contact.cv.url}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-sm uppercase tracking-widest text-ink underline decoration-hairline underline-offset-8 transition-colors hover:text-blue hover:decoration-blue"
          >
            {contact.cv.title} ↗
          </a>
          {contact.socials.map((social) => (
            <a
              key={social.url}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-sm uppercase tracking-widest text-ink underline decoration-hairline underline-offset-8 transition-colors hover:text-blue hover:decoration-blue"
            >
              {social.title} ↗
            </a>
          ))}
        </div>
      </Reveal>
      <footer className="mt-28 flex flex-wrap items-center justify-between gap-4 border-t border-hairline pt-6">
        <p className="font-mono text-xs text-ink-muted">
          © {new Date().getFullYear()} Muhammed Alsayed · <span lang="ar">محمد السيد</span>
        </p>
        <p className="font-mono text-xs text-ink-muted">
          Built with Next.js + Three.js + Claude — no screenshots, all drawn
        </p>
      </footer>
    </section>
  );
}
