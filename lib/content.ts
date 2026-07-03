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
};

export type ExperienceItem = {
  role: string;
  company: string;
  companyUrl?: string;
  color: string;
  date: string;
  description?: string;
};

export const seo = {
  title: "Muhammed Alsayed — Full-Stack Web Developer",
  description:
    "Portfolio of Muhammed Alsayed, a full-stack web developer building production-grade web platforms — Laravel and Filament back-ends, Angular, Vue, and React front-ends.",
};

export const hero = {
  name: "Muhammed Alsayed",
  role: ["Full Stack", "Web Developer"],
  statement:
    "I build production-grade web platforms — from Laravel back-ends to Angular, Vue, and React front-ends.",
};

export const about = {
  index: "01",
  title: "About",
  paragraphs: [
    "I'm a full-stack developer in Tripoli, Libya — building Libyana Hub, the digital platform of Libya's leading mobile operator.",
    "Laravel on the back-end. Angular, Vue, and React on the front. I ship complete products end to end — from the data model to the last pixel.",
    "Software engineering student at the University of Tripoli. I learn fast, share what I learn, and build for my community.",
  ],
  photoAlt: "Portrait of Muhammed Alsayed",
  initials: "MA",
};

export const experience = {
  index: "02",
  title: "Experience",
  items: [
    {
      role: "Full-Stack Developer",
      company: "Libyana",
      companyUrl: "https://libyana.ly",
      color: "#951B81",
      date: "Dec 2025 — Present",
      description:
        "Building Libyana Hub, the digital platform of Libya's leading mobile network operator — full-time, via Tadamon.",
    },
    {
      role: "Front-End Developer",
      company: "Tourista",
      color: "#37BC69",
      date: "May 2026 — Present",
      description: "Part-time front-end development.",
    },
    {
      role: "Intern",
      company: "Mataa",
      companyUrl: "https://mataa.app",
      color: "#F9A61A",
      date: "Jan 2024 — Apr 2024",
      description:
        "Mataa is Libya's largest shopping app, bringing original products from international brands to customers across all Libyan cities.",
    },
  ] satisfies ExperienceItem[],
  education: {
    degree: "BSc in Software Engineering",
    institution: "University of Tripoli",
    date: "2023 — Present",
  },
};

export const projects = {
  index: "03",
  title: "Projects",
  tagline: "Building interfaces, bringing ideas to life.",
  items: [
    {
      slug: "libyanahub",
      title: "LibyanaHub Platform",
      description:
        "A comprehensive e-learning and fitness coaching platform for the Libyan market. Course enrollment, tiered coach subscriptions, an admin dashboard, and full Arabic/English bilingual support with RTL layout.",
      techs: ["Angular", "TypeScript", "TailwindCSS", "PrimeNG", "RxJS"],
      links: [],
    },
    {
      slug: "libyanahub-collab",
      title: "LibyanaHub Collab",
      description:
        "A collaboration between Libyana and medical students to track and monitor patient health — record management, medical history tracking, and streamlined communication between healthcare providers.",
      techs: ["Laravel 13", "Filament 5", "PHP 8.3", "Tailwind CSS 4", "Sanctum", "Pest"],
      links: [],
    },
    {
      slug: "orders",
      title: "Orders Management System",
      description:
        "A full-featured order and invoice management system — the complete lifecycle from customers and products to PDF invoices, payment tracking, and real-time financial analytics.",
      techs: ["Laravel", "Filament", "Livewire", "TailwindCSS", "Alpine.js"],
      links: [],
    },
    {
      slug: "elzwetina",
      title: "Elzwetina Group",
      description:
        "Corporate website for Libya's leading industrial and safety solutions provider — product showcase, brand partnerships, client portfolio, and a Filament-powered admin panel.",
      techs: ["Laravel", "Filament", "Alpine.js", "TailwindCSS", "MySQL"],
      links: [{ title: "Visit website", url: "https://elzwetinagroup.com/" }],
    },
    {
      slug: "kbtech",
      title: "Alkhidmat Albarmajia",
      description:
        "A modern, responsive website for a Libyan tech services company, built as a freelancer with Astro and a custom Vue component.",
      techs: ["Astro", "Vue", "JavaScript", "TailwindCSS"],
      links: [{ title: "Visit website", url: "https://kbtech.ly/" }],
    },
    {
      slug: "weather",
      title: "Weather Now",
      description:
        "Real-time weather with a clean, responsive interface — worldwide location search, current conditions, 7-day forecasts, and hourly temperature trends.",
      techs: ["React", "TypeScript", "Vite", "Zustand", "shadcn/ui"],
      links: [{ title: "Visit website", url: "https://weather-now-mentor.vercel.app/" }],
    },
    {
      slug: "libya-roots",
      title: "Libya Roots",
      description:
        "A tourism platform showcasing Libya's cultural and historical landmarks — categorized destinations, interactive maps, and saved favorites for trip planning.",
      techs: ["Angular", "TailwindCSS", "Angular Material", "Spartan UI"],
      links: [{ title: "Visit website", url: "https://libya-roots.vercel.app/" }],
    },
    {
      slug: "news-bot",
      title: "Telegram News Bot",
      description:
        "An automated bot that aggregates financial news from RSS feeds, translates articles into Arabic, and delivers them to a Telegram channel — with MongoDB-backed deduplication and rate-limit handling.",
      techs: ["Node.js", "Telegraf", "MongoDB", "Mongoose", "RSS"],
      links: [],
    },
    {
      slug: "zad-almuslim",
      title: "Zad Al-muslim",
      description:
        "An Islamic resource platform offering Quran recitations, radio stations, and educational lessons through a friendly, accessible interface.",
      techs: ["Nuxt", "Pinia", "TailwindCSS", "shadcn/ui"],
      links: [
        { title: "Visit website", url: "https://zad-almuslim.ly/" },
        { title: "View source", url: "https://github.com/Ahmedelforjani/zad-almuslim" },
      ],
    },
    {
      slug: "easy-bank",
      title: "Easy Bank",
      description:
        "A responsive landing page built with vanilla JavaScript and TailwindCSS as a Frontend Mentor challenge.",
      techs: ["HTML", "CSS", "JavaScript", "TailwindCSS"],
      links: [
        { title: "Visit website", url: "https://easybank-frontend-mentor.netlify.app/" },
        { title: "View source", url: "https://github.com/MuhammedElshreef/easy-bank" },
      ],
    },
    {
      slug: "movie-app",
      title: "Movie App",
      description:
        "A movie browsing app and my first Vue project — API data fetching, Vue Router navigation, and Pinia state management.",
      techs: ["Vue", "TailwindCSS", "Pinia", "Vue Router"],
      links: [
        { title: "Visit website", url: "http://movie-clone-iota.vercel.app/" },
        { title: "View source", url: "https://github.com/MuhammedElshreef/movie-clone" },
      ],
    },
  ] satisfies Project[],
};

export const skills = {
  index: "04",
  title: "Skills",
  groups: [
    {
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
      name: "Back-end",
      items: ["PHP", "Laravel", "Filament", "Livewire", "Node.js", "MySQL", "MongoDB"],
    },
    {
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
  socials: [{ title: "GitHub", url: "https://github.com/MuhammedElshreef" }],
};

export const nav = {
  name: "Muhammed Alsayed",
  links: [
    { title: "About", href: "#about" },
    { title: "Experience", href: "#experience" },
    { title: "Projects", href: "#projects" },
    { title: "Skills", href: "#skills" },
    { title: "Contact", href: "#contact" },
  ],
};
