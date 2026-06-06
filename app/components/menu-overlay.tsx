'use client'

import { useRef, useEffect, useCallback } from 'react'
import gsap from 'gsap'
import { TransitionLink } from './transition-link'

const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Projects', href: '/projects' },
  { label: 'Contact', href: '/contact' },
]

interface MenuOverlayProps {
  isOpen: boolean
  onClose: () => void
}

export function MenuOverlay({ isOpen, onClose }: MenuOverlayProps) {
  const panelRef = useRef<HTMLDivElement>(null)
  const tlRef = useRef<gsap.core.Timeline | null>(null)
  const hasBuilt = useRef(false)

  const buildTimeline = useCallback(() => {
    if (hasBuilt.current || !panelRef.current) return
    hasBuilt.current = true

    const panel = panelRef.current
    const links = panel.querySelectorAll('[data-menu-link]')
    const contact = panel.querySelector('[data-menu-contact]')

    const tl = gsap.timeline({ paused: true })

    tl.to(panel, {
      clipPath: 'inset(0% 0% 0% 0%)',
      duration: 0.8,
      ease: 'power4.inOut',
    })

    tl.fromTo(
      links,
      { y: 80, opacity: 0, filter: 'blur(10px)' },
      {
        y: 0,
        opacity: 1,
        filter: 'blur(0px)',
        stagger: 0.07,
        duration: 0.6,
        ease: 'power3.out',
      },
      '-=0.45'
    )

    if (contact) {
      tl.fromTo(
        contact,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.45, ease: 'power2.out' },
        '-=0.2'
      )
    }

    tlRef.current = tl
  }, [])

  useEffect(() => {
    buildTimeline()

    if (!tlRef.current) return
    if (isOpen) {
      tlRef.current.timeScale(1).play()
    } else {
      tlRef.current.timeScale(1.4).reverse()
    }
  }, [isOpen, buildTimeline])

  return (
    <div
      ref={panelRef}
      className="fixed inset-0 z-[55] flex flex-col overflow-hidden bg-[#0b0b0b] font-[family-name:var(--font-geist)]"
      style={{ clipPath: 'inset(0% 0% 100% 0%)' }}
    >
      <div className="relative z-10 flex flex-1 flex-col items-start justify-center px-10 lg:px-20">
        <nav className="flex flex-col gap-1">
          {NAV_LINKS.map((link) => (
            <TransitionLink
              key={link.href}
              href={link.href}
              data-menu-link
              className="text-[clamp(42px,7vw,80px)] font-semibold uppercase leading-[1.1] tracking-[-0.04em] text-white/85 transition-colors duration-200 hover:text-white"
              style={{ opacity: 0 }}
              onClick={onClose}
            >
              {link.label}
            </TransitionLink>
          ))}
        </nav>

        <div
          data-menu-contact
          className="mt-14 flex flex-col gap-2"
          style={{ opacity: 0 }}
        >
          <p className="text-[11px] uppercase tracking-[0.15em] text-white/40">
            Contact us
          </p>
          <a
            href="mailto:hello@arrvl.studio"
            className="text-[15px] text-white/70 transition-colors duration-200 hover:text-white"
          >
            hello@arrvl.studio
          </a>
        </div>
      </div>
    </div>
  )
}
