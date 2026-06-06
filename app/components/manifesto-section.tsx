'use client'

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { TransitionLink } from './transition-link'
import { HoverText } from './hover-text'

const BIG_HEADING =
  'A creative studio that helps extraordinary brands prove what’s possible through digital craft'

const HEADING = 'A studio built to prove what’s possible'

const LEAD =
  'We bring design, development, and motion together as one practice, for ambitious brands who refuse to settle. We turn bold ideas into expressive, future-ready experiences.'

const CARDS = [
  {
    n: '01',
    title: 'Strategy',
    items: [
      'Digital Experience Strategy',
      'Brand Strategy',
      'Creative Direction',
      'Discovery & Research',
      'Positioning',
    ],
  },
  {
    n: '02',
    title: 'Creative',
    items: [
      'Art Direction',
      'Brand Identity',
      'UX / UI Design',
      'Motion Design',
      'Visual Systems',
    ],
  },
  {
    n: '03',
    title: 'Technology',
    items: [
      'Front-End Development',
      'WebGL & Shaders',
      'Web Applications',
      'Headless & CMS',
      'Performance',
    ],
  },
  {
    n: '04',
    title: 'Production',
    items: [
      'Motion & Animation',
      '3D & CGI',
      'Scroll Experiences',
      'Interaction Design',
      'Launch & Support',
    ],
  },
]

const geist = 'font-[family-name:var(--font-geist)]'

export function ManifestoSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const bigHeadingRef = useRef<HTMLHeadingElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const ctaRef = useRef<HTMLAnchorElement>(null)
  const ctaArrowRef = useRef<HTMLSpanElement>(null)

  useGSAP(
    () => {
      gsap.fromTo(
        '[data-manifesto-label]',
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '[data-manifesto-label]',
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        }
      )

      const bigWords = bigHeadingRef.current?.querySelectorAll('[data-big-word]')
      if (bigWords && bigWords.length > 0) {
        gsap.fromTo(
          bigWords,
          { color: 'rgba(255,255,255,0.16)', filter: 'blur(2px)' },
          {
            color: 'rgba(255,255,255,1)',
            filter: 'blur(0px)',
            ease: 'none',
            stagger: { each: 0.4, ease: 'none' },
            scrollTrigger: {
              trigger: bigHeadingRef.current,
              start: 'top 78%',
              end: 'bottom 45%',
              scrub: 0.8,
            },
          }
        )
      }

      gsap.fromTo(
        '[data-intro]',
        { opacity: 0, y: 22 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.08,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 72%',
            toggleActions: 'play none none none',
          },
        }
      )

      const words = headingRef.current?.querySelectorAll('[data-word]')
      if (words && words.length > 0) {
        gsap.fromTo(
          words,
          { color: 'rgba(255,255,255,0.18)' },
          {
            color: 'rgba(255,255,255,1)',
            ease: 'none',
            stagger: { each: 0.35, ease: 'none' },
            scrollTrigger: {
              trigger: headingRef.current,
              start: 'top 82%',
              end: 'bottom 60%',
              scrub: 0.8,
            },
          }
        )
      }

      const cards = sectionRef.current?.querySelectorAll('[data-card]')
      cards?.forEach((card) => {
        gsap.fromTo(
          card,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 88%',
              toggleActions: 'play none none none',
            },
          }
        )
      })

      const cta = ctaRef.current
      const arrow = ctaArrowRef.current
      if (cta && arrow) {
        const xTo = gsap.quickTo(arrow, 'x', { duration: 0.5, ease: 'power3.out' })
        const yTo = gsap.quickTo(arrow, 'y', { duration: 0.5, ease: 'power3.out' })
        const onMove = (e: MouseEvent) => {
          const rect = cta.getBoundingClientRect()
          const dx = e.clientX - (rect.left + rect.width / 2)
          const dy = e.clientY - (rect.top + rect.height / 2)
          xTo(dx * 0.3)
          yTo(dy * 0.4)
        }
        const onLeave = () => {
          xTo(0)
          yTo(0)
        }
        cta.addEventListener('mousemove', onMove)
        cta.addEventListener('mouseleave', onLeave)
        return () => {
          cta.removeEventListener('mousemove', onMove)
          cta.removeEventListener('mouseleave', onLeave)
        }
      }
    },
    { scope: sectionRef }
  )

  const words = HEADING.split(' ')
  const bigWords = BIG_HEADING.split(' ')

  return (
    <section
      ref={sectionRef}
      className="relative bg-[#0b0b0b] px-6 py-32 md:px-10 md:py-44 lg:px-20"
    >
      <div className="mx-auto mb-24 max-w-[1240px] text-center md:mb-36">
        <p
          data-manifesto-label
          className={`mb-10 text-[11px] uppercase tracking-[0.25em] text-white/45 ${geist} font-medium`}
          style={{ opacity: 0 }}
        >
          Manifesto
        </p>
        <h2
          ref={bigHeadingRef}
          className={`mx-auto max-w-[1240px] text-[clamp(34px,5.8vw,82px)] font-semibold uppercase leading-[1.02] tracking-[-0.04em] ${geist}`}
        >
          {bigWords.map((word, i) => (
            <span
              key={i}
              data-big-word
              className="mr-[0.28em] inline-block will-change-[filter,color] last:mr-0"
            >
              {word}
            </span>
          ))}
        </h2>
      </div>

      <div className="mx-auto grid max-w-[1280px] grid-cols-12 gap-y-14 lg:gap-x-10">
        <div className="col-span-12 lg:col-span-5">
          <div data-sticky className="lg:sticky lg:top-32">
            <span
              data-intro
              className={`mb-8 inline-block border border-white/15 px-3.5 py-1.5 text-[10px] uppercase tracking-[0.18em] ${geist} font-medium text-white/70`}
              style={{ opacity: 0 }}
            >
              Manifesto
            </span>

            <h2
              ref={headingRef}
              className={`max-w-[460px] text-[clamp(30px,3.2vw,50px)] font-semibold uppercase leading-[1.0] tracking-[-0.03em] ${geist}`}
            >
              {words.map((word, i) => (
                <span
                  key={i}
                  data-word
                  className="mr-[0.22em] inline-block will-change-[color] last:mr-0"
                >
                  {word}
                </span>
              ))}
            </h2>

            <p
              data-intro
              className={`mt-7 max-w-[420px] text-[clamp(14px,1.05vw,16px)] leading-[1.7] text-white/60 ${geist}`}
              style={{ opacity: 0 }}
            >
              {LEAD}
            </p>

            <TransitionLink
              ref={ctaRef as unknown as React.RefObject<HTMLAnchorElement>}
              data-intro
              href="/projects"
              className="group mt-10 inline-flex w-full max-w-[320px] items-center justify-between border-t border-white/20 pt-5 transition-colors duration-300 hover:border-white/45"
              style={{ opacity: 0 }}
            >
              <HoverText
                text="See the work"
                className={`text-[12px] uppercase tracking-[0.18em] text-white ${geist} font-medium`}
              />
              <span
                ref={ctaArrowRef}
                className="inline-block translate-y-0 text-[16px] leading-none text-white transition-transform duration-300 will-change-transform group-hover:translate-x-1"
              >
                {'→'}
              </span>
            </TransitionLink>
          </div>
        </div>

        <div className="col-span-12 flex flex-col gap-4 md:gap-5 lg:col-span-7">
          {CARDS.map((c) => (
            <article
              key={c.n}
              data-card
              className="group border border-white/12 bg-white/[0.02] p-7 transition-colors duration-300 hover:border-white/25 hover:bg-white/[0.04] md:p-9"
              style={{ opacity: 0 }}
            >
              <div className="flex items-baseline justify-between gap-4">
                <h3 className={`text-[clamp(22px,1.9vw,30px)] font-semibold uppercase tracking-[-0.02em] text-white ${geist}`}>
                  {c.title}
                </h3>
                <span className={`text-[12px] tabular-nums tracking-[0.1em] text-white/40 ${geist}`}>
                  / {c.n}
                </span>
              </div>
              <ul className="mt-6">
                {c.items.map((it) => (
                  <li
                    key={it}
                    className={`border-t border-dotted border-white/15 py-3.5 text-[14px] text-white/65 transition-colors duration-300 group-hover:text-white/90 md:text-[15px] ${geist}`}
                  >
                    {it}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
