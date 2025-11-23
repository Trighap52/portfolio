import { motion } from "framer-motion"
import type { CardInfo } from "@/lib/cards"

interface PlayingCardProps {
  card?: CardInfo
  size?: "sm" | "md" | "lg"
  flipKey?: string
  label?: string
}

const suitColors: Record<CardInfo["suit"], string> = {
  H: "text-red-400",
  D: "text-red-400",
  S: "text-black",
  C: "text-black",
}

const suitSymbols: Record<CardInfo["suit"], string> = {
  H: "♥",
  D: "♦",
  S: "♠",
  C: "♣",
}

const sizeClasses: Record<NonNullable<PlayingCardProps["size"]>, string> = {
  sm: "w-16 h-24 md:w-20 md:h-28",
  md: "w-20 h-28 md:w-24 md:h-32",
  lg: "w-24 h-32 md:w-28 md:h-40",
}

export function PlayingCard({ card, size = "md", flipKey, label }: PlayingCardProps) {
  const faceKey = flipKey ?? card?.id ?? "card-face"
  const suitColor = card ? suitColors[card.suit] : "text-white/60"
  const suitIcon = card ? suitSymbols[card.suit] : "♣"

  return (
    <motion.div
      key={faceKey}
      initial={{ rotateY: 180, opacity: 0.6 }}
      animate={{ rotateY: 0, opacity: 1 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      style={{ perspective: 800 }}
      className="relative"
      aria-label={label}
    >
      <div
        className={`relative ${sizeClasses[size]} rounded-xl border border-white/30 bg-white/10 backdrop-blur-sm overflow-hidden shadow-lg shadow-black/30`}
        style={{ transformStyle: "preserve-3d" }}
      >
        <div
          className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/5"
          style={{ backfaceVisibility: "hidden" }}
        />
        <div className="relative flex h-full flex-col justify-between p-2 text-white" style={{ backfaceVisibility: "hidden" }}>
          <div className="flex items-center justify-between text-[11px] md:text-xs font-semibold">
            <span>{card?.rank ?? "?"}</span>
            <span className={`font-bold ${suitColor}`}>{suitIcon}</span>
          </div>
          <div className="text-center text-2xl md:text-3xl font-black tracking-tight drop-shadow-sm">
            {card?.rank ?? "?"}
          </div>
          <div className="flex items-center justify-between text-[11px] md:text-xs font-semibold opacity-80">
            <span className={`font-bold ${suitColor}`}>{suitIcon}</span>
            <span>{card ? `${card.value} pts` : "Drawn soon"}</span>
          </div>
        </div>
        <div
          className="absolute inset-0 rounded-xl bg-white/10 border border-white/20"
          style={{ transform: "rotateY(180deg)", backfaceVisibility: "hidden" }}
        />
      </div>
    </motion.div>
  )
}
