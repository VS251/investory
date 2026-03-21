'use client'

import { usePortfolioStore } from '@/store/usePortfolioStore'
import { useStocksStore } from '@/store/useStocksStore'
import { getHoldingPnL } from '@/lib/utils/calculations'
import { getStock } from '@/lib/data/stocks'
import { formatCurrency, formatPercent } from '@/lib/utils/formatters'
import { EmptyState } from '@/components/ui/EmptyState'
import { Badge } from '@/components/ui/Badge'
import { cn } from '@/lib/utils/cn'
import type { Sector } from '@/types'

function sectorVariant(sector: Sector): 'info' | 'success' | 'warning' | 'default' {
  const map: Partial<Record<Sector, 'info' | 'success' | 'warning' | 'default'>> = {
    Technology:               'info',
    'Communication Services': 'info',
    'Financial Services':     'info',
    Healthcare:               'success',
    'Consumer Staples':       'success',
    'Consumer Discretionary': 'default',
    Industrials:              'default',
    Energy:                   'warning',
    Materials:                'warning',
    'Real Estate':            'default',
    Utilities:                'success',
  }
  return map[sector] ?? 'default'
}

export function HoldingsTable() {
  const { holdings } = usePortfolioStore()
  // Subscribe so the table re-renders when real prices arrive
  useStocksStore((s) => s.pricesLoaded)
  const holdingList = Object.values(holdings)

  if (holdingList.length === 0) {
    return (
      <EmptyState
        icon="📦"
        title="No holdings yet"
        description="Head to the simulator to buy your first stocks."
        actionLabel="Go to Simulator"
        actionHref="/simulator"
      />
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[var(--border)]">
            <th className="pb-3 pr-4 text-left text-xs font-medium text-[var(--text-muted)]">
              Stock
            </th>
            <th className="pb-3 pr-4 text-right text-xs font-medium text-[var(--text-muted)]">
              Qty
            </th>
            <th className="pb-3 pr-4 text-right text-xs font-medium text-[var(--text-muted)]">
              Avg Buy
            </th>
            <th className="pb-3 pr-4 text-right text-xs font-medium text-[var(--text-muted)]">
              Current
            </th>
            <th className="pb-3 pr-4 text-right text-xs font-medium text-[var(--text-muted)]">
              Value
            </th>
            <th className="pb-3 pr-4 text-right text-xs font-medium text-[var(--text-muted)]">
              P&L ($)
            </th>
            <th className="pb-3 text-right text-xs font-medium text-[var(--text-muted)]">
              P&L (%)
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--border)]">
          {holdingList.map((holding) => {
            const stock = getStock(holding.symbol)
            const { amount: pnlAmount, percent: pnlPct } = getHoldingPnL(holding)
            const currentPrice = stock?.currentPrice ?? 0
            const currentValue = holding.quantity * currentPrice
            const isGain = pnlAmount >= 0

            return (
              <tr
                key={holding.symbol}
                className="transition-colors hover:bg-[var(--bg-card-alt)]"
              >
                {/* Stock name */}
                <td className="py-3 pr-4">
                  <div className="flex flex-col gap-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-[var(--text-primary)]">
                        {holding.symbol}
                      </span>
                      {stock && (
                        <Badge variant={sectorVariant(stock.sector)} size="sm">
                          {stock.sector}
                        </Badge>
                      )}
                    </div>
                    <span className="text-xs text-[var(--text-muted)] truncate max-w-[160px]">
                      {holding.name}
                    </span>
                  </div>
                </td>

                {/* Qty */}
                <td className="py-3 pr-4 text-right font-mono text-xs text-[var(--text-primary)]">
                  {holding.quantity}
                </td>

                {/* Avg Buy */}
                <td className="py-3 pr-4 text-right font-mono text-xs text-[var(--text-secondary)]">
                  {formatCurrency(holding.averageBuyPrice)}
                </td>

                {/* Current Price */}
                <td className="py-3 pr-4 text-right font-mono text-xs text-[var(--text-primary)]">
                  {formatCurrency(currentPrice)}
                </td>

                {/* Value */}
                <td className="py-3 pr-4 text-right font-mono text-xs font-medium text-[var(--text-primary)]">
                  {formatCurrency(currentValue)}
                </td>

                {/* P&L amount */}
                <td
                  className={cn(
                    'py-3 pr-4 text-right font-mono text-xs font-semibold',
                    isGain ? 'text-gain' : 'text-loss'
                  )}
                >
                  {isGain ? '+' : ''}
                  {formatCurrency(pnlAmount)}
                </td>

                {/* P&L percent */}
                <td
                  className={cn(
                    'py-3 text-right font-mono text-xs font-semibold',
                    isGain ? 'text-gain' : 'text-loss'
                  )}
                >
                  {formatPercent(pnlPct)}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
