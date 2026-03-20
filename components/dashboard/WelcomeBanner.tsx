'use client'

import { useEffect, useState } from 'react'
import { useUserStore } from '@/store/useUserStore'
import { usePortfolioStore } from '@/store/usePortfolioStore'
import { getPortfolioValue } from '@/lib/utils/calculations'
import { formatCurrency } from '@/lib/utils/formatters'

function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

export function WelcomeBanner() {
  const name = useUserStore((s) => s.name)
  const { cashBalance, holdings, trades } = usePortfolioStore()

  // Avoid hydration mismatch — greeting depends on time
  const [greeting, setGreeting] = useState('Welcome back')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setGreeting(getGreeting())
    setMounted(true)
  }, [])

  const holdingsValue = getPortfolioValue(holdings)
  const totalValue = holdingsValue + cashBalance
  const hasPortfolio = trades.length > 0 || Object.keys(holdings).length > 0

  return (
    <div className="rounded-card border border-[var(--border)] bg-[var(--bg-card)] px-6 py-5 shadow-card">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-[var(--text-muted)] mb-1">
            {mounted ? greeting : 'Welcome back'}{name ? `, ${name}` : ''}
          </p>
          <h2 className="text-2xl font-bold text-[var(--text-primary)] tabular-nums">
            {mounted ? formatCurrency(totalValue) : '—'}
          </h2>
          <p className="mt-1 text-sm text-[var(--text-muted)]">
            {mounted ? (hasPortfolio ? 'Total portfolio value' : 'Start your first trade to begin') : null}
          </p>
        </div>

        {mounted && (
          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="text-right">
              <p className="text-xs text-[var(--text-muted)]">Invested</p>
              <p className="tabular-nums text-sm font-semibold text-[var(--text-primary)]">
                {formatCurrency(holdingsValue)}
              </p>
            </div>
            <div className="w-px h-8 bg-[var(--border)]" />
            <div className="text-right">
              <p className="text-xs text-[var(--text-muted)]">Cash</p>
              <p className="tabular-nums text-sm font-semibold text-brand-500">
                {formatCurrency(cashBalance)}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
