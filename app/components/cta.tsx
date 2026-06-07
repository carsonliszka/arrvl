'use client'

import type { AnchorHTMLAttributes, ReactNode } from 'react'
import { TransitionLink } from './transition-link'

type CtaVariant = 'primary' | 'secondary'
type CtaSize = 'sm' | 'md' | 'lg'

const SIZES: Record<CtaSize, { box: string; text: string; arrow: number }> = {
  sm: { box: 'gap-2 px-5 py-2.5', text: 'text-[13px] md:text-[14px]', arrow: 17 },
  md: { box: 'gap-2.5 px-7 py-3 md:py-3.5', text: 'text-[15px] md:text-[16px]', arrow: 20 },
  lg: { box: 'gap-3 px-7 md:px-8 py-3 md:py-3.5', text: 'text-[18px] md:text-[22px]', arrow: 28 },
}

const VARIANTS: Record<CtaVariant, string> = {
  primary: 'border border-cream bg-cream text-[#01040B] hover:bg-transparent hover:text-cream',
  secondary: 'border border-cream/30 text-cream hover:border-cream hover:bg-cream hover:text-[#01040B]',
}

export function CtaArrow({ size }: { size: number }) {
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="shrink-0 transition-transform duration-500 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
    >
      <path d="M5.5 5.5 L14.5 14.5" />
      <path d="M14.5 7 L14.5 14.5 L7 14.5" />
    </svg>
  )
}

interface CtaProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
  href: string
  children: ReactNode
  variant?: CtaVariant
  size?: CtaSize
  showArrow?: boolean
}

export function Cta({
  href,
  children,
  variant = 'primary',
  size = 'lg',
  showArrow = true,
  className = '',
  ...rest
}: CtaProps) {
  const s = SIZES[size]
  return (
    <TransitionLink
      href={href}
      className={`group inline-flex items-center justify-center ${s.box} ${VARIANTS[variant]} transition-colors duration-500 ${className}`}
      {...rest}
    >
      <span className={`${s.text} font-body font-medium tracking-[-0.005em]`}>{children}</span>
      {showArrow && <CtaArrow size={s.arrow} />}
    </TransitionLink>
  )
}
