import { useSyncExternalStore } from 'react'

/**
 * 外观设置：界面风格 × 主题色
 * 具体的样式变量定义在 index.css 的 [data-style] / [data-theme] 中，这里只维护名称与预览信息。
 * 「分栏」风格的侧边栏结构、多页签与面包屑开关会改变布局，布局组件通过 useAppearance() 读取。
 */

export interface ThemePreset {
  key: string
  name: string
  color: string
}

export const themes: ThemePreset[] = [
  { key: 'qingbi', name: '青碧', color: '#0f8a7e' },
  { key: 'zangqing', name: '藏青', color: '#24508c' },
  { key: 'zhusha', name: '朱砂', color: '#c0392b' },
  { key: 'zhehuang', name: '赭黄', color: '#b8741a' },
  { key: 'daizi', name: '黛紫', color: '#6b4fa0' },
  { key: 'mohei', name: '墨黑', color: '#2b2f36' },
]

export interface StylePreset {
  key: string
  name: string
  description: string
}

export const styles: StylePreset[] = [
  { key: 'classic', name: '经典', description: '深色侧边栏，白色顶栏' },
  { key: 'split', name: '分栏', description: '图标栏，二级菜单浮出' },
  { key: 'gov', name: '政企', description: '品牌色通栏顶栏，方正' },
  { key: 'soft', name: '悬浮', description: '悬浮侧边栏，大圆角' },
]

export interface Appearance {
  theme: string
  style: string
  /** 是否显示多页签 */
  tabs: boolean
  /** 是否显示面包屑；关闭且开启多页签时，页签上移到顶栏 */
  breadcrumb: boolean
}

export const DEFAULT_APPEARANCE: Appearance = { theme: 'qingbi', style: 'classic', tabs: true, breadcrumb: true }
const STORAGE_KEY = 'jxc.appearance'

export function getStoredAppearance(): Appearance {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}') as Partial<Appearance>
    return {
      theme: themes.some((t) => t.key === saved.theme) ? saved.theme! : DEFAULT_APPEARANCE.theme,
      style: styles.some((s) => s.key === saved.style) ? saved.style! : DEFAULT_APPEARANCE.style,
      tabs: saved.tabs ?? DEFAULT_APPEARANCE.tabs,
      breadcrumb: saved.breadcrumb ?? DEFAULT_APPEARANCE.breadcrumb,
    }
  } catch {
    return DEFAULT_APPEARANCE
  }
}

let current: Appearance = DEFAULT_APPEARANCE
const listeners = new Set<() => void>()

export function applyAppearance(appearance: Appearance) {
  const root = document.documentElement
  root.dataset.theme = appearance.theme
  root.dataset.style = appearance.style
  // 紧凑顶栏：关闭面包屑、页签上移到顶栏时，顶栏变薄（见 index.css 的 --header-h）
  root.dataset.topbar = isCompactTopbar(appearance) ? 'compact' : 'normal'
  current = appearance
  listeners.forEach((l) => l())
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(appearance))
  } catch {
    // 浏览器禁用存储时忽略
  }
}

/** 关闭面包屑且开启多页签时，使用紧凑顶栏 */
export function isCompactTopbar(appearance: Appearance) {
  return appearance.tabs && !appearance.breadcrumb
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

/** 当前外观（随 applyAppearance 更新） */
export function useAppearance() {
  return useSyncExternalStore(subscribe, () => current)
}
