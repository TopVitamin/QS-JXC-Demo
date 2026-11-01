import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ALL } from '@/lib/dict'
import type { Option } from '@/types'

interface OptionSelectProps {
  value: string
  onChange: (value: string) => void
  options: Option[]
  placeholder?: string
  /** 在选项最前面增加“全部”（值为 ALL），用于筛选条件 */
  withAll?: boolean
  className?: string
}

/** 基于选项数组的下拉框，减少筛选区和表单中的重复代码 */
export function OptionSelect({ value, onChange, options, placeholder = '请选择', withAll, className }: OptionSelectProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className={className ?? 'w-full'}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent position="popper">
        {withAll && <SelectItem value={ALL}>全部</SelectItem>}
        {options.map((o) => (
          <SelectItem key={o.value} value={o.value}>
            {o.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
