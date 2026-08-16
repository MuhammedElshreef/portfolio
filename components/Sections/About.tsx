import Image from "next/image";
import { existsSync } from "fs";
import { join } from "path";
import { about } from "@/lib/content";
import Reveal from "../ui/Reveal";
import SectionHeading from "../ui/SectionHeading";

export default function About() {
  // Photo is a later file drop: put public/me.jpg in place and it appears.
  const hasPhoto = existsSync(join(process.cwd(), "public", "me.jpg"));

  return (
    <section id="about" className="mx-auto max-w-6xl scroll-mt-24 px-6 py-28 sm:px-10">
      <SectionHeading index={about.index} title={about.title} />
      <div className="grid gap-12 md:grid-cols-[minmax(0,320px)_1fr] md:gap-16">
        <Reveal delay={0.1}>
          <div className="group relative max-w-xs">
            {/* Color plate behind the photo — extends further out on hover */}
            <div
              aria-hidden
              className="absolute inset-0 translate-x-2.5 translate-y-2.5 rounded-lg bg-blue transition-transform duration-500 ease-out group-hover:translate-x-5 group-hover:translate-y-5"
            />
            <div className="relative aspect-4/5 overflow-hidden rounded-lg border border-hairline bg-paper-raised transition-transform duration-500 ease-out group-hover:-translate-x-1.5 group-hover:-translate-y-1.5">
              {hasPhoto ? (
                <>
                  {/* Grayscale at rest; true color on hover */}
                  <Image
                    src="/me.jpg"
                    alt={about.photoAlt}
                    fill
                    className="object-cover grayscale transition-[transform,filter] duration-700 ease-out group-hover:scale-105 group-hover:grayscale-0"
                  />
                </>
              ) : (
                <div className="flex h-full items-center justify-center bg-gradient-to-br from-paper-raised via-paper to-blue/20">
                  <span className="text-display text-7xl text-ink/20">{about.initials}</span>
                </div>
              )}
            </div>
          </div>
        </Reveal>
        <div className="space-y-8">
          {about.paragraphs.map((p, i) => (
            <Reveal key={i} delay={0.15 + i * 0.08}>
              <p
                className={
                  i === 0
                    ? "text-[clamp(1.7rem,3.2vw,2.8rem)] font-medium leading-tight text-ink"
                    : "text-[clamp(1.3rem,2.2vw,2rem)] leading-snug text-ink-muted"
                }
              >
                {p}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
