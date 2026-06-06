'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useLoader } from './loader-context'

export function LenisProvider({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null)
  const { isScrollLocked } = useLoader()
  const pathname = usePathname()

  useEffect(() => {
    if (typeof window !== 'undefined' && 'scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual'
    }
    window.scrollTo(0, 0)

    const lenis = new Lenis({
      lerp: 0.1,
      smoothWheel: true,
    })
    lenisRef.current = lenis
    lenis.scrollTo(0, { immediate: true })

    lenis.on('scroll', ScrollTrigger.update)

    const tickerCallback = (time: number) => {
      lenis.raf(time * 1000)
    }
    gsap.ticker.add(tickerCallback)
    gsap.ticker.lagSmoothing(0)

    const onPageShow = (e: PageTransitionEvent) => {
      if (e.persisted) {
        window.scrollTo(0, 0)
        lenis.scrollTo(0, { immediate: true })
      }
    }
    window.addEventListener('pageshow', onPageShow)

    return () => {
      window.removeEventListener('pageshow', onPageShow)
      gsap.ticker.remove(tickerCallback)
      lenis.destroy()
      lenisRef.current = null
    }
  }, [pathname])

  useEffect(() => {
    const lenis = lenisRef.current
    if (!lenis) return

    if (isScrollLocked) {
      lenis.stop()
      lenis.scrollTo(0, { immediate: true })
      document.documentElement.classList.add('scroll-locked')
      document.body.classList.add('scroll-locked')
    } else {
      lenis.start()
      document.documentElement.classList.remove('scroll-locked')
      document.body.classList.remove('scroll-locked')
    }
  }, [isScrollLocked])

  return <>{children}</>
}
