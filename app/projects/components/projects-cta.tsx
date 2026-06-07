'use client'

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { TransitionLink } from '../../components/transition-link'
import { CtaArrow } from '../../components/cta'
import { HoverText } from '../../components/hover-text'

gsap.registerPlugin(ScrollTrigger)

export function ProjectsCTA() {
  const sectionRef = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      gsap.fromTo(
        '[data-cta-word]',
        { yPercent: 110 },
        {
          yPercent: 0,
          stagger: 0.08,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' },
        }
      )
      gsap.fromTo(
        '[data-cta-fade]',
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.06,
          duration: 0.7,
          ease: 'power2.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 68%' },
        }
      )
    },
    { scope: sectionRef }
  )

  return (
    <section ref={sectionRef} className="bg-[#0b0b0b]">
      <div className="px-6 py-28 md:px-10 md:py-40 lg:px-16">
        <div className="mx-auto grid max-w-[1500px] grid-cols-12 items-center lg:gap-10">
        <div className="hidden lg:col-span-5 lg:block">
          <ImagePillars src="/projects/liszka-construction.png" />
        </div>
        <div className="col-span-12 lg:col-span-7 lg:col-start-6">
          <div data-cta-fade className="mb-10 flex items-center gap-3" style={{ opacity: 0 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img alt="ARRVL" src="/logos/arrvl_logo.png" className="h-12 w-auto" />
            <span className="font-[family-name:var(--font-geist)] text-[12px] font-semibold uppercase tracking-[0.14em] text-white">
              ARRVL<sup className="ml-0.5 text-white/60">®</sup>
            </span>
          </div>

          <h2
            className="w-full font-[family-name:var(--font-geist)] font-semibold uppercase text-white"
            style={{
              fontSize: 'clamp(52px, 9vw, 150px)',
              letterSpacing: '-0.05em',
              lineHeight: '0.82em',
            }}
          >
            {['Start a', 'project.'].map((w) => (
              <span key={w} className="block overflow-hidden">
                <span data-cta-word className="inline-block will-change-transform">
                  {w}
                </span>
              </span>
            ))}
          </h2>

          <p
            data-cta-fade
            className="mt-9 max-w-[460px] font-[family-name:var(--font-geist)] text-[12px] font-medium uppercase leading-[1.6] tracking-[0.02em] text-white/55"
            style={{ opacity: 0 }}
          >
            Whether you have it all figured out or just an idea, we&apos;re here
            to help shape it.{' '}
            <span className="text-white">Just a clear next step.</span>
          </p>

          <div
            data-cta-fade
            className="mt-10 flex flex-wrap items-center gap-8"
            style={{ opacity: 0 }}
          >
            <TransitionLink
              href="/contact"
              className="group inline-flex items-center gap-3 border border-white bg-white px-8 py-4 font-[family-name:var(--font-geist)] text-[12px] font-semibold uppercase tracking-[-0.01em] text-[#0b0b0b] transition-colors duration-500 hover:bg-transparent hover:text-white"
            >
              <HoverText text="Get in touch" />
              <CtaArrow size={14} />
            </TransitionLink>
            <a
              href="mailto:projects@arrvl.studio"
              className="font-[family-name:var(--font-geist)] text-[15px] text-white/80 transition-colors hover:text-white"
            >
              projects@arrvl.studio
            </a>
          </div>

          <p
            data-cta-fade
            className="mt-8 font-[family-name:var(--font-geist)] text-[11px] uppercase tracking-[0.04em] text-white/35"
            style={{ opacity: 0 }}
          >
            We will get back to you{' '}
            <strong className="font-semibold text-white/60">shortly.</strong>
          </p>
        </div>
        </div>
      </div>
    </section>
  )
}

function ImagePillars({ src }: { src: string }) {
  return (
    <div className="relative aspect-[3/2] w-full">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="absolute inset-0"
          style={{
            clipPath: `polygon(${i * 29 + 20}% 0%, ${i * 29 + 42}% 0%, ${i * 29 + 22}% 100%, ${i * 29}% 100%)`,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full"
            style={{ objectFit: 'cover', objectPosition: 'center' }}
          />
        </div>
      ))}
    </div>
  )
}
