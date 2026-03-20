'use client'

import { useState } from 'react'
import { usePortfolioStore } from '@/store/usePortfolioStore'
import { formatCurrency, formatDateTime } from '@/lib/utils/formatters'
import { Badge } from '@/components/ui/Badge'
import { EmptyState } from '@/components/ui/EmptyState'
import { Button } from '@/components/ui/Button'

const MAX_VISIBLE = 20

export function TradeHistory() {
  const { trades } = usePortfolioStore()
  const [showAll, setShowAll] = useState(false)

  if (trades.length === 0) {
    return (
      <EmptyState
        icon="📋"
        title="No trades yet"
        description="Make your first trade to see history here."
      />
    )
  }

  const visibleTrades = showAll ? trades : trades.slice(0, MAX_VISIBLE)
  const hasMore = trades.length > MAX_VISIBLE

  return (
    <div>
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--border)]">
              <th className="pb-2 pr-3 text-left text-xs font-medium text-[var(--text-muted)]">
                Date
              </th>
              <th className="pb-2 pr-3 text-left text-xs font-medium text-[var(--text-muted)]">
                Stock
              </th>
              <th className="pb-2 pr-3 text-left text-xs font-medium text-[var(--text-muted)]">
                Type
              </th>
              <th className="pb-2 pr-3 text-right text-xs font-medium text-[var(--text-muted)]">
                Qty
              </th>
              <th className="pb-2 pr-3 text-right text-xs font-medium text-[var(--text-muted)]">
                Price
              </th>
              <th className="pb-2 text-right text-xs font-medium text-[var(--text-muted)]">
                Total
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {visibleTrades.map((trade) => (
              <tr key={trade.id} className="hover:bg-[var(--bg-card-alt)] transition-colors">
                <td className="py-2.5 pr-3 text-xs text-[var(--text-muted)] whitespace-nowrap">
                  {formatDateTime(trade.timestamp)}
                </td>
                <td className="py-2.5 pr-3">
                  <div>
                    <span className="font-semibold text-[var(--text-primary)]">
                      {trade.symbol}
                    </span>
                    <span className="ml-1.5 hidden text-xs text-[var(--text-muted)] sm:inline">
                      {trade.name}
                    </span>
                  </div>
                </td>
                <td className="py-2.5 pr-3">
                  <Badge
                    variant={trade.type === 'buy' ? 'success' : 'danger'}
                    size="sm"
                  >
                    {trade.type === 'buy' ? 'BUY' : 'SELL'}
                  </Badge>
                </td>
                <td className="py-2.5 pr-3 text-right font-mono text-xs text-[var(--text-primary)]">
                  {trade.quantity}
                </td>
                <td className="py-2.5 pr-3 text-right font-mono text-xs text-[var(--text-secondary)]">
                  {formatCurrency(trade.price)}
                </td>
                <td className="py-2.5 text-right font-mono text-xs font-medium text-[var(--text-primary)]">
                  {formatCurrency(trade.total)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Show all / collapse */}
      {hasMore && (
        <div className="mt-3 text-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowAll((prev) => !prev)}
          >
            {showAll
              ? 'Show less'
              : `View all ${trades.length} trades`}
          </Button>
        </div>
      )}
    </div>
  )
}
