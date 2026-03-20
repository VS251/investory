import type { Holding, Trade, Insight, RiskTolerance } from '@/types'
import { getStock, getStockPrice } from '@/lib/data/stocks'
import {
  getAllocationBySector,
  getAllocationByStock,
  getDailyReturns,
  stdDev,
} from '@/lib/utils/calculations'

interface DiagnosticsInput {
  holdings: Record<string, Holding>
  trades: Trade[]
  cashBalance: number
  startingBalance: number
  riskTolerance: RiskTolerance | null
}

export function generateInsights(input: DiagnosticsInput): Insight[] {
  const insights: Insight[] = []
  const { holdings, trades, cashBalance, startingBalance, riskTolerance } = input
  const holdingList = Object.values(holdings)
  const sectorAlloc = getAllocationBySector(holdings)
  const stockAlloc = getAllocationByStock(holdings)
  const cashRatio = cashBalance / startingBalance

  // ─── RISK RULES ──────────────────────────────────────────────────────────────

  // R1: Single stock dominance
  for (const [symbol, alloc] of Object.entries(stockAlloc)) {
    if (alloc > 0.5) {
      const pct = Math.round(alloc * 100)
      insights.push({
        id: `R1-${symbol}`,
        category: 'risk',
        severity: 'critical',
        title: `Highly concentrated position in ${symbol}`,
        body: `${symbol} makes up ${pct}% of your portfolio. A 20% drop in this stock would reduce your total portfolio by ~${Math.round(pct * 0.2)}%.`,
        actionLabel: 'Diversify Now',
        actionHref: '/simulator',
      })
    }
  }

  // R2: Sector concentration
  for (const [sector, alloc] of Object.entries(sectorAlloc)) {
    if (alloc > 0.55) {
      const pct = Math.round(alloc * 100)
      insights.push({
        id: `R2-${sector}`,
        category: 'risk',
        severity: 'warning',
        title: `Heavy exposure to ${sector}`,
        body: `You have ${pct}% of your portfolio in ${sector} stocks. Sector-wide events (regulatory, market cycle, macro) affect all these stocks simultaneously.`,
        actionLabel: 'Add Other Sectors',
        actionHref: '/simulator',
      })
    }
  }

  // R3: Zero diversification
  const numSectors = Object.keys(sectorAlloc).length
  if (holdingList.length >= 2 && numSectors === 1) {
    insights.push({
      id: 'R3-no-diversification',
      category: 'risk',
      severity: 'critical',
      title: 'No sector diversification',
      body: `All ${holdingList.length} of your holdings are in a single sector. Consider spreading across 3+ sectors to reduce sector-specific risk.`,
      actionLabel: 'Diversify Portfolio',
      actionHref: '/simulator',
    })
  }

  // ─── MISTAKE RULES ────────────────────────────────────────────────────────────

  // M1: Sold at significant loss
  const sellTrades = trades.filter((t) => t.type === 'sell')
  for (const sell of sellTrades) {
    const buyTrades = trades.filter(
      (t) => t.type === 'buy' && t.symbol === sell.symbol && t.timestamp < sell.timestamp
    )
    if (buyTrades.length > 0) {
      const avgBuy =
        buyTrades.reduce((sum, t) => sum + t.price * t.quantity, 0) /
        buyTrades.reduce((sum, t) => sum + t.quantity, 0)
      const lossPct = ((avgBuy - sell.price) / avgBuy) * 100
      if (lossPct > 15) {
        insights.push({
          id: `M1-${sell.id}`,
          category: 'mistake',
          severity: 'warning',
          title: `You sold ${sell.symbol} at a significant loss`,
          body: `You sold ${sell.symbol} at ₹${sell.price.toFixed(0)}, which is ${Math.round(lossPct)}% below your average buy price of ₹${avgBuy.toFixed(0)}. Selling during dips locks in permanent losses.`,
        })
      }
    }
  }

  // M2: Over-trading same stock
  const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000
  const recentTrades = trades.filter((t) => t.timestamp > thirtyDaysAgo)
  const symbolCounts: Record<string, number> = {}
  for (const t of recentTrades) {
    symbolCounts[t.symbol] = (symbolCounts[t.symbol] ?? 0) + 1
  }
  for (const [symbol, count] of Object.entries(symbolCounts)) {
    if (count > 5) {
      insights.push({
        id: `M2-${symbol}`,
        category: 'mistake',
        severity: 'info',
        title: `Frequent trading in ${symbol}`,
        body: `You've traded ${symbol} ${count} times in the last 30 days. Frequent trading often leads to worse outcomes than holding — research consistently shows buy-and-hold beats over-trading.`,
      })
    }
  }

  // M3: Holding a large loser
  for (const h of holdingList) {
    const currentPrice = getStockPrice(h.symbol)
    const lossPct = ((h.averageBuyPrice - currentPrice) / h.averageBuyPrice) * 100
    if (lossPct > 20) {
      insights.push({
        id: `M3-${h.symbol}`,
        category: 'mistake',
        severity: 'warning',
        title: `${h.symbol} is down ${Math.round(lossPct)}% — revisit your thesis`,
        body: `Your position in ${h.symbol} is at a ${Math.round(lossPct)}% unrealised loss. It's worth revisiting why you bought it. If the original reasons no longer apply, it may be time to reconsider.`,
        actionLabel: 'View in Simulator',
        actionHref: '/simulator',
      })
    }
  }

  // M4: Cash sitting idle
  const firstTradeTime = trades.length > 0 ? Math.min(...trades.map((t) => t.timestamp)) : null
  const daysSinceFirstTrade = firstTradeTime
    ? (Date.now() - firstTradeTime) / (24 * 60 * 60 * 1000)
    : 0
  if (cashRatio > 0.7 && daysSinceFirstTrade > 7 && holdingList.length > 0) {
    insights.push({
      id: 'M4-idle-cash',
      category: 'mistake',
      severity: 'info',
      title: `₹${Math.round(cashBalance).toLocaleString('en-IN')} is sitting uninvested`,
      body: `Over 70% of your virtual funds haven't been put to work. Even a conservative allocation beats holding all cash — consider deploying gradually across stable sectors.`,
      actionLabel: 'Invest Now',
      actionHref: '/simulator',
    })
  }

  // ─── OPPORTUNITY RULES ───────────────────────────────────────────────────────

  // O1: Aggressive user with low-volatility portfolio
  if (riskTolerance === 'aggressive' && holdingList.length > 0) {
    const vols = holdingList.map((h) => {
      const stock = getStock(h.symbol)
      if (!stock) return 0
      return stdDev(getDailyReturns(stock.priceHistory, 30)) * 100
    })
    const avgVol = vols.reduce((a, b) => a + b, 0) / vols.length
    if (avgVol < 1) {
      insights.push({
        id: 'O1-conservative-portfolio',
        category: 'opportunity',
        severity: 'info',
        title: 'Your portfolio is more conservative than your risk appetite',
        body: 'You selected "Aggressive" as your risk profile, but your current holdings are quite stable. You may be leaving growth potential untapped. Consider exploring mid-cap or high-growth sectors.',
        actionLabel: 'Explore Stocks',
        actionHref: '/simulator',
      })
    }
  }

  // O2: Conservative user missing FMCG
  if (riskTolerance === 'conservative' && holdingList.length > 0) {
    const hasFMCG = Object.keys(holdings).some((sym) => getStock(sym)?.sector === 'FMCG')
    if (!hasFMCG) {
      insights.push({
        id: 'O2-missing-fmcg',
        category: 'opportunity',
        severity: 'info',
        title: 'Consider adding defensive FMCG stocks',
        body: 'FMCG stocks like HINDUNILVR, NESTLEIND, or ITC tend to be stable during downturns. They suit conservative investors seeking steady returns with lower volatility.',
        actionLabel: 'Browse FMCG Stocks',
        actionHref: '/simulator',
      })
    }
  }

  // O3: Low diversification improvement available
  if (numSectors <= 2 && holdingList.length >= 3) {
    insights.push({
      id: 'O3-sector-improvement',
      category: 'opportunity',
      severity: 'info',
      title: 'Spread across more sectors for lower risk',
      body: `You hold ${holdingList.length} stocks but only across ${numSectors} sector${numSectors === 1 ? '' : 's'}. Adding stocks from Healthcare, Infrastructure, or Consumer could meaningfully reduce your overall risk.`,
      actionLabel: 'Diversify',
      actionHref: '/simulator',
    })
  }

  // ─── GOOD DECISIONS ───────────────────────────────────────────────────────────

  // G1: Well diversified
  if (numSectors >= 4 && holdingList.length >= 4) {
    insights.push({
      id: 'G1-well-diversified',
      category: 'good',
      severity: 'positive',
      title: `Well diversified across ${numSectors} sectors`,
      body: `Your portfolio spans ${numSectors} different sectors. This reduces the impact of any single sector downturn. This is exactly what good portfolio construction looks like.`,
    })
  }

  // G2: Healthy cash balance
  if (cashRatio >= 0.15 && cashRatio <= 0.4 && holdingList.length > 0) {
    insights.push({
      id: 'G2-healthy-cash',
      category: 'good',
      severity: 'positive',
      title: 'Healthy cash reserve maintained',
      body: `You have ${Math.round(cashRatio * 100)}% in cash — giving you flexibility to take advantage of dips and unexpected opportunities without being forced to sell.`,
    })
  }

  // G3: Consistent investing
  if (recentTrades.length >= 3) {
    insights.push({
      id: 'G3-consistent',
      category: 'good',
      severity: 'positive',
      title: `Consistent investing — ${recentTrades.length} trades this month`,
      body: `You've made ${recentTrades.length} trades in the last 30 days, showing consistent engagement with your portfolio. Regular investing, even in small amounts, builds significant wealth over time.`,
    })
  }

  // G4: Always show at least one positive if none
  if (!insights.some((i) => i.category === 'good')) {
    if (trades.length > 0) {
      insights.push({
        id: 'G4-getting-started',
        category: 'good',
        severity: 'positive',
        title: 'Great start — you made your first investment!',
        body: 'The hardest part is starting. By making your first trade, you\'ve already done what most people only talk about. Keep learning and building steadily.',
      })
    }
  }

  // Sort: critical first, then warning, then info, then positive
  const order: Record<string, number> = { critical: 0, warning: 1, info: 2, positive: 3 }
  return insights.sort((a, b) => (order[a.severity] ?? 4) - (order[b.severity] ?? 4))
}
