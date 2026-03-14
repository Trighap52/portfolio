"use client"
import type { PortfolioSection } from "@/app/page"
import { useEffect, useRef, useState } from "react"
import type { CardInfo } from "@/lib/cards"
import { PlayingCard } from "@/components/playing-card"

interface PortfolioSidebarProps {
  activeSection: PortfolioSection
  setActiveSection: (section: PortfolioSection) => void
  sectionCards: Partial<Record<PortfolioSection, CardInfo>>
  scoreUnlocked: boolean
}

function MiniCard({
  section,
  card,
  visited,
  active,
}: {
  section: PortfolioSection
  card?: CardInfo
  visited: boolean
  active: boolean
}) {
  return (
    <div className={`relative transition-transform duration-200 ${active ? "scale-105" : ""}`}>
      <PlayingCard
        card={card}
        size="xs"
        flipKey={`sidebar-${section}-${card?.id ?? "hidden"}-${visited ? "up" : "down"}`}
        label={`${section} mini card`}
        revealed={visited}
      />
      {active ? <div className="pointer-events-none absolute inset-0 rounded-[3px] ring-1 ring-white/80" /> : null}
    </div>
  )
}

export default function PortfolioSidebar({
  activeSection,
  setActiveSection,
  sectionCards,
  scoreUnlocked,
}: PortfolioSidebarProps) {
  const [revealed, setRevealed] = useState(true)
  const revealTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Reveal on first interaction on mobile only
  useEffect(() => {
    if (!window.matchMedia("(max-width: 767px)").matches) return
    const onFirst = () => {
      setRevealed(true)
    }
    window.addEventListener("wheel", onFirst as EventListener, { passive: true })
    return () => {
      window.removeEventListener("wheel", onFirst as EventListener)
    }
  }, [])

  useEffect(() => {
    if (revealTimer.current) clearTimeout(revealTimer.current)
    revealTimer.current = setTimeout(() => setRevealed(false), 1000)
    return () => {
      if (revealTimer.current) clearTimeout(revealTimer.current)
    }
  }, [revealed])
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
      className={`hidden md:block absolute right-2 md:right-8 top-1/2 -translate-y-1/2 z-20 transition-transform duration-300 will-change-transform
                  ${revealed ? "translate-x-0" : "translate-x-30"} md:translate-x-0`}
      data-mobile-slide
      aria-label="Portfolio section navigation"
    >
      <div className="flex flex-col gap-4 md:gap-6">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              if (item.id === "score" && !scoreUnlocked) return
              setActiveSection(item.id)
            }}
            type="button"
            aria-current={activeSection === item.id ? "page" : undefined}
            aria-disabled={item.id === "score" && !scoreUnlocked}
            className={`
              group flex items-center justify-end gap-2 md:gap-4 transition-all duration-300
              ${item.id === "score" && !scoreUnlocked ? "text-white/30 cursor-not-allowed" : activeSection === item.id ? "text-white transform -translate-x-1 md:-translate-x-2" : "text-white/50 hover:text-white/80"}
            focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-black rounded-full
            `}
            disabled={item.id === "score" && !scoreUnlocked}
          >
            <span className="text-sm md:text-xl font-light whitespace-nowrap">{item.label}</span>
            <MiniCard
              section={item.id}
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
