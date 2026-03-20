'use client'

import { useMemo } from 'react'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from 'recharts'
import { usePortfolioStore } from '@/store/usePortfolioStore'
import { getAllocationBySector } from '@/lib/utils/calculations'
import { EmptyState } from '@/components/ui/EmptyState'

// A deterministic set of colors for sectors
const SECTOR_COLORS: string[] = [
  '#2b87ff', // brand-500
  '#16a34a', // gain
  '#d97706', // caution
  '#9333ea', // purple
  '#0891b2', // cyan
  '#e11d48', // rose
  '#65a30d', // lime
  '#ea580c', // orange
  '#0284c7', // sky
  '#7c3aed', // violet
  '#059669', // emerald
  '#dc2626', // loss
  '#b45309', // amber-dark
  '#1d4ed8', // blue-700
  '#be185d', // pink
]

interface TooltipPayload {
  value: number
  name: string
  payload: { sector: string; percent: number; fill: string }
}

interface CustomTooltipProps {
  active?: boolean
  payload?: TooltipPayload[]
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload || payload.length === 0) return null
  const item = payload[0]
  return (
    <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-card)] px-3 py-2 shadow-card text-xs">
      <p className="font-semibold text-[var(--text-primary)]">{item.payload.sector}</p>
      <p className="text-[var(--text-muted)]">{item.value.toFixed(1)}% of portfolio</p>
    </div>
  )
}

export function AllocationChart() {
  const { holdings } = usePortfolioStore()

  const chartData = useMemo(() => {
    const allocation = getAllocationBySector(holdings)
    const entries = Object.entries(allocation)
      .map(([sector, alloc]) => ({
        sector,
        percent: Math.round(alloc * 1000) / 10, // percentage with 1 decimal
      }))
      .sort((a, b) => b.percent - a.percent)

    return entries.map((item, i) => ({
      ...item,
      fill: SECTOR_COLORS[i % SECTOR_COLORS.length],
    }))
  }, [holdings])

  if (chartData.length === 0) {
    return (
      <EmptyState
        icon="🥧"
        title="No allocations yet"
        description="Buy stocks to see your sector allocation here."
        actionLabel="Start Trading"
        actionHref="/simulator"
      />
    )
  }

  return (
    <div>
      <ResponsiveContainer width="100%" height={Math.max(chartData.length * 36, 120)}>
        <BarChart
          layout="vertical"
          data={chartData}
          margin={{ top: 0, right: 8, left: 0, bottom: 0 }}
        >
          <XAxis
            type="number"
            domain={[0, 100]}
            tick={{ fontSize: 10, fill: 'var(--text-muted)' }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v: number) => `${v}%`}
          />
          <YAxis
            type="category"
            dataKey="sector"
            tick={{ fontSize: 11, fill: 'var(--text-secondary)' }}
            axisLine={false}
            tickLine={false}
            width={90}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'var(--bg-card-alt)' }} />
          <Bar dataKey="percent" radius={[0, 4, 4, 0]} maxBarSize={20}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div className="mt-3 flex flex-wrap gap-2">
        {chartData.map((item, i) => (
          <div key={item.sector} className="flex items-center gap-1.5">
            <div
              className="h-2.5 w-2.5 flex-shrink-0 rounded-full"
              style={{ backgroundColor: SECTOR_COLORS[i % SECTOR_COLORS.length] }}
            />
            <span className="text-xs text-[var(--text-muted)]">
              {item.sector} ({item.percent}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
