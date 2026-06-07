import { PageLoader } from './components/page-loader'
import { HeroSection } from './components/hero-section'
import { StrategySection } from './components/strategy-section'
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
        </main>
        <Footer />
        <CookieBanner />
      </div>
    </>
  )
}
