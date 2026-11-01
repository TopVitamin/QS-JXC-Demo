import type { StockItem } from '@/types'
import { products, warehouses } from './base'

/**
 * 库存 Mock 数据：每个商品分布在 2~3 个仓库
 * 数量为静态示例值，不涉及任何库存计算逻辑。
 */
export const stockItems: StockItem[] = products.flatMap((p, i) => {
  const whCount = 2 + (i % 2)
  return Array.from({ length: whCount }, (_, j) => {
    const wh = warehouses[(i + j) % warehouses.length]
    const quantity = ((i * 37 + j * 53) % 600) - (i % 9 === 0 && j === 0 ? 600 : 0)
    return {
      id: `${p.code}-${wh.id}`,
      skuCode: p.code,
      productName: p.name,
      spec: p.spec,
      category: p.category,
      unit: p.unit,
      warehouseId: wh.id,
      warehouseName: wh.name,
      quantity: Math.max(quantity, 0),
      safetyStock: 50 + (i % 4) * 25,
      updatedAt: `2026-10-${String(31 - ((i + j) % 10)).padStart(2, '0')} 18:00`,
    }
  })
})
