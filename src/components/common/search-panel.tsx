import type { FormEvent, ReactNode } from 'react'
import { RotateCcw, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

interface SearchPanelProps {
  children: ReactNode
  onSearch: () => void
  onReset: () => void
}

/** 搜索筛选区域：栅格排列筛选项（标签在上），右下角为查询 / 重置按钮；回车即查询 */
export function SearchPanel({ children, onSearch, onReset }: SearchPanelProps) {
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    onSearch()
  }

  return (
    <form onSubmit={handleSubmit} className="panel p-4">
      <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-x-4 gap-y-3">
        {children}
        <div className="col-[-2/-1] flex items-end justify-end gap-2">
          <Button type="submit">
            <Search />
            查询
          </Button>
          <Button type="button" variant="outline" onClick={onReset}>
            <RotateCcw />
            重置
          </Button>
        </div>
      </div>
    </form>
  )
}

interface SearchFieldProps {
  label: string
  children: ReactNode
  className?: string
}

/** 单个筛选项：标签在上、控件在下 */
export function SearchField({ label, children, className }: SearchFieldProps) {
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <Label className="text-sm font-normal text-muted-foreground">{label}</Label>
      <div className="min-w-0 *:w-full">{children}</div>
    </div>
  )
}
