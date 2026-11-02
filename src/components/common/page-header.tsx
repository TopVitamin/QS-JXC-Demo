import type { ReactNode } from 'react'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface PageHeaderProps {
  title: ReactNode
  description?: ReactNode
  /** 标题右侧的附加信息，如状态标签 */
  extra?: ReactNode
  /** 右侧主要操作按钮 */
  actions?: ReactNode
  /** 传入后在标题前显示返回按钮 */
  onBack?: () => void
  className?: string
}

/** 页面标题与操作栏 */
export function PageHeader({ title, description, extra, actions, onBack, className }: PageHeaderProps) {
  return (
    <div className={cn('flex items-start justify-between gap-4', className)}>
      <div className="flex min-w-0 items-start gap-2">
        {onBack && (
          <Button variant="ghost" size="icon-sm" className="-ml-1 mt-px" onClick={onBack} aria-label="返回">
            <ArrowLeft />
          </Button>
        )}
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="truncate text-lg font-semibold text-foreground">{title}</h1>
            {extra}
          </div>
          {description && <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>}
        </div>
      </div>
      {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
    </div>
  )
}

/** 页面内容容器：统一页面内边距与区块间距 */
export function PageContainer({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('space-y-4 p-5', className)}>{children}</div>
}
