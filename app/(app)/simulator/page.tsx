'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { Card } from '@/components/ui/Card'
import { StockSelector } from '@/components/simulator/StockSelector'
import { MarketPriceDisplay } from '@/components/simulator/MarketPriceDisplay'
import { StockLineChart } from '@/components/charts/StockLineChart'
import { OrderPanel } from '@/components/simulator/OrderPanel'
import { TradeHistory } from '@/components/simulator/TradeHistory'
import { ExplainMyActionModal } from '@/components/simulator/ExplainMyActionModal'
import { Info, BookOpen } from 'lucide-react'
import type { Trade } from '@/types'

export default function SimulatorPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const guided = searchParams.get('guided') === 'true'
  const lessonParam = searchParams.get('lesson')

  const [selectedSymbol, setSelectedSymbol] = useState('RELIANCE')
  const [showExplainModal, setShowExplainModal] = useState(false)
  const [lastTrade, setLastTrade] = useState<Trade | null>(null)

  // If guided, pre-select RELIANCE
  useEffect(() => {
    if (guided) {
      setSelectedSymbol('RELIANCE')
    }
  }, [guided])

  function handleTradeExecuted(trade: Trade) {
    setLastTrade(trade)
    setShowExplainModal(true)
  }

  function handleModalClose() {
    setShowExplainModal(false)
  }

  function handleModalNext() {
    setShowExplainModal(false)
    if (guided) {
      router.push('/portfolio')
    }
  }

  const lessonHints: Record<string, string> = {
    'what-is-a-stock': 'Try buying 1 share of a company you recognise. Notice how the price changes.',
    'buy-and-hold': 'Practise buying and holding — resist the urge to sell immediately.',
    'diversification': 'Try buying stocks from at least 3 different sectors.',
    'risk-and-return': 'Compare how different sectors perform over 1M vs 1Y ranges.',
  }
  const lessonHint = lessonParam ? lessonHints[lessonParam] : null

  return (
    <PageWrapper title="Simulator" subtitle="Practise trading with virtual ₹1,00,000">
      {/* Market realism notice */}
      <div className="mb-4 flex items-start gap-2 rounded-lg border border-brand-200 bg-brand-50 px-3 py-2.5 text-xs text-brand-700 dark:border-brand-800 dark:bg-brand-900/30 dark:text-brand-300">
        <Info size={14} className="mt-0.5 flex-shrink-0" />
        <span>
          Simulated data for learning purposes. Prices reflect a 1-year training period and are
          not live market data.
        </span>
      </div>

      {/* Guided banner */}
      {guided && (
        <div className="mb-4 rounded-lg border border-gain/30 bg-gain-light px-4 py-3 dark:border-gain/20 dark:bg-gain/10">
          <div className="flex items-start gap-3">
            <span className="text-xl">🎯</span>
            <div>
              <p className="text-sm font-semibold text-gain-dark dark:text-gain">
                Guided First Trade
              </p>
              <p className="mt-0.5 text-sm text-gain-dark/80 dark:text-gain/80">
                We've pre-selected Reliance Industries for you. Enter a quantity (e.g. 2), review
                the pre-trade insight, and click Buy. After the trade you'll see an AI-powered
                explanation.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Lesson hint banner */}
      {lessonHint && (
        <div className="mb-4 rounded-lg border border-brand-200 bg-brand-50 px-4 py-3 dark:border-brand-800 dark:bg-brand-900/30">
          <div className="flex items-start gap-3">
            <BookOpen size={16} className="mt-0.5 flex-shrink-0 text-brand-500" />
            <div>
              <p className="text-xs font-semibold text-brand-700 dark:text-brand-300">
                Lesson Context
              </p>
              <p className="mt-0.5 text-sm text-brand-700 dark:text-brand-300">{lessonHint}</p>
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left pane: stock info */}
        <div className="flex flex-col gap-5">
          <Card>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">
              Select Stock
            </p>
            <StockSelector value={selectedSymbol} onChange={setSelectedSymbol} />
          </Card>

          <Card>
            <MarketPriceDisplay symbol={selectedSymbol} />
          </Card>

          <Card>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">
              Price History
            </p>
            <StockLineChart symbol={selectedSymbol} height={200} />
          </Card>
        </div>

        {/* Right pane: order + history */}
        <div className="flex flex-col gap-5">
          <Card>
            <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">
              Place Order
            </p>
            <OrderPanel symbol={selectedSymbol} onTradeExecuted={handleTradeExecuted} />
          </Card>

          <Card>
            <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">
              Trade History
            </p>
            <TradeHistory />
          </Card>
        </div>
      </div>

      {/* Explain My Action modal */}
      <ExplainMyActionModal
        trade={lastTrade}
        open={showExplainModal}
        onClose={handleModalClose}
        onNext={guided ? handleModalNext : undefined}
      />
    </PageWrapper>
  )
}
