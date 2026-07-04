"use client";

import { useRef } from "react";
import type { Project } from "@/lib/content";
import { projectArt } from "../ProjectArt";
import Tag from "../ui/Tag";

export default function ProjectCard({ project }: { project: Project }) {
  const card = useRef<HTMLElement>(null);
  const Art = projectArt[project.slug];
  const primaryLink = project.links[0];

  const onPointerMove = (e: React.PointerEvent) => {
    const el = card.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    el.style.setProperty("--gx", `${x}px`);
    el.style.setProperty("--gy", `${y}px`);
    // Same pointer drives a gentle perspective tilt (mouse only)
    if (e.pointerType === "mouse") {
      el.style.setProperty("--ry", `${(x / rect.width - 0.5) * 5}deg`);
      el.style.setProperty("--rx", `${(0.5 - y / rect.height) * 5}deg`);
    }
  };

  const onPointerLeave = () => {
    const el = card.current;
    if (!el) return;
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
  };

  // The whole card opens the primary link — unless an inner link was clicked
  const onClick = (e: React.MouseEvent) => {
    if (!primaryLink) return;
    if ((e.target as HTMLElement).closest("a")) return;
    window.open(primaryLink.url, "_blank", "noopener,noreferrer");
  };

  return (
    <article
      ref={card}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      onClick={onClick}
      data-cursor={primaryLink ? "view" : undefined}
      className={`group relative flex h-full flex-col overflow-hidden rounded-xl border border-hairline bg-paper-raised/60 transition-all duration-500 ease-out [transform:perspective(900px)_rotateX(var(--rx,0deg))_rotateY(var(--ry,0deg))_translateY(var(--lift,0px))] hover:[--lift:-6px] hover:border-blue/30 hover:shadow-[0_24px_48px_-20px_var(--card-shadow)] ${
        primaryLink ? "cursor-pointer" : ""
      }`}
    >
      {/* Cursor-following blue glow (desktop hover) */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(220px circle at var(--gx, 50%) var(--gy, 50%), rgba(37,99,235,0.10), transparent 70%)",
        }}
      />

      <div className="flex h-32 items-center justify-center border-b border-hairline p-3 sm:aspect-[9/4] sm:h-auto sm:p-6">
        {Art && <Art />}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4 sm:gap-4 sm:p-7">
        <h3 className="flex items-center justify-between text-lg font-semibold text-ink sm:text-xl">
          {project.title}
          <span
            aria-hidden
            className="text-blue opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 -translate-x-2"
          >
            →
          </span>
        </h3>
        <p className="flex-1 text-sm leading-relaxed text-ink-muted">{project.description}</p>
        <div className="flex flex-wrap gap-2">
          {project.techs.map((tech) => (
            <Tag key={tech}>{tech}</Tag>
          ))}
        </div>
        {project.links.length > 0 && (
          <div className="flex gap-5 border-t border-hairline pt-4">
            {project.links.map((link) => (
              <a
                key={link.url}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-xs uppercase tracking-widest text-blue transition-opacity hover:opacity-70"
              >
                {link.title} ↗
              </a>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
