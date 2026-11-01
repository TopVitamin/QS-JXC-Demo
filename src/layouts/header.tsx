import { Fragment, type ReactNode, useState } from 'react'
import {
  Bell,
  CircleHelp,
  KeyRound,
  LogOut,
  Maximize,
  Minimize,
  PanelLeftClose,
  PanelLeftOpen,
  UserRound,
} from 'lucide-react'
import { Link, useLocation, useMatches } from 'react-router'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Separator } from '@/components/ui/separator'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { findMenuTrail } from '@/config/menu'
import { notImplemented } from '@/lib/demo'
import { cn } from '@/lib/utils'
import { notices as initialNotices } from '@/mock/dashboard'
import type { RouteHandle } from '@/router'

interface HeaderProps {
  collapsed: boolean
  onToggleSidebar: () => void
}

export function Header({ collapsed, onToggleSidebar }: HeaderProps) {
  return (
    <header className="flex h-14 shrink-0 items-center gap-3 border-b bg-card px-4">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" onClick={onToggleSidebar} aria-label="折叠侧边栏">
            {collapsed ? <PanelLeftOpen /> : <PanelLeftClose />}
          </Button>
        </TooltipTrigger>
        <TooltipContent>{collapsed ? '展开菜单' : '收起菜单'}</TooltipContent>
      </Tooltip>
      <Separator orientation="vertical" className="h-5!" />
      <PageBreadcrumb />
      <div className="ml-auto flex items-center gap-1">
        <IconAction label="帮助文档" onClick={() => notImplemented('帮助文档')}>
          <CircleHelp />
        </IconAction>
        <FullscreenAction />
        <NoticeAction />
        <Separator orientation="vertical" className="mx-2 h-5!" />
        <UserMenu />
      </div>
    </header>
  )
}

/** 面包屑：由菜单配置 + 路由 handle 推导 */
function PageBreadcrumb() {
  const { pathname } = useLocation()
  const matches = useMatches()
  const trail = findMenuTrail(pathname)
  const extraTitle = (matches.at(-1)?.handle as RouteHandle | undefined)?.title

  const crumbs: { title: string; to?: string }[] = []
  if (trail) {
    crumbs.push({ title: trail.group.title })
    crumbs.push({ title: trail.item.title, to: extraTitle ? trail.item.path : undefined })
  }
  if (extraTitle) crumbs.push({ title: extraTitle })
  if (crumbs.length === 0) crumbs.push({ title: '页面不存在' })

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {crumbs.map((c, i) => (
          <Fragment key={c.title}>
            {i > 0 && <BreadcrumbSeparator />}
            <BreadcrumbItem>
              {i === crumbs.length - 1 ? (
                <BreadcrumbPage className="font-medium">{c.title}</BreadcrumbPage>
              ) : c.to ? (
                <BreadcrumbLink asChild>
                  <Link to={c.to}>{c.title}</Link>
                </BreadcrumbLink>
              ) : (
                <span>{c.title}</span>
              )}
            </BreadcrumbItem>
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  )
}

function IconAction({ label, onClick, children }: { label: string; onClick?: () => void; children: ReactNode }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="ghost" size="icon" onClick={onClick} aria-label={label} className="text-muted-foreground">
          {children}
        </Button>
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  )
}

function FullscreenAction() {
  const [full, setFull] = useState(() => Boolean(document.fullscreenElement))
  const toggle = async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen()
      else await document.documentElement.requestFullscreen()
      setFull(Boolean(document.fullscreenElement))
    } catch {
      notImplemented('全屏')
    }
  }
  return (
    <IconAction label={full ? '退出全屏' : '全屏'} onClick={toggle}>
      {full ? <Minimize /> : <Maximize />}
    </IconAction>
  )
}

function NoticeAction() {
  const [notices, setNotices] = useState(initialNotices)
  const unread = notices.filter((n) => !n.read).length

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="通知消息" className="relative text-muted-foreground">
          <Bell />
          {unread > 0 && (
            <span className="absolute top-1 right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] leading-none text-white">
              {unread}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 gap-0 p-0">
        <div className="flex items-center justify-between border-b px-4 py-2.5">
          <span className="text-sm font-medium">通知消息</span>
          <Button
            variant="link"
            size="sm"
            className="h-auto p-0 text-xs"
            disabled={unread === 0}
            onClick={() => setNotices((list) => list.map((n) => ({ ...n, read: true })))}
          >
            全部已读
          </Button>
        </div>
        <ul className="max-h-72 overflow-y-auto">
          {notices.map((n) => (
            <li key={n.id} className="flex gap-2.5 border-b px-4 py-2.5 last:border-0 hover:bg-muted/60">
              <span className={cn('mt-1.5 size-1.5 shrink-0 rounded-full', n.read ? 'bg-transparent' : 'bg-primary')} />
              <div className="min-w-0">
                <p className={cn('text-[13px] leading-5', n.read && 'text-muted-foreground')}>{n.title}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{n.time}</p>
              </div>
            </li>
          ))}
        </ul>
        <button
          className="w-full border-t py-2 text-center text-xs text-muted-foreground hover:text-primary"
          onClick={() => notImplemented('消息中心')}
        >
          查看全部消息
        </button>
      </PopoverContent>
    </Popover>
  )
}

function UserMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-2 rounded-md px-1.5 py-1 outline-none hover:bg-muted">
        <Avatar className="size-7">
          <AvatarFallback className="bg-primary text-xs text-primary-foreground">管</AvatarFallback>
        </Avatar>
        <div className="text-left leading-tight">
          <div className="text-[13px] font-medium">系统管理员</div>
          <div className="text-xs text-muted-foreground">总部 · 管理员</div>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuLabel className="text-xs">admin@qs-jxc.demo</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={() => notImplemented('个人中心')}>
          <UserRound />
          个人中心
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => notImplemented('修改密码')}>
          <KeyRound />
          修改密码
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onSelect={() => notImplemented('退出登录')}>
          <LogOut />
          退出登录
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
