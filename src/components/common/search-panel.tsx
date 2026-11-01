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

/** 搜索筛选区域：栅格排列筛选项，右侧固定查询 / 重置按钮；回车即查询 */
export function SearchPanel({ children, onSearch, onReset }: SearchPanelProps) {
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    onSearch()
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-xl bg-card p-4 ring-1 ring-foreground/10">
      <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-x-6 gap-y-3">
        {children}
        <div className="col-[-2/-1] flex items-center justify-end gap-2">
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

/** 单个筛选项：左侧标签 + 右侧控件 */
export function SearchField({ label, children, className }: SearchFieldProps) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <Label className="w-[4.5em] shrink-0 justify-end text-[13px] font-normal text-muted-foreground">{label}</Label>
      <div className="min-w-0 flex-1 *:w-full">{children}</div>
    </div>
  )
}
