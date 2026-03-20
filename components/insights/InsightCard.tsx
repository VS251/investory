import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils/cn'
import type { Insight, InsightSeverity, InsightCategory } from '@/types'

interface InsightCardProps {
  insight: Insight
}

function severityBorderColor(severity: InsightSeverity): string {
  const map: Record<InsightSeverity, string> = {
    critical: 'border-l-loss',
    warning: 'border-l-caution',
    info: 'border-l-brand-500',
    positive: 'border-l-gain',
  }
  return map[severity]
}

function severityBg(severity: InsightSeverity): string {
  const map: Record<InsightSeverity, string> = {
    critical: 'bg-loss-light dark:bg-loss/5',
    warning: 'bg-caution-light dark:bg-caution/5',
    info: 'bg-brand-50 dark:bg-brand-900/10',
    positive: 'bg-gain-light dark:bg-gain/5',
  }
  return map[severity]
}

function categoryIcon(category: InsightCategory): string {
  const map: Record<InsightCategory, string> = {
    risk: '🛡️',
    mistake: '❌',
    opportunity: '💡',
    good: '✅',
  }
  return map[category]
}

function actionButtonVariant(
  severity: InsightSeverity
): 'danger' | 'primary' | 'secondary' {
  if (severity === 'critical') return 'danger'
  if (severity === 'warning' || severity === 'info') return 'primary'
  return 'secondary'
}

export function InsightCard({ insight }: InsightCardProps) {
  return (
    <div
      className={cn(
        'rounded-card border border-[var(--border)] border-l-4 shadow-card',
        severityBorderColor(insight.severity),
        severityBg(insight.severity)
      )}
    >
      <div className="px-4 py-3">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 flex-shrink-0 text-lg leading-none">
            {categoryIcon(insight.category)}
          </span>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-[var(--text-primary)]">{insight.title}</p>
            <p className="mt-1 text-sm text-[var(--text-secondary)]">{insight.body}</p>
            {insight.actionLabel && insight.actionHref && (
              <div className="mt-3">
                <Link href={insight.actionHref}>
                  <Button variant={actionButtonVariant(insight.severity)} size="sm">
                    {insight.actionLabel}
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
