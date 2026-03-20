'use client'

import { usePortfolioStore } from '@/store/usePortfolioStore'
import { useProgressStore } from '@/store/useProgressStore'
import { Card } from '@/components/ui/Card'
import { formatCurrency } from '@/lib/utils/formatters'

export function QuickStatsRow() {
  const cashBalance = usePortfolioStore((s) => s.cashBalance)
  const trades = usePortfolioStore((s) => s.trades)
  const completedLessons = useProgressStore((s) => s.completedLessons)

  const totalLessonsDone = Object.values(completedLessons).reduce(
    (sum, ids) => sum + ids.length,
    0
  )

  const stats = [
    {
      label: 'Cash Available',
      value: formatCurrency(cashBalance),
      sub: 'Ready to invest',
      valueClass: 'tabular-nums text-[var(--text-primary)]',
    },
    {
      label: 'Trades Made',
      value: String(trades.length),
      sub: trades.length === 1 ? '1 trade executed' : `${trades.length} trades executed`,
      valueClass: 'text-[var(--text-primary)]',
    },
    {
      label: 'Lessons Done',
      value: String(totalLessonsDone),
      sub: totalLessonsDone === 1 ? 'lesson completed' : 'lessons completed',
      valueClass: 'text-[var(--text-primary)]',
    },
  ]

  return (
    <div className="grid grid-cols-3 gap-4">
      {stats.map((stat) => (
        <Card key={stat.label} padding="md">
          <p className="text-xs font-medium text-[var(--text-muted)] mb-2 uppercase tracking-wide">{stat.label}</p>
          <p className={`text-2xl font-bold leading-tight ${stat.valueClass}`}>{stat.value}</p>
          <p className="text-xs text-[var(--text-muted)] mt-1 hidden sm:block">
            {stat.sub}
          </p>
        </Card>
      ))}
    </div>
  )
}
