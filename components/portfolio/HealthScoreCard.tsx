'use client'

import { useEffect, useMemo } from 'react'
import { usePortfolioStore } from '@/store/usePortfolioStore'
import { useUserStore } from '@/store/useUserStore'
import { computeHealthScore } from '@/lib/ai/healthScore'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils/cn'
import Link from 'next/link'
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

function scoreBarColor(grade: HealthGrade): 'gain' | 'caution' | 'brand' {
  if (grade === 'A' || grade === 'B') return 'gain'
  if (grade === 'C') return 'caution'
  return 'brand'
}

function ctaConfig(score: number): { label: string; href: string; variant: 'primary' | 'success' | 'secondary' } {
  if (score >= 80) return { label: 'Keep it up — explore more stocks', href: '/simulator', variant: 'success' }
  if (score >= 65) return { label: 'Improve diversification', href: '/simulator', variant: 'primary' }
  if (score >= 50) return { label: 'Reduce concentration risk', href: '/simulator', variant: 'primary' }
  if (score >= 35) return { label: 'Diversify your portfolio now', href: '/simulator', variant: 'primary' }
  return { label: 'Start improving your portfolio', href: '/simulator', variant: 'primary' }
}

export function HealthScoreCard() {
  const { holdings, cashBalance, startingBalance, lastHealthScore, setLastHealthScore } =
    usePortfolioStore()
  const { riskTolerance } = useUserStore()

  const healthScore = useMemo(
    () => computeHealthScore(holdings, cashBalance, startingBalance, riskTolerance),
    [holdings, cashBalance, startingBalance, riskTolerance]
  )

  // Update stored health score on mount and whenever it changes
  useEffect(() => {
    if (healthScore.total > 0) {
      setLastHealthScore(healthScore.total)
    }
  }, [healthScore.total, setLastHealthScore])

  const delta =
    lastHealthScore !== null && healthScore.total > 0
      ? healthScore.total - lastHealthScore
      : null

  const { label: ctaLabel, href: ctaHref, variant: ctaVariant } = ctaConfig(healthScore.total)

  const hasPortfolio = Object.keys(holdings).length > 0

  return (
    <div className="flex flex-col gap-5">
      {/* Circular score display */}
      <div className="flex items-center gap-4">
        <div
          className={cn(
            'flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-full border-2 font-bold',
            gradeBg(healthScore.grade)
          )}
        >
          <div className="text-center">
            <div className={cn('text-2xl font-bold leading-none', gradeColor(healthScore.grade))}>
              {hasPortfolio ? healthScore.total : '—'}
            </div>
            <div className={cn('text-sm font-semibold', gradeColor(healthScore.grade))}>
              {healthScore.grade}
            </div>
          </div>
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-semibold text-[var(--text-primary)]">
              Portfolio Health
            </span>
            {delta !== null && delta !== 0 && (
              <span
                className={cn(
                  'text-xs font-medium px-1.5 py-0.5 rounded',
                  delta > 0
                    ? 'bg-gain-light text-gain-dark dark:bg-gain/20 dark:text-gain'
                    : 'bg-loss-light text-loss-dark dark:bg-loss/20 dark:text-loss'
                )}
              >
                {delta > 0 ? '+' : ''}
                {delta} after last trade
              </span>
            )}
          </div>
          <p className="mt-1 text-xs text-[var(--text-muted)]">{healthScore.summary}</p>
        </div>
      </div>

      {/* Sub-score bars */}
      {hasPortfolio && (
        <div className="flex flex-col gap-3">
          <div>
            <div className="mb-1 flex items-center justify-between">
              <span className="text-xs text-[var(--text-secondary)]">Diversification</span>
              <span className="text-xs font-medium text-[var(--text-primary)]">
                {healthScore.breakdown.diversification} / 40
              </span>
            </div>
            <ProgressBar
              value={(healthScore.breakdown.diversification / 40) * 100}
              color={scoreBarColor(healthScore.grade)}
              size="sm"
            />
          </div>

          <div>
            <div className="mb-1 flex items-center justify-between">
              <span className="text-xs text-[var(--text-secondary)]">Risk Match</span>
              <span className="text-xs font-medium text-[var(--text-primary)]">
                {healthScore.breakdown.riskMatch} / 35
              </span>
            </div>
            <ProgressBar
              value={(healthScore.breakdown.riskMatch / 35) * 100}
              color={scoreBarColor(healthScore.grade)}
              size="sm"
            />
          </div>

          <div>
            <div className="mb-1 flex items-center justify-between">
              <span className="text-xs text-[var(--text-secondary)]">Cash Ratio</span>
              <span className="text-xs font-medium text-[var(--text-primary)]">
                {healthScore.breakdown.cashRatio} / 25
              </span>
            </div>
            <ProgressBar
              value={(healthScore.breakdown.cashRatio / 25) * 100}
              color={scoreBarColor(healthScore.grade)}
              size="sm"
            />
          </div>
        </div>
      )}

      {/* CTA */}
      <Link href={ctaHref}>
        <Button variant={ctaVariant} size="sm" className="w-full">
          {ctaLabel}
        </Button>
      </Link>
    </div>
  )
}
