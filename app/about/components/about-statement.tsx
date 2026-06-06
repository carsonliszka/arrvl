'use client'

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const geist = 'font-[family-name:var(--font-geist)]'

const LINE =
  'We do not chase trends or awards. We build digital work that earns attention and keeps it, for brands willing to be the most interesting thing in their category.'

export function AboutStatement() {
  const ref = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const words = ref.current?.querySelectorAll('[data-st-word]')
      if (words && words.length) {
        gsap.fromTo(
          words,
          { color: 'rgba(11,11,11,0.2)' },
          {
            color: 'rgba(11,11,11,1)',
            ease: 'none',
            stagger: { each: 0.06, ease: 'none' },
            scrollTrigger: {
              trigger: ref.current,
              start: 'top 75%',
              end: 'bottom 60%',
              scrub: 0.8,
            },
          }
        )
      }
    },
    { scope: ref }
  )

  const words = LINE.split(' ')

  return (
    <section ref={ref} className="bg-[#e9e9e9] text-[#0b0b0b]">
      <div className="px-6 py-28 md:px-10 md:py-40 lg:px-16">
        <div className="mx-auto max-w-[1200px]">
          <p className={`mb-8 text-[12px] font-medium uppercase tracking-[0.14em] text-[#0b0b0b]/55 ${geist}`}>
            What we believe
          </p>
          <h2
            className={`font-semibold uppercase tracking-[-0.035em] ${geist}`}
            style={{ fontSize: 'clamp(28px, 4.4vw, 64px)', lineHeight: '1.04' }}
          >
            {words.map((w, i) => (
              <span key={i} data-st-word className="mr-[0.22em] inline-block last:mr-0">
                {w}
              </span>
            ))}
          </h2>
          <p className={`mt-10 text-[12px] font-medium uppercase tracking-[0.14em] text-[#0b0b0b]/45 ${geist}`}>
            ARRVL · Imagine. Create. Arrive.
          </p>
        </div>
      </div>
    </section>
  )
}
