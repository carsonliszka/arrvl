'use client'

import { useRef } from 'react'
import { useLoader } from '../providers/loader-context'
import { GradientWave } from './gradient-wave'
import { BlurRevealText } from './blur-reveal-text'
import { RotatingWord } from './rotating-word'
import { LineMaskReveal } from './line-mask-reveal'
import { ScrollIndicator } from './scroll-indicator'
import { Cta } from './cta'

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const { isLoaded } = useLoader()

  return (
    <section
      ref={sectionRef}
      className="relative h-[100dvh] overflow-hidden bg-[#0b0b0b]"
      id="hero"
    >
      <div className="absolute inset-0">
        <GradientWave className="h-full w-full" />
      </div>

      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 md:px-10 lg:px-14 text-center">
        <h1
          className="font-[family-name:var(--font-geist)] text-[clamp(48px,10vw,120px)] font-semibold leading-[0.85] tracking-[-0.05em] text-white uppercase"
          aria-label="We are an Artist-led Creative Agency Studio Collective"
        >
          <BlurRevealText
            words={['We', 'are', 'an']}
            trigger={isLoaded}
            delay={0}
          />
          <BlurRevealText
            words={['Artist', '–', 'led']}
            trigger={isLoaded}
            delay={0.15}
          />
          <BlurRevealText
            words={['Creative']}
            trigger={isLoaded}
            delay={0.3}
          />
          <RotatingWord />
        </h1>

        <LineMaskReveal
          trigger={isLoaded}
          delay={0.6}
          className="mt-10"
        >
          <p className="text-[12px] font-[family-name:var(--font-geist)] font-medium text-white/55 tracking-[0.18em] uppercase">
            Design &middot; Development &middot; Motion &middot; Strategy
          </p>
        </LineMaskReveal>

        <div
          className="mt-12 flex flex-wrap items-center justify-center gap-4 transition-all duration-700 ease-out"
          style={{
            opacity: isLoaded ? 1 : 0,
            transform: isLoaded ? 'translateY(0)' : 'translateY(20px)',
            transitionDelay: '0.9s',
          }}
        >
          <Cta href="/contact" variant="primary" size="md">
            Start a project
          </Cta>
          <Cta href="/projects" variant="secondary" size="md">
            See our work
          </Cta>
        </div>
      </div>

      <ScrollIndicator />
    </section>
  )
}
