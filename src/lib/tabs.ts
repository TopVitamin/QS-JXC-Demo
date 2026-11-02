import type { NavigateFunction } from 'react-router'

/** 关闭页签事件：由 TabsBar 监听处理 */
export const CLOSE_TAB_EVENT = 'jxc:close-tab'

export interface CloseTabDetail {
  /** 要关闭的页签路径 */
  path: string
  /** 关闭后跳转的页面 */
  to: string
}

/**
 * 关闭指定页签并跳转，用于新建页「取消 / 提交」后收起当前页签
 * 未开启多页签时（无 TabsBar 处理事件）直接跳转
 */
export function closeTab(navigate: NavigateFunction, detail: CloseTabDetail) {
  const event = new CustomEvent<CloseTabDetail>(CLOSE_TAB_EVENT, { detail, cancelable: true })
  const handled = !window.dispatchEvent(event)
  if (!handled) navigate(detail.to)
}
