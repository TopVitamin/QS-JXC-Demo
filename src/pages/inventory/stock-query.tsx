import { useEffect, useRef, useState } from 'react'
import { Download, RefreshCw } from 'lucide-react'
import { toast } from 'sonner'
import { type Column, DataTable, TableCard } from '@/components/common/data-table'
import { OptionSelect } from '@/components/common/option-select'
import { PageContainer, PageHeader } from '@/components/common/page-header'
import { SearchField, SearchPanel } from '@/components/common/search-panel'
import { StatusBadge } from '@/components/common/status-badge'
import { TablePagination } from '@/components/common/table-pagination'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useLocalTable } from '@/hooks/use-local-table'
import { notImplemented } from '@/lib/demo'
import { ALL } from '@/lib/dict'
import { formatNumber } from '@/lib/format'
import { cn } from '@/lib/utils'
import { warehouses } from '@/mock/base'
import { stockItems } from '@/mock/inventory'
import type { StockItem } from '@/types'

interface StockQuery {
  warehouseId: string
  skuCode: string
  productName: string
}

const initialQuery: StockQuery = { warehouseId: ALL, skuCode: '', productName: '' }

const warehouseOptions = warehouses.map((w) => ({ label: w.name, value: w.id }))

function filterStock(s: StockItem, q: StockQuery) {
  return (
    (q.warehouseId === ALL || s.warehouseId === q.warehouseId) &&
    s.skuCode.toLowerCase().includes(q.skuCode.trim().toLowerCase()) &&
    s.productName.includes(q.productName.trim())
  )
}

/** 库存提示：仅按 Mock 中的数量与安全库存做展示区分 */
function stockLevel(s: StockItem) {
  if (s.quantity === 0) return { label: '无库存', tone: 'red' } as const
  if (s.quantity < s.safetyStock) return { label: '低于安全库存', tone: 'orange' } as const
  return { label: '正常', tone: 'green' } as const
}

const columns: Column<StockItem>[] = [
  { key: 'skuCode', title: 'SKU编码', width: 110, render: (s) => <span className="font-mono">{s.skuCode}</span> },
  { key: 'productName', title: '商品名称', render: (s) => <span className="font-medium">{s.productName}</span> },
  { key: 'spec', title: '规格型号' },
  { key: 'category', title: '商品分类' },
  { key: 'warehouseName', title: '仓库' },
  { key: 'unit', title: '单位', width: 64, align: 'center' },
  {
    key: 'quantity',
    title: '库存数量',
    align: 'right',
    render: (s) => (
      <span className={cn('font-medium tabular-nums', s.quantity < s.safetyStock && 'text-amber-600', s.quantity === 0 && 'text-destructive')}>
        {formatNumber(s.quantity)}
      </span>
    ),
  },
  { key: 'safetyStock', title: '安全库存', align: 'right', render: (s) => formatNumber(s.safetyStock) },
  {
    key: 'level',
    title: '库存提示',
    width: 120,
    render: (s) => {
      const level = stockLevel(s)
      return <StatusBadge tone={level.tone}>{level.label}</StatusBadge>
    },
  },
  { key: 'updatedAt', title: '更新时间', width: 130, className: 'text-muted-foreground' },
]

export default function StockQueryPage() {
  const table = useLocalTable(stockItems, initialQuery, filterStock)
  const { draft, updateDraft } = table
  const [loading, setLoading] = useState(false)
  const timer = useRef<number>(undefined)

  useEffect(() => () => window.clearTimeout(timer.current), [])

  // 演示刷新：模拟一次加载过程，数据本身不变
  const refresh = () => {
    setLoading(true)
    timer.current = window.setTimeout(() => {
      setLoading(false)
      toast.success('库存数据已刷新')
    }, 600)
  }

  const totalQuantity = stockItems.reduce((s, i) => s + i.quantity, 0)
  const lowCount = stockItems.filter((i) => i.quantity < i.safetyStock).length

  return (
    <PageContainer>
      <PageHeader title="库存查询" description="按仓库、商品查看当前库存数量（演示数据，不涉及库存计算）" />

      <div className="grid grid-cols-3 gap-4">
        <Summary label="库存记录数" value={formatNumber(stockItems.length)} unit="条" />
        <Summary label="库存总数量" value={formatNumber(totalQuantity)} unit="件" />
        <Summary label="低于安全库存" value={formatNumber(lowCount)} unit="条" highlight />
      </div>

      <SearchPanel onSearch={table.search} onReset={table.reset}>
        <SearchField label="仓库">
          <OptionSelect value={draft.warehouseId} onChange={(v) => updateDraft({ warehouseId: v })} options={warehouseOptions} withAll />
        </SearchField>
        <SearchField label="商品编码">
          <Input value={draft.skuCode} onChange={(e) => updateDraft({ skuCode: e.target.value })} placeholder="请输入SKU编码" />
        </SearchField>
        <SearchField label="商品名称">
          <Input value={draft.productName} onChange={(e) => updateDraft({ productName: e.target.value })} placeholder="请输入商品名称" />
        </SearchField>
      </SearchPanel>

      <TableCard
        title="库存明细"
        actions={
          <>
            <Button variant="outline" onClick={refresh} disabled={loading}>
              <RefreshCw className={cn(loading && 'animate-spin')} />
              刷新
            </Button>
            <Button variant="outline" onClick={() => notImplemented('导出')}>
              <Download />
              导出
            </Button>
          </>
        }
        footer={<TablePagination {...table.pagination} />}
      >
        <DataTable columns={columns} data={table.pageData} rowKey={(s) => s.id} indexOffset={table.indexOffset} loading={loading} />
      </TableCard>
    </PageContainer>
  )
}

function Summary({ label, value, unit, highlight }: { label: string; value: string; unit: string; highlight?: boolean }) {
  return (
    <div className="flex items-baseline justify-between rounded-xl bg-card px-4 py-3 ring-1 ring-foreground/10">
      <span className="text-[13px] text-muted-foreground">{label}</span>
      <span>
        <span className={cn('text-xl font-semibold tabular-nums', highlight && 'text-amber-600')}>{value}</span>
        <span className="ml-1 text-xs text-muted-foreground">{unit}</span>
      </span>
    </div>
  )
}
