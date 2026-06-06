'use client'

import { useEffect, useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { useLoader } from '../providers/loader-context'

export function PageLoader() {
  const containerRef = useRef<HTMLDivElement>(null)
  const logoRef = useRef<HTMLImageElement>(null)
  const lineRef = useRef<HTMLSpanElement>(null)
  const counterRef = useRef<HTMLSpanElement>(null)
  const { isLoaded, setIsLoaded, setIsScrollLocked } = useLoader()

  useEffect(() => {
    if (isLoaded) return
    setIsScrollLocked(true)
    return () => setIsScrollLocked(false)
  }, [isLoaded, setIsScrollLocked])

  useGSAP(
    () => {
      if (isLoaded) return

      gsap.set(logoRef.current, { opacity: 0, scale: 0.94, y: 12, filter: 'blur(6px)' })
      gsap.set('[data-letter]', { yPercent: 115 })
      gsap.set(lineRef.current, { scaleX: 0 })
      gsap.set(counterRef.current, { opacity: 0 })

      const tl = gsap.timeline({
        onComplete: () => {
          setIsScrollLocked(false)
          setIsLoaded(true)
        },
      })

      tl.to(logoRef.current, {
        opacity: 1,
        scale: 1,
        y: 0,
        filter: 'blur(0px)',
        duration: 0.9,
        ease: 'power3.out',
      })
      tl.to(
        '[data-letter]',
        { yPercent: 0, stagger: 0.06, duration: 0.7, ease: 'power3.out' },
        0.35
      )
      tl.to(counterRef.current, { opacity: 1, duration: 0.3 }, 0.6)

      const c = { v: 0 }
      tl.to(
        c,
        {
          v: 100,
          duration: 1.4,
          ease: 'power1.inOut',
          onUpdate: () => {
            if (counterRef.current)
              counterRef.current.textContent = String(Math.round(c.v)).padStart(3, '0')
          },
        },
        0.6
      )
      tl.to(lineRef.current, { scaleX: 1, duration: 1.4, ease: 'power1.inOut' }, 0.6)

      tl.to({}, { duration: 0.35 })
      tl.to(
        [logoRef.current, '[data-letter]', counterRef.current, lineRef.current],
        { opacity: 0, duration: 0.4, ease: 'power2.in' }
      )
      tl.to(
        containerRef.current,
        { clipPath: 'inset(0% 0% 100% 0%)', duration: 0.9, ease: 'power4.inOut' },
        '<0.12'
      )
    },
    { scope: containerRef, dependencies: [isLoaded] }
  )

  if (isLoaded) return null

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden bg-[#0b0b0b] font-[family-name:var(--font-geist)]"
      style={{ clipPath: 'inset(0% 0% 0% 0%)' }}
    >
      <div className="flex flex-col items-center gap-6">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          ref={logoRef}
          alt="ARRVL"
          src="/logos/arrvl_logo.png"
          className="h-24 w-auto will-change-[transform,opacity,filter]"
          style={{ opacity: 0 }}
        />
        <div className="flex" aria-label="ARRVL">
          {'ARRVL'.split('').map((ch, i) => (
            <span key={i} className="inline-block overflow-hidden" style={{ lineHeight: 1 }}>
              <span
                data-letter
                className="inline-block font-semibold uppercase text-white will-change-transform"
                style={{ fontSize: 'clamp(40px, 7vw, 78px)', letterSpacing: '-0.04em' }}
              >
                {ch}
              </span>
            </span>
          ))}
        </div>
      </div>

      <div className="absolute bottom-14 left-1/2 flex -translate-x-1/2 flex-col items-center gap-3">
        <span className="relative block h-px w-[200px] overflow-hidden bg-white/12">
          <span
            ref={lineRef}
            className="absolute inset-0 origin-left bg-white"
            style={{ transform: 'scaleX(0)' }}
          />
        </span>
        <span
          ref={counterRef}
          className="text-[11px] font-medium uppercase tabular-nums tracking-[0.3em] text-white/45"
          style={{ opacity: 0 }}
        >
          000
        </span>
      </div>
    </div>
  )
}
