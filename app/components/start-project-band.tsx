'use client'

import { useState, useRef, useEffect, type FormEvent, type ReactNode } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { TransitionLink } from './transition-link'
import { HoverText } from './hover-text'
import { stripEmoji } from '../lib/strip-emoji'

const geist = 'font-[family-name:var(--font-geist)]'

const CRM_ENDPOINT =
  process.env.NEXT_PUBLIC_CRM_ENDPOINT ??
  'https://crm-phi-gray.vercel.app/api/submissions'
const SERVICE_OPTIONS = [
  'Website Design & Development',
  'Brand Identity',
  'Web Applications',
  'Motion & Animation',
  'Creative Direction',
  'Ongoing Support',
  'Just exploring',
]

const CARD_IMAGE = '/showreel-poster.jpg'
const MAPS_URL = 'https://maps.google.com/?q=310+A+St+San+Diego+CA+92101'

const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())

const inputCls =
  'w-full border border-cream/15 bg-transparent px-5 py-4 text-[15px] text-cream placeholder:text-cream/30 focus:border-cream/45 focus:outline-none transition-colors duration-300'
const ERR = 'rgba(255,116,102,0.75)'

function Field({ label, error, children }: { label: string; error?: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className={`block text-right text-[10px] uppercase tracking-[0.22em] text-cream/40 mb-2.5 ${geist}`}>
        {label}
      </span>
      {children}
      <span
        className="mt-2 block text-[11px] tracking-[0.04em]"
        style={{ color: ERR, opacity: error ? 1 : 0, minHeight: '1em' }}
      >
        {error || ' '}
      </span>
    </label>
  )
}

function Toggle({ view, setView }: { view: 'form' | 'details'; setView: (v: 'form' | 'details') => void }) {
  const formRef = useRef<HTMLButtonElement>(null)
  const detailsRef = useRef<HTMLButtonElement>(null)
  const [ind, setInd] = useState<{ left: number; width: number } | null>(null)

  useEffect(() => {
    const measure = () => {
      const el = view === 'form' ? formRef.current : detailsRef.current
      if (el) setInd({ left: el.offsetLeft, width: el.offsetWidth })
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [view])

  const tabCls = (active: boolean) =>
    `pb-4 text-[11px] font-medium uppercase tracking-[0.24em] transition-colors duration-300 ${active ? 'text-cream' : 'text-cream/40 hover:text-cream/70'} ${geist}`

  return (
    <div className="relative border-b border-cream/15">
      <div className="flex items-center gap-12">
        <button ref={formRef} type="button" onClick={() => setView('form')} className={tabCls(view === 'form')}>
          Form
        </button>
        <button ref={detailsRef} type="button" onClick={() => setView('details')} className={tabCls(view === 'details')}>
          Details
        </button>
      </div>
      <span
        aria-hidden
        className="absolute bottom-[-1px] h-[1.5px] bg-cream transition-[left,width,opacity] duration-500 ease-[cubic-bezier(0.76,0,0.24,1)]"
        style={{ left: ind?.left ?? 0, width: ind?.width ?? 0, opacity: ind ? 1 : 0 }}
      />
    </div>
  )
}

function DetailRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex gap-5">
      <span aria-hidden className="mt-[7px] h-px w-3 shrink-0 bg-cream/30" />
      <div>
        <p className={`text-[10px] font-medium uppercase tracking-[0.2em] text-cream/40 ${geist}`}>{label}</p>
        <div className="mt-2">{children}</div>
      </div>
    </div>
  )
}

const SOCIALS = [
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/arrvlstudio',
    path: 'M3 3h18v18H3zM12 8.2A3.8 3.8 0 1 0 12 15.8 3.8 3.8 0 0 0 12 8.2z',
    extra: <circle cx="17.4" cy="6.6" r="1" fill="currentColor" />,
  },
  {
    label: 'LinkedIn',
    href: '/linkedin',
    path: 'M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56z',
    fill: true,
  },
  {
    label: 'GitHub',
    href: 'https://github.com/carsonliszka',
    path: 'M12 .3a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2c-3.3.7-4-1.6-4-1.6-.6-1.4-1.3-1.8-1.3-1.8-1.1-.7.1-.7.1-.7 1.2 0 1.8 1.2 1.8 1.2 1.1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.8-1.6-2.7-.3-5.5-1.3-5.5-5.9 0-1.3.5-2.4 1.2-3.2 0-.3-.5-1.5.2-3.2 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0C17 4.6 18 4.9 18 4.9c.7 1.7.2 2.9.1 3.2.8.8 1.2 1.9 1.2 3.2 0 4.6-2.8 5.6-5.5 5.9.5.3.8 1 .8 2.2v3c0 .3.2.7.8.6A12 12 0 0 0 12 .3z',
    fill: true,
  },
]

function Details() {
  const link = `text-[15px] text-cream ${geist}`
  return (
    <div className="mt-10 flex flex-col gap-9">
      <DetailRow label="New business">
        <a href="mailto:projects@arrvl.studio" className={`group inline-block ${link}`}>
          <HoverText text="projects@arrvl.studio" />
        </a>
      </DetailRow>
      <DetailRow label="Telephone">
        <p className={`text-[15px] text-cream ${geist}`}>(619) 514-7174</p>
      </DetailRow>
      <DetailRow label="Location">
        <p className={`text-[15px] leading-[1.5] text-cream/80 ${geist}`}>
          310 A St
          <br />
          San Diego, CA 92101
          <br />
          United States
        </p>
        <a
          href={MAPS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className={`group mt-4 inline-flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.14em] text-cream ${geist}`}
        >
          <span className="text-cream/40">↳</span>
          <HoverText text="Get directions" />
        </a>
      </DetailRow>
      <DetailRow label="Join us">
        <a href="mailto:hiring@arrvl.studio" className={`group inline-block ${link}`}>
          <HoverText text="hiring@arrvl.studio" />
        </a>
      </DetailRow>
      <DetailRow label="Follow ARRVL">
        <div className="flex items-center gap-6">
          {SOCIALS.map((s) => {
            const external = s.href.startsWith('http')
            return (
              <a
                key={s.label}
                href={s.href}
                aria-label={s.label}
                {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                className="text-cream/60 transition-colors duration-300 hover:text-cream"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill={s.fill ? 'currentColor' : 'none'} stroke={s.fill ? 'none' : 'currentColor'} strokeWidth="1.5">
                  <path d={s.path} />
                  {s.extra}
                </svg>
              </a>
            )
          })}
        </div>
      </DetailRow>
    </div>
  )
}

export function StartProjectBand() {
  const [view, setView] = useState<'form' | 'details'>('form')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [service, setService] = useState('')
  const [honeypot, setHoneypot] = useState('')
  const [touched, setTouched] = useState(false)
  const [sending, setSending] = useState(false)
  const [sendError, setSendError] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      if (panelRef.current)
        gsap.fromTo(panelRef.current, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out' })
    },
    { dependencies: [view, submitted], scope: panelRef }
  )

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (sending) return
    const fd = new FormData(e.currentTarget)
    if (String(fd.get('contact_ref_code') ?? '')) return
    const nm = stripEmoji(String(fd.get('fullName') ?? '')).trim()
    const em = stripEmoji(String(fd.get('email') ?? '')).trim()
    const sv = String(fd.get('service') ?? '')
    setName(nm)
    setEmail(em)
    setService(sv)
    if (!(nm.length > 0 && isEmail(em) && sv.length > 0)) {
      setTouched(true)
      return
    }

    setSending(true)
    setSendError(false)
    try {
      const res = await fetch(CRM_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: nm.slice(0, 200),
          email: em.slice(0, 320),
          phone: '',
          company: '',
          message: '—',
          fields: [
            { label: 'Services', value: sv },
            { label: 'Origin', value: 'Homepage quick start' },
          ],
          source: 'dev',
          contact_ref_code: '',
        }),
      })
      if (!res.ok) throw new Error('bad status')
      setSubmitted(true)
    } catch {
      setSendError(true)
    } finally {
      setSending(false)
    }
  }

  return (
    <section className="relative overflow-hidden border-t border-cream/12 bg-[#0b0b0b] text-cream">
      <span
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 bg-cream/12 lg:block"
      />

      <div className="mx-auto grid max-w-[1600px] grid-cols-1 gap-16 px-6 py-24 md:px-10 md:py-32 lg:grid-cols-2 lg:gap-0 lg:px-16">
        <div className="lg:pr-16">
          <div className="relative h-full min-h-[520px] overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={CARD_IMAGE} alt="" className="absolute inset-0 h-full w-full object-cover" />
            <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/55 to-transparent" />

            <div className="absolute left-5 top-5 flex items-center gap-2.5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logos/arrvl_logo.png" alt="ARRVL" className="h-6 w-auto" />
              <span className={`text-[13px] font-semibold uppercase tracking-[0.12em] text-cream/90 ${geist}`}>
                ARRVL<span className="align-top text-[0.6em] font-medium text-cream/60">®</span>
              </span>
            </div>

            <div className="absolute inset-x-5 bottom-5 bg-white px-6 py-5 text-right text-[#0b0b0b]">
              <p className={`text-balance text-[14px] leading-[1.45] ${geist}`}>
                You collaborate directly with the people who think, design, and build from day one to launch.
              </p>
              <p className={`mt-3 text-[10px] uppercase tracking-[0.18em] text-[#0b0b0b]/50 ${geist}`}>ARRVL Studio</p>
            </div>
          </div>
        </div>

        <div className="lg:pl-16">
          <h2
            className={`font-semibold uppercase leading-[0.86] tracking-[-0.04em] text-cream ${geist}`}
            style={{ fontSize: 'clamp(40px,5.5vw,86px)' }}
          >
            Start the
            <br />
            Conversation.
          </h2>

          <p className={`mt-7 max-w-[460px] text-[12px] font-medium uppercase leading-[1.65] tracking-[0.02em] text-cream/55 ${geist}`}>
            Whether you have it all figured out or just an idea, we are here to help shape it.{' '}
            <span className="text-cream">Just a clear next step.</span>
          </p>

          <div className="mt-12 max-w-[620px]">
            <Toggle view={view} setView={setView} />

            <div ref={panelRef}>
              {view === 'form' ? (
              submitted ? (
                <div className="mt-12">
                  <p
                    className={`font-semibold uppercase leading-[0.95] tracking-[-0.02em] text-cream ${geist}`}
                    style={{ fontSize: 'clamp(26px,2.6vw,40px)' }}
                  >
                    Thank you, {name.split(' ')[0] || 'there'}.
                  </p>
                  <p className={`mt-4 max-w-[440px] text-[14px] leading-[1.6] text-cream/55 ${geist}`}>
                    We&rsquo;ll be in touch shortly at <span className="text-cream">{email}</span>.
                  </p>
                </div>
              ) : (
              <form onSubmit={submit} className="mt-10" noValidate>
                <input
                  type="text"
                  name="contact_ref_code"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                  className="absolute left-[-9999px] h-0 w-0 opacity-0"
                />

                <Field label="Full name" error={touched && !name.trim() ? 'Please enter your name' : ''}>
                  <input name="fullName" value={name} onChange={(e) => setName(stripEmoji(e.target.value))} placeholder="Full Name" className={inputCls} />
                </Field>

                <Field label="Your email address" error={touched && !isEmail(email) ? 'Please enter a valid email' : ''}>
                  <input
                    type="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(stripEmoji(e.target.value))}
                    placeholder="example@email.com"
                    className={inputCls}
                  />
                </Field>

                <Field label="What are you looking for?" error={touched && !service ? 'Please pick one' : ''}>
                  <div className="relative">
                    <select
                      name="service"
                      value={service}
                      onChange={(e) => setService(e.target.value)}
                      className={`${inputCls} cursor-pointer appearance-none pr-10 ${service ? 'text-cream' : 'text-cream/40'}`}
                    >
                      <option value="" disabled>
                        Select an option
                      </option>
                      {SERVICE_OPTIONS.map((s) => (
                        <option key={s} value={s} className="bg-[#0b0b0b] text-cream">
                          {s}
                        </option>
                      ))}
                    </select>
                    <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[10px] text-cream/40">▼</span>
                  </div>
                </Field>

                <div className="mt-8 flex flex-wrap items-center gap-6">
                  <button
                    type="submit"
                    disabled={sending}
                    className={`group inline-flex items-center justify-center bg-cream px-8 py-4 text-[12px] font-medium uppercase tracking-[0.12em] text-[#0b0b0b] transition-colors duration-300 hover:bg-cream/85 disabled:opacity-60 ${geist}`}
                  >
                    <HoverText text={sending ? 'Sending' : 'Submit'} />
                  </button>
                  <p className={`max-w-[240px] text-[11px] leading-[1.5] text-cream/40 ${geist}`}>
                    By submitting, you agree to our{' '}
                    <TransitionLink href="/terms" className="text-cream/70 underline">
                      Terms
                    </TransitionLink>{' '}
                    and{' '}
                    <TransitionLink href="/privacy-policy" className="text-cream/70 underline">
                      Privacy Policy
                    </TransitionLink>
                    .
                  </p>
                </div>

                {sendError && (
                  <p className="mt-5 text-[12px]" style={{ color: ERR }}>
                    Something went wrong. Please try again, or email{' '}
                    <a href="mailto:projects@arrvl.studio" className="underline">
                      projects@arrvl.studio
                    </a>
                    .
                  </p>
                )}
              </form>
              )
            ) : (
              <Details />
            )}
            </div>
          </div>

          <p className={`mt-10 text-[11px] font-medium uppercase tracking-[0.14em] text-cream/40 ${geist}`}>
            We usually respond to all inquiries within just a couple hours.
          </p>
        </div>
      </div>
    </section>
  )
}
