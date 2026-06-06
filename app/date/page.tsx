"use client"

import { useCallback, useRef, useState } from "react"

const INITIAL_GIF = "https://media.giphy.com/media/FTGah7Mx3ss04PcasF/giphy.gif"
const ACCEPTED_GIF = "https://media.giphy.com/media/UMon0fuimoAN9ueUNP/giphy.gif"

type ButtonPosition = {
  left: number
  top: number
}

function getRandomPosition(width: number, height: number): ButtonPosition {
  const padding = 18
  const maxLeft = Math.max(padding, window.innerWidth - width - padding)
  const maxTop = Math.max(padding, window.innerHeight - height - padding)

  return {
    left: Math.round(padding + Math.random() * Math.max(0, maxLeft - padding)),
    top: Math.round(padding + Math.random() * Math.max(0, maxTop - padding)),
  }
}

export default function DatePage() {
  const noButtonRef = useRef<HTMLButtonElement | null>(null)
  const [accepted, setAccepted] = useState(false)
  const [noPosition, setNoPosition] = useState<ButtonPosition | null>(null)

  const moveNoButton = useCallback(() => {
    if (accepted) return

    const rect = noButtonRef.current?.getBoundingClientRect()
    const width = rect?.width ?? 144
    const height = rect?.height ?? 56

    setNoPosition((previous) => {
      let next = getRandomPosition(width, height)

      if (
        previous &&
        Math.abs(previous.left - next.left) < 96 &&
        Math.abs(previous.top - next.top) < 72
      ) {
        next = getRandomPosition(width, height)
      }

      return next
    })
  }, [accepted])

  const acceptInvite = () => {
    setAccepted(true)
    setNoPosition(null)
  }

  return (
    <main
      className="relative isolate flex min-h-dvh overflow-hidden bg-[#fff7f2] text-[#24191f]"
      style={{ fontFamily: "var(--font-figtree)" }}
    >
      <div className="absolute inset-x-0 top-0 h-2 bg-[linear-gradient(90deg,#e94d58,#f4b84f,#59b99a,#5276c9)]" />
      <div className="absolute inset-x-0 bottom-0 h-2 bg-[linear-gradient(90deg,#5276c9,#59b99a,#f4b84f,#e94d58)]" />

      <div className="mx-auto flex min-h-dvh w-full max-w-5xl flex-col items-center justify-center gap-7 px-5 py-10 text-center sm:gap-8">
        <div className="relative aspect-[4/3] w-[min(82vw,360px)] overflow-hidden rounded-[8px] border-2 border-[#24191f]/10 bg-white shadow-[0_18px_60px_rgba(36,25,31,0.16)]">
          <img
            src={accepted ? ACCEPTED_GIF : INITIAL_GIF}
            alt={accepted ? "Animated celebration" : "Animated invitation"}
            className="h-full w-full object-cover"
          />
        </div>

        <section className="flex w-full max-w-xl flex-col items-center gap-6">
          <h1
            className="text-balance font-[var(--font-instrument-serif)] text-4xl leading-tight text-[#d93148] sm:text-6xl"
            aria-live="polite"
          >
            {accepted ? "Yeahhhhhhhhhhh! See you soon!!" : "Maria, will you go out with me?"}
          </h1>

          <div className="relative flex min-h-20 w-full items-center justify-center gap-4 sm:gap-6">
            {!accepted ? (
              <>
                <button
                  type="button"
                  onClick={acceptInvite}
                  className="h-14 w-36 rounded-full border-2 border-[#d93148] bg-[#d93148] px-6 text-lg font-bold text-white shadow-[0_8px_0_rgba(114,28,42,0.18)] transition hover:-translate-y-0.5 hover:bg-[#c72b40] focus:outline-none focus-visible:ring-4 focus-visible:ring-[#f4b84f]/60 active:translate-y-1 active:shadow-none"
                >
                  Yes
                </button>

                <button
                  ref={noButtonRef}
                  type="button"
                  onClick={(event) => {
                    event.preventDefault()
                    moveNoButton()
                  }}
                  onFocus={moveNoButton}
                  onMouseEnter={moveNoButton}
                  onTouchStart={(event) => {
                    event.preventDefault()
                    moveNoButton()
                  }}
                  className="h-14 w-36 rounded-full border-2 border-[#d93148] bg-white px-6 text-lg font-bold text-[#d93148] shadow-[0_8px_0_rgba(114,28,42,0.12)] transition hover:-translate-y-0.5 focus:outline-none focus-visible:ring-4 focus-visible:ring-[#59b99a]/50 active:translate-y-1 active:shadow-none"
                  style={
                    noPosition
                      ? {
                          position: "fixed",
                          left: noPosition.left,
                          top: noPosition.top,
                          zIndex: 20,
                        }
                      : undefined
                  }
                >
                  No
                </button>
              </>
            ) : null}
          </div>
        </section>
      </div>
    </main>
  )
}
