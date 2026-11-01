import { Download, Plus } from 'lucide-react'
import { type Column, DataTable, TableCard } from '@/components/common/data-table'
import { DateRange } from '@/components/common/date-range'
import { OptionSelect } from '@/components/common/option-select'
import { PageContainer, PageHeader } from '@/components/common/page-header'
import { SearchField, SearchPanel } from '@/components/common/search-panel'
import { StatusBadge } from '@/components/common/status-badge'
import { TablePagination } from '@/components/common/table-pagination'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useLocalTable } from '@/hooks/use-local-table'
import { notImplemented } from '@/lib/demo'
import { ALL, dictToOptions, orderStatusDict } from '@/lib/dict'
import { formatMoney, formatNumber } from '@/lib/format'
import { customers } from '@/mock/base'
import { salesOrders } from '@/mock/orders'
import type { SalesOrder } from '@/types'

interface OrderQuery {
  orderNo: string
  customerId: string
  status: string
  dateFrom: string
  dateTo: string
}

const initialQuery: OrderQuery = { orderNo: '', customerId: ALL, status: ALL, dateFrom: '', dateTo: '' }

const customerOptions = customers.map((c) => ({ label: c.name, value: c.id }))

function filterOrder(o: SalesOrder, q: OrderQuery) {
  return (
    o.orderNo.toLowerCase().includes(q.orderNo.trim().toLowerCase()) &&
    (q.customerId === ALL || o.customerId === q.customerId) &&
    (q.status === ALL || o.status === q.status) &&
    (!q.dateFrom || o.orderDate >= q.dateFrom) &&
    (!q.dateTo || o.orderDate <= q.dateTo)
  )
}

const columns: Column<SalesOrder>[] = [
  {
    key: 'orderNo',
    title: '单据编号',
    render: (o) => (
      <button className="font-mono text-primary hover:underline" onClick={() => notImplemented('销售订单详情')}>
        {o.orderNo}
      </button>
    ),
  },
  { key: 'orderDate', title: '单据日期', width: 100 },
  { key: 'customerName', title: '客户' },
  { key: 'warehouseName', title: '出库仓库' },
  { key: 'salesman', title: '业务员', width: 72 },
  { key: 'totalQuantity', title: '销售数量', align: 'right', render: (o) => formatNumber(o.totalQuantity) },
  { key: 'totalAmount', title: '金额合计', align: 'right', render: (o) => <span className="font-medium">{formatMoney(o.totalAmount)}</span> },
  {
    key: 'status',
    title: '单据状态',
    width: 96,
    render: (o) => <StatusBadge tone={orderStatusDict[o.status].tone}>{orderStatusDict[o.status].label}</StatusBadge>,
  },
  { key: 'creator', title: '制单人', width: 72 },
  {
    key: 'actions',
    title: '操作',
    width: 140,
    fixedRight: true,
    render: () => (
      <div className="flex items-center gap-3">
        <Button variant="link" size="xs" className="px-0" onClick={() => notImplemented('查看销售订单')}>
          查看
        </Button>
        <Button variant="link" size="xs" className="px-0" onClick={() => notImplemented('编辑销售订单')}>
          编辑
        </Button>
        <Button variant="link" size="xs" className="px-0" onClick={() => notImplemented('打印')}>
          打印
        </Button>
      </div>
    ),
  },
]

/** 销售订单列表：复用通用列表组件，详情与新建暂未开发 */
export default function SalesOrderListPage() {
  const table = useLocalTable(salesOrders, initialQuery, filterOrder)
  const { draft, updateDraft } = table

  return (
    <PageContainer>
      <PageHeader title="销售订单" description="管理客户销售订单，跟踪订单执行情况" />

      <SearchPanel onSearch={table.search} onReset={table.reset}>
        <SearchField label="单据编号">
          <Input value={draft.orderNo} onChange={(e) => updateDraft({ orderNo: e.target.value })} placeholder="请输入单据编号" />
        </SearchField>
        <SearchField label="客户">
          <OptionSelect value={draft.customerId} onChange={(v) => updateDraft({ customerId: v })} options={customerOptions} withAll />
        </SearchField>
        <SearchField label="单据状态">
          <OptionSelect
            value={draft.status}
            onChange={(v) => updateDraft({ status: v })}
            options={dictToOptions(orderStatusDict)}
            withAll
          />
        </SearchField>
        <SearchField label="单据日期">
          <DateRange from={draft.dateFrom} to={draft.dateTo} onChange={(dateFrom, dateTo) => updateDraft({ dateFrom, dateTo })} />
        </SearchField>
      </SearchPanel>

      <TableCard
        title="订单列表"
        actions={
          <>
            <Button variant="outline" onClick={() => notImplemented('导出')}>
              <Download />
              导出
            </Button>
            <Button onClick={() => notImplemented('新建销售订单')}>
              <Plus />
              新建销售订单
            </Button>
          </>
        }
        footer={<TablePagination {...table.pagination} />}
      >
        <DataTable columns={columns} data={table.pageData} rowKey={(o) => o.id} indexOffset={table.indexOffset} />
      </TableCard>
    </PageContainer>
  )
}
