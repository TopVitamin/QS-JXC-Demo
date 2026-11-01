import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

/** 页面级加载状态（路由懒加载、整页数据加载时使用） */
export function PageLoading({ text = '加载中...', className }: { text?: string; className?: string }) {
  return (
    <div className={cn('flex h-full min-h-60 items-center justify-center gap-2 text-sm text-muted-foreground', className)}>
      <Loader2 className="size-4 animate-spin text-primary" />
      {text}
    </div>
  )
}
