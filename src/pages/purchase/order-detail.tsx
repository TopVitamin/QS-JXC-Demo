import { FileSearch, Printer } from 'lucide-react'
import { useNavigate, useParams } from 'react-router'
import { type Column, DataTable } from '@/components/common/data-table'
import { Descriptions, FooterBar, SectionCard } from '@/components/common/detail-layout'
import { EmptyState } from '@/components/common/empty-state'
import { PageContainer, PageHeader } from '@/components/common/page-header'
import { StatusBadge } from '@/components/common/status-badge'
import { Button } from '@/components/ui/button'
import { notImplemented } from '@/lib/demo'
import { orderStatusDict } from '@/lib/dict'
import { formatMoney, formatNumber } from '@/lib/format'
import { purchaseOrders } from '@/mock/orders'
import type { OrderLine } from '@/types'

const lineColumns: Column<OrderLine>[] = [
  { key: 'productCode', title: '商品编码', width: 110, render: (l) => <span className="font-mono">{l.productCode}</span> },
  { key: 'productName', title: '商品名称', render: (l) => <span className="font-medium">{l.productName}</span> },
  { key: 'spec', title: '规格型号' },
  { key: 'unit', title: '单位', width: 64, align: 'center' },
  { key: 'quantity', title: '采购数量', align: 'right', render: (l) => formatNumber(l.quantity) },
  { key: 'price', title: '单价', align: 'right', render: (l) => formatMoney(l.price) },
  { key: 'amount', title: '金额', align: 'right', render: (l) => formatMoney(l.quantity * l.price) },
  { key: 'remark', title: '备注', render: (l) => l.remark ?? '-' },
]

export default function PurchaseOrderDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const order = purchaseOrders.find((o) => o.id === id)
  const back = () => navigate('/purchase/orders')

  if (!order) {
    return (
      <PageContainer>
        <PageHeader title="采购订单详情" onBack={back} />
        <div className="rounded-xl bg-card ring-1 ring-foreground/10">
          <EmptyState
            icon={FileSearch}
            className="py-20"
            title="未找到该采购订单"
            description="单据可能已被删除，或链接地址有误"
            action={<Button onClick={back}>返回列表</Button>}
          />
        </div>
      </PageContainer>
    )
  }

  const status = orderStatusDict[order.status]

  return (
    <PageContainer className="flex min-h-full flex-col">
      <PageHeader
        title={`采购订单 ${order.orderNo}`}
        extra={<StatusBadge tone={status.tone}>{status.label}</StatusBadge>}
        description={`制单人：${order.creator}　创建时间：${order.createdAt}`}
        onBack={back}
        actions={
          <Button variant="outline" onClick={() => notImplemented('打印')}>
            <Printer />
            打印
          </Button>
        }
      />

      <SectionCard title="基本信息">
        <Descriptions
          items={[
            { label: '单据编号', value: <span className="font-mono">{order.orderNo}</span> },
            { label: '单据日期', value: order.orderDate },
            { label: '交货日期', value: order.deliveryDate },
            { label: '供应商', value: order.supplierName },
            { label: '入库仓库', value: order.warehouseName },
            { label: '采购员', value: order.buyer },
            { label: '单据状态', value: <StatusBadge tone={status.tone}>{status.label}</StatusBadge> },
            { label: '制单人', value: order.creator },
            { label: '创建时间', value: order.createdAt },
            { label: '备注', value: order.remark ?? '-', span: 3 },
          ]}
        />
      </SectionCard>

      <SectionCard
        title="商品明细"
        extra={<span className="text-xs text-muted-foreground">共 {order.lines.length} 种商品</span>}
        bodyClassName="p-0"
      >
        <DataTable columns={lineColumns} data={order.lines} rowKey={(l) => l.id} />
        <div className="flex justify-end gap-8 border-t bg-muted/40 px-4 py-3 text-[13px]">
          <span>
            数量合计：<span className="font-medium">{formatNumber(order.totalQuantity)}</span>
          </span>
          <span>
            金额合计：<span className="text-base font-semibold text-primary">{formatMoney(order.totalAmount)}</span>
          </span>
        </div>
      </SectionCard>

      <FooterBar extra="审核、入库等业务操作为演示入口，暂未实现业务处理">
        <Button variant="outline" onClick={back}>
          返回
        </Button>
        <Button variant="outline" onClick={() => notImplemented('编辑')}>
          编辑
        </Button>
        <Button variant="outline" onClick={() => notImplemented('生成入库单')}>
          生成入库单
        </Button>
        <Button onClick={() => notImplemented('审核')}>审核</Button>
      </FooterBar>
    </PageContainer>
  )
}
