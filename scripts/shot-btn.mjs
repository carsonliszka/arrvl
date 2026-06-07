import { chromium } from 'playwright'

const browser = await chromium.launch()
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 })
const page = await ctx.newPage()
await page.addInitScript(() => { try { localStorage.setItem('cookie-consent', 'allow') } catch {} })
await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' })
await page.waitForTimeout(4500)
const clip = { x: 740, y: 490, width: 320, height: 160 }
await page.screenshot({ path: 'btn-rest.png', clip })
await page.getByText('Take a look').first().hover()
await page.waitForTimeout(700)
await page.screenshot({ path: 'btn-hover.png', clip })
await browser.close()
console.log('ok')
