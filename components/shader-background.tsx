"use client";

import type React from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { MeshGradient } from "@paper-design/shaders-react";
import type { PortfolioSection } from "@/app/page";

interface ShaderBackgroundProps {
  children: React.ReactNode;
  activeSection: PortfolioSection;
  transitionDirection?: "up" | "down" | null;
}

const colorSchemes: Record<PortfolioSection, string[]> = {
  intro: ["#000000", "#3b82f6", "#ffffff", "#1e3a8a", "#1d4ed8"],
  experience: ["#000000", "#8b5cf6", "#ffffff", "#1e1b4b", "#4c1d95"],
  projects: ["#000000", "#10b981", "#ffffff", "#064e3b", "#047857"],
  skills: ["#000000", "#f59e0b", "#ffffff", "#92400e", "#d97706"],
  score: ["#000000", "#EE4B2B", "#ffffff", "#880808", "#D2042D"],
};

export default function ShaderBackground({
  children,
  activeSection,
  transitionDirection,
}: ShaderBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isActive, setIsActive] = useState(false);
  const isTransitioning = Boolean(transitionDirection);

  // Memoize color arrays so only section change updates them
  const baseColors = useMemo(() => {
    const colors = colorSchemes[activeSection];
    return colors ?? colorSchemes.intro;
  }, [activeSection]);
  const overlayColors = useMemo(
    () => ["#000000", "#ffffff", baseColors[1], "#000000"],
    [baseColors]
  );

  useEffect(() => {
    const handleMouseEnter = () => setIsActive(true);
    const handleMouseLeave = () => setIsActive(false);

    const container = containerRef.current;
    if (container) {
      container.addEventListener("mouseenter", handleMouseEnter);
      container.addEventListener("mouseleave", handleMouseLeave);
    }

    return () => {
      if (container) {
        container.removeEventListener("mouseenter", handleMouseEnter);
        container.removeEventListener("mouseleave", handleMouseLeave);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="min-h-[100dvh] bg-black relative overflow-hidden"
      style={{ paddingBottom: "var(--safe-area-bottom)" }}
    >
      {/* SVG Filters */}
      <svg className="absolute inset-0 w-0 h-0">
        <defs>
          <filter
            id="glass-effect"
            x="-50%"
            y="-50%"
            width="200%"
            height="200%"
          >
            <feTurbulence baseFrequency="0.005" numOctaves="1" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="0.3" />
            <feColorMatrix
              type="matrix"
              values="1 0 0 0 0.02
                      0 1 0 0 0.02
                      0 0 1 0 0.05
                      0 0 0 0.9 0"
              result="tint"
            />
          </filter>
          <filter
            id="gooey-filter"
            x="-50%"
            y="-50%"
            width="200%"
            height="200%"
          >
            <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9"
              result="gooey"
            />
            <feComposite in="SourceGraphic" in2="gooey" operator="atop" />
          </filter>
        </defs>
      </svg>

      <MeshGradient
        className="absolute inset-0 w-full h-full"
        colors={baseColors}
        speed={0.4 + (isTransitioning ? 0.8 : 0)}
        distortion={1}
        swirl={0.2}
        // Remove invalid DOM prop warning: backgroundColor isn't a valid MeshGradient prop in this setup
        />
      <MeshGradient
        className="absolute inset-0 w-full h-full opacity-60"
        colors={overlayColors}
        speed={0.1 + (isTransitioning ? 0.4 : 0)}
        distortion={0.1}
        swirl={0.08}
        // Remove invalid DOM prop warning: backgroundColor isn't a valid MeshGradient prop in this setup
      />

      {children}
    </div>
  );
}
