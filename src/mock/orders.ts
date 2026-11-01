import type { OrderLine, OrderStatus, PurchaseOrder, SalesOrder } from '@/types'
import { customers, products, staff, suppliers, warehouses } from './base'

/**
 * 采购 / 销售单据 Mock 数据
 * 使用确定性规则生成，保证每次刷新数据一致；金额仅为数量 × 单价的展示结果。
 */

const statusCycle: OrderStatus[] = ['pending', 'approved', 'completed', 'draft', 'partial', 'approved', 'completed', 'closed']

function pad(n: number, len = 2) {
  return String(n).padStart(len, '0')
}

/** 生成第 index 张单据的商品明细 */
function buildLines(index: number, priceKey: 'purchasePrice' | 'salePrice'): OrderLine[] {
  const count = 2 + (index % 4)
  return Array.from({ length: count }, (_, j) => {
    const p = products[(index * 3 + j * 5) % products.length]
    return {
      id: `${index}-${j}`,
      productCode: p.code,
      productName: p.name,
      spec: p.spec,
      unit: p.unit,
      quantity: 10 * (1 + ((index + j * 3) % 12)),
      price: p[priceKey],
    }
  })
}

function sum(lines: OrderLine[]) {
  return {
    totalQuantity: lines.reduce((s, l) => s + l.quantity, 0),
    totalAmount: Math.round(lines.reduce((s, l) => s + l.quantity * l.price, 0) * 100) / 100,
  }
}

export const purchaseOrders: PurchaseOrder[] = Array.from({ length: 32 }, (_, i) => {
  const day = 30 - (i % 30)
  const month = i < 30 ? 10 : 9
  const supplier = suppliers[i % suppliers.length]
  const lines = buildLines(i, 'purchasePrice')
  return {
    id: `PO${i + 1}`,
    orderNo: `CG2026${pad(month)}${pad(day)}${pad(i + 1, 3)}`,
    orderDate: `2026-${pad(month)}-${pad(day)}`,
    deliveryDate: `2026-${pad(month === 10 ? 11 : 10)}-${pad(((day + 6) % 28) + 1)}`,
    supplierId: supplier.id,
    supplierName: supplier.name,
    warehouseName: warehouses[i % warehouses.length].name,
    buyer: staff[i % staff.length],
    status: statusCycle[i % statusCycle.length],
    creator: staff[(i + 2) % staff.length],
    createdAt: `2026-${pad(month)}-${pad(day)} ${pad(9 + (i % 8))}:${pad((i * 13) % 60)}`,
    remark: i % 3 === 0 ? '请供应商随货附带质检报告' : undefined,
    lines,
    ...sum(lines),
  }
})

export const salesOrders: SalesOrder[] = Array.from({ length: 36 }, (_, i) => {
  const day = 31 - (i % 31)
  const customer = customers[i % customers.length]
  const lines = buildLines(i + 7, 'salePrice')
  return {
    id: `SO${i + 1}`,
    orderNo: `XS202610${pad(day)}${pad(i + 1, 3)}`,
    orderDate: `2026-10-${pad(day)}`,
    customerId: customer.id,
    customerName: customer.name,
    salesman: staff[(i + 3) % staff.length],
    warehouseName: warehouses[(i + 1) % warehouses.length].name,
    status: statusCycle[(i + 3) % statusCycle.length],
    creator: staff[(i + 1) % staff.length],
    ...sum(lines),
  }
})
