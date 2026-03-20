'use client'

import { PageWrapper } from '@/components/layout/PageWrapper'
import { WelcomeBanner } from '@/components/dashboard/WelcomeBanner'
import { QuickStatsRow } from '@/components/dashboard/QuickStatsRow'
import { DailyLessonWidget } from '@/components/dashboard/DailyLessonWidget'
import { RecentTradesWidget } from '@/components/dashboard/RecentTradesWidget'
import { PortfolioSummaryCard } from '@/components/dashboard/PortfolioSummaryCard'
import { HealthScoreMiniCard } from '@/components/dashboard/HealthScoreMiniCard'

export default function DashboardPage() {
  return (
    <PageWrapper>
      <div className="flex flex-col gap-6">
        {/* Full width: greeting + portfolio value */}
        <WelcomeBanner />

        {/* Full width: 3 quick stats */}
        <QuickStatsRow />

        {/* Two-column grid on lg+ */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Left column */}
          <div className="flex flex-col gap-6">
            <DailyLessonWidget />
            <RecentTradesWidget />
          </div>

          {/* Right column */}
          <div className="flex flex-col gap-6">
            <PortfolioSummaryCard />
            <HealthScoreMiniCard />
          </div>
        </div>
      </div>
    </PageWrapper>
  )
}
