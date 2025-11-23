import type React from "react"
import type { Metadata } from "next"
import { Figtree } from "next/font/google"
import { GeistMono } from "geist/font/mono"
import { Instrument_Serif } from "next/font/google"
import "./globals.css"

const figtree = Figtree({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-figtree",
  display: "swap",
})

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--font-instrument-serif",
  display: "swap",
})

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://zyadhaddad.dev"
const metadataBase = (() => {
  try {
    return new URL(siteUrl)
  } catch {
    return undefined
  }
})()
const structuredData = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Zyad Haddad",
  url: siteUrl,
  jobTitle: "AI Engineer & Full-Stack Developer",
  affiliation: ["INSA Lyon", "KTH Royal Institute of Technology"],
  sameAs: ["https://github.com/Trighap52", "mailto:trighap52@gmail.com"],
  knowsAbout: ["Machine Learning", "Distributed Systems", "Full-Stack Development", "LangChain", "Next.js"],
}

export const metadata: Metadata = {
  metadataBase,
  title: {
    default: "Zyad Haddad | AI Engineer & Full-Stack Developer",
    template: "%s | Zyad Haddad",
  },
  description:
    "Portfolio of Zyad Haddad, an AI engineer and full-stack developer studying at INSA Lyon and KTH.",
  keywords: [
    "Zyad Haddad",
    "AI engineer",
    "full-stack developer",
    "INSA Lyon",
    "KTH",
    "LangChain",
    "Next.js portfolio",
    "machine learning engineer",
    "distributed systems",
    "React",
    "TypeScript",
  ],
  authors: [{ name: "Zyad Haddad", url: "https://github.com/Trighap52" }],
  creator: "Zyad Haddad",
  publisher: "Zyad Haddad",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Zyad Haddad | AI Engineer & Full-Stack Developer",
    description:
      "Portfolio of Zyad Haddad, an AI engineer and full-stack developer studying at INSA Lyon and KTH who ships AI products, distributed systems, and web experiences.",
    url: "/",
    siteName: "Zyad Haddad Portfolio",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Zyad Haddad | AI Engineer & Full-Stack Developer",
    description:
      "Portfolio of Zyad Haddad, an AI engineer and full-stack developer studying at INSA Lyon and KTH.",
  },
  robots: {
    index: true,
    follow: true,
  },
  category: "technology",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <style>{`
html {
  font-family: ${figtree.style.fontFamily};
  --font-sans: ${figtree.variable};
  --font-mono: ${GeistMono.variable};
  --font-instrument-serif: ${instrumentSerif.variable};
}
        `}</style>
      </head>
      <body className={`${figtree.variable} ${instrumentSerif.variable}`}>{children}</body>
    </html>
  )
}
