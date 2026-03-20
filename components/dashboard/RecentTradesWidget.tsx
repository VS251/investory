'use client'

import Link from 'next/link'
import { usePortfolioStore } from '@/store/usePortfolioStore'
import { formatCurrency, formatDate } from '@/lib/utils/formatters'
import { cn } from '@/lib/utils/cn'

export function RecentTradesWidget() {
  const trades = usePortfolioStore((s) => s.trades)
  const recentTrades = trades.slice(0, 3)

  if (trades.length === 0) {
    return (
      <div className="rounded-card border border-[var(--border)] bg-[var(--bg-card)] p-5 shadow-card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-[var(--text-primary)]">Recent Trades</h3>
        </div>
        <div className="flex flex-col items-center justify-center py-6 text-center">
          <span className="text-3xl mb-2">📊</span>
          <p className="text-sm font-semibold text-[var(--text-secondary)] mb-1">No trades yet</p>
          <p className="text-xs text-[var(--text-muted)] mb-4 max-w-xs">
            Head to the Simulator to make your first trade
          </p>
          <Link
            href="/simulator"
            className="inline-flex items-center gap-1 rounded-lg bg-brand-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-brand-600 transition-colors"
          >
            Go to Simulator →
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-card border border-[var(--border)] bg-[var(--bg-card)] p-5 shadow-card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-[var(--text-primary)]">Recent Trades</h3>
        <Link
          href="/simulator"
          className="text-xs font-medium text-brand-500 hover:text-brand-600 transition-colors"
        >
          View all →
        </Link>
      </div>

      <div className="flex flex-col gap-3">
        {recentTrades.map((trade) => (
          <div key={trade.id} className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <span
                className={cn(
                  'flex-shrink-0 rounded-md px-1.5 py-0.5 text-xs font-bold uppercase',
                  trade.type === 'buy'
                    ? 'bg-gain-light text-gain-dark dark:bg-gain/20 dark:text-gain'
                    : 'bg-loss-light text-loss-dark dark:bg-loss/20 dark:text-loss'
                )}
              >
                {trade.type}
              </span>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-[var(--text-primary)] truncate">
                  {trade.symbol}
                </p>
                <p className="text-xs text-[var(--text-muted)] truncate">
                  {trade.quantity} × {formatCurrency(trade.price)}
                </p>
              </div>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="tabular-nums text-xs font-semibold text-[var(--text-primary)]">
                {formatCurrency(trade.total)}
              </p>
              <p className="text-xs text-[var(--text-muted)]">
                {formatDate(trade.timestamp)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
