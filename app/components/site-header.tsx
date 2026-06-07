'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { TransitionLink } from './transition-link'
import { HoverText } from './hover-text'
import { CtaArrow } from './cta'
import { MenuOverlay } from './menu-overlay'

const geist = 'font-[family-name:var(--font-geist)]'

const NAV = [
  { label: 'About', href: '/about' },
  { label: 'Projects', href: '/projects' },
  { label: 'Contact', href: '/contact' },
]

// Top nav, matched to the home hero. Sits absolute at the top of the page
// (scrolls away like the hero, so cream text never lands on the mid-page light panels).
// Inline links on desktop; a hamburger -> MenuOverlay on mobile.
export function SiteHeader({ showCta = true }: { showCta?: boolean }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  return (
    <>
      <header
        className="absolute inset-x-0 top-0 z-30 flex items-center justify-between px-6 py-6 transition-opacity duration-700 md:px-10 lg:px-12"
        style={{ opacity: mounted ? 1 : 0 }}
      >
        <div className="flex items-center gap-3">
          <TransitionLink href="/" aria-label="ARRVL home" className="flex items-center gap-2.5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logos/arrvl_logo.png" alt="ARRVL" className="h-10 w-auto md:h-12" />
            <span className={`text-[16px] font-semibold uppercase tracking-[-0.01em] text-cream ${geist}`}>
              ARRVL<span className="align-top text-[0.6em] font-medium text-cream/70">®</span>
            </span>
          </TransitionLink>
          <span className="hidden h-4 w-px bg-cream/20 md:block" />
          <span className={`hidden max-w-[180px] text-[11px] leading-[1.25] text-cream/50 md:block md:text-[12px] ${geist}`}>
            Motion-led <span className="font-medium text-cream/85">design &amp; dev</span> studio
          </span>
        </div>

        <div className="flex items-center gap-5 md:gap-7">
          <div className={`hidden items-center gap-4 text-[12px] uppercase tracking-[0.12em] text-cream md:flex ${geist}`}>
            {NAV.map((n, i) => (
              <span key={n.href} className="flex items-center gap-4">
                <TransitionLink href={n.href} className="group">
                  <HoverText text={n.label} />
                </TransitionLink>
                {i < NAV.length - 1 && <span className="text-cream/25">/</span>}
              </span>
            ))}
          </div>

          {showCta && (
            <TransitionLink
              href="/contact"
              className={`group hidden items-center gap-2 bg-cream px-4 py-2 text-[11px] font-medium uppercase tracking-[0.12em] text-[#0b0b0b] transition-colors duration-300 hover:bg-cream/85 md:inline-flex ${geist}`}
            >
              <HoverText text="Start a project" />
              <CtaArrow size={16} />
            </TransitionLink>
          )}

          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            className="group flex flex-col items-center gap-[5px] p-1 md:hidden"
          >
            <span className="block h-[1.5px] w-6 bg-cream/70 transition-colors duration-300 group-hover:bg-cream" />
            <span className="block h-[1.5px] w-6 bg-cream/70 transition-colors duration-300 group-hover:bg-cream" />
          </button>
        </div>
      </header>

      {mounted &&
        createPortal(
          <MenuOverlay isOpen={menuOpen} onClose={() => setMenuOpen(false)} />,
          document.body
        )}
    </>
  )
}
