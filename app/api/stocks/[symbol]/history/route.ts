import { NextRequest, NextResponse } from 'next/server'
import { priceCache, CACHE_TTL } from '@/lib/cache/prices'
import { fetchHistory } from '@/lib/providers/yahoo-finance'
import { US_STOCKS_CONFIG } from '@/store/useStocksStore'
import type { HistoricalPrice } from '@/types'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const KNOWN_SYMBOLS = new Set(US_STOCKS_CONFIG.map((s) => s.symbol))

export async function GET(
  _req: NextRequest,
  { params }: { params: { symbol: string } }
) {
  const symbol = params.symbol.toUpperCase()

  if (!KNOWN_SYMBOLS.has(symbol)) {
    return NextResponse.json({ error: `Unknown symbol: ${symbol}` }, { status: 404 })
  }

  const cacheKey = `history:${symbol}:1y`
  const cached = priceCache.get<HistoricalPrice[]>(cacheKey)
  if (cached && !cached.isStale) {
    return NextResponse.json({ data: cached.data, symbol, fromCache: true })
  }

  try {
    const to = new Date()
    const from = new Date()
    from.setFullYear(from.getFullYear() - 1)

    const history = await fetchHistory(symbol, from, to)

    priceCache.set(cacheKey, history, CACHE_TTL.history)
    return NextResponse.json({ data: history, symbol, fromCache: false })
  } catch (err) {
    console.error(`[/api/stocks/${symbol}/history] fetch error:`, err)

    if (cached) {
      return NextResponse.json({ data: cached.data, symbol, fromCache: true, isStale: true })
    }

    return NextResponse.json(
      { error: `Failed to fetch history for ${symbol}` },
      { status: 503 }
    )
  }
}
