import { NextResponse } from 'next/server'
import { priceCache, CACHE_TTL } from '@/lib/cache/prices'
import { fetchQuotes } from '@/lib/providers/yahoo-finance'
import { US_STOCKS_CONFIG } from '@/store/useStocksStore'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const SYMBOLS = US_STOCKS_CONFIG.map((s) => s.symbol)
const CACHE_KEY = 'quotes:all'

export async function GET() {
  // Serve from cache if fresh
  const cached = priceCache.get<ReturnType<typeof buildResponse>>(CACHE_KEY)
  if (cached && !cached.isStale) {
    return NextResponse.json({ ...cached.data, fromCache: true })
  }

  try {
    const quotes = await fetchQuotes(SYMBOLS)

    // Build a map for O(1) lookup
    const quoteMap = new Map(quotes.map((q) => [q.symbol, q]))

    // Merge quotes with static config (fallback for any symbol that failed)
    const data = US_STOCKS_CONFIG.map((cfg) => {
      const q = quoteMap.get(cfg.symbol)
      return {
        symbol: cfg.symbol,
        currentPrice: q?.currentPrice ?? cfg.fallbackPrice,
        change: q?.change ?? 0,
        changePercent: q?.changePercent ?? 0,
        previousClose: q?.previousClose ?? cfg.fallbackPrice,
      }
    })

    const response = buildResponse(data)
    priceCache.set(CACHE_KEY, response, CACHE_TTL.quotes)

    return NextResponse.json({ ...response, fromCache: false })
  } catch (err) {
    console.error('[/api/stocks] fetch error:', err)

    // Stale cache beats no data
    if (cached) {
      return NextResponse.json({ ...cached.data, fromCache: true, isStale: true })
    }

    // Last resort: return fallback prices so the app never breaks
    const fallback = US_STOCKS_CONFIG.map((cfg) => ({
      symbol: cfg.symbol,
      currentPrice: cfg.fallbackPrice,
      change: 0,
      changePercent: 0,
      previousClose: cfg.fallbackPrice,
    }))
    return NextResponse.json({ data: fallback, fromCache: false, isFallback: true })
  }
}

function buildResponse(
  data: Array<{
    symbol: string
    currentPrice: number
    change: number
    changePercent: number
    previousClose: number
  }>
) {
  return { data, fetchedAt: new Date().toISOString() }
}
