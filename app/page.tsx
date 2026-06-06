import { PageLoader } from './components/page-loader'
import { Header } from './components/header'
import { HeroSection } from './components/hero-section'
import { ManifestoSection } from './components/manifesto-section'
import { Footer } from './components/footer'
import { CookieBanner } from './components/cookie-banner'

export default function Page() {
  return (
    <>
      <PageLoader />
      <div className="min-h-screen overflow-x-clip bg-[#0b0b0b]">
        <Header />
        <main>
          <HeroSection />
          <ManifestoSection />
        </main>
        <Footer />
        <CookieBanner />
      </div>
    </>
  )
}
