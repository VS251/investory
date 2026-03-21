<div align="center">

# 📈 Investory

### Learn. Practice. Invest smarter.

**The only investing platform that explains the *why* behind every decision.**

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38bdf8?style=flat-square&logo=tailwind-css)](https://tailwindcss.com)
[![Zustand](https://img.shields.io/badge/Zustand-state-orange?style=flat-square)](https://zustand-demo.pmnd.rs)
[![License: MIT](https://img.shields.io/badge/License-MIT-green?style=flat-square)](./LICENSE)
[![Live Demo](https://img.shields.io/badge/Live-Demo-2b87ff?style=flat-square&logo=vercel)](https://investory-seven.vercel.app)

<br />

![Investory Hero Screenshot](./screenshots/hero.png)
*The Investory dashboard — portfolio health, daily lessons, and live trade insights in one place.*

</div>

---

## What is Investory?

Most investing apps tell you **what** to do. Investory tells you **why**.

Investory is a free platform for learning stock investing from scratch — or sharpening an existing strategy. It combines structured education, a realistic virtual trading simulator, and AI-powered explanations into one cohesive experience.

No real money. No sign-up required. Just learn by doing.

> Built around 50 US large-cap stocks (NYSE/NASDAQ) across all 11 GICS sectors, with live end-of-day prices from Yahoo Finance.

---

## Table of Contents

- [Why Investory?](#why-investory)
- [Features](#features)
- [Learning Hub — The Core Differentiator](#learning-hub--the-core-differentiator)
- [Screenshots](#screenshots)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [How the Data Pipeline Works](#how-the-data-pipeline-works)
- [How the "Explain My Action" Engine Works](#how-the-explain-my-action-engine-works)
- [Contributing](#contributing)
- [License](#license)

---

## Why Investory?

The internet has plenty of investing resources. What's missing is the bridge between **knowing** and **doing** — and understanding *why a decision was right or wrong* after you make it.

| Other simulators | Investory |
|---|---|
| Show you numbers | Explain what those numbers mean |
| Let you trade | Teach you *while* you trade |
| Show P&L | Show P&L + tell you why it happened |
| Generic advice | Personalised to your risk profile |

---

## Features

### 📚 Learning Hub *(core differentiator — see below)*
Structured courses, bite-sized lessons, instant quizzes, and a daily streak to keep you coming back.

### 💹 Virtual Trading Simulator
Start with $100,000 in virtual money and trade 50 US large-cap stocks with live end-of-day prices. Every trade is tracked, charted, and explained.

### 🧠 "Explain My Action" — AI-Powered Trade Insights
After **every trade**, a plain-English explanation appears:
- What you just did and why it matters
- Your current risk level (Low / Medium / High)
- Specific warnings (e.g. over-concentration, sector risk)
- A constructive tip for improvement

And before you trade — a **live pre-trade insight** updates as you type your quantity, warning you before you make a mistake.

### 📊 Portfolio Health Score
A 0–100 score that measures the real quality of your portfolio across three dimensions:
- **Diversification** — how well spread across sectors and stocks
- **Risk Match** — whether your holdings match your stated risk tolerance
- **Cash Ratio** — whether you're over-invested or holding too much idle cash

Includes a delta (`+5 after last trade`) and an actionable CTA based on your score.

### 🔍 Diagnostic Insights
Four categories of personalised insights — not random tips:
- **Risk** — concentration warnings, sector exposure
- **Mistakes** — selling at a loss, over-trading patterns
- **Opportunities** — gaps in your strategy based on your risk profile
- **Good Decisions** — positive reinforcement for what you're doing right

### 🛠 Financial Tools
- **SIP Calculator** — project wealth from monthly investments
- **Compound Interest Calculator** — visualise the power of compounding

---

## 📚 Learning Hub — The Core Differentiator

> *"The best investment you can make is in yourself."* — Warren Buffett

Most simulators drop you into a trading interface with zero context. Investory starts with education and connects every lesson directly to practice.

### 5 Courses · 22 Lessons · Instant Feedback

| Course | Level | Lessons |
|---|---|---|
| Basics of Investing | Beginner | What is a stock? How prices move. P/E ratio. |
| Risk & Diversification | Beginner | Risk types. Why diversification works. Sector vs geographic. |
| Reading the Market | Intermediate | Stock exchanges. Bull/bear cycles. Index funds explained. |
| Portfolio Strategy | Intermediate | Building your first portfolio. Dollar-cost averaging. Rebalancing. |
| Advanced Concepts | Advanced | Valuation. Sector rotation. Macro indicators. |

### How it works

**1. Read** — Each lesson is a focused 3–6 minute read with real market examples.

**2. Answer** — Every lesson ends with an instant-feedback quiz. Select an answer, get immediate confirmation and the explanation *why* — even if you got it right.

**3. Do** — Lessons with a practical component include a **"Try it in Simulator"** button that deep-links you to the simulator with contextual hints.

```
"You just learned about diversification.
 Try buying stocks from 2 different sectors in the simulator."
                                         ↓
              /simulator?lesson=diversification
```

**4. Track** — Progress bars per course, completion checkmarks per lesson, and a **daily streak counter** that rewards consistent learning.

> The streak counts calendar days, not lessons — so completing 10 lessons today still counts as 1 day. Come back tomorrow to build your streak.

![Learning Hub Screenshot](./screenshots/learn.png)
*The Learning Hub — structured courses with progress tracking and daily streaks.*

![Lesson Screenshot](./screenshots/lesson.png)
*A lesson in progress — content blocks, instant quiz feedback, and a simulator CTA.*

---

## Screenshots

| | |
|---|---|
| ![Dashboard](./screenshots/dashboard.png) | ![Simulator](./screenshots/simulator.png) |
| **Dashboard** — portfolio overview, health score, daily lesson prompt | **Simulator** — live pre-trade insights, price chart, trade history |
| ![Portfolio](./screenshots/portfolio.png) | ![Insights](./screenshots/insights.png) |
| **Portfolio** — health score breakdown, sector allocation, holdings P&L | **Insights** — diagnostic cards across Risk, Mistakes, Opportunities, Good Decisions |
| ![Learning Hub](./screenshots/learn.png)  | ![Explain My Action](./screenshots/explain.png) |
| **Learning Hub** — 5 courses, progress bars, streak counter | **Explain My Action** — post-trade explanation modal with risk level and tip |

---

## Tech Stack

| Layer | Technology | Why |
|---|---|---|
| Framework | [Next.js 14](https://nextjs.org) (App Router) | File-based routing, server/client split, API routes |
| Language | [TypeScript](https://typescriptlang.org) | Type-safe contracts between stores, engines, and UI |
| Styling | [Tailwind CSS](https://tailwindcss.com) | Utility-first, consistent design tokens, dark mode |
| State | [Zustand](https://zustand-demo.pmnd.rs) + `persist` | Minimal boilerplate, localStorage persistence built-in |
| Charts | [Recharts](https://recharts.org) | Declarative React charts, smooth animations |
| Market Data | [yahoo-finance2](https://github.com/gadicc/yahoo-finance2) | EOD quotes + 1-year price history, server-side only |
| Icons | [Lucide React](https://lucide.dev) | Clean, consistent icon set |
| Theme | [next-themes](https://github.com/pacocoursey/next-themes) | Zero-flicker dark/light mode |

**No database. No user authentication. No API keys required.**

Market data is fetched server-side via Next.js API routes and cached in memory. Portfolio state is persisted to `localStorage` via Zustand.

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm / yarn / pnpm

### Installation

```bash
# Clone the repo
git clone https://github.com/VS251/investory.git
cd investory

# Install dependencies
npm install

# Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

The app immediately seeds 50 US stocks from static fallback prices so it never renders empty. Live prices load within a couple of seconds as the API route fetches from Yahoo Finance in the background.

### Build for production

```bash
npm run build
npm start
```

### Deploy to Vercel (one command)

```bash
npx vercel --prod
```

---

## Project Structure

```
investory/
├── app/
│   ├── api/
│   │   ├── stocks/              # GET /api/stocks — live quotes for all 50
│   │   │   └── [symbol]/
│   │   │       └── history/     # GET /api/stocks/:symbol/history — 1yr OHLC
│   │   └── benchmarks/          # GET /api/benchmarks — SPY, QQQ, IWM, VTI
│   ├── (app)/                   # App pages (requires onboarding)
│   │   ├── dashboard/
│   │   ├── learn/[slug]/
│   │   ├── simulator/
│   │   ├── portfolio/
│   │   ├── insights/
│   │   └── tools/
│   ├── onboarding/
│   └── page.tsx                 # Landing page
│
├── components/
│   ├── providers/
│   │   └── StockDataProvider.tsx  # Hydrates Zustand store on mount
│   ├── ui/                        # Base design system (Button, Card, Badge…)
│   ├── layout/                    # Navbar, Sidebar, BottomNav
│   ├── simulator/                 # OrderPanel, ExplainMyActionModal…
│   ├── portfolio/                 # HealthScoreCard, HoldingsTable…
│   ├── learn/                     # CourseCard, QuizBlock, LessonContent…
│   └── insights/                  # InsightCard, diagnostic sections
│
├── hooks/
│   └── useStockHistory.ts         # Lazy-loads per-symbol EOD history on demand
│
├── lib/
│   ├── ai/
│   │   ├── explainAction.ts       # "Explain My Action" rule engine
│   │   ├── healthScore.ts         # Portfolio Health Score algorithm
│   │   └── diagnostics.ts         # 4-category insights rules
│   ├── cache/
│   │   └── prices.ts              # Server-side in-memory cache (TTL)
│   ├── data/
│   │   ├── stocks.ts              # Delegates to useStocksStore.getState()
│   │   └── courses.ts             # 5 courses, 22 lessons, all quiz content
│   ├── providers/
│   │   └── yahoo-finance.ts       # Yahoo Finance abstraction (swap without touching routes)
│   └── utils/                     # Formatters, calculations, cn()
│
└── store/
    ├── useStocksStore.ts          # Stock registry + US_STOCKS_CONFIG (50 symbols)
    ├── useUserStore.ts            # Onboarding profile, risk tolerance
    ├── usePortfolioStore.ts       # Holdings, trades, health score delta
    └── useProgressStore.ts        # Lesson completion, quiz scores, streak
```

---

## How the Data Pipeline Works

```
Browser                        Next.js Server              Yahoo Finance
  |                                  |                           |
  |  mount StockDataProvider         |                           |
  |─────────────────────────────────>│                           |
  |                           GET /api/stocks                    |
  |                                  │──────────────────────────>│
  |                                  │   50 quotes (EOD)         │
  |                                  │<──────────────────────────│
  |     { data: [...50 stocks] }     │  cache 5 min              │
  |<─────────────────────────────────│                           |
  |  useStocksStore.setStocks(...)   |                           |
  |                                  |                           |
  |  (user views a stock chart)      |                           |
  |  useStockHistory('AAPL')         |                           |
  |─────────────────────────────────>│                           |
  |                     GET /api/stocks/AAPL/history             |
  |                                  │──────────────────────────>│
  |                                  │   252 days OHLC           │
  |                                  │<──────────────────────────│
  |   { data: [...252 points] }      │  cache 24 h               │
  |<─────────────────────────────────│                           |
  |  useStocksStore.setHistory(...)  |                           |
```

**Key design decisions:**

- **Never empty** — `useStocksStore` seeds itself from `US_STOCKS_CONFIG` fallback prices at module init. The UI is always renderable.
- **Provider abstraction** — all Yahoo Finance calls go through `lib/providers/yahoo-finance.ts`. Swapping to Polygon.io or another provider is a 1-file change.
- **Lazy history** — price history is only fetched when a symbol is actually viewed, not upfront for all 50 stocks.
- **In-memory server cache** — quotes: 5 min TTL, history: 24 h TTL. Prevents hammering Yahoo Finance across concurrent requests.
- **Stale-on-error** — if Yahoo Finance fails, the cache serves stale data; if the cache is also cold, fallback prices are returned. The app never breaks.

---

## How the "Explain My Action" Engine Works

There's no OpenAI API call here. Every explanation is computed locally via a **rule-based engine** (`lib/ai/explainAction.ts`) that runs in milliseconds:

```
After a trade executes:

1. Compute post-trade portfolio snapshot
2. Run 4 rules in sequence:
   → Single-stock concentration  (>40% = High risk)
   → Sector concentration        (>60% = High, >40% = Medium)
   → Cash ratio                  (<10% remaining = warning)
   → Selling at a loss           (>10% below avg buy price)
3. Final risk = max(all rule outputs)
4. Fill explanation template with real computed values
5. Return: headline, risk level, warnings[], tip
```

This means explanations feel personalised (they contain your actual numbers) but are deterministic, fast, and work completely offline.

The same pattern applies to the **Portfolio Health Score** and **Diagnostic Insights** — pure functions, no external dependencies.

---

## Contributing

Contributions are very welcome! Here's how to get involved:

```bash
# Fork the repo, then:
git clone https://github.com/VS251/investory.git
cd investory
npm install
npm run dev

# Create a branch
git checkout -b feat/your-feature-name

# Make your changes, then open a PR
```

### Ideas for contribution

- [ ] Add more US stocks (mid-cap, small-cap, international ADRs)
- [ ] Add more courses (Mutual Funds / ETFs, Options basics, Bonds)
- [ ] Benchmark comparison — portfolio vs SPY / QQQ
- [ ] Mobile app (React Native / Expo)
- [ ] Leaderboard for virtual trading
- [ ] User accounts + cloud sync

### Guidelines

- Keep PRs focused — one feature or fix per PR
- Match the existing TypeScript style (no `any`, explicit interfaces)
- Test in both light and dark mode before opening a PR
- Add an entry to the relevant section in this README if you add a feature

---

## Roadmap

- [x] Virtual trading simulator with $100,000 starting balance
- [x] "Explain My Action" post-trade insights
- [x] Portfolio Health Score (0–100)
- [x] 5 courses / 22 lessons with instant quiz feedback
- [x] Diagnostic insights (Risk / Mistakes / Opportunities / Good Decisions)
- [x] Daily streak tracking
- [x] Dark / light mode
- [x] Real market data — 50 US stocks via Yahoo Finance (EOD quotes + 1-year history)
- [ ] Benchmark comparison (portfolio vs SPY)
- [ ] User accounts + cloud sync
- [ ] Mobile app
- [ ] Leaderboard

---

## License

MIT © [Varun Salian](https://github.com/VS251)

Free to use, fork, and build on. If Investory helped you learn something, a ⭐ on GitHub goes a long way.

---

<div align="center">

**Built with curiosity and a belief that everyone deserves to understand their money.**

[Live Demo](https://investory-seven.vercel.app) · [Report a Bug](https://github.com/VS251/investory/issues) · [Request a Feature](https://github.com/VS251/investory/issues)

</div>
