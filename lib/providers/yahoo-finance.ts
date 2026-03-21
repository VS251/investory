// Provider abstraction over yahoo-finance2.
// All Yahoo Finance calls go through here — swap the implementation without touching API routes.

import YahooFinance from 'yahoo-finance2'
import type { HistoricalPrice } from '@/types'

const yahooFinance = new YahooFinance()

export interface QuoteResult {
  symbol: string
  currentPrice: number
  change: number
  changePercent: number
  previousClose: number
}

// Suppress validation warnings from schema mismatches (Yahoo Finance changes their API)
const QUERY_OPTIONS = { validateResult: false } as const

export async function fetchQuotes(symbols: string[]): Promise<QuoteResult[]> {
  if (symbols.length === 0) return []

  // Fetch each symbol individually to avoid complex overload resolution
  const settled = await Promise.allSettled(
    symbols.map((sym) => yahooFinance.quote(sym, {}, QUERY_OPTIONS))
  )

  return settled
    .map((result, i) => {
      if (result.status === 'rejected') return null
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const q = result.value as any
      if (!q) return null
      return {
        symbol: symbols[i],
        currentPrice: q.regularMarketPrice ?? 0,
        change: q.regularMarketChange ?? 0,
        // yahoo-finance2 returns changePercent as a decimal (e.g. 0.0142 for 1.42%)
        changePercent: (q.regularMarketChangePercent ?? 0) * 100,
        previousClose: q.regularMarketPreviousClose ?? q.regularMarketPrice ?? 0,
      } as QuoteResult
    })
    .filter((q): q is QuoteResult => q !== null)
}

export async function fetchHistory(
  symbol: string,
  from: Date,
  to: Date
): Promise<HistoricalPrice[]> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const raw: any[] = await yahooFinance.historical(
    symbol,
    { period1: from, period2: to, interval: '1d' },
    QUERY_OPTIONS
  )

  return raw
    .filter((r) => r.adjClose != null && r.close != null)
    .map((r) => ({
      date: (r.date as Date).toISOString().split('T')[0],
      open: r.open ?? 0,
      high: r.high ?? 0,
      low: r.low ?? 0,
      close: r.close ?? 0,
      adjClose: r.adjClose ?? r.close ?? 0,
      volume: r.volume ?? 0,
    }))
}
