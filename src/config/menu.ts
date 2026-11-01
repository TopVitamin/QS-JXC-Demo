import {
  Boxes,
  Database,
  LayoutDashboard,
  type LucideIcon,
  Settings,
  ShoppingCart,
  Truck,
} from 'lucide-react'

/**
 * 菜单配置（集中管理）
 * - 一级菜单为分组，二级菜单对应具体路由
 * - 新增页面：在此处添加菜单项，并在 router/index.tsx 的 pageRegistry 中注册页面组件；
 *   未注册的菜单自动使用统一占位页面
 */

export interface MenuItem {
  title: string
  path: string
}

export interface MenuGroup {
  key: string
  title: string
  icon: LucideIcon
  children: MenuItem[]
}

export const menuGroups: MenuGroup[] = [
  {
    key: 'workbench',
    title: '工作台',
    icon: LayoutDashboard,
    children: [{ title: '首页概览', path: '/dashboard' }],
  },
  {
    key: 'basic',
    title: '基础资料',
    icon: Database,
    children: [
      { title: '商品管理', path: '/basic/products' },
      { title: '供应商管理', path: '/basic/suppliers' },
      { title: '客户管理', path: '/basic/customers' },
      { title: '仓库管理', path: '/basic/warehouses' },
    ],
  },
  {
    key: 'purchase',
    title: '采购管理',
    icon: ShoppingCart,
    children: [
      { title: '采购订单', path: '/purchase/orders' },
      { title: '采购入库单', path: '/purchase/inbound' },
      { title: '采购退货单', path: '/purchase/returns' },
    ],
  },
  {
    key: 'sales',
    title: '销售管理',
    icon: Truck,
    children: [
      { title: '销售订单', path: '/sales/orders' },
      { title: '销售出库单', path: '/sales/outbound' },
      { title: '销售退货单', path: '/sales/returns' },
    ],
  },
  {
    key: 'inventory',
    title: '库存管理',
    icon: Boxes,
    children: [
      { title: '库存查询', path: '/inventory/stock' },
      { title: '出入库流水', path: '/inventory/transactions' },
      { title: '库存盘点', path: '/inventory/stocktaking' },
      { title: '其他入库单', path: '/inventory/other-inbound' },
      { title: '其他出库单', path: '/inventory/other-outbound' },
    ],
  },
  {
    key: 'system',
    title: '系统管理',
    icon: Settings,
    children: [
      { title: '用户管理', path: '/system/users' },
      { title: '角色管理', path: '/system/roles' },
    ],
  },
]

export const DEFAULT_PATH = '/dashboard'

/** 根据路径查找所属菜单分组与菜单项（支持子路径，如 /purchase/orders/new） */
export function findMenuTrail(pathname: string): { group: MenuGroup; item: MenuItem } | undefined {
  for (const group of menuGroups) {
    for (const item of group.children) {
      if (pathname === item.path || pathname.startsWith(`${item.path}/`)) {
        return { group, item }
      }
    }
  }
  return undefined
}
