import { SiteHeader } from '../components/site-header'
import { CookieBanner } from '../components/cookie-banner'
import { ProjectsBrowser } from './components/projects-browser'
import { ProjectsFAQ } from './components/projects-faq'
import { StartProjectBand } from '../components/start-project-band'
import { ProjectsFooter } from './components/projects-footer'

export const metadata = {
  title: 'Selected Work · ARRVL',
  description:
    'Selected work from ARRVL. We build sites that perform. Brand, web, development, and motion.',
}

export default function ProjectsPage() {
  return (
    <div className="relative min-h-screen bg-[#0b0b0b]">
      <SiteHeader />
      <main>
        <ProjectsBrowser />
        <ProjectsFAQ />
        <StartProjectBand />
      </main>
      <ProjectsFooter />
      <CookieBanner />
    </div>
  )
}
