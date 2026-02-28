import type { Metadata } from "next";

export const metadataConfig: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"),
  title: {
    default: "HackJS | The Ultimate Monorepo Stack",
    template: "%s | HackJS",
  },
  description:
    "HackJS is a high-performance monorepo starter kit featuring Next.js 16, React 19, Bun, Turbo, Better Auth, and Drizzle ORM.",
  keywords: [
    "HackJS",
    "Next.js",
    "React",
    "Bun",
    "Turbo",
    "Drizzle ORM",
    "Better Auth",
    "Tailwind CSS",
    "Monorepo",
    "Starter Kit",
    "Fullstack",
    "TypeScript",
    "Fullstack",
  ],
  authors: [{ name: "Daniel Karume", url: "https://github.com/karume-lab/hackjs" }],
  creator: "Daniel Karume",
  publisher: "Daniel Karume",

  openGraph: {
    title: "HackJS | The Ultimate Monorepo Stack",
    description:
      "Build faster with HackJS. A modern monorepo template for high-performance web and mobile applications.",
    url: process.env.NEXT_PUBLIC_APP_URL,
    siteName: "HackJS",
    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "HackJS | The Ultimate Monorepo Stack",
    description: "Build faster with HackJS. Next.js 16, React 19, and More.",
    creator: "@karume-lab",
  },

  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  alternates: {
    canonical: process.env.NEXT_PUBLIC_APP_URL,
  },

  category: "technology",
};

const SEOConfig = () => {
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "HackJS",
    alternateName: "HackJS Starter Kit",
    url: process.env.NEXT_PUBLIC_APP_URL,
    description: "High-performance monorepo starter kit",
    author: {
      "@type": "Organization",
      name: "Daniel Karume",
    },
    inLanguage: "en-US",
  };

  return (
    <script
      type="application/ld+json"
      // biome-ignore lint/security/noDangerouslySetInnerHtml: required for JSON-LD
      dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
    />
  );
};

export default SEOConfig;
