// lib/data/stocks.ts
// All data now comes from useStocksStore (backed by real API data).
// These functions keep the same signatures so all downstream imports work unchanged.
// Non-reactive callers (utility functions, AI engines) use .getState() directly.
// Reactive components subscribe to the store themselves.

import { useStocksStore } from '@/store/useStocksStore'
import type { Stock } from '@/types'

export function getStocks(): Stock[] {
  return Object.values(useStocksStore.getState().stocks)
}

export function getStock(symbol: string): Stock | undefined {
  return useStocksStore.getState().stocks[symbol]
}

export function getStockPrice(symbol: string): number {
  return useStocksStore.getState().stocks[symbol]?.currentPrice ?? 0
}

// Alias kept for any remaining imports
export { getStock as getStockBySymbol }
