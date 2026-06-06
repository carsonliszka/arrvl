'use client'

import { useMemo, useState } from 'react'
import { PROJECTS } from '../data'
import { ProjectsHero } from './projects-hero'
import { ProjectsWorks } from './projects-works'

export function ProjectsBrowser() {
  const [activeFilter, setActiveFilter] = useState('All')
  const [search, setSearch] = useState('')

  const filters = useMemo(() => {
    const seen: string[] = []
    for (const p of PROJECTS) {
      for (const c of p.categories) if (!seen.includes(c)) seen.push(c)
    }
    return ['All', ...seen]
  }, [])

  return (
    <>
      <ProjectsHero
        filters={filters}
        activeFilter={activeFilter}
        onFilter={setActiveFilter}
        search={search}
        onSearch={setSearch}
      />
      <ProjectsWorks activeFilter={activeFilter} search={search} />
    </>
  )
}
