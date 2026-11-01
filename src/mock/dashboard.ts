/**
 * 工作台 Mock 数据
 * 指标均为静态示例值，不代表真实计算口径。
 */

export interface StatMetric {
  key: string
  title: string
  value: number
  unit: string
  /** 环比变化百分比，正数上升 */
  change: number
}

export const statMetrics: StatMetric[] = [
  { key: 'purchase', title: '本月采购订单', value: 128, unit: '单', change: 12.5 },
  { key: 'sales', title: '本月销售订单', value: 356, unit: '单', change: 8.2 },
  { key: 'product', title: '商品总数', value: 1286, unit: '个', change: 2.1 },
  { key: 'sku', title: '库存SKU数', value: 3420, unit: '个', change: -1.4 },
]

export interface TrendPoint {
  label: string
  purchase: number
  sales: number
}

/** 近 7 日采购 / 销售金额（单位：万元） */
export const weeklyTrend: TrendPoint[] = [
  { label: '10-26', purchase: 12.4, sales: 18.6 },
  { label: '10-27', purchase: 8.9, sales: 15.2 },
  { label: '10-28', purchase: 15.6, sales: 21.3 },
  { label: '10-29', purchase: 10.2, sales: 19.8 },
  { label: '10-30', purchase: 18.3, sales: 24.5 },
  { label: '10-31', purchase: 13.7, sales: 22.1 },
  { label: '11-01', purchase: 6.8, sales: 11.4 },
]

export interface TodoItem {
  title: string
  count: number
  path: string
}

export const todoItems: TodoItem[] = [
  { title: '待审核采购订单', count: 6, path: '/purchase/orders' },
  { title: '待审核销售订单', count: 11, path: '/sales/orders' },
  { title: '待入库采购单', count: 4, path: '/purchase/inbound' },
  { title: '待出库销售单', count: 9, path: '/sales/outbound' },
  { title: '库存低于安全库存', count: 15, path: '/inventory/stock' },
  { title: '进行中的盘点任务', count: 1, path: '/inventory/stocktaking' },
]

export interface ActivityItem {
  user: string
  action: string
  target: string
  time: string
}

export const activities: ActivityItem[] = [
  { user: '张伟', action: '新建了采购订单', target: 'CG20261101001', time: '10 分钟前' },
  { user: '李娜', action: '审核了销售订单', target: 'XS20261031012', time: '35 分钟前' },
  { user: '王强', action: '完成了销售出库', target: 'CK20261031008', time: '1 小时前' },
  { user: '陈静', action: '修改了商品资料', target: 'SP0007 机械键盘', time: '2 小时前' },
  { user: '刘洋', action: '提交了库存盘点', target: 'PD20261031001', time: '昨天 17:42' },
  { user: '赵磊', action: '新增了客户', target: '南京同创物流有限公司', time: '昨天 15:10' },
]

export interface NoticeItem {
  id: string
  title: string
  time: string
  read: boolean
}

export const notices: NoticeItem[] = [
  { id: 'n1', title: '采购订单 CG20261101001 待您审核', time: '10 分钟前', read: false },
  { id: 'n2', title: '商品「机械键盘」在上海中心仓库存低于安全库存', time: '1 小时前', read: false },
  { id: 'n3', title: '销售订单 XS20261031012 已审核通过', time: '昨天 16:20', read: false },
  { id: 'n4', title: '系统将于本周六 22:00 进行例行维护', time: '2 天前', read: true },
]
