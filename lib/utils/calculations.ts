import type { Holding, Trade, PortfolioSnapshot } from '@/types'
import { getStockPrice, getStock } from '@/lib/data/stocks'

export function getPortfolioValue(holdings: Record<string, Holding>): number {
  return Object.values(holdings).reduce((total, h) => {
    const price = getStockPrice(h.symbol)
    return total + h.quantity * price
  }, 0)
}

export function getTotalInvested(holdings: Record<string, Holding>): number {
  return Object.values(holdings).reduce((total, h) => total + h.totalInvested, 0)
}

export function getUnrealizedPnL(holdings: Record<string, Holding>): {
  amount: number
  percent: number
} {
  const currentValue = getPortfolioValue(holdings)
  const invested = getTotalInvested(holdings)
  const amount = currentValue - invested
  const percent = invested > 0 ? (amount / invested) * 100 : 0
  return { amount, percent }
}

export function getHoldingPnL(holding: Holding): { amount: number; percent: number } {
  const currentPrice = getStockPrice(holding.symbol)
  const currentValue = holding.quantity * currentPrice
  const amount = currentValue - holding.totalInvested
  const percent = holding.totalInvested > 0 ? (amount / holding.totalInvested) * 100 : 0
  return { amount, percent }
}

export function getAllocationByStock(
  holdings: Record<string, Holding>
): Record<string, number> {
  const totalValue = getPortfolioValue(holdings)
  if (totalValue === 0) return {}

  const result: Record<string, number> = {}
  for (const [symbol, holding] of Object.entries(holdings)) {
    const price = getStockPrice(symbol)
    result[symbol] = (holding.quantity * price) / totalValue
  }
  return result
}

export function getAllocationBySector(
  holdings: Record<string, Holding>
): Record<string, number> {
  const totalValue = getPortfolioValue(holdings)
  if (totalValue === 0) return {}

  const sectorTotals: Record<string, number> = {}
  for (const [symbol, holding] of Object.entries(holdings)) {
    const stock = getStock(symbol)
    if (!stock) continue
    const price = getStockPrice(symbol)
    const value = holding.quantity * price
    sectorTotals[stock.sector] = (sectorTotals[stock.sector] ?? 0) + value
  }

  const result: Record<string, number> = {}
  for (const [sector, value] of Object.entries(sectorTotals)) {
    result[sector] = value / totalValue
  }
  return result
}

// Portfolio value over time using trade history
export interface PortfolioDataPoint {
  date: string
  value: number
}

export function getPortfolioValueHistory(
  snapshot: PortfolioSnapshot,
  days = 30
): PortfolioDataPoint[] {
  // If no trades, return flat line at starting balance
  if (snapshot.trades.length === 0) {
    const points: PortfolioDataPoint[] = []
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      points.push({
        date: date.toISOString().split('T')[0],
        value: snapshot.startingBalance,
      })
    }
    return points
  }

  // Approximate: current value + small variation based on holdings volatility
  const currentValue = getPortfolioValue(snapshot.holdings) + snapshot.cashBalance
  const points: PortfolioDataPoint[] = []

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    const dateStr = date.toISOString().split('T')[0]

    // Use actual price history for each holding
    let historicalValue = snapshot.cashBalance
    for (const [symbol, holding] of Object.entries(snapshot.holdings)) {
      const stock = getStock(symbol)
      if (!stock) continue
      const historyPoint = stock.priceHistory.find((p) => p.date <= dateStr)
      const price = historyPoint ? historyPoint.price : stock.currentPrice
      historicalValue += holding.quantity * price
    }

    points.push({ date: dateStr, value: Math.round(historicalValue) })
  }

  return points
}

// Compute daily returns (for volatility calculation)
export function getDailyReturns(priceHistory: { price: number }[], days = 30): number[] {
  const slice = priceHistory.slice(-days - 1)
  const returns: number[] = []
  for (let i = 1; i < slice.length; i++) {
    returns.push((slice[i].price - slice[i - 1].price) / slice[i - 1].price)
  }
  return returns
}

export function stdDev(values: number[]): number {
  if (values.length === 0) return 0
  const mean = values.reduce((a, b) => a + b, 0) / values.length
  const variance = values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / values.length
  return Math.sqrt(variance)
}
