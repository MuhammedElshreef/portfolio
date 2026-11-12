import { Fragment } from "react";
import CommandPalette from "@/components/CommandPalette";
import CursorBubble from "@/components/CursorBubble";
import ExperienceLedger, { type LedgerRow } from "@/components/ExperienceLedger";
import FooterWordmark from "@/components/FooterWordmark";
import Grain from "@/components/Grain";
import HeroHint from "@/components/HeroHint";
import HeroTitle from "@/components/HeroTitle";
import Intro from "@/components/Intro";
import KineticEmail from "@/components/KineticEmail";
import Magnetic from "@/components/Magnetic";
import Marquee from "@/components/Marquee";
import ParticleSky from "@/components/ParticleSky";
import Pipeline from "@/components/Pipeline";
import Portrait from "@/components/Portrait";
import ProjectDetail from "@/components/ProjectDetail";
import ProjectTrack from "@/components/ProjectTrack";
import ScrollReveals from "@/components/ScrollReveals";
import SkillsSphere from "@/components/SkillsSphere";
import SmoothScroll from "@/components/SmoothScroll";
import {
  about,
  contact,
  experience,
  footer,
  hero,
  intro,
  nav,
  palette,
  projects,
  seo,
  skills,
  statement,
  work,
  workflow,
  type Project,
  type RichText,
} from "@/lib/content";

// Projects shown in the track, in display order
const allProjects: Project[] = projects.items;
const featured = projects.featured
  .map((slug) => allProjects.find((p) => p.slug === slug))
  .filter((p): p is Project => Boolean(p));

const trackProjects = featured.map(({ slug, title, kind, techs, links }) => ({ slug, title, kind, techs, live: links.length > 0 }));
const detailProjects = featured.map(({ slug, title, kind, description, techs, links }) => ({ slug, title, kind, description, techs, links }));

const groupOf = (name: string) => skills.groups.find((g) => (g.items as string[]).includes(name))?.key ?? "tl";
const sphereTags = skills.sphereOrder.map((name) => ({ name, key: groupOf(name) }));

const ledger: LedgerRow[] = [
  ...experience.items.map((j) => ({
    from: j.from,
    to: j.to,
    role: j.role,
    company: j.company,
    url: "companyUrl" in j ? j.companyUrl : undefined,
    color: j.color,
    current: "current" in j ? j.current : undefined,
    description: j.description,
  })),
  {
    from: experience.education.from,
    to: experience.education.to,
    role: experience.education.degree,
    company: experience.education.institution,
    color: "var(--acc)",
    current: true,
    study: true,
    description: experience.education.description,
  },
];

// Everything the command palette can jump to, in page order
const paletteSections = [
  ...nav.links.filter((l) => l.href !== "#contact"),
  { title: workflow.title, href: "#process" },
  ...nav.links.filter((l) => l.href === "#contact"),
];

const github = contact.socials.find((s) => s.title === "GitHub") ?? contact.socials[0];

function Rich({ text }: { text: RichText }) {
  return text.map((part, i) => (typeof part === "string" ? part : <strong key={i}>{part.strong}</strong>));
}

export default function Home() {
  return (
    <>
      <Intro name={intro.name} role={intro.role} />
      <div className="backdrop" aria-hidden="true" />
      <ParticleSky />
      <Grain />

      <header className="nav" id="nav">
        <div className="wrap nav-in">
          <a className="brand" href="#hero" data-scroll="" aria-label={nav.brandLabel}>
            <span className="brand-ar" lang="ar" dir="rtl">
              {seo.arabicName}
            </span>
          </a>
          <nav className="nav-links" aria-label={nav.sectionsLabel}>
            {nav.links.map((l) => (
              <a href={l.href} data-scroll="" key={l.href}>
                {l.title}
              </a>
            ))}
          </nav>
          <button type="button" className="nav-search" id="palette-open" aria-label={`${palette.open} (${palette.shortcut})`}>
            <svg viewBox="0 0 16 16" aria-hidden="true">
              <circle cx="7" cy="7" r="4.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
              <path d="M10.5 10.5 14 14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
            <span>{palette.open}</span>
            <kbd>{palette.shortcut}</kbd>
          </button>
          <a className="btn btn-acc btn-sm" href={nav.cta.href} data-scroll="" data-magnetic="">
            {nav.cta.title}
          </a>
        </div>
      </header>

      <main>
        <section id="hero" className="hero" aria-label={hero.sectionLabel}>
          <div className="wrap hero-grid">
            <HeroTitle lines={hero.titleLines} label={hero.name} />
            <div className="hero-side">
              <p className="hero-sub" data-in="">
                {hero.sub}
              </p>
              <div className="hero-ctas" data-in="">
                <a className="btn btn-acc" href={hero.primaryCta.href} data-scroll="" data-magnetic="">
                  {hero.primaryCta.title}
                </a>
                <a className="btn btn-ghost" href={hero.secondaryCta.href} data-scroll="" data-magnetic="">
                  {hero.secondaryCta.title}
                </a>
              </div>
            </div>
          </div>
          <HeroHint pointer={hero.hint.pointer} touch={hero.hint.touch} />
        </section>

        <section id="statement" className="wrap statement" aria-label={statement.sectionLabel}>
          <p className="statement-text">
            {statement.text.split(/\s+/).map((w, i) => (
              <Fragment key={i}>
                {i > 0 ? " " : null}
                <span className="sw">{w}</span>
              </Fragment>
            ))}
          </p>
          <p className="statement-line" data-rise="">
            {statement.line}
          </p>
        </section>

        <ProjectTrack projects={trackProjects} labels={{ open: work.open, terminal: work.terminal }}>
          <div className="wrap work-head">
            <h2 className="work-label" id="work-title" data-decode="">
              {work.title}
            </h2>
            <p className="work-note">{work.note}</p>
          </div>
        </ProjectTrack>

        <SkillsSphere tags={sphereTags} groups={skills.groups} listLabel={skills.listLabel}>
          <div className="wrap skills-head">
            <h2 className="h2" id="skills-title" data-rise="" data-decode="">
              {skills.title}
            </h2>
            <ul className="legend" aria-label={skills.legendLabel} data-rise="">
              {skills.groups.map((g) => (
                <li key={g.key}>
                  <span className={`tag ${g.key}`}>{g.name}</span>
                </li>
              ))}
            </ul>
          </div>
        </SkillsSphere>

        <section id="about" className="wrap about" aria-labelledby="about-title">
          <Portrait src="/me.jpg" alt={about.photoAlt} />
          <div className="about-text glass">
            <h2 className="h2" id="about-title" data-rise="" data-decode="">
              {about.heading}
            </h2>
            {about.paragraphs.map((p, i) => (
              <p data-rise="" key={i}>
                <Rich text={p} />
              </p>
            ))}
          </div>
        </section>

        <section id="experience" className="wrap exp" aria-labelledby="exp-title">
          <h2 className="h2" id="exp-title" data-rise="" data-decode="">
            {experience.title}
          </h2>
          <ExperienceLedger rows={ledger} nowLabel={experience.currentBadge} />
        </section>

        <section id="process" className="wrap proc" aria-labelledby="proc-title">
          <div className="proc-head">
            <h2 className="h2" id="proc-title" data-rise="" data-decode="">
              {workflow.title}
            </h2>
            <p className="proc-note" data-rise="">
              {workflow.note}
            </p>
          </div>
          <Pipeline steps={workflow.steps} states={workflow.states} />
        </section>

        <section id="contact" className="contact" aria-labelledby="contact-title">
          <h2 className="sr-only" id="contact-title">
            {contact.title}
          </h2>
          <Marquee text={contact.marquee} />
          <div className="wrap contact-in">
            <p className="contact-sub" data-rise="">
              {contact.subheading}
            </p>
            <KineticEmail email={contact.email} />
            <div className="contact-actions" data-rise="">
              <a className="btn btn-acc" href={`mailto:${contact.email}`} data-magnetic="">
                {contact.send}
              </a>
              <a className="btn btn-ghost" href={github.url} target="_blank" rel="noopener" data-magnetic="">
                {github.title}
              </a>
              <a className="btn btn-ghost" href={contact.cv.url} target="_blank" rel="noopener" data-magnetic="">
                {contact.cv.title}
              </a>
            </div>
          </div>
          <div className="wrap">
            <FooterWordmark text={footer.handle} />
          </div>
          <footer className="foot wrap">
            <span className="foot-copy">{footer.copyright}</span>
            <span className="foot-names" lang="ar" dir="rtl">
              <span className="foot-ar">{seo.arabicName}</span>
              <span className="foot-aka">{footer.arabicAka}</span>
            </span>
            <button type="button" className="foot-top" id="foot-top">
              {footer.backToTop}
            </button>
          </footer>
        </section>
      </main>

      <ProjectDetail
        projects={detailProjects}
        labels={{ close: work.close, noLink: work.noLink, terminal: work.terminal }}
      />
      <CommandPalette
        sections={paletteSections}
        projects={trackProjects}
        email={contact.email}
        cvUrl={contact.cv.url}
        githubUrl={github.url}
        labels={palette}
      />
      <CursorBubble label={work.bubble} />
      <Magnetic />
      <ScrollReveals />
      <SmoothScroll />
    </>
  );
}
