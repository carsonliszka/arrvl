import { chromium } from 'playwright'

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 })
await page.goto('http://localhost:3000/this-page-does-not-exist', { waitUntil: 'networkidle' })
await page.waitForTimeout(1000)

const lines = await page.evaluate(() => {
  const h1 = document.querySelector('main h1')
  const out = []
  h1.childNodes.forEach((n) => {
    if (n.nodeType === 3 && n.textContent.trim()) {
      const r = document.createRange()
      r.selectNode(n)
      const b = r.getBoundingClientRect()
      out.push({ left: b.left, right: b.right, top: b.top, bottom: b.bottom })
    }
  })
  return out
})

// rain paint just above each headline line by sweeping the cursor across it
for (let pass = 0; pass < 6; pass++) {
  for (const ln of lines) {
    const y = ln.top - 14
    const l2r = pass % 2 === 0
    const steps = 60
    for (let i = 0; i <= steps; i++) {
      const t = l2r ? i / steps : 1 - i / steps
      await page.mouse.move(ln.left + (ln.right - ln.left) * t, y, { steps: 1 })
      await page.waitForTimeout(5)
    }
  }
}

await page.waitForTimeout(1400)
await page.screenshot({ path: '404-letters.png' })
await browser.close()
console.log('ok')
