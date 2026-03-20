'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  BookOpen,
  TrendingUp,
  PieChart,
  Lightbulb,
  Calculator,
} from 'lucide-react'
import { cn } from '@/lib/utils/cn'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/learn', label: 'Learn', icon: BookOpen },
  { href: '/simulator', label: 'Simulator', icon: TrendingUp },
  { href: '/portfolio', label: 'Portfolio', icon: PieChart },
  { href: '/insights', label: 'Insights', icon: Lightbulb },
  { href: '/tools', label: 'Tools', icon: Calculator },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden lg:flex w-52 flex-shrink-0 flex-col border-r border-[var(--border)] bg-[var(--bg-card)] pt-4">
      <nav className="flex flex-col gap-1 px-3">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + '/')
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                active
                  ? 'bg-brand-50 text-brand-600 dark:bg-brand-900/30 dark:text-brand-300'
                  : 'text-[var(--text-secondary)] hover:bg-[var(--bg-card-alt)] hover:text-[var(--text-primary)]'
              )}
            >
              <Icon size={18} />
              {label}
            </Link>
          )
        })}
      </nav>
      <div className="mt-auto p-4">
        <p className="text-xs text-[var(--text-muted)] leading-relaxed">
          Simulated data for learning purposes only. Not financial advice.
        </p>
      </div>
    </aside>
  )
}
