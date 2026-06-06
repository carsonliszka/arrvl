'use client'

import { useEffect, useRef, useState, type MouseEvent as ReactMouseEvent, type ReactNode } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import {
  AsYouType,
  getCountries,
  getCountryCallingCode,
  validatePhoneNumberLength,
  type CountryCode,
} from 'libphonenumber-js'
import { Cta } from '../../components/cta'

const STEPS = [
  { n: '01', label: 'Introduction' },
  { n: '02', label: 'Project Type' },
  { n: '03', label: 'Details' },
  { n: '04', label: 'Review' },
] as const

const HEADINGS: Array<{ a: string; b: string; sub: ReactNode }> = [
  { a: 'A short conversation', b: 'with a clear next step.', sub: 'Start the conversation and we’ll take it from there.' },
  { a: 'What are we', b: 'building?', sub: 'Pick what you’re looking for and we’ll guide the rest.' },
  { a: 'Share the', b: 'vision.', sub: 'A few details help us understand the project clearly.' },
  { a: 'Ready when', b: 'you are.', sub: <>Take a quick look. Click any row to edit. We usually respond to most inquiries within <strong className="font-semibold text-cream/70">two business hours.</strong></> },
]

const SERVICES = [
  { n: '01', glyph: '01', title: 'Website Design & Development', desc: 'Custom websites, landing pages, and full site builds.', items: ['Landing Pages', 'Marketing Sites', 'CMS & Headless', 'Responsive Build'] },
  { n: '02', glyph: '02', title: 'Brand Identity', desc: 'Logo, type, color, and the system that ties them together.', items: ['Logo & Wordmark', 'Type & Color', 'Brand Guidelines', 'Visual System'] },
  { n: '03', glyph: '03', title: 'Web Applications', desc: 'Internal tools, dashboards, and product surfaces.', items: ['Dashboards', 'Internal Tools', 'Product UI', 'Web Platforms'] },
  { n: '04', glyph: '04', title: 'Motion & Animation', desc: 'Motion design, transitions, and custom animations.', items: ['WebGL & Shaders', 'UI Transitions', 'Motion Design', 'Scroll Animation'] },
  { n: '05', glyph: '05', title: 'Creative Direction', desc: 'Brand-level guidance and art direction across surfaces.', items: ['Art Direction', 'Concept & Strategy', 'Visual Language', 'Campaign Direction'] },
  { n: '06', glyph: '06', title: 'Ongoing Support', desc: 'Hosting, fixes, content updates, and quarterly health checks.', items: ['Hosting & Uptime', 'Content Updates', 'Fixes & Tuning', 'Quarterly Reviews'] },
  { n: '07', glyph: '07', title: 'Just exploring', desc: 'Not sure where to start? Let’s have a conversation about what you need.', items: ['Discovery Call', 'Scoping', 'Recommendations', 'No Commitment'] },
]

const TIMELINES = [
  'Within 2 – 4 weeks',
  '1 – 2 months',
  '2 – 4 months',
  'Flexible / not sure',
]

const INVESTMENTS = [
  'Under $10K',
  '$10K – 25K',
  '$25K – 50K',
  '$50K – 100K',
  '$100K+',
  'Not sure yet',
]

interface Country {
  iso: string
  flag: string
  name: string
  dial: string
}

const flagOf = (iso: string) =>
  iso.toUpperCase().replace(/./g, (c) => String.fromCodePoint(127397 + c.charCodeAt(0)))

const regionNames =
  typeof Intl !== 'undefined' && 'DisplayNames' in Intl
    ? new Intl.DisplayNames(['en'], { type: 'region' })
    : null

const COUNTRIES: Country[] = getCountries()
  .map((iso) => ({
    iso,
    flag: flagOf(iso),
    name: regionNames?.of(iso) ?? iso,
    dial: `+${getCountryCallingCode(iso)}`,
  }))
  .sort((a, b) => a.name.localeCompare(b.name))

const COUNTRY_MAP = new Map(COUNTRIES.map((c) => [c.iso, c]))
const countryOf = (iso: string) => COUNTRY_MAP.get(iso) ?? COUNTRIES[0]

interface FormState {
  fullName: string
  email: string
  phoneCountry: string
  phone: string
  company: string
  services: string[]
  description: string
  timeline: string
  investment: string
}

const EMPTY: FormState = {
  fullName: '',
  email: '',
  phoneCountry: 'US',
  phone: '',
  company: '',
  services: [],
  description: '',
  timeline: '',
  investment: '',
}

const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())

const formatNational = (v: string, iso: string) =>
  new AsYouType(iso as CountryCode).input(v)

const phoneIsValid = (phone: string, iso: string) => {
  const ayt = new AsYouType(iso as CountryCode)
  ayt.input(phone)
  return ayt.getNumber()?.isValid() ?? false
}

const phoneInternational = (phone: string, iso: string) => {
  const ayt = new AsYouType(iso as CountryCode)
  ayt.input(phone)
  return ayt.getNumber()?.formatInternational() ?? `${countryOf(iso).dial} ${phone}`
}

// CRM submission endpoint. Override per-environment with NEXT_PUBLIC_CRM_ENDPOINT
// (e.g. when the CRM moves to a custom domain).
const CRM_ENDPOINT =
  process.env.NEXT_PUBLIC_CRM_ENDPOINT ??
  'https://crm-phi-gray.vercel.app/api/submissions'

// The CRM stores a single message field, so fold the structured answers
// (services / timeline / investment) into it. Lengths are clamped to the CRM's
// field caps so a long answer is never silently rejected.
function crmPayload(d: FormState) {
  const meta = [
    d.services.length ? `Services: ${d.services.join(', ')}` : '',
    d.timeline ? `Timeline: ${d.timeline}` : '',
    d.investment ? `Investment: ${d.investment}` : '',
  ]
    .filter(Boolean)
    .join('\n')
  const message = (meta ? `${meta}\n\n${d.description}` : d.description).slice(0, 5000)
  return {
    name: d.fullName.slice(0, 200),
    email: d.email.slice(0, 320),
    phone: d.phone ? phoneInternational(d.phone, d.phoneCountry).slice(0, 40) : '',
    company: d.company.slice(0, 200),
    message,
    source: 'dev',
    website: '',
  }
}

const labelCls =
  'block text-[10px] uppercase tracking-[0.28em] text-cream/45 font-mono mb-3'
const inputCls =
  'w-full bg-transparent border border-cream/15 px-4 py-3.5 text-[15px] text-cream font-body placeholder:text-cream-dim/70 focus:border-cream/50 focus:outline-none transition-colors duration-300'

const ERR = 'rgba(255,116,102,0.75)'

function Field({
  label,
  required,
  error,
  children,
}: {
  label: string
  required?: boolean
  error?: string
  children: React.ReactNode
}) {
  return (
    <label className="block">
      <span className={labelCls}>
        {label}
        {required && <span className="text-cream/40"> *</span>}
      </span>
      {children}
      <span
        className="block mt-2 text-[11px] font-mono tracking-[0.04em] transition-opacity duration-200"
        style={{ color: ERR, opacity: error ? 1 : 0, minHeight: '1em' }}
      >
        {error || ' '}
      </span>
    </label>
  )
}

export function ContactForm() {
  const [step, setStep] = useState(0)
  const [maxReached, setMaxReached] = useState(0)
  const [data, setData] = useState<FormState>(EMPTY)
  const [submitted, setSubmitted] = useState(false)
  const [sendError, setSendError] = useState(false)
  const [sending, setSending] = useState(false)
  const [focusField, setFocusField] = useState<string | null>(null)
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  const markTouched = (f: string) => setTouched((t) => ({ ...t, [f]: true }))
  const touchAll = (fields: string[]) =>
    setTouched((t) => ({ ...t, ...Object.fromEntries(fields.map((f) => [f, true])) }))

  const set = <K extends keyof FormState>(k: K, v: FormState[K]) =>
    setData((d) => ({
      ...d,
      [k]: k === 'phone' ? (formatNational(v as string, d.phoneCountry) as FormState[K]) : v,
    }))

  const setCountry = (iso: string) =>
    setData((d) => ({ ...d, phoneCountry: iso, phone: formatNational(d.phone, iso) }))

  const setIntlPhone = (iso: string, national: string) =>
    setData((d) => ({ ...d, phoneCountry: iso, phone: formatNational(national, iso) }))

  const toggleService = (title: string) =>
    setData((d) => ({
      ...d,
      services: d.services.includes(title)
        ? d.services.filter((s) => s !== title)
        : [...d.services, title],
    }))

  const phoneOk = !data.phone || phoneIsValid(data.phone, data.phoneCountry)

  const stepValid = (i: number) => {
    if (i === 0)
      return data.fullName.trim().length > 0 && isEmail(data.email) && phoneOk
    if (i === 1) return data.services.length > 0
    if (i === 2)
      return (
        data.description.trim().length > 0 &&
        data.timeline.length > 0 &&
        data.investment.length > 0
      )
    return true
  }

  const STEP_FIELDS: Record<number, string[]> = {
    0: ['fullName', 'email', 'phone'],
    2: ['description', 'timeline', 'investment'],
  }

  const canContinue = stepValid(step)
  const isLast = step === STEPS.length - 1

  const submit = async () => {
    if (sending) return
    setSending(true)
    setSendError(false)
    try {
      const res = await fetch(CRM_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(crmPayload(data)),
      })
      if (!res.ok) throw new Error('bad status')
      setSubmitted(true)
    } catch {
      // The endpoint always 200s on its own rejections, so this is a genuine
      // network failure — keep the user on the form so the lead isn't lost.
      setSendError(true)
    } finally {
      setSending(false)
    }
  }

  const next = () => {
    if (!canContinue) {
      if (STEP_FIELDS[step]) touchAll(STEP_FIELDS[step])
      return
    }
    if (isLast) {
      void submit()
      return
    }
    const ns = Math.min(STEPS.length - 1, step + 1)
    setStep(ns)
    setMaxReached((m) => Math.max(m, ns))
  }
  const back = () => setStep((s) => Math.max(0, s - 1))

  const jumpTo = (i: number, field?: string) => {
    setStep(i)
    setFocusField(field ?? null)
  }

  const panelRef = useRef<HTMLDivElement>(null)
  useGSAP(
    () => {
      gsap.fromTo(
        '[data-step-anim]',
        { opacity: 0, y: 22 },
        { opacity: 1, y: 0, duration: 0.7, stagger: 0.06, ease: 'power3.out' }
      )
    },
    { dependencies: [step, submitted], scope: panelRef }
  )

  useGSAP(
    () => {
      if (!focusField) return
      const el = document.querySelector<HTMLElement>(`[data-field="${focusField}"]`)
      el?.focus()
      setFocusField(null)
    },
    { dependencies: [step] }
  )

  const head = HEADINGS[step]

  return (
    <section
      ref={panelRef}
      className="relative min-h-[100dvh] flex flex-col px-6 md:px-10 lg:px-14 pt-24 md:pt-28 pb-10"
    >
      <div className="w-full max-w-[1280px] mx-auto flex-1 flex flex-col">
        {submitted ? (
          <SubmittedView data={data} />
        ) : (
          <>
            <div
              data-step-anim
              className="mb-6 md:mb-9 flex items-start justify-between gap-6"
            >
              <p className="text-[13px] md:text-[14px] leading-[1.6] text-cream/45 font-body">
                Already know what you need? Email us at{' '}
                <a
                  href="mailto:projects@arrvl.studio"
                  className="group relative inline-flex items-center gap-1 text-cream"
                >
                  <span className="relative">
                    projects@arrvl.studio
                    <span className="absolute left-0 -bottom-0.5 h-px w-full bg-cream/40 group-hover:bg-cream transition-colors duration-300" />
                  </span>
                  <span
                    aria-hidden
                    className="text-[11px] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  >
                    {'↗'}
                  </span>
                </a>
                {' '}or walk us through it below.
              </p>

              {step > 0 && (
                <button
                  type="button"
                  onClick={back}
                  className="group shrink-0 inline-flex items-center gap-2 text-[11px] md:text-[12px] font-mono uppercase tracking-[0.2em] text-cream-dim hover:text-cream transition-colors duration-300 pt-0.5"
                >
                  <span
                    aria-hidden
                    className="text-[14px] leading-none transition-transform duration-300 group-hover:-translate-x-1"
                  >
                    {'←'}
                  </span>
                  Back
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-5 mb-7 md:mb-9">
              {STEPS.map((s, i) => {
                const active = i === step
                const reached = i <= maxReached
                const done = i < step
                return (
                  <button
                    key={s.n}
                    type="button"
                    onClick={() => reached && setStep(i)}
                    disabled={!reached}
                    className={`group text-left ${reached && !active ? 'cursor-pointer' : ''}`}
                  >
                    <span className="relative block h-px w-full bg-cream/12 overflow-hidden mb-3">
                      <span
                        className="absolute inset-y-0 left-0 bg-cream transition-[width] duration-700 ease-[cubic-bezier(0.19,1,0.22,1)]"
                        style={{ width: done || active ? '100%' : '0%' }}
                      />
                    </span>
                    <span
                      className={`flex items-baseline gap-2 font-mono text-[11px] tracking-[0.18em] transition-colors duration-500 ${
                        active ? 'text-cream' : done ? 'text-cream/60' : 'text-cream/40'
                      }`}
                    >
                      <span className="tabular-nums">{s.n}</span>
                      <span className="uppercase">{s.label}</span>
                    </span>
                  </button>
                )
              })}
            </div>

            {step === 1 ? (
              <div className="flex flex-col flex-1">
                <div
                  data-step-anim
                  className="mb-6 md:mb-8 flex flex-wrap items-end justify-between gap-x-10 gap-y-3"
                >
                  <h1
                    className="font-heading font-medium tracking-[-0.03em] leading-[1]"
                    style={{ fontSize: 'clamp(32px, 3.2vw, 52px)' }}
                  >
                    <span className="text-cream/55">{head.a} </span>
                    <span className="text-cream font-bold tracking-[0.01em]">{head.b}</span>
                  </h1>
                  <p className="text-[13px] md:text-[14px] leading-[1.6] text-cream/45 font-body whitespace-nowrap">
                    Pick what you’re looking for and{' '}
                    <span className="text-white font-bold">we’ll guide the rest.</span>
                  </p>
                </div>
                <div data-step-anim>
                  <StepType selected={data.services} toggle={toggleService} />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-y-12 gap-x-10 flex-1">
                <div className="lg:col-span-5">
                  <span
                    data-step-anim
                    className="inline-block rounded-full border border-cream/20 px-4 py-1.5 text-[10px] uppercase tracking-[0.3em] font-mono text-cream-dim mb-8"
                    style={{ borderRadius: '9999px' }}
                  >
                    {STEPS[step].n} {'—'} {STEPS[step].label}
                  </span>
                  <h1
                    data-step-anim
                    className="font-heading font-medium tracking-[-0.03em] leading-[0.98]"
                    style={{ fontSize: 'clamp(36px, 4.4vw, 68px)' }}
                  >
                    <span className="block text-cream/55">{head.a}</span>
                    <span className="block text-cream font-bold tracking-[0.01em]">{head.b}</span>
                  </h1>
                  <p
                    data-step-anim
                    className="mt-7 text-[14px] md:text-[15px] leading-[1.6] text-cream/45 font-body max-w-[360px]"
                  >
                    {head.sub}
                  </p>
                </div>

                <div className="lg:col-span-7 lg:pl-6" data-step-anim>
                  {step === 0 && (
                    <StepIntro
                      data={data}
                      set={set}
                      touched={touched}
                      markTouched={markTouched}
                      setCountry={setCountry}
                      setIntlPhone={setIntlPhone}
                    />
                  )}
                  {step === 2 && (
                    <StepDetails data={data} set={set} touched={touched} markTouched={markTouched} />
                  )}
                  {step === 3 && <StepReview data={data} jumpTo={jumpTo} />}
                  {isLast && (
                    <div className="mt-8 flex justify-end">
                      <button
                        type="button"
                        onClick={next}
                        aria-disabled={!canContinue}
                        className="group inline-flex items-center gap-2.5 border px-7 md:px-8 py-3 md:py-3.5 transition-all duration-500"
                        style={{
                          borderColor: canContinue ? 'var(--cream)' : 'rgba(255,253,226,0.18)',
                          background: canContinue ? 'var(--cream)' : 'transparent',
                        }}
                      >
                        <span
                          className="text-[15px] md:text-[16px] font-body font-medium transition-colors duration-500"
                          style={{ color: canContinue ? '#0b0b0b' : 'rgba(255,253,226,0.35)' }}
                        >
                          {sending ? 'Sending…' : 'Submit'}
                        </span>
                        <span
                          aria-hidden
                          className="text-[13px] leading-none transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                          style={{ color: canContinue ? '#0b0b0b' : 'rgba(255,253,226,0.35)' }}
                        >
                          {'↗'}
                        </span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="mt-8 md:mt-10 pt-5 border-t border-cream/10 flex items-center justify-between">
              <button
                type="button"
                onClick={back}
                disabled={step === 0}
                className={`group flex items-center gap-2.5 text-[11px] uppercase tracking-[0.22em] font-mono transition-colors duration-300 ${
                  step === 0
                    ? 'text-cream-dim/30 cursor-default'
                    : 'text-cream/45 hover:text-cream cursor-pointer'
                }`}
              >
                <span aria-hidden className="transition-transform duration-300 group-hover:-translate-x-1">
                  {'←'}
                </span>
                Back
              </button>

              {isLast && (
                <p className="hidden md:block text-[11px] font-mono uppercase tracking-[0.18em] text-cream-dim/60">
                  We usually respond to most inquiries within{' '}
                  <strong className="font-semibold text-cream/80">two business hours</strong>
                </p>
              )}

              {!isLast && (
                <button
                  type="button"
                  onClick={next}
                  aria-disabled={!canContinue}
                  className="group inline-flex items-center gap-2.5 border px-7 md:px-8 py-3 md:py-3.5 transition-all duration-500"
                  style={{
                    borderColor: canContinue ? 'var(--cream)' : 'rgba(255,253,226,0.18)',
                    background: canContinue ? 'var(--cream)' : 'transparent',
                  }}
                >
                  <span
                    className="text-[15px] md:text-[16px] font-body font-medium transition-colors duration-500"
                    style={{ color: canContinue ? '#0b0b0b' : 'rgba(255,253,226,0.35)' }}
                  >
                    Continue
                  </span>
                  <span
                    aria-hidden
                    className="text-[13px] leading-none transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    style={{ color: canContinue ? '#0b0b0b' : 'rgba(255,253,226,0.35)' }}
                  >
                    {'↗'}
                  </span>
                </button>
              )}
            </div>

            {sendError && (
              <p
                className="mt-4 text-[12px] font-mono tracking-[0.04em] text-right"
                style={{ color: ERR }}
              >
                Something went wrong sending your brief. Please try again, or email{' '}
                <a href="mailto:projects@arrvl.studio" className="underline">
                  projects@arrvl.studio
                </a>
                .
              </p>
            )}
          </>
        )}
      </div>
    </section>
  )
}

interface StepInputProps {
  data: FormState
  set: <K extends keyof FormState>(k: K, v: FormState[K]) => void
  touched: Record<string, boolean>
  markTouched: (f: string) => void
  setCountry?: (iso: string) => void
  setIntlPhone?: (iso: string, national: string) => void
}

function StepIntro({ data, set, touched, markTouched, setCountry, setIntlPhone }: StepInputProps) {
  const nameErr = touched.fullName && !data.fullName.trim() ? 'Please enter your name' : ''
  const emailErr =
    touched.email && !data.email.trim()
      ? 'Please enter your email'
      : touched.email && !isEmail(data.email)
      ? 'Enter a valid email address'
      : ''
  const phoneErr =
    touched.phone && data.phone && !phoneIsValid(data.phone, data.phoneCountry)
      ? 'Enter a valid phone number'
      : ''

  const border = (err: string) => (err ? { borderColor: ERR } : undefined)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
      <Field label="Full Name" required error={nameErr}>
        <input
          data-field="fullName"
          className={inputCls}
          style={border(nameErr)}
          placeholder="Your name"
          value={data.fullName}
          onChange={(e) => set('fullName', e.target.value)}
          onBlur={() => markTouched('fullName')}
        />
      </Field>
      <Field label="Email" required error={emailErr}>
        <input
          data-field="email"
          type="email"
          className={inputCls}
          style={border(emailErr)}
          placeholder="you@company.com"
          value={data.email}
          onChange={(e) => set('email', e.target.value)}
          onBlur={() => markTouched('email')}
        />
      </Field>
      <Field label="Phone" error={phoneErr}>
        <PhoneField
          iso={data.phoneCountry}
          phone={data.phone}
          error={phoneErr}
          onCountry={(v) => setCountry?.(v)}
          onPhone={(v) => set('phone', v)}
          onIntl={(c, nat) => setIntlPhone?.(c, nat)}
          onBlur={() => markTouched('phone')}
        />
      </Field>
      <Field label="Company">
        <input
          data-field="company"
          className={inputCls}
          placeholder="Optional"
          value={data.company}
          onChange={(e) => set('company', e.target.value)}
        />
      </Field>
    </div>
  )
}

function PhoneField({
  iso,
  phone,
  error,
  onCountry,
  onPhone,
  onIntl,
  onBlur,
}: {
  iso: string
  phone: string
  error?: string
  onCountry: (iso: string) => void
  onPhone: (v: string) => void
  onIntl: (iso: string, national: string) => void
  onBlur: () => void
}) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const rootRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const searchRef = useRef<HTMLInputElement>(null)
  const country = countryOf(iso)

  const filtered = query.trim()
    ? COUNTRIES.filter((c) => {
        const q = query.trim().toLowerCase()
        return (
          c.name.toLowerCase().includes(q) ||
          c.dial.includes(q.replace(/^\+?/, '+')) ||
          c.dial.includes(q) ||
          c.iso.toLowerCase().includes(q)
        )
      })
    : COUNTRIES

  useEffect(() => {
    if (!open) return
    const onDoc = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDoc)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  useEffect(() => {
    if (open) {
      setQuery('')
      searchRef.current?.focus()
    }
  }, [open])

  useGSAP(
    () => {
      if (!open || !panelRef.current) return
      gsap.fromTo(
        panelRef.current,
        { opacity: 0, y: -8, scaleY: 0.96 },
        { opacity: 1, y: 0, scaleY: 1, duration: 0.42, ease: 'power3.out', transformOrigin: 'top' }
      )
      gsap.fromTo(
        panelRef.current.querySelectorAll('[data-opt]'),
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.4, stagger: { amount: 0.35 }, ease: 'power3.out', delay: 0.04 }
      )
    },
    { dependencies: [open], scope: rootRef }
  )

  const placeholder = country.dial === '+1' ? '(555) 123-4567' : 'Phone number'

  return (
    <div ref={rootRef} className="relative">
      <div
        className="flex items-stretch border border-cream/15 transition-colors duration-300 focus-within:border-cream/50"
        style={error ? { borderColor: ERR } : open ? { borderColor: 'rgba(255,253,226,0.5)' } : undefined}
      >
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="flex shrink-0 items-center gap-2 pl-4 pr-3.5 text-[15px] text-cream font-body border-r border-cream/15 hover:bg-cream/[0.04] transition-colors duration-200"
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-label={`Country code: ${country.name} ${country.dial}`}
        >
          <span aria-hidden className="text-[17px] leading-none">
            {country.flag}
          </span>
          <span className="font-mono tracking-[0.02em] text-cream/85">{country.dial}</span>
          <span
            aria-hidden
            className="text-[10px] text-cream-dim transition-transform duration-300"
            style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
          >
            {'▾'}
          </span>
        </button>
        <input
          data-field="phone"
          type="tel"
          inputMode="tel"
          className="min-w-0 flex-1 bg-transparent px-4 py-3.5 text-[15px] text-cream font-body placeholder:text-cream-dim/70 focus:outline-none"
          placeholder={placeholder}
          value={phone}
          onChange={(e) => {
            const raw = e.target.value
            if (raw.trimStart().startsWith('+')) {
              const ayt = new AsYouType()
              ayt.input(raw)
              const detected = ayt.getCountry()
              const national = ayt.getNumber()?.formatNational()
              if (detected && national) {
                const sameCode =
                  getCountryCallingCode(detected) === getCountryCallingCode(iso as CountryCode)
                if (sameCode) onPhone(national)
                else onIntl(detected, national)
                return
              }
              onPhone(raw)
              return
            }
            if (validatePhoneNumberLength(raw, iso as CountryCode) === 'TOO_LONG') return
            onPhone(raw)
          }}
          onBlur={onBlur}
        />
      </div>

      {open && (
        <div
          ref={panelRef}
          role="listbox"
          className="absolute left-0 right-0 top-[calc(100%+8px)] z-40 border border-cream/15 bg-[#0b0b0b] will-change-[transform,opacity]"
          style={{ boxShadow: '0 24px 60px -20px rgba(0,0,0,0.7)' }}
        >
          <div className="border-b border-cream/10 p-2">
            <input
              ref={searchRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search country or code"
              className="w-full bg-transparent px-2.5 py-2 text-[13px] text-cream font-body placeholder:text-cream-dim/60 focus:outline-none"
            />
          </div>
          <div className="max-h-[240px] overflow-y-auto py-1.5">
            {filtered.length === 0 ? (
              <p className="px-4 py-3 text-[13px] font-body text-cream-dim/70">No matches</p>
            ) : (
              filtered.map((c) => {
                const on = c.iso === iso
                return (
                  <button
                    key={c.iso}
                    data-opt
                    type="button"
                    role="option"
                    aria-selected={on}
                    onClick={() => {
                      onCountry(c.iso)
                      setOpen(false)
                    }}
                    className="group flex w-full items-center gap-3 px-4 py-2.5 text-left text-[14px] font-body text-cream/80 hover:text-cream hover:bg-cream/[0.04] transition-colors duration-200"
                  >
                    <span aria-hidden className="text-[17px] leading-none">
                      {c.flag}
                    </span>
                    <span className="flex-1 truncate">{c.name}</span>
                    <span className="font-mono text-[12px] tracking-[0.02em] text-cream-dim">
                      {c.dial}
                    </span>
                    <span
                      aria-hidden
                      className="text-[10px] text-cream transition-opacity duration-200"
                      style={{ opacity: on ? 1 : 0 }}
                    >
                      {'●'}
                    </span>
                  </button>
                )
              })
            )}
          </div>
        </div>
      )}
    </div>
  )
}

function ServiceCard({
  s,
  on,
  onToggle,
}: {
  s: { n: string; glyph: string; title: string; desc: string; items: string[] }
  on: boolean
  onToggle: () => void
}) {
  const ref = useRef<HTMLButtonElement>(null)

  const handleMove = (e: ReactMouseEvent) => {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const x = e.clientX - r.left
    const y = e.clientY - r.top
    el.style.setProperty('--mx', `${x}px`)
    el.style.setProperty('--my', `${y}px`)
    el.style.setProperty('--rx', `${((y / r.height - 0.5) * -5).toFixed(2)}deg`)
    el.style.setProperty('--ry', `${((x / r.width - 0.5) * 5).toFixed(2)}deg`)
  }
  const handleLeave = () => {
    const el = ref.current
    if (!el) return
    el.style.setProperty('--rx', '0deg')
    el.style.setProperty('--ry', '0deg')
  }

  return (
    <button
      ref={ref}
      type="button"
      onClick={onToggle}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className="group relative flex flex-col text-left p-5 border overflow-hidden transition-[border-color,background-color,transform] duration-300 ease-out [transform-style:preserve-3d] will-change-transform"
      style={{
        borderColor: on ? 'rgba(255,253,226,0.55)' : 'rgba(255,253,226,0.14)',
        background: on ? 'rgba(255,253,226,0.05)' : 'transparent',
        transform:
          'perspective(900px) rotateX(var(--rx,0deg)) rotateY(var(--ry,0deg))',
      }}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background:
            'radial-gradient(200px circle at var(--mx,50%) var(--my,50%), rgba(255,253,226,0.10), transparent 65%)',
        }}
      />
      <span
        aria-hidden
        className="pointer-events-none absolute left-0 top-0 h-px bg-cream/70 transition-[width] duration-500 ease-[cubic-bezier(0.19,1,0.22,1)]"
        style={{ width: on ? '100%' : '0%' }}
      />

      <div className="relative flex items-start justify-between mb-4">
        <span
          className="relative flex items-center justify-center w-4 h-4 rounded-full border transition-colors duration-300 mt-1"
          style={{
            borderRadius: '9999px',
            borderColor: on ? 'var(--cream)' : 'rgba(255,253,226,0.3)',
          }}
          aria-hidden
        >
          <span
            className="w-2 h-2 rounded-full bg-cream transition-transform duration-300"
            style={{ borderRadius: '9999px', transform: on ? 'scale(1)' : 'scale(0)' }}
          />
        </span>
        <span
          aria-hidden
          className="font-heading font-bold leading-none tracking-[0.02em] transition-colors duration-300"
          style={{ fontSize: '22px', color: on ? 'var(--cream)' : 'rgba(255,253,226,0.5)' }}
        >
          {s.glyph}
        </span>
      </div>

      <h3 className="relative font-heading text-[16px] md:text-[17px] font-medium text-cream leading-[1.12] mb-2">
        {s.title}
      </h3>
      <p className="relative text-[12.5px] leading-[1.5] text-cream/45 font-body mb-5">
        {s.desc}
      </p>

      <ul className="relative mt-auto">
        {s.items.map((it) => (
          <li
            key={it}
            className="py-[7px] text-[12.5px] font-body border-b border-dotted border-cream/15 last:border-b-0 transition-colors duration-300"
            style={{ color: on ? 'rgba(255,253,226,0.78)' : 'rgba(255,253,226,0.5)' }}
          >
            {it}
          </li>
        ))}
      </ul>
    </button>
  )
}

function StepType({
  selected,
  toggle,
}: {
  selected: string[]
  toggle: (t: string) => void
}) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
      {SERVICES.map((s) => (
        <ServiceCard
          key={s.n}
          s={s}
          on={selected.includes(s.title)}
          onToggle={() => toggle(s.title)}
        />
      ))}
    </div>
  )
}

function CustomSelect({
  value,
  options,
  placeholder,
  field,
  error,
  onSelect,
  onTouch,
}: {
  value: string
  options: readonly string[]
  placeholder: string
  field: string
  error?: string
  onSelect: (v: string) => void
  onTouch: () => void
}) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  const close = () => {
    setOpen(false)
    onTouch()
  }

  useEffect(() => {
    if (!open) return
    const onDoc = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) close()
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
    }
    document.addEventListener('mousedown', onDoc)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDoc)
      document.removeEventListener('keydown', onKey)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  useGSAP(
    () => {
      if (!open || !panelRef.current) return
      gsap.fromTo(
        panelRef.current,
        { opacity: 0, y: -8, scaleY: 0.96 },
        { opacity: 1, y: 0, scaleY: 1, duration: 0.42, ease: 'power3.out', transformOrigin: 'top' }
      )
      gsap.fromTo(
        panelRef.current.querySelectorAll('[data-opt]'),
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.4, stagger: 0.045, ease: 'power3.out', delay: 0.04 }
      )
    },
    { dependencies: [open], scope: rootRef }
  )

  return (
    <div ref={rootRef} className="relative">
      <button
        data-field={field}
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`${inputCls} flex items-center justify-between cursor-pointer ${
          value ? 'text-cream' : 'text-cream-dim/70'
        }`}
        style={error ? { borderColor: ERR } : open ? { borderColor: 'rgba(255,253,226,0.5)' } : undefined}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span>{value || placeholder}</span>
        <span
          aria-hidden
          className="ml-3 text-[11px] text-cream-dim transition-transform duration-300"
          style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
        >
          {'▾'}
        </span>
      </button>

      {open && (
        <div
          ref={panelRef}
          role="listbox"
          className="absolute left-0 right-0 top-[calc(100%+8px)] z-30 border border-cream/15 bg-[#0b0b0b] py-1.5 will-change-[transform,opacity]"
          style={{ boxShadow: '0 24px 60px -20px rgba(0,0,0,0.7)' }}
        >
          {options.map((opt) => {
            const on = opt === value
            return (
              <button
                key={opt}
                data-opt
                type="button"
                role="option"
                aria-selected={on}
                onClick={() => {
                  onSelect(opt)
                  setOpen(false)
                  onTouch()
                }}
                className="group flex w-full items-center justify-between px-4 py-3 text-left text-[14px] font-body text-cream/80 hover:text-cream transition-colors duration-200"
              >
                <span className="relative">
                  {opt}
                  <span
                    className="absolute left-0 -bottom-0.5 h-px bg-cream/60 transition-all duration-300"
                    style={{ width: on ? '100%' : '0%' }}
                  />
                </span>
                <span
                  aria-hidden
                  className="text-[10px] text-cream transition-opacity duration-200"
                  style={{ opacity: on ? 1 : 0 }}
                >
                  {'●'}
                </span>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

const TIERS = INVESTMENTS.slice(0, 5)
const NOT_SURE = INVESTMENTS[5]
const BAR_H = [0.4, 0.55, 0.7, 0.85, 1]

function InvestmentGauge({
  value,
  onSelect,
}: {
  value: string
  onSelect: (v: string) => void
}) {
  const [hover, setHover] = useState(-1)
  const selIdx = TIERS.indexOf(value)
  const fillTo = hover >= 0 ? hover : selIdx

  return (
    <div className="flex flex-col gap-4">
      <div
        className="flex items-end gap-2 md:gap-2.5 h-[132px]"
        onMouseLeave={() => setHover(-1)}
      >
        {TIERS.map((t, i) => {
          const lit = fillTo >= 0 && i <= fillTo
          const isSel = i === selIdx
          return (
            <button
              key={t}
              type="button"
              onClick={() => onSelect(t)}
              onMouseEnter={() => setHover(i)}
              className="group relative flex-1 h-full flex flex-col justify-end items-stretch text-left"
              aria-pressed={isSel}
            >
              <span
                className="relative w-full overflow-hidden border-b border-cream/15 transition-[background-color,box-shadow] duration-300"
                style={{
                  height: `${BAR_H[i] * 100}%`,
                  background: lit
                    ? 'linear-gradient(180deg, rgba(255,253,226,0.92), rgba(255,253,226,0.55))'
                    : 'rgba(255,253,226,0.05)',
                  boxShadow: isSel ? '0 0 28px -6px rgba(255,253,226,0.45)' : 'none',
                }}
              >
                <span
                  aria-hidden
                  className="absolute left-0 top-0 h-px w-full transition-colors duration-300"
                  style={{ background: lit ? 'rgba(11,11,11,0.25)' : 'rgba(255,253,226,0.18)' }}
                />
              </span>
              <span
                className="mt-3 text-[11px] md:text-[12px] font-mono tracking-[0.02em] text-center transition-colors duration-300"
                style={{ color: isSel ? 'var(--cream)' : 'rgba(255,253,226,0.5)' }}
              >
                {t}
              </span>
            </button>
          )
        })}
      </div>

      <button
        type="button"
        onClick={() => onSelect(NOT_SURE)}
        className="self-start inline-flex items-center gap-2.5 px-5 py-2.5 border text-[13px] font-body transition-colors duration-300"
        style={{
          borderRadius: '9999px',
          borderColor: value === NOT_SURE ? 'var(--cream)' : 'rgba(255,253,226,0.18)',
          background: value === NOT_SURE ? 'var(--cream)' : 'transparent',
          color: value === NOT_SURE ? '#0b0b0b' : 'var(--cream)',
        }}
      >
        <span
          className="w-1.5 h-1.5 rounded-full transition-colors duration-300"
          style={{
            borderRadius: '9999px',
            background: value === NOT_SURE ? '#0b0b0b' : 'rgba(255,253,226,0.4)',
          }}
        />
        {NOT_SURE}
      </button>
    </div>
  )
}

function StepDetails({ data, set, touched, markTouched }: StepInputProps) {
  const descErr = touched.description && !data.description.trim() ? 'Tell us a little about the project' : ''
  const timeErr = touched.timeline && !data.timeline ? 'Pick a timeline' : ''
  const investErr = touched.investment && !data.investment ? 'Select a range' : ''
  const border = (err: string) => (err ? { borderColor: ERR } : undefined)

  return (
    <div className="flex flex-col gap-2">
      <Field label="Project Description" required error={descErr}>
        <textarea
          data-field="description"
          rows={5}
          className={`${inputCls} resize-none leading-[1.6]`}
          style={border(descErr)}
          placeholder="Give us a quick breakdown of the project, your goals, and the overall direction you have in mind."
          value={data.description}
          onChange={(e) => set('description', e.target.value)}
          onBlur={() => markTouched('description')}
        />
      </Field>

      <Field label="Timeline" required error={timeErr}>
        <CustomSelect
          field="timeline"
          value={data.timeline}
          options={TIMELINES}
          placeholder="Select a window"
          error={timeErr}
          onSelect={(v) => set('timeline', v)}
          onTouch={() => markTouched('timeline')}
        />
      </Field>

      <Field label="Project Investment Range" required error={investErr}>
        <InvestmentGauge
          value={data.investment}
          onSelect={(v) => {
            set('investment', v)
            markTouched('investment')
          }}
        />
      </Field>
    </div>
  )
}

function StepReview({
  data,
  jumpTo,
}: {
  data: FormState
  jumpTo: (i: number, field?: string) => void
}) {
  const rows: Array<{ label: string; value: string; step: number; field?: string }> = [
    { label: 'Name', value: data.fullName || '—', step: 0, field: 'fullName' },
    { label: 'Email', value: data.email || '—', step: 0, field: 'email' },
    { label: 'Phone', value: data.phone ? phoneInternational(data.phone, data.phoneCountry) : '—', step: 0, field: 'phone' },
    { label: 'Company', value: data.company || '—', step: 0, field: 'company' },
    { label: 'Services', value: data.services.length ? data.services.join(', ') : '—', step: 1 },
    { label: 'Description', value: data.description || '—', step: 2, field: 'description' },
    { label: 'Timeline', value: data.timeline || '—', step: 2, field: 'timeline' },
    { label: 'Investment', value: data.investment || '—', step: 2, field: 'investment' },
  ]
  return (
    <div className="border-t border-cream/10">
      {rows.map((r) => (
        <button
          key={r.label}
          type="button"
          onClick={() => jumpTo(r.step, r.field)}
          className="group w-full text-left flex items-start gap-5 py-4 border-b border-cream/10 hover:bg-cream/[0.03] transition-colors duration-300 px-1"
        >
          <span className="shrink-0 w-28 pt-0.5 text-[10px] uppercase tracking-[0.24em] font-mono text-cream-dim">
            {r.label}
          </span>
          <span className="flex-1 text-[14px] md:text-[15px] text-cream font-body leading-[1.5]">
            {r.value}
          </span>
          <span
            aria-hidden
            className="shrink-0 pt-0.5 text-[12px] text-cream-dim/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 font-mono"
          >
            EDIT
          </span>
        </button>
      ))}
    </div>
  )
}

function SubmittedView({ data }: { data: FormState }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center py-24">
      <span
        className="inline-block rounded-full border border-cream/20 px-4 py-1.5 text-[10px] uppercase tracking-[0.3em] font-mono text-cream-dim mb-9"
        style={{ borderRadius: '9999px' }}
      >
        Received
      </span>
      <h1
        className="font-heading font-medium tracking-[-0.03em] leading-[0.98] text-cream"
        style={{ fontSize: 'clamp(40px, 6vw, 92px)' }}
      >
        <span className="block text-cream/55">Thank you,</span>
        <span className="block">{data.fullName.split(' ')[0] || 'friend'}.</span>
      </h1>
      <p className="mt-8 text-[15px] md:text-[16px] leading-[1.6] text-cream-dim font-body max-w-[440px]">
        We read every one ourselves and will be in touch at{' '}
        <span className="text-cream">{data.email}</span> within{' '}
        <strong className="font-semibold text-cream">two business hours.</strong>
      </p>

      <div className="mt-12 flex flex-col sm:flex-row items-center gap-4">
        <Cta href="/projects" variant="primary" size="md">
          View our work
        </Cta>
        <Cta href="/" variant="secondary" size="md">
          Back to home
        </Cta>
      </div>
    </div>
  )
}
