import { Suspense, useEffect, useRef, useState } from 'react'
import { Outlet, useLocation } from 'react-router'
import { PageLoading } from '@/components/common/page-loading'
import { isCompactTopbar, useAppearance } from '@/lib/theme'
import { Header } from './header'
import { Sidebar } from './sidebar'
import { TabsBar } from './tabs-bar'

const COLLAPSE_KEY = 'jxc.sidebar.collapsed'

function readCollapsed() {
  try {
    return localStorage.getItem(COLLAPSE_KEY) === '1'
  } catch {
    return false
  }
}

/** 后台通用布局：左侧菜单 + 顶部导航 + 右侧内容区（不依赖具体业务页面） */
export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(readCollapsed)
  // 页签“刷新页面”：变更 key 使当前页面重新挂载
  const [refreshKey, setRefreshKey] = useState(0)
  const { pathname } = useLocation()
  const appearance = useAppearance()
  const { tabs, breadcrumb } = appearance
  // 紧凑顶栏：页签上移到顶栏，折叠按钮移到侧边栏底部
  const compact = isCompactTopbar(appearance)
  const toggleSidebar = () => setCollapsed((v) => !v)
  const mainRef = useRef<HTMLElement>(null)

  useEffect(() => {
    try {
      localStorage.setItem(COLLAPSE_KEY, collapsed ? '1' : '0')
    } catch {
      // 浏览器禁用存储时忽略
    }
  }, [collapsed])

  const refresh = () => setRefreshKey((k) => k + 1)

  // 切换路由时内容区回到顶部
  useEffect(() => {
    mainRef.current?.scrollTo({ top: 0 })
  }, [pathname])

  return (
    <div className="flex h-screen min-w-[1280px] overflow-hidden bg-background">
      <Sidebar collapsed={collapsed} onToggle={compact ? toggleSidebar : undefined} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Header
          collapsed={collapsed}
          onToggleSidebar={compact ? undefined : toggleSidebar}
          showBreadcrumb={breadcrumb}
          // 关闭面包屑时，页签上移到顶栏，省出一行高度
          tabs={compact ? <TabsBar inline onRefresh={refresh} /> : undefined}
        />
        {tabs && breadcrumb && <TabsBar onRefresh={refresh} />}
        <main ref={mainRef} className="min-h-0 flex-1 overflow-y-auto">
          <Suspense fallback={<PageLoading />}>
            <div key={`${pathname}#${refreshKey}`} className="h-full">
              <Outlet />
            </div>
          </Suspense>
        </main>
      </div>
    </div>
  )
}
