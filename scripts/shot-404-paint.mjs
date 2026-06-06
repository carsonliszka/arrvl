import { chromium } from 'playwright'

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 })
await page.goto('http://localhost:3000/this-page-does-not-exist', { waitUntil: 'networkidle' })
await page.waitForTimeout(900) // webfont + canvas init

// locate the number block
const box = await page.evaluate(() => {
  const c = document.querySelector('canvas')
  if (!c) return null
  const r = c.getBoundingClientRect()
  return { x: r.left, y: r.top, w: r.width, h: r.height }
})
if (!box) { console.log('no canvas'); await browser.close(); process.exit(1) }

// scribble back-and-forth across the digits to paint them in
const rows = 7
for (let r = 0; r < rows; r++) {
  const y = box.y + box.h * (0.22 + 0.6 * (r / (rows - 1)))
  const leftToRight = r % 2 === 0
  const steps = 40
  for (let i = 0; i <= steps; i++) {
    const t = leftToRight ? i / steps : 1 - i / steps
    const x = box.x + box.w * (0.05 + 0.9 * t)
    await page.mouse.move(x, y, { steps: 1 })
    await page.waitForTimeout(6)
  }
}
await page.waitForTimeout(300)
await page.screenshot({ path: '404-paint.png' })
await browser.close()
console.log('ok')
