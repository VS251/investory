// Server-side in-memory cache for Yahoo Finance responses.
// Lives in Node.js module scope — survives across requests in the same process.
// In serverless (Vercel), each cold start gets a fresh cache — that's acceptable.

interface CacheEntry<T> {
  data: T
  fetchedAt: number
  ttlMs: number
}

class PriceCache {
  private store = new Map<string, CacheEntry<unknown>>()

  get<T>(key: string): { data: T; isStale: boolean } | null {
    const entry = this.store.get(key)
    if (!entry) return null
    const isStale = Date.now() - entry.fetchedAt > entry.ttlMs
    return { data: entry.data as T, isStale }
  }

  set<T>(key: string, data: T, ttlMs: number): void {
    this.store.set(key, { data, fetchedAt: Date.now(), ttlMs })
  }

  delete(key: string): void {
    this.store.delete(key)
  }
}

export const priceCache = new PriceCache()

export const CACHE_TTL = {
  quotes: 5 * 60 * 1000,       // 5 min — current prices
  history: 24 * 60 * 60 * 1000, // 24 hr — EOD history doesn't change intraday
  benchmarks: 5 * 60 * 1000,   // 5 min
} as const
