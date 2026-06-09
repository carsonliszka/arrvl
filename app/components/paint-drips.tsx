'use client'

import { useEffect, useRef } from 'react'

type Drop = { x: number; y: number; vx: number; vy: number; r: number }

const RED = '#ff2e2e'
const INK = '#0b0b0b'
const GRAVITY = 0.5

// liquid surface (1D wave height-field)
const SPRING = 0.012
const DAMP = 0.94
const SPREAD = 0.16

// 404 paint physics. the cursor drips red, it pools at the bottom, ripples, and uncovers
// a line of text as the level rises. cursor only.
export function PaintDrips() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let W = 0
    let H = 0
    let dpr = 1
    const drops: Drop[] = []
    const MAX = 90

    // bottom liquid pool
    let N = 0
    let colW = 1
    let rest = 0
    let cols = new Float32Array(0)
    let vels = new Float32Array(0)
    let lD = new Float32Array(0)
    let rD = new Float32Array(0)
    const maxFill = () => H * 0.22

    let geistFamily = 'sans-serif'

    const resize = () => {
      W = window.innerWidth
      H = window.innerHeight
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.round(W * dpr)
      canvas.height = Math.round(H * dpr)
      canvas.style.width = `${W}px`
      canvas.style.height = `${H}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      N = Math.max(48, Math.floor(W / 12))
      colW = W / (N - 1)
      cols = new Float32Array(N).fill(rest)
      vels = new Float32Array(N)
      lD = new Float32Array(N)
      rD = new Float32Array(N)

      geistFamily =
        getComputedStyle(document.documentElement)
          .getPropertyValue('--font-geist')
          .trim() || 'sans-serif'
    }
    resize()

    const heightAt = (x: number) => {
      const t = Math.max(0, Math.min(N - 1, x / colW))
      const i = Math.floor(t)
      const f = t - i
      return cols[i] + (cols[Math.min(N - 1, i + 1)] - cols[i]) * f
    }
    const poolImpact = (x: number, r: number, speed: number) => {
      rest = Math.min(maxFill(), rest + 4 + r)
      const i = Math.round(Math.max(0, Math.min(N - 1, x / colW)))
      const push = Math.min(28, 6 + speed * 1.2 + r)
      for (let k = -1; k <= 1; k++) {
        const j = i + k
        if (j >= 0 && j < N) vels[j] -= push * (k === 0 ? 1 : 0.45)
      }
    }
    const shove = (x: number, dx: number, dy: number) => {
      const i = Math.round(Math.max(0, Math.min(N - 1, x / colW)))
      const reach = Math.max(2, Math.round(46 / colW))
      const push = Math.min(30, Math.abs(dy) * 0.7 + Math.abs(dx) * 0.5)
      for (let k = -reach; k <= reach; k++) {
        const j = i + k
        if (j >= 0 && j < N) vels[j] -= push * (1 - Math.abs(k) / (reach + 1))
      }
    }
    const stepWater = () => {
      for (let i = 0; i < N; i++) {
        vels[i] += SPRING * (rest - cols[i])
        vels[i] *= DAMP
        cols[i] += vels[i]
      }
      for (let i = 0; i < N; i++) {
        if (i > 0) {
          lD[i] = SPREAD * (cols[i] - cols[i - 1])
          vels[i - 1] += lD[i]
        }
        if (i < N - 1) {
          rD[i] = SPREAD * (cols[i] - cols[i + 1])
          vels[i + 1] += rD[i]
        }
      }
      for (let i = 0; i < N; i++) {
        if (i > 0) cols[i - 1] += lD[i]
        if (i < N - 1) cols[i + 1] += rD[i]
      }
    }
    const tracePool = () => {
      ctx.beginPath()
      ctx.moveTo(0, H + 2)
      ctx.lineTo(0, H - cols[0])
      for (let i = 1; i < N; i++) {
        ctx.quadraticCurveTo(
          (i - 0.5) * colW,
          H - (cols[i - 1] + cols[i]) / 2,
          i * colW,
          H - cols[i]
        )
      }
      ctx.lineTo(W, H + 2)
      ctx.closePath()
    }
    const drawPicasso = () => {
      const hero = Math.min(150, Math.max(54, W * 0.085))
      const kick = Math.max(11, hero * 0.135)
      const baseY = H - Math.max(28, H * 0.04)
      ctx.fillStyle = INK
      ctx.textBaseline = 'alphabetic'

      // hero word
      ctx.textAlign = 'center'
      ctx.font = `800 ${hero}px ${geistFamily}`
      ;(ctx as unknown as { letterSpacing: string }).letterSpacing = '-0.04em'
      ctx.fillText('PICASSO', W / 2, baseY)

      // eyebrow: "I MEAN, YOU’RE " + italic "BASICALLY", centered
      const kickY = baseY - hero * 0.82
      ;(ctx as unknown as { letterSpacing: string }).letterSpacing = '0.3em'
      ctx.textAlign = 'left'
      const a = 'I MEAN, YOU’RE '
      const b = 'BASICALLY'
      const fontN = `600 ${kick}px ${geistFamily}`
      const fontI = `italic 600 ${kick}px ${geistFamily}`
      ctx.font = fontN
      const wA = ctx.measureText(a).width
      ctx.font = fontI
      const wB = ctx.measureText(b).width
      const startX = W / 2 - (wA + wB) / 2
      ctx.font = fontN
      ctx.fillText(a, startX, kickY)
      ctx.font = fontI
      ctx.fillText(b, startX + wA, kickY)
      ;(ctx as unknown as { letterSpacing: string }).letterSpacing = '0px'
    }
    const drawPool = () => {
      if (rest < 0.2 && cols[0] < 0.2) return
      tracePool()
      ctx.fillStyle = RED
      ctx.shadowColor = 'rgba(255,46,46,0.45)'
      ctx.shadowBlur = 14
      ctx.fill()
      ctx.shadowBlur = 0
      ctx.save()
      tracePool()
      ctx.clip()
      drawPicasso()
      ctx.restore()
      ctx.beginPath()
      ctx.moveTo(0, H - cols[0])
      for (let i = 1; i < N; i++) {
        ctx.quadraticCurveTo(
          (i - 0.5) * colW,
          H - (cols[i - 1] + cols[i]) / 2,
          i * colW,
          H - cols[i]
        )
      }
      ctx.strokeStyle = 'rgba(255,130,130,0.55)'
      ctx.lineWidth = 1.5
      ctx.stroke()
    }

    let raf = 0
    let running = false
    const frame = () => {
      ctx.clearRect(0, 0, W, H)

      ctx.fillStyle = RED
      ctx.shadowColor = 'rgba(255,46,46,0.4)'
      ctx.shadowBlur = 6
      for (let i = drops.length - 1; i >= 0; i--) {
        const d = drops[i]
        d.vy = Math.min(16, d.vy + GRAVITY)
        d.x += d.vx
        d.y += d.vy
        if (d.y >= H - heightAt(d.x)) {
          poolImpact(d.x, d.r, d.vy)
          drops.splice(i, 1)
          continue
        }
        const stretch = 1 + Math.min(2.4, d.vy * 0.12)
        ctx.beginPath()
        ctx.ellipse(d.x, d.y, d.r, d.r * stretch, 0, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.shadowBlur = 0

      stepWater()
      drawPool()

      let moving = drops.length > 0
      if (!moving) {
        for (let i = 0; i < N; i++) {
          if (Math.abs(vels[i]) > 0.04 || Math.abs(cols[i] - rest) > 0.1) {
            moving = true
            break
          }
        }
      }
      if (moving) raf = requestAnimationFrame(frame)
      else running = false
    }
    const wake = () => {
      if (running) return
      running = true
      raf = requestAnimationFrame(frame)
    }

    const emit = (x: number, y: number) => {
      if (drops.length >= MAX) return
      drops.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 0.7,
        vy: Math.random() * 0.9,
        r: 1.8 + Math.random() * 2.6,
      })
    }

    let lastX = 0
    let lastY = 0
    let hasLast = false
    let lastEmit = 0
    const onMove = (e: PointerEvent) => {
      const x = e.clientX
      const y = e.clientY
      const now = e.timeStamp
      const surf = H - heightAt(x)
      if (y < surf - 8 && now - lastEmit > 130 && Math.random() < 0.5) {
        emit(x, y)
        lastEmit = now
      }
      if (hasLast && y > surf - 60) shove(x, x - lastX, y - lastY)
      lastX = x
      lastY = y
      hasLast = true
      wake()
    }

    window.addEventListener('pointermove', onMove)
    window.addEventListener('resize', resize)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[40]"
      style={{ filter: 'drop-shadow(0 0 10px rgba(255,46,46,0.22))' }}
    />
  )
}
