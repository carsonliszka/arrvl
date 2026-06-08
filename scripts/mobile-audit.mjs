import { chromium } from 'playwright'
import { mkdirSync } from 'fs'

const BASE = process.env.BASE || 'http://localhost:3100'
const OUT = 'scripts/mobile'
mkdirSync(OUT, { recursive: true })

const PAGES = [
  { name: 'home', path: '/', wait: 5200 },
  { name: 'about', path: '/about', wait: 2600 },
  { name: 'projects', path: '/projects', wait: 2600 },
  { name: 'contact', path: '/contact', wait: 2600 },
  { name: 'privacy', path: '/privacy-policy', wait: 2000 },
  { name: 'terms', path: '/terms', wait: 2000 },
  { name: 'accessibility', path: '/accessibility', wait: 2000 },
  { name: '404', path: '/this-page-does-not-exist', wait: 2200 },
]

const W = 390
const H = 844

const browser = await chromium.launch()
const ctx = await browser.newContext({
  viewport: { width: W, height: H },
  deviceScaleFactor: 2,
  isMobile: true,
  hasTouch: true,
})
await ctx.addInitScript(() => {
  try {
    localStorage.setItem('cookie-consent', 'allow')
  } catch {}
})
const page = await ctx.newPage()

for (const p of PAGES) {
  console.log(`\n=== ${p.name} (${p.path}) ===`)
  try {
    await page.goto(`${BASE}${p.path}`, { waitUntil: 'networkidle', timeout: 30000 })
  } catch (e) {
    console.log(`  LOAD ERROR: ${e.message}`)
    continue
  }
  await page.waitForTimeout(p.wait)
  await page.evaluate(async () => {
    const h = document.body.scrollHeight
    for (let y = 0; y <= h; y += Math.round(window.innerHeight * 0.8)) {
      window.scrollTo(0, y)
      await new Promise((r) => setTimeout(r, 220))
    }
    window.scrollTo(0, 0)
  })
  await page.waitForTimeout(500)

  const report = await page.evaluate((vw) => {
    const docW = document.documentElement.scrollWidth
    const offenders = []
    if (docW > vw + 1) {
      for (const el of document.querySelectorAll('body *')) {
        const r = el.getBoundingClientRect()
        if (r.width > 4 && r.right > vw + 1 && r.left >= -1 && r.width <= vw + 600) {
          offenders.push({
            tag: el.tagName.toLowerCase(),
            cls: (el.getAttribute('class') || '').slice(0, 70),
            right: Math.round(r.right),
            w: Math.round(r.width),
          })
        }
      }
    }
    return { docW, overflow: docW > vw + 1, offenders: offenders.slice(0, 10) }
  }, W)

  try {
    await page.screenshot({ path: `${OUT}/${p.name}.png`, fullPage: true })
  } catch (e) {
    console.log(`  (screenshot failed: ${e.message})`)
  }
  console.log(`  scrollWidth=${report.docW} viewport=${W} OVERFLOW=${report.overflow}`)
  for (const o of report.offenders) {
    console.log(`   > <${o.tag} class="${o.cls}"> right=${o.right} w=${o.w}`)
  }
}

await browser.close()
console.log('\nDone. Screenshots in scripts/mobile/')
