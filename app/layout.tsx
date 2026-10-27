import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { Geist, Geist_Mono } from "next/font/google";
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
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
