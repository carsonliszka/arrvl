import { chromium } from 'playwright'

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 })
await page.goto('http://localhost:3000/this-page-does-not-exist', { waitUntil: 'networkidle' })
await page.waitForTimeout(700)

// move the real cursor across the digits so the red torch settles on them
await page.mouse.move(420, 230)
for (let i = 0; i < 30; i++) {
  await page.mouse.move(420 + i * 6, 230 + Math.sin(i / 3) * 10, { steps: 1 })
  await page.waitForTimeout(16)
}
// hold over the middle "0"
await page.mouse.move(560, 230)
await page.waitForTimeout(700)
await page.screenshot({ path: '404-cursor.png' })
await browser.close()
console.log('ok')
