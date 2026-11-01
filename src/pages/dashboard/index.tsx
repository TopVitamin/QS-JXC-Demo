import {
  ArrowDownRight,
  ArrowUpRight,
  Boxes,
  ChevronRight,
  ClipboardList,
  FilePlus2,
  type LucideIcon,
  PackagePlus,
  PackageSearch,
  ShoppingCart,
  Truck,
  UserPlus,
  Warehouse,
} from 'lucide-react'
import { Link, useNavigate } from 'react-router'
import { PageContainer } from '@/components/common/page-header'
import { Card, CardAction, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { formatNumber } from '@/lib/format'
import { cn } from '@/lib/utils'
import { activities, statMetrics, todoItems, weeklyTrend } from '@/mock/dashboard'

const statIcons: Record<string, { icon: LucideIcon; className: string }> = {
  purchase: { icon: ShoppingCart, className: 'bg-blue-50 text-blue-600' },
  sales: { icon: Truck, className: 'bg-emerald-50 text-emerald-600' },
  product: { icon: PackageSearch, className: 'bg-amber-50 text-amber-600' },
  sku: { icon: Boxes, className: 'bg-violet-50 text-violet-600' },
}

const shortcuts: { title: string; icon: LucideIcon; path: string }[] = [
  { title: '新建采购', icon: FilePlus2, path: '/purchase/orders/new' },
  { title: '采购订单', icon: ShoppingCart, path: '/purchase/orders' },
  { title: '销售订单', icon: Truck, path: '/sales/orders' },
  { title: '库存查询', icon: PackageSearch, path: '/inventory/stock' },
  { title: '商品管理', icon: PackagePlus, path: '/basic/products' },
  { title: '库存盘点', icon: ClipboardList, path: '/inventory/stocktaking' },
  { title: '客户管理', icon: UserPlus, path: '/basic/customers' },
  { title: '仓库管理', icon: Warehouse, path: '/basic/warehouses' },
]

function greeting() {
  const h = new Date().getHours()
  if (h < 6) return '凌晨好'
  if (h < 12) return '上午好'
  if (h < 14) return '中午好'
  if (h < 18) return '下午好'
  return '晚上好'
}

export default function DashboardPage() {
  const date = new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })

  return (
    <PageContainer>
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-lg font-semibold">{greeting()}，系统管理员</h1>
          <p className="mt-0.5 text-[13px] text-muted-foreground">今天是 {date}，以下为业务概览（演示数据）</p>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {statMetrics.map((m) => {
          const { icon: Icon, className } = statIcons[m.key]
          const up = m.change >= 0
          return (
            <Card key={m.key} size="sm" className="gap-0 px-4 py-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-[13px] text-muted-foreground">{m.title}</div>
                  <div className="mt-2 flex items-baseline gap-1">
                    <span className="text-2xl font-semibold tabular-nums">{formatNumber(m.value)}</span>
                    <span className="text-xs text-muted-foreground">{m.unit}</span>
                  </div>
                </div>
                <div className={cn('flex size-10 items-center justify-center rounded-lg', className)}>
                  <Icon className="size-5" />
                </div>
              </div>
              <div className="mt-3 flex items-center gap-1 border-t pt-3 text-xs text-muted-foreground">
                较上月
                <span className={cn('flex items-center font-medium', up ? 'text-emerald-600' : 'text-red-600')}>
                  {up ? <ArrowUpRight className="size-3.5" /> : <ArrowDownRight className="size-3.5" />}
                  {Math.abs(m.change)}%
                </span>
              </div>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>近 7 日业务趋势</CardTitle>
            <CardAction>
              <Legend />
            </CardAction>
          </CardHeader>
          <CardContent>
            <TrendChart />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>待处理事项</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            {todoItems.map((t) => (
              <Link
                key={t.title}
                to={t.path}
                className="flex items-center justify-between rounded-md px-2 py-2 text-[13px] transition-colors hover:bg-muted"
              >
                <span>{t.title}</span>
                <span className="flex items-center gap-1">
                  <span className="min-w-6 rounded bg-primary/10 px-1.5 text-center font-medium text-primary">{t.count}</span>
                  <ChevronRight className="size-3.5 text-muted-foreground" />
                </span>
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>常用功能</CardTitle>
          </CardHeader>
          <CardContent>
            <Shortcuts />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>最近动态</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="relative space-y-3.5 border-l border-dashed pl-4">
              {activities.map((a, i) => (
                <li key={i} className="relative text-[13px]">
                  <span className="absolute top-1.5 -left-[20.5px] size-2 rounded-full border-2 border-card bg-primary ring-2 ring-primary/20" />
                  <p className="leading-5">
                    <span className="font-medium">{a.user}</span> {a.action}{' '}
                    <span className="text-primary">{a.target}</span>
                  </p>
                  <p className="text-xs text-muted-foreground">{a.time}</p>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  )
}

function Legend() {
  return (
    <div className="flex items-center gap-4 text-xs text-muted-foreground">
      <span className="flex items-center gap-1.5">
        <span className="size-2.5 rounded-sm bg-chart-1" />
        采购金额
      </span>
      <span className="flex items-center gap-1.5">
        <span className="size-2.5 rounded-sm bg-chart-2" />
        销售金额
      </span>
      <span>单位：万元</span>
    </div>
  )
}

/** 简易柱状图：纯 CSS 实现，不引入图表库 */
function TrendChart() {
  const max = 30
  const ticks = [30, 20, 10, 0]
  return (
    <div className="flex h-60 gap-2">
      <div className="flex flex-col justify-between pb-6 text-right text-xs text-muted-foreground tabular-nums">
        {ticks.map((t) => (
          <span key={t} className="-translate-y-1/2 first:translate-y-0 last:translate-y-0">
            {t}
          </span>
        ))}
      </div>
      <div className="relative flex flex-1 flex-col">
        <div className="absolute inset-x-0 top-0 bottom-6 flex flex-col justify-between">
          {ticks.map((t) => (
            <div key={t} className="border-t border-dashed border-border" />
          ))}
        </div>
        <div className="relative flex flex-1 items-end justify-around">
          {weeklyTrend.map((p) => (
            <Tooltip key={p.label}>
              <TooltipTrigger asChild>
                <div className="flex h-full w-14 items-end justify-center gap-1 rounded-t-md hover:bg-muted/60">
                  <div className="w-4 rounded-t-sm bg-chart-1" style={{ height: `${(p.purchase / max) * 100}%` }} />
                  <div className="w-4 rounded-t-sm bg-chart-2" style={{ height: `${(p.sales / max) * 100}%` }} />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <div className="font-medium">{p.label}</div>
                <div>采购：{p.purchase} 万元</div>
                <div>销售：{p.sales} 万元</div>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
        <div className="flex h-6 items-end justify-around text-xs text-muted-foreground">
          {weeklyTrend.map((p) => (
            <span key={p.label} className="w-14 text-center">
              {p.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

function Shortcuts() {
  const navigate = useNavigate()
  return (
    <div className="grid grid-cols-4 gap-3">
      {shortcuts.map((s) => (
        <button
          key={s.title}
          onClick={() => navigate(s.path)}
          className="group flex items-center gap-3 rounded-lg border px-3 py-3 text-left text-[13px] transition-colors hover:border-primary/40 hover:bg-primary/5"
        >
          <span className="flex size-8 items-center justify-center rounded-md bg-muted text-muted-foreground transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
            <s.icon className="size-4" />
          </span>
          {s.title}
        </button>
      ))}
    </div>
  )
}
