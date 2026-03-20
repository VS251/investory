import type { Stock, PricePoint, Sector } from '@/types'

// Deterministic price history generator — seeded, not random
// Uses a simple LCG (Linear Congruential Generator) for reproducibility
function seededRandom(seed: number): () => number {
  let s = seed
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff
    return (s >>> 0) / 0xffffffff
  }
}

function generatePriceHistory(
  symbol: string,
  basePrice: number,
  trendBias: number, // daily drift, e.g. 0.0003 = slight uptrend
  volatility: number, // daily std dev, e.g. 0.015 = 1.5%
  days = 365
): PricePoint[] {
  const seed = symbol.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)
  const rand = seededRandom(seed)
  const history: PricePoint[] = []

  const startDate = new Date('2024-03-20')
  let price = basePrice

  for (let i = 0; i < days; i++) {
    const date = new Date(startDate)
    date.setDate(date.getDate() + i)
    const dateStr = date.toISOString().split('T')[0]

    // Box-Muller transform for gaussian noise
    const u1 = rand()
    const u2 = rand()
    const gaussian = Math.sqrt(-2 * Math.log(u1 + 0.0001)) * Math.cos(2 * Math.PI * u2)
    const dailyReturn = trendBias + volatility * gaussian

    price = price * (1 + dailyReturn)
    // Floor: price never drops below 40% of base
    price = Math.max(price, basePrice * 0.4)

    history.push({ date: dateStr, price: Math.round(price * 100) / 100 })
  }

  return history
}

interface StockConfig {
  symbol: string
  name: string
  sector: Sector
  marketCap: 'large' | 'mid' | 'small'
  basePrice: number
  trendBias: number
  volatility: number
}

const STOCK_CONFIGS: StockConfig[] = [
  // Banking
  { symbol: 'HDFCBANK', name: 'HDFC Bank Ltd.', sector: 'Banking', marketCap: 'large', basePrice: 1620, trendBias: 0.0002, volatility: 0.018 },
  { symbol: 'ICICIBANK', name: 'ICICI Bank Ltd.', sector: 'Banking', marketCap: 'large', basePrice: 1050, trendBias: 0.0003, volatility: 0.019 },
  { symbol: 'KOTAKBANK', name: 'Kotak Mahindra Bank', sector: 'Banking', marketCap: 'large', basePrice: 1780, trendBias: 0.0002, volatility: 0.017 },
  { symbol: 'AXISBANK', name: 'Axis Bank Ltd.', sector: 'Banking', marketCap: 'large', basePrice: 1060, trendBias: 0.0003, volatility: 0.020 },
  { symbol: 'SBIN', name: 'State Bank of India', sector: 'Banking', marketCap: 'large', basePrice: 762, trendBias: 0.0004, volatility: 0.022 },
  { symbol: 'INDUSINDBK', name: 'IndusInd Bank Ltd.', sector: 'Banking', marketCap: 'large', basePrice: 1450, trendBias: 0.0001, volatility: 0.025 },
  // IT
  { symbol: 'TCS', name: 'Tata Consultancy Services', sector: 'IT', marketCap: 'large', basePrice: 3840, trendBias: 0.0003, volatility: 0.015 },
  { symbol: 'INFOSYS', name: 'Infosys Ltd.', sector: 'IT', marketCap: 'large', basePrice: 1430, trendBias: 0.0003, volatility: 0.016 },
  { symbol: 'WIPRO', name: 'Wipro Ltd.', sector: 'IT', marketCap: 'large', basePrice: 480, trendBias: 0.0002, volatility: 0.016 },
  { symbol: 'LTIM', name: 'LTIMindtree Ltd.', sector: 'IT', marketCap: 'large', basePrice: 5200, trendBias: 0.0003, volatility: 0.018 },
  { symbol: 'TECHM', name: 'Tech Mahindra Ltd.', sector: 'IT', marketCap: 'large', basePrice: 1280, trendBias: 0.0004, volatility: 0.020 },
  { symbol: 'HCLTECH', name: 'HCL Technologies Ltd.', sector: 'IT', marketCap: 'large', basePrice: 1520, trendBias: 0.0004, volatility: 0.016 },
  // Energy
  { symbol: 'RELIANCE', name: 'Reliance Industries Ltd.', sector: 'Energy', marketCap: 'large', basePrice: 2800, trendBias: 0.0003, volatility: 0.017 },
  { symbol: 'ONGC', name: 'Oil & Natural Gas Corp.', sector: 'Energy', marketCap: 'large', basePrice: 267, trendBias: 0.0002, volatility: 0.022 },
  { symbol: 'BPCL', name: 'Bharat Petroleum Corp.', sector: 'Energy', marketCap: 'large', basePrice: 345, trendBias: 0.0001, volatility: 0.023 },
  { symbol: 'IOC', name: 'Indian Oil Corporation', sector: 'Energy', marketCap: 'large', basePrice: 178, trendBias: 0.0002, volatility: 0.021 },
  // FMCG
  { symbol: 'HINDUNILVR', name: 'Hindustan Unilever Ltd.', sector: 'FMCG', marketCap: 'large', basePrice: 2380, trendBias: 0.0001, volatility: 0.010 },
  { symbol: 'NESTLEIND', name: 'Nestle India Ltd.', sector: 'FMCG', marketCap: 'large', basePrice: 2480, trendBias: 0.0001, volatility: 0.009 },
  { symbol: 'BRITANNIA', name: 'Britannia Industries', sector: 'FMCG', marketCap: 'large', basePrice: 5120, trendBias: 0.0001, volatility: 0.011 },
  { symbol: 'DABUR', name: 'Dabur India Ltd.', sector: 'FMCG', marketCap: 'large', basePrice: 560, trendBias: 0.0001, volatility: 0.010 },
  { symbol: 'ITC', name: 'ITC Ltd.', sector: 'FMCG', marketCap: 'large', basePrice: 448, trendBias: 0.0002, volatility: 0.013 },
  { symbol: 'TATACONSUM', name: 'Tata Consumer Products', sector: 'FMCG', marketCap: 'large', basePrice: 920, trendBias: 0.0002, volatility: 0.014 },
  // Finance
  { symbol: 'BAJFINANCE', name: 'Bajaj Finance Ltd.', sector: 'Finance', marketCap: 'large', basePrice: 7200, trendBias: 0.0003, volatility: 0.022 },
  { symbol: 'BAJAJFINSV', name: 'Bajaj Finserv Ltd.', sector: 'Finance', marketCap: 'large', basePrice: 1680, trendBias: 0.0002, volatility: 0.019 },
  // Auto
  { symbol: 'MARUTI', name: 'Maruti Suzuki India', sector: 'Auto', marketCap: 'large', basePrice: 10800, trendBias: 0.0002, volatility: 0.017 },
  { symbol: 'TATAMOTORS', name: 'Tata Motors Ltd.', sector: 'Auto', marketCap: 'large', basePrice: 870, trendBias: 0.0004, volatility: 0.025 },
  { symbol: 'MM', name: 'Mahindra & Mahindra', sector: 'Auto', marketCap: 'large', basePrice: 1780, trendBias: 0.0004, volatility: 0.021 },
  { symbol: 'EICHERMOT', name: 'Eicher Motors Ltd.', sector: 'Auto', marketCap: 'large', basePrice: 3750, trendBias: 0.0002, volatility: 0.019 },
  { symbol: 'HEROMOTOCO', name: 'Hero MotoCorp Ltd.', sector: 'Auto', marketCap: 'large', basePrice: 4620, trendBias: 0.0001, volatility: 0.016 },
  // Pharma
  { symbol: 'SUNPHARMA', name: 'Sun Pharmaceutical', sector: 'Pharma', marketCap: 'large', basePrice: 1560, trendBias: 0.0003, volatility: 0.016 },
  { symbol: 'DRREDDY', name: "Dr. Reddy's Laboratories", sector: 'Pharma', marketCap: 'large', basePrice: 5640, trendBias: 0.0002, volatility: 0.015 },
  { symbol: 'DIVISLAB', name: "Divi's Laboratories", sector: 'Pharma', marketCap: 'large', basePrice: 3720, trendBias: 0.0003, volatility: 0.017 },
  { symbol: 'CIPLA', name: 'Cipla Ltd.', sector: 'Pharma', marketCap: 'large', basePrice: 1420, trendBias: 0.0002, volatility: 0.015 },
  // Consumer
  { symbol: 'ASIANPAINT', name: 'Asian Paints Ltd.', sector: 'Consumer', marketCap: 'large', basePrice: 2750, trendBias: 0.0001, volatility: 0.013 },
  { symbol: 'TITAN', name: 'Titan Company Ltd.', sector: 'Consumer', marketCap: 'large', basePrice: 3380, trendBias: 0.0003, volatility: 0.017 },
  // Materials
  { symbol: 'ULTRACEMCO', name: 'UltraTech Cement', sector: 'Materials', marketCap: 'large', basePrice: 9800, trendBias: 0.0002, volatility: 0.016 },
  { symbol: 'TATASTEEL', name: 'Tata Steel Ltd.', sector: 'Materials', marketCap: 'large', basePrice: 148, trendBias: 0.0002, volatility: 0.026 },
  { symbol: 'GRASIM', name: 'Grasim Industries', sector: 'Materials', marketCap: 'large', basePrice: 2380, trendBias: 0.0002, volatility: 0.018 },
  { symbol: 'JSWSTEEL', name: 'JSW Steel Ltd.', sector: 'Materials', marketCap: 'large', basePrice: 820, trendBias: 0.0002, volatility: 0.024 },
  { symbol: 'HINDALCO', name: 'Hindalco Industries', sector: 'Materials', marketCap: 'large', basePrice: 620, trendBias: 0.0003, volatility: 0.022 },
  { symbol: 'AMBUJACEM', name: 'Ambuja Cements', sector: 'Materials', marketCap: 'large', basePrice: 620, trendBias: 0.0002, volatility: 0.018 },
  // Utilities
  { symbol: 'POWERGRID', name: 'Power Grid Corp.', sector: 'Utilities', marketCap: 'large', basePrice: 278, trendBias: 0.0002, volatility: 0.013 },
  { symbol: 'NTPC', name: 'NTPC Ltd.', sector: 'Utilities', marketCap: 'large', basePrice: 336, trendBias: 0.0002, volatility: 0.014 },
  { symbol: 'COALINDIA', name: 'Coal India Ltd.', sector: 'Mining', marketCap: 'large', basePrice: 456, trendBias: 0.0001, volatility: 0.018 },
  // Insurance
  { symbol: 'SBILIFE', name: 'SBI Life Insurance', sector: 'Insurance', marketCap: 'large', basePrice: 1560, trendBias: 0.0002, volatility: 0.014 },
  { symbol: 'HDFCLIFE', name: 'HDFC Life Insurance', sector: 'Insurance', marketCap: 'large', basePrice: 620, trendBias: 0.0002, volatility: 0.014 },
  // Telecom
  { symbol: 'BHARTIARTL', name: 'Bharti Airtel Ltd.', sector: 'Telecom', marketCap: 'large', basePrice: 1280, trendBias: 0.0004, volatility: 0.017 },
  // Healthcare
  { symbol: 'APOLLOHOSP', name: 'Apollo Hospitals', sector: 'Healthcare', marketCap: 'large', basePrice: 6200, trendBias: 0.0004, volatility: 0.018 },
  // Infrastructure
  { symbol: 'ADANIPORTS', name: 'Adani Ports & SEZ', sector: 'Infrastructure', marketCap: 'large', basePrice: 1240, trendBias: 0.0003, volatility: 0.024 },
  { symbol: 'LT', name: 'Larsen & Toubro Ltd.', sector: 'Infrastructure', marketCap: 'large', basePrice: 3620, trendBias: 0.0003, volatility: 0.017 },
]

// Build stocks with generated price history
const STOCKS: Stock[] = STOCK_CONFIGS.map((cfg) => {
  const history = generatePriceHistory(cfg.symbol, cfg.basePrice, cfg.trendBias, cfg.volatility)
  return {
    symbol: cfg.symbol,
    name: cfg.name,
    sector: cfg.sector,
    marketCap: cfg.marketCap,
    currentPrice: history[history.length - 1].price,
    priceHistory: history,
  }
})

export function getStocks(): Stock[] {
  return STOCKS
}

export function getStock(symbol: string): Stock | undefined {
  return STOCKS.find((s) => s.symbol === symbol)
}

export function getStockPrice(symbol: string): number {
  const stock = getStock(symbol)
  return stock?.currentPrice ?? 0
}

export function getStockBySymbol(symbol: string): Stock | undefined {
  return STOCKS.find((s) => s.symbol === symbol)
}
