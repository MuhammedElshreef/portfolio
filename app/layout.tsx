import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import { contact, experience, hero, seo } from "@/lib/content";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  style: ["normal", "italic"],
  subsets: ["latin"],
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

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f5f1e8" },
    { media: "(prefers-color-scheme: dark)", color: "#151c26" },
  ],
};

// Runs while the <head> parses, before first paint: saved theme wins,
// otherwise follow the system. Light mode is the attribute-less default.
const themeBootScript = `(function(){try{var t=localStorage.getItem("theme");if(!t)t=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";if(t==="dark")document.documentElement.setAttribute("data-theme","dark")}catch(e){}})()`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBootScript }} />
      </head>
      <body className="grain min-h-full flex flex-col">
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
