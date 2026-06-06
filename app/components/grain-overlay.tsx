'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useRef } from 'react'

const GRAIN_OPACITY_DEFAULT = 0.05
const GRAIN_OPACITY_CONTACT = 0.035

export function GrainOverlay() {
  const pathname = usePathname()
  const ref = useRef<HTMLDivElement>(null)
  const opacity =
    pathname === '/contact' ? GRAIN_OPACITY_CONTACT : GRAIN_OPACITY_DEFAULT

  useEffect(() => {
    const el = ref.current
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
  }, [])

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-30"
      style={{
        backgroundImage: 'url(/textures/film-grain.png)',
        backgroundRepeat: 'repeat',
        backgroundSize: 'auto',
        opacity,
        mixBlendMode: 'normal',
        willChange: 'background-position',
      }}
    />
  )
}
