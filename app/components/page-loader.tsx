'use client'

import { useEffect, useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { useLoader } from '../providers/loader-context'

const TARGETS = ['A', 'R', 'R', 'V', 'L']
const CHARSET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%/'

export function PageLoader() {
  const containerRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const markGroupRef = useRef<HTMLDivElement>(null)
  const logoRef = useRef<HTMLImageElement>(null)
  const ringRef = useRef<HTMLSpanElement>(null)
  const metaRef = useRef<HTMLDivElement>(null)
  const lineRef = useRef<HTMLSpanElement>(null)
  const doorTopRef = useRef<HTMLDivElement>(null)
  const doorBottomRef = useRef<HTMLDivElement>(null)
  const { isLoaded, setIsLoaded, setIsScrollLocked } = useLoader()

  useEffect(() => {
    if (isLoaded) return
    setIsScrollLocked(true)
    return () => setIsScrollLocked(false)
  }, [isLoaded, setIsScrollLocked])

  useGSAP(
    () => {
      if (isLoaded) return

      const cells = gsap.utils.toArray<HTMLElement>('[data-cell]')
      const finish = () => {
        setIsScrollLocked(false)
        setIsLoaded(true)
      }
      const mm = gsap.matchMedia()

      mm.add('(prefers-reduced-motion: reduce)', () => {
        cells.forEach((c, i) => (c.textContent = TARGETS[i]))
        gsap.set(cells, { opacity: 1 })
        gsap.set(logoRef.current, { opacity: 1, y: 0, filter: 'blur(0px)' })
        gsap.set(metaRef.current, { opacity: 1, y: 0 })
        gsap.set(lineRef.current, { scaleX: 1 })

        const tl = gsap.timeline({ onComplete: finish })
        tl.to({}, { duration: 0.7 })
        tl.to(contentRef.current, { opacity: 0, duration: 0.35 })
        tl.to(doorTopRef.current, { yPercent: -100, duration: 0.6, ease: 'power3.inOut' }, '<0.1')
        tl.to(doorBottomRef.current, { yPercent: 100, duration: 0.6, ease: 'power3.inOut' }, '<')
      })

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.set(logoRef.current, { opacity: 0, y: 14, filter: 'blur(6px)' })
        gsap.set(cells, { opacity: 0 })
        gsap.set(metaRef.current, { opacity: 0, y: 8 })
        gsap.set(lineRef.current, { scaleX: 0 })
        gsap.set(ringRef.current, { opacity: 0, width: 24, height: 24 })
        gsap.set([doorTopRef.current, doorBottomRef.current], { yPercent: 0 })

        const tl = gsap.timeline({ onComplete: finish })

        tl.to(logoRef.current, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.7, ease: 'power3.out' }, 0)

        let lastLock = 0
        cells.forEach((cell, i) => {
          const start = 0.3 + i * 0.1
          const dur = 0.6 + i * 0.05
          const proxy = { t: 0 }
          tl.set(cell, { opacity: 1 }, start)
          tl.to(
            proxy,
            {
              t: 1,
              duration: dur,
              ease: 'none',
              onUpdate: () => {
                if (proxy.t < 1) cell.textContent = CHARSET[(Math.random() * CHARSET.length) | 0]
              },
              onComplete: () => (cell.textContent = TARGETS[i]),
            },
            start
          )
          tl.fromTo(
            cell,
            { scale: 1.18, filter: 'blur(4px)' },
            { scale: 1, filter: 'blur(0px)', duration: 0.34, ease: 'back.out(2.2)' },
            start + dur
          )
          lastLock = start + dur
        })

        tl.to(metaRef.current, { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out' }, lastLock + 0.05)

        const T = lastLock + 0.32
        tl.to(markGroupRef.current, { y: 9, duration: 0.12, ease: 'power2.in' }, T)
        tl.to(markGroupRef.current, { y: 0, duration: 0.55, ease: 'elastic.out(1,0.55)' }, T + 0.12)
        tl.fromTo(
          ringRef.current,
          { width: 24, height: 24, opacity: 0.55 },
          { width: 680, height: 680, opacity: 0, duration: 0.9, ease: 'power3.out' },
          T + 0.1
        )
        tl.fromTo(lineRef.current, { scaleX: 0 }, { scaleX: 1, duration: 0.4, ease: 'power3.out' }, T + 0.08)

        const D = T + 0.92
        tl.to(contentRef.current, { opacity: 0, duration: 0.4, ease: 'power2.in' }, D)
        tl.to(doorTopRef.current, { yPercent: -100, duration: 0.9, ease: 'power4.inOut' }, D + 0.12)
        tl.to(doorBottomRef.current, { yPercent: 100, duration: 0.9, ease: 'power4.inOut' }, '<')
      })

      return () => mm.revert()
    },
    { scope: containerRef, dependencies: [isLoaded] }
  )

  if (isLoaded) return null

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[100] overflow-hidden font-[family-name:var(--font-geist)]"
    >
      <div ref={doorTopRef} className="absolute inset-x-0 top-0 h-[51%] bg-[#0b0b0b] will-change-transform" />
      <div ref={doorBottomRef} className="absolute inset-x-0 bottom-0 h-[51%] bg-[#0b0b0b] will-change-transform" />

      <div ref={contentRef} className="absolute inset-0 z-10 flex flex-col items-center justify-center">
        <div ref={markGroupRef} className="relative flex flex-col items-center gap-6 will-change-transform">
          <span
            ref={ringRef}
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 border border-white/50"
            style={{ opacity: 0, width: 24, height: 24, borderRadius: '9999px' }}
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            ref={logoRef}
            alt="ARRVL"
            src="/logos/arrvl_logo.png"
            className="h-20 w-auto will-change-[transform,opacity,filter]"
            style={{ opacity: 0 }}
          />
          <div className="flex gap-[0.06em]" aria-label="ARRVL">
            {TARGETS.map((ch, i) => (
              <span
                key={i}
                data-cell
                className="inline-flex h-[1em] w-[0.74em] items-center justify-center font-semibold uppercase leading-none text-white will-change-transform"
                style={{ fontSize: 'clamp(40px, 7vw, 78px)', letterSpacing: '-0.02em', opacity: 0 }}
              >
                {ch}
              </span>
            ))}
          </div>
        </div>

        <div
          ref={metaRef}
          className="mt-7 text-[10px] font-medium uppercase tracking-[0.34em] text-white/45"
          style={{ opacity: 0 }}
        >
          Imagine. Create. <span className="text-white/75">Arrive.</span>
        </div>

        <span className="absolute bottom-14 left-1/2 block h-px w-[220px] -translate-x-1/2 overflow-hidden bg-white/10">
          <span
            ref={lineRef}
            className="absolute inset-0 origin-center bg-white/70"
            style={{ transform: 'scaleX(0)' }}
          />
        </span>
      </div>
    </div>
  )
}
