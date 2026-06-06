import { chromium } from 'playwright'

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 })
await page.goto('http://localhost:3000/this-page-does-not-exist', { waitUntil: 'networkidle' })
await page.waitForTimeout(900)

const box = await page.evaluate(() => {
  const c = document.querySelector('canvas')
  const r = c.getBoundingClientRect()
  return { x: r.left, y: r.top, w: r.width, h: r.height }
})

// scribble across the digits a few times to lay paint + trigger drips
const rows = 6
for (let r = 0; r < rows; r++) {
  const y = box.y + box.h * (0.25 + 0.5 * (r / (rows - 1)))
  const l2r = r % 2 === 0
  const steps = 46
  for (let i = 0; i <= steps; i++) {
    const t = l2r ? i / steps : 1 - i / steps
    await page.mouse.move(box.x + box.w * (0.05 + 0.9 * t), y, { steps: 1 })
    await page.waitForTimeout(7)
  }
}

// let the drips run and settle
await page.waitForTimeout(1400)
await page.screenshot({ path: '404-drip.png' })
await browser.close()
console.log('ok')
