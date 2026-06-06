'use client'

import { forwardRef, type AnchorHTMLAttributes, type MouseEvent, type ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import { useTransitionNavigate } from '../providers/transition-provider'

interface TransitionLinkProps
  extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string
  children: ReactNode
}

export const TransitionLink = forwardRef<HTMLAnchorElement, TransitionLinkProps>(
  function TransitionLink({ href, onClick, children, target, ...rest }, ref) {
    const navigate = useTransitionNavigate()
    const pathname = usePathname()

    const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
      onClick?.(e)
      if (e.defaultPrevented) return

      if (
        target === '_blank' ||
        href.startsWith('http') ||
        href.startsWith('mailto') ||
        href.startsWith('tel') ||
        href.startsWith('#') ||
        e.metaKey ||
        e.ctrlKey ||
        e.shiftKey ||
        e.altKey ||
        e.button !== 0
      ) {
        return
      }

      e.preventDefault()
      if (href === pathname) return
      navigate(href)
    }

    return (
      <a ref={ref} href={href} onClick={handleClick} target={target} {...rest}>
        {children}
      </a>
    )
  }
)
