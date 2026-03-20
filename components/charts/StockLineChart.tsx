'use client'

import { useState, useMemo } from 'react'
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts'
import { getStock } from '@/lib/data/stocks'
import { formatCurrency } from '@/lib/utils/formatters'
import type { PricePoint } from '@/types'

interface StockLineChartProps {
  symbol: string
  range?: '1M' | '3M' | '1Y'
  height?: number
}

type Range = '1M' | '3M' | '1Y'

const RANGE_DAYS: Record<Range, number> = {
  '1M': 30,
  '3M': 90,
  '1Y': 365,
}

function formatAxisDate(dateStr: string, range: Range): string {
  const date = new Date(dateStr)
  if (range === '1M') {
    return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })
  }
  if (range === '3M') {
    return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })
  }
  return date.toLocaleDateString('en-IN', { month: 'short', year: '2-digit' })
}

interface TooltipPayload {
  value: number
  payload: PricePoint
}

interface CustomTooltipProps {
  active?: boolean
  payload?: TooltipPayload[]
  label?: string
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload || payload.length === 0) return null
  const point = payload[0]
  return (
    <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-card)] px-3 py-2 shadow-card text-xs">
      <p className="text-[var(--text-muted)]">{point.payload.date}</p>
      <p className="font-semibold text-[var(--text-primary)]">{formatCurrency(point.value)}</p>
    </div>
  )
}

export function StockLineChart({ symbol, range: initialRange = '1M', height = 200 }: StockLineChartProps) {
  const [range, setRange] = useState<Range>(initialRange)

  const { data, color } = useMemo(() => {
    const stock = getStock(symbol)
    if (!stock || stock.priceHistory.length === 0) return { data: [], color: '#2b87ff' }

    const days = RANGE_DAYS[range]
    const sliced = stock.priceHistory.slice(-days)

    if (sliced.length === 0) return { data: [], color: '#2b87ff' }

    const startPrice = sliced[0].price
    const endPrice = sliced[sliced.length - 1].price
    const chartColor = endPrice >= startPrice ? '#16a34a' : '#dc2626'

    return { data: sliced, color: chartColor }
  }, [symbol, range])

  const prices = data.map((d) => d.price)
  const minPrice = prices.length > 0 ? Math.min(...prices) : 0
  const maxPrice = prices.length > 0 ? Math.max(...prices) : 0
  const padding = (maxPrice - minPrice) * 0.1 || 10

  // Tick interval to avoid crowding
  const tickCount = range === '1M' ? 4 : range === '3M' ? 6 : 6

  if (data.length === 0) {
    return (
      <div
        className="flex items-center justify-center rounded-lg bg-[var(--bg-card-alt)] text-sm text-[var(--text-muted)]"
        style={{ height }}
      >
        No price data available
      </div>
    )
  }

  const tickIndices = new Set<number>()
  const step = Math.floor(data.length / tickCount)
  for (let i = 0; i < tickCount; i++) {
    tickIndices.add(Math.min(i * step, data.length - 1))
  }
  tickIndices.add(data.length - 1)

  return (
    <div>
      {/* Range selector */}
      <div className="mb-3 flex gap-1">
        {(['1M', '3M', '1Y'] as Range[]).map((r) => (
          <button
            key={r}
            onClick={() => setRange(r)}
            className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
              range === r
                ? 'bg-brand-500 text-white'
                : 'bg-[var(--bg-card-alt)] text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            {r}
          </button>
        ))}
      </div>

      <ResponsiveContainer width="100%" height={height}>
        <AreaChart data={data} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id={`grad-${symbol}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.2} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="date"
            tick={{ fontSize: 10, fill: 'var(--text-muted)' }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(val: string) => formatAxisDate(val, range)}
            interval={Math.floor(data.length / tickCount)}
          />
          <YAxis
            domain={[minPrice - padding, maxPrice + padding]}
            tick={{ fontSize: 10, fill: 'var(--text-muted)' }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(val: number) => `₹${val.toFixed(0)}`}
            width={58}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="price"
            stroke={color}
            strokeWidth={2}
            dot={false}
            fill={`url(#grad-${symbol})`}
            isAnimationActive={true}
            animationDuration={400}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
