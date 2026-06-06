import type { Metadata } from 'next'
import { Header } from './components/header'
import { TransitionLink } from './components/transition-link'
import { HoverText } from './components/hover-text'
import { Cta } from './components/cta'
import { NotFoundNumber } from './components/not-found-number'
import { PaintDrips } from './components/paint-drips'

export const metadata: Metadata = {
  title: '404 · ARRVL',
  description: 'This page never arrived. Head back home or explore our work.',
}

// Header action: only on cursor devices (mobile keeps just the middle button)
const backToArrvl = (
  <span className="nf-fine">
    <TransitionLink
      href="/"
      aria-label="Back to ARRVL"
      className="group inline-flex items-center gap-2.5 border border-current px-5 py-2.5 text-[14px] md:text-[15px] font-body font-medium text-white transition-colors duration-300 hover:bg-white/10"
    >
      <HoverText text="Back to ARRVL" className="leading-[1.2em]" />
      <svg
        aria-hidden="true"
        width="10"
        height="10"
        viewBox="0 0 20 20"
        fill="currentColor"
        className="shrink-0 transition-transform duration-500 ease-out group-hover:translate-x-0.5 group-hover:translate-y-0.5"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M.4 2.6l13.8 13.8H1.5v3.2h18.1V1.5h-3.2v12.7L2.6.4.4 2.6z"
        />
      </svg>
    </TransitionLink>
  </span>
)

export default function NotFound() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0b0b0b] font-[family-name:var(--font-geist)]">
      <Header showLogo={false} rightSlot={backToArrvl} />

      {/* Devices with a real cursor → interactive paint 404 */}
      <div className="nf-fine">
        <PaintDrips />

        <main className="relative z-10 flex min-h-screen items-center justify-center px-6">
          <div className="relative w-full max-w-4xl">
            {/* outline 404 that paints solid red under the cursor */}
            <NotFoundNumber />

            <div className="relative flex flex-col items-start pl-[6%] pt-[26%] sm:pt-[20%] md:pt-[15%]">
              <h1
                className="font-semibold uppercase leading-[0.9] tracking-[-0.03em] text-white"
                style={{ fontSize: 'clamp(46px, 9vw, 124px)' }}
              >
                Page
                <br />
                not found
              </h1>
              <p className="mt-6 max-w-[18rem] text-[11px] font-medium uppercase leading-[1.55] tracking-[0.14em] text-white/40">
                The link you followed doesn&rsquo;t lead anywhere.
              </p>
            </div>
          </div>
        </main>

        <div className="absolute inset-x-6 bottom-10 z-50 flex items-center justify-between md:inset-x-10">
          <span className="text-[10px] uppercase tracking-[0.2em] text-white/30">404 Error</span>
        </div>
      </div>

      {/* Touch / no-cursor → clean static branded 404 */}
      <div className="nf-coarse">
        <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
          <p className="mb-7 flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.2em] text-white/40">
            <span className="h-1 w-1 rounded-full bg-white/40" /> Error 404
          </p>

          <span
            className="select-none font-extrabold leading-none tracking-[-0.05em] text-[#ff2e2e]"
            style={{ fontSize: 'clamp(120px, 36vw, 200px)' }}
          >
            404
          </span>

          <h1 className="mt-6 text-[clamp(26px,7vw,40px)] font-semibold uppercase leading-[1] tracking-[-0.02em] text-white">
            Page not found
          </h1>
          <p className="mt-4 max-w-[19rem] text-[13px] leading-[1.6] text-white/50">
            The link you followed moved, vanished, or never existed in the first place.
          </p>

          <div className="mt-9">
            <Cta href="/" variant="primary" size="md">
              Back to ARRVL
            </Cta>
          </div>
        </main>
      </div>
    </div>
  )
}
