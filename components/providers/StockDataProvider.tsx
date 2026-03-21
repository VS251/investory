'use client'

// Fetches real prices from /api/stocks once on mount and hydrates the Zustand store.
// Place this high in the component tree (app layout) — runs once per session.

import { useEffect } from 'react'
import { useStocksStore } from '@/store/useStocksStore'

export function StockDataProvider({ children }: { children: React.ReactNode }) {
  const setStocks = useStocksStore((s) => s.setStocks)

  useEffect(() => {
    fetch('/api/stocks')
      .then((r) => r.json())
      .then(({ data }) => {
        if (Array.isArray(data)) setStocks(data)
      })
      .catch((err) => {
        console.error('[StockDataProvider] failed to load prices:', err)
        // Store keeps fallback prices — app remains functional
      })
  }, [setStocks])

  return <>{children}</>
}
