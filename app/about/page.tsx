import { SiteHeader } from '../components/site-header'
import { Footer } from '../components/footer'
import { CookieBanner } from '../components/cookie-banner'
import { AboutHero } from './components/about-hero'
import { AboutStory } from './components/about-story'
import { AboutApproach } from './components/about-approach'
import { AboutStatement } from './components/about-statement'
import { StartProjectBand } from '../components/start-project-band'

export const metadata = {
  title: 'About · ARRVL',
  description:
    'ARRVL is an artist-led creative studio. Brand, web, and motion for teams who would rather stand out than blend in.',
}

export default function AboutPage() {
  return (
    <div className="relative min-h-screen bg-[#0b0b0b]">
      <SiteHeader />
      <main>
        <AboutHero />
        <AboutStory />
        <AboutApproach />
        <AboutStatement />
        <StartProjectBand />
      </main>
      <Footer />
      <CookieBanner />
    </div>
  )
}
