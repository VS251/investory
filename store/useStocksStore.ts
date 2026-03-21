import { create } from 'zustand'
import type { Stock, StockConfig, PricePoint, Sector } from '@/types'

// US stock static configs — source of truth for symbol universe
export const US_STOCKS_CONFIG: StockConfig[] = [
  // Technology
  { symbol: 'AAPL',  name: 'Apple Inc.',               sector: 'Technology',             marketCap: 'large', fallbackPrice: 195.00 },
  { symbol: 'MSFT',  name: 'Microsoft Corp.',           sector: 'Technology',             marketCap: 'large', fallbackPrice: 415.00 },
  { symbol: 'NVDA',  name: 'NVIDIA Corp.',              sector: 'Technology',             marketCap: 'large', fallbackPrice: 875.00 },
  { symbol: 'AVGO',  name: 'Broadcom Inc.',             sector: 'Technology',             marketCap: 'large', fallbackPrice: 175.00 },
  { symbol: 'ORCL',  name: 'Oracle Corp.',              sector: 'Technology',             marketCap: 'large', fallbackPrice: 130.00 },
  { symbol: 'CRM',   name: 'Salesforce Inc.',           sector: 'Technology',             marketCap: 'large', fallbackPrice: 280.00 },
  { symbol: 'AMD',   name: 'Advanced Micro Devices',    sector: 'Technology',             marketCap: 'large', fallbackPrice: 160.00 },
  { symbol: 'CSCO',  name: 'Cisco Systems',             sector: 'Technology',             marketCap: 'large', fallbackPrice: 52.00  },
  { symbol: 'TXN',   name: 'Texas Instruments',         sector: 'Technology',             marketCap: 'large', fallbackPrice: 175.00 },
  { symbol: 'INTU',  name: 'Intuit Inc.',               sector: 'Technology',             marketCap: 'large', fallbackPrice: 640.00 },
  { symbol: 'NOW',   name: 'ServiceNow Inc.',           sector: 'Technology',             marketCap: 'large', fallbackPrice: 810.00 },
  { symbol: 'ADBE',  name: 'Adobe Inc.',                sector: 'Technology',             marketCap: 'large', fallbackPrice: 490.00 },
  // Communication Services
  { symbol: 'GOOGL', name: 'Alphabet Inc.',             sector: 'Communication Services', marketCap: 'large', fallbackPrice: 175.00 },
  { symbol: 'META',  name: 'Meta Platforms',            sector: 'Communication Services', marketCap: 'large', fallbackPrice: 510.00 },
  { symbol: 'NFLX',  name: 'Netflix Inc.',              sector: 'Communication Services', marketCap: 'large', fallbackPrice: 625.00 },
  // Consumer Discretionary
  { symbol: 'AMZN',  name: 'Amazon.com Inc.',           sector: 'Consumer Discretionary', marketCap: 'large', fallbackPrice: 190.00 },
  { symbol: 'TSLA',  name: 'Tesla Inc.',                sector: 'Consumer Discretionary', marketCap: 'large', fallbackPrice: 225.00 },
  { symbol: 'MCD',   name: "McDonald's Corp.",          sector: 'Consumer Discretionary', marketCap: 'large', fallbackPrice: 295.00 },
  { symbol: 'NKE',   name: 'Nike Inc.',                 sector: 'Consumer Discretionary', marketCap: 'large', fallbackPrice: 92.00  },
  { symbol: 'LOW',   name: "Lowe's Companies",          sector: 'Consumer Discretionary', marketCap: 'large', fallbackPrice: 225.00 },
  { symbol: 'HD',    name: 'Home Depot Inc.',           sector: 'Consumer Discretionary', marketCap: 'large', fallbackPrice: 360.00 },
  // Consumer Staples
  { symbol: 'WMT',   name: 'Walmart Inc.',              sector: 'Consumer Staples',       marketCap: 'large', fallbackPrice: 68.00  },
  { symbol: 'KO',    name: 'Coca-Cola Co.',             sector: 'Consumer Staples',       marketCap: 'large', fallbackPrice: 62.00  },
  { symbol: 'PG',    name: 'Procter & Gamble',          sector: 'Consumer Staples',       marketCap: 'large', fallbackPrice: 165.00 },
  { symbol: 'PEP',   name: 'PepsiCo Inc.',              sector: 'Consumer Staples',       marketCap: 'large', fallbackPrice: 175.00 },
  { symbol: 'COST',  name: 'Costco Wholesale',          sector: 'Consumer Staples',       marketCap: 'large', fallbackPrice: 725.00 },
  { symbol: 'PM',    name: 'Philip Morris Intl.',       sector: 'Consumer Staples',       marketCap: 'large', fallbackPrice: 100.00 },
  // Healthcare
  { symbol: 'LLY',   name: 'Eli Lilly & Co.',           sector: 'Healthcare',             marketCap: 'large', fallbackPrice: 775.00 },
  { symbol: 'UNH',   name: 'UnitedHealth Group',        sector: 'Healthcare',             marketCap: 'large', fallbackPrice: 510.00 },
  { symbol: 'JNJ',   name: 'Johnson & Johnson',         sector: 'Healthcare',             marketCap: 'large', fallbackPrice: 147.00 },
  { symbol: 'ABBV',  name: 'AbbVie Inc.',               sector: 'Healthcare',             marketCap: 'large', fallbackPrice: 185.00 },
  { symbol: 'MRK',   name: 'Merck & Co.',               sector: 'Healthcare',             marketCap: 'large', fallbackPrice: 125.00 },
  { symbol: 'TMO',   name: 'Thermo Fisher Scientific',  sector: 'Healthcare',             marketCap: 'large', fallbackPrice: 570.00 },
  { symbol: 'AMGN',  name: 'Amgen Inc.',                sector: 'Healthcare',             marketCap: 'large', fallbackPrice: 305.00 },
  // Financial Services
  { symbol: 'BRK-B', name: 'Berkshire Hathaway B',      sector: 'Financial Services',     marketCap: 'large', fallbackPrice: 415.00 },
  { symbol: 'JPM',   name: 'JPMorgan Chase',            sector: 'Financial Services',     marketCap: 'large', fallbackPrice: 215.00 },
  { symbol: 'V',     name: 'Visa Inc.',                 sector: 'Financial Services',     marketCap: 'large', fallbackPrice: 285.00 },
  { symbol: 'MA',    name: 'Mastercard Inc.',           sector: 'Financial Services',     marketCap: 'large', fallbackPrice: 475.00 },
  { symbol: 'BAC',   name: 'Bank of America',           sector: 'Financial Services',     marketCap: 'large', fallbackPrice: 40.00  },
  { symbol: 'WFC',   name: 'Wells Fargo & Co.',         sector: 'Financial Services',     marketCap: 'large', fallbackPrice: 58.00  },
  { symbol: 'MS',    name: 'Morgan Stanley',            sector: 'Financial Services',     marketCap: 'large', fallbackPrice: 100.00 },
  // Industrials
  { symbol: 'GE',    name: 'GE Aerospace',              sector: 'Industrials',            marketCap: 'large', fallbackPrice: 165.00 },
  { symbol: 'RTX',   name: 'RTX Corp.',                 sector: 'Industrials',            marketCap: 'large', fallbackPrice: 115.00 },
  { symbol: 'CAT',   name: 'Caterpillar Inc.',          sector: 'Industrials',            marketCap: 'large', fallbackPrice: 360.00 },
  { symbol: 'ACN',   name: 'Accenture PLC',             sector: 'Industrials',            marketCap: 'large', fallbackPrice: 320.00 },
  // Energy
  { symbol: 'XOM',   name: 'Exxon Mobil Corp.',         sector: 'Energy',                 marketCap: 'large', fallbackPrice: 115.00 },
  { symbol: 'CVX',   name: 'Chevron Corp.',             sector: 'Energy',                 marketCap: 'large', fallbackPrice: 155.00 },
  // Materials
  { symbol: 'LIN',   name: 'Linde PLC',                 sector: 'Materials',              marketCap: 'large', fallbackPrice: 455.00 },
  // Real Estate
  { symbol: 'PLD',   name: 'Prologis Inc.',             sector: 'Real Estate',            marketCap: 'large', fallbackPrice: 122.00 },
  { symbol: 'AMT',   name: 'American Tower Corp.',      sector: 'Real Estate',            marketCap: 'large', fallbackPrice: 185.00 },
]

// Seed initial stocks from static config so the app never renders empty
function buildFallbackStocks(): Record<string, Stock> {
  return Object.fromEntries(
    US_STOCKS_CONFIG.map((cfg) => [
      cfg.symbol,
      {
        symbol: cfg.symbol,
        name: cfg.name,
        sector: cfg.sector,
        marketCap: cfg.marketCap,
        currentPrice: cfg.fallbackPrice,
        change: 0,
        changePercent: 0,
        previousClose: cfg.fallbackPrice,
        priceHistory: [],
      } satisfies Stock,
    ])
  )
}

interface StocksState {
  stocks: Record<string, Stock>
  pricesLoaded: boolean
  loadedHistories: Set<string>
  setStocks: (updates: Array<{ symbol: string; currentPrice: number; change: number; changePercent: number; previousClose: number }>) => void
  setHistory: (symbol: string, history: PricePoint[]) => void
}

export const useStocksStore = create<StocksState>((set, get) => ({
  stocks: buildFallbackStocks(),
  pricesLoaded: false,
  loadedHistories: new Set(),

  setStocks: (updates) => {
    const current = get().stocks
    const patched: Record<string, Stock> = { ...current }
    for (const u of updates) {
      if (patched[u.symbol]) {
        patched[u.symbol] = { ...patched[u.symbol], ...u }
      }
    }
    set({ stocks: patched, pricesLoaded: true })
  },

  setHistory: (symbol, history) => {
    const current = get().stocks[symbol]
    if (!current) return
    set((state) => ({
      stocks: { ...state.stocks, [symbol]: { ...current, priceHistory: history } },
      loadedHistories: new Set(Array.from(state.loadedHistories).concat(symbol)),
    }))
  },
}))
