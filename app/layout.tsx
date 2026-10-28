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

// Arabic name in the logo, intro, marquee and footer
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
    hero.name,
    seo.arabicName,
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

// Structured data so search engines understand who this site is about
const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: hero.name,
  alternateName: seo.arabicName,
  url: seo.url,
  jobTitle: hero.role.join(" "),
  email: `mailto:${contact.email}`,
  address: { "@type": "PostalAddress", addressLocality: "Tripoli", addressCountry: "LY" },
  alumniOf: experience.education.institution,
  sameAs: contact.socials.map((social) => social.url),
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
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
