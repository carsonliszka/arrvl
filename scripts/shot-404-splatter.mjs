import { chromium } from 'playwright'

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 })
await page.goto('http://localhost:3000/this-page-does-not-exist', { waitUntil: 'networkidle' })
await page.waitForTimeout(900)

// wander the cursor around the upper/middle area so it sheds droplets
const pts = [
  [300, 240], [600, 300], [900, 250], [1100, 340], [800, 420],
  [500, 360], [350, 300], [700, 260], [1000, 300], [600, 400],
]
await page.mouse.move(pts[0][0], pts[0][1])
for (let s = 1; s < pts.length; s++) {
  const [fx, fy] = pts[s - 1]
  const [tx, ty] = pts[s]
  const steps = 30
  for (let i = 1; i <= steps; i++) {
    const t = i / steps
    await page.mouse.move(fx + (tx - fx) * t, fy + (ty - fy) * t, { steps: 1 })
    await page.waitForTimeout(10)
  }
}

// let everything fall and splatter
await page.waitForTimeout(1800)
await page.screenshot({ path: '404-splatter.png' })
await browser.close()
console.log('ok')
