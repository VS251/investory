'use client'

import { useMemo } from 'react'
import { usePortfolioStore } from '@/store/usePortfolioStore'
import { useUserStore } from '@/store/useUserStore'
import { explainTrade } from '@/lib/ai/explainAction'
import { Modal } from '@/components/ui/Modal'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils/cn'
import type { Trade, RiskLevel } from '@/types'

interface ExplainMyActionModalProps {
  trade: Trade | null
  open: boolean
  onClose: () => void
  onNext?: () => void
}

function riskBadgeVariant(level: RiskLevel): 'success' | 'warning' | 'danger' {
  if (level === 'low') return 'success'
  if (level === 'medium') return 'warning'
  return 'danger'
}

function riskLabel(level: RiskLevel): string {
  if (level === 'low') return 'Low Risk'
  if (level === 'medium') return 'Medium Risk'
  return 'High Risk'
}

function riskBannerClass(level: RiskLevel): string {
  if (level === 'low')
    return 'border-gain/30 bg-gain-light text-gain-dark dark:bg-gain/15 dark:text-gain'
  if (level === 'medium')
    return 'border-caution/30 bg-caution-light text-caution-dark dark:bg-caution/15 dark:text-caution'
  return 'border-loss/30 bg-loss-light text-loss-dark dark:bg-loss/15 dark:text-loss'
}

export function ExplainMyActionModal({
  trade,
  open,
  onClose,
  onNext,
}: ExplainMyActionModalProps) {
  const { holdings, cashBalance, startingBalance } = usePortfolioStore()
  const { riskTolerance } = useUserStore()

  const explanation = useMemo(() => {
    if (!trade) return null
    return explainTrade(trade, { holdings, cashBalance, startingBalance })
  }, [trade, holdings, cashBalance, startingBalance])

  // riskTolerance is available if needed for future personalization;
  // currently used to contextualize the tip tone
  void riskTolerance

  if (!trade || !explanation) return null

  return (
    <Modal open={open} onClose={onClose} title="Trade Explanation" size="md">
      <div className="flex flex-col gap-4">
        {/* Headline + Risk badge */}
        <div>
          <div className="mb-2 flex items-center gap-2 flex-wrap">
            <Badge variant={riskBadgeVariant(explanation.riskLevel)} size="md">
              {riskLabel(explanation.riskLevel)}
            </Badge>
            <span className="text-xs text-[var(--text-muted)]">{explanation.riskReason}</span>
          </div>
          <h3 className="text-base font-semibold text-[var(--text-primary)]">
            {explanation.headline}
          </h3>
        </div>

        {/* Risk summary banner */}
        <div
          className={cn(
            'rounded-lg border px-3 py-2.5 text-sm',
            riskBannerClass(explanation.riskLevel)
          )}
        >
          {explanation.explanation}
        </div>

        {/* Warnings */}
        {explanation.warnings.length > 0 && (
          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">
              Watch out
            </span>
            <ul className="flex flex-col gap-1.5">
              {explanation.warnings.map((w, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 rounded-lg bg-[var(--bg-card-alt)] px-3 py-2 text-sm text-[var(--text-secondary)]"
                >
                  <span className="mt-0.5 flex-shrink-0">⚠️</span>
                  <span>{w}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Tip */}
        <div className="flex items-start gap-3 rounded-lg border border-gain/30 bg-gain-light px-3 py-3 dark:border-gain/20 dark:bg-gain/10">
          <span className="flex-shrink-0 text-lg">💡</span>
          <div>
            <span className="mb-0.5 block text-xs font-semibold text-gain-dark dark:text-gain">
              Investor Tip
            </span>
            <p className="text-sm text-gain-dark dark:text-gain">{explanation.tip}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-1">
          <Button
            variant="secondary"
            size="md"
            className="flex-1"
            onClick={onClose}
          >
            Got it
          </Button>
          {onNext && (
            <Button
              variant="primary"
              size="md"
              className="flex-1"
              onClick={onNext}
            >
              View My Portfolio →
            </Button>
          )}
        </div>
      </div>
    </Modal>
  )
}
