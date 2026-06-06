'use client'

import { useState, useEffect } from 'react'
import { TransitionLink } from './transition-link'

export function CookieBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const consent = localStorage.getItem('cookie-consent')
    if (!consent) {
      const timer = setTimeout(() => setVisible(true), 3000)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleConsent = (value: 'allow' | 'deny') => {
    localStorage.setItem('cookie-consent', value)
    setVisible(false)
  }

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 flex flex-col gap-3 border-t border-white/10 bg-[#0b0b0b] px-6 py-4 font-[family-name:var(--font-geist)] transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] sm:flex-row sm:items-center sm:justify-between md:px-10 lg:px-14"
      style={{
        transform: visible ? 'translateY(0%)' : 'translateY(100%)',
      }}
    >
      <p className="text-[13px] leading-[1.5] text-white/55">
        We use cookies to measure traffic and improve how this site works. See our{' '}
        <TransitionLink
          href="/privacy-policy"
          className="text-white underline decoration-white/40 underline-offset-[3px] transition-colors hover:decoration-white"
        >
          Privacy Policy
        </TransitionLink>
        .
      </p>
      <div className="flex shrink-0 gap-3">
        <button
          onClick={() => handleConsent('deny')}
          className="cursor-pointer border border-white/15 px-4 py-2 text-[11px] uppercase tracking-[0.14em] text-white/55 transition-colors hover:text-white"
        >
          Decline
        </button>
        <button
          onClick={() => handleConsent('allow')}
          className="cursor-pointer border border-white/15 bg-white/[0.06] px-4 py-2 text-[11px] uppercase tracking-[0.14em] text-white transition-colors hover:bg-white/[0.12]"
        >
          Accept
        </button>
      </div>
    </div>
  )
}
