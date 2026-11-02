import { type ReactNode, useState } from 'react'
import { Boxes, ChevronRight, PanelLeftClose, PanelLeftOpen } from 'lucide-react'
import { NavLink, useLocation, useNavigate } from 'react-router'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { ScrollArea } from '@/components/ui/scroll-area'
import { findMenuTrail, type MenuGroup, menuGroups } from '@/config/menu'
import { useAppearance } from '@/lib/theme'
import { cn } from '@/lib/utils'

interface SidebarProps {
  collapsed: boolean
  /** 传入时在侧边栏底部显示折叠按钮（紧凑顶栏下顶栏不再放折叠按钮） */
  onToggle?: () => void
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const { pathname } = useLocation()
  const { style } = useAppearance()
  const activeGroupKey = findMenuTrail(pathname)?.group.key

  if (style === 'split') return <SplitSidebar collapsed={collapsed} onToggle={onToggle} activeGroupKey={activeGroupKey} />

  return (
    <aside
      className={cn(
        'app-sidebar flex h-full shrink-0 flex-col transition-[width] duration-200',
        collapsed ? 'w-16' : 'w-56',
      )}
    >
      <Logo collapsed={collapsed} />
      <ScrollArea className="min-h-0 flex-1">
        <nav className="space-y-0.5 p-2">
          {menuGroups.map((group) =>
            collapsed ? (
              <CollapsedGroup
                key={group.key}
                group={group}
                active={group.key === activeGroupKey}
                className="menu-group menu-icon flex h-10 w-full items-center justify-center rounded-md"
              >
                <group.icon className="size-[18px]" />
              </CollapsedGroup>
            ) : (
              <ExpandedGroup key={group.key} group={group} active={group.key === activeGroupKey} />
            ),
          )}
        </nav>
      </ScrollArea>
      <SidebarFooter collapsed={collapsed} onToggle={onToggle} />
    </aside>
  )
}

function SidebarFooter({ collapsed, onToggle }: SidebarProps) {
  if (!onToggle) return collapsed ? null : <div className="sidebar-footer px-4 py-2.5 text-xs">版本 v0.1.0 · 演示环境</div>
  return (
    <div className={cn('sidebar-footer flex h-10 shrink-0 items-center text-xs', collapsed ? 'justify-center' : 'justify-between pr-2 pl-4')}>
      {!collapsed && <span>版本 v0.1.0 · 演示环境</span>}
      <SidebarToggle collapsed={collapsed} onToggle={onToggle} className="size-7" />
    </div>
  )
}

function SidebarToggle({ collapsed, onToggle, className }: { collapsed: boolean; onToggle: () => void; className: string }) {
  return (
    <button
      onClick={onToggle}
      title={collapsed ? '展开菜单' : '收起菜单'}
      aria-label={collapsed ? '展开菜单' : '收起菜单'}
      className={cn('sidebar-toggle flex items-center justify-center rounded-md', className)}
    >
      {collapsed ? <PanelLeftOpen className="size-4" /> : <PanelLeftClose className="size-4" />}
    </button>
  )
}

/**
 * 分栏导航：常驻的图标栏只放一级分组，点击后在右侧浮出二级菜单，选择后自动收起，不占用内容区宽度
 * 收起侧边栏时隐藏图标下方的文字，图标栏变窄
 */
function SplitSidebar({ collapsed, onToggle, activeGroupKey }: SidebarProps & { activeGroupKey?: string }) {
  const navigate = useNavigate()
  const [openKey, setOpenKey] = useState<string>()
  const railItem = cn(
    'rail-item flex w-full flex-col items-center justify-center gap-1 rounded-md text-xs outline-none',
    collapsed ? 'h-10' : 'h-14',
  )

  return (
    <aside className={cn('nav-rail flex h-full shrink-0 flex-col transition-[width] duration-200', collapsed ? 'w-16' : 'w-[76px]')}>
      <div className="flex h-(--header-h) shrink-0 items-center justify-center">
        <span className="app-logo-mark flex size-8 items-center justify-center rounded-md">
          <Boxes className="size-5" />
        </span>
      </div>
      <nav className="flex flex-col gap-1 p-2">
        {menuGroups.map((group) => {
          const Icon = group.icon
          const trigger = (
            <button
              data-active={group.key === activeGroupKey}
              data-open={group.key === openKey}
              title={collapsed ? group.title : undefined}
              // 只有一个子菜单的分组直接进入页面
              onClick={group.children.length === 1 ? () => navigate(group.children[0].path) : undefined}
              className={railItem}
            >
              <Icon className="size-5" />
              {!collapsed && group.title}
            </button>
          )
          if (group.children.length === 1) return <div key={group.key}>{trigger}</div>

          return (
            <Popover key={group.key} open={openKey === group.key} onOpenChange={(open) => setOpenKey(open ? group.key : undefined)}>
              <PopoverTrigger asChild>{trigger}</PopoverTrigger>
              <PopoverContent side="right" align="start" sideOffset={10} className="flyout w-48 gap-0 p-0">
                <div className="flyout-title px-4 py-2.5 text-sm font-semibold">{group.title}</div>
                <nav className="space-y-0.5 p-1.5">
                  {group.children.map((item) => (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={() => setOpenKey(undefined)}
                      className="subnav-item flex h-9 items-center rounded-md px-3 text-sm"
                    >
                      {item.title}
                    </NavLink>
                  ))}
                </nav>
              </PopoverContent>
            </Popover>
          )
        })}
      </nav>
      {onToggle && (
        <div className="mt-auto flex justify-center pb-2">
          <SidebarToggle collapsed={collapsed} onToggle={onToggle} className="rail-item size-9" />
        </div>
      )}
    </aside>
  )
}

function Logo({ collapsed }: { collapsed: boolean }) {
  return (
    <div className={cn('app-logo flex h-(--header-h) shrink-0 items-center gap-2.5', collapsed ? 'justify-center' : 'px-4')}>
      <span className="app-logo-mark flex size-8 shrink-0 items-center justify-center rounded-md">
        <Boxes className="size-[18px]" />
      </span>
      {!collapsed && <span className="truncate text-base font-semibold tracking-wide">进销存管理系统</span>}
    </div>
  )
}

/** 展开状态：分组可展开 / 收起，二级菜单选中高亮 */
function ExpandedGroup({ group, active }: { group: MenuGroup; active: boolean }) {
  const [open, setOpen] = useState(active)
  const [wasActive, setWasActive] = useState(active)
  const Icon = group.icon

  // 路由切换到本分组时自动展开
  if (active !== wasActive) {
    setWasActive(active)
    if (active) setOpen(true)
  }

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger
        data-active={active}
        className="menu-group flex h-10 w-full items-center gap-2.5 rounded-md px-3 text-sm"
      >
        <Icon className="size-4 shrink-0" />
        <span className="flex-1 text-left">{group.title}</span>
        <ChevronRight className={cn('size-3.5 opacity-60 transition-transform', open && 'rotate-90')} />
      </CollapsibleTrigger>
      <CollapsibleContent className="submenu space-y-0.5 rounded-md py-1">
        {group.children.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className="menu-item mx-1 flex h-9 items-center rounded-md pr-3 pl-9 text-sm"
          >
            {item.title}
          </NavLink>
        ))}
      </CollapsibleContent>
    </Collapsible>
  )
}

interface CollapsedGroupProps {
  group: MenuGroup
  active: boolean
  className: string
  children: ReactNode
}

/** 折叠状态：仅显示一级入口，点击弹出二级菜单 */
function CollapsedGroup({ group, active, className, children }: CollapsedGroupProps) {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger title={group.title} data-active={active} className={cn(className, 'outline-none')}>
        {children}
      </DropdownMenuTrigger>
      <DropdownMenuContent side="right" align="start" sideOffset={10} className="w-40">
        <DropdownMenuLabel>{group.title}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {group.children.map((item) => (
          <DropdownMenuItem
            key={item.path}
            onSelect={() => navigate(item.path)}
            className={cn(pathname.startsWith(item.path) && 'font-medium text-primary')}
          >
            {item.title}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
