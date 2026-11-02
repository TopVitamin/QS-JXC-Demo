import { useState } from 'react'
import { format, parse, subMonths } from 'date-fns'
import { CalendarDays, X } from 'lucide-react'
import type { DateRange as DayRange } from 'react-day-picker'
import { zhCN } from 'react-day-picker/locale'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'

const DATE_FORMAT = 'yyyy-MM-dd'
const toDate = (value: string) => (value ? parse(value, DATE_FORMAT, new Date()) : undefined)
const toValue = (date?: Date) => (date ? format(date, DATE_FORMAT) : '')

interface DateRangeProps {
  /** yyyy-MM-dd，未选择时为空字符串 */
  from: string
  to: string
  onChange: (from: string, to: string) => void
}

/** 日期区间：一个输入框显示「开始 ~ 结束」，弹出双月日历，依次点选开始、结束日期后自动收起 */
export function DateRange({ from, to, onChange }: DateRangeProps) {
  const [open, setOpen] = useState(false)
  // 本次弹出后已点选的次数：第二次点选（结束日期）后收起
  const [clicks, setClicks] = useState(0)
  // 查询多为回看历史数据，未选择时默认显示上月与本月
  const [initialMonth] = useState(() => subMonths(new Date(), 1))
  const selected: DayRange | undefined = from ? { from: toDate(from), to: toDate(to) } : undefined
  const hasValue = Boolean(from || to)

  return (
    <Popover
      open={open}
      onOpenChange={(next) => {
        setOpen(next)
        setClicks(0)
      }}
    >
      <PopoverTrigger asChild>
        <button
          type="button"
          className="group flex h-8 w-full min-w-0 items-center gap-1.5 rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 data-[state=open]:border-ring"
        >
          <span className={cn('flex-1 truncate text-center', !from && 'text-muted-foreground')}>{from || '开始日期'}</span>
          <span className="text-muted-foreground">~</span>
          <span className={cn('flex-1 truncate text-center', !to && 'text-muted-foreground')}>{to || '结束日期'}</span>
          <CalendarDays className={cn('size-4 shrink-0 text-muted-foreground', hasValue && 'group-hover:hidden')} />
          {hasValue && (
            <span
              role="button"
              aria-label="清空日期"
              onClick={(e) => {
                e.stopPropagation()
                onChange('', '')
              }}
              className="hidden size-4 shrink-0 items-center justify-center rounded-full bg-muted-foreground/30 text-white group-hover:flex hover:bg-muted-foreground/50"
            >
              <X className="size-3" />
            </span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-auto p-0">
        <Calendar
          mode="range"
          locale={zhCN}
          numberOfMonths={2}
          selected={selected}
          defaultMonth={selected?.from ?? initialMonth}
          onSelect={(range) => {
            onChange(toValue(range?.from), toValue(range?.to))
            if (clicks >= 1) setOpen(false)
            setClicks((n) => n + 1)
          }}
        />
      </PopoverContent>
    </Popover>
  )
}
