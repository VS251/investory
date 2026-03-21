import type { Trade, Holding, RiskLevel, TradeExplanation, PreTradeInsight } from '@/types'
import { getStock } from '@/lib/data/stocks'
import { getAllocationBySector, getAllocationByStock } from '@/lib/utils/calculations'

interface PortfolioContext {
  holdings: Record<string, Holding>
  cashBalance: number
  startingBalance: number
}

// Pre-trade: shown live as user types quantity
export function getPreTradeInsight(
  symbol: string,
  quantity: number,
  price: number,
  context: PortfolioContext
): PreTradeInsight {
  if (quantity <= 0 || price <= 0) return { warning: null, riskLevel: 'low' }

  const stock = getStock(symbol)
  if (!stock) return { warning: null, riskLevel: 'low' }

  // Simulate post-trade portfolio
  const simulatedHoldings = { ...context.holdings }
  const existing = simulatedHoldings[symbol]
  if (existing) {
    simulatedHoldings[symbol] = {
      ...existing,
      quantity: existing.quantity + quantity,
      totalInvested: existing.totalInvested + quantity * price,
      averageBuyPrice:
        (existing.quantity * existing.averageBuyPrice + quantity * price) /
        (existing.quantity + quantity),
    }
  } else {
    simulatedHoldings[symbol] = {
      symbol,
      name: stock.name,
      quantity,
      averageBuyPrice: price,
      totalInvested: quantity * price,
    }
  }

  const sectorAlloc = getAllocationBySector(simulatedHoldings)
  const stockAlloc = getAllocationByStock(simulatedHoldings)
  const thisSectorPct = Math.round((sectorAlloc[stock.sector] ?? 0) * 100)
  const thisStockPct = Math.round((stockAlloc[symbol] ?? 0) * 100)

  let riskLevel: RiskLevel = 'low'
  let warning: string | null = null

  if (thisStockPct > 40) {
    riskLevel = 'high'
    warning = `This will make ${symbol} ${thisStockPct}% of your portfolio — High Risk`
  } else if (thisSectorPct > 50) {
    riskLevel = 'high'
    warning = `This will put ${thisSectorPct}% of your portfolio in ${stock.sector} — High Sector Concentration`
  } else if (thisStockPct > 25) {
    riskLevel = 'medium'
    warning = `${symbol} will be ${thisStockPct}% of your portfolio — Medium Risk`
  } else if (thisSectorPct > 40) {
    riskLevel = 'medium'
    warning = `${stock.sector} will be ${thisSectorPct}% of your portfolio — Watch Concentration`
  }

  return { warning, riskLevel }
}

// Post-trade: fires after successful execution
export function explainTrade(
  trade: Trade,
  contextAfter: PortfolioContext
): TradeExplanation {
  const stock = getStock(trade.symbol)
  const sector = stock?.sector ?? 'Unknown'

  const sectorAlloc = getAllocationBySector(contextAfter.holdings)
  const stockAlloc = getAllocationByStock(contextAfter.holdings)

  const thisStockPct = Math.round((stockAlloc[trade.symbol] ?? 0) * 100)
  const thisSectorPct = Math.round((sectorAlloc[sector] ?? 0) * 100)
  const cashPct = Math.round((contextAfter.cashBalance / contextAfter.startingBalance) * 100)

  const riskLevels: RiskLevel[] = ['low']
  let riskReason = 'Well balanced position within a diversified portfolio.'
  const warnings: string[] = []

  const escalate = (level: RiskLevel) => {
    riskLevels.push(level)
  }

  // Rule 1: Single stock concentration
  if (thisStockPct > 40) {
    escalate('high')
    riskReason = `${trade.symbol} now makes up ${thisStockPct}% of your portfolio — heavily concentrated.`
    warnings.push(`A 20% drop in ${trade.symbol} would reduce your total portfolio by ~${Math.round(thisStockPct * 0.2)}%`)
  } else if (thisStockPct > 25) {
    escalate('medium')
    riskReason = `${trade.symbol} is now ${thisStockPct}% of your portfolio — over a quarter in one stock.`
  }

  // Rule 2: Sector concentration
  if (thisSectorPct > 60) {
    escalate('high')
    warnings.push(`${thisSectorPct}% of your portfolio is in ${sector}. Sector-wide events affect all these stocks simultaneously.`)
  } else if (thisSectorPct > 40) {
    escalate('medium')
    warnings.push(`${sector} now accounts for ${thisSectorPct}% of your portfolio`)
    if (sector === 'Technology') {
      warnings.push('Tech stocks move together on macro events (rate changes, earnings seasons, AI sentiment)')
    }
  }

  // Rule 3: Cash ratio (buys only)
  if (trade.type === 'buy') {
    if (cashPct < 5) {
      warnings.push(`Only ${cashPct}% cash remaining — almost fully invested with little flexibility`)
    } else if (cashPct < 10) {
      warnings.push(`${cashPct}% cash remaining — consider keeping a buffer for opportunities`)
    }
  }

  // Rule 4: Selling at a loss
  if (trade.type === 'sell') {
    const holding = contextAfter.holdings[trade.symbol]
    // Check against the sell price vs stored average (before this sell)
    // We approximate: if trade.price < originalAvg, it's a loss
    // The holding is already updated, so we check via trade data
    const originalAvg = holding ? holding.averageBuyPrice : trade.price
    if (trade.price < originalAvg) {
      const lossPct = Math.round(((originalAvg - trade.price) / originalAvg) * 100)
      if (lossPct > 10) {
        warnings.push(`You sold ${trade.symbol} at a ~${lossPct}% loss vs your average buy price. Selling in a downturn locks in permanent losses.`)
      }
    }
  }

  // Resolve final risk level (max across all rules)
  const riskOrder: Record<RiskLevel, number> = { low: 0, medium: 1, high: 2 }
  const riskLevel: RiskLevel = riskLevels.reduce((max, r) =>
    riskOrder[r] > riskOrder[max] ? r : max
  )

  // Generate explanation text
  const action = trade.type === 'buy' ? 'bought' : 'sold'
  const headline = `You ${action} ${trade.quantity} shares of ${stock?.name ?? trade.symbol} at $${trade.price.toFixed(2)}`

  let explanation: string
  if (trade.type === 'buy') {
    explanation = `You invested $${trade.total.toFixed(0)} in ${stock?.name ?? trade.symbol} (${sector} sector).
${sector} now represents ${thisSectorPct}% of your portfolio. ${riskReason}`
  } else {
    explanation = `You received $${trade.total.toFixed(0)} from selling ${trade.quantity} shares of ${stock?.name ?? trade.symbol}.
Your cash balance is now ${cashPct}% of your starting balance.`
  }

  // Generate tip
  let tip: string
  if (riskLevel === 'high') {
    tip = 'Consider adding stocks from other sectors to reduce concentration risk.'
  } else if (riskLevel === 'medium') {
    tip = 'Keep diversifying — aim for at least 4-5 different sectors in your portfolio.'
  } else if (trade.type === 'sell' && cashPct > 60) {
    tip = "Good cash reserve! Consider deploying it gradually across different sectors."
  } else {
    tip = 'Good discipline. Keep building your portfolio steadily with regular investments.'
  }

  return { headline, riskLevel, riskReason, explanation, warnings, tip }
}
