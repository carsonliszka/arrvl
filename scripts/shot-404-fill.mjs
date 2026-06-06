import { chromium } from 'playwright'

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 })
await page.goto('http://localhost:3000/this-page-does-not-exist', { waitUntil: 'networkidle' })
await page.waitForTimeout(900)

// keep the cursor moving for a while so many drops fall and the pool fills
let px = 720, py = 320
await page.mouse.move(px, py)
for (let s = 0; s < 70; s++) {
  px = 250 + Math.random() * 940
  py = 230 + Math.random() * 220
  const steps = 14
  const fx = px, fy = py
  for (let i = 1; i <= steps; i++) {
    await page.mouse.move(720 + (fx - 720) * (i / steps), 320 + (fy - 320) * (i / steps), { steps: 1 })
    await page.waitForTimeout(7)
  }
}

await page.waitForTimeout(900)
await page.screenshot({ path: '404-fill.png' })
await browser.close()
console.log('ok')
