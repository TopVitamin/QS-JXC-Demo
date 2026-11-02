import { useState } from 'react'
import { format, parse } from 'date-fns'
import { CalendarDays, X } from 'lucide-react'
import type { Matcher } from 'react-day-picker'
import { zhCN } from 'react-day-picker/locale'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'

const DATE_FORMAT = 'yyyy-MM-dd'
const toDate = (value?: string) => (value ? parse(value, DATE_FORMAT, new Date()) : undefined)

interface DatePickerProps {
  /** yyyy-MM-dd，未选择时为空字符串 */
  value: string
  onChange: (value: string) => void
  placeholder?: string
  /** 可选的最早日期（yyyy-MM-dd） */
  min?: string
  /** 可选的最晚日期（yyyy-MM-dd） */
  max?: string
  invalid?: boolean
  className?: string
}

/** 日期选择：外观与输入框、下拉框一致，弹出中文日历；有值时悬停可清空 */
export function DatePicker({ value, onChange, placeholder = '请选择日期', min, max, invalid, className }: DatePickerProps) {
  const [open, setOpen] = useState(false)
  const selected = toDate(value)
  const disabled: Matcher[] = []
  if (min) disabled.push({ before: toDate(min)! })
  if (max) disabled.push({ after: toDate(max)! })

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-invalid={invalid || undefined}
          className={cn(
            'group flex h-8 w-full min-w-0 items-center gap-1.5 rounded-lg border border-input bg-transparent px-2.5 text-left text-sm outline-none transition-colors',
            'focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 data-[state=open]:border-ring',
            'aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20',
            className,
          )}
        >
          <span className={cn('flex-1 truncate', !value && 'text-muted-foreground')}>{value || placeholder}</span>
          <CalendarDays className={cn('size-4 shrink-0 text-muted-foreground', value && 'group-hover:hidden')} />
          {value && (
            <span
              role="button"
              aria-label="清空日期"
              onClick={(e) => {
                e.stopPropagation()
                onChange('')
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
          mode="single"
          locale={zhCN}
          selected={selected}
          defaultMonth={selected ?? toDate(min) ?? toDate(max)}
          disabled={disabled}
          onSelect={(date) => {
            onChange(date ? format(date, DATE_FORMAT) : '')
            setOpen(false)
          }}
        />
      </PopoverContent>
    </Popover>
  )
}
