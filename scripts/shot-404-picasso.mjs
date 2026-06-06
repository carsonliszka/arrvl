import { chromium } from 'playwright'

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 })
await page.goto('http://localhost:3000/this-page-does-not-exist', { waitUntil: 'networkidle' })
await page.waitForTimeout(900)

// fill the pool to max by moving the cursor a lot
await page.mouse.move(720, 320)
for (let s = 0; s < 110; s++) {
  const tx = 250 + Math.random() * 940
  const ty = 230 + Math.random() * 240
  const steps = 10
  const fx = 720, fy = 320
  for (let i = 1; i <= steps; i++) {
    await page.mouse.move(fx + (tx - fx) * (i / steps), fy + (ty - fy) * (i / steps), { steps: 1 })
    await page.waitForTimeout(5)
  }
  await page.mouse.move(720, 320)
}

await page.waitForTimeout(1000)
await page.screenshot({ path: '404-picasso.png' })

// also hover the back button to show the arrow + roll
await page.mouse.move(1340, 32)
await page.waitForTimeout(500)
await page.screenshot({ path: '404-arrow.png', clip: { x: 1180, y: 8, width: 260, height: 60 } })

await browser.close()
console.log('ok')
