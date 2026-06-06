import { chromium } from 'playwright'
import { pathToFileURL } from 'node:url'
import { resolve } from 'node:path'

const file = pathToFileURL(resolve('404-styles-preview.html')).href
const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1440, height: 1500 }, deviceScaleFactor: 2 })
await page.goto(file, { waitUntil: 'networkidle' })
await page.waitForTimeout(600) // let webfonts settle
await page.screenshot({ path: '404-styles-preview.png', fullPage: true })
await browser.close()
console.log('ok')
