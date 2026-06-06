'use client'

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { useLoader } from '../providers/loader-context'

export function ScrollIndicator() {
  const dotRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const lineRef = useRef<HTMLDivElement>(null)
  const { isLoaded } = useLoader()

  useGSAP(
    () => {
      if (!isLoaded) return

      gsap.fromTo(
        containerRef.current,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.8, delay: 1.0, ease: 'power2.out' }
      )

      gsap.to(dotRef.current, {
        y: 10,
        duration: 1.0,
        ease: 'power1.inOut',
        repeat: -1,
        yoyo: true,
      })

      gsap.fromTo(
        lineRef.current,
        { scaleY: 0 },
        { scaleY: 1, duration: 0.6, delay: 1.2, ease: 'power2.out' }
      )
    },
    { dependencies: [isLoaded], scope: containerRef }
  )

  return (
    <div
      ref={containerRef}
      className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-3"
      style={{ opacity: 0 }}
    >
      <span className="text-[9px] uppercase tracking-[0.25em] text-cream-dim/60 font-body">
        Scroll
      </span>
      <div
        ref={lineRef}
        className="w-[1px] h-[50px] bg-cream/15 origin-top"
        style={{ transform: 'scaleY(0)' }}
      />
      <div
        ref={dotRef}
        className="w-[6px] h-[6px] rounded-full bg-cream/60 will-change-transform"
      />
    </div>
  )
}
