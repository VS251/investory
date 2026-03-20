'use client'

import { useMemo } from 'react'
import { usePortfolioStore } from '@/store/usePortfolioStore'
import { getPortfolioValue } from '@/lib/utils/calculations'
import { formatCurrency, formatPercent } from '@/lib/utils/formatters'
import { PortfolioChart } from '@/components/charts/PortfolioChart'
import { cn } from '@/lib/utils/cn'

export function PortfolioSummaryCard() {
  const { holdings, cashBalance, startingBalance, trades } = usePortfolioStore()

  const { totalValue, pnlAmount, pnlPercent } = useMemo(() => {
    const holdingsValue = getPortfolioValue(holdings)
    const total = holdingsValue + cashBalance
    const pnl = total - startingBalance
    const pct = startingBalance > 0 ? (pnl / startingBalance) * 100 : 0
    return { totalValue: total, pnlAmount: pnl, pnlPercent: pct }
  }, [holdings, cashBalance, startingBalance])

  const hasActivity = trades.length > 0 || Object.keys(holdings).length > 0
  const isPositive = pnlAmount >= 0

  return (
    <div className="rounded-card border border-[var(--border)] bg-[var(--bg-card)] p-5 shadow-card">
      <div className="flex items-start justify-between mb-1">
        <h3 className="text-sm font-bold text-[var(--text-primary)]">Portfolio Value</h3>
      </div>

      <div className="flex items-end justify-between gap-2 mb-4">
        <div>
          <p className="tabular-nums text-2xl font-bold text-[var(--text-primary)]">
            {formatCurrency(totalValue)}
          </p>
          {hasActivity && (
            <p
              className={cn(
                'tabular-nums text-xs font-medium mt-0.5',
                isPositive ? 'text-gain' : 'text-loss'
              )}
            >
              {isPositive ? '+' : ''}
              {formatCurrency(pnlAmount)} ({formatPercent(pnlPercent)})
              {' '}vs starting balance
            </p>
          )}
        </div>
        {!hasActivity && (
          <p className="text-xs text-[var(--text-muted)]">No trades yet</p>
        )}
      </div>

      {/* Sparkline chart */}
      <PortfolioChart height={80} days={30} />
    </div>
  )
}
