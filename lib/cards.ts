export type Suit = "S" | "H" | "D" | "C"
export type CardInfo = {
  id: string
  rank: string
  suit: Suit
  value: number
}

const RANKS: readonly string[] = ["A", "K", "Q", "J", "10", "9", "8", "7", "6", "5", "4", "3", "2"]
const SUITS: readonly Suit[] = ["S", "H", "D", "C"]
const RANK_VALUES: Record<string, number> = {
  A: 11,
  K: 10,
  Q: 10,
  J: 10,
  "10": 10,
  "9": 9,
  "8": 8,
  "7": 7,
  "6": 6,
  "5": 5,
  "4": 4,
  "3": 3,
  "2": 2,
}

export const buildDeck = () =>
  SUITS.flatMap((suit) =>
    RANKS.map((rank) => ({
      id: `${rank}${suit}`,
      rank,
      suit,
      value: RANK_VALUES[rank],
    }))
  )

export const shuffleDeck = (deck: CardInfo[]) => {
  const copy = [...deck]
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

export function describeHand(cards: CardInfo[]) {
  if (cards.length < 5) return "Drawing..."

  const suits = cards.map((c) => c.suit)
  const ranks = cards.map((c) => c.rank)

  const rankOrder = RANKS.reduce<Record<string, number>>((acc, r, idx) => ({ ...acc, [r]: idx + 1 }), {})
  const sortedVals = ranks.map((r) => rankOrder[r]).sort((a, b) => a - b)
  const counts: Record<string, number> = {}
  ranks.forEach((r) => {
    counts[r] = (counts[r] ?? 0) + 1
  })
  const values = Object.values(counts).sort((a, b) => b - a)

  const isFlush = suits.every((s) => s === suits[0])
  const isStraight =
    sortedVals.every((v, i, arr) => i === 0 || v === arr[i - 1] + 1) ||
    JSON.stringify(sortedVals) === JSON.stringify([1, 10, 11, 12, 13])

  const hasFour = values[0] === 4
  const hasThree = values[0] === 3
  const pairs = values.filter((v) => v === 2).length

  if (isFlush && isStraight && ranks.includes("A") && ranks.includes("K")) return "Royal Flush"
  if (isFlush && isStraight) return "Straight Flush"
  if (hasFour) return "Four of a Kind"
  if (hasThree && pairs === 1) return "Full House"
  if (isFlush) return "Flush"
  if (isStraight) return "Straight"
  if (hasThree) return "Three of a Kind"
  if (pairs === 2) return "Two Pair"
  if (pairs === 1) return "Pair"
  return "High Card"
}
