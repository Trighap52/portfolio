import type { Metadata } from "next"
import type { ReactNode } from "react"

export const metadata: Metadata = {
  title: "Maria, will you go out with me?",
  description: "date invitation page.",
  alternates: { canonical: "/date" },
  openGraph: {
    title: "Maria, will you go out with me?",
    description: "date invitation page.",
    url: "/date",
  },
}

export default function DateLayout({ children }: { children: ReactNode }) {
  return children
}
