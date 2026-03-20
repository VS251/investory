'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { TrendingUp } from 'lucide-react'
import { useUserStore } from '@/store/useUserStore'
import { cn } from '@/lib/utils/cn'
import type { Goal, RiskTolerance, ExperienceLevel } from '@/types'

// ─── Step data ────────────────────────────────────────────────────────────────

const goals: { value: Goal; emoji: string; title: string; description: string }[] = [
  {
    value: 'wealth_building',
    emoji: '💰',
    title: 'Wealth Building',
    description: 'Grow my money over time through smart investments',
  },
  {
    value: 'learning',
    emoji: '📚',
    title: 'Learning',
    description: 'Understand how markets and investing actually work',
  },
  {
    value: 'retirement',
    emoji: '🏖️',
    title: 'Retirement',
    description: 'Build a nest egg for a comfortable retirement',
  },
  {
    value: 'passive_income',
    emoji: '🌱',
    title: 'Passive Income',
    description: 'Generate regular income from dividends and returns',
  },
]

const riskOptions: { value: RiskTolerance; emoji: string; title: string; description: string }[] = [
  {
    value: 'conservative',
    emoji: '🛡️',
    title: 'Conservative',
    description: 'I prefer stability over high returns',
  },
  {
    value: 'moderate',
    emoji: '⚖️',
    title: 'Moderate',
    description: "I'm okay with some ups and downs",
  },
  {
    value: 'aggressive',
    emoji: '🚀',
    title: 'Aggressive',
    description: 'I chase high growth and accept volatility',
  },
]

const experienceOptions: { value: ExperienceLevel; label: string; sublabel: string }[] = [
  { value: 'beginner', label: 'Total Beginner', sublabel: "I've never invested before" },
  { value: 'intermediate', label: "I've heard of stocks", sublabel: "I know the basics but haven't invested" },
  { value: 'advanced', label: "I've invested before", sublabel: 'I have real-world investing experience' },
]

// ─── Component ────────────────────────────────────────────────────────────────

export default function OnboardingPage() {
  const router = useRouter()
  const { setOnboardingAnswers, completeOnboarding } = useUserStore()

  const [step, setStep] = useState(0)
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null)
  const [selectedRisk, setSelectedRisk] = useState<RiskTolerance | null>(null)
  const [selectedExperience, setSelectedExperience] = useState<ExperienceLevel | null>(null)
  const [name, setName] = useState('')

  const canContinue =
    (step === 0 && selectedGoal !== null) ||
    (step === 1 && selectedRisk !== null) ||
    (step === 2 && selectedExperience !== null && name.trim().length > 0)

  function handleContinue() {
    if (step < 2) {
      setStep((s) => s + 1)
    } else {
      setOnboardingAnswers({
        name: name.trim(),
        goal: selectedGoal,
        riskTolerance: selectedRisk,
        experienceLevel: selectedExperience,
      })
      completeOnboarding()
      router.push('/simulator?guided=true')
    }
  }

  function handleBack() {
    if (step > 0) setStep((s) => s - 1)
  }

  return (
    <div className="min-h-screen bg-[var(--bg-page)] flex flex-col">
      {/* Header */}
      <header className="flex items-center px-6 py-4 border-b border-[var(--border)] bg-[var(--bg-card)]">
        <div className="flex items-center gap-2 font-bold text-[var(--text-primary)]">
          <TrendingUp className="h-5 w-5 text-brand-500" />
          <span className="text-lg">Investory</span>
        </div>
      </header>

      {/* Main content */}
      <div className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-lg">
          {/* Progress dots */}
          <div className="flex items-center justify-center gap-2 mb-8">
            {[0, 1, 2].map((dot) => (
              <div
                key={dot}
                className={cn(
                  'rounded-full transition-all duration-300',
                  dot === step
                    ? 'h-2.5 w-8 bg-brand-500'
                    : dot < step
                    ? 'h-2.5 w-2.5 bg-brand-400'
                    : 'h-2.5 w-2.5 bg-[var(--border)]'
                )}
              />
            ))}
          </div>

          {/* Step content */}
          {step === 0 && (
            <div>
              <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-1 text-center">
                What&apos;s your main goal?
              </h1>
              <p className="text-sm text-[var(--text-muted)] text-center mb-6">
                This helps us personalise your experience
              </p>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {goals.map((g) => (
                  <button
                    key={g.value}
                    onClick={() => setSelectedGoal(g.value)}
                    className={cn(
                      'rounded-card border-2 p-4 text-left transition-all duration-150 hover:shadow-card-hover focus:outline-none focus:ring-2 focus:ring-brand-400 focus:ring-offset-2',
                      selectedGoal === g.value
                        ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20'
                        : 'border-[var(--border)] bg-[var(--bg-card)]'
                    )}
                  >
                    <span className="text-2xl">{g.emoji}</span>
                    <p className="mt-2 font-semibold text-[var(--text-primary)] text-sm">{g.title}</p>
                    <p className="mt-0.5 text-xs text-[var(--text-muted)]">{g.description}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 1 && (
            <div>
              <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-1 text-center">
                What&apos;s your risk tolerance?
              </h1>
              <p className="text-sm text-[var(--text-muted)] text-center mb-6">
                No right or wrong answer — just be honest
              </p>
              <div className="flex flex-col gap-3">
                {riskOptions.map((r) => (
                  <button
                    key={r.value}
                    onClick={() => setSelectedRisk(r.value)}
                    className={cn(
                      'rounded-card border-2 p-4 text-left transition-all duration-150 hover:shadow-card-hover focus:outline-none focus:ring-2 focus:ring-brand-400 focus:ring-offset-2',
                      selectedRisk === r.value
                        ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20'
                        : 'border-[var(--border)] bg-[var(--bg-card)]'
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{r.emoji}</span>
                      <div>
                        <p className="font-semibold text-[var(--text-primary)] text-sm">{r.title}</p>
                        <p className="text-xs text-[var(--text-muted)]">{r.description}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-1 text-center">
                Tell us about yourself
              </h1>
              <p className="text-sm text-[var(--text-muted)] text-center mb-6">
                Almost there — one last step
              </p>

              {/* Name input */}
              <div className="mb-5">
                <label
                  htmlFor="name-input"
                  className="block text-sm font-medium text-[var(--text-primary)] mb-1.5"
                >
                  Your name
                </label>
                <input
                  id="name-input"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Varun"
                  className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg-card)] px-3 py-2.5 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-400/20 transition-colors"
                />
              </div>

              {/* Experience options */}
              <div className="flex flex-col gap-3">
                {experienceOptions.map((e) => (
                  <button
                    key={e.value}
                    onClick={() => setSelectedExperience(e.value)}
                    className={cn(
                      'rounded-card border-2 p-4 text-left transition-all duration-150 hover:shadow-card-hover focus:outline-none focus:ring-2 focus:ring-brand-400 focus:ring-offset-2',
                      selectedExperience === e.value
                        ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20'
                        : 'border-[var(--border)] bg-[var(--bg-card)]'
                    )}
                  >
                    <p className="font-semibold text-[var(--text-primary)] text-sm">{e.label}</p>
                    <p className="text-xs text-[var(--text-muted)] mt-0.5">{e.sublabel}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Navigation buttons */}
          <div className="mt-8 flex items-center gap-3">
            {step > 0 && (
              <button
                onClick={handleBack}
                className="flex-1 rounded-lg border border-[var(--border)] bg-[var(--bg-card)] px-4 py-2.5 text-sm font-medium text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-card-alt)] focus:outline-none focus:ring-2 focus:ring-brand-400 focus:ring-offset-2"
              >
                ← Back
              </button>
            )}
            <button
              onClick={handleContinue}
              disabled={!canContinue}
              className={cn(
                'flex-1 rounded-lg px-4 py-2.5 text-sm font-semibold transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-brand-400 focus:ring-offset-2',
                canContinue
                  ? 'bg-brand-500 text-white hover:bg-brand-600 active:bg-brand-700'
                  : 'bg-brand-200 text-white cursor-not-allowed dark:bg-brand-900 dark:text-brand-500'
              )}
            >
              {step === 2 ? 'Finish & Start →' : 'Continue →'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
