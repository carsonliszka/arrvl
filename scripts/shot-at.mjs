import { chromium } from 'playwright'

// Usage: node scripts/shot-at.mjs <path> <out> <targetY> [w] [h]
const path = process.argv[2] || '/'
const out = process.argv[3] || 'at.png'
const targetY = Number(process.argv[4] || 0)
const w = Number(process.argv[5] || 1440)
const h = Number(process.argv[6] || 900)
const mobile = w < 700

const browser = await chromium.launch()
const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 2, isMobile: mobile, hasTouch: mobile })
const page = await ctx.newPage()
await page.addInitScript(() => { try { localStorage.setItem('cookie-consent', 'allow') } catch {} })
await page.goto(`http://localhost:3000${path}`, { waitUntil: 'networkidle' })
await page.waitForTimeout(4200)
await page.mouse.move(w / 2, h / 2)
let y = 0
while (y < targetY) {
  await page.mouse.wheel(0, 600)
  y += 600
  await page.waitForTimeout(120)
}
await page.waitForTimeout(700)
await page.screenshot({ path: out, clip: { x: 0, y: 0, width: w, height: h } })
const sw = await page.evaluate(() => document.documentElement.scrollWidth)
await browser.close()
console.log('scrollWidth', sw)
