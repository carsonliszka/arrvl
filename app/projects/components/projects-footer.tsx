'use client'

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { TransitionLink } from '../../components/transition-link'

gsap.registerPlugin(ScrollTrigger)

const ICON = 18

function InstagramIcon() {
  return (
    <svg width={ICON} height={ICON} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ display: 'block' }}>
      <rect x="3" y="3" width="18" height="18" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.2" cy="6.8" r="0.9" fill="currentColor" />
    </svg>
  )
}
function LinkedInIcon() {
  return (
    <svg width={ICON} height={ICON} viewBox="0 0 24 24" fill="currentColor" style={{ display: 'block' }}>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.063 2.063 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452z" />
    </svg>
  )
}
function GithubIcon() {
  return (
    <svg width={ICON} height={ICON} viewBox="0 0 24 24" fill="currentColor" style={{ display: 'block' }}>
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.4 3-.405 1.02.005 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  )
}

const NAV = [
  { label: 'Home', href: '/' },
  { label: 'Work', href: '/projects' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
]

const SOCIAL = [
  { label: 'Instagram', href: 'https://www.instagram.com/arrvlstudio', external: true, Icon: InstagramIcon },
  { label: 'LinkedIn', href: '/linkedin', external: false, Icon: LinkedInIcon },
  { label: 'GitHub', href: 'https://github.com/carsonliszka', external: true, Icon: GithubIcon },
]

const LEGAL = [
  { label: 'Privacy Policy', href: '/privacy-policy' },
  { label: 'Terms of Service', href: '/terms' },
  { label: 'Accessibility', href: '/accessibility' },
  { label: 'Contact', href: '/contact' },
]

const labelCls =
  'mb-5 font-[family-name:var(--font-geist)] text-[11px] font-medium uppercase tracking-[0.14em] text-white/40'

export function ProjectsFooter() {
  const ref = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      gsap.fromTo(
        '[data-foot-fade]',
        { opacity: 0, y: 22 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.06,
          duration: 0.7,
          ease: 'power2.out',
          scrollTrigger: { trigger: ref.current, start: 'top 88%' },
        }
      )
    },
    { scope: ref }
  )

  return (
    <footer ref={ref} className="border-t border-white/12 bg-[#0b0b0b] text-white">
      <div className="px-6 py-16 md:px-10 md:py-20 lg:px-16">
        <div className="grid grid-cols-12 gap-x-8 gap-y-12">
          <div data-foot-fade className="col-span-12 md:col-span-5" style={{ opacity: 0 }}>
            <div className="mb-5 flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img alt="ARRVL" src="/logos/arrvl_logo.png" className="h-12 w-auto" />
              <span className="font-[family-name:var(--font-geist)] text-[12px] font-semibold uppercase tracking-[0.14em] text-white">
                ARRVL<sup className="ml-0.5 text-white/60">®</sup>
              </span>
            </div>
            <p className="max-w-[300px] font-[family-name:var(--font-geist)] text-[13px] leading-[1.6] text-white/50">
              Artist-led creative studio. Brand, web, and motion, driven by
              curiosity, not formula.
            </p>
          </div>

          <div data-foot-fade className="col-span-6 md:col-span-3 md:col-start-7" style={{ opacity: 0 }}>
            <p className={labelCls}>Navigation</p>
            <ul className="space-y-3">
              {NAV.map(({ label, href }) => (
                <li key={label}>
                  <TransitionLink
                    href={href}
                    className="font-[family-name:var(--font-geist)] text-[15px] font-medium text-white/70 transition-colors hover:text-white"
                  >
                    {label}
                  </TransitionLink>
                </li>
              ))}
            </ul>
          </div>

          <div data-foot-fade className="col-span-6 md:col-span-3" style={{ opacity: 0 }}>
            <p className={labelCls}>Visit us</p>
            <p className="font-[family-name:var(--font-geist)] text-[14px] leading-[1.7] text-white/70">
              310 A St
              <br />
              San Diego, CA 92101
              <br />
              United States
            </p>
            <div className="mt-6 flex items-center gap-5">
              {SOCIAL.map(({ label, href, external, Icon }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  className="text-white/60 transition-colors hover:text-white"
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/12 px-6 py-5 font-[family-name:var(--font-geist)] text-[11px] uppercase tracking-[0.1em] text-white/45 md:px-10 lg:px-16">
        <span>© 2026 ARRVL®. All rights reserved.</span>
        <nav className="flex flex-wrap items-center gap-x-6 gap-y-2">
          {LEGAL.map(({ label, href }) => (
            <TransitionLink key={label} href={href} className="transition-colors hover:text-white">
              {label}
            </TransitionLink>
          ))}
        </nav>
        <span>Since twenty-eighteen</span>
      </div>
    </footer>
  )
}
