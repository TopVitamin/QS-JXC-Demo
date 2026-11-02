import type { ReactNode } from 'react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { StatusTone } from '@/types'

const toneClass: Record<StatusTone, string> = {
  primary: 'bg-info/10 text-info ring-info/25',
  green: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  orange: 'bg-amber-50 text-amber-700 ring-amber-200',
  red: 'bg-red-50 text-red-700 ring-red-200',
  gray: 'bg-slate-100 text-slate-600 ring-slate-200',
  purple: 'bg-violet-50 text-violet-700 ring-violet-200',
}

const dotClass: Record<StatusTone, string> = {
  primary: 'bg-info',
  green: 'bg-emerald-500',
  orange: 'bg-amber-500',
  red: 'bg-red-500',
  gray: 'bg-slate-400',
  purple: 'bg-violet-500',
}

interface StatusBadgeProps {
  tone: StatusTone
  children: ReactNode
  className?: string
}

/** 状态标签：统一的色调映射，状态文案与色调由 lib/dict.ts 维护 */
export function StatusBadge({ tone, children, className }: StatusBadgeProps) {
  return (
    <Badge className={cn('rounded-sm font-normal ring-1 ring-inset', toneClass[tone], className)}>
      <span className={cn('size-1.5 rounded-full', dotClass[tone])} />
      {children}
    </Badge>
  )
}
