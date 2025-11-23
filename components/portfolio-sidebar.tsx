"use client"
import type { PortfolioSection } from "@/app/page"
import { useEffect, useState } from "react"

interface PortfolioSidebarProps {
  activeSection: PortfolioSection
  setActiveSection: (section: PortfolioSection) => void
}

export default function PortfolioSidebar({ activeSection, setActiveSection }: PortfolioSidebarProps) {
  const [revealed, setRevealed] = useState(false)

  // Reveal on first interaction on mobile only
  useEffect(() => {
    if (!window.matchMedia("(max-width: 767px)").matches) return
    const onFirst = () => {
      setRevealed(true)
      window.removeEventListener("wheel", onFirst as EventListener)
      window.removeEventListener("touchstart", onFirst as EventListener)
    }
    window.addEventListener("wheel", onFirst as EventListener, { passive: true })
    window.addEventListener("touchstart", onFirst as EventListener, { passive: true })
    return () => {
      window.removeEventListener("wheel", onFirst as EventListener)
      window.removeEventListener("touchstart", onFirst as EventListener)
    }
  }, [])
  const menuItems = [
    { id: "intro" as PortfolioSection, label: "About" },
    { id: "experience" as PortfolioSection, label: "Experience" },
    { id: "projects" as PortfolioSection, label: "Projects" },
    { id: "skills" as PortfolioSection, label: "Skills" },
  ]

  // Keyboard navigation is now handled centrally in app/page.tsx

  return (
    <nav
      className={`absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 transition-transform duration-300 will-change-transform
                  ${revealed ? "translate-x-0" : "translate-x-16"} md:translate-x-0`}
      data-mobile-slide
      aria-label="Portfolio section navigation"
    >
      <div className="flex flex-col gap-4 md:gap-6">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveSection(item.id)}
            type="button"
            aria-current={activeSection === item.id ? "page" : undefined}
            className={`
              group flex items-center justify-end gap-2 md:gap-4 transition-all duration-300
              ${activeSection === item.id ? "text-white transform -translate-x-1 md:-translate-x-2" : "text-white/50 hover:text-white/80"}
            focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-black rounded-full
            `}
          >
            <span className="text-sm md:text-xl font-light whitespace-nowrap">{item.label}</span>
            <div
              className={`
              w-1.5 h-1.5 md:w-2 md:h-2 rounded-full transition-all duration-300 flex-shrink-0
              ${activeSection === item.id ? "bg-white" : "bg-white/30 group-hover:bg-white/50"}
            `}
            />
          </button>
        ))}
      </div>
    </nav>
  )
}
