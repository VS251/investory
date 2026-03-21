'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { TrendingUp, Sun, Moon } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useUserStore } from '@/store/useUserStore'

// ─── Hero Illustration ────────────────────────────────────────────────────────

function HeroIllustration() {
  return (
    <div className="relative w-full h-full">
      {/* Ambient radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 65% 65% at 55% 50%, rgba(43,135,255,0.10) 0%, transparent 70%)',
        }}
      />

      {/* Floating chip: gain percentage */}
      <div className="absolute top-10 right-8 z-20 flex items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--bg-card)] px-3 py-1.5 shadow-card">
        <span className="h-1.5 w-1.5 rounded-full bg-gain" />
        <span className="text-xs font-semibold text-gain tabular-nums">+14.28%</span>
      </div>

      {/* Floating chip: virtual badge */}
      <div className="absolute top-[30%] left-4 z-20 rounded-full border border-[var(--border)] bg-[var(--bg-card)] px-3 py-1.5 shadow-card">
        <span className="text-xs font-medium text-[var(--text-muted)]">Virtual · No Risk</span>
      </div>

      {/* Floating chip: stock up */}
      <div className="absolute bottom-24 right-4 z-20 rounded-full bg-brand-500 px-3 py-1.5 shadow-md">
        <span className="text-xs font-semibold text-white tabular-nums">TCS ↑ 1.8%</span>
      </div>

      {/* Floating chip: stock down */}
      <div className="absolute bottom-10 left-14 z-20 flex items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--bg-card)] px-3 py-1.5 shadow-card">
        <span className="h-1.5 w-1.5 rounded-full bg-loss" />
        <span className="text-xs font-medium text-[var(--text-secondary)] tabular-nums">INFY −0.4%</span>
      </div>

      {/* Central portfolio card */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="z-10 w-72 rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-5 shadow-modal">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs text-[var(--text-muted)]">Portfolio Value</p>
              <p className="text-2xl font-bold text-[var(--text-primary)] tabular-nums">$114,280</p>
              <p className="text-sm font-medium text-gain">+$14,280 (+14.28%)</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-gain/30 bg-gain-light dark:bg-gain/10">
              <span className="text-sm font-bold text-gain">A</span>
            </div>
          </div>
          <svg viewBox="0 0 240 60" className="w-full" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="illus-grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2b87ff" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#2b87ff" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path
              d="M0,52 L30,46 L60,40 L90,32 L120,25 L150,17 L180,11 L210,7 L240,4 L240,60 L0,60 Z"
              fill="url(#illus-grad)"
            />
            <path
              d="M0,52 L30,46 L60,40 L90,32 L120,25 L150,17 L180,11 L210,7 L240,4"
              stroke="#2b87ff"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <div className="mt-3 flex gap-2">
            {['AAPL', 'MSFT', 'NVDA'].map((sym) => (
              <span
                key={sym}
                className="rounded-md bg-[var(--bg-card-alt)] px-2 py-0.5 text-xs font-medium text-[var(--text-secondary)]"
              >
                {sym}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function LandingPage() {
  const router = useRouter()
  const hasCompletedOnboarding = useUserStore((s) => s.hasCompletedOnboarding)
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  function handleDemo() {
    router.push(hasCompletedOnboarding ? '/simulator' : '/onboarding')
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[var(--bg-page)]">
      {/* ── Navbar ── */}
      <header className="flex-shrink-0 border-b border-[var(--border)] bg-[var(--bg-card)]/80 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-2 font-bold text-[var(--text-primary)]">
            <TrendingUp className="h-5 w-5 text-brand-500" />
            <span className="text-lg">Investory</span>
          </div>
          <div className="flex items-center gap-3">
            {mounted && (
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="rounded-lg p-2 text-[var(--text-muted)] transition-colors hover:bg-[var(--bg-card-alt)] hover:text-[var(--text-primary)]"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
              </button>
            )}
            <Link
              href="/onboarding"
              className="rounded-lg bg-brand-500 px-4 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-brand-600"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* ── Hero ── */}
      <main className="flex min-h-0 flex-1 items-center px-6">
        <div className="mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-12 lg:grid-cols-2">
          {/* Left: copy */}
          <div className="flex flex-col">
            <div className="mb-5 inline-flex items-center gap-2 self-start rounded-full border border-brand-200 bg-brand-50 px-3 py-1 dark:border-brand-800 dark:bg-brand-900/20">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-brand-500" />
              <span className="text-xs font-medium text-brand-600 dark:text-brand-300">
                Free to use · No real money needed
              </span>
            </div>

            <h1 className="mb-5 text-5xl font-bold leading-[1.1] tracking-tight text-[var(--text-primary)] lg:text-[3.25rem]">
              Learn to invest.<br />
              <span className="text-brand-500">Without the risk.</span>
            </h1>

            <p className="mb-8 max-w-md text-lg leading-relaxed text-[var(--text-secondary)]">
              Practice with $100,000 in virtual money and understand the{' '}
              <strong className="text-[var(--text-primary)]">why</strong>{' '}
              behind every trade — no jargon, zero stakes.
            </p>

            <div className="mb-10 flex flex-wrap gap-3">
              <Link
                href="/onboarding"
                className="inline-flex items-center gap-2 rounded-pill bg-brand-500 px-7 py-3 text-base font-semibold text-white shadow-md transition-colors hover:bg-brand-600 hover:shadow-lg active:bg-brand-700"
              >
                Start for Free →
              </Link>
              <button
                onClick={handleDemo}
                className="inline-flex items-center gap-2 rounded-pill border border-[var(--border)] bg-[var(--bg-card)] px-7 py-3 text-base font-semibold text-[var(--text-primary)] transition-colors hover:bg-[var(--bg-card-alt)]"
              >
                View Demo
              </button>
            </div>

            {/* Compact feature strip */}
            <div className="flex items-center gap-4 text-sm text-[var(--text-muted)]">
              <span>📚 Learning Hub</span>
              <span className="text-[var(--border)]">·</span>
              <span>💹 Simulator</span>
              <span className="text-[var(--border)]">·</span>
              <span>🧠 Smart Insights</span>
            </div>
          </div>

          {/* Right: illustration */}
          <div className="relative hidden h-[420px] lg:block">
            <HeroIllustration />
          </div>
        </div>
      </main>

      {/* ── Disclaimer ── */}
      <footer className="flex-shrink-0 border-t border-[var(--border)] py-3 px-6 text-center">
        <p className="text-xs text-[var(--text-muted)]">
          Simulated data only. Not financial advice. Always consult a qualified financial advisor before making real investment decisions.
        </p>
      </footer>
    </div>
  )
}
