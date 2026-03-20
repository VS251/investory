'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import { usePortfolioStore } from '@/store/usePortfolioStore'
import { useUserStore } from '@/store/useUserStore'
import { computeHealthScore } from '@/lib/ai/healthScore'
import { cn } from '@/lib/utils/cn'
import type { HealthGrade } from '@/types'

function gradeColor(grade: HealthGrade): string {
  const map: Record<HealthGrade, string> = {
    A: 'text-gain',
    B: 'text-gain',
    C: 'text-caution',
    D: 'text-loss',
    F: 'text-loss',
  }
  return map[grade]
}

function gradeBg(grade: HealthGrade): string {
  const map: Record<HealthGrade, string> = {
    A: 'bg-gain-light dark:bg-gain/10 border-gain/30',
    B: 'bg-gain-light dark:bg-gain/10 border-gain/30',
    C: 'bg-caution-light dark:bg-caution/10 border-caution/30',
    D: 'bg-loss-light dark:bg-loss/10 border-loss/30',
    F: 'bg-loss-light dark:bg-loss/10 border-loss/30',
  }
  return map[grade]
}

export function HealthScoreMiniCard() {
  const { holdings, cashBalance, startingBalance } = usePortfolioStore()
  const riskTolerance = useUserStore((s) => s.riskTolerance)

  const healthScore = useMemo(
    () => computeHealthScore(holdings, cashBalance, startingBalance, riskTolerance),
    [holdings, cashBalance, startingBalance, riskTolerance]
  )

  const hasPortfolio = Object.keys(holdings).length > 0

  return (
    <Link href="/portfolio" className="block group focus:outline-none">
      <div className="rounded-card border border-[var(--border)] bg-[var(--bg-card)] p-5 shadow-card transition-shadow group-hover:shadow-card-hover">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-[var(--text-primary)]">Portfolio Health</h3>
          <span className="text-xs text-brand-500 font-medium">View →</span>
        </div>

        <div className="flex items-center gap-4">
          <div
            className={cn(
              'flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full border-2 font-bold',
              gradeBg(healthScore.grade)
            )}
          >
            <div className="text-center">
              <div className={cn('text-xl font-bold leading-none', gradeColor(healthScore.grade))}>
                {hasPortfolio ? healthScore.total : '—'}
              </div>
              <div className={cn('text-xs font-semibold', gradeColor(healthScore.grade))}>
                {healthScore.grade}
              </div>
            </div>
          </div>

          <p className="text-xs text-[var(--text-muted)] leading-relaxed flex-1">
            {healthScore.summary}
          </p>
        </div>
      </div>
    </Link>
  )
}
