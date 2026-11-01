import { useMemo, useState } from 'react'

/**
 * 本地列表查询：筛选条件 + 分页
 * - draft：输入中的条件；query：点击“查询”后生效的条件
 * - 对接真实接口时，可将 filtered 的计算替换为请求接口，保留页面调用方式
 */
export function useLocalTable<T, Q extends object>(data: T[], initialQuery: Q, filter: (row: T, query: Q) => boolean) {
  const [draft, setDraft] = useState<Q>(initialQuery)
  const [query, setQuery] = useState<Q>(initialQuery)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const filtered = useMemo(() => data.filter((row) => filter(row, query)), [data, query, filter])

  // 数据减少（如删除）导致当前页超出范围时，回退到最后一页
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize))
  const currentPage = Math.min(page, pageCount)
  const pageData = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  return {
    draft,
    updateDraft: (patch: Partial<Q>) => setDraft((d) => ({ ...d, ...patch })),
    search: () => {
      setQuery(draft)
      setPage(1)
    },
    reset: () => {
      setDraft(initialQuery)
      setQuery(initialQuery)
      setPage(1)
    },
    pageData,
    pagination: {
      page: currentPage,
      pageSize,
      total: filtered.length,
      onPageChange: setPage,
      onPageSizeChange: (size: number) => {
        setPageSize(size)
        setPage(1)
      },
    },
    indexOffset: (currentPage - 1) * pageSize,
  }
}
