'use client'

import { useState, useMemo } from 'react'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { Card } from '@/components/ui/Card'
import { formatCurrency } from '@/lib/utils/formatters'

// ─── SIP Calculator ───────────────────────────────────────────────────────────

function SIPCalculator() {
  const [monthlyAmount, setMonthlyAmount] = useState(5000)
  const [rate, setRate] = useState(12)
  const [years, setYears] = useState(10)

  const result = useMemo(() => {
    // M = P × ((1+r)^n - 1) / r × (1+r)
    const r = rate / 100 / 12
    const n = years * 12
    if (r === 0) {
      const maturity = monthlyAmount * n
      return { maturity, totalInvested: maturity, wealthGained: 0 }
    }
    const maturity = monthlyAmount * (((Math.pow(1 + r, n) - 1) / r) * (1 + r))
    const totalInvested = monthlyAmount * n
    const wealthGained = maturity - totalInvested
    return { maturity, totalInvested, wealthGained }
  }, [monthlyAmount, rate, years])

  return (
    <Card>
      <h2 className="text-base font-bold text-[var(--text-primary)] mb-1">SIP Calculator</h2>
      <p className="text-xs text-[var(--text-muted)] mb-5">
        Estimate returns from a Systematic Investment Plan
      </p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mb-6">
        <InputField
          label="Monthly Amount (₹)"
          value={monthlyAmount}
          onChange={setMonthlyAmount}
          min={100}
          max={10000000}
        />
        <InputField
          label="Expected Return (%)"
          value={rate}
          onChange={setRate}
          min={1}
          max={50}
          step={0.5}
          isPercent
        />
        <InputField
          label="Duration (Years)"
          value={years}
          onChange={setYears}
          min={1}
          max={40}
        />
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <ResultBox label="Maturity Value" value={formatCurrency(result.maturity)} highlight />
        <ResultBox label="Total Invested" value={formatCurrency(result.totalInvested)} />
        <ResultBox
          label="Wealth Gained"
          value={formatCurrency(result.wealthGained)}
          positive={result.wealthGained > 0}
        />
      </div>
    </Card>
  )
}

// ─── Compound Interest Calculator ────────────────────────────────────────────

type CompoundingFrequency = 'annual' | 'quarterly' | 'monthly'

const FREQ_MAP: Record<CompoundingFrequency, number> = {
  annual: 1,
  quarterly: 4,
  monthly: 12,
}

function CompoundInterestCalculator() {
  const [principal, setPrincipal] = useState(100000)
  const [rate, setRate] = useState(8)
  const [years, setYears] = useState(5)
  const [frequency, setFrequency] = useState<CompoundingFrequency>('annual')

  const result = useMemo(() => {
    // A = P(1 + r/n)^(nt)
    const n = FREQ_MAP[frequency]
    const r = rate / 100
    const finalValue = principal * Math.pow(1 + r / n, n * years)
    const totalInterest = finalValue - principal
    return { finalValue, totalInterest }
  }, [principal, rate, years, frequency])

  return (
    <Card>
      <h2 className="text-base font-bold text-[var(--text-primary)] mb-1">
        Compound Interest Calculator
      </h2>
      <p className="text-xs text-[var(--text-muted)] mb-5">
        See how your money grows with compounding
      </p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mb-5">
        <InputField
          label="Principal Amount (₹)"
          value={principal}
          onChange={setPrincipal}
          min={1000}
          max={100000000}
        />
        <InputField
          label="Annual Rate (%)"
          value={rate}
          onChange={setRate}
          min={0.1}
          max={50}
          step={0.5}
          isPercent
        />
        <InputField
          label="Duration (Years)"
          value={years}
          onChange={setYears}
          min={1}
          max={50}
        />
        <div>
          <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5">
            Compounding
          </label>
          <select
            value={frequency}
            onChange={(e) => setFrequency(e.target.value as CompoundingFrequency)}
            className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg-card)] px-3 py-2 text-sm text-[var(--text-primary)] focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-400/20 transition-colors"
          >
            <option value="annual">Annual</option>
            <option value="quarterly">Quarterly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <ResultBox label="Final Value" value={formatCurrency(result.finalValue)} highlight />
        <ResultBox
          label="Total Interest Earned"
          value={formatCurrency(result.totalInterest)}
          positive={result.totalInterest > 0}
        />
      </div>
    </Card>
  )
}

// ─── Shared UI helpers ────────────────────────────────────────────────────────

interface InputFieldProps {
  label: string
  value: number
  onChange: (val: number) => void
  min?: number
  max?: number
  step?: number
  isPercent?: boolean
}

function InputField({ label, value, onChange, min, max, step = 1, isPercent }: InputFieldProps) {
  return (
    <div>
      <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5">
        {label}
      </label>
      <input
        type="number"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(e) => {
          const parsed = isPercent ? parseFloat(e.target.value) : parseInt(e.target.value, 10)
          if (!isNaN(parsed)) onChange(parsed)
        }}
        className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg-card)] px-3 py-2 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-400/20 transition-colors tabular-nums"
      />
    </div>
  )
}

interface ResultBoxProps {
  label: string
  value: string
  highlight?: boolean
  positive?: boolean
}

function ResultBox({ label, value, highlight, positive }: ResultBoxProps) {
  return (
    <div
      className={
        highlight
          ? 'rounded-lg bg-brand-50 dark:bg-brand-900/20 border border-brand-200 dark:border-brand-800 px-4 py-3'
          : 'rounded-lg bg-[var(--bg-card-alt)] px-4 py-3'
      }
    >
      <p className="text-xs text-[var(--text-muted)] mb-1">{label}</p>
      <p
        className={[
          'tabular-nums text-base font-bold',
          highlight
            ? 'text-brand-600 dark:text-brand-300'
            : positive
            ? 'text-gain'
            : 'text-[var(--text-primary)]',
        ].join(' ')}
      >
        {value}
      </p>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ToolsPage() {
  return (
    <PageWrapper title="Financial Tools" subtitle="Plan smarter with these calculators">
      <div className="flex flex-col gap-6">
        <SIPCalculator />
        <CompoundInterestCalculator />

        <p className="text-xs text-[var(--text-muted)] text-center">
          All calculations are estimates for educational purposes only. Not financial advice.
        </p>
      </div>
    </PageWrapper>
  )
}
