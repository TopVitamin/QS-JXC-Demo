import { useEffect, useRef, useState } from 'react'
import {
  ArrowLeftToLine,
  ArrowRightToLine,
  ChevronDown,
  FoldHorizontal,
  type LucideIcon,
  RotateCw,
  X,
  XCircle,
} from 'lucide-react'
import { useLocation, useMatches, useNavigate } from 'react-router'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from '@/components/ui/context-menu'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { DEFAULT_PATH, findMenuTrail } from '@/config/menu'
import { CLOSE_TAB_EVENT, type CloseTabDetail } from '@/lib/tabs'
import { cn } from '@/lib/utils'
import type { RouteHandle } from '@/router'

interface PageTab {
  path: string
  title: string
}

const STORAGE_KEY = 'jxc.tabs'
/** 固定页签：始终存在、不可关闭 */
const HOME_TAB: PageTab = { path: DEFAULT_PATH, title: '首页概览' }

function readTabs(): PageTab[] {
  try {
    const list = JSON.parse(sessionStorage.getItem(STORAGE_KEY) ?? '[]') as PageTab[]
    return [HOME_TAB, ...list.filter((t) => t.path !== HOME_TAB.path)]
  } catch {
    return [HOME_TAB]
  }
}

type CloseAction = 'current' | 'others' | 'left' | 'right' | 'all'

interface TabsBarProps {
  /** 刷新当前页：由布局重新挂载页面 */
  onRefresh: () => void
  /** 嵌入顶栏显示（关闭面包屑时） */
  inline?: boolean
}

/** 多页签栏：记录打开过的页面，支持切换、关闭和右键批量关闭 */
export function TabsBar({ onRefresh, inline }: TabsBarProps) {
  const { pathname } = useLocation()
  const matches = useMatches()
  const navigate = useNavigate()
  const [tabs, setTabs] = useState<PageTab[]>(readTabs)
  const activeRef = useRef<HTMLDivElement>(null)

  // 当前路由不在页签中时追加（未匹配菜单的 404 页面不加入）
  const lastMatch = matches.at(-1)
  const handle = lastMatch?.handle as RouteHandle | undefined
  const title = (lastMatch && handle?.tabTitle?.(lastMatch.params)) ?? handle?.title ?? findMenuTrail(pathname)?.item.title
  // 仅在路由变化时追加，避免关闭当前页签后、跳转完成前又被加回
  const [lastPath, setLastPath] = useState<string>()
  if (pathname !== lastPath) {
    setLastPath(pathname)
    const existing = tabs.find((t) => t.path === pathname)
    if (title && !existing) setTabs([...tabs, { path: pathname, title }])
    // 已有页签的标题过时（如旧会话保存的标题）时同步更新
    else if (title && existing && existing.title !== title && pathname !== HOME_TAB.path)
      setTabs(tabs.map((t) => (t.path === pathname ? { ...t, title } : t)))
  }

  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(tabs))
    } catch {
      // 浏览器禁用存储时忽略
    }
  }, [tabs])

  // 业务页面主动关闭页签（如新建页取消 / 提交后）
  useEffect(() => {
    const onClose = (e: Event) => {
      const { path, to } = (e as CustomEvent<CloseTabDetail>).detail
      e.preventDefault()
      setTabs((list) => list.filter((t) => t.path !== path || t.path === HOME_TAB.path))
      navigate(to)
    }
    window.addEventListener(CLOSE_TAB_EVENT, onClose)
    return () => window.removeEventListener(CLOSE_TAB_EVENT, onClose)
  }, [navigate])

  useEffect(() => {
    activeRef.current?.scrollIntoView({ block: 'nearest', inline: 'nearest' })
  }, [pathname])

  const close = (action: CloseAction, target: string) => {
    const index = tabs.findIndex((t) => t.path === target)
    const keep = (t: PageTab, i: number) => {
      if (t.path === HOME_TAB.path) return true
      switch (action) {
        case 'current':
          return t.path !== target
        case 'others':
          return t.path === target
        case 'left':
          return i >= index
        case 'right':
          return i <= index
        case 'all':
          return false
      }
    }
    const next = tabs.filter(keep)
    setTabs(next)
    // 当前页被关闭时：关闭当前则跳到左侧相邻页签，批量关闭则停留在操作的页签
    if (!next.some((t) => t.path === pathname)) {
      const fallback = action === 'current' ? next[Math.min(index, next.length) - 1] : next.find((t) => t.path === target)
      navigate((fallback ?? HOME_TAB).path)
    }
  }

  const activeIndex = tabs.findIndex((t) => t.path === pathname)

  return (
    <div className={inline ? 'app-tabs-inline flex min-w-0 flex-1 items-stretch' : 'app-tabs flex h-10 shrink-0 items-stretch'}>
      <div className={cn('app-tabs-list flex min-w-0 flex-1 overflow-x-auto [scrollbar-width:none]', !inline && 'px-3')}>
        {tabs.map((tab, i) => {
          const active = tab.path === pathname
          const closable = tab.path !== HOME_TAB.path
          return (
            <ContextMenu key={tab.path}>
              <ContextMenuTrigger asChild>
                <div
                  ref={active ? activeRef : undefined}
                  onClick={() => navigate(tab.path)}
                  onAuxClick={(e) => e.button === 1 && closable && close('current', tab.path)}
                  data-active={active}
                  title={tab.title}
                  className="page-tab text-sm"
                >
                  {tab.title}
                  {closable && (
                    <button
                      aria-label={`关闭${tab.title}`}
                      onClick={(e) => {
                        e.stopPropagation()
                        close('current', tab.path)
                      }}
                      className="page-tab-close"
                    >
                      <X className="size-3" />
                    </button>
                  )}
                </div>
              </ContextMenuTrigger>
              <ContextMenuContent className="w-36">
                <TabMenuItems
                  as="context"
                  canRefresh={active}
                  closable={closable}
                  hasLeft={tabs.slice(1, i).length > 0}
                  hasRight={i < tabs.length - 1}
                  hasOthers={tabs.some((t) => t.path !== tab.path && t.path !== HOME_TAB.path)}
                  onRefresh={onRefresh}
                  onClose={(action) => close(action, tab.path)}
                />
              </ContextMenuContent>
            </ContextMenu>
          )
        })}
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger
          aria-label="页签操作"
          title="页签操作"
          className="app-tabs-more mx-1.5 flex size-8 shrink-0 items-center justify-center self-center rounded-md outline-none"
        >
          <ChevronDown className="size-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-36">
          <TabMenuItems
            as="dropdown"
            canRefresh
            closable={pathname !== HOME_TAB.path && activeIndex >= 0}
            hasLeft={activeIndex > 1}
            hasRight={activeIndex >= 0 && activeIndex < tabs.length - 1}
            hasOthers={tabs.some((t) => t.path !== pathname && t.path !== HOME_TAB.path)}
            onRefresh={onRefresh}
            onClose={(action) => close(action, pathname)}
          />
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

interface TabMenuItemsProps {
  as: 'context' | 'dropdown'
  canRefresh: boolean
  closable: boolean
  hasLeft: boolean
  hasRight: boolean
  hasOthers: boolean
  onRefresh: () => void
  onClose: (action: CloseAction) => void
}

/** 右键菜单与下拉菜单共用的页签操作项 */
function TabMenuItems({ as, canRefresh, closable, hasLeft, hasRight, hasOthers, onRefresh, onClose }: TabMenuItemsProps) {
  const Item = as === 'context' ? ContextMenuItem : DropdownMenuItem
  const Separator = as === 'context' ? ContextMenuSeparator : DropdownMenuSeparator
  const entry = (icon: LucideIcon, label: string, disabled: boolean, onSelect: () => void) => {
    const Icon = icon
    return (
      <Item disabled={disabled} onSelect={onSelect}>
        <Icon />
        {label}
      </Item>
    )
  }

  return (
    <>
      {entry(RotateCw, '刷新页面', !canRefresh, onRefresh)}
      {entry(X, '关闭当前', !closable, () => onClose('current'))}
      <Separator />
      {entry(FoldHorizontal, '关闭其他', !hasOthers, () => onClose('others'))}
      {entry(ArrowLeftToLine, '关闭左侧', !hasLeft, () => onClose('left'))}
      {entry(ArrowRightToLine, '关闭右侧', !hasRight, () => onClose('right'))}
      <Separator />
      {entry(XCircle, '关闭全部', false, () => onClose('all'))}
    </>
  )
}
