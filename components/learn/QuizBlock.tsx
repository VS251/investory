'use client'

import { useState } from 'react'
import { useProgressStore } from '@/store/useProgressStore'
import { cn } from '@/lib/utils/cn'
import type { Quiz } from '@/types'

interface QuizBlockProps {
  quiz: Quiz
  lessonId: string
  courseSlug: string
  onComplete: () => void
}

const OPTION_LABELS = ['A', 'B', 'C', 'D']

export function QuizBlock({ quiz, lessonId, courseSlug: _courseSlug, onComplete }: QuizBlockProps) {
  const recordQuizScore = useProgressStore((s) => s.recordQuizScore)

  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const hasAnswered = selectedIndex !== null
  const isCorrect = selectedIndex === quiz.correctIndex

  function handleSelect(index: number) {
    if (hasAnswered) return
    setSelectedIndex(index)
    const score = index === quiz.correctIndex ? 100 : 0
    recordQuizScore(lessonId, score)
  }

  return (
    <div className="rounded-card border border-[var(--border)] bg-[var(--bg-card)] p-5 shadow-card">
      {/* Quiz label */}
      <p className="text-xs font-semibold uppercase tracking-wide text-brand-500 mb-3">
        Quick Quiz
      </p>

      {/* Question */}
      <p className="text-sm font-semibold text-[var(--text-primary)] mb-4 leading-snug">
        {quiz.question}
      </p>

      {/* Options */}
      <div className="flex flex-col gap-2">
        {quiz.options.map((option, index) => {
          let buttonStyle = 'border-[var(--border)] bg-[var(--bg-card-alt)] text-[var(--text-secondary)] hover:border-brand-400 hover:bg-brand-50 dark:hover:bg-brand-900/20'

          if (hasAnswered) {
            if (index === quiz.correctIndex) {
              buttonStyle = 'border-gain bg-gain-light dark:bg-gain/10 text-gain-dark dark:text-gain'
            } else if (index === selectedIndex && !isCorrect) {
              buttonStyle = 'border-loss bg-loss-light dark:bg-loss/10 text-loss-dark dark:text-loss'
            } else {
              buttonStyle = 'border-[var(--border)] bg-[var(--bg-card-alt)] text-[var(--text-muted)] opacity-60'
            }
          }

          return (
            <button
              key={index}
              onClick={() => handleSelect(index)}
              disabled={hasAnswered}
              className={cn(
                'flex items-center gap-3 rounded-lg border px-4 py-3 text-left text-sm transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-brand-400 focus:ring-offset-2 disabled:cursor-default',
                buttonStyle
              )}
            >
              <span className="flex-shrink-0 h-5 w-5 rounded-full border border-current flex items-center justify-center text-xs font-bold">
                {OPTION_LABELS[index]}
              </span>
              <span>{option}</span>
            </button>
          )
        })}
      </div>

      {/* Feedback */}
      {hasAnswered && (
        <div
          className={cn(
            'mt-4 rounded-lg p-3 text-sm',
            isCorrect
              ? 'bg-gain-light dark:bg-gain/10 text-gain-dark dark:text-gain border border-gain/30'
              : 'bg-loss-light dark:bg-loss/10 text-loss-dark dark:text-loss border border-loss/30'
          )}
        >
          <p className="font-semibold mb-1">
            {isCorrect ? '✓ Correct!' : '✗ Not quite —'}
          </p>
          <p className="text-xs leading-relaxed opacity-90">{quiz.explanation}</p>
        </div>
      )}

      {/* Next lesson button */}
      {hasAnswered && (
        <button
          onClick={onComplete}
          className="mt-4 w-full rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-600 active:bg-brand-700 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-400 focus:ring-offset-2"
        >
          Next Lesson →
        </button>
      )}
    </div>
  )
}
