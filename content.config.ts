import { defineCollection, defineContentConfig, z } from "@nuxt/content";

const seoSchema = z.object({
  title: z.string(),
  description: z.string(),
});

// Define the schema for the 'about' object
const aboutSchema = z.object({
  title: z.string(),
  description: z.string(),
});

// Define the schema for the 'company' object within 'experience.items'
const companySchema = z.object({
  name: z.string(),
  logo: z.string(),
  url: z.string().url(), // Use .url() for URL validation
  color: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/), // Simple regex for hex color
});

// Define the schema for each item in 'experience.items'
const experienceItemSchema = z.object({
  position: z.string(),
  date: z.string(),
  company: companySchema,
  description: z.string(),
});

// Define the schema for the 'experience' object
const experienceSchema = z.object({
  title: z.string(),
  items: z.array(experienceItemSchema),
});

const educationItemSchema = z.object({
  degree: z.string(),
  institution: z.string(),
  logo: z.string(),
  date: z.string(),
});

const skillsItemSchema = z.object({
  name: z.string(),
});
// Define the main schema for your content (e.g., for 'index.yml')
export const indexContentSchema = z.object({
  seo: seoSchema,
  title: z.string(),
  description: z.string(),
  about: aboutSchema,
  experience: experienceSchema,
  education: z.object({
    title: z.string(),
    items: z.array(educationItemSchema),
  }),
  skills: z.object({
    title: z.string(),
    items: z.array(skillsItemSchema),
  }),
  // You can add more fields here if your index.yml expands with blog, testimonials, FAQ etc.
  // For example:
  // blog: z.object({ title: z.string(), /* ... */ }).optional(),
  // testimonials: z.object({ title: z.string(), /* ... */ }).optional(),
  // faq: z.object({ title: z.string(), /* ... */ }).optional(),
});

const projectLinkSchema = z.object({
  title: z.string(),
  url: z.string().url(), // Ensure URL is valid
});
const projectItemSchema = z.object({
  title: z.string(),
  description: z.string(),
  techs: z.array(z.string()),
  image: z.string().optional(),
  alt: z.string().optional(),
  links: z.array(projectLinkSchema),
});
const projectScheme = z.object({
  title: z.string(),
  description: z.string(),
  items: z.array(projectItemSchema),
});

export const projectContentScheme = z.object({
  seo: seoSchema,
  title: z.string(),
  description: z.string(),
  projects: projectScheme,
});

export default defineContentConfig({
  collections: {
    index: defineCollection({
      type: "data",
      source: "index.json",
      schema: indexContentSchema,
    }),
    projects: defineCollection({
      type: "data",
      source: "projects.json",
      schema: projectContentScheme,
    }),
  },
});
