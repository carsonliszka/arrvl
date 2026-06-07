import { chromium } from 'playwright'

// Usage: node scripts/shot-hero.mjs <prefix> [w] [h] [frames] [gapMs]
const prefix = process.argv[2] || 'hero'
const w = Number(process.argv[3] || 1440)
const h = Number(process.argv[4] || 900)
const frames = Number(process.argv[5] || 6)
const gap = Number(process.argv[6] || 1400)
const mobile = w < 700

const browser = await chromium.launch()
const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 2, isMobile: mobile, hasTouch: mobile })
const page = await ctx.newPage()
await page.addInitScript(() => { try { localStorage.setItem('cookie-consent', 'allow') } catch {} })
await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' })
await page.waitForTimeout(4200) // let the loader finish so the hero is revealed

for (let i = 0; i < frames; i++) {
  await page.screenshot({ path: `${prefix}-${String(i).padStart(2, '0')}.png`, clip: { x: 0, y: 0, width: w, height: h } })
  if (i < frames - 1) await page.waitForTimeout(gap)
}

const sw = await page.evaluate(() => document.documentElement.scrollWidth)
await browser.close()
console.log('scrollWidth', sw)
