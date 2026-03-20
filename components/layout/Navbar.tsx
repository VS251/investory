'use client'

import Link from 'next/link'
import { useTheme } from 'next-themes'
import { Sun, Moon, TrendingUp } from 'lucide-react'
import { useEffect, useState } from 'react'

export function Navbar() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-[var(--bg-card)]/80 backdrop-blur-md">
      <div className="flex h-14 items-center justify-between px-6">
        <Link href="/dashboard" className="flex items-center gap-2 font-bold text-[var(--text-primary)]">
          <TrendingUp className="h-5 w-5 text-brand-500" />
          <span className="text-lg">Investory</span>
        </Link>

        <div className="flex items-center gap-2">
          {mounted && (
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="rounded-lg p-2 text-[var(--text-muted)] hover:bg-[var(--bg-card-alt)] hover:text-[var(--text-primary)] transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          )}
        </div>
      </div>
    </header>
  )
}
