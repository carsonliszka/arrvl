'use client'

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { GradientWave } from '../../components/gradient-wave'

interface ProjectsHeroProps {
  filters: string[]
  activeFilter: string
  onFilter: (f: string) => void
  search: string
  onSearch: (v: string) => void
}

export function ProjectsHero({
  filters,
  activeFilter,
  onFilter,
  search,
  onSearch,
}: ProjectsHeroProps) {
  const sectionRef = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      gsap.fromTo(
        '[data-hero-word]',
        { yPercent: 110 },
        {
          yPercent: 0,
          stagger: 0.08,
          duration: 1.0,
          delay: 0.15,
          ease: 'power3.out',
        }
      )
      gsap.fromTo(
        '[data-hero-fade]',
        { opacity: 0, y: 14 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.06,
          duration: 0.7,
          delay: 0.6,
          ease: 'power2.out',
        }
      )
    },
    { scope: sectionRef }
  )

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen overflow-hidden bg-[#0b0b0b]"
    >
      <div className="absolute inset-0">
        <GradientWave className="h-full w-full" />
      </div>
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.05] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      <div className="relative z-10 flex min-h-screen flex-col px-6 pb-8 pt-32 md:px-10 md:pb-10 md:pt-40 lg:px-16">
        <div className="flex flex-1 items-center">
          <div className="flex w-full flex-col items-start justify-between gap-8 md:flex-row md:items-end">
            <h1
              className="font-[family-name:var(--font-geist)] font-semibold uppercase text-white"
              style={{
                fontSize: 'clamp(54px, 9vw, 98px)',
                letterSpacing: '-0.05em',
                lineHeight: '0.82em',
              }}
            >
              {['Selected', 'work'].map((w) => (
                <span key={w} className="block overflow-hidden">
                  <span data-hero-word className="inline-block will-change-transform">
                    {w}
                  </span>
                </span>
              ))}
            </h1>

            <p
              data-hero-fade
              className="max-w-[280px] font-[family-name:var(--font-geist)] text-[12px] font-medium uppercase leading-[1.5] tracking-[-0.01em] text-white/60 md:text-right"
              style={{ opacity: 0 }}
            >
              We build sites that <span className="text-white">perform</span>.
              <br />
              Here&apos;s what that{' '}
              <span className="text-white">looks like in practice.</span>
            </p>
          </div>
        </div>

        <div className="mt-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div data-hero-fade className="flex flex-wrap gap-2" style={{ opacity: 0 }}>
              {filters.map((f) => {
                const active = f === activeFilter
                return (
                  <button
                    key={f}
                    type="button"
                    onClick={() => onFilter(f)}
                    className={`border px-4 py-2 font-[family-name:var(--font-geist)] text-[12px] font-medium uppercase leading-none tracking-[-0.01em] transition-colors duration-300 ${
                      active
                        ? 'border-white bg-white text-[#0b0b0b]'
                        : 'border-white/12 bg-transparent text-white/70 hover:border-white/40 hover:text-white'
                    }`}
                  >
                    {f}
                  </button>
                )
              })}
            </div>

            <div
              data-hero-fade
              className="flex items-center gap-6"
              style={{ opacity: 0 }}
            >
              <input
                type="text"
                value={search}
                onChange={(e) => onSearch(e.target.value)}
                placeholder="NAME SEARCH…"
                className="w-[200px] border-b border-white/15 bg-transparent pb-2 font-[family-name:var(--font-geist)] text-[12px] font-medium uppercase tracking-[-0.01em] text-white placeholder:text-white/40 focus:border-white/50 focus:outline-none"
              />
              <span className="hidden font-[family-name:var(--font-geist)] text-[12px] font-medium uppercase tracking-[-0.01em] text-white/60 sm:block">
                2019-26©
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
