"use client"

import { useState, useEffect } from 'react'

/**
 * Hero Typing Animation - Layer 4
 *
 * Per WDI_REDESIGN_SPECIFICATION.md:
 * - Terminal-style monospace font
 * - Green cursor blink
 * - Types out key phrases
 * - Loops through 3-4 phrases
 * - Position: Top-right or bottom-left corner
 * - Font: JetBrains Mono, 14-16px
 * - Color: accent-green (terminal green)
 * - Typing Speed: 50-80ms per character
 * - Pause Between: 3-4 seconds
 */

const PHRASES = [
  "npm install @wdi/future",
  "Building accessible web...",
  "const mission = 'empower';",
  "// Professional. Affordable. Real.",
]

const TYPING_SPEED = 60 // ms per character
const PAUSE_DURATION = 3000 // 3 seconds between phrases
const DELETE_SPEED = 30 // faster deletion

export default function HeroTyping() {
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0)
  const [currentText, setCurrentText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [showCursor, setShowCursor] = useState(true)

  // Cursor blink effect
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev)
    }, 530)

    return () => clearInterval(cursorInterval)
  }, [])

  // Typing effect
  useEffect(() => {
    const currentPhrase = PHRASES[currentPhraseIndex]

    if (isPaused) {
      const pauseTimeout = setTimeout(() => {
        setIsPaused(false)
        setIsDeleting(true)
      }, PAUSE_DURATION)

      return () => clearTimeout(pauseTimeout)
    }

    if (!isDeleting && currentText === currentPhrase) {
      // Finished typing, pause before deleting
      setIsPaused(true)
      return
    }

    if (isDeleting && currentText === '') {
      // Finished deleting, move to next phrase
      setIsDeleting(false)
      setCurrentPhraseIndex((prev) => (prev + 1) % PHRASES.length)
      return
    }

    const timeout = setTimeout(
      () => {
        if (!isDeleting) {
          // Typing
          setCurrentText(currentPhrase.substring(0, currentText.length + 1))
        } else {
          // Deleting
          setCurrentText(currentPhrase.substring(0, currentText.length - 1))
        }
      },
      isDeleting ? DELETE_SPEED : TYPING_SPEED
    )

    return () => clearTimeout(timeout)
  }, [currentText, isDeleting, isPaused, currentPhraseIndex])

  return (
    <>
      {/* Top-right corner variant (desktop) */}
      <div className="absolute top-8 right-8 z-[5] hidden lg:block pointer-events-none">
        <div className="bg-gray-900/80 backdrop-blur-sm border border-gray-800 rounded-lg p-4 shadow-xl">
          <div className="font-mono text-sm md:text-base text-accent-green flex items-center gap-1">
            <span className="text-gray-500">$</span>
            <span>{currentText}</span>
            <span
              className={`inline-block w-2 h-5 bg-accent-green ml-0.5 ${
                showCursor ? 'opacity-100' : 'opacity-0'
              }`}
            />
          </div>
        </div>
      </div>

      {/* Bottom-left corner variant (mobile/tablet fallback) */}
      <div className="absolute bottom-24 left-8 z-[5] block lg:hidden pointer-events-none">
        <div className="bg-gray-900/80 backdrop-blur-sm border border-gray-800 rounded-lg p-3 shadow-xl">
          <div className="font-mono text-xs sm:text-sm text-accent-green flex items-center gap-1">
            <span className="text-gray-500">$</span>
            <span>{currentText}</span>
            <span
              className={`inline-block w-1.5 h-4 bg-accent-green ml-0.5 ${
                showCursor ? 'opacity-100' : 'opacity-0'
              }`}
            />
          </div>
        </div>
      </div>
    </>
  )
}
