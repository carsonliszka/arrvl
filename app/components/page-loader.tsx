'use client'

import { useEffect, useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { useLoader } from '../providers/loader-context'
import { GradientWave } from './gradient-wave'

const TICK_COUNT = 14
const DIM_OPACITY = 0.16
const GRAIN_OPACITY = 0.05

export function PageLoader() {
  const containerRef = useRef<HTMLDivElement>(null)
  const rowRef = useRef<HTMLDivElement>(null)
  const grainRef = useRef<HTMLDivElement>(null)
  const { isLoaded, setIsLoaded, setIsScrollLocked } = useLoader()

  useEffect(() => {
    if (isLoaded) return
    setIsScrollLocked(true)
    return () => setIsScrollLocked(false)
  }, [isLoaded, setIsScrollLocked])

  // Film grain over the loader, mirroring the global GrainOverlay (12fps position jitter).
  // The global overlay sits at z-30, below this z-[100] loader, so the loader needs its own.
  useEffect(() => {
    if (isLoaded) return
    const el = grainRef.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let raf = 0
    let last = 0
    const frameMs = 1000 / 12
    const tick = (t: number) => {
      if (t - last >= frameMs) {
        last = t
        const x = (Math.random() * 256) | 0
        const y = (Math.random() * 256) | 0
        el.style.backgroundPosition = `${x}px ${y}px`
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [isLoaded])

  useGSAP(
    () => {
      if (isLoaded) return

      const ticks = gsap.utils.toArray<HTMLElement>('[data-tick]')
      const finish = () => {
        setIsScrollLocked(false)
        setIsLoaded(true)
      }
      const mm = gsap.matchMedia()

      mm.add('(prefers-reduced-motion: reduce)', () => {
        gsap.set(ticks, { opacity: 1, scaleY: 1 })
        gsap.set(rowRef.current, { opacity: 1 })

        const tl = gsap.timeline({ onComplete: finish })
        tl.to({}, { duration: 0.6 })
        tl.to(containerRef.current, { opacity: 0, duration: 0.4 })
      })

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.set(ticks, { opacity: DIM_OPACITY, scaleY: 0.7, transformOrigin: 'center' })
        gsap.set(rowRef.current, { opacity: 0 })

        const tl = gsap.timeline({ onComplete: finish })

        // Soft entrance so the row doesn't hard-pop on first paint.
        tl.to(rowRef.current, { opacity: 1, duration: 0.3, ease: 'power2.out' }, 0)

        // Fill left to right: each tick lights to full and stays lit, reading as progress.
        tl.to(
          ticks,
          { opacity: 1, scaleY: 1, duration: 0.28, ease: 'power2.out', stagger: 0.075 },
          0.15
        )

        // Hold at full, then fade the whole loader out to reveal the page.
        const full = 0.15 + 0.075 * (TICK_COUNT - 1) + 0.28
        tl.to(containerRef.current, { opacity: 0, duration: 0.55, ease: 'power2.inOut' }, full + 0.3)
      })

      return () => mm.revert()
    },
    { scope: containerRef, dependencies: [isLoaded] }
  )

  if (isLoaded) return null

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-[#0b0b0b]"
    >
      {/* same hero gradient as the page background */}
      <div className="absolute inset-0">
        <GradientWave className="h-full w-full" />
      </div>
      <div className="pointer-events-none absolute inset-0 bg-black/25" />
      <div
        ref={grainRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: 'url(/textures/film-grain.png)',
          backgroundRepeat: 'repeat',
          backgroundSize: 'auto',
          opacity: GRAIN_OPACITY,
          willChange: 'background-position',
        }}
      />

      <div ref={rowRef} className="relative z-10 flex items-center gap-[24px]" aria-label="Loading">
        {Array.from({ length: TICK_COUNT }).map((_, i) => (
          <span
            key={i}
            data-tick
            aria-hidden="true"
            className="block h-[52px] w-[2px] bg-white will-change-[transform,opacity]"
          />
        ))}
      </div>
    </div>
  )
}
