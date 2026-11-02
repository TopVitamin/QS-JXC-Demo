import type { FormEvent, ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

interface FormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  children: ReactNode
  onSubmit: () => void
  submitText?: string
  className?: string
}

/** 表单弹窗：标题 + 表单内容 + 取消 / 确定 */
export function FormDialog({
  open,
  onOpenChange,
  title,
  description,
  children,
  onSubmit,
  submitText = '确定',
  className,
}: FormDialogProps) {
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    onSubmit()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={cn('gap-0 p-0 sm:max-w-[640px]', className)}>
        <form onSubmit={handleSubmit}>
          <DialogHeader className="border-b px-5 py-4">
            <DialogTitle>{title}</DialogTitle>
            {description && <DialogDescription>{description}</DialogDescription>}
          </DialogHeader>
          <div className="max-h-[65vh] overflow-y-auto px-5 py-4">{children}</div>
          <DialogFooter className="mx-0 mb-0 rounded-b-xl border-t bg-muted/50 px-5 py-3">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              取消
            </Button>
            <Button type="submit">{submitText}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

interface FormFieldProps {
  label: string
  required?: boolean
  error?: string
  children: ReactNode
  className?: string
}

/** 表单项：标签 + 控件 + 校验提示 */
export function FormField({ label, required, error, children, className }: FormFieldProps) {
  return (
    <div className={cn('space-y-1.5', className)}>
      <Label className="text-sm font-normal text-foreground/80">
        {required && <span className="text-destructive">*</span>}
        {label}
      </Label>
      <div className={cn('*:w-full', error && '[&_input]:border-destructive [&_button]:border-destructive')}>{children}</div>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}
