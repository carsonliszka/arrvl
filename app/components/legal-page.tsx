import { readFile } from 'fs/promises'
import path from 'path'
import { Marked } from 'marked'
import { SiteHeader } from './site-header'
import { Footer } from './footer'
import { CookieBanner } from './cookie-banner'

const SAFE_URL = /^(https?:|mailto:|tel:|\/|#|\.)/i
const safeUrl = (href: string | null | undefined) =>
  href && SAFE_URL.test(href.trim()) ? href.trim() : ''
const esc = (s: string | null | undefined) =>
  String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

const md = new Marked({
  renderer: {
    html: () => '',
    link(token) {
      const safe = safeUrl(token.href)
      const text = this.parser.parseInline(token.tokens)
      if (!safe) return text
      const title = token.title ? ` title="${esc(token.title)}"` : ''
      return `<a href="${esc(safe)}"${title}>${text}</a>`
    },
    image(token) {
      const safe = safeUrl(token.href)
      if (!safe) return esc(token.text || '')
      const title = token.title ? ` title="${esc(token.title)}"` : ''
      return `<img src="${esc(safe)}" alt="${esc(token.text || '')}"${title}>`
    },
  },
})

export async function LegalPage({ file }: { file: string }) {
  const root = process.cwd()
  const target = path.resolve(root, file)
  if (target !== root && !target.startsWith(root + path.sep)) {
    throw new Error('Invalid legal document path')
  }

  const raw = await readFile(target, 'utf8')
  const html = await md.parse(raw)

  return (
    <div className="relative min-h-screen bg-[#0b0b0b]">
      <SiteHeader />
      <main className="px-6 md:px-10 lg:px-14 pt-32 md:pt-40 pb-24 md:pb-28">
        <article
          className="legal-prose mx-auto max-w-[760px]"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </main>
      <Footer />
      <CookieBanner />
    </div>
  )
}
