import { Header } from '../components/header'
import { Footer } from '../components/footer'
import { CookieBanner } from '../components/cookie-banner'
import { ContactBackground } from './components/contact-background'
import { ContactForm } from './components/contact-form'

export const metadata = {
  title: 'Contact · ARRVL',
  description:
    'Start a project with ARRVL. A short, four-step brief and we usually respond to most inquiries within two business hours.',
}

export default function ContactPage() {
  return (
    <div className="relative min-h-screen overflow-x-clip bg-[#0b0b0b]">
      <ContactBackground />
      <div className="relative z-10">
        <Header showCta={false} />
        <main>
          <ContactForm />
        </main>
        <Footer />
        <CookieBanner />
      </div>
    </div>
  )
}
