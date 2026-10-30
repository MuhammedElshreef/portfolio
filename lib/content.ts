export type ProjectLink = {
  title: string;
  url: string;
};

export type Project = {
  slug: string;
  title: string;
  description: string;
  techs: string[];
  links: ProjectLink[];
  /** What kind of product it is, shown on its terminal card */
  kind?: string;
};

// A paragraph with optional bold runs
export type RichText = (string | { strong: string })[];

export type SkillGroupKey = "fe" | "be" | "tl";

export type ExperienceItem = {
  role: string;
  company: string;
  companyUrl?: string;
  color: string;
  date: string;
  from: string;
  to: string;
  current?: boolean;
  description?: string;
};

export const seo = {
  url: "https://alsayed.ly",
  title: "Muhammed Alsayed | Full-Stack Web Developer",
  description:
    "Portfolio of Muhammed Alsayed (محمد السيد), a full-stack web developer in Tripoli, Libya building production-grade web platforms: Laravel and Filament back-ends, Angular, Vue, and React front-ends.",
  arabicName: "محمد السيد",
  role: "Full-Stack Web Developer",
};

export const hero = {
  name: "Muhammed Alsayed",
  titleLines: ["Muhammed", "Alsayed"],
  role: ["Full Stack", "Web Developer"],
  sub: "Full-stack web developer in Tripoli, Libya. Laravel back-ends, Angular, Vue and React front-ends.",
  primaryCta: { title: "See the work", href: "#work" },
  secondaryCta: { title: "Email me", href: "#contact" },
  hint: {
    pointer: "Move to draw constellations. Click to scatter.",
    touch: "Tap the sky to scatter the stars",
  },
  sectionLabel: "Introduction",
  statement:
    "I build production-grade web platforms, from Laravel back-ends to Angular, Vue, and React front-ends.",
};

export const about = {
  index: "01",
  title: "About",
  heading: "Hi, I'm Muhammed",
  paragraphs: [
    [
      "I'm a ",
      { strong: "Full-Stack Web Developer" },
      " with a passion for creating beautiful and functional web applications. I enjoy learning new technologies, building things, and helping people.",
    ],
    [
      "I'm always exploring new tools and ideas. I learn fast, share what I learn, and enjoy collaborating with others to build things that matter.",
    ],
  ] satisfies RichText[],
  photoAlt: "Portrait of Muhammed Alsayed",
  initials: "MA",
};

export const experience = {
  index: "02",
  title: "Experience",
  items: [
    {
      role: "Front-End Developer",
      company: "Qader co",
      color: "#37BC69",
      date: "May 2026 - Present",
      from: "May 2026",
      to: "Present",
      current: true,
      description: "Part-time front-end development.",
    },
    {
      role: "Full-Stack Developer",
      company: "Libyana",
      companyUrl: "https://libyana.ly",
      color: "#951B81",
      date: "Jul 2025 - Dec 2025",
      from: "Jul 2025",
      to: "Dec 2025",
      description:
        "Building Libyana Hub, the digital platform of Libya's leading mobile network operator. Full-time, via Tadamon.",
    },
    {
      role: "Intern",
      company: "Mataa",
      companyUrl: "https://mataa.app",
      color: "#F9A61A",
      date: "Jan 2024 - Apr 2024",
      from: "Jan 2024",
      to: "Apr 2024",
      description:
        "Mataa is Libya's largest shopping app, bringing original products from international brands to customers across all Libyan cities.",
    },
  ] satisfies ExperienceItem[],
  education: {
    degree: "BSc in Software Engineering",
    institution: "University of Tripoli",
    date: "2023 - Present",
    from: "2023",
    to: "Present",
    description: "Studying software engineering alongside the work above.",
  },
  currentBadge: "Now",
};

export const projects = {
  index: "03",
  title: "Projects",
  tagline: "Building interfaces, bringing ideas to life.",
  // The ring shows these, in this order
  featured: [
    "libyanahub",
    "libya-roots",
    "orders",
    "kbtech",
    "libyanahub-collab",
    "weather",
    "elzwetina",
    "zad-almuslim",
  ],
  items: [
    {
      slug: "libyanahub",
      kind: "E-learning and coaching",
      title: "LibyanaHub Platform",
      description:
        "A comprehensive e-learning and fitness coaching platform for the Libyan market. Course enrollment, tiered coach subscriptions, an admin dashboard, and full Arabic/English bilingual support with RTL layout.",
      techs: ["Angular", "TypeScript", "TailwindCSS", "PrimeNG", "RxJS"],
      links: [],
    },
    {
      slug: "libyanahub-collab",
      kind: "Patient records",
      title: "LibyanaHub Collab",
      description:
        "A collaboration between Libyana and medical students to track and monitor patient health: record management, medical history tracking, and streamlined communication between healthcare providers.",
      techs: [
        "Laravel 13",
        "Filament 5",
        "PHP 8.3",
        "Tailwind CSS 4",
        "Sanctum",
        "Pest",
      ],
      links: [],
    },
    {
      slug: "orders",
      kind: "Orders and invoices",
      title: "Orders Management System",
      description:
        "A full-featured order and invoice management system covering the complete lifecycle, from customers and products to PDF invoices, payment tracking, and real-time financial analytics.",
      techs: ["Laravel", "Filament", "Livewire", "TailwindCSS", "Alpine.js"],
      links: [],
    },
    {
      slug: "elzwetina",
      kind: "Corporate catalogue",
      title: "Elzwetina Group",
      description:
        "Corporate website for Libya's leading industrial and safety solutions provider: product showcase, brand partnerships, client portfolio, and a Filament-powered admin panel.",
      techs: ["Laravel", "Filament", "Alpine.js", "TailwindCSS", "MySQL"],
      links: [{ title: "Visit website", url: "https://elzwetinagroup.com/" }],
    },
    {
      slug: "kbtech",
      kind: "Company website",
      title: "Alkhidmat Albarmajia",
      description:
        "A modern, responsive website for a Libyan tech services company, built as a freelancer with Astro and a custom Vue component.",
      techs: ["Astro", "Vue", "JavaScript", "TailwindCSS"],
      links: [{ title: "Visit website", url: "https://kbtech.ly/" }],
    },
    {
      slug: "weather",
      kind: "Weather app",
      title: "Weather Now",
      description:
        "Real-time weather with a clean, responsive interface: worldwide location search, current conditions, 7-day forecasts, and hourly temperature trends.",
      techs: ["React", "TypeScript", "Vite", "Zustand", "shadcn/ui"],
      links: [
        {
          title: "Visit website",
          url: "https://weather-now-mentor.vercel.app/",
        },
      ],
    },
    {
      slug: "libya-roots",
      kind: "Tourism guide",
      title: "Libya Roots",
      description:
        "A tourism platform showcasing Libya's cultural and historical landmarks: categorized destinations, interactive maps, and saved favorites for trip planning.",
      techs: ["Angular", "TailwindCSS", "Angular Material", "Spartan UI"],
      links: [
        { title: "Visit website", url: "https://libya-roots.vercel.app/" },
      ],
    },
    {
      slug: "news-bot",
      title: "Telegram News Bot",
      description:
        "An automated bot that aggregates financial news from RSS feeds, translates articles into Arabic, and delivers them to a Telegram channel, with MongoDB-backed deduplication and rate-limit handling.",
      techs: ["Node.js", "Telegraf", "MongoDB", "Mongoose", "RSS"],
      links: [],
    },
    {
      slug: "zad-almuslim",
      kind: "Quran and lessons",
      title: "Zad Al-muslim",
      description:
        "An Islamic resource platform offering Quran recitations, radio stations, and educational lessons through a friendly, accessible interface.",
      techs: ["Nuxt", "Pinia", "TailwindCSS", "shadcn/ui"],
      links: [
        { title: "Visit website", url: "https://zad-almuslim.ly/" },
        {
          title: "View source",
          url: "https://github.com/Ahmedelforjani/zad-almuslim",
        },
      ],
    },
    {
      slug: "easy-bank",
      title: "Easy Bank",
      description:
        "A responsive landing page built with vanilla JavaScript and TailwindCSS as a Frontend Mentor challenge.",
      techs: ["HTML", "CSS", "JavaScript", "TailwindCSS"],
      links: [
        {
          title: "Visit website",
          url: "https://easybank-frontend-mentor.netlify.app/",
        },
        {
          title: "View source",
          url: "https://github.com/MuhammedElshreef/easy-bank",
        },
      ],
    },
    {
      slug: "movie-app",
      title: "Movie App",
      description:
        "A movie browsing app and my first Vue project: API data fetching, Vue Router navigation, and Pinia state management.",
      techs: ["Vue", "TailwindCSS", "Pinia", "Vue Router"],
      links: [
        { title: "Visit website", url: "http://movie-clone-iota.vercel.app/" },
        {
          title: "View source",
          url: "https://github.com/MuhammedElshreef/movie-clone",
        },
      ],
    },
  ] satisfies Project[],
};

export const skills = {
  index: "04",
  title: "Skills",
  legendLabel: "Legend",
  listLabel: "Skills list",
  // Order of the tags around the sphere, so the groups interleave
  sphereOrder: [
    "HTML",
    "Laravel",
    "Vue.js",
    "Git",
    "TypeScript",
    "PHP",
    "Angular",
    "MySQL",
    "Tailwind CSS",
    "Filament",
    "React",
    "GitHub",
    "Nuxt.js",
    "Livewire",
    "CSS",
    "Node.js",
    "Astro",
    "MongoDB",
    "JavaScript",
  ],
  groups: [
    {
      key: "fe" as SkillGroupKey,
      name: "Front-end",
      items: [
        "HTML",
        "CSS",
        "Tailwind CSS",
        "JavaScript",
        "TypeScript",
        "Vue.js",
        "Nuxt.js",
        "Angular",
        "Astro",
        "React",
      ],
    },
    {
      key: "be" as SkillGroupKey,
      name: "Back-end",
      items: [
        "PHP",
        "Laravel",
        "Filament",
        "Livewire",
        "Node.js",
        "MySQL",
        "MongoDB",
      ],
    },
    {
      key: "tl" as SkillGroupKey,
      name: "Tools",
      items: ["Git", "GitHub"],
    },
  ],
};

export const contact = {
  index: "05",
  title: "Contact",
  heading: "Let's build something.",
  subheading:
    "Have a project in mind, a role to fill, or just want to talk web? My inbox is open.",
  email: "muhammedelshreef50@gmail.com",
  cv: { title: "CV", url: "/Muhammed-Alsayed-CV.pdf" },
  socials: [{ title: "GitHub", url: "https://github.com/MuhammedElshreef" }],
  marquee: "Let's build something",
  send: "Send email",
};

export const marquee = [
  "Available for work",
  "Laravel",
  "Filament",
  "Angular",
  "Vue",
  "React",
  "TypeScript",
  "Tailwind CSS",
  "Node.js",
];

export const nav = {
  name: "Muhammed Alsayed",
  brandLabel: "Muhammed Alsayed, back to top",
  sectionsLabel: "Sections",
  cta: { title: "Email me", href: "#contact" },
  links: [
    { title: "Work", href: "#work" },
    { title: "Skills", href: "#skills" },
    { title: "About", href: "#about" },
    { title: "Experience", href: "#experience" },
    { title: "Contact", href: "#contact" },
  ],
};

// The splash: light flows through the </>, then the brackets open on the name
export const intro = {
  name: hero.name,
  role: "Full-stack web developer",
};

// Big statement over the particle code glyph
export const statement = {
  sectionLabel: "What I do",
  text: "I work across the whole stack, designing back-end architectures and crafting front-end interfaces, to ship complete products end to end.",
  line: "From the data model to the last pixel.",
};

// Horizontal projects track and its detail view
export const work = {
  title: "Selected work",
  note: `${projects.featured.length} projects. Scroll or swipe to browse.`,
  open: "Open",
  // The terminal card: a prompt that opens the project, then its details as key and value lines
  terminal: {
    prompt: "~/projects $",
    command: "open",
    type: "type",
    stack: "stack",
    status: "status",
    live: "live",
    private: "private",
  },
  bubble: "View",
  close: "Close",
  noLink: "Private client project. No public link yet.",
};

export const footer = {
  copyright: "© 2026 Muhammed Alsayed",
  backToTop: "Back to top",
};
