'use client'

import { useMemo } from 'react'
import { usePortfolioStore } from '@/store/usePortfolioStore'
import { useUserStore } from '@/store/useUserStore'
import { generateInsights } from '@/lib/ai/diagnostics'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { InsightCard } from '@/components/insights/InsightCard'
import { EmptyState } from '@/components/ui/EmptyState'
import type { Insight, InsightCategory } from '@/types'

interface Section {
  category: InsightCategory
  label: string
  icon: string
  insights: Insight[]
}

export default function InsightsPage() {
  const { holdings, trades, cashBalance, startingBalance } = usePortfolioStore()
  const { riskTolerance } = useUserStore()

  const insights = useMemo(
    () =>
      generateInsights({
        holdings,
        trades,
        cashBalance,
        startingBalance,
        riskTolerance,
      }),
    [holdings, trades, cashBalance, startingBalance, riskTolerance]
  )

  const hasTrades = trades.length > 0

  const sections: Omit<Section, 'insights'>[] = [
    { category: 'risk', label: 'Risk Alerts', icon: '🛡️' },
    { category: 'mistake', label: 'Common Mistakes', icon: '❌' },
    { category: 'opportunity', label: 'Opportunities', icon: '💡' },
    { category: 'good', label: 'Good Decisions', icon: '✅' },
  ]

  const grouped: Section[] = sections
    .map((s) => ({
      ...s,
      insights: insights.filter((i) => i.category === s.category),
    }))
    .filter((s) => s.insights.length > 0)

  const totalCount = insights.length

  return (
    <PageWrapper
      title="Insights"
      subtitle={
        hasTrades
          ? `${totalCount} personalised insight${totalCount !== 1 ? 's' : ''} based on your portfolio`
          : 'Make trades to unlock personalised insights'
      }
    >
      {!hasTrades ? (
        <EmptyState
          icon="🔍"
          title="No insights yet"
          description="Make some trades to get personalised insights about your portfolio behaviour."
          actionLabel="Start Trading"
          actionHref="/simulator"
        />
      ) : (
        <div className="flex flex-col gap-8">
          {grouped.map((section) => (
            <div key={section.category}>
              {/* Section header */}
              <div className="mb-3 flex items-center gap-2">
                <span className="text-lg">{section.icon}</span>
                <h2 className="text-sm font-semibold text-[var(--text-primary)]">
                  {section.label}
                </h2>
                <span className="ml-1 rounded-full bg-[var(--bg-card-alt)] px-2 py-0.5 text-xs font-medium text-[var(--text-muted)]">
                  {section.insights.length}
                </span>
              </div>

              {/* Insight cards */}
              <div className="flex flex-col gap-3">
                {section.insights.map((insight) => (
                  <InsightCard key={insight.id} insight={insight} />
                ))}
              </div>
            </div>
          ))}

          {/* Nothing grouped (edge case) */}
          {grouped.length === 0 && hasTrades && (
            <EmptyState
              icon="✨"
              title="Everything looks good!"
              description="Keep trading and checking back for personalised insights."
            />
          )}
        </div>
      )}
    </PageWrapper>
  )
}
