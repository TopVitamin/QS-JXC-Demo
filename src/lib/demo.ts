import { toast } from 'sonner'

/** 未实现操作的统一提示，避免伪装成真实业务处理 */
export function notImplemented(action?: string) {
  toast.info(action ? `「${action}」为演示功能，暂未实现` : '演示功能，暂未实现')
}
