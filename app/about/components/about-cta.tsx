'use client'

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { TransitionLink } from '../../components/transition-link'
import { CtaArrow } from '../../components/cta'
import { HoverText } from '../../components/hover-text'

gsap.registerPlugin(ScrollTrigger)

const geist = 'font-[family-name:var(--font-geist)]'

export function AboutCTA() {
  const ref = useRef<HTMLElement>(null)

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
          scrollTrigger: { trigger: ref.current, start: 'top 75%' },
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
          scrollTrigger: { trigger: ref.current, start: 'top 68%' },
        }
      )
    },
    { scope: ref }
  )

  return (
    <section ref={ref} className="bg-[#0b0b0b]">
      <div className="px-6 py-28 md:px-10 md:py-40 lg:px-16">
        <div className="mx-auto grid max-w-[1500px] grid-cols-12">
          <div className="col-span-12 lg:col-span-7 lg:col-start-6">
            <div data-cta-fade className={`mb-10 flex items-center gap-3 ${geist}`} style={{ opacity: 0 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img alt="ARRVL" src="/logos/arrvl_logo.png" className="h-12 w-auto" />
              <span className="text-[12px] font-semibold uppercase tracking-[0.14em] text-white">
                ARRVL<sup className="ml-0.5 text-white/60">®</sup>
              </span>
            </div>

            <h2
              className={`font-semibold uppercase text-white ${geist}`}
              style={{ fontSize: 'clamp(52px, 9vw, 150px)', letterSpacing: '-0.05em', lineHeight: '0.82em' }}
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
              className={`mt-9 max-w-[440px] text-[12px] font-medium uppercase leading-[1.6] tracking-[0.02em] text-white/55 ${geist}`}
              style={{ opacity: 0 }}
            >
              Whether you have it all figured out or just an idea, we are here to
              help shape it.{' '}
              <span className="text-white">Just a clear next step.</span>
            </p>

            <div data-cta-fade className="mt-10 flex flex-wrap items-center gap-8" style={{ opacity: 0 }}>
              <TransitionLink
                href="/contact"
                className={`group inline-flex items-center gap-3 border border-white bg-white px-8 py-4 text-[12px] font-semibold uppercase tracking-[-0.01em] text-[#0b0b0b] transition-colors duration-500 hover:bg-transparent hover:text-white ${geist}`}
              >
                <HoverText text="Get in touch" />
                <CtaArrow size={14} />
              </TransitionLink>
              <a href="mailto:projects@arrvl.studio" className={`text-[15px] text-white/80 transition-colors hover:text-white ${geist}`}>
                projects@arrvl.studio
              </a>
            </div>

            <p data-cta-fade className={`mt-8 text-[11px] uppercase tracking-[0.04em] text-white/35 ${geist}`} style={{ opacity: 0 }}>
              We will get back to you{' '}
              <strong className="font-semibold text-white/60">shortly.</strong>
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
