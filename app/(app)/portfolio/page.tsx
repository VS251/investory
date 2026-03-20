'use client'

import { useState } from 'react'
import { usePortfolioStore } from '@/store/usePortfolioStore'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { PLSummaryBar } from '@/components/portfolio/PLSummaryBar'
import { HealthScoreCard } from '@/components/portfolio/HealthScoreCard'
import { AllocationChart } from '@/components/portfolio/AllocationChart'
import { HoldingsTable } from '@/components/portfolio/HoldingsTable'
import { Modal } from '@/components/ui/Modal'
import { Download, RotateCcw } from 'lucide-react'

export default function PortfolioPage() {
  const { holdings, trades, exportData, resetPortfolio } = usePortfolioStore()
  const [showResetModal, setShowResetModal] = useState(false)

  const hasHoldings = Object.keys(holdings).length > 0
  const hasTrades = trades.length > 0

  function handleExport() {
    const json = exportData()
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `investory-portfolio-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  function handleReset() {
    resetPortfolio()
    setShowResetModal(false)
  }

  const totalTrades = trades.length

  return (
    <PageWrapper
      title="Portfolio"
      subtitle={
        totalTrades > 0
          ? `${totalTrades} trade${totalTrades !== 1 ? 's' : ''} made`
          : 'Track your virtual investments'
      }
    >
      {/* Empty state — no trades at all */}
      {!hasTrades && !hasHoldings ? (
        <EmptyState
          icon="💼"
          title="Your portfolio is empty"
          description="Make your first trade in the simulator to start building your portfolio."
          actionLabel="Go to Simulator"
          actionHref="/simulator"
        />
      ) : (
        <div className="flex flex-col gap-6">
          {/* P&L summary */}
          <PLSummaryBar />

          {/* Health score + allocation */}
          <div className="grid gap-6 lg:grid-cols-5">
            <Card className="lg:col-span-3">
              <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">
                Portfolio Health
              </p>
              <HealthScoreCard />
            </Card>

            <Card className="lg:col-span-2">
              <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">
                Sector Allocation
              </p>
              <AllocationChart />
            </Card>
          </div>

          {/* Holdings table */}
          <Card padding="none">
            <div className="border-b border-[var(--border)] px-5 py-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">
                Holdings
              </p>
            </div>
            <div className="p-5">
              <HoldingsTable />
            </div>
          </Card>

          {/* Export / Reset */}
          <Card>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-[var(--text-primary)]">
                  Portfolio Actions
                </p>
                <p className="mt-0.5 text-xs text-[var(--text-muted)]">
                  Export your data or reset to start fresh with ₹1,00,000
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleExport}
                  className="flex items-center gap-1.5"
                >
                  <Download size={14} />
                  Export JSON
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => setShowResetModal(true)}
                  className="flex items-center gap-1.5"
                >
                  <RotateCcw size={14} />
                  Reset Portfolio
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Reset confirmation modal */}
      <Modal
        open={showResetModal}
        onClose={() => setShowResetModal(false)}
        title="Reset Portfolio"
        size="sm"
      >
        <div className="flex flex-col gap-4">
          <p className="text-sm text-[var(--text-secondary)]">
            This will clear all your holdings and trade history, and restore your balance to
            ₹1,00,000. This cannot be undone.
          </p>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="md"
              className="flex-1"
              onClick={() => setShowResetModal(false)}
            >
              Cancel
            </Button>
            <Button variant="danger" size="md" className="flex-1" onClick={handleReset}>
              Yes, Reset
            </Button>
          </div>
        </div>
      </Modal>
    </PageWrapper>
  )
}
