import { chromium } from 'playwright'

const browser = await chromium.launch()

// desktop
const page = await browser.newPage({ viewport: { width: 1440, height: 820 }, deviceScaleFactor: 2 })
await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' })
await page.waitForTimeout(4200) // banner appears after a 3s delay
await page.screenshot({ path: 'cookie-desktop.png' })

// close crop on the banner
const el = await page.$('text=We use cookies')
if (el) {
  const bar = await page.evaluateHandle((node) => node.closest('div'), el)
  await bar.asElement()?.screenshot({ path: 'cookie-bar.png' })
}

// mobile (stacked layout)
const m = await browser.newPage({ viewport: { width: 390, height: 780 }, deviceScaleFactor: 2 })
await m.goto('http://localhost:3000/', { waitUntil: 'networkidle' })
await m.waitForTimeout(4200)
await m.screenshot({ path: 'cookie-mobile.png' })

await browser.close()
console.log('ok')
