import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router/dom'
import { Toaster } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { applyAppearance, getStoredAppearance } from '@/lib/theme'
import { router } from '@/router'
import './index.css'

// 在首次渲染前应用界面风格与主题色，避免闪烁
applyAppearance(getStoredAppearance())

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <TooltipProvider delayDuration={200}>
      <RouterProvider router={router} />
      <Toaster position="top-center" richColors closeButton />
    </TooltipProvider>
  </StrictMode>,
)
