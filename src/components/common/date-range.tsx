import { Input } from '@/components/ui/input'

interface DateRangeProps {
  from: string
  to: string
  onChange: (from: string, to: string) => void
}

/** 日期区间：两个原生日期输入框 */
export function DateRange({ from, to, onChange }: DateRangeProps) {
  return (
    <div className="flex items-center gap-1.5">
      <Input type="date" value={from} max={to || undefined} onChange={(e) => onChange(e.target.value, to)} className="min-w-0 flex-1 px-2" />
      <span className="text-muted-foreground">~</span>
      <Input type="date" value={to} min={from || undefined} onChange={(e) => onChange(from, e.target.value)} className="min-w-0 flex-1 px-2" />
    </div>
  )
}
