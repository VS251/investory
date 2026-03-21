'use client'

// Lazily loads EOD price history for a single symbol on demand.
// Converts HistoricalPrice (OHLC) → PricePoint (adjClose) before storing.
// Safe to call multiple times for the same symbol — deduplicates via loadedHistories set.

import { useEffect } from 'react'
import { useStocksStore } from '@/store/useStocksStore'
import type { HistoricalPrice, PricePoint } from '@/types'

function toPricePoints(history: HistoricalPrice[]): PricePoint[] {
  return history.map((h) => ({ date: h.date, price: h.adjClose }))
}

export function useStockHistory(symbol: string) {
  const loadedHistories = useStocksStore((s) => s.loadedHistories)
  const setHistory = useStocksStore((s) => s.setHistory)

  const isLoaded = loadedHistories.has(symbol)

  useEffect(() => {
    if (isLoaded) return

    fetch(`/api/stocks/${encodeURIComponent(symbol)}/history`)
      .then((r) => r.json())
      .then(({ data }: { data: HistoricalPrice[] }) => {
        if (Array.isArray(data) && data.length > 0) {
          setHistory(symbol, toPricePoints(data))
        }
      })
      .catch((err) => {
        console.error(`[useStockHistory] failed for ${symbol}:`, err)
      })
  }, [symbol, isLoaded, setHistory])

  return { loaded: isLoaded }
}
