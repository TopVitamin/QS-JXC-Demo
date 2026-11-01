import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { useNavigate } from 'react-router'
import { toast } from 'sonner'
import { FooterBar, SectionCard } from '@/components/common/detail-layout'
import { FormField } from '@/components/common/form-dialog'
import { OptionSelect } from '@/components/common/option-select'
import { PageContainer, PageHeader } from '@/components/common/page-header'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Textarea } from '@/components/ui/textarea'
import { notImplemented } from '@/lib/demo'
import { formatMoney, formatNumber, today } from '@/lib/format'
import { products, staff, suppliers, warehouses } from '@/mock/base'

interface DraftLine {
  key: number
  productId: string
  quantity: number
  price: number
  remark: string
}

interface HeaderForm {
  supplierId: string
  orderDate: string
  deliveryDate: string
  warehouseId: string
  buyer: string
  remark: string
}

const supplierOptions = suppliers.map((s) => ({ label: s.name, value: s.id }))
const warehouseOptions = warehouses.map((w) => ({ label: w.name, value: w.id }))
const buyerOptions = staff.map((s) => ({ label: s, value: s }))
const productOptions = products
  .filter((p) => p.status === 'enabled')
  .map((p) => ({ label: `${p.code} ${p.name}`, value: p.id }))

let lineSeq = 0
const newLine = (): DraftLine => ({ key: ++lineSeq, productId: '', quantity: 1, price: 0, remark: '' })

/** 新建采购订单：用于验证复杂表单布局，不包含真实的保存与业务校验 */
export default function PurchaseOrderCreatePage() {
  const navigate = useNavigate()
  const [form, setForm] = useState<HeaderForm>({
    supplierId: '',
    orderDate: today(),
    deliveryDate: '',
    warehouseId: '',
    buyer: '',
    remark: '',
  })
  const [lines, setLines] = useState<DraftLine[]>(() => [newLine()])
  const [errors, setErrors] = useState<Partial<Record<keyof HeaderForm | 'lines', string>>>({})

  const setField = <K extends keyof HeaderForm>(key: K, value: HeaderForm[K]) => {
    setForm((f) => ({ ...f, [key]: value }))
    setErrors((e) => ({ ...e, [key]: undefined }))
  }

  const updateLine = (key: number, patch: Partial<DraftLine>) => {
    setLines((ls) => ls.map((l) => (l.key === key ? { ...l, ...patch } : l)))
    setErrors((e) => ({ ...e, lines: undefined }))
  }

  const selectProduct = (key: number, productId: string) => {
    const p = products.find((x) => x.id === productId)
    updateLine(key, { productId, price: p?.purchasePrice ?? 0 })
  }

  const totalQuantity = lines.reduce((s, l) => s + (l.productId ? l.quantity : 0), 0)
  const totalAmount = lines.reduce((s, l) => s + (l.productId ? l.quantity * l.price : 0), 0)

  const handleSubmit = () => {
    const next: typeof errors = {}
    if (!form.supplierId) next.supplierId = '请选择供应商'
    if (!form.orderDate) next.orderDate = '请选择单据日期'
    if (!form.warehouseId) next.warehouseId = '请选择入库仓库'
    if (!lines.some((l) => l.productId && l.quantity > 0)) next.lines = '请至少添加一条有效的商品明细'
    setErrors(next)
    if (Object.keys(next).length > 0) {
      toast.error('请完善必填信息')
      return
    }
    toast.info('演示功能：表单校验通过，订单未真实保存')
    navigate('/purchase/orders')
  }

  return (
    <PageContainer className="flex min-h-full flex-col">
      <PageHeader title="新建采购订单" description="带 * 为必填项" onBack={() => navigate('/purchase/orders')} />

      <SectionCard title="基本信息">
        <div className="grid grid-cols-3 gap-x-6 gap-y-4">
          <FormField label="单据编号">
            <Input value="保存后自动生成" disabled />
          </FormField>
          <FormField label="供应商" required error={errors.supplierId}>
            <OptionSelect value={form.supplierId} onChange={(v) => setField('supplierId', v)} options={supplierOptions} placeholder="请选择供应商" />
          </FormField>
          <FormField label="单据日期" required error={errors.orderDate}>
            <Input type="date" value={form.orderDate} onChange={(e) => setField('orderDate', e.target.value)} />
          </FormField>
          <FormField label="入库仓库" required error={errors.warehouseId}>
            <OptionSelect value={form.warehouseId} onChange={(v) => setField('warehouseId', v)} options={warehouseOptions} placeholder="请选择仓库" />
          </FormField>
          <FormField label="交货日期">
            <Input type="date" value={form.deliveryDate} min={form.orderDate} onChange={(e) => setField('deliveryDate', e.target.value)} />
          </FormField>
          <FormField label="采购员">
            <OptionSelect value={form.buyer} onChange={(v) => setField('buyer', v)} options={buyerOptions} placeholder="请选择采购员" />
          </FormField>
          <FormField label="备注" className="col-span-3">
            <Textarea value={form.remark} onChange={(e) => setField('remark', e.target.value)} rows={2} placeholder="请输入备注" />
          </FormField>
        </div>
      </SectionCard>

      <SectionCard
        title="商品明细"
        bodyClassName="p-0"
        extra={
          <Button size="sm" variant="outline" onClick={() => setLines((ls) => [...ls, newLine()])}>
            <Plus />
            添加商品
          </Button>
        }
      >
        <Table className="text-[13px]">
          <TableHeader className="bg-muted/70">
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-12 text-center text-muted-foreground">序号</TableHead>
              <TableHead className="w-[280px] text-muted-foreground">
                <span className="text-destructive">*</span>商品
              </TableHead>
              <TableHead className="text-muted-foreground">规格型号</TableHead>
              <TableHead className="w-14 text-center text-muted-foreground">单位</TableHead>
              <TableHead className="w-28 text-muted-foreground">
                <span className="text-destructive">*</span>数量
              </TableHead>
              <TableHead className="w-32 text-muted-foreground">单价（元）</TableHead>
              <TableHead className="w-32 text-right text-muted-foreground">金额</TableHead>
              <TableHead className="w-44 text-muted-foreground">备注</TableHead>
              <TableHead className="w-14 text-center text-muted-foreground">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {lines.map((l, i) => {
              const p = products.find((x) => x.id === l.productId)
              return (
                <TableRow key={l.key} className="hover:bg-transparent">
                  <TableCell className="text-center text-muted-foreground">{i + 1}</TableCell>
                  <TableCell>
                    <OptionSelect value={l.productId} onChange={(v) => selectProduct(l.key, v)} options={productOptions} placeholder="请选择商品" />
                  </TableCell>
                  <TableCell className="text-muted-foreground">{p?.spec ?? '-'}</TableCell>
                  <TableCell className="text-center">{p?.unit ?? '-'}</TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      min={1}
                      value={l.quantity}
                      onChange={(e) => updateLine(l.key, { quantity: Math.max(0, Number(e.target.value)) })}
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      min={0}
                      step="0.01"
                      value={l.price}
                      onChange={(e) => updateLine(l.key, { price: Math.max(0, Number(e.target.value)) })}
                    />
                  </TableCell>
                  <TableCell className="text-right font-medium">{p ? formatMoney(l.quantity * l.price) : '-'}</TableCell>
                  <TableCell>
                    <Input value={l.remark} onChange={(e) => updateLine(l.key, { remark: e.target.value })} placeholder="选填" />
                  </TableCell>
                  <TableCell className="text-center">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      className="text-muted-foreground hover:text-destructive"
                      disabled={lines.length === 1}
                      onClick={() => setLines((ls) => ls.filter((x) => x.key !== l.key))}
                      aria-label="删除行"
                    >
                      <Trash2 />
                    </Button>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
        <div className="flex items-center justify-between border-t bg-muted/40 px-4 py-3 text-[13px]">
          <span className="text-destructive">{errors.lines}</span>
          <div className="flex gap-8">
            <span>
              数量合计：<span className="font-medium">{formatNumber(totalQuantity)}</span>
            </span>
            <span>
              金额合计：<span className="text-base font-semibold text-primary">{formatMoney(totalAmount)}</span>
            </span>
          </div>
        </div>
      </SectionCard>

      <FooterBar extra="演示页面：保存与提交不会产生真实单据">
        <Button variant="outline" onClick={() => navigate('/purchase/orders')}>
          取消
        </Button>
        <Button variant="outline" onClick={() => notImplemented('保存草稿')}>
          保存草稿
        </Button>
        <Button onClick={handleSubmit}>提交</Button>
      </FooterBar>
    </PageContainer>
  )
}
