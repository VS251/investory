import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Holding, Trade, TradeResult } from '@/types'

const STARTING_BALANCE = 100000

interface PortfolioStore {
  startingBalance: number
  cashBalance: number
  holdings: Record<string, Holding>
  trades: Trade[]
  lastHealthScore: number | null
  executeBuy: (symbol: string, name: string, quantity: number, price: number) => TradeResult
  executeSell: (symbol: string, name: string, quantity: number, price: number) => TradeResult
  setLastHealthScore: (score: number) => void
  resetPortfolio: () => void
  exportData: () => string
}

const DEFAULT_STATE = {
  startingBalance: STARTING_BALANCE,
  cashBalance: STARTING_BALANCE,
  holdings: {} as Record<string, Holding>,
  trades: [] as Trade[],
  lastHealthScore: null as number | null,
}

export const usePortfolioStore = create<PortfolioStore>()(
  persist(
    (set, get) => ({
      ...DEFAULT_STATE,

      executeBuy: (symbol, name, quantity, price) => {
        if (quantity <= 0) {
          return { success: false, error: 'invalid_quantity' }
        }
        const total = quantity * price
        const { cashBalance, holdings } = get()

        if (total > cashBalance) {
          return { success: false, error: 'insufficient_funds' }
        }

        const trade: Trade = {
          id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
          symbol,
          name,
          type: 'buy',
          quantity,
          price, // snapshot
          total,
          timestamp: Date.now(),
        }

        const existing = holdings[symbol]
        let updatedHolding: Holding

        if (existing) {
          // Weighted average buy price
          const newTotalQty = existing.quantity + quantity
          const newAvgPrice =
            (existing.quantity * existing.averageBuyPrice + quantity * price) / newTotalQty
          updatedHolding = {
            ...existing,
            quantity: newTotalQty,
            averageBuyPrice: newAvgPrice,
            totalInvested: existing.totalInvested + total,
          }
        } else {
          updatedHolding = {
            symbol,
            name,
            quantity,
            averageBuyPrice: price,
            totalInvested: total,
          }
        }

        set((state) => ({
          cashBalance: state.cashBalance - total,
          holdings: { ...state.holdings, [symbol]: updatedHolding },
          trades: [trade, ...state.trades],
        }))

        return { success: true, trade }
      },

      executeSell: (symbol, name, quantity, price) => {
        if (quantity <= 0) {
          return { success: false, error: 'invalid_quantity' }
        }
        const { holdings } = get()
        const existing = holdings[symbol]

        if (!existing || existing.quantity < quantity) {
          return { success: false, error: 'insufficient_holdings' }
        }

        const total = quantity * price
        const trade: Trade = {
          id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
          symbol,
          name,
          type: 'sell',
          quantity,
          price, // snapshot
          total,
          timestamp: Date.now(),
        }

        const updatedHoldings = { ...holdings }
        const remainingQty = existing.quantity - quantity

        if (remainingQty === 0) {
          delete updatedHoldings[symbol]
        } else {
          // Keep average buy price; reduce quantity and totalInvested proportionally
          updatedHoldings[symbol] = {
            ...existing,
            quantity: remainingQty,
            totalInvested: (remainingQty / existing.quantity) * existing.totalInvested,
          }
        }

        set((state) => ({
          cashBalance: state.cashBalance + total,
          holdings: updatedHoldings,
          trades: [trade, ...state.trades],
        }))

        return { success: true, trade }
      },

      setLastHealthScore: (score) => set({ lastHealthScore: score }),

      resetPortfolio: () =>
        set({
          cashBalance: STARTING_BALANCE,
          holdings: {},
          trades: [],
          lastHealthScore: null,
        }),

      exportData: () => {
        const state = get()
        return JSON.stringify(
          {
            exported_at: new Date().toISOString(),
            balance: {
              starting: state.startingBalance,
              cash: state.cashBalance,
            },
            holdings: state.holdings,
            trades: state.trades,
          },
          null,
          2
        )
      },
    }),
    { name: 'investory_portfolio' }
  )
)
