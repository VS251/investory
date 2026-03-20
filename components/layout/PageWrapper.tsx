import { ReactNode } from 'react'
import { cn } from '@/lib/utils/cn'

interface PageWrapperProps {
  children: ReactNode
  className?: string
  title?: string
  subtitle?: string
}

export function PageWrapper({ children, className, title, subtitle }: PageWrapperProps) {
  return (
    <main className={cn('flex-1 min-h-screen pb-24 lg:pb-8', className)}>
      <div className="px-6 lg:px-8 py-6">
        {title && (
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-[var(--text-primary)]">{title}</h1>
            {subtitle && <p className="mt-1 text-sm text-[var(--text-muted)]">{subtitle}</p>}
          </div>
        )}
        {children}
      </div>
    </main>
  )
}
