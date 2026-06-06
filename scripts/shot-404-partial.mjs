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

// one loose diagonal brush stroke through the first "4" and into the "0"
const path = [
  [0.06, 0.30], [0.14, 0.55], [0.20, 0.78], [0.28, 0.86],
  [0.34, 0.55], [0.40, 0.30], [0.47, 0.55], [0.52, 0.80],
]
await page.mouse.move(box.x + box.w * path[0][0], box.y + box.h * path[0][1])
for (let s = 1; s < path.length; s++) {
  const [fx, fy] = path[s - 1]
  const [tx, ty] = path[s]
  const steps = 24
  for (let i = 1; i <= steps; i++) {
    const t = i / steps
    await page.mouse.move(box.x + box.w * (fx + (tx - fx) * t), box.y + box.h * (fy + (ty - fy) * t), { steps: 1 })
    await page.waitForTimeout(8)
  }
}
await page.waitForTimeout(300)
await page.screenshot({ path: '404-partial.png' })
await browser.close()
console.log('ok')
