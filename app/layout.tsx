import type { Metadata } from 'next'
import { Geist, DM_Sans, IBM_Plex_Mono } from 'next/font/google'
import localFont from 'next/font/local'
import { GSAPProvider } from './providers/gsap-provider'
import { LenisProvider } from './providers/lenis-provider'
import { LoaderProvider } from './providers/loader-context'
import { TransitionProvider } from './providers/transition-provider'
import { GrainOverlay } from './components/grain-overlay'
import { ConsoleMessage } from './components/console-message'
import './globals.css'

const aeonik = localFont({
  src: './fonts/Aeonik-Regular.ttf',
  variable: '--font-aeonik',
  display: 'swap',
  weight: '400',
})

const geist = Geist({
  subsets: ['latin'],
  variable: '--font-geist',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-dm-sans',
  display: 'swap',
})

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-plex-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'ARRVL · Artist-led Creative Agency',
  description: 'We are an artist-led creative agency. Driven by curiosity, not formula.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${aeonik.variable} ${geist.variable} ${dmSans.variable} ${ibmPlexMono.variable}`}
    >
      <body className="bg-background text-foreground antialiased">
        <GSAPProvider>
          <LoaderProvider>
            <LenisProvider>
              <TransitionProvider>{children}</TransitionProvider>
            </LenisProvider>
          </LoaderProvider>
        </GSAPProvider>
        <GrainOverlay />
        <ConsoleMessage />
      </body>
    </html>
  )
}
