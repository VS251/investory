'use client'

import { usePortfolioStore } from '@/store/usePortfolioStore'
import { getPortfolioValue, getTotalInvested, getUnrealizedPnL } from '@/lib/utils/calculations'
import { formatCurrency, formatPercent } from '@/lib/utils/formatters'
import { cn } from '@/lib/utils/cn'
import { TrendingUp, TrendingDown, Wallet } from 'lucide-react'

interface StatBoxProps {
  label: string
  value: string
  subValue?: string
  isGain?: boolean
  isLoss?: boolean
  icon?: React.ReactNode
}

function StatBox({ label, value, subValue, isGain, isLoss, icon }: StatBoxProps) {
  return (
    <div className="flex flex-col gap-1 rounded-lg border border-[var(--border)] bg-[var(--bg-card)] p-4">
      <div className="flex items-center gap-1.5">
        {icon && <span className="text-[var(--text-muted)]">{icon}</span>}
        <span className="text-xs font-medium text-[var(--text-muted)]">{label}</span>
      </div>
      <span
        className={cn(
          'text-xl font-bold',
          isGain ? 'text-gain' : isLoss ? 'text-loss' : 'text-[var(--text-primary)]'
        )}
      >
        {value}
      </span>
      {subValue && (
        <span
          className={cn(
            'text-xs font-medium',
            isGain ? 'text-gain' : isLoss ? 'text-loss' : 'text-[var(--text-muted)]'
          )}
        >
          {subValue}
        </span>
      )}
    </div>
  )
}

export function PLSummaryBar() {
  const { holdings, cashBalance } = usePortfolioStore()

  const totalInvested = getTotalInvested(holdings)
  const currentValue = getPortfolioValue(holdings)
  const { amount: pnlAmount, percent: pnlPercent } = getUnrealizedPnL(holdings)

  const isGain = pnlAmount > 0
  const isLoss = pnlAmount < 0

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      <StatBox
        label="Total Invested"
        value={formatCurrency(totalInvested)}
        subValue={`Cash: ${formatCurrency(cashBalance)}`}
        icon={<Wallet size={13} />}
      />
      <StatBox
        label="Current Value"
        value={formatCurrency(currentValue)}
        subValue={`Portfolio holdings`}
        icon={<TrendingUp size={13} />}
      />
      <StatBox
        label="Unrealized P&L"
        value={formatCurrency(pnlAmount)}
        subValue={pnlAmount !== 0 ? formatPercent(pnlPercent) : '0.00%'}
        isGain={isGain}
        isLoss={isLoss}
        icon={isGain ? <TrendingUp size={13} /> : isLoss ? <TrendingDown size={13} /> : undefined}
      />
    </div>
  )
}
