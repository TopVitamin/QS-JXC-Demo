import type { EnableStatus, Option, OrderStatus, StatusTone } from '@/types'

/** 状态字典：统一维护状态的显示文案与标签色调 */
interface DictItem {
  label: string
  tone: StatusTone
}

export const enableStatusDict: Record<EnableStatus, DictItem> = {
  enabled: { label: '启用', tone: 'green' },
  disabled: { label: '停用', tone: 'gray' },
}

export const orderStatusDict: Record<OrderStatus, DictItem> = {
  draft: { label: '草稿', tone: 'gray' },
  pending: { label: '待审核', tone: 'orange' },
  approved: { label: '已审核', tone: 'primary' },
  partial: { label: '部分完成', tone: 'purple' },
  completed: { label: '已完成', tone: 'green' },
  closed: { label: '已关闭', tone: 'red' },
}

/** 将字典转为下拉选项 */
export function dictToOptions<T extends string>(dict: Record<T, DictItem>): Option<T>[] {
  return (Object.keys(dict) as T[]).map((value) => ({ value, label: dict[value].label }))
}

/** 下拉框中代表“全部”的值（Radix Select 不允许空字符串作为值） */
export const ALL = 'all'
