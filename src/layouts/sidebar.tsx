import { useState } from 'react'
import { ChevronRight } from 'lucide-react'
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
import { ScrollArea } from '@/components/ui/scroll-area'
import { findMenuTrail, type MenuGroup, menuGroups } from '@/config/menu'
import { cn } from '@/lib/utils'

interface SidebarProps {
  collapsed: boolean
}

export function Sidebar({ collapsed }: SidebarProps) {
  const { pathname } = useLocation()
  const activeGroupKey = findMenuTrail(pathname)?.group.key

  return (
    <aside
      className={cn(
        'flex h-full shrink-0 flex-col border-r border-sidebar-border bg-sidebar transition-[width] duration-200',
        collapsed ? 'w-16' : 'w-56',
      )}
    >
      <Logo collapsed={collapsed} />
      <ScrollArea className="min-h-0 flex-1">
        <nav className="space-y-0.5 p-2">
          {menuGroups.map((group) =>
            collapsed ? (
              <CollapsedGroup key={group.key} group={group} active={group.key === activeGroupKey} />
            ) : (
              <ExpandedGroup key={group.key} group={group} active={group.key === activeGroupKey} />
            ),
          )}
        </nav>
      </ScrollArea>
      {!collapsed && (
        <div className="border-t border-sidebar-border px-4 py-2.5 text-xs text-muted-foreground">
          版本 v0.1.0 · 演示环境
        </div>
      )}
    </aside>
  )
}

function Logo({ collapsed }: { collapsed: boolean }) {
  return (
    <div className={cn('flex h-14 shrink-0 items-center gap-2.5 border-b border-sidebar-border', collapsed ? 'justify-center' : 'px-4')}>
      <img src="/favicon.svg" alt="" className="size-7 shrink-0" />
      {!collapsed && <span className="truncate text-[15px] font-semibold text-foreground">进销存管理系统</span>}
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
        className={cn(
          'flex h-9 w-full items-center gap-2.5 rounded-md px-3 text-sm text-sidebar-foreground transition-colors hover:bg-muted',
          active && 'font-medium text-sidebar-accent-foreground',
        )}
      >
        <Icon className="size-4 shrink-0" />
        <span className="flex-1 text-left">{group.title}</span>
        <ChevronRight className={cn('size-3.5 text-muted-foreground transition-transform', open && 'rotate-90')} />
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-0.5 py-0.5">
        {group.children.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                'relative flex h-8 items-center rounded-md pr-3 pl-9.5 text-[13px] text-sidebar-foreground/90 transition-colors hover:bg-muted',
                isActive &&
                  'bg-sidebar-accent font-medium text-sidebar-accent-foreground before:absolute before:inset-y-1.5 before:left-0 before:w-0.75 before:rounded-full before:bg-sidebar-primary hover:bg-sidebar-accent',
              )
            }
          >
            {item.title}
          </NavLink>
        ))}
      </CollapsibleContent>
    </Collapsible>
  )
}

/** 折叠状态：仅显示一级图标，点击弹出二级菜单 */
function CollapsedGroup({ group, active }: { group: MenuGroup; active: boolean }) {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const Icon = group.icon

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        title={group.title}
        className={cn(
          'flex h-10 w-full items-center justify-center rounded-md text-sidebar-foreground transition-colors outline-none hover:bg-muted',
          active && 'bg-sidebar-accent text-sidebar-accent-foreground',
        )}
      >
        <Icon className="size-[18px]" />
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
