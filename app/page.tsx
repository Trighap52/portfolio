"use client"

import HeroContent from "@/components/hero-content"
import ShaderBackground from "@/components/shader-background"
import PortfolioSidebar from "@/components/portfolio-sidebar"
import { useState, useEffect, useRef } from "react"

export type PortfolioSection = "intro" | "experience" | "projects" | "skills"

export default function Portfolio() {
  const [activeSection, setActiveSection] = useState<PortfolioSection>("intro")
  const [transitionDir, setTransitionDir] = useState<"up" | "down" | null>(null)
  const throttleRef = useRef(false)
  const touchStartY = useRef<number | null>(null)
  

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
    const sections: PortfolioSection[] = ["intro", "experience", "projects", "skills"]

    const handleKeyDown = (e: KeyboardEvent) => {
      const currentIndex = sections.indexOf(activeSection)

      if (e.key === "ArrowDown" || e.key === "ArrowRight") {
        e.preventDefault()
        const nextIndex = (currentIndex + 1) % sections.length
        setTransitionDir("down")
        setActiveSection(sections[nextIndex])
      } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
        e.preventDefault()
        const prevIndex = (currentIndex - 1 + sections.length) % sections.length
        setTransitionDir("up")
        setActiveSection(sections[prevIndex])
      } else if (e.key === "Enter") {
        e.preventDefault()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [activeSection])

  useEffect(() => {
    // Clear the transition hint shortly after section changes
    if (transitionDir) {
      const t = setTimeout(() => setTransitionDir(null), 600)
      return () => clearTimeout(t)
    }
  }, [activeSection, transitionDir])

  useEffect(() => {
    const sections: PortfolioSection[] = ["intro", "experience", "projects", "skills"]

    const onWheel = (e: WheelEvent) => {
      if (throttleRef.current) return
      if (Math.abs(e.deltaY) < 20) return
      e.preventDefault()
      throttleRef.current = true
      setTimeout(() => {
        throttleRef.current = false
      }, 650)

      const currentIndex = sections.indexOf(activeSection)
      if (e.deltaY > 0) {
        const nextIndex = (currentIndex + 1) % sections.length
        setTransitionDir("down")
        setActiveSection(sections[nextIndex])
      } else if (e.deltaY < 0) {
        const prevIndex = (currentIndex - 1 + sections.length) % sections.length
        setTransitionDir("up")
        setActiveSection(sections[prevIndex])
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

      const currentIndex = sections.indexOf(activeSection)
      if (deltaY < 0) {
        const nextIndex = (currentIndex + 1) % sections.length
        setTransitionDir("down")
        setActiveSection(sections[nextIndex])
      } else {
        const prevIndex = (currentIndex - 1 + sections.length) % sections.length
        setTransitionDir("up")
        setActiveSection(sections[prevIndex])
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
  }, [activeSection])

  return (
    <ShaderBackground activeSection={activeSection} transitionDirection={transitionDir}>
      <div className="absolute inset-4 border-2 border-white/30 rounded-lg overflow-hidden">
        <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />
        <div className="relative h-full">
          <HeroContent activeSection={activeSection} direction={transitionDir} />
          <PortfolioSidebar activeSection={activeSection} setActiveSection={setActiveSection} />
        </div>
      </div>
    </ShaderBackground>
  )
}
