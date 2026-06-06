'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  type ReactNode,
} from 'react'
import { useRouter } from 'next/navigation'
import gsap from 'gsap'

interface TransitionContextValue {
  navigate: (href: string) => void
}

const TransitionContext = createContext<TransitionContextValue>({
  navigate: () => {},
})

export function TransitionProvider({ children }: { children: ReactNode }) {
  const router = useRouter()
  const curtainRef = useRef<HTMLDivElement>(null)
  const logoRef = useRef<HTMLImageElement>(null)
  const isAnimatingRef = useRef(false)

  useEffect(() => {
    if (curtainRef.current) {
      gsap.set(curtainRef.current, { yPercent: 100, autoAlpha: 0 })
    }
  }, [])

  const navigate = useCallback(
    (href: string) => {
      if (isAnimatingRef.current) return
      const curtain = curtainRef.current
      const logo = logoRef.current
      if (!curtain || !logo) {
        router.push(href)
        return
      }

      isAnimatingRef.current = true
      const tl = gsap.timeline({
        onComplete: () => {
          isAnimatingRef.current = false
        },
      })

      tl.set(curtain, { yPercent: 100, autoAlpha: 1 })
      tl.set(logo, { opacity: 0, scale: 0.92, filter: 'blur(8px)' })

      tl.to(curtain, {
        yPercent: 0,
        duration: 0.85,
        ease: 'power4.inOut',
      })

      tl.to(
        logo,
        {
          opacity: 1,
          scale: 1,
          filter: 'blur(0px)',
          duration: 0.55,
          ease: 'power2.out',
        },
        '-=0.4'
      )

      tl.call(() => {
        router.push(href)
        window.scrollTo(0, 0)
      })

      tl.to({}, { duration: 0.35 })

      tl.to(
        logo,
        {
          opacity: 0,
          scale: 1.08,
          filter: 'blur(6px)',
          duration: 0.4,
          ease: 'power2.in',
        }
      )
      tl.to(
        curtain,
        {
          yPercent: -100,
          duration: 0.85,
          ease: 'power4.inOut',
        },
        '-=0.2'
      )

      tl.set(curtain, { yPercent: 100, autoAlpha: 0 })
    },
    [router]
  )

  return (
    <TransitionContext.Provider value={{ navigate }}>
      {children}

      <div
        ref={curtainRef}
        className="fixed inset-0 z-[200] flex items-center justify-center pointer-events-none bg-[#0b0b0b]"
        style={{
          visibility: 'hidden',
          opacity: 0,
        }}
        aria-hidden="true"
      >
        <div className="relative flex flex-col items-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            ref={logoRef}
            alt="ARRVL"
            src="/logos/arrvl_logo.png"
            className="h-[120px] w-auto will-change-[transform,opacity,filter]"
          />
        </div>
      </div>
    </TransitionContext.Provider>
  )
}

export function useTransitionNavigate() {
  return useContext(TransitionContext).navigate
}
