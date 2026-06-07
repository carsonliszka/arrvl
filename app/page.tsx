import { PageLoader } from './components/page-loader'
import { HeroSection } from './components/hero-section'
import { StrategySection } from './components/strategy-section'
import { StartProjectBand } from './components/start-project-band'
import { Footer } from './components/footer'
import { CookieBanner } from './components/cookie-banner'

export default function Page() {
  return (
    <>
      <PageLoader />
      <div className="min-h-screen overflow-x-clip bg-[#0b0b0b]">
        <main>
          <HeroSection />
          <StrategySection />
          <StartProjectBand />
        </main>
        <Footer />
        <CookieBanner />
      </div>
    </>
  )
}
