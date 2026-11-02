import { Check, Palette, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Switch } from '@/components/ui/switch'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import {
  type Appearance,
  applyAppearance,
  DEFAULT_APPEARANCE,
  styles,
  themes,
  useAppearance,
} from '@/lib/theme'
import { cn } from '@/lib/utils'

/** 界面设置：右上角入口，选择界面风格与主题色 */
export function AppearancePanel() {
  const appearance = useAppearance()
  const update = (patch: Partial<Appearance>) => applyAppearance({ ...appearance, ...patch })

  return (
    <Popover>
      <Tooltip>
        <TooltipTrigger asChild>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="界面设置" className="text-muted-foreground">
              <Palette />
            </Button>
          </PopoverTrigger>
        </TooltipTrigger>
        <TooltipContent>界面设置</TooltipContent>
      </Tooltip>
      <PopoverContent align="end" className="w-[340px] gap-4 p-4">
        <section className="space-y-2.5">
          <h3 className="text-sm font-medium">界面风格</h3>
          <div className="grid grid-cols-2 gap-2.5">
            {styles.map((s) => {
              const selected = appearance.style === s.key
              return (
                <button
                  key={s.key}
                  onClick={() => update({ style: s.key })}
                  className={cn(
                    'rounded-md border p-1.5 text-left transition-colors hover:border-primary/50',
                    selected && 'border-primary ring-1 ring-primary',
                  )}
                >
                  <StylePreview styleKey={s.key} />
                  <div className="mt-1.5 flex items-center justify-between px-0.5">
                    <span className="text-sm font-medium">{s.name}</span>
                    {selected && <Check className="size-3.5 text-primary" />}
                  </div>
                  <div className="px-0.5 text-xs text-muted-foreground">{s.description}</div>
                </button>
              )
            })}
          </div>
        </section>

        <section className="space-y-2.5">
          <h3 className="text-sm font-medium">主题色</h3>
          <div className="grid grid-cols-3 gap-2">
            {themes.map((t) => {
              const selected = appearance.theme === t.key
              return (
                <button
                  key={t.key}
                  onClick={() => update({ theme: t.key })}
                  className={cn(
                    'flex items-center gap-2 rounded-md border px-2 py-1.5 text-sm transition-colors hover:bg-muted',
                    selected && 'border-primary',
                  )}
                >
                  <span className="flex size-4 items-center justify-center rounded-sm text-white" style={{ background: t.color }}>
                    {selected && <Check className="size-3" />}
                  </span>
                  {t.name}
                </button>
              )
            })}
          </div>
        </section>

        <section className="space-y-2.5">
          <h3 className="text-sm font-medium">页面布局</h3>
          <LayoutSwitch
            label="多页签"
            hint="记录打开过的页面，可快速切换"
            checked={appearance.tabs}
            onChange={(tabs) => update({ tabs })}
          />
          <LayoutSwitch
            label="面包屑"
            hint={appearance.tabs ? '关闭后页签上移到顶栏，布局更紧凑' : '在顶栏显示当前页面位置'}
            checked={appearance.breadcrumb}
            onChange={(breadcrumb) => update({ breadcrumb })}
          />
        </section>

        <div className="flex items-center justify-between border-t pt-3">
          <span className="text-xs text-muted-foreground">设置保存在当前浏览器</span>
          <Button variant="ghost" size="sm" onClick={() => update(DEFAULT_APPEARANCE)}>
            <RotateCcw />
            恢复默认
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}

function LayoutSwitch({ label, hint, checked, onChange }: { label: string; hint: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-3">
      <span>
        <span className="block text-sm">{label}</span>
        <span className="block text-xs text-muted-foreground">{hint}</span>
      </span>
      <Switch checked={checked} onCheckedChange={onChange} />
    </label>
  )
}

/**
 * 风格缩略图：示意侧边栏、顶栏、内容区的结构与配色
 * 颜色与 index.css 中各风格的变量保持一致，品牌色跟随当前主题色
 */
function StylePreview({ styleKey }: { styleKey: string }) {
  const line = (dark: boolean) => (
    <div className="h-1 w-3/4 rounded-[1px] bg-current opacity-20" style={{ color: dark ? '#ffffff' : '#1f2329' }} />
  )
  const panel = (left: string, radius: number, shadow: string) => (
    <div className="absolute right-1.5 bottom-1.5 top-4 bg-white" style={{ left, borderRadius: radius, boxShadow: shadow }}>
      <div className="m-1 h-1.5 w-1/3 rounded-[1px]" style={{ background: 'var(--brand)' }} />
    </div>
  )
  const border = '0 0 0 1px #e4e6eb'

  return (
    <div
      className="relative h-[58px] overflow-hidden rounded-sm border"
      style={{ background: styleKey === 'soft' ? 'color-mix(in oklab, var(--brand) 4%, #f7f8fa)' : '#f4f5f7' }}
    >
      {styleKey === 'classic' && (
        <>
          <div className="absolute inset-x-0 top-0 h-2.5 bg-white" style={{ boxShadow: 'inset 0 -1px 0 #e4e6eb' }} />
          <div className="absolute inset-y-0 left-0 w-[22%] space-y-1 px-1 pt-1" style={{ background: '#1d2229' }}>
            <div className="mb-1.5 h-1.5 rounded-[1px]" style={{ background: 'var(--brand-on-dark)' }} />
            <div className="h-1.5 rounded-[1px]" style={{ background: 'var(--brand-on-dark)' }} />
            {line(true)}
            {line(true)}
          </div>
          {panel('calc(22% + 6px)', 2, border)}
        </>
      )}
      {styleKey === 'split' && (
        <>
          <div className="absolute inset-x-0 top-0 h-2.5 bg-white" style={{ boxShadow: 'inset 0 -1px 0 #e4e6eb' }} />
          <div className="absolute inset-y-0 left-0 flex w-[10%] flex-col items-center gap-1 pt-1" style={{ background: '#1d2229' }}>
            <div className="size-2 rounded-[1px]" style={{ background: 'var(--brand-on-dark)' }} />
            <div className="size-2 rounded-[1px]" style={{ background: 'var(--brand-on-dark)' }} />
            <div className="size-1.5 rounded-[1px] bg-white/25" />
            <div className="size-1.5 rounded-[1px] bg-white/25" />
          </div>
          {/* 浮出的二级菜单 */}
          <div className="absolute top-3 left-[12%] z-10 w-[20%] space-y-1 rounded-[2px] bg-white p-1" style={{ boxShadow: '0 1px 4px rgb(0 0 0 / 0.18)' }}>
            <div className="h-1.5 rounded-[1px]" style={{ background: 'var(--accent)' }} />
            {line(false)}
            {line(false)}
          </div>
          {panel('calc(10% + 6px)', 1, border)}
        </>
      )}
      {styleKey === 'gov' && (
        <>
          <div className="absolute inset-x-0 top-0 h-2.5" style={{ background: 'var(--brand)' }} />
          <div className="absolute bottom-0 left-0 top-2.5 w-[22%] space-y-1 bg-white px-1 pt-1" style={{ boxShadow: 'inset -1px 0 0 #e4e6eb' }}>
            <div className="h-1.5 rounded-[1px]" style={{ background: 'var(--accent)' }} />
            {line(false)}
            {line(false)}
          </div>
          {panel('calc(22% + 6px)', 0, border)}
        </>
      )}
      {styleKey === 'soft' && (
        <>
          <div className="absolute top-1 bottom-1 left-1 w-[20%] space-y-1 rounded bg-white px-1 pt-1" style={{ boxShadow: '0 1px 3px rgb(0 0 0 / 0.1)' }}>
            <div className="mb-1.5 h-1.5 w-1/2 rounded-full" style={{ background: 'var(--brand)' }} />
            <div className="h-1.5 rounded-full" style={{ background: 'var(--accent)' }} />
            {line(false)}
            {line(false)}
          </div>
          {panel('calc(20% + 10px)', 4, '0 1px 3px rgb(0 0 0 / 0.1)')}
        </>
      )}
    </div>
  )
}
