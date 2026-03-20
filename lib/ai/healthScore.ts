import type { Holding, HealthScore, HealthGrade, RiskTolerance } from '@/types'
import { getStock } from '@/lib/data/stocks'
import { getDailyReturns, stdDev } from '@/lib/utils/calculations'

function calcDiversificationScore(holdings: Record<string, Holding>): number {
  const holdingList = Object.values(holdings)
  if (holdingList.length === 0) return 0

  // Component A: sector spread (0-20)
  const sectors = new Set<string>()
  for (const h of holdingList) {
    const stock = getStock(h.symbol)
    if (stock) sectors.add(stock.sector)
  }
  const numSectors = sectors.size
  let sectorScore = 0
  if (numSectors >= 5) sectorScore = 20
  else if (numSectors === 4) sectorScore = 18
  else if (numSectors === 3) sectorScore = 15
  else if (numSectors === 2) sectorScore = 10
  else if (numSectors === 1) sectorScore = 4
  else sectorScore = 0

  // Component B: max single-stock concentration (0-20)
  const totalValue = holdingList.reduce((sum, h) => {
    const stock = getStock(h.symbol)
    return sum + h.quantity * (stock?.currentPrice ?? 0)
  }, 0)

  let maxAlloc = 0
  if (totalValue > 0) {
    for (const h of holdingList) {
      const stock = getStock(h.symbol)
      const alloc = (h.quantity * (stock?.currentPrice ?? 0)) / totalValue
      if (alloc > maxAlloc) maxAlloc = alloc
    }
  }

  let concentrationScore = 0
  if (maxAlloc <= 0.25) concentrationScore = 20
  else if (maxAlloc <= 0.4) concentrationScore = 15
  else if (maxAlloc <= 0.6) concentrationScore = 10
  else if (maxAlloc <= 0.8) concentrationScore = 5
  else concentrationScore = 0

  return sectorScore + concentrationScore
}

function calcRiskMatchScore(
  holdings: Record<string, Holding>,
  riskTolerance: RiskTolerance | null
): number {
  if (!riskTolerance) return 17 // neutral midpoint

  const holdingList = Object.values(holdings)
  if (holdingList.length === 0) return 17

  // Calculate weighted portfolio volatility using 30-day returns
  let weightedVol = 0
  let totalValue = 0

  for (const h of holdingList) {
    const stock = getStock(h.symbol)
    if (!stock) continue
    const value = h.quantity * stock.currentPrice
    totalValue += value
    const returns = getDailyReturns(stock.priceHistory, 30)
    const vol = stdDev(returns)
    weightedVol += vol * value
  }

  const portfolioVol = totalValue > 0 ? (weightedVol / totalValue) * 100 : 0 // as %

  const scores: Record<RiskTolerance, (vol: number) => number> = {
    conservative: (vol) => {
      if (vol < 1) return 35
      if (vol < 2) return 25
      if (vol < 3) return 15
      return 5
    },
    moderate: (vol) => {
      if (vol < 1) return 20
      if (vol < 2) return 35
      if (vol < 3) return 25
      return 10
    },
    aggressive: (vol) => {
      if (vol < 1) return 10
      if (vol < 2) return 25
      return 35 // >= 2% is fine for aggressive
    },
  }

  return scores[riskTolerance](portfolioVol)
}

function calcCashRatioScore(cashBalance: number, startingBalance: number): number {
  const ratio = cashBalance / startingBalance
  if (ratio < 0.03) return 5
  if (ratio < 0.1) return 15
  if (ratio < 0.3) return 25
  if (ratio < 0.6) return 20
  return 10 // mostly uninvested
}

function getGrade(score: number): HealthGrade {
  if (score >= 80) return 'A'
  if (score >= 65) return 'B'
  if (score >= 50) return 'C'
  if (score >= 35) return 'D'
  return 'F'
}

function getSummary(score: number, grade: HealthGrade): string {
  const summaries: Record<HealthGrade, string> = {
    A: 'Excellent portfolio health — well diversified and risk-aligned.',
    B: 'Good portfolio structure with minor areas to improve.',
    C: 'Decent start — some concentration or alignment issues to address.',
    D: 'Portfolio needs attention — consider diversifying.',
    F: 'High risk detected — significant concentration or misalignment.',
  }
  return summaries[grade]
}

export function computeHealthScore(
  holdings: Record<string, Holding>,
  cashBalance: number,
  startingBalance: number,
  riskTolerance: RiskTolerance | null
): HealthScore {
  const hasHoldings = Object.keys(holdings).length > 0

  if (!hasHoldings && cashBalance === startingBalance) {
    return {
      total: 0,
      grade: 'F',
      summary: 'Make your first trade to get a portfolio health score.',
      breakdown: { diversification: 0, riskMatch: 0, cashRatio: 0 },
    }
  }

  const diversification = calcDiversificationScore(holdings)
  const riskMatch = calcRiskMatchScore(holdings, riskTolerance)
  const cashRatio = calcCashRatioScore(cashBalance, startingBalance)
  const total = diversification + riskMatch + cashRatio

  const grade = getGrade(total)
  return {
    total,
    grade,
    summary: getSummary(total, grade),
    breakdown: { diversification, riskMatch, cashRatio },
  }
}
