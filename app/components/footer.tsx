'use client'

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { TransitionLink } from './transition-link'
import { HoverText } from './hover-text'

const ICON_SIZE = 20

function InstagramIcon() {
  return (
    <svg width={ICON_SIZE} height={ICON_SIZE} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ display: 'block' }}>
      <rect x="3" y="3" width="18" height="18" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.2" cy="6.8" r="0.9" fill="currentColor" />
    </svg>
  )
}
function LinkedInIcon() {
  return (
    <svg width={ICON_SIZE} height={ICON_SIZE} viewBox="0 0 24 24" fill="currentColor" style={{ display: 'block' }}>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.063 2.063 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452z" />
    </svg>
  )
}
function GithubIcon() {
  return (
    <svg width={ICON_SIZE} height={ICON_SIZE} viewBox="0 0 24 24" fill="currentColor" style={{ display: 'block' }}>
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.4 3-.405 1.02.005 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  )
}

const SOCIAL_LINKS = [
  { label: 'Instagram', href: 'https://www.instagram.com/arrvlstudio', external: true, Icon: InstagramIcon },
  { label: 'LinkedIn', href: '/linkedin', external: false, Icon: LinkedInIcon },
  { label: 'GitHub', href: 'https://github.com/carsonliszka', external: true, Icon: GithubIcon },
]

const FOOTER_LINKS = [
  { label: 'Privacy Policy', href: '/privacy-policy' },
  { label: 'Terms', href: '/terms' },
  { label: 'Accessibility', href: '/accessibility' },
  { label: 'Contact', href: '/contact' },
]

export function Footer() {
  const sectionRef = useRef<HTMLElement>(null)
  const wordmarkRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      gsap.fromTo(
        '[data-footer-fade]',
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.05,
          duration: 0.7,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        }
      )

      const chars = wordmarkRef.current?.querySelectorAll('[data-wordmark-char]')
      if (chars && chars.length > 0) {
        gsap.set(chars, { y: 120, opacity: 0 })
        gsap.to(chars, {
          y: 0,
          opacity: 1,
          stagger: 0.07,
          duration: 1.1,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: wordmarkRef.current,
            start: 'top 95%',
            once: true,
          },
        })
      }

      gsap.to('[data-footer-mark]', {
        rotation: 360,
        duration: 22,
        ease: 'none',
        repeat: -1,
      })
    },
    { scope: sectionRef }
  )

  return (
    <footer
      ref={sectionRef}
      className="relative overflow-hidden bg-[#0b0b0b] pt-32 font-[family-name:var(--font-geist)] md:pt-40"
    >
      <div className="mb-16 grid grid-cols-12 gap-8 px-6 md:mb-20 md:px-10 lg:px-20">
        <div data-footer-fade className="col-span-12 md:col-span-3" style={{ opacity: 0 }}>
          <div className="mb-4 flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img alt="ARRVL" src="/logos/arrvl_logo.png" className="h-9 w-auto" />
            <span className="text-[12px] font-semibold uppercase tracking-[0.14em] text-white/85">
              Imagine. Create. Arrive.<sup className="ml-0.5">®</sup>
            </span>
          </div>
        </div>

        <div data-footer-fade className="col-span-6 md:col-span-3" style={{ opacity: 0 }}>
          <p className="mb-3 flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.14em] text-white/40">
            <span className="h-1 w-1 rounded-full bg-white/40" /> Talk
          </p>
          <a
            href="mailto:hello@arrvl.studio"
            className="group mb-1 inline-block text-[15px] text-white"
          >
            <HoverText text="hello@arrvl.studio" />
          </a>
          <p className="text-[14px] text-white/55">(619) 514-7174</p>
        </div>

        <div data-footer-fade className="col-span-6 md:col-span-3" style={{ opacity: 0 }}>
          <p className="mb-3 flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.14em] text-white/40">
            <span className="h-1 w-1 rounded-full bg-white/40" /> Meet
          </p>
          <p className="text-[14px] leading-[1.55] text-white/55">
            310 A St
            <br />
            San Diego, CA 92101
            <br />
            United States
          </p>
          <TransitionLink
            href="/projects"
            className="group mt-6 inline-flex items-center gap-1.5 text-[13px] text-white"
          >
            <span className="text-white/45">↳</span>
            <HoverText text="Our work" />
          </TransitionLink>
        </div>

        <div data-footer-fade className="col-span-12 md:col-span-3" style={{ opacity: 0 }}>
          <p className="mb-3 flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.14em] text-white/40">
            <span className="h-1 w-1 rounded-full bg-white/40" /> Join
          </p>
          <a
            href="mailto:hiring@arrvl.studio"
            className="group inline-block text-[15px] text-white"
          >
            <HoverText text="hiring@arrvl.studio" />
          </a>
        </div>
      </div>

      <div
        data-footer-fade
        className="mb-12 flex flex-wrap items-center justify-between gap-6 border-t border-white/10 px-6 pt-6 md:mb-16 md:px-10 lg:px-20"
        style={{ opacity: 0 }}
      >
        <span className="text-[10px] uppercase tracking-[0.2em] text-white/45">
          Since twenty-eighteen
        </span>

        <nav className="flex flex-wrap items-center gap-x-6 gap-y-2">
          {FOOTER_LINKS.map(({ label, href }) => (
            <TransitionLink
              key={label}
              href={href}
              className="text-[10px] uppercase tracking-[0.2em] text-white/45 transition-colors hover:text-white"
            >
              {label}
            </TransitionLink>
          ))}
        </nav>

        <div className="flex items-center gap-7">
          {SOCIAL_LINKS.map(({ label, href, external, Icon }) => (
            <a
              key={label}
              href={href}
              aria-label={label}
              {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              className="inline-flex items-center justify-center text-white/70 transition-[color,scale] duration-300 ease-out hover:scale-110 hover:text-white"
              style={{ width: 26, height: 26 }}
            >
              <Icon />
            </a>
          ))}
        </div>

        <span className="text-[10px] uppercase tracking-[0.2em] text-white/45">
          By ARRVL studio
        </span>
      </div>

      <div
        ref={wordmarkRef}
        className="pointer-events-none relative w-full select-none pb-4 md:pb-6"
      >
        <div className="flex items-start justify-center leading-none">
          <div className="relative inline-block">
            <div className="flex items-end gap-[0.5vw]">
              {'ARRVL'.split('').map((char, i) => (
                <span
                  key={i}
                  data-wordmark-char
                  className="block font-semibold uppercase leading-[0.82] tracking-[-0.05em] text-white will-change-[transform,opacity]"
                  style={{ fontSize: 'clamp(120px, 26vw, 480px)' }}
                >
                  {char}
                </span>
              ))}
            </div>

            <span
              data-wordmark-char
              className="absolute -top-[2vw] right-[-3.5vw] inline-flex items-center justify-center md:right-[-3vw]"
              style={{
                width: 'clamp(34px, 4.5vw, 78px)',
                height: 'clamp(34px, 4.5vw, 78px)',
              }}
            >
              <span
                data-footer-mark
                aria-hidden="true"
                className="absolute inset-0 rounded-full border border-white/40 will-change-transform"
                style={{ borderRadius: '9999px' }}
              />
              <span
                className="relative z-10 font-semibold leading-none text-white/80"
                style={{ fontSize: 'clamp(10px, 1.15vw, 19px)', letterSpacing: '0.02em' }}
              >
                TM
              </span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
