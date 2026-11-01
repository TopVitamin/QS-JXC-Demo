/**
 * 业务数据类型定义
 * 字段仅为演示用的代表性字段，不代表完整的业务主数据模型。
 * 后续对接真实接口时，以接口文档为准调整。
 */

/** 启用状态 */
export type EnableStatus = 'enabled' | 'disabled'

/** 商品 */
export interface Product {
  id: string
  code: string
  name: string
  spec: string
  category: string
  unit: string
  purchasePrice: number
  salePrice: number
  status: EnableStatus
  remark?: string
  updatedAt: string
}

/** 往来单位（供应商 / 客户），仅用于下拉选项展示 */
export interface Partner {
  id: string
  name: string
}

/** 仓库 */
export interface Warehouse {
  id: string
  name: string
}

/** 单据状态（仅用于展示，不包含状态流转规则） */
export type OrderStatus = 'draft' | 'pending' | 'approved' | 'partial' | 'completed' | 'closed'

/** 单据商品明细行 */
export interface OrderLine {
  id: string
  productCode: string
  productName: string
  spec: string
  unit: string
  quantity: number
  price: number
  remark?: string
}

/** 采购订单 */
export interface PurchaseOrder {
  id: string
  orderNo: string
  orderDate: string
  deliveryDate: string
  supplierId: string
  supplierName: string
  warehouseName: string
  buyer: string
  status: OrderStatus
  totalQuantity: number
  totalAmount: number
  creator: string
  createdAt: string
  remark?: string
  lines: OrderLine[]
}

/** 销售订单 */
export interface SalesOrder {
  id: string
  orderNo: string
  orderDate: string
  customerId: string
  customerName: string
  salesman: string
  warehouseName: string
  status: OrderStatus
  totalQuantity: number
  totalAmount: number
  creator: string
}

/** 库存记录 */
export interface StockItem {
  id: string
  skuCode: string
  productName: string
  spec: string
  category: string
  unit: string
  warehouseId: string
  warehouseName: string
  quantity: number
  safetyStock: number
  updatedAt: string
}

/** 状态标签色调 */
export type StatusTone = 'blue' | 'green' | 'orange' | 'red' | 'gray' | 'purple'

/** 下拉选项 */
export interface Option<T extends string = string> {
  label: string
  value: T
}
