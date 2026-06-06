'use client'

import { useEffect, useMemo, useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { PROJECTS, type Project } from '../data'

gsap.registerPlugin(ScrollTrigger)

interface ProjectsWorksProps {
  activeFilter: string
  search: string
}

const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v))
const FRAME_W = 'clamp(320px, 44vw, 860px)'

export function ProjectsWorks({ activeFilter, search }: ProjectsWorksProps) {
  const outerRef = useRef<HTMLElement>(null)
  const bgStripRef = useRef<HTMLDivElement>(null)
  const panelRefs = useRef<(HTMLDivElement | null)[]>([])

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase()
    return PROJECTS.filter((p) => {
      const matchFilter =
        activeFilter === 'All' || p.categories.includes(activeFilter)
      const matchSearch = !q || p.title.toLowerCase().includes(q)
      return matchFilter && matchSearch
    })
  }, [activeFilter, search])

  const n = visible.length

  useGSAP(
    () => {
      if (n <= 1) return

      const apply = (p: number) => {
        if (bgStripRef.current)
          bgStripRef.current.style.transform = `translateY(${-p * 100}vh)`
        const a = Math.min(Math.floor(p), n - 2)
        const frac = p - a
        for (let i = 0; i < n; i++) {
          const el = panelRefs.current[i]
          if (!el) continue
          if (i === a) el.style.clipPath = `inset(0px 0px ${frac * 100}% 0px)`
          else if (i === a + 1)
            el.style.clipPath = `inset(${(1 - frac) * 100}% 0px 0px 0px)`
          else el.style.clipPath = 'inset(0px 0px 100% 0px)'
        }
      }

      const st = ScrollTrigger.create({
        trigger: outerRef.current,
        start: 'top top',
        end: 'bottom bottom',
        onUpdate: (self) => apply(self.progress * (n - 1)),
        onRefresh: (self) => apply(self.progress * (n - 1)),
        invalidateOnRefresh: true,
      })
      apply(0)
      requestAnimationFrame(() => ScrollTrigger.refresh())

      return () => st.kill()
    },
    { scope: outerRef, dependencies: [n] }
  )

  if (n === 0) {
    return (
      <section className="bg-[#0b0b0b]">
        <div className="border-t border-white/12 px-6 py-40 text-center md:px-10">
          <p className="font-[family-name:var(--font-geist)] text-[13px] font-medium uppercase tracking-[-0.01em] text-white/50">
            No projects match. Try another filter.
          </p>
        </div>
      </section>
    )
  }

  if (n === 1) {
    return (
      <section className="relative h-screen overflow-hidden border-t border-white/12 bg-[#0b0b0b]">
        <Backdrop project={visible[0]} className="absolute inset-0" />
        <div className="pointer-events-none absolute inset-0 bg-black/35" />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-white/[0.18]"
        />
        <WindowLayer project={visible[0]} />
      </section>
    )
  }

  return (
    <section
      ref={outerRef}
      className="relative border-t border-white/12 bg-[#0b0b0b]"
      style={{ height: `${n * 100}vh` }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <div ref={bgStripRef} className="absolute inset-0 will-change-transform">
          {visible.map((project, i) => (
            <Backdrop
              key={project.id}
              project={project}
              className="absolute inset-x-0"
              style={{ top: `${i * 100}vh`, height: '100vh' }}
            />
          ))}
        </div>
        <div className="pointer-events-none absolute inset-0 bg-black/35" />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-white/[0.18]"
        />

        {visible.map((project, i) => (
          <div
            key={project.id}
            ref={(el) => {
              panelRefs.current[i] = el
            }}
            className="absolute inset-0 overflow-hidden"
            style={{
              zIndex: i + 1,
              clipPath: i === 0 ? 'inset(0px)' : 'inset(100% 0px 0px 0px)',
            }}
          >
            <WindowLayer project={project} />
          </div>
        ))}
      </div>
    </section>
  )
}

function Backdrop({
  project,
  className,
  style,
}: {
  project: Project
  className?: string
  style?: React.CSSProperties
}) {
  return (
    <div className={className} style={style}>
      <img
        src={project.image}
        alt=""
        aria-hidden="true"
        className="h-full w-full scale-[1.1]"
        style={{
          objectFit: 'cover',
          objectPosition: 'center',
          filter: 'brightness(0.55) blur(11px)',
        }}
      />
    </div>
  )
}

function WindowLayer({ project }: { project: Project }) {
  return (
    <>
      <div className="absolute inset-x-0 top-0 z-20 flex items-start justify-between p-6 font-[family-name:var(--font-geist)] text-[12px] font-medium uppercase tracking-[-0.01em] text-white/70 md:p-8">
        <span className="tabular-nums">({project.number})</span>
        <span>{project.client}</span>
      </div>
      <div className="pointer-events-none absolute inset-0 z-[1] flex items-center overflow-hidden">
        <Marquee title={project.title} />
      </div>
      <div className="absolute inset-0 z-10 flex items-center justify-center px-6">
        <div style={{ width: FRAME_W, maxWidth: '100%' }}>
          <ProjectWindow project={project} />
        </div>
      </div>
    </>
  )
}

const MARQUEE_SPEED = 75

function Marquee({ title }: { title: string }) {
  const trackRef = useRef<HTMLDivElement>(null)
  const halfRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const track = trackRef.current
    const half = halfRef.current
    if (!track || !half) return
    const setDuration = () => {
      const w = half.offsetWidth
      if (w > 0) track.style.animationDuration = `${w / MARQUEE_SPEED}s`
    }
    setDuration()
    document.fonts?.ready.then(setDuration)
    window.addEventListener('resize', setDuration)
    return () => window.removeEventListener('resize', setDuration)
  }, [title])

  const half = Array.from({ length: 6 }, (_, i) => (
    <span key={i} className="flex items-center whitespace-nowrap">
      <span
        className="whitespace-nowrap font-[family-name:var(--font-geist)] font-semibold uppercase leading-[0.82] text-white"
        style={{ fontSize: 'clamp(56px, 9vw, 130px)', letterSpacing: '-0.04em' }}
      >
        {title}
      </span>
      <span
        className="mx-[0.4em] inline-block rounded-full bg-white/70 align-middle"
        style={{ width: '0.12em', height: '0.12em' }}
      />
    </span>
  ))
  return (
    <div
      ref={trackRef}
      className="proj-marquee flex w-max flex-nowrap items-center will-change-transform"
    >
      <div ref={halfRef} className="flex flex-nowrap items-center">
        {half}
      </div>
      <div className="flex flex-nowrap items-center" aria-hidden="true">
        {half}
      </div>
    </div>
  )
}

function ProjectWindow({ project }: { project: Project }) {
  return (
    <a
      href={project.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block"
    >
      <div className="relative aspect-video overflow-hidden shadow-[0_50px_140px_-25px_rgba(0,0,0,0.75)] transition-transform duration-700 ease-out group-hover:scale-[1.015]">
        <img
          src={project.image}
          alt={project.title}
          className="h-full w-full"
          style={{ objectFit: 'cover', objectPosition: 'center top' }}
        />
      </div>
      <div className="relative mt-5 min-h-[3.5rem]">
        <h3
          className="absolute left-0 top-0 font-[family-name:var(--font-geist)] font-medium uppercase leading-none text-white"
          style={{ fontSize: 'clamp(13px, 1.1vw, 16px)', letterSpacing: '-0.01em' }}
        >
          {project.title}
        </h3>
        <div className="absolute left-1/2 top-0 flex flex-col gap-1 font-[family-name:var(--font-geist)] text-[12px] font-medium uppercase tracking-[-0.01em] text-white/60">
          {project.categories.map((c) => (
            <span key={c}>{c}</span>
          ))}
        </div>
        <span className="absolute right-0 top-0 font-[family-name:var(--font-geist)] text-[12px] font-medium uppercase tabular-nums tracking-[-0.01em] text-white/55">
          {project.year}
        </span>
      </div>
    </a>
  )
}
