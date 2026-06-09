'use client'

import { useState } from 'react'
import { TransitionLink } from './transition-link'
import { HoverText } from './hover-text'
import { CtaArrow } from './cta'
import { ShowreelModal } from './showreel-modal'

const geist = 'font-[family-name:var(--font-geist)]'
const ink = 'text-[#0b0b0b]'

const IMG = '/showreel-poster.jpg'

export function StrategySection() {
  const [reelOpen, setReelOpen] = useState(false)

  return (
    <>
      {/* strategy before pixels (cream) */}
      <section className={`relative overflow-hidden bg-[#e9e9e9] ${ink}`}>
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 bg-[#0b0b0b]/12 lg:block"
        />

        <div className="relative mx-auto max-w-[1600px] px-6 py-20 md:px-10 md:py-24 lg:min-h-[900px] lg:px-14 lg:pb-16 lg:pt-10">
          {/* stat row */}
          <div className={`flex flex-wrap gap-x-14 gap-y-3 text-[11px] font-medium uppercase tracking-[0.16em] lg:w-1/2 lg:flex-nowrap lg:justify-between lg:gap-x-0 ${geist}`}>
            <span>Launched</span>
            <span>24+ Projects</span>
            <span className="text-[#0b0b0b]/55 lg:translate-x-full">2018-26©</span>
          </div>

          {/* headline, top right */}
          <h2
            className={`mt-10 text-right font-semibold uppercase leading-[0.85] tracking-[-0.04em] lg:absolute lg:right-14 lg:top-16 lg:mt-0 ${geist}`}
            style={{ fontSize: 'clamp(40px,6vw,92px)' }}
          >
            Strategy<br />Before<br />Pixels.
          </h2>

          {/* center image */}
          <div className="relative mx-auto mt-12 w-full max-w-[440px] lg:absolute lg:left-1/2 lg:top-[34%] lg:mt-0 lg:w-[30vw] lg:max-w-[520px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/cta-ipad.png"
              alt=""
              className="aspect-[3/2] w-full object-cover grayscale"
            />
          </div>

          {/* paragraph, left */}
          <p
            className={`mt-12 max-w-[420px] text-[12px] uppercase leading-[1.6] tracking-[0.03em] text-[#0b0b0b]/70 lg:absolute lg:left-[16%] lg:top-[42%] lg:mt-0 lg:max-w-[24%] ${geist}`}
          >
            <span className="font-semibold text-[#0b0b0b]">People decide if they trust your site before they read a single word on it.</span>{' '}
            That&rsquo;s not a metaphor. Visual credibility forms almost instantly, and it&rsquo;s shaped by{' '}
            <span className="font-semibold text-[#0b0b0b]">spacing, typography, image quality, and structure.</span>
          </p>

          {/* 12+ stat, bottom right */}
          <div className="mt-14 lg:absolute lg:right-14 lg:bottom-10 lg:mt-0 lg:text-right">
            <div className={`font-semibold leading-none tracking-[-0.03em] ${geist}`} style={{ fontSize: 'clamp(48px,5vw,84px)' }}>
              12+
            </div>
            <p className={`mt-3 text-[13px] font-medium leading-[1.2] tracking-[-0.01em] text-[#0b0b0b] lg:ml-auto lg:w-fit ${geist}`}>
              Industries where our sites
              <br />
              consistently outperform benchmarks
            </p>
          </div>

          {/* see the work, bottom left */}
          <div className="mt-14 lg:absolute lg:bottom-16 lg:left-[16%] lg:mt-0">
            <TransitionLink
              href="/projects"
              className={`group inline-flex items-center gap-2 text-[12px] font-medium uppercase tracking-[0.14em] ${ink} ${geist}`}
            >
              <span aria-hidden className="transition-transform duration-300 group-hover:translate-y-0.5">&darr;</span>
              <HoverText text="See the work" />
            </TransitionLink>
          </div>
        </div>
      </section>

      {/* prove what's possible (dark) */}
      <section className="relative overflow-hidden border-b border-cream/12 bg-[#0b0b0b] text-cream">
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 bg-cream/12 lg:block"
        />

        <div className="relative mx-auto max-w-[1600px] px-6 py-20 md:px-10 md:py-24 lg:min-h-[920px] lg:px-14 lg:pb-20 lg:pt-8">
          <div className="flex justify-end">
            <span className={`text-[11px] uppercase tracking-[0.16em] text-cream/40 ${geist}`}>2018-26©</span>
          </div>

          {/* headline, center */}
          <h2
            className={`mt-10 text-center font-semibold uppercase leading-[0.85] tracking-[-0.03em] lg:mt-10 lg:w-1/2 lg:text-right ${geist}`}
            style={{ fontSize: 'clamp(40px,6vw,104px)' }}
          >
            Prove<br />What&rsquo;s<br />Possible.
          </h2>

          {/* sub-paragraph */}
          <p
            className={`mx-auto mt-10 max-w-[420px] text-center text-[12px] uppercase leading-[1.6] tracking-[0.03em] text-cream/55 lg:mx-0 lg:ml-[50%] lg:mt-12 lg:max-w-[340px] lg:text-left ${geist}`}
          >
            Design, development, and motion as one practice,{' '}
            <span className="text-cream">for ambitious brands who refuse to settle.</span>
          </p>

          {/* second image */}
          <div className="relative mx-auto mt-12 w-full max-w-[320px] lg:ml-[50%] lg:mt-10 lg:w-[28vw] lg:max-w-[460px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={IMG}
              alt=""
              className="aspect-[4/3] w-full object-cover grayscale"
            />
          </div>

          {/* bottom row */}
          <div className="mt-16 flex items-center justify-between lg:mt-0 lg:block">
            <TransitionLink
              href="/about"
              className={`group inline-flex items-center gap-2 text-[12px] font-medium uppercase tracking-[0.14em] text-cream lg:absolute lg:bottom-6 lg:left-0 ${geist}`}
            >
              <HoverText text="About us" />
              <CtaArrow size={16} />
            </TransitionLink>

            <button
              type="button"
              onClick={() => setReelOpen(true)}
              className={`group inline-flex items-center gap-3 text-[12px] font-medium uppercase tracking-[0.14em] text-cream lg:absolute lg:right-1/2 lg:bottom-3 ${geist}`}
            >
              <HoverText text="Showreel" />
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-cream transition-transform duration-300 group-hover:scale-105">
                <svg width="10" height="12" viewBox="0 0 10 12" fill="none" aria-hidden className="ml-[2px]">
                  <path d="M0 0L10 6L0 12V0Z" fill="#0b0b0b" />
                </svg>
              </span>
            </button>
          </div>
        </div>
      </section>

      <ShowreelModal open={reelOpen} onClose={() => setReelOpen(false)} src="/showreel-full.mp4" />
    </>
  )
}
