import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import { Bricolage_Grotesque, Hanken_Grotesk, JetBrains_Mono, Rakkas } from "next/font/google";
import { contact, experience, hero, seo } from "@/lib/content";
import "./globals.css";

// Display face; the optical-size axis is used across the headline sizes
const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  axes: ["opsz"],
});

const hanken = Hanken_Grotesk({
  variable: "--font-hanken",
  subsets: ["latin"],
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
});

// Arabic name in the logo, intro and footer
const rakkas = Rakkas({
  variable: "--font-rakkas",
  weight: "400",
  subsets: ["arabic"],
});

export const metadata: Metadata = {
  metadataBase: new URL(seo.url),
  title: seo.title,
  description: seo.description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: hero.name,
    title: seo.title,
    description: seo.description,
    locale: "en_US",
    alternateLocale: ["ar_LY"],
  },
  twitter: {
    card: "summary_large_image",
    title: seo.title,
    description: seo.description,
  },
  authors: [{ name: hero.name, url: seo.url }],
  creator: hero.name,
  verification: { google: "OyGvo6F2g1HHO67c1GBQY85gsKFkDFG2DokAFhUdKJg" },
  keywords: [
    ...seo.aliases,
    "Muhammed",
    "محمد",
    "Full-Stack Web Developer",
    "مطور ويب",
    "Tripoli",
    "Libya",
    "ليبيا",
    "Laravel",
    "Angular",
    "Vue",
    "React",
  ],
};

export const viewport: Viewport = {
  themeColor: "#07090c",
};

// Structured data so search engines understand who this site is about, under every name
const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": `${seo.url}/#person`,
      name: seo.fullName,
      givenName: "Muhammed",
      additionalName: "Khaled",
      familyName: "Alsayed",
      alternateName: seo.aliases,
      honorificPrefix: "Eng.",
      url: seo.url,
      image: `${seo.url}/me.jpg`,
      jobTitle: seo.role,
      description: seo.description,
      email: `mailto:${contact.email}`,
      address: { "@type": "PostalAddress", addressLocality: "Tripoli", addressCountry: "LY" },
      alumniOf: { "@type": "CollegeOrUniversity", name: experience.education.institution },
      knowsLanguage: ["ar", "en"],
      sameAs: contact.socials.map((social) => social.url),
    },
    {
      "@type": "WebSite",
      "@id": `${seo.url}/#website`,
      url: seo.url,
      name: hero.name,
      alternateName: [seo.fullName, "Elshreef", seo.arabicName, seo.arabicFullName],
      inLanguage: "en",
      publisher: { "@id": `${seo.url}/#person` },
    },
  ],
};

// Runs before first paint: motion styles (intro, sticky cards) only when motion is allowed
const motionScript = `try{if(!matchMedia("(prefers-reduced-motion: reduce)").matches)document.documentElement.classList.add("motion")}catch(e){}`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${bricolage.variable} ${hanken.variable} ${jetbrains.variable} ${rakkas.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: motionScript }} />
      </head>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
