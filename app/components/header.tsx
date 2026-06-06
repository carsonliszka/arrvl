'use client'

import { useRef, useState, useCallback, useEffect, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { HoverText } from './hover-text'
import { MenuOverlay } from './menu-overlay'
import { TransitionLink } from './transition-link'

export function Header({
  showLogo = true,
  showCta = true,
  rightSlot,
}: {
  showLogo?: boolean
  showCta?: boolean
  rightSlot?: ReactNode
} = {}) {
  const headerRef = useRef<HTMLElement>(null)
  const line1Ref = useRef<HTMLSpanElement>(null)
  const line2Ref = useRef<HTMLSpanElement>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  useGSAP(
    () => {
      gsap.fromTo(
        headerRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.8, delay: 0.2, ease: 'power2.out' }
      )
    },
    { scope: headerRef }
  )

  useGSAP(
    () => {
      if (menuOpen) {
        gsap.to(line1Ref.current, {
          rotation: 45,
          y: 2.25,
          duration: 0.35,
          ease: 'power2.inOut',
        })
        gsap.to(line2Ref.current, {
          rotation: -45,
          y: -2.25,
          duration: 0.35,
          ease: 'power2.inOut',
        })
      } else {
        gsap.to(line1Ref.current, {
          rotation: 0,
          y: 0,
          duration: 0.35,
          ease: 'power2.inOut',
        })
        gsap.to(line2Ref.current, {
          rotation: 0,
          y: 0,
          duration: 0.35,
          ease: 'power2.inOut',
        })
      }
    },
    { dependencies: [menuOpen] }
  )

  const toggleMenu = useCallback(() => {
    setMenuOpen((prev) => !prev)
  }, [])

  return (
    <>
      <header
        ref={headerRef}
        className={`fixed top-0 left-0 right-0 z-[60] flex items-center justify-between px-6 md:px-10 lg:px-14 py-6 transition-[mix-blend-mode] duration-0 ${
          menuOpen ? '' : 'mix-blend-difference'
        }`}
        style={{ opacity: 0 }}
      >
        <button
          type="button"
          className="group flex items-center gap-2.5 text-[15px] font-body font-normal text-white cursor-pointer"
          aria-label="Toggle navigation menu"
          onClick={toggleMenu}
        >
          <span className="flex flex-col gap-[3px] w-[16px]">
            <span
              ref={line1Ref}
              className="block h-[1.5px] w-full bg-current origin-center will-change-transform"
            />
            <span
              ref={line2Ref}
              className="block h-[1.5px] w-full bg-current origin-center will-change-transform"
            />
          </span>
          <HoverText text={menuOpen ? 'Close' : 'Menu'} />
        </button>

        {showLogo && (
          <TransitionLink
            href="/"
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              alt="ARRVL"
              src="/logos/arrvl_logo.png"
              className="h-[58px] w-auto"
              style={{ imageRendering: 'auto' }}
            />
          </TransitionLink>
        )}

        {rightSlot ??
          (showCta && (
            <TransitionLink
              className="group inline-flex items-center gap-2.5 border border-current px-5 py-2.5 text-[14px] md:text-[15px] font-body font-medium text-white transition-colors duration-300 hover:bg-white/10"
              href="/contact"
              aria-label="Start a project"
            >
              <HoverText text="Let's chat" className="leading-[1.2em]" />
              <span
                aria-hidden="true"
                className="inline-block text-[13px] leading-none transition-transform duration-500 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              >
                ↗
              </span>
            </TransitionLink>
          ))}
      </header>

      {mounted &&
        createPortal(
          <MenuOverlay isOpen={menuOpen} onClose={toggleMenu} />,
          document.body
        )}
    </>
  )
}
