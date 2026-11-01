import { useState } from 'react'
import { FormDialog, FormField } from '@/components/common/form-dialog'
import { OptionSelect } from '@/components/common/option-select'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { dictToOptions, enableStatusDict } from '@/lib/dict'
import { productCategories, units } from '@/mock/base'
import type { EnableStatus, Product } from '@/types'

export type ProductFormValues = Omit<Product, 'id' | 'updatedAt'>

const emptyValues: ProductFormValues = {
  code: '',
  name: '',
  spec: '',
  category: '',
  unit: '',
  purchasePrice: 0,
  salePrice: 0,
  status: 'enabled',
  remark: '',
}

interface ProductFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** 传入时为编辑模式 */
  product?: Product
  onSubmit: (values: ProductFormValues) => void
}

type Errors = Partial<Record<keyof ProductFormValues, string>>

/**
 * 新增 / 编辑商品弹窗（仅做基础必填校验）
 * 父组件在每次打开时变更 key，使表单按传入的商品重新初始化
 */
export function ProductFormDialog({ open, onOpenChange, product, onSubmit }: ProductFormDialogProps) {
  const [values, setValues] = useState<ProductFormValues>(() => (product ? { ...product } : emptyValues))
  const [errors, setErrors] = useState<Errors>({})

  const set = <K extends keyof ProductFormValues>(key: K, value: ProductFormValues[K]) => {
    setValues((v) => ({ ...v, [key]: value }))
    setErrors((e) => ({ ...e, [key]: undefined }))
  }

  const handleSubmit = () => {
    const next: Errors = {}
    if (!values.code.trim()) next.code = '请输入商品编码'
    if (!values.name.trim()) next.name = '请输入商品名称'
    if (!values.category) next.category = '请选择商品分类'
    if (!values.unit) next.unit = '请选择计量单位'
    setErrors(next)
    if (Object.keys(next).length === 0) onSubmit(values)
  }

  return (
    <FormDialog
      open={open}
      onOpenChange={onOpenChange}
      title={product ? '编辑商品' : '新增商品'}
      description="带 * 为必填项；保存后仅更新当前页面的本地演示数据"
      onSubmit={handleSubmit}
      submitText="保存"
    >
      <div className="grid grid-cols-2 gap-x-5 gap-y-4">
        <FormField label="商品编码" required error={errors.code}>
          <Input value={values.code} onChange={(e) => set('code', e.target.value)} placeholder="如 SP0027" disabled={Boolean(product)} />
        </FormField>
        <FormField label="商品名称" required error={errors.name}>
          <Input value={values.name} onChange={(e) => set('name', e.target.value)} placeholder="请输入商品名称" />
        </FormField>
        <FormField label="商品分类" required error={errors.category}>
          <OptionSelect value={values.category} onChange={(v) => set('category', v)} options={productCategories} />
        </FormField>
        <FormField label="计量单位" required error={errors.unit}>
          <OptionSelect value={values.unit} onChange={(v) => set('unit', v)} options={units} />
        </FormField>
        <FormField label="规格型号">
          <Input value={values.spec} onChange={(e) => set('spec', e.target.value)} placeholder="请输入规格型号" />
        </FormField>
        <FormField label="状态">
          <OptionSelect
            value={values.status}
            onChange={(v) => set('status', v as EnableStatus)}
            options={dictToOptions(enableStatusDict)}
          />
        </FormField>
        <FormField label="参考进价（元）">
          <Input
            type="number"
            min={0}
            step="0.01"
            value={values.purchasePrice}
            onChange={(e) => set('purchasePrice', Number(e.target.value))}
          />
        </FormField>
        <FormField label="参考售价（元）">
          <Input
            type="number"
            min={0}
            step="0.01"
            value={values.salePrice}
            onChange={(e) => set('salePrice', Number(e.target.value))}
          />
        </FormField>
        <FormField label="备注" className="col-span-2">
          <Textarea value={values.remark ?? ''} onChange={(e) => set('remark', e.target.value)} placeholder="请输入备注" rows={3} />
        </FormField>
      </div>
    </FormDialog>
  )
}
