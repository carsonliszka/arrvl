import { chromium } from 'playwright'

const browser = await chromium.launch()
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3 })
const page = await ctx.newPage()
await page.goto('http://localhost:3000/this-page-does-not-exist', { waitUntil: 'networkidle' })
// force the touch/no-cursor variant (Playwright can't emulate the pointer media feature)
await page.addStyleTag({
  content: '.nf-fine{display:none!important}.nf-coarse{display:block!important}',
})
await page.waitForTimeout(700)
await page.screenshot({ path: '404-mobile.png' })
await browser.close()
console.log('ok')
