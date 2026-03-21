'use client'

import { useStocksStore } from '@/store/useStocksStore'
import { useStockHistory } from '@/hooks/useStockHistory'
import { formatCurrency, formatPercent } from '@/lib/utils/formatters'
import { Badge } from '@/components/ui/Badge'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import type { Sector } from '@/types'

interface MarketPriceDisplayProps {
  symbol: string
}

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

interface ChangeStatBoxProps {
  label: string
  change: number
  changePct: number
}

function ChangeStatBox({ label, change, changePct }: ChangeStatBoxProps) {
  const isPositive = change >= 0
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs text-[var(--text-muted)]">{label}</span>
      <div
        className={cn(
          'flex items-center gap-1 text-sm font-semibold',
          isPositive ? 'text-gain' : 'text-loss'
        )}
      >
        {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
        <span>{formatPercent(changePct)}</span>
      </div>
      <span className={cn('text-xs font-medium', isPositive ? 'text-gain' : 'text-loss')}>
        {isPositive ? '+' : ''}{formatCurrency(change)}
      </span>
    </div>
  )
}

export function MarketPriceDisplay({ symbol }: MarketPriceDisplayProps) {
  // Subscribe to live price updates from the store
  const stock = useStocksStore((s) => s.stocks[symbol])
  const pricesLoaded = useStocksStore((s) => s.pricesLoaded)

  // Trigger lazy history load for 1W/1M change calculations
  const { loaded: historyLoaded } = useStockHistory(symbol)
  const priceHistory = useStocksStore((s) => s.stocks[symbol]?.priceHistory ?? [])

  if (!stock) {
    return (
      <div className="rounded-lg bg-[var(--bg-card-alt)] p-4 text-sm text-[var(--text-muted)]">
        Stock not found: {symbol}
      </div>
    )
  }

  const { currentPrice, change, changePercent } = stock

  // 1D change comes directly from the API quote (accurate market data)
  const oneDayChange = pricesLoaded ? change : 0
  const oneDayChangePct = pricesLoaded ? changePercent : 0

  // 1W / 1M change derived from history (loaded lazily)
  function getPriceNDaysAgo(n: number): number {
    if (priceHistory.length <= n) return priceHistory[0]?.price ?? currentPrice
    return priceHistory[priceHistory.length - 1 - n]?.price ?? currentPrice
  }

  const sevenDaysAgo = historyLoaded ? getPriceNDaysAgo(7) : currentPrice
  const thirtyDaysAgo = historyLoaded ? getPriceNDaysAgo(30) : currentPrice

  const oneWeekChange = currentPrice - sevenDaysAgo
  const oneWeekChangePct = sevenDaysAgo > 0 ? ((currentPrice - sevenDaysAgo) / sevenDaysAgo) * 100 : 0
  const oneMonthChange = currentPrice - thirtyDaysAgo
  const oneMonthChangePct = thirtyDaysAgo > 0 ? ((currentPrice - thirtyDaysAgo) / thirtyDaysAgo) * 100 : 0

  return (
    <div>
      <div className="mb-2 flex items-center gap-2">
        <span className="text-sm font-semibold text-[var(--text-primary)]">{stock.name}</span>
        <Badge variant={sectorVariant(stock.sector)} size="sm">
          {stock.sector}
        </Badge>
      </div>

      <div className="mb-3">
        <span className="text-3xl font-bold tracking-tight text-[var(--text-primary)]">
          {formatCurrency(currentPrice)}
        </span>
        <span className="ml-2 text-xs text-[var(--text-muted)]">
          {pricesLoaded ? 'Live' : 'Estimated'}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-3 rounded-lg border border-[var(--border)] bg-[var(--bg-card-alt)] p-3">
        <ChangeStatBox label="1D" change={oneDayChange} changePct={oneDayChangePct} />
        <div className="border-l border-[var(--border)] pl-3">
          {historyLoaded ? (
            <ChangeStatBox label="1W" change={oneWeekChange} changePct={oneWeekChangePct} />
          ) : (
            <div className="flex flex-col gap-0.5">
              <span className="text-xs text-[var(--text-muted)]">1W</span>
              <span className="text-xs text-[var(--text-muted)]">Loading…</span>
            </div>
          )}
        </div>
        <div className="border-l border-[var(--border)] pl-3">
          {historyLoaded ? (
            <ChangeStatBox label="1M" change={oneMonthChange} changePct={oneMonthChangePct} />
          ) : (
            <div className="flex flex-col gap-0.5">
              <span className="text-xs text-[var(--text-muted)]">1M</span>
              <span className="text-xs text-[var(--text-muted)]">Loading…</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
