'use client'

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'

const BLOBS = [
  {
    gradient:
      'radial-gradient(circle, rgba(0,201,167,0.5) 0%, transparent 70%)',
    size: 520,
    blur: 90,
    top: '32%',
    left: '50%',
  },
  {
    gradient:
      'radial-gradient(circle, rgba(0,180,210,0.42) 0%, transparent 68%)',
    size: 580,
    blur: 100,
    top: '48%',
    left: '58%',
  },
  {
    gradient:
      'radial-gradient(circle, rgba(0,220,180,0.38) 0%, transparent 65%)',
    size: 460,
    blur: 85,
    top: '52%',
    left: '40%',
  },
  {
    gradient:
      'radial-gradient(circle, rgba(60,210,230,0.33) 0%, transparent 70%)',
    size: 500,
    blur: 110,
    top: '35%',
    left: '62%',
  },
  {
    gradient:
      'radial-gradient(circle, rgba(0,180,150,0.28) 0%, transparent 70%)',
    size: 700,
    blur: 120,
    top: '44%',
    left: '50%',
  },
]

export function HeroBlobs() {
  const containerRef = useRef<HTMLDivElement>(null)
  const blobRefs = useRef<(HTMLDivElement | null)[]>([])

  useGSAP(
    () => {
      blobRefs.current.forEach((blob, i) => {
        if (!blob) return

        const xRange = 60 + Math.random() * 50
        const yRange = 40 + Math.random() * 40
        const duration = 8 + Math.random() * 6

        gsap.to(blob, {
          x: `random(-${xRange}, ${xRange})`,
          y: `random(-${yRange}, ${yRange})`,
          duration,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
          delay: i * 0.7,
        })

        gsap.to(blob, {
          scale: 0.85 + Math.random() * 0.35,
          duration: 6 + Math.random() * 5,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
          delay: i * 0.4 + 1.5,
        })
      })
    },
    { scope: containerRef }
  )

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 overflow-hidden"
      aria-hidden="true"
    >
      {BLOBS.map((blob, i) => (
        <div
          key={i}
          ref={(el) => { blobRefs.current[i] = el }}
          className="absolute rounded-full will-change-transform"
          style={{
            width: blob.size,
            height: blob.size,
            top: blob.top,
            left: blob.left,
            transform: 'translate(-50%, -50%)',
            background: blob.gradient,
            filter: `blur(${blob.blur}px)`,
            mixBlendMode: 'screen',
          }}
        />
      ))}
    </div>
  )
}
