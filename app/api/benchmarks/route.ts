import { NextResponse } from 'next/server'
import { priceCache, CACHE_TTL } from '@/lib/cache/prices'
import { fetchQuotes, fetchHistory } from '@/lib/providers/yahoo-finance'
import type { BenchmarkData } from '@/types'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const BENCHMARKS: Array<{ symbol: string; name: string }> = [
  { symbol: 'SPY',  name: 'S&P 500 (SPY)'           },
  { symbol: 'QQQ',  name: 'NASDAQ-100 (QQQ)'         },
  { symbol: 'IWM',  name: 'Russell 2000 (IWM)'        },
  { symbol: 'VTI',  name: 'Total Market (VTI)'        },
]

const BENCHMARK_SYMBOLS = BENCHMARKS.map((b) => b.symbol)
const CACHE_KEY = 'benchmarks:all'

export async function GET() {
  const cached = priceCache.get<BenchmarkData[]>(CACHE_KEY)
  if (cached && !cached.isStale) {
    return NextResponse.json({ data: cached.data, fromCache: true })
  }

  try {
    const to = new Date()
    const from = new Date()
    from.setFullYear(from.getFullYear() - 1)

    const [quotes, histories] = await Promise.all([
      fetchQuotes(BENCHMARK_SYMBOLS),
      Promise.all(
        BENCHMARK_SYMBOLS.map((sym) =>
          fetchHistory(sym, from, to).then((h) => ({ symbol: sym, history: h }))
        )
      ),
    ])

    const quoteMap = new Map(quotes.map((q) => [q.symbol, q]))
    const historyMap = new Map(histories.map((h) => [h.symbol, h.history]))

    const data: BenchmarkData[] = BENCHMARKS.map(({ symbol, name }) => ({
      symbol,
      name,
      currentPrice: quoteMap.get(symbol)?.currentPrice ?? 0,
      change: quoteMap.get(symbol)?.change ?? 0,
      changePercent: quoteMap.get(symbol)?.changePercent ?? 0,
      history: historyMap.get(symbol) ?? [],
    }))

    priceCache.set(CACHE_KEY, data, CACHE_TTL.benchmarks)
    return NextResponse.json({ data, fromCache: false })
  } catch (err) {
    console.error('[/api/benchmarks] fetch error:', err)

    if (cached) {
      return NextResponse.json({ data: cached.data, fromCache: true, isStale: true })
    }

    return NextResponse.json({ error: 'Failed to fetch benchmark data' }, { status: 503 })
  }
}
