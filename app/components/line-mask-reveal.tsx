'use client'

import { useRef, type ReactNode } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'

interface LineMaskRevealProps {
  children: ReactNode
  trigger: boolean
  delay?: number
  className?: string
}

export function LineMaskReveal({
  children,
  trigger,
  delay = 0,
  className = '',
}: LineMaskRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const innerRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    if (!trigger) return
    gsap.fromTo(
      innerRef.current,
      { y: '105%', opacity: 0 },
      { y: '0%', opacity: 1, duration: 0.8, delay, ease: 'power3.out' }
    )
  }, { dependencies: [trigger], scope: containerRef })

  return (
    <div
      ref={containerRef}
      className={`relative block overflow-clip ${className}`}
    >
      <div
        ref={innerRef}
        className="relative block"
        style={{ transform: 'translateY(105%)' }}
      >
        {children}
      </div>
    </div>
  )
}
