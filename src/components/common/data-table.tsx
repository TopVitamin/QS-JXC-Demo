import type { ReactNode } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { cn } from '@/lib/utils'
import { EmptyState } from './empty-state'

export interface Column<T> {
  key: string
  title: ReactNode
  /** 自定义渲染；不传时按 key 读取字段值 */
  render?: (row: T, index: number) => ReactNode
  width?: number | string
  align?: 'left' | 'center' | 'right'
  /** 固定在右侧（常用于操作列） */
  fixedRight?: boolean
  className?: string
}

interface DataTableProps<T> {
  columns: Column<T>[]
  data: T[]
  rowKey: (row: T) => string
  loading?: boolean
  /** 序号起始值（分页时传入当前页偏移量） */
  indexOffset?: number
  showIndex?: boolean
  emptyText?: string
}

const alignClass = { left: 'text-left', center: 'text-center', right: 'text-right' } as const

/**
 * 通用数据表格：基于 shadcn/ui Table 的轻量封装
 * 仅处理列渲染、序号、加载与空状态，不包含排序、拖拽等复杂能力。
 */
export function DataTable<T>({
  columns,
  data,
  rowKey,
  loading,
  indexOffset = 0,
  showIndex = true,
  emptyText,
}: DataTableProps<T>) {
  const colCount = columns.length + (showIndex ? 1 : 0)

  return (
    <Table className="text-sm">
      {/* 表头与悬停行使用不透明的混合色，保证固定列与普通列颜色一致 */}
      <TableHeader className="bg-(--table-head-bg)">
        <TableRow className="hover:bg-transparent">
          {showIndex && <TableHead className="w-14 text-center text-muted-foreground">序号</TableHead>}
          {columns.map((col) => (
            <TableHead
              key={col.key}
              style={{ width: col.width }}
              className={cn(
                'h-9 px-3 text-sm text-muted-foreground',
                alignClass[col.align ?? 'left'],
                col.fixedRight && 'sticky right-0 bg-(--table-head-bg) shadow-[-1px_0_0_var(--border)]',
              )}
            >
              {col.title}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {loading ? (
          Array.from({ length: 6 }, (_, i) => (
            <TableRow key={i} className="hover:bg-transparent">
              {Array.from({ length: colCount }, (_, j) => (
                <TableCell key={j} className="px-3 py-2.5">
                  <Skeleton className="h-4 w-full" />
                </TableCell>
              ))}
            </TableRow>
          ))
        ) : data.length === 0 ? (
          <TableRow className="hover:bg-transparent">
            <TableCell colSpan={colCount}>
              <EmptyState description={emptyText ?? '没有找到符合条件的数据，请调整查询条件后重试'} />
            </TableCell>
          </TableRow>
        ) : (
          data.map((row, i) => (
            <TableRow key={rowKey(row)} className="group hover:bg-(--table-row-hover)">
              {showIndex && <TableCell className="text-center text-muted-foreground">{indexOffset + i + 1}</TableCell>}
              {columns.map((col) => (
                <TableCell
                  key={col.key}
                  className={cn(
                    'px-3 py-2',
                    alignClass[col.align ?? 'left'],
                    col.fixedRight && 'sticky right-0 bg-card shadow-[-1px_0_0_var(--border)] group-hover:bg-(--table-row-hover)',
                    col.className,
                  )}
                >
                  {col.render ? col.render(row, i) : String((row as Record<string, unknown>)[col.key] ?? '-')}
                </TableCell>
              ))}
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  )
}

interface TableCardProps {
  /** 表格左上方标题或统计信息 */
  title?: ReactNode
  /** 表格右上方操作按钮 */
  actions?: ReactNode
  children: ReactNode
  footer?: ReactNode
}

/** 表格容器：统一的工具栏 + 表格 + 底部（分页）结构 */
export function TableCard({ title, actions, children, footer }: TableCardProps) {
  return (
    <div className="overflow-hidden panel">
      {(title || actions) && (
        <div className="flex items-center justify-between gap-3 px-4 py-3">
          <div className="text-sm font-medium">{title}</div>
          <div className="flex items-center gap-2">{actions}</div>
        </div>
      )}
      <div className="border-t">{children}</div>
      {footer && <div className="border-t px-4 py-3">{footer}</div>}
    </div>
  )
}
