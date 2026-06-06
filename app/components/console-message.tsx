'use client'

import { useEffect } from 'react'
import { CONSOLE_LOGO_ASCII } from '../lib/console-logo-ascii'

let hasShown = false

const mono =
  'font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace;'

function logConsoleMessage() {
  console.clear()

  console.log(
    "%cOh good, you're looking under the hood.",
    `color: #f5f5f5; ${mono} font-size: 13px; font-weight: 600;`,
  )
  console.log(CONSOLE_LOGO_ASCII)
}

export function ConsoleMessage() {
  useEffect(() => {
    if (hasShown) return
    hasShown = true

    const id = window.setTimeout(logConsoleMessage, 200)
    return () => window.clearTimeout(id)
  }, [])

  return null
}
