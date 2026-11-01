import { Construction } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router'
import { EmptyState } from '@/components/common/empty-state'
import { PageContainer, PageHeader } from '@/components/common/page-header'
import { Button } from '@/components/ui/button'
import { DEFAULT_PATH, findMenuTrail } from '@/config/menu'

/** 统一占位页：用于已规划菜单但尚未开发的模块 */
export default function PlaceholderPage() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const trail = findMenuTrail(pathname)
  const title = trail?.item.title ?? '未命名模块'

  return (
    <PageContainer>
      <PageHeader title={title} description={`${trail?.group.title ?? ''} / ${title}`} />
      <div className="rounded-xl bg-card ring-1 ring-foreground/10">
        <EmptyState
          icon={Construction}
          className="py-24"
          title="功能待完善"
          description={`「${title}」模块已完成菜单与路由规划，页面功能尚在设计开发中，敬请期待。`}
          action={
            <Button variant="outline" onClick={() => navigate(DEFAULT_PATH)}>
              返回工作台
            </Button>
          }
        />
      </div>
    </PageContainer>
  )
}
