import { chromium } from 'playwright'

const browser = await chromium.launch({ headless: true })
const page = await browser.newPage({ viewport: { width: 1366, height: 900 } })
const errors = []
page.on('pageerror', (error) => errors.push(error.message))
page.on('console', (message) => {
  if (message.type() === 'error') errors.push(message.text())
})

await page.goto('http://127.0.0.1:38406/tree', { waitUntil: 'domcontentloaded' })
await page.evaluate(async () => {
  localStorage.clear()
  sessionStorage.clear()
  await indexedDB.deleteDatabase('legacytree-db')
})
await page.reload({ waitUntil: 'networkidle' })
await page.getByRole('img', { name: '交互式家谱树' }).waitFor()
await page.getByPlaceholder('搜索成员').fill('林建国')
await page.getByPlaceholder('搜索成员').press('Enter')
await page.getByText('查看详情').waitFor()

await page.goto('http://127.0.0.1:38406/stories', { waitUntil: 'networkidle' })
await page.getByText('家族故事').waitFor()
await page.getByPlaceholder('故事标题').fill('端到端验证故事')
await page.getByPlaceholder('故事正文').fill('Playwright 写入的验证内容')
await page.getByRole('button', { name: '保存故事' }).click()
await page.getByText('端到端验证故事').waitFor()

await page.goto('http://127.0.0.1:38406/photos', { waitUntil: 'networkidle' })
await page.getByRole('button', { name: '上传示例照片' }).click()
await page.getByRole('button', { name: '新上传的待修复照片' }).first().waitFor()
await page.getByRole('button', { name: '修复' }).first().click()
await page.waitForTimeout(500)

await page.goto('http://127.0.0.1:38406/legacy', { waitUntil: 'networkidle' })
await page.getByRole('heading', { name: '数字资产、纪念品与信件交接' }).waitFor()
await page.getByPlaceholder('规划内容').fill('验证数字资产交接清单')
await page.getByRole('button', { name: '保存草稿' }).click()
await page.getByText('验证数字资产交接清单').waitFor()

await page.goto('http://127.0.0.1:38406/settings', { waitUntil: 'networkidle' })
await page.getByPlaceholder('设置或修改加密密码').fill('legacy-tree-test')
await page.getByRole('button', { name: '保存密码' }).click()
await page.getByText('密钥已在本次会话解锁').waitFor()
await page.getByText('深色').click()

await browser.close()

if (errors.length) {
  console.error(errors.join('\n'))
  process.exit(1)
}

console.log('Playwright smoke passed')
