"use client"

import type React from "react"
import { useEffect, useMemo, useRef } from "react"
import type { PortfolioSection } from "@/app/page"
import { BalatroShader } from "@/lib/balatro-shader"

interface ShaderBackgroundProps {
  children: React.ReactNode
  activeSection: PortfolioSection
  transitionDirection?: "up" | "down" | null
}

const colourMap: Record<PortfolioSection, { c1: string; c2: string; c3: string }> = {
  intro: { c1: "#FF1919", c2: "#0ea5e9", c3: "#0a0a0a" },
  experience: { c1: "#3b82f6", c2: "#0ea5e9", c3: "#0a0a0a" },
  projects: { c1: "#10b981", c2: "#22c55e", c3: "#0a0a0a" },
  skills: { c1: "#f59e0b", c2: "#f97316", c3: "#0a0a0a" },
  score: { c1: "#6366f1", c2: "#a855f7", c3: "#0a0a0a" },
}

export default function ShaderBackground({ children, activeSection, transitionDirection }: ShaderBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const shaderRef = useRef<BalatroShader | null>(null)

  const colours = useMemo(() => colourMap[activeSection] ?? colourMap.intro, [activeSection])
  const speed = useMemo(() => (transitionDirection ? 1.8 : 1), [transitionDirection])

  useEffect(() => {
    const el = containerRef.current
    if (!el || shaderRef.current) return
    shaderRef.current = new BalatroShader({
      container: el,
      colours,
      speed,
      spinAmount: 0.25,
      contrast: 3.5,
      pixelSizeFac: 745,
      spinEase: 1,
      zoom: 30,
      offsetX: 0,
      offsetY: 0,
      enableSpin: false,
      autoResize: true,
      opacity: 1,
    })

    return () => {
      shaderRef.current?.destroy()
      shaderRef.current = null
    }
  }, [])

  useEffect(() => {
    shaderRef.current?.update({ colours, speed })
  }, [colours, speed])

  return (
    <div ref={containerRef} className="min-h-screen bg-black relative overflow-hidden">
      {children}
    </div>
  )
}
