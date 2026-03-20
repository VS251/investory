'use client'

import Link from 'next/link'
import { useProgressStore } from '@/store/useProgressStore'
import { Badge } from '@/components/ui/Badge'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { cn } from '@/lib/utils/cn'
import type { Course, Difficulty } from '@/types'

interface CourseCardProps {
  course: Course
}

function difficultyVariant(difficulty: Difficulty): 'beginner' | 'intermediate' | 'advanced' {
  return difficulty
}

function ctaLabel(progress: number, total: number): string {
  if (progress === 0) return 'Start'
  if (progress === total) return 'Review'
  return 'Continue'
}

export function CourseCard({ course }: CourseCardProps) {
  const getCourseProgress = useProgressStore((s) => s.getCourseProgress)
  const completedLessons = useProgressStore((s) => s.completedLessons)

  const completedCount = (completedLessons[course.slug] ?? []).length
  const totalLessons = course.lessons.length
  const progressPct = getCourseProgress(course.slug, totalLessons)
  const hasStarted = completedCount > 0
  const isComplete = completedCount >= totalLessons

  const label = ctaLabel(completedCount, totalLessons)

  return (
    <Link href={`/learn/${course.slug}`} className="block group focus:outline-none">
      <div
        className={cn(
          'rounded-card border border-[var(--border)] bg-[var(--bg-card)] p-5 shadow-card',
          'transition-shadow duration-200 group-hover:shadow-card-hover',
          'focus-within:ring-2 focus-within:ring-brand-400 focus-within:ring-offset-2'
        )}
      >
        {/* Icon + badge row */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <span className="text-3xl leading-none">{course.icon}</span>
          <Badge variant={difficultyVariant(course.difficulty)}>
            {course.difficulty.charAt(0).toUpperCase() + course.difficulty.slice(1)}
          </Badge>
        </div>

        {/* Title + description */}
        <h3 className="font-bold text-[var(--text-primary)] text-base leading-snug mb-1">
          {course.title}
        </h3>
        <p className="text-xs text-[var(--text-muted)] leading-relaxed line-clamp-2 mb-3">
          {course.description}
        </p>

        {/* Meta: lessons + time */}
        <p className="text-xs text-[var(--text-secondary)] mb-3">
          {totalLessons} lesson{totalLessons !== 1 ? 's' : ''} &middot; ~{course.estimatedMinutes} min
        </p>

        {/* Progress bar — only if started */}
        {hasStarted && (
          <div className="mb-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-[var(--text-muted)]">
                {completedCount} / {totalLessons} completed
              </span>
              <span className="text-xs font-medium text-[var(--text-secondary)]">{progressPct}%</span>
            </div>
            <ProgressBar
              value={progressPct}
              size="sm"
              color={isComplete ? 'gain' : 'brand'}
            />
          </div>
        )}

        {/* CTA button */}
        <div
          className={cn(
            'mt-auto inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors',
            isComplete
              ? 'bg-[var(--bg-card-alt)] text-[var(--text-secondary)]'
              : hasStarted
              ? 'bg-brand-500 text-white group-hover:bg-brand-600'
              : 'bg-brand-500 text-white group-hover:bg-brand-600'
          )}
        >
          {label} {!isComplete && '→'}
        </div>
      </div>
    </Link>
  )
}
