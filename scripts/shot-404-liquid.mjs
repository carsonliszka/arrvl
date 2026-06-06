import { chromium } from 'playwright'

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 })
await page.goto('http://localhost:3000/this-page-does-not-exist', { waitUntil: 'networkidle' })
await page.waitForTimeout(900)

// wander the cursor so it sheds droplets that fill the pool
const pts = [
  [300, 240], [700, 300], [1050, 250], [800, 360], [400, 320],
  [650, 260], [1000, 300], [500, 380], [820, 300], [350, 280],
  [700, 340], [1080, 300], [600, 360], [420, 300], [760, 280],
]
await page.mouse.move(pts[0][0], pts[0][1])
for (let s = 1; s < pts.length; s++) {
  const [fx, fy] = pts[s - 1]
  const [tx, ty] = pts[s]
  const steps = 26
  for (let i = 1; i <= steps; i++) {
    const t = i / steps
    await page.mouse.move(fx + (tx - fx) * t, fy + (ty - fy) * t, { steps: 1 })
    await page.waitForTimeout(11)
  }
}

// let drops fall in and the surface settle a touch (capture mid-ripple)
await page.waitForTimeout(700)
await page.screenshot({ path: '404-liquid.png' })
await browser.close()
console.log('ok')
