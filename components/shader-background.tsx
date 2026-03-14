"use client";

import type React from "react";
import { useEffect, useRef } from "react";
import { BalatroShader } from "@/lib/balatro-shader";

interface ShaderBackgroundProps {
  children: React.ReactNode;
}

export default function ShaderBackground({ children }: ShaderBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) {
      return;
    }

    const shader = new BalatroShader({
      container: containerRef.current,
      colours: { c1: "#DE443B", c2: "#006BB4", c3: "#162325" },
      speed: 1.4,
      contrast: 2,
      spinAmount: 0.5,
      pixelSizeFac: 1000,
      spinEase: 0.5,
      zoom: 30,
      offsetX: 0.0,
      offsetY: 0.0,
      opacity: 1.0,
      maxFPS: 30,
    });

    return () => {
      shader.destroy();
    };
  }, []);

  return (
    <div
      className="crt-shell min-h-[100dvh] bg-black relative overflow-hidden isolate"
      style={{ paddingBottom: "var(--safe-area-bottom)" }}
    >
      <div ref={containerRef} className="absolute inset-0 z-0" />
      <div aria-hidden="true" className="crt-bloom absolute inset-0 z-40 pointer-events-none" />
      <div aria-hidden="true" className="crt-scanlines absolute inset-0 z-50 pointer-events-none" />
      <div aria-hidden="true" className="crt-mask absolute inset-0 z-60 pointer-events-none" />
      <div aria-hidden="true" className="crt-vignette absolute inset-0 z-70 pointer-events-none" />
      <div aria-hidden="true" className="crt-flicker absolute inset-0 z-80 pointer-events-none" />
      {children}
    </div>
  );
}
