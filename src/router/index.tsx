import { type ComponentType, lazy, type LazyExoticComponent } from 'react'
import { createBrowserRouter, Navigate, type Params, type RouteObject } from 'react-router'
import { DEFAULT_PATH, menuGroups } from '@/config/menu'
import { purchaseOrders } from '@/mock/orders'
import AdminLayout from '@/layouts/admin-layout'
import NotFoundPage from '@/pages/not-found'
import PlaceholderPage from '@/pages/placeholder'

/** 路由附加信息：用于面包屑展示菜单之外的页面（详情、新建等） */
export interface RouteHandle {
  title?: string
  /** 页签标题；同一路由可打开多个页面时（如不同单据的详情），用单据编号区分 */
  tabTitle?: (params: Params) => string | undefined
}

type Page = LazyExoticComponent<ComponentType>

/** 已开发的页面：路径 → 页面组件（按需加载）。未注册的菜单使用占位页面 */
const pageRegistry: Record<string, Page> = {
  '/dashboard': lazy(() => import('@/pages/dashboard')),
  '/basic/products': lazy(() => import('@/pages/basic/product-list')),
  '/purchase/orders': lazy(() => import('@/pages/purchase/order-list')),
  '/sales/orders': lazy(() => import('@/pages/sales/order-list')),
  '/inventory/stock': lazy(() => import('@/pages/inventory/stock-query')),
}

const PurchaseOrderDetail = lazy(() => import('@/pages/purchase/order-detail'))
const PurchaseOrderCreate = lazy(() => import('@/pages/purchase/order-create'))

const menuRoutes: RouteObject[] = menuGroups.flatMap((group) =>
  group.children.map((item) => {
    const Page = pageRegistry[item.path]
    return {
      path: item.path,
      element: Page ? <Page /> : <PlaceholderPage />,
    }
  }),
)

/** 菜单之外的业务子页面 */
const subRoutes: RouteObject[] = [
  {
    path: '/purchase/orders/new',
    element: <PurchaseOrderCreate />,
    handle: { title: '新建采购订单' } satisfies RouteHandle,
  },
  {
    path: '/purchase/orders/:id',
    element: <PurchaseOrderDetail />,
    handle: {
      title: '采购订单详情',
      tabTitle: ({ id }) => purchaseOrders.find((o) => o.id === id)?.orderNo,
    } satisfies RouteHandle,
  },
]

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AdminLayout />,
    children: [
      { index: true, element: <Navigate to={DEFAULT_PATH} replace /> },
      ...menuRoutes,
      ...subRoutes,
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])
