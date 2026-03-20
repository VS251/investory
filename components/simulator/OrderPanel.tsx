'use client'

import { useState, useEffect, useCallback } from 'react'
import { usePortfolioStore } from '@/store/usePortfolioStore'
import { getStock } from '@/lib/data/stocks'
import { getPreTradeInsight } from '@/lib/ai/explainAction'
import { formatCurrency } from '@/lib/utils/formatters'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils/cn'
import type { Trade } from '@/types'

interface OrderPanelProps {
  symbol: string
  onTradeExecuted: (trade: Trade) => void
}

type OrderType = 'buy' | 'sell'

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState<T>(value)
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])
  return debounced
}

export function OrderPanel({ symbol, onTradeExecuted }: OrderPanelProps) {
  const { cashBalance, holdings, startingBalance, executeBuy, executeSell } = usePortfolioStore()
  const [orderType, setOrderType] = useState<OrderType>('buy')
  const [quantityStr, setQuantityStr] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isExecuting, setIsExecuting] = useState(false)

  const stock = getStock(symbol)
  const currentPrice = stock?.currentPrice ?? 0
  const quantity = parseInt(quantityStr, 10) || 0
  const total = quantity * currentPrice
  const existingHolding = holdings[symbol]
  const ownedQty = existingHolding?.quantity ?? 0

  // Debounced quantity for pre-trade insight
  const debouncedQty = useDebounce(quantity, 300)

  const preTradeInsight = useCallback(() => {
    if (debouncedQty <= 0 || orderType !== 'buy') return null
    return getPreTradeInsight(symbol, debouncedQty, currentPrice, {
      holdings,
      cashBalance,
      startingBalance,
    })
  }, [debouncedQty, symbol, currentPrice, holdings, cashBalance, startingBalance, orderType])

  const insight = preTradeInsight()

  // Clear error when inputs change
  useEffect(() => {
    setError(null)
  }, [symbol, quantity, orderType])

  // Reset quantity when symbol changes
  useEffect(() => {
    setQuantityStr('')
    setError(null)
  }, [symbol])

  function validateOrder(): string | null {
    if (!stock) return 'Stock not found'
    if (quantity <= 0) return 'Enter a valid quantity (minimum 1)'
    if (orderType === 'buy') {
      if (total > cashBalance) {
        return `Insufficient funds. You need ${formatCurrency(total)} but have ${formatCurrency(cashBalance)}`
      }
    } else {
      if (ownedQty <= 0) return `You don't hold any ${symbol}`
      if (quantity > ownedQty) {
        return `You only own ${ownedQty} shares of ${symbol}`
      }
    }
    return null
  }

  async function handleExecute() {
    const validationError = validateOrder()
    if (validationError) {
      setError(validationError)
      return
    }
    if (!stock) return

    setIsExecuting(true)
    setError(null)

    try {
      const result =
        orderType === 'buy'
          ? executeBuy(symbol, stock.name, quantity, currentPrice)
          : executeSell(symbol, stock.name, quantity, currentPrice)

      if (result.success) {
        setQuantityStr('')
        onTradeExecuted(result.trade)
      } else {
        const errorMessages: Record<string, string> = {
          insufficient_funds: `Insufficient funds. You need ${formatCurrency(total)} but have ${formatCurrency(cashBalance)}`,
          insufficient_holdings: `You only own ${ownedQty} shares of ${symbol}`,
          invalid_quantity: 'Enter a valid quantity (minimum 1)',
        }
        setError(errorMessages[result.error] ?? 'Trade failed. Please try again.')
      }
    } finally {
      setIsExecuting(false)
    }
  }

  const isDisabled = !stock || quantity <= 0 || isExecuting

  const insightBgClass =
    insight?.riskLevel === 'high'
      ? 'bg-loss-light text-loss-dark dark:bg-loss/20 dark:text-loss border-loss/30'
      : insight?.riskLevel === 'medium'
      ? 'bg-caution-light text-caution-dark dark:bg-caution/20 dark:text-caution border-caution/30'
      : 'bg-gain-light text-gain-dark dark:bg-gain/20 dark:text-gain border-gain/30'

  return (
    <div className="flex flex-col gap-4">
      {/* Buy / Sell tabs */}
      <div className="flex rounded-lg border border-[var(--border)] bg-[var(--bg-card-alt)] p-1">
        {(['buy', 'sell'] as OrderType[]).map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => {
              setOrderType(type)
              setError(null)
            }}
            className={cn(
              'flex-1 rounded-md py-1.5 text-sm font-semibold capitalize transition-all',
              orderType === type
                ? type === 'buy'
                  ? 'bg-gain text-white shadow-sm'
                  : 'bg-loss text-white shadow-sm'
                : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            )}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Price row */}
      {stock && (
        <div className="flex items-center justify-between rounded-lg bg-[var(--bg-card-alt)] px-3 py-2">
          <span className="text-xs text-[var(--text-muted)]">Market Price</span>
          <span className="font-semibold text-[var(--text-primary)]">
            {formatCurrency(currentPrice)}
          </span>
        </div>
      )}

      {/* Quantity input */}
      <div>
        <label className="mb-1.5 block text-xs font-medium text-[var(--text-secondary)]">
          Quantity
        </label>
        <input
          type="number"
          min={1}
          value={quantityStr}
          onChange={(e) => setQuantityStr(e.target.value)}
          placeholder="Enter shares"
          className={cn(
            'w-full rounded-lg border px-3 py-2.5 text-sm transition-colors',
            'bg-[var(--bg-card)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)]',
            'focus:outline-none focus:ring-2 focus:ring-brand-400 focus:ring-offset-1',
            error ? 'border-loss' : 'border-[var(--border)] hover:border-brand-400'
          )}
        />
      </div>

      {/* Pre-trade insight banner */}
      {insight?.warning && orderType === 'buy' && quantity > 0 && (
        <div
          className={cn(
            'rounded-lg border px-3 py-2.5 text-xs font-medium',
            insightBgClass
          )}
        >
          {insight.riskLevel === 'high' ? '⚠️' : insight.riskLevel === 'medium' ? '⚡' : 'ℹ️'}{' '}
          {insight.warning}
        </div>
      )}

      {/* Total */}
      {quantity > 0 && currentPrice > 0 && (
        <div className="flex items-center justify-between rounded-lg border border-[var(--border)] bg-[var(--bg-card-alt)] px-3 py-2">
          <span className="text-xs text-[var(--text-muted)]">Order Total</span>
          <span className="font-bold text-[var(--text-primary)]">{formatCurrency(total)}</span>
        </div>
      )}

      {/* Balance / Holdings info */}
      {orderType === 'buy' ? (
        <div className="flex items-center justify-between text-xs">
          <span className="text-[var(--text-muted)]">Available Cash</span>
          <span
            className={cn(
              'font-medium',
              total > cashBalance ? 'text-loss' : 'text-[var(--text-secondary)]'
            )}
          >
            {formatCurrency(cashBalance)}
          </span>
        </div>
      ) : (
        <div className="flex items-center justify-between text-xs">
          <span className="text-[var(--text-muted)]">You Own</span>
          <span className="font-medium text-[var(--text-secondary)]">
            {ownedQty} share{ownedQty !== 1 ? 's' : ''} of {symbol}
          </span>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="rounded-lg border border-loss/30 bg-loss-light px-3 py-2 text-xs text-loss-dark dark:bg-loss/20 dark:text-loss">
          {error}
        </div>
      )}

      {/* Execute button */}
      <Button
        variant={orderType === 'buy' ? 'success' : 'danger'}
        size="lg"
        className="w-full"
        disabled={isDisabled}
        loading={isExecuting}
        onClick={handleExecute}
      >
        {isExecuting
          ? 'Executing...'
          : `${orderType === 'buy' ? 'Buy' : 'Sell'} ${quantity > 0 ? `${quantity} × ` : ''}${symbol}`}
      </Button>
    </div>
  )
}
