import { useNavigate } from 'react-router'
import { Button } from '@/components/ui/button'
import { DEFAULT_PATH } from '@/config/menu'

export default function NotFoundPage() {
  const navigate = useNavigate()
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 p-10 text-center">
      <div className="text-7xl font-bold tracking-tight text-primary/20">404</div>
      <h1 className="text-lg font-semibold">页面不存在</h1>
      <p className="text-[13px] text-muted-foreground">您访问的页面不存在或已被移除，请检查地址是否正确。</p>
      <div className="mt-2 flex gap-2">
        <Button variant="outline" onClick={() => navigate(-1)}>
          返回上一页
        </Button>
        <Button onClick={() => navigate(DEFAULT_PATH)}>返回工作台</Button>
      </div>
    </div>
  )
}
