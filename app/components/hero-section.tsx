'use client'

import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useLoader } from '../providers/loader-context'
import { GradientWave } from './gradient-wave'
import { LineMaskReveal } from './line-mask-reveal'
import { TransitionLink } from './transition-link'
import { HoverText } from './hover-text'
import { CtaArrow } from './cta'
import { MenuOverlay } from './menu-overlay'

const geist = 'font-[family-name:var(--font-geist)]'

const NAV = [
  { label: 'About', href: '/about' },
  { label: 'Projects', href: '/projects' },
  { label: 'Contact', href: '/contact' },
]

function CardGuides() {
  const bullets = [
    'left-0 top-0 -translate-x-1/2 -translate-y-1/2',
    'right-0 top-0 translate-x-1/2 -translate-y-1/2',
    'left-0 bottom-0 -translate-x-1/2 translate-y-1/2',
    'right-0 bottom-0 translate-x-1/2 translate-y-1/2',
  ]
  const line = 'pointer-events-none absolute bg-cream/15'
  return (
    <>
      {/* guide lines extending from the card edges out to the viewport edges */}
      <span className={`${line} bottom-full left-1/2 h-screen w-px -translate-x-1/2`} />
      <span className={`${line} top-full left-1/2 h-screen w-px -translate-x-1/2`} />
      <span className={`${line} right-full top-1/2 h-px w-screen -translate-y-1/2`} />
      <span className={`${line} left-full top-1/2 h-px w-screen -translate-y-1/2`} />
      {/* white bullets on each corner */}
      {bullets.map((pos) => (
        <span
          key={pos}
          className={`pointer-events-none absolute h-[6px] w-[6px] rounded-full bg-cream ${pos}`}
        />
      ))}
    </>
  )
}

function LocalTime() {
  const [time, setTime] = useState<string | null>(null)
  useEffect(() => {
    const fmt = () =>
      new Intl.DateTimeFormat('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
        timeZone: 'America/Los_Angeles',
      }).format(new Date())
    setTime(fmt())
    const id = setInterval(() => setTime(fmt()), 15000)
    return () => clearInterval(id)
  }, [])
  return <span className="tabular-nums text-cream/70">{time ?? '--:--'} PT</span>
}

// Showreel as the card background. Renders a static (already color-graded) poster on
// mobile / reduced-motion with no video download; on capable screens the reel fades in
// over the poster, and only after the intro + hero reveal have settled.
function HeroShowreel({ isLoaded }: { isLoaded: boolean }) {
  const ref = useRef<HTMLVideoElement>(null)
  const [mode, setMode] = useState<'poster' | 'video'>('poster')
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const small = window.matchMedia('(max-width: 767px)').matches
    if (!reduced && !small) setMode('video')
  }, [])

  useEffect(() => {
    if (mode !== 'video' || !isLoaded) return
    const v = ref.current
    if (!v) return
    const t = setTimeout(() => {
      v.play().catch(() => {})
    }, 1100)
    return () => clearTimeout(t)
  }, [mode, isLoaded])

  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/showreel-poster.jpg"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover"
      />
      {mode === 'video' && (
        <video
          ref={ref}
          onPlaying={() => setPlaying(true)}
          className="absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-out"
          style={{ opacity: playing ? 1 : 0 }}
          muted
          loop
          playsInline
          preload="none"
        >
          <source src="/showreel.mp4" type="video/mp4" />
        </video>
      )}
    </>
  )
}

export function HeroSection() {
  const { isLoaded } = useLoader()
  const [menuOpen, setMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const reveal = (delay: number): React.CSSProperties => ({
    opacity: isLoaded ? 1 : 0,
    transform: isLoaded ? 'translateY(0)' : 'translateY(14px)',
    transition: 'opacity 0.8s ease-out, transform 0.8s ease-out',
    transitionDelay: `${delay}s`,
  })

  return (
    <section className="relative h-[100dvh] overflow-hidden bg-[#0b0b0b]" id="hero">
      <div className="absolute inset-0">
        <GradientWave className="h-full w-full" />
      </div>
      <div className="pointer-events-none absolute inset-0 bg-black/25" />

      {/* TOP NAV */}
      <header className="absolute inset-x-0 top-0 z-30 flex items-center justify-between px-6 py-6 md:px-10 lg:px-12">
        <div className="flex items-center gap-3" style={reveal(0.1)}>
          <TransitionLink href="/" aria-label="ARRVL home" className="flex items-center gap-2.5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logos/arrvl_logo.png" alt="ARRVL" className="h-10 w-auto md:h-12" />
            <span className={`text-[16px] font-semibold uppercase tracking-[-0.01em] text-cream ${geist}`}>
              ARRVL<span className="align-top text-[0.6em] font-medium text-cream/70">®</span>
            </span>
          </TransitionLink>
          <span className="hidden h-4 w-px bg-cream/20 md:block" />
          <span className={`hidden max-w-[180px] text-[11px] leading-[1.25] text-cream/50 md:block md:text-[12px] ${geist}`}>
            Motion-led <span className="font-medium text-cream/85">design &amp; dev</span> studio
          </span>
        </div>

        <nav className="flex items-center gap-5 md:gap-7" style={reveal(0.18)}>
          <div className={`hidden items-center gap-4 text-[12px] uppercase tracking-[0.12em] text-cream md:flex ${geist}`}>
            {NAV.map((n, i) => (
              <span key={n.href} className="flex items-center gap-4">
                <TransitionLink href={n.href} className="group">
                  <HoverText text={n.label} />
                </TransitionLink>
                {i < NAV.length - 1 && <span className="text-cream/25">/</span>}
              </span>
            ))}
          </div>
          <TransitionLink
            href="/contact"
            className={`group inline-flex items-center gap-2 bg-cream px-4 py-2 text-[11px] font-medium uppercase tracking-[0.12em] text-[#0b0b0b] transition-colors duration-300 hover:bg-cream/85 ${geist}`}
          >
            <HoverText text="Start a project" />
            <CtaArrow size={16} />
          </TransitionLink>
        </nav>
      </header>

      {/* CENTER CARD */}
      <div className="relative z-20 flex h-full items-center justify-center px-6">
        <div
          className="relative w-full max-w-[760px] will-change-[transform,opacity]"
          style={{
            opacity: isLoaded ? 1 : 0,
            transform: isLoaded ? 'scale(1) translateY(0)' : 'scale(1.08) translateY(8px)',
            transition: 'opacity 1s ease-out, transform 1.15s cubic-bezier(0.16,1,0.3,1)',
            transitionDelay: '0.2s',
          }}
        >
          <CardGuides />
          <div className="relative flex min-h-[360px] flex-col overflow-hidden border border-cream/15 px-7 py-8 md:min-h-[460px] md:px-12 md:py-11">
            <HeroShowreel isLoaded={isLoaded} />
            {/* scrim: strong on the left under the copy, fading right so the reel stays visible */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/30" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />

            <div className="relative z-10 flex flex-1 flex-col">
              <p className={`text-[10px] uppercase tracking-[0.22em] text-cream/45 ${geist}`}>
                (Est. 2018 / Version 1.0.0)
              </p>

              <LineMaskReveal trigger={isLoaded} delay={0.42} className="mt-5">
                <h1 className={`flex items-end gap-3 leading-none ${geist}`}>
                  <span className="text-[clamp(60px,10vw,144px)] font-semibold uppercase leading-[0.8] tracking-[-0.04em] text-cream">
                    ARRVL
                    <span className="align-top text-[0.2em] font-medium tracking-normal text-cream/70">®</span>
                  </span>
                  <span className="mb-[0.42em] text-[clamp(18px,2.2vw,32px)] font-medium uppercase tracking-[-0.01em] text-cream/80">
                    Studio
                  </span>
                </h1>
              </LineMaskReveal>

              <div className="mt-10 max-w-[88%] md:max-w-[52%]" style={reveal(0.72)}>
                <p className={`text-[11px] uppercase leading-[1.65] tracking-[0.04em] text-cream/55 md:text-[12px] ${geist}`}>
                  <span className="font-bold text-cream">// </span>We blend <span className="text-cream">design, motion, and engineering</span> into one
                  practice. From <span className="text-cream">clean custom websites</span> to{' '}
                  <span className="text-cream">immersive digital worlds</span>, built with precision and craft.
                </p>
              </div>

              <div
                className="mt-auto flex flex-wrap items-center justify-between gap-4 pt-10 lg:flex-nowrap"
                style={reveal(0.86)}
              >
                <div className={`flex items-center gap-3 text-[11px] uppercase tracking-[0.12em] text-cream md:text-[12px] ${geist}`}>
                  <span>Design</span>
                  <span className="text-cream/30">/</span>
                  <span>Development</span>
                  <span className="text-cream/30">/</span>
                  <span>Motion</span>
                </div>
                <div className="flex w-full flex-col gap-3 lg:w-auto lg:flex-row lg:items-center lg:shrink-0 lg:translate-x-2">
                  <TransitionLink
                    href="/projects"
                    className={`group inline-flex w-full items-center justify-center lg:w-[180px] border border-cream/30 px-5 py-2.5 text-[12px] font-medium uppercase tracking-[0.12em] text-cream transition-colors duration-300 hover:border-cream/60 hover:bg-cream/5 ${geist}`}
                  >
                    <HoverText text="Take a look" />
                  </TransitionLink>
                  <TransitionLink
                    href="/contact"
                    className={`group inline-flex w-full items-center justify-center lg:w-[180px] border border-transparent bg-cream px-5 py-2.5 text-[12px] font-medium uppercase tracking-[0.12em] text-[#0b0b0b] transition-colors duration-300 hover:bg-cream/85 ${geist}`}
                  >
                    <HoverText text="Start a project" />
                  </TransitionLink>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM STATUS BAR */}
      <div
        className={`absolute inset-x-0 bottom-0 z-30 flex items-center justify-between px-6 py-5 text-[10px] uppercase tracking-[0.16em] text-cream/45 md:px-10 lg:px-12 ${geist}`}
        style={reveal(1)}
      >
        <div className="flex items-center gap-2.5">
          <span className="hidden sm:inline">Slots for Q3</span>
          <span aria-hidden className="hidden items-center gap-[3px] sm:flex">
            {[0, 1, 2, 3, 4].map((i) => (
              <span
                key={i}
                className="h-2.5 w-[2px]"
                style={{ background: i < 3 ? 'var(--cream)' : 'rgba(255,253,226,0.2)' }}
              />
            ))}
          </span>
          <span className="text-cream/70">2 Left</span>
        </div>

        <button
          type="button"
          onClick={() => setMenuOpen(true)}
          aria-label="Open menu"
          className="group flex cursor-pointer flex-col items-center gap-[5px] p-2"
        >
          <span className="block h-[1.5px] w-5 bg-cream/55 transition-colors duration-300 group-hover:bg-cream" />
          <span className="block h-[1.5px] w-5 bg-cream/55 transition-colors duration-300 group-hover:bg-cream" />
        </button>

        <div className="flex items-center gap-2">
          <span className="hidden sm:inline">Local time</span>
          <LocalTime />
        </div>
      </div>

      {mounted &&
        createPortal(
          <MenuOverlay isOpen={menuOpen} onClose={() => setMenuOpen(false)} />,
          document.body
        )}
    </section>
  )
}
