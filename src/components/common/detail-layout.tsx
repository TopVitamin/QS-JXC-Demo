import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

/** 详情 / 表单页的内容分区卡片 */
export function SectionCard({
  title,
  extra,
  children,
  className,
  bodyClassName,
}: {
  title: ReactNode
  extra?: ReactNode
  children: ReactNode
  className?: string
  bodyClassName?: string
}) {
  return (
    <section className={cn('panel', className)}>
      <div className="flex h-11 items-center justify-between border-b px-4">
        <h2 className="flex items-center gap-2 text-sm font-medium before:h-3.5 before:w-0.75 before:rounded-full before:bg-primary">
          {title}
        </h2>
        {extra}
      </div>
      <div className={cn('p-4', bodyClassName)}>{children}</div>
    </section>
  )
}

export interface DescriptionItem {
  label: string
  value: ReactNode
  /** 占据的列数 */
  span?: number
}

/** 描述列表：用于详情页展示“标签：值” */
export function Descriptions({ items, columns = 3 }: { items: DescriptionItem[]; columns?: number }) {
  return (
    <dl className="grid gap-x-8 gap-y-3 text-sm" style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}>
      {items.map((item) => (
        <div key={item.label} className="flex min-w-0 gap-2" style={item.span ? { gridColumn: `span ${item.span}` } : undefined}>
          <dt className="w-[5.5em] shrink-0 text-muted-foreground">{item.label}</dt>
          <dd className="min-w-0 break-words text-foreground">{item.value ?? '-'}</dd>
        </div>
      ))}
    </dl>
  )
}

/** 页面底部固定操作栏（在内容区滚动容器内吸底；页面容器需为 flex 纵向布局且 min-h-full） */
export function FooterBar({ children, extra }: { children: ReactNode; extra?: ReactNode }) {
  return (
    <div className="sticky bottom-0 z-10 -mx-5 -mb-5 mt-auto flex items-center justify-between gap-3 border-t bg-card/95 px-5 py-3 backdrop-blur">
      <div className="text-sm text-muted-foreground">{extra}</div>
      <div className="flex items-center gap-2">{children}</div>
    </div>
  )
}
