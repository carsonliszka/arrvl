import { chromium } from 'playwright'
import { mkdir } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUT = join(__dirname, '..', 'public', 'projects')

const SHOTS = [
  { id: 'redshyft', url: 'https://redshyft-green.vercel.app' },
  { id: 'black-wing-squadron', url: 'https://blackwing-org.vercel.app' },
  { id: 'cta', url: 'https://cta-sigma.vercel.app' },
  { id: 'liszka-construction', url: 'https://liszkaconstruction.com' },
]

await mkdir(OUT, { recursive: true })

const browser = await chromium.launch()
const ctx = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 2,
})

for (const { id, url } of SHOTS) {
  const page = await ctx.newPage()
  try {
    await page.goto(url, { waitUntil: 'networkidle', timeout: 45000 })
    await page.waitForTimeout(3500)
    const path = join(OUT, `${id}.png`)
    await page.screenshot({ path, clip: { x: 0, y: 0, width: 1440, height: 900 } })
    console.log(`captured ${id} -> ${path}`)
  } catch (err) {
    console.error(`FAILED ${id}: ${err.message}`)
  } finally {
    await page.close()
  }
}

await browser.close()
