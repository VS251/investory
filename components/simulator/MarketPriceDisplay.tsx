'use client'

import { useMemo } from 'react'
import { getStock } from '@/lib/data/stocks'
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
    Banking: 'info',
    IT: 'info',
    Energy: 'warning',
    FMCG: 'success',
    Finance: 'info',
    Pharma: 'success',
    Telecom: 'warning',
    Materials: 'warning',
    Infrastructure: 'default',
    Insurance: 'info',
    Healthcare: 'success',
    Mining: 'warning',
  }
  return map[sector] ?? 'default'
}

interface ChangeStat {
  label: string
  change: number
  changePct: number
}

function ChangeStatBox({ label, change, changePct }: ChangeStat) {
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
      <span
        className={cn(
          'text-xs font-medium',
          isPositive ? 'text-gain' : 'text-loss'
        )}
      >
        {isPositive ? '+' : ''}{formatCurrency(change)}
      </span>
    </div>
  )
}

export function MarketPriceDisplay({ symbol }: MarketPriceDisplayProps) {
  const stats = useMemo(() => {
    const stock = getStock(symbol)
    if (!stock) return null

    const history = stock.priceHistory
    const currentPrice = stock.currentPrice

    function getPriceNDaysAgo(n: number): number {
      if (history.length <= n) return history[0]?.price ?? currentPrice
      return history[history.length - 1 - n]?.price ?? currentPrice
    }

    const yesterday = getPriceNDaysAgo(1)
    const sevenDaysAgo = getPriceNDaysAgo(7)
    const thirtyDaysAgo = getPriceNDaysAgo(30)

    return {
      stock,
      currentPrice,
      oneDayChange: currentPrice - yesterday,
      oneDayChangePct: yesterday > 0 ? ((currentPrice - yesterday) / yesterday) * 100 : 0,
      oneWeekChange: currentPrice - sevenDaysAgo,
      oneWeekChangePct: sevenDaysAgo > 0 ? ((currentPrice - sevenDaysAgo) / sevenDaysAgo) * 100 : 0,
      oneMonthChange: currentPrice - thirtyDaysAgo,
      oneMonthChangePct: thirtyDaysAgo > 0 ? ((currentPrice - thirtyDaysAgo) / thirtyDaysAgo) * 100 : 0,
    }
  }, [symbol])

  if (!stats) {
    return (
      <div className="rounded-lg bg-[var(--bg-card-alt)] p-4 text-sm text-[var(--text-muted)]">
        Stock not found: {symbol}
      </div>
    )
  }

  const { stock, currentPrice, oneDayChange, oneDayChangePct, oneWeekChange, oneWeekChangePct, oneMonthChange, oneMonthChangePct } = stats

  return (
    <div>
      {/* Stock name + sector */}
      <div className="mb-2 flex items-center gap-2">
        <span className="text-sm font-semibold text-[var(--text-primary)]">{stock.name}</span>
        <Badge variant={sectorVariant(stock.sector)} size="sm">
          {stock.sector}
        </Badge>
      </div>

      {/* Current price */}
      <div className="mb-3">
        <span className="text-3xl font-bold tracking-tight text-[var(--text-primary)]">
          {formatCurrency(currentPrice)}
        </span>
        <span className="ml-2 text-xs text-[var(--text-muted)]">Current</span>
      </div>

      {/* Change stats */}
      <div className="grid grid-cols-3 gap-3 rounded-lg border border-[var(--border)] bg-[var(--bg-card-alt)] p-3">
        <ChangeStatBox
          label="1D"
          change={oneDayChange}
          changePct={oneDayChangePct}
        />
        <div className="border-l border-[var(--border)] pl-3">
          <ChangeStatBox
            label="1W"
            change={oneWeekChange}
            changePct={oneWeekChangePct}
          />
        </div>
        <div className="border-l border-[var(--border)] pl-3">
          <ChangeStatBox
            label="1M"
            change={oneMonthChange}
            changePct={oneMonthChangePct}
          />
        </div>
      </div>
    </div>
  )
}
