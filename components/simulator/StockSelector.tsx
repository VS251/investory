'use client'

import { useState, useRef, useEffect } from 'react'
import { ChevronDown, Search } from 'lucide-react'
import { getStocks } from '@/lib/data/stocks'
import { formatCurrency } from '@/lib/utils/formatters'
import { Badge } from '@/components/ui/Badge'
import { cn } from '@/lib/utils/cn'
import type { Sector } from '@/types'

interface StockSelectorProps {
  value: string
  onChange: (symbol: string) => void
}

// Map sector to a badge variant for visual differentiation
function sectorVariant(sector: Sector): 'info' | 'success' | 'warning' | 'default' | 'danger' {
  const map: Partial<Record<Sector, 'info' | 'success' | 'warning' | 'default' | 'danger'>> = {
    Banking: 'info',
    IT: 'info',
    Energy: 'warning',
    FMCG: 'success',
    Finance: 'info',
    Auto: 'default',
    Pharma: 'success',
    Consumer: 'default',
    Telecom: 'warning',
    Utilities: 'default',
    Materials: 'warning',
    Infrastructure: 'default',
    Insurance: 'info',
    Healthcare: 'success',
    Mining: 'warning',
  }
  return map[sector] ?? 'default'
}

export function StockSelector({ value, onChange }: StockSelectorProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const containerRef = useRef<HTMLDivElement>(null)
  const searchRef = useRef<HTMLInputElement>(null)

  const stocks = getStocks()

  const filtered = stocks.filter((s) => {
    const q = search.toLowerCase()
    return (
      s.symbol.toLowerCase().includes(q) ||
      s.name.toLowerCase().includes(q) ||
      s.sector.toLowerCase().includes(q)
    )
  })

  const selected = stocks.find((s) => s.symbol === value)

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
        setSearch('')
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Focus search when opened
  useEffect(() => {
    if (open && searchRef.current) {
      searchRef.current.focus()
    }
  }, [open])

  function handleSelect(symbol: string) {
    onChange(symbol)
    setOpen(false)
    setSearch('')
  }

  return (
    <div ref={containerRef} className="relative">
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={cn(
          'flex w-full items-center justify-between gap-2 rounded-lg border px-3 py-2.5 text-sm transition-colors',
          'bg-[var(--bg-card)] border-[var(--border)] text-[var(--text-primary)]',
          'hover:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-400 focus:ring-offset-1',
          open && 'border-brand-500 ring-2 ring-brand-400 ring-offset-1'
        )}
      >
        <div className="flex min-w-0 items-center gap-2">
          {selected ? (
            <>
              <span className="font-semibold text-[var(--text-primary)]">{selected.symbol}</span>
              <span className="truncate text-xs text-[var(--text-muted)]">{selected.name}</span>
              <Badge variant={sectorVariant(selected.sector)} size="sm">
                {selected.sector}
              </Badge>
            </>
          ) : (
            <span className="text-[var(--text-muted)]">Select a stock...</span>
          )}
        </div>
        <ChevronDown
          size={16}
          className={cn(
            'flex-shrink-0 text-[var(--text-muted)] transition-transform',
            open && 'rotate-180'
          )}
        />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute left-0 right-0 top-full z-50 mt-1 rounded-lg border border-[var(--border)] bg-[var(--bg-card)] shadow-modal">
          {/* Search */}
          <div className="flex items-center gap-2 border-b border-[var(--border)] px-3 py-2">
            <Search size={14} className="flex-shrink-0 text-[var(--text-muted)]" />
            <input
              ref={searchRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search symbol, name, sector..."
              className="flex-1 bg-transparent text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none"
            />
          </div>

          {/* Options */}
          <div className="max-h-64 overflow-y-auto">
            {filtered.length === 0 ? (
              <div className="px-3 py-4 text-center text-sm text-[var(--text-muted)]">
                No stocks found
              </div>
            ) : (
              filtered.map((stock) => (
                <button
                  key={stock.symbol}
                  type="button"
                  onClick={() => handleSelect(stock.symbol)}
                  className={cn(
                    'flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm transition-colors hover:bg-[var(--bg-card-alt)]',
                    stock.symbol === value && 'bg-brand-50 dark:bg-brand-900/20'
                  )}
                >
                  <div className="flex min-w-0 flex-1 items-center gap-2">
                    <span className="w-24 flex-shrink-0 font-semibold text-[var(--text-primary)]">
                      {stock.symbol}
                    </span>
                    <span className="min-w-0 flex-1 truncate text-xs text-[var(--text-muted)]">
                      {stock.name}
                    </span>
                    <Badge variant={sectorVariant(stock.sector)} size="sm">
                      {stock.sector}
                    </Badge>
                  </div>
                  <span className="flex-shrink-0 font-mono text-xs font-medium text-[var(--text-primary)]">
                    {formatCurrency(stock.currentPrice)}
                  </span>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
