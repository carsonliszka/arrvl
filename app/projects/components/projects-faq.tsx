'use client'

import { useRef, useState } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { TransitionLink } from '../../components/transition-link'
import { CtaArrow } from '../../components/cta'
import { HoverText } from '../../components/hover-text'

gsap.registerPlugin(ScrollTrigger)

const FAQS = [
  {
    q: 'What kind of projects do you take on?',
    a: 'Brand identity, websites, and motion, mostly for teams who want to look unlike anyone else in their category. If it’s creatively ambitious, we want in.',
  },
  {
    q: 'Do I need a finished brief before reaching out?',
    a: 'Not at all. A sentence and a hunch is plenty. Half of what we do is help you figure out what’s actually worth building before anyone designs a thing.',
  },
  {
    q: 'How involved am I in the process?',
    a: 'As much as you want, at the points that matter. We move in clear stages (direction, design, build), and nothing proceeds until you’ve signed off on the one before it.',
  },
  {
    q: 'What happens after launch?',
    a: 'We don’t vanish. You get a proper handover, support while you settle in, and a standing invite to keep evolving the work as you grow.',
  },
]

export function ProjectsFAQ() {
  const sectionRef = useRef<HTMLElement>(null)
  const [open, setOpen] = useState(0)

  useGSAP(
    () => {
      gsap.fromTo(
        '[data-faq-heading-word]',
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
        '[data-faq-item]',
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.08,
          duration: 0.7,
          ease: 'power2.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 65%' },
        }
      )
    },
    { scope: sectionRef }
  )

  return (
    <section ref={sectionRef} className="bg-[#e9e9e9] text-[#0b0b0b]">
      <div className="px-6 py-24 md:px-10 md:py-32 lg:px-16">
        <div className="mx-auto grid max-w-[1500px] grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <p className="mb-6 font-[family-name:var(--font-geist)] text-[12px] font-medium uppercase tracking-[-0.01em] text-[#0b0b0b]/60">
              FAQ
            </p>
            <h2
              className="font-[family-name:var(--font-geist)] font-semibold uppercase text-[#0b0b0b]"
              style={{
                fontSize: 'clamp(40px, 6vw, 92px)',
                letterSpacing: '-0.05em',
                lineHeight: '0.82em',
              }}
            >
              {['Before we', 'get started.'].map((w) => (
                <span key={w} className="block overflow-hidden">
                  <span
                    data-faq-heading-word
                    className="inline-block will-change-transform"
                  >
                    {w}
                  </span>
                </span>
              ))}
            </h2>
          </div>

          <div className="lg:col-span-7">
            <div className="border-t border-[#0b0b0b]/12">
              {FAQS.map((item, i) => {
                const isOpen = open === i
                return (
                  <div
                    key={item.q}
                    data-faq-item
                    className="border-b border-[#0b0b0b]/12"
                  >
                    <button
                      type="button"
                      onClick={() => setOpen(isOpen ? -1 : i)}
                      className="flex w-full items-center gap-6 py-6 text-left"
                      aria-expanded={isOpen}
                    >
                      <span className="font-[family-name:var(--font-geist)] text-[13px] font-medium tabular-nums text-[#0b0b0b]">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span className="flex-1 font-[family-name:var(--font-geist)] text-[14px] font-medium uppercase tracking-[-0.01em] text-[#0b0b0b]/70 md:text-[15px]">
                        {item.q}
                      </span>
                      <span className="relative h-3 w-3 shrink-0">
                        <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-[#0b0b0b]/60" />
                        <span
                          className={`absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-[#0b0b0b]/60 transition-transform duration-300 ${
                            isOpen ? 'rotate-90' : 'rotate-0'
                          }`}
                        />
                      </span>
                    </button>
                    <div
                      className="grid transition-all duration-500 ease-out"
                      style={{
                        gridTemplateRows: isOpen ? '1fr' : '0fr',
                        opacity: isOpen ? 1 : 0,
                      }}
                    >
                      <div className="overflow-hidden">
                        <p className="max-w-[640px] pb-7 pl-[2.4rem] font-[family-name:var(--font-geist)] text-[14px] leading-[1.55] text-[#0b0b0b]/60">
                          {item.a}
                        </p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            <TransitionLink
              href="/contact"
              className="group mt-8 inline-flex items-center justify-center gap-3 border border-[#0b0b0b] bg-[#0b0b0b] px-7 py-4 font-[family-name:var(--font-geist)] text-[12px] font-semibold uppercase tracking-[-0.01em] text-white transition-colors duration-500 hover:bg-transparent hover:text-[#0b0b0b]"
            >
              <HoverText text="Ask a question" />
              <CtaArrow size={14} />
            </TransitionLink>
          </div>
        </div>
      </div>
    </section>
  )
}
