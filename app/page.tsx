'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { TrendingUp, Sun, Moon } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useUserStore } from '@/store/useUserStore'
import { cn } from '@/lib/utils/cn'

// ─── Feature cards data ───────────────────────────────────────────────────────

const features = [
  {
    emoji: '📚',
    title: 'Learning Hub',
    description: 'Structured courses from the basics of stocks all the way to advanced investing strategies.',
  },
  {
    emoji: '💹',
    title: 'Virtual Simulator',
    description: 'Practice buying and selling with ₹1,00,000 virtual money — zero real risk.',
  },
  {
    emoji: '🧠',
    title: 'Smart Insights',
    description: 'AI-powered explanations for every decision you make, so you understand the why.',
  },
]

const steps = [
  {
    number: '01',
    title: 'Set your goals',
    description: 'Tell us what you want to achieve — wealth building, retirement, passive income, or pure learning.',
  },
  {
    number: '02',
    title: 'Learn & Practice',
    description: 'Work through bite-sized lessons and immediately test your knowledge in the simulator.',
  },
  {
    number: '03',
    title: 'Track & Improve',
    description: 'Monitor your portfolio health score, review insights, and keep getting better every day.',
  },
]

// ─── Mini chart SVG illustration ─────────────────────────────────────────────

function HeroIllustration() {
  return (
    <div className="relative w-full max-w-sm mx-auto">
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-5 shadow-modal">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs text-[var(--text-muted)]">Portfolio Value</p>
            <p className="text-xl font-bold text-[var(--text-primary)] tabular-nums">₹1,14,280</p>
            <p className="text-xs font-medium text-gain">+₹14,280 (+14.28%)</p>
          </div>
          <div className="h-10 w-10 rounded-full bg-gain-light dark:bg-gain/10 border-2 border-gain/30 flex items-center justify-center">
            <span className="text-sm font-bold text-gain">A</span>
          </div>
        </div>
        <svg viewBox="0 0 240 60" className="w-full" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="hero-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#16a34a" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#16a34a" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d="M0,50 L20,45 L40,42 L60,38 L80,35 L100,30 L120,28 L140,22 L160,18 L180,12 L200,10 L220,6 L240,4 L240,60 L0,60 Z"
            fill="url(#hero-grad)"
          />
          <path
            d="M0,50 L20,45 L40,42 L60,38 L80,35 L100,30 L120,28 L140,22 L160,18 L180,12 L200,10 L220,6 L240,4"
            stroke="#16a34a"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <div className="mt-3 flex gap-2 flex-wrap">
          {['RELIANCE', 'TCS', 'INFY'].map((sym) => (
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
    if (hasCompletedOnboarding) {
      router.push('/simulator')
    } else {
      router.push('/onboarding')
    }
  }

  return (
    <div className="min-h-screen bg-[var(--bg-page)] flex flex-col">
      {/* ── Navbar ── */}
      <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-[var(--bg-card)]/80 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
          <div className="flex items-center gap-2 font-bold text-[var(--text-primary)]">
            <TrendingUp className="h-5 w-5 text-brand-500" />
            <span className="text-lg">Investory</span>
          </div>
          <div className="flex items-center gap-3">
            {mounted && (
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="rounded-lg p-2 text-[var(--text-muted)] hover:bg-[var(--bg-card-alt)] hover:text-[var(--text-primary)] transition-colors"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
              </button>
            )}
            <Link
              href="/onboarding"
              className="rounded-lg bg-brand-500 px-3 py-1.5 text-sm font-semibold text-white hover:bg-brand-600 transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="flex-1 flex items-center py-16 px-4">
        <div className="mx-auto max-w-6xl w-full">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 dark:border-brand-800 dark:bg-brand-900/20 px-3 py-1">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-500 animate-pulse" />
                <span className="text-xs font-medium text-brand-600 dark:text-brand-300">
                  Free to use · No real money needed
                </span>
              </div>

              <h1 className="text-4xl font-bold leading-tight text-[var(--text-primary)] mb-4 text-balance">
                Learn, Practice &{' '}
                <span className="text-brand-500">Master</span>{' '}
                Stock Investing
              </h1>

              <p className="text-base text-[var(--text-secondary)] mb-8 leading-relaxed max-w-lg">
                The only platform that explains the <strong>WHY</strong> behind every investment
                decision. No jargon. No risk. Just real learning.
              </p>

              <div className="flex flex-wrap gap-3">
                <Link
                  href="/onboarding"
                  className="inline-flex items-center gap-2 rounded-pill bg-brand-500 px-6 py-3 text-base font-semibold text-white hover:bg-brand-600 active:bg-brand-700 transition-colors shadow-md hover:shadow-lg"
                >
                  Get Started Free →
                </Link>
                <button
                  onClick={handleDemo}
                  className="inline-flex items-center gap-2 rounded-pill border border-[var(--border)] bg-[var(--bg-card)] px-6 py-3 text-base font-semibold text-[var(--text-primary)] hover:bg-[var(--bg-card-alt)] transition-colors"
                >
                  View Demo
                </button>
              </div>
            </div>

            <HeroIllustration />
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="py-16 px-4 bg-[var(--bg-card)] border-t border-[var(--border)]">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-2">
              Everything you need to become a confident investor
            </h2>
            <p className="text-sm text-[var(--text-muted)]">
              Built for beginners, powerful enough for experienced investors
            </p>
          </div>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {features.map((f) => (
              <div
                key={f.title}
                className="rounded-card border border-[var(--border)] bg-[var(--bg-page)] p-6 shadow-card"
              >
                <span className="text-3xl mb-3 block">{f.emoji}</span>
                <h3 className="font-bold text-[var(--text-primary)] mb-1">{f.title}</h3>
                <p className="text-sm text-[var(--text-muted)] leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="py-16 px-4">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-2">How it works</h2>
            <p className="text-sm text-[var(--text-muted)]">Three steps to investment confidence</p>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {steps.map((step, index) => (
              <div key={step.number} className="flex gap-4">
                <div className="flex-shrink-0">
                  <div
                    className={cn(
                      'h-10 w-10 rounded-full flex items-center justify-center text-sm font-bold',
                      index === 0
                        ? 'bg-brand-500 text-white'
                        : 'bg-[var(--bg-card-alt)] text-[var(--text-secondary)]'
                    )}
                  >
                    {step.number}
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-[var(--text-primary)] mb-1">{step.title}</h3>
                  <p className="text-sm text-[var(--text-muted)] leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="py-16 px-4 bg-brand-500">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-bold text-white mb-2">
            Start with ₹1,00,000 virtual money — no real money needed
          </h2>
          <p className="text-brand-100 mb-8">
            Learn by doing, with zero financial risk.
          </p>
          <Link
            href="/onboarding"
            className="inline-flex items-center gap-2 rounded-pill bg-white px-8 py-3 text-base font-semibold text-brand-600 hover:bg-brand-50 transition-colors shadow-md"
          >
            Start Investing for Free →
          </Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-[var(--border)] bg-[var(--bg-card)] py-6 px-4 text-center">
        <p className="text-xs text-[var(--text-muted)]">
          Simulated data only. Not financial advice. Investory is a learning tool — always consult a qualified financial advisor before making real investment decisions.
        </p>
      </footer>
    </div>
  )
}
