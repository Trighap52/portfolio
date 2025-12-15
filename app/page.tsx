"use client"

import HeroContent from "@/components/hero-content"
import ShaderBackground from "@/components/shader-background"
import PortfolioSidebar from "@/components/portfolio-sidebar"
import { PlayingCard } from "@/components/playing-card"
import { buildDeck, shuffleDeck } from "@/lib/cards"
import type { CardInfo } from "@/lib/cards"
import { useState, useEffect, useRef, useMemo } from "react"

export type PortfolioSection = "intro" | "experience" | "projects" | "skills" | "score"
const SECTION_ORDER: PortfolioSection[] = ["intro", "experience", "projects", "skills", "score"]
const CARD_SECTIONS: PortfolioSection[] = ["intro", "experience", "projects", "skills", "score"]

export default function Portfolio() {
  const [activeSection, setActiveSection] = useState<PortfolioSection>("intro")
  const [transitionDir, setTransitionDir] = useState<"up" | "down" | null>(null)
  const throttleRef = useRef(false)
  const touchStartY = useRef<number | null>(null)
  const drawIndex = useRef(0)
  const deck = useMemo(() => shuffleDeck(buildDeck()), [])
  const [sectionCards, setSectionCards] = useState<Partial<Record<PortfolioSection, CardInfo>>>({})
  const scoreUnlocked = useMemo(
    () => ["intro", "experience", "projects", "skills"].every((key) => sectionCards[key as PortfolioSection]),
    [sectionCards]
  )
  const navSections = useMemo(
    () => (scoreUnlocked ? SECTION_ORDER : SECTION_ORDER.filter((s) => s !== "score")),
    [scoreUnlocked]
  )


  useEffect(() => {
    // Lock page scroll to avoid conflicts with section-based navigation
    const prevBodyOverflow = document.body.style.overflow
    const prevHtmlOverflow = document.documentElement.style.overflow
    document.body.style.overflow = "hidden"
    document.documentElement.style.overflow = "hidden"
    // Prevent touchmove to avoid iOS rubber-band scrolling
    const preventTouchMove = (e: TouchEvent) => {
      e.preventDefault()
    }
    window.addEventListener("touchmove", preventTouchMove, { passive: false })
    return () => {
      document.body.style.overflow = prevBodyOverflow
      document.documentElement.style.overflow = prevHtmlOverflow
      window.removeEventListener("touchmove", preventTouchMove as EventListener)
    }
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const currentIndex = navSections.indexOf(activeSection)

      if (e.key === "ArrowDown" || e.key === "ArrowRight") {
        e.preventDefault()
        const nextIndex = (currentIndex + 1) % navSections.length
        setTransitionDir("down")
        setActiveSection(navSections[nextIndex])
      } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
        e.preventDefault()
        const prevIndex = (currentIndex - 1 + navSections.length) % navSections.length
        setTransitionDir("up")
        setActiveSection(navSections[prevIndex])
      } else if (e.key === "Enter") {
        e.preventDefault()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [activeSection, navSections])

  useEffect(() => {
    // Clear the transition hint shortly after section changes
    if (transitionDir) {
      const t = setTimeout(() => setTransitionDir(null), 600)
      return () => clearTimeout(t)
    }
  }, [activeSection, transitionDir])

  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      if (throttleRef.current) return
      if (Math.abs(e.deltaY) < 20) return
      e.preventDefault()
      throttleRef.current = true
      setTimeout(() => {
        throttleRef.current = false
      }, 650)

      const currentIndex = navSections.indexOf(activeSection)
      if (e.deltaY > 0) {
        const nextIndex = (currentIndex + 1) % navSections.length
        setTransitionDir("down")
        setActiveSection(navSections[nextIndex])
      } else if (e.deltaY < 0) {
        const prevIndex = (currentIndex - 1 + navSections.length) % navSections.length
        setTransitionDir("up")
        setActiveSection(navSections[prevIndex])
      }
    }

    const onTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0]?.clientY ?? null
    }

    const onTouchEnd = (e: TouchEvent) => {
      if (throttleRef.current) return
      const startY = touchStartY.current
      const endY = e.changedTouches[0]?.clientY
      if (startY == null || endY == null) return
      const deltaY = endY - startY
      if (Math.abs(deltaY) < 40) return
      throttleRef.current = true
      setTimeout(() => {
        throttleRef.current = false
      }, 650)

      const currentIndex = navSections.indexOf(activeSection)
      if (deltaY < 0) {
        const nextIndex = (currentIndex + 1) % navSections.length
        setTransitionDir("down")
        setActiveSection(navSections[nextIndex])
      } else {
        const prevIndex = (currentIndex - 1 + navSections.length) % navSections.length
        setTransitionDir("up")
        setActiveSection(navSections[prevIndex])
      }
    }

    window.addEventListener("wheel", onWheel, { passive: false })
    window.addEventListener("touchstart", onTouchStart, { passive: true })
    window.addEventListener("touchend", onTouchEnd, { passive: true })
    return () => {
      window.removeEventListener("wheel", onWheel as EventListener)
      window.removeEventListener("touchstart", onTouchStart as EventListener)
      window.removeEventListener("touchend", onTouchEnd as EventListener)
    }
  }, [activeSection, navSections])

  useEffect(() => {
    if (!sectionCards[activeSection]) {
      const nextCard = deck[drawIndex.current % deck.length]
      drawIndex.current += 1
      setSectionCards((prev) => ({ ...prev, [activeSection]: nextCard }))
    }
  }, [activeSection, deck, sectionCards])

  const activeCard = sectionCards[activeSection]
  const totalScore = useMemo(
    () =>
      CARD_SECTIONS.reduce((sum, key) => {
        const card = sectionCards[key]
        return sum + (card?.value ?? 0)
      }, 0),
    [sectionCards]
  )
  const drawnCount = useMemo(
    () => CARD_SECTIONS.filter((key) => sectionCards[key]).length,
    [sectionCards]
  )
  const handleReset = () => {
    window.location.reload()
  }

  return (
    <ShaderBackground activeSection={activeSection} transitionDirection={transitionDir}>
      {activeSection !== "score" && (
        <div className="absolute top-4 left-1/2 z-30 -translate-x-1/2 flex flex-col items-center gap-2 mt-6">
          <PlayingCard
            card={activeCard}
            size="md"
            flipKey={`active-${activeCard?.id ?? "none"}`}
            label="Active section card"
          />
        </div>
      )}

      <div
        className="absolute top-4 left-4 right-4 border-2 border-white/30 rounded-lg overflow-hidden"
        style={{ bottom: "calc(1rem + var(--safe-area-bottom))" }}
      >
        <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />
        <div className="relative h-full">
          <HeroContent
            activeSection={activeSection}
            direction={transitionDir}
            sectionCards={sectionCards}
            totalScore={totalScore}
            onReset={handleReset}
            cardSections={CARD_SECTIONS}
          />
          <PortfolioSidebar
            activeSection={activeSection}
            setActiveSection={setActiveSection}
            sectionCards={sectionCards}
            scoreUnlocked={scoreUnlocked}
          />
        </div>
      </div>
    </ShaderBackground>
  )
}
