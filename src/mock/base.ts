import type { Option, Partner, Product, Warehouse } from '@/types'

/**
 * 基础资料 Mock 数据
 * 仅用于前端演示，对接真实接口后替换为接口返回数据。
 */

export const productCategories: Option[] = [
  { label: '办公用品', value: '办公用品' },
  { label: '电子数码', value: '电子数码' },
  { label: '五金工具', value: '五金工具' },
  { label: '包装耗材', value: '包装耗材' },
  { label: '劳保用品', value: '劳保用品' },
]

export const units: Option[] = ['个', '件', '盒', '箱', '包', '台', '套', '把', '卷', '双'].map((u) => ({
  label: u,
  value: u,
}))

export const warehouses: Warehouse[] = [
  { id: 'WH01', name: '上海中心仓' },
  { id: 'WH02', name: '广州分仓' },
  { id: 'WH03', name: '成都分仓' },
  { id: 'WH04', name: '北京前置仓' },
]

export const suppliers: Partner[] = [
  { id: 'S001', name: '上海晨光文具有限公司' },
  { id: 'S002', name: '深圳华强电子科技有限公司' },
  { id: 'S003', name: '宁波永固五金制品厂' },
  { id: 'S004', name: '东莞恒丰包装材料有限公司' },
  { id: 'S005', name: '苏州安达劳保用品有限公司' },
  { id: 'S006', name: '杭州联创办公设备有限公司' },
]

export const customers: Partner[] = [
  { id: 'C001', name: '北京远航科技有限公司' },
  { id: 'C002', name: '上海锦程贸易有限公司' },
  { id: 'C003', name: '广州丰泽实业有限公司' },
  { id: 'C004', name: '成都蓉城商贸有限公司' },
  { id: 'C005', name: '武汉启明建设工程有限公司' },
  { id: 'C006', name: '南京同创物流有限公司' },
  { id: 'C007', name: '西安博远教育咨询有限公司' },
]

export const staff = ['张伟', '李娜', '王强', '刘洋', '陈静', '赵磊']

type ProductSeed = [code: string, name: string, spec: string, category: string, unit: string, purchase: number, sale: number]

const productSeeds: ProductSeed[] = [
  ['SP0001', 'A4复印纸', '70g 500张/包', '办公用品', '包', 18.5, 26],
  ['SP0002', '中性笔', '0.5mm 黑色', '办公用品', '盒', 12, 19.9],
  ['SP0003', '文件夹', 'A4 双强力夹', '办公用品', '个', 4.2, 8],
  ['SP0004', '订书机', '12号 标准型', '办公用品', '个', 9.8, 16.5],
  ['SP0005', '便利贴', '76×76mm 4色', '办公用品', '包', 3.6, 6.8],
  ['SP0006', '无线鼠标', '2.4G 静音款', '电子数码', '个', 32, 59],
  ['SP0007', '机械键盘', '104键 青轴', '电子数码', '个', 168, 259],
  ['SP0008', 'USB-C扩展坞', '6合1 铝合金', '电子数码', '个', 86, 149],
  ['SP0009', '移动硬盘', '1TB USB3.0', '电子数码', '个', 299, 399],
  ['SP0010', '显示器支架', '单屏 气压式', '电子数码', '台', 118, 199],
  ['SP0011', '十字螺丝刀', 'PH2×150mm', '五金工具', '把', 6.5, 12],
  ['SP0012', '电动扳手', '20V 锂电', '五金工具', '台', 268, 399],
  ['SP0013', '卷尺', '5m×19mm', '五金工具', '个', 8, 15],
  ['SP0014', '工具箱', '19寸 塑料', '五金工具', '个', 45, 79],
  ['SP0015', '膨胀螺丝', 'M8×80 100个/盒', '五金工具', '盒', 22, 36],
  ['SP0016', '瓦楞纸箱', '五层 400×300×300', '包装耗材', '个', 2.8, 4.5],
  ['SP0017', '封箱胶带', '48mm×100m 透明', '包装耗材', '卷', 4.5, 7.5],
  ['SP0018', '气泡膜', '宽50cm×50m', '包装耗材', '卷', 28, 45],
  ['SP0019', '打包带', 'PP 15mm 10kg', '包装耗材', '卷', 56, 85],
  ['SP0020', '快递袋', '28×42cm 100个/包', '包装耗材', '包', 15, 25],
  ['SP0021', '劳保手套', '丁腈浸胶 L码', '劳保用品', '双', 3.2, 5.8],
  ['SP0022', '安全帽', 'ABS 国标', '劳保用品', '个', 18, 32],
  ['SP0023', '反光背心', '荧光黄 均码', '劳保用品', '件', 9.5, 18],
  ['SP0024', '防护口罩', 'KN95 50只/盒', '劳保用品', '盒', 35, 59],
  ['SP0025', '劳保鞋', '防砸防刺 42码', '劳保用品', '双', 78, 128],
  ['SP0026', '白板笔', '可擦 蓝色 10支/盒', '办公用品', '盒', 11, 18],
]

export const products: Product[] = productSeeds.map(([code, name, spec, category, unit, purchase, sale], i) => ({
  id: code,
  code,
  name,
  spec,
  category,
  unit,
  purchasePrice: purchase,
  salePrice: sale,
  status: i % 7 === 5 ? 'disabled' : 'enabled',
  updatedAt: `2026-10-${String(28 - (i % 20)).padStart(2, '0')} ${String(9 + (i % 9)).padStart(2, '0')}:${String((i * 7) % 60).padStart(2, '0')}`,
}))
