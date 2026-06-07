import { SiteHeader } from '../components/site-header'
import { Footer } from '../components/footer'
import { CookieBanner } from '../components/cookie-banner'
import { ContactBackground } from './components/contact-background'
import { ContactForm } from './components/contact-form'

export const metadata = {
  title: 'Contact · ARRVL',
  description:
    'Start a project with ARRVL. A few quick questions and we will get back to you shortly.',
}

export default function ContactPage() {
  return (
    <div className="relative min-h-screen overflow-x-clip bg-[#0b0b0b]">
      <ContactBackground />
      <div className="relative z-10">
        <SiteHeader showCta={false} />
        <main>
          <ContactForm />
        </main>
        <Footer />
        <CookieBanner />
      </div>
    </div>
  )
}
