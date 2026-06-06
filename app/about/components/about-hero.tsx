'use client'

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { GradientWave } from '../../components/gradient-wave'

const geist = 'font-[family-name:var(--font-geist)]'

export function AboutHero() {
  const sectionRef = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      gsap.fromTo(
        '[data-about-word]',
        { yPercent: 115 },
        { yPercent: 0, stagger: 0.08, duration: 1, delay: 0.15, ease: 'power3.out' }
      )
      gsap.fromTo(
        '[data-about-fade]',
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, stagger: 0.06, duration: 0.7, delay: 0.55, ease: 'power2.out' }
      )
    },
    { scope: sectionRef }
  )

  return (
    <section ref={sectionRef} className="relative min-h-screen overflow-hidden bg-[#0b0b0b]">
      <div className="absolute inset-0">
        <GradientWave className="h-full w-full" />
      </div>

      <div className="relative z-10 flex min-h-screen flex-col px-6 pb-10 pt-32 md:px-10 md:pt-40 lg:px-16">
        <div className="flex flex-1 items-end">
          <div className="flex w-full flex-col items-start justify-between gap-8 md:flex-row md:items-end">
            <h1
              className={`font-semibold uppercase text-white ${geist}`}
              style={{ fontSize: 'clamp(54px, 9vw, 110px)', letterSpacing: '-0.05em', lineHeight: '0.82em' }}
            >
              {['About', 'us.'].map((w) => (
                <span key={w} className="block overflow-hidden">
                  <span data-about-word className="inline-block will-change-transform">
                    {w}
                  </span>
                </span>
              ))}
            </h1>

            <p
              data-about-fade
              className={`max-w-[320px] text-[12px] font-medium uppercase leading-[1.5] tracking-[-0.01em] text-white/60 md:text-right ${geist}`}
              style={{ opacity: 0 }}
            >
              An artist-led creative studio building{' '}
              <span className="text-white">brand, web, and motion</span> for teams who
              would rather stand out than blend in.
            </p>
          </div>
        </div>

        <div
          data-about-fade
          className={`mt-10 flex items-center justify-between border-t border-white/12 pt-6 text-[11px] uppercase tracking-[0.2em] text-white/45 ${geist}`}
          style={{ opacity: 0 }}
        >
          <span>· The studio</span>
          <span className="tabular-nums">Since 2018</span>
        </div>
      </div>
    </section>
  )
}
