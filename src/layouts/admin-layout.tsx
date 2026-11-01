import { Suspense, useEffect, useRef, useState } from 'react'
import { Outlet, useLocation } from 'react-router'
import { PageLoading } from '@/components/common/page-loading'
import { Header } from './header'
import { Sidebar } from './sidebar'

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
  const { pathname } = useLocation()
  const mainRef = useRef<HTMLElement>(null)

  useEffect(() => {
    try {
      localStorage.setItem(COLLAPSE_KEY, collapsed ? '1' : '0')
    } catch {
      // 浏览器禁用存储时忽略
    }
  }, [collapsed])

  // 切换路由时内容区回到顶部
  useEffect(() => {
    mainRef.current?.scrollTo({ top: 0 })
  }, [pathname])

  return (
    <div className="flex h-screen min-w-[1280px] overflow-hidden bg-background">
      <Sidebar collapsed={collapsed} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Header collapsed={collapsed} onToggleSidebar={() => setCollapsed((v) => !v)} />
        <main ref={mainRef} className="min-h-0 flex-1 overflow-y-auto">
          <Suspense fallback={<PageLoading />}>
            <Outlet />
          </Suspense>
        </main>
      </div>
    </div>
  )
}
