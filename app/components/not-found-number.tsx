'use client'

import { useEffect, useRef } from 'react'

const NUM_STYLE = { fontSize: 'clamp(150px, 31vw, 440px)' } as const
const NUM_CLASS = 'font-extrabold leading-none tracking-[-0.04em] select-none'

/**
 * The 404 numerals. By default a white outline. On a fine pointer a canvas
 * takes over: moving the cursor across the digits lays down persistent red
 * brush strokes that fill the glyphs in — you paint the 404 red, stroke by
 * stroke, and it stays. The DOM outline below is the no-JS / touch fallback.
 * (Falling paint droplets are handled separately by <PaintDrips />.)
 */
export function NotFoundNumber() {
  const sizerRef = useRef<HTMLSpanElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const sizer = sizerRef.current
    const canvas = canvasRef.current
    if (!sizer || !canvas) return
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return

    const view = canvas.getContext('2d')
    if (!view) return

    const text = document.createElement('canvas')
    const tctx = text.getContext('2d')!
    const outline = document.createElement('canvas')
    const octx = outline.getContext('2d')!
    const mask = document.createElement('canvas')
    const mctx = mask.getContext('2d')!

    let W = 0
    let H = 0
    let dpr = 1
    let brush = 64
    let rect = canvas.getBoundingClientRect()

    const drawGlyphLayers = () => {
      const cs = getComputedStyle(sizer)
      const fontPx = parseFloat(cs.fontSize)
      const font = `${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`
      const ls = cs.letterSpacing && cs.letterSpacing !== 'normal' ? cs.letterSpacing : '0px'
      brush = Math.max(46, fontPx * 0.16)

      for (const c of [canvas, text, outline, mask]) {
        c.width = Math.round(W * dpr)
        c.height = Math.round(H * dpr)
      }

      tctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      tctx.font = font
      ;(tctx as unknown as { letterSpacing: string }).letterSpacing = ls
      const m = tctx.measureText('404')
      const ascent = m.actualBoundingBoxAscent || fontPx * 0.72
      const descent = m.actualBoundingBoxDescent || fontPx * 0.2
      const x = (W - m.width) / 2
      const baseY = (H - (ascent + descent)) / 2 + ascent

      tctx.clearRect(0, 0, W, H)
      tctx.textBaseline = 'alphabetic'
      tctx.shadowColor = 'rgba(255,46,46,0.5)'
      tctx.shadowBlur = fontPx * 0.06
      tctx.fillStyle = '#ff2e2e'
      tctx.fillText('404', x, baseY)

      octx.setTransform(dpr, 0, 0, dpr, 0, 0)
      octx.clearRect(0, 0, W, H)
      octx.font = font
      ;(octx as unknown as { letterSpacing: string }).letterSpacing = ls
      octx.textBaseline = 'alphabetic'
      octx.lineWidth = 2.5
      octx.strokeStyle = 'rgba(255,255,255,0.65)'
      octx.strokeText('404', x, baseY)

      mctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      mctx.lineCap = 'round'
      mctx.lineJoin = 'round'
      mctx.strokeStyle = '#fff'
    }

    const compose = () => {
      view.setTransform(1, 0, 0, 1, 0, 0)
      view.clearRect(0, 0, canvas.width, canvas.height)
      view.globalCompositeOperation = 'source-over'
      view.drawImage(text, 0, 0)
      view.globalCompositeOperation = 'destination-in'
      view.drawImage(mask, 0, 0)
      view.globalCompositeOperation = 'source-over'
      view.drawImage(outline, 0, 0)
    }

    const init = () => {
      W = sizer.offsetWidth
      H = sizer.offsetHeight
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.style.width = `${W}px`
      canvas.style.height = `${H}px`
      drawGlyphLayers()
      compose()
      rect = canvas.getBoundingClientRect()
    }

    sizer.style.visibility = 'hidden'
    init()

    let raf = 0
    let dirty = false
    const schedule = () => {
      if (dirty) return
      dirty = true
      raf = requestAnimationFrame(() => {
        dirty = false
        compose()
      })
    }

    let last: { x: number; y: number } | null = null
    const onMove = (e: PointerEvent) => {
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      if (x < -brush || y < -brush || x > W + brush || y > H + brush) {
        last = null
        return
      }
      mctx.lineWidth = brush
      mctx.beginPath()
      if (last) {
        mctx.moveTo(last.x, last.y)
        mctx.lineTo(x, y)
      } else {
        mctx.moveTo(x - 0.01, y)
        mctx.lineTo(x, y)
      }
      mctx.stroke()
      last = { x, y }
      schedule()
    }
    const drop = () => {
      last = null
    }
    const onResize = () => init()

    window.addEventListener('pointermove', onMove)
    document.addEventListener('pointerleave', drop)
    window.addEventListener('blur', drop)
    window.addEventListener('resize', onResize)
    document.fonts?.ready.then(init).catch(() => {})

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerleave', drop)
      window.removeEventListener('blur', drop)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return (
    <div className="pointer-events-none absolute left-0 top-0 -translate-y-1/2">
      <span
        ref={sizerRef}
        aria-hidden="true"
        className={`${NUM_CLASS} block`}
        style={{
          ...NUM_STYLE,
          color: 'transparent',
          WebkitTextStroke: '2.5px rgba(255,255,255,0.65)',
        }}
      >
        404
      </span>
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="absolute left-0 top-0"
        style={{ filter: 'drop-shadow(0 0 16px rgba(255,46,46,0.3))' }}
      />
    </div>
  )
}
