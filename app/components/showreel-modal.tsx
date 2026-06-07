'use client'

import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'

const geist = 'font-[family-name:var(--font-geist)]'

const fmt = (s: number) => {
  if (!isFinite(s) || s < 0) return '0:00'
  const m = Math.floor(s / 60)
  const sec = Math.floor(s % 60)
  return `${m}:${sec.toString().padStart(2, '0')}`
}

const SPEEDS = [0.5, 1, 2]

export function ShowreelModal({ open, onClose, src }: { open: boolean; onClose: () => void; src: string }) {
  const backdropRef = useRef<HTMLDivElement>(null)
  const windowRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  const [mounted, setMounted] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [time, setTime] = useState(0)
  const [dur, setDur] = useState(0)
  const [volume, setVolume] = useState(1)
  const [muted, setMuted] = useState(false)
  const [rate, setRate] = useState(1)

  useEffect(() => setMounted(true), [])

  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [open])

  const close = () => {
    videoRef.current?.pause()
    gsap.to(windowRef.current, { opacity: 0, scale: 0.97, y: 10, duration: 0.25, ease: 'power2.in' })
    gsap.to(backdropRef.current, { opacity: 0, duration: 0.3, delay: 0.05, onComplete: onClose })
  }

  useGSAP(
    () => {
      if (!open) return
      gsap.set(backdropRef.current, { opacity: 0 })
      gsap.set(windowRef.current, { opacity: 0, scale: 0.96, y: 16 })
      gsap.to(backdropRef.current, { opacity: 1, duration: 0.3, ease: 'power2.out' })
      gsap.to(windowRef.current, { opacity: 1, scale: 1, y: 0, duration: 0.45, ease: 'power3.out', delay: 0.05 })
      const v = videoRef.current
      if (v) {
        v.currentTime = 0
        v.play().then(() => setPlaying(true)).catch(() => setPlaying(false))
      }
    },
    { dependencies: [open] }
  )

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
      if (e.key === ' ') {
        e.preventDefault()
        togglePlay()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  const togglePlay = () => {
    const v = videoRef.current
    if (!v) return
    if (v.paused) {
      v.play()
      setPlaying(true)
    } else {
      v.pause()
      setPlaying(false)
    }
  }
  const seek = (val: number) => {
    const v = videoRef.current
    if (v) {
      v.currentTime = val
      setTime(val)
    }
  }
  const changeVol = (val: number) => {
    const v = videoRef.current
    if (v) {
      v.volume = val
      v.muted = val === 0
      setVolume(val)
      setMuted(val === 0)
    }
  }
  const toggleMute = () => {
    const v = videoRef.current
    if (!v) return
    const m = !v.muted
    v.muted = m
    setMuted(m)
  }
  const setSpeed = (r: number) => {
    const v = videoRef.current
    if (v) {
      v.playbackRate = r
      setRate(r)
    }
  }
  const fullscreen = () => {
    const el = windowRef.current
    if (el?.requestFullscreen) void el.requestFullscreen()
  }

  if (!open || !mounted) return null

  const iconBtn = 'flex items-center justify-center text-cream/70 transition-colors duration-200 hover:text-cream'

  return createPortal(
    <div
      ref={backdropRef}
      onClick={close}
      className={`fixed inset-0 z-[120] flex items-center justify-center bg-black/85 px-4 ${geist}`}
    >
      <div ref={windowRef} onClick={(e) => e.stopPropagation()} className="relative w-full max-w-[1120px]">
        <button
          type="button"
          onClick={close}
          aria-label="Close"
          className="group absolute -top-11 right-0 flex items-center gap-2.5 text-[11px] uppercase tracking-[0.2em] text-cream/60 transition-colors duration-200 hover:text-cream"
        >
          Close
          <span className="relative block h-3.5 w-3.5">
            <span className="absolute left-1/2 top-1/2 h-[1.5px] w-full -translate-x-1/2 -translate-y-1/2 rotate-45 bg-current" />
            <span className="absolute left-1/2 top-1/2 h-[1.5px] w-full -translate-x-1/2 -translate-y-1/2 -rotate-45 bg-current" />
          </span>
        </button>

        <div className="group/player relative aspect-video w-full overflow-hidden border border-cream/15 bg-black">
          <video
            ref={videoRef}
            src={src}
            className="h-full w-full object-contain"
            onClick={togglePlay}
            onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)}
            onLoadedMetadata={(e) => setDur(e.currentTarget.duration)}
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            onEnded={() => setPlaying(false)}
            playsInline
          />

          {!playing && (
            <button
              type="button"
              onClick={togglePlay}
              aria-label="Play"
              className="absolute inset-0 flex items-center justify-center bg-black/20"
            >
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-cream/90 transition-transform duration-300 hover:scale-105">
                <svg width="18" height="20" viewBox="0 0 18 20" fill="#0b0b0b" className="ml-1">
                  <path d="M0 0L18 10L0 20V0Z" />
                </svg>
              </span>
            </button>
          )}

          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent px-4 pb-3.5 pt-10 md:px-6">
            <input
              type="range"
              min={0}
              max={dur || 0}
              step={0.1}
              value={time}
              onChange={(e) => seek(Number(e.target.value))}
              aria-label="Seek"
              className="h-1 w-full cursor-pointer accent-[var(--cream)]"
            />

            <div className="mt-2.5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <button type="button" onClick={togglePlay} aria-label={playing ? 'Pause' : 'Play'} className={iconBtn}>
                  {playing ? (
                    <svg width="14" height="16" viewBox="0 0 14 16" fill="currentColor">
                      <rect x="0" y="0" width="4.5" height="16" />
                      <rect x="9.5" y="0" width="4.5" height="16" />
                    </svg>
                  ) : (
                    <svg width="14" height="16" viewBox="0 0 14 16" fill="currentColor">
                      <path d="M0 0L14 8L0 16V0Z" />
                    </svg>
                  )}
                </button>

                <div className="flex items-center gap-2.5">
                  <button type="button" onClick={toggleMute} aria-label={muted ? 'Unmute' : 'Mute'} className={iconBtn}>
                    <svg width="18" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M3 9v6h4l5 5V4L7 9H3z" />
                      {muted ? (
                        <path d="M16 8l6 8M22 8l-6 8" stroke="currentColor" strokeWidth="2" fill="none" />
                      ) : (
                        <path d="M16 8a5 5 0 0 1 0 8" stroke="currentColor" strokeWidth="2" fill="none" />
                      )}
                    </svg>
                  </button>
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.05}
                    value={muted ? 0 : volume}
                    onChange={(e) => changeVol(Number(e.target.value))}
                    aria-label="Volume"
                    className="h-1 w-20 cursor-pointer accent-[var(--cream)]"
                  />
                </div>

                <span className="text-[11px] tabular-nums tracking-[0.04em] text-cream/70">
                  {fmt(time)} / {fmt(dur)}
                </span>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2.5 text-[11px] font-medium uppercase tracking-[0.08em]">
                  {SPEEDS.map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setSpeed(r)}
                      className={`tabular-nums transition-colors duration-200 ${rate === r ? 'text-cream' : 'text-cream/45 hover:text-cream/75'}`}
                    >
                      {r}x
                    </button>
                  ))}
                </div>
                <button type="button" onClick={fullscreen} aria-label="Fullscreen" className={iconBtn}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 9V3h6M21 9V3h-6M3 15v6h6M21 15v6h-6" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}
