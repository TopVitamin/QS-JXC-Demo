import { Download, Plus, Printer } from 'lucide-react'
import { Link, useNavigate } from 'react-router'
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
import { suppliers } from '@/mock/base'
import { purchaseOrders } from '@/mock/orders'
import type { PurchaseOrder } from '@/types'

interface OrderQuery {
  orderNo: string
  supplierId: string
  status: string
  dateFrom: string
  dateTo: string
}

const initialQuery: OrderQuery = { orderNo: '', supplierId: ALL, status: ALL, dateFrom: '', dateTo: '' }

const supplierOptions = suppliers.map((s) => ({ label: s.name, value: s.id }))

function filterOrder(o: PurchaseOrder, q: OrderQuery) {
  return (
    o.orderNo.toLowerCase().includes(q.orderNo.trim().toLowerCase()) &&
    (q.supplierId === ALL || o.supplierId === q.supplierId) &&
    (q.status === ALL || o.status === q.status) &&
    (!q.dateFrom || o.orderDate >= q.dateFrom) &&
    (!q.dateTo || o.orderDate <= q.dateTo)
  )
}

export default function PurchaseOrderListPage() {
  const navigate = useNavigate()
  const table = useLocalTable(purchaseOrders, initialQuery, filterOrder)
  const { draft, updateDraft } = table

  const columns: Column<PurchaseOrder>[] = [
    {
      key: 'orderNo',
      title: '单据编号',
      render: (o) => (
        <Link to={`/purchase/orders/${o.id}`} className="font-mono text-primary hover:underline">
          {o.orderNo}
        </Link>
      ),
    },
    { key: 'orderDate', title: '单据日期', width: 100 },
    { key: 'supplierName', title: '供应商' },
    { key: 'warehouseName', title: '入库仓库' },
    { key: 'buyer', title: '采购员', width: 72 },
    { key: 'totalQuantity', title: '采购数量', align: 'right', render: (o) => formatNumber(o.totalQuantity) },
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
      render: (o) => (
        <div className="flex items-center gap-3">
          <Button variant="link" size="xs" className="px-0" onClick={() => navigate(`/purchase/orders/${o.id}`)}>
            查看
          </Button>
          <Button variant="link" size="xs" className="px-0" onClick={() => notImplemented('编辑采购订单')}>
            编辑
          </Button>
          <Button variant="link" size="xs" className="px-0" onClick={() => notImplemented('打印')}>
            打印
          </Button>
        </div>
      ),
    },
  ]

  return (
    <PageContainer>
      <PageHeader title="采购订单" description="管理向供应商发起的采购订单，查看订单明细与执行情况" />

      <SearchPanel onSearch={table.search} onReset={table.reset}>
        <SearchField label="单据编号">
          <Input value={draft.orderNo} onChange={(e) => updateDraft({ orderNo: e.target.value })} placeholder="请输入单据编号" />
        </SearchField>
        <SearchField label="供应商">
          <OptionSelect value={draft.supplierId} onChange={(v) => updateDraft({ supplierId: v })} options={supplierOptions} withAll />
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
          <DateRange
            from={draft.dateFrom}
            to={draft.dateTo}
            onChange={(dateFrom, dateTo) => updateDraft({ dateFrom, dateTo })}
          />
        </SearchField>
      </SearchPanel>

      <TableCard
        title="订单列表"
        actions={
          <>
            <Button variant="outline" onClick={() => notImplemented('批量打印')}>
              <Printer />
              打印
            </Button>
            <Button variant="outline" onClick={() => notImplemented('导出')}>
              <Download />
              导出
            </Button>
            <Button onClick={() => navigate('/purchase/orders/new')}>
              <Plus />
              新建采购订单
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
