"use client"

import { motion } from "framer-motion"
import type { CSSProperties, PointerEvent as ReactPointerEvent } from "react"
import type { CardInfo } from "@/lib/cards"

interface PlayingCardProps {
  card?: CardInfo
  size?: "xs" | "sm" | "md" | "lg"
  flipKey?: string
  label?: string
  revealed?: boolean
}

const ATLAS_COLUMNS = 14
const ATLAS_ROWS = 4
const BACK_COLUMN = 0
const RED_BACK_ROW = 0

const rankColumns: Record<string, number> = {
  A: 1,
  "2": 2,
  "3": 3,
  "4": 4,
  "5": 5,
  "6": 6,
  "7": 7,
  "8": 8,
  "9": 9,
  "10": 10,
  J: 11,
  Q: 12,
  K: 13,
}

const suitRows: Record<CardInfo["suit"], number> = {
  H: 0,
  C: 1,
  D: 2,
  S: 3,
}

const sizeClasses: Record<NonNullable<PlayingCardProps["size"]>, string> = {
  xs: "w-3.5 md:w-4 aspect-[71/95]",
  sm: "w-16 md:w-20 aspect-[71/95]",
  md: "w-20 md:w-24 aspect-[71/95]",
  lg: "w-24 md:w-28 aspect-[71/95]",
}

const cardSpriteBaseStyle: CSSProperties = {
  backgroundImage: "url('/cards/BalatroCards_Free.png')",
  backgroundSize: `${ATLAS_COLUMNS * 100}% ${ATLAS_ROWS * 100}%`,
  backgroundRepeat: "no-repeat",
  backgroundColor: "#fff",
  imageRendering: "pixelated",
}

const atlasPosition = (column: number, row: number) => {
  const x = (column / (ATLAS_COLUMNS - 1)) * 100
  const y = (row / (ATLAS_ROWS - 1)) * 100
  return `${x}% ${y}%`
}

const clamp = (x: number) => Math.min(1, Math.max(-1, x))

const shouldSkipPointerEffect = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches

const setCardCssVar = (target: HTMLDivElement, key: string, value: string) => {
  target.style.setProperty(key, value)
}

const updateCardPointerVars = (target: HTMLDivElement, event: ReactPointerEvent<HTMLDivElement>) => {
  const rect = target.getBoundingClientRect()
  if (rect.width === 0 || rect.height === 0) return

  const x = event.clientX - rect.left
  const y = event.clientY - rect.top
  const cx = clamp((2 * x) / rect.width - 1)
  const cy = clamp((2 * y) / rect.height - 1)
  const angle = Math.atan2(cy, cx) + Math.PI / 2
  const radius = Math.sqrt(cx ** 2 + cy ** 2)

  setCardCssVar(target, "--x", `${cx}`)
  setCardCssVar(target, "--y", `${cy}`)
  setCardCssVar(target, "--angle", `${angle}rad`)
  setCardCssVar(target, "--r", `${radius}`)
}

export function PlayingCard({ card, size = "md", flipKey, label, revealed = true }: PlayingCardProps) {
  const faceKey = flipKey ?? card?.id ?? "card-face"
  const rotation = revealed ? 0 : 180
  const faceColumn = card ? (rankColumns[card.rank] ?? BACK_COLUMN) : BACK_COLUMN
  const faceRow = card ? suitRows[card.suit] : RED_BACK_ROW
  const frontPosition = atlasPosition(faceColumn, faceRow)
  const backPosition = atlasPosition(BACK_COLUMN, RED_BACK_ROW)
  const cornerClass = size === "xs" ? "rounded-[3px]" : "rounded-[10px]"

  const pointerStyle = {
    ["--x" as string]: "0",
    ["--y" as string]: "0",
    ["--angle" as string]: "0.25turn",
    ["--r" as string]: "0.5",
  } as CSSProperties

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (shouldSkipPointerEffect()) return
    updateCardPointerVars(event.currentTarget, event)
  }

  const handlePointerEnter = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (shouldSkipPointerEffect()) return
    event.currentTarget.dataset.state = "inside"
    updateCardPointerVars(event.currentTarget, event)
  }

  const handlePointerLeave = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (shouldSkipPointerEffect()) return
    event.currentTarget.dataset.state = "outside"
    setCardCssVar(event.currentTarget, "--x", "0")
    setCardCssVar(event.currentTarget, "--y", "0")
    setCardCssVar(event.currentTarget, "--angle", "0.25turn")
    setCardCssVar(event.currentTarget, "--r", "0")
  }

  return (
    <motion.div
      key={faceKey}
      initial={{ rotateY: rotation === 0 ? 180 : 0, opacity: 0.8 }}
      animate={{ rotateY: rotation, opacity: 1 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      style={{ perspective: 800, transformStyle: "preserve-3d" }}
      className="relative shrink-0 pointer-events-auto"
      aria-label={label}
    >
      <div
        className={`balatro-card-pog relative ${sizeClasses[size]} ${cornerClass} shadow-lg shadow-black/50`}
        style={{ ...pointerStyle, transformStyle: "preserve-3d" }}
        data-state="outside"
        onPointerMove={handlePointerMove}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
      >
        <div data-card-element="background" className={`absolute inset-0 ${cornerClass}`} />
        <div data-card-element="rainbow" className={`absolute inset-0 ${cornerClass}`} />
        <div data-card-element="shine" className={`absolute inset-0 ${cornerClass}`} />
        <div data-card-element="frontback" className="absolute inset-0" style={{ transformStyle: "preserve-3d" }}>
          <div
            className={`absolute inset-0 ${cornerClass} border border-black/40`}
            style={{
              ...cardSpriteBaseStyle,
              backgroundPosition: frontPosition,
              backfaceVisibility: "hidden",
            }}
          />
          <div
            className={`absolute inset-0 ${cornerClass} border border-black/40`}
            style={{
              ...cardSpriteBaseStyle,
              backgroundPosition: backPosition,
              transform: "rotateY(180deg)",
              backfaceVisibility: "hidden",
            }}
          />
        </div>
      </div>
    </motion.div>
  )
}
