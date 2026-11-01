const moneyFormatter = new Intl.NumberFormat('zh-CN', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

const numberFormatter = new Intl.NumberFormat('zh-CN')

/** 金额：1234.5 → ¥1,234.50 */
export function formatMoney(value: number) {
  return `¥${moneyFormatter.format(value)}`
}

/** 数量：12345 → 12,345 */
export function formatNumber(value: number) {
  return numberFormatter.format(value)
}

/** 当前日期 yyyy-MM-dd */
export function today() {
  const d = new Date()
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

/** 当前时间 yyyy-MM-dd HH:mm */
export function now() {
  const d = new Date()
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${today()} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}
