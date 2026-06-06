'use client'

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { useLoader } from '../providers/loader-context'

const WORDS = ['AGENCY', 'STUDIO', 'COLLECTIVE']
const HOLD = 1.6
const FIRST_HOLD = 0.9
const FADE = 0.95

export function RotatingWord({ className = '' }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const { isLoaded } = useLoader()

  useGSAP(
    () => {
      if (!isLoaded) return

      const wordEls =
        containerRef.current?.querySelectorAll<HTMLSpanElement>(
          '[data-rotating-word]'
        )
      if (!wordEls?.length) return

      gsap.set(wordEls[0], { filter: 'blur(0px)', opacity: 1 })
      for (let i = 1; i < wordEls.length; i++) {
        gsap.set(wordEls[i], { filter: 'blur(10px)', opacity: 0 })
      }

      const tl = gsap.timeline({ repeat: -1, delay: 0.4 })

      WORDS.forEach((_, i) => {
        const current = wordEls[i]
        const next = wordEls[(i + 1) % WORDS.length]

        tl.to({}, { duration: i === 0 ? FIRST_HOLD : HOLD })

        tl.to(current, {
          filter: 'blur(10px)',
          opacity: 0,
          duration: FADE,
          ease: 'sine.inOut',
        })
        tl.to(
          next,
          {
            filter: 'blur(0px)',
            opacity: 1,
            duration: FADE,
            ease: 'sine.inOut',
          },
          '<'
        )
      })
    },
    { dependencies: [isLoaded], scope: containerRef }
  )

  return (
    <div ref={containerRef} className={`relative block ${className}`}>
      <span className="invisible block" aria-hidden="true">
        COLLECTIVE
      </span>
      {WORDS.map((word) => (
        <span
          key={word}
          data-rotating-word
          className="absolute top-0 left-0 will-change-[filter,opacity]"
          style={{ filter: 'blur(10px)', opacity: 0 }}
        >
          {word}
        </span>
      ))}
    </div>
  )
}
