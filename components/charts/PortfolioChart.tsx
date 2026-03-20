'use client'

import { useMemo } from 'react'
import { ResponsiveContainer, AreaChart, Area, Tooltip, YAxis } from 'recharts'
import { usePortfolioStore } from '@/store/usePortfolioStore'
import { getPortfolioValueHistory } from '@/lib/utils/calculations'
import { formatCurrency } from '@/lib/utils/formatters'

interface PortfolioChartProps {
  days?: number
  height?: number
}

interface TooltipPayload {
  value: number
  payload: { date: string; value: number }
}

interface CustomTooltipProps {
  active?: boolean
  payload?: TooltipPayload[]
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

export function PortfolioChart({ days = 30, height = 120 }: PortfolioChartProps) {
  const { holdings, trades, cashBalance, startingBalance } = usePortfolioStore()

  const { data, color } = useMemo(() => {
    const history = getPortfolioValueHistory(
      { holdings, trades, cashBalance, startingBalance },
      days
    )

    const first = history[0]?.value ?? startingBalance
    const last = history[history.length - 1]?.value ?? startingBalance
    const chartColor = last >= first ? '#16a34a' : '#dc2626'

    return { data: history, color: chartColor }
  }, [holdings, trades, cashBalance, startingBalance, days])

  if (data.length === 0) {
    return (
      <div
        className="flex items-center justify-center text-xs text-[var(--text-muted)]"
        style={{ height }}
      >
        No data
      </div>
    )
  }

  const values = data.map((d) => d.value)
  const minVal = Math.min(...values)
  const maxVal = Math.max(...values)
  const padding = (maxVal - minVal) * 0.1 || 100

  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="portfolio-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.25} />
            <stop offset="95%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <YAxis domain={[minVal - padding, maxVal + padding]} hide />
        <Tooltip content={<CustomTooltip />} />
        <Area
          type="monotone"
          dataKey="value"
          stroke={color}
          strokeWidth={2}
          dot={false}
          fill="url(#portfolio-grad)"
          isAnimationActive={true}
          animationDuration={400}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
