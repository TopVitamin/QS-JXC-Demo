import { useState } from 'react'
import { Download, Plus } from 'lucide-react'
import { toast } from 'sonner'
import { ConfirmDialog } from '@/components/common/confirm-dialog'
import { type Column, DataTable, TableCard } from '@/components/common/data-table'
import { OptionSelect } from '@/components/common/option-select'
import { PageContainer, PageHeader } from '@/components/common/page-header'
import { SearchField, SearchPanel } from '@/components/common/search-panel'
import { StatusBadge } from '@/components/common/status-badge'
import { TablePagination } from '@/components/common/table-pagination'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useLocalTable } from '@/hooks/use-local-table'
import { notImplemented } from '@/lib/demo'
import { ALL, dictToOptions, enableStatusDict } from '@/lib/dict'
import { formatMoney, now } from '@/lib/format'
import { productCategories, products as initialProducts } from '@/mock/base'
import type { Product } from '@/types'
import { ProductFormDialog, type ProductFormValues } from './product-form-dialog'

interface ProductQuery {
  code: string
  name: string
  category: string
  status: string
}

const initialQuery: ProductQuery = { code: '', name: '', category: ALL, status: ALL }

function filterProduct(p: Product, q: ProductQuery) {
  return (
    p.code.toLowerCase().includes(q.code.trim().toLowerCase()) &&
    p.name.includes(q.name.trim()) &&
    (q.category === ALL || p.category === q.category) &&
    (q.status === ALL || p.status === q.status)
  )
}

export default function ProductListPage() {
  // 本地演示数据：新增 / 编辑 / 删除仅作用于当前页面状态，刷新后恢复
  const [list, setList] = useState<Product[]>(initialProducts)
  const table = useLocalTable(list, initialQuery, filterProduct)
  const { draft, updateDraft } = table

  const [formOpen, setFormOpen] = useState(false)
  const [formKey, setFormKey] = useState(0)
  const [editing, setEditing] = useState<Product>()
  const [deleting, setDeleting] = useState<Product>()

  const openCreate = () => {
    setEditing(undefined)
    setFormKey((k) => k + 1)
    setFormOpen(true)
  }

  const openEdit = (p: Product) => {
    setEditing(p)
    setFormKey((k) => k + 1)
    setFormOpen(true)
  }

  const handleSubmit = (values: ProductFormValues) => {
    if (editing) {
      setList((l) => l.map((p) => (p.id === editing.id ? { ...p, ...values, updatedAt: now() } : p)))
      toast.success('商品已保存（本地演示数据）')
    } else {
      if (list.some((p) => p.code === values.code.trim())) {
        toast.error('商品编码已存在')
        return
      }
      setList((l) => [{ ...values, code: values.code.trim(), id: values.code.trim(), updatedAt: now() }, ...l])
      toast.success('商品已新增（本地演示数据）')
    }
    setFormOpen(false)
  }

  const toggleStatus = (p: Product) => {
    const status = p.status === 'enabled' ? 'disabled' : 'enabled'
    setList((l) => l.map((x) => (x.id === p.id ? { ...x, status } : x)))
    toast.success(`已${enableStatusDict[status].label}「${p.name}」`)
  }

  const handleDelete = () => {
    if (!deleting) return
    setList((l) => l.filter((p) => p.id !== deleting.id))
    toast.success(`已删除「${deleting.name}」（本地演示数据）`)
    setDeleting(undefined)
  }

  const columns: Column<Product>[] = [
    { key: 'code', title: '商品编码', width: 110, render: (p) => <span className="font-mono">{p.code}</span> },
    { key: 'name', title: '商品名称', render: (p) => <span className="font-medium">{p.name}</span> },
    { key: 'spec', title: '规格型号' },
    { key: 'category', title: '商品分类' },
    { key: 'unit', title: '单位', width: 64, align: 'center' },
    { key: 'purchasePrice', title: '参考进价', align: 'right', render: (p) => formatMoney(p.purchasePrice) },
    { key: 'salePrice', title: '参考售价', align: 'right', render: (p) => formatMoney(p.salePrice) },
    {
      key: 'status',
      title: '状态',
      width: 80,
      render: (p) => <StatusBadge tone={enableStatusDict[p.status].tone}>{enableStatusDict[p.status].label}</StatusBadge>,
    },
    { key: 'updatedAt', title: '更新时间', width: 140, className: 'text-muted-foreground' },
    {
      key: 'actions',
      title: '操作',
      width: 150,
      fixedRight: true,
      render: (p) => (
        <div className="flex items-center gap-3">
          <Button variant="link" size="xs" className="px-0" onClick={() => openEdit(p)}>
            编辑
          </Button>
          <Button variant="link" size="xs" className="px-0" onClick={() => toggleStatus(p)}>
            {p.status === 'enabled' ? '停用' : '启用'}
          </Button>
          <Button variant="link" size="xs" className="px-0 text-destructive" onClick={() => setDeleting(p)}>
            删除
          </Button>
        </div>
      ),
    },
  ]

  return (
    <PageContainer>
      <PageHeader title="商品管理" description="维护商品基础信息，作为采购、销售、库存业务的基础数据" />

      <SearchPanel onSearch={table.search} onReset={table.reset}>
        <SearchField label="商品编码">
          <Input value={draft.code} onChange={(e) => updateDraft({ code: e.target.value })} placeholder="请输入商品编码" />
        </SearchField>
        <SearchField label="商品名称">
          <Input value={draft.name} onChange={(e) => updateDraft({ name: e.target.value })} placeholder="请输入商品名称" />
        </SearchField>
        <SearchField label="商品分类">
          <OptionSelect value={draft.category} onChange={(v) => updateDraft({ category: v })} options={productCategories} withAll />
        </SearchField>
        <SearchField label="状态">
          <OptionSelect
            value={draft.status}
            onChange={(v) => updateDraft({ status: v })}
            options={dictToOptions(enableStatusDict)}
            withAll
          />
        </SearchField>
      </SearchPanel>

      <TableCard
        title="商品列表"
        actions={
          <>
            <Button variant="outline" onClick={() => notImplemented('导出')}>
              <Download />
              导出
            </Button>
            <Button onClick={openCreate}>
              <Plus />
              新增商品
            </Button>
          </>
        }
        footer={<TablePagination {...table.pagination} />}
      >
        <DataTable columns={columns} data={table.pageData} rowKey={(p) => p.id} indexOffset={table.indexOffset} />
      </TableCard>

      <ProductFormDialog key={formKey} open={formOpen} onOpenChange={setFormOpen} product={editing} onSubmit={handleSubmit} />
      <ConfirmDialog
        open={Boolean(deleting)}
        onOpenChange={(open) => !open && setDeleting(undefined)}
        title="确认删除该商品？"
        description={`将删除商品「${deleting?.name ?? ''}」，此操作仅影响本地演示数据。`}
        confirmText="删除"
        destructive
        onConfirm={handleDelete}
      />
    </PageContainer>
  )
}
