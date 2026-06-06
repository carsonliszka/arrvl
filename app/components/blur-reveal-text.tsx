'use client'

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'

interface BlurRevealTextProps {
  words: string[]
  trigger: boolean
  delay?: number
  className?: string
  stagger?: number
}

export function BlurRevealText({
  words,
  trigger,
  delay = 0,
  className = '',
  stagger = 0.06,
}: BlurRevealTextProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    if (!trigger) return
    const wordEls = containerRef.current?.querySelectorAll('[data-word]')
    if (!wordEls?.length) return

    gsap.fromTo(
      wordEls,
      {
        filter: 'blur(10px)',
        opacity: 0,
        y: 20,
      },
      {
        filter: 'blur(0px)',
        opacity: 1,
        y: 0,
        stagger,
        duration: 0.7,
        delay,
        ease: 'power3.out',
      }
    )
  }, { dependencies: [trigger], scope: containerRef })

  return (
    <div
      ref={containerRef}
      className={`relative block ${className}`}
      aria-hidden="true"
    >
      {words.map((word, i) => (
        <div
          key={i}
          data-word
          className="relative inline-block will-change-[filter,opacity,transform]"
          style={{ filter: 'blur(10px)', opacity: 0 }}
        >
          {word}
          {i < words.length - 1 && ' '}
        </div>
      ))}
    </div>
  )
}
