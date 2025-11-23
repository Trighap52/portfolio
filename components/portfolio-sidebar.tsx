"use client"
import type { PortfolioSection } from "@/app/page"
import { useEffect, useState } from "react"
import type { CardInfo } from "@/lib/cards"

interface PortfolioSidebarProps {
  activeSection: PortfolioSection
  setActiveSection: (section: PortfolioSection) => void
  sectionCards: Partial<Record<PortfolioSection, CardInfo>>
}

function MiniCard({
  card,
  visited,
  active,
}: {
  card?: CardInfo
  visited: boolean
  active: boolean
}) {
  const suitSymbols: Record<CardInfo["suit"], string> = {
    H: "♥",
    D: "♦",
    S: "♠",
    C: "♣",
  }
  const suitColor: Record<CardInfo["suit"], string> = {
    H: "text-red-400",
    D: "text-red-400",
    S: "text-black",
    C: "text-black",
  }
  const suitIcon = card ? suitSymbols[card.suit] : "♣"
  const suitClass = card ? suitColor[card.suit] : "text-white/60"

  return (
    <div className={`relative w-3.5 h-5 md:w-4 md:h-6`} style={{ perspective: 400 }}>
      <div
        className={`absolute inset-0 rounded-[3px] border border-white/30 transition-all duration-300`}
        style={{
          transformStyle: "preserve-3d",
          transform: visited ? "rotateY(0deg)" : "rotateY(180deg)",
          boxShadow: active ? "0 0 0 1px rgba(255,255,255,0.4)" : "none",
        }}
      >
        <div
          className="absolute inset-0 rounded-[3px] bg-white/15 text-[8px] md:text-[9px] font-bold text-white flex items-center justify-center gap-0.5"
          style={{ backfaceVisibility: "hidden" }}
        >
          <span>{card?.rank ?? "?"}</span>
          <span className={suitClass}>{suitIcon}</span>
        </div>
        <div
          className="absolute inset-0 rounded-[3px] bg-gradient-to-br from-purple-500/70 to-indigo-600/80"
          style={{ transform: "rotateY(180deg)", backfaceVisibility: "hidden" }}
        />
      </div>
    </div>
  )
}

export default function PortfolioSidebar({ activeSection, setActiveSection, sectionCards }: PortfolioSidebarProps) {
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
    { id: "score" as PortfolioSection, label: "Score" },
  ]

  // Keyboard navigation is now handled centrally in app/page.tsx

  return (
    <nav
      className={`absolute right-2 md:right-8 top-1/2 -translate-y-1/2 z-20 transition-transform duration-300 will-change-transform
                  ${revealed ? "translate-x-0" : "translate-x-10"} md:translate-x-0`}
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
            <MiniCard
              card={sectionCards[item.id]}
              visited={Boolean(sectionCards[item.id])}
              active={activeSection === item.id}
            />
          </button>
        ))}
      </div>
    </nav>
  )
}
