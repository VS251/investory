'use client'

import Link from 'next/link'
import { useProgressStore } from '@/store/useProgressStore'
import { getCourses } from '@/lib/data/courses'
import { ProgressBar } from '@/components/ui/ProgressBar'
import type { Course } from '@/types'

function findFirstIncompleteLesson(
  courses: Course[],
  completedLessons: Record<string, string[]>
): { course: Course; lessonTitle: string; lessonIndex: number } | null {
  for (const course of courses) {
    const done = completedLessons[course.slug] ?? []
    const index = course.lessons.findIndex((l) => !done.includes(l.id))
    if (index !== -1) {
      return {
        course,
        lessonTitle: course.lessons[index].title,
        lessonIndex: index,
      }
    }
  }
  return null
}

export function DailyLessonWidget() {
  const completedLessons = useProgressStore((s) => s.completedLessons)
  const getCourseProgress = useProgressStore((s) => s.getCourseProgress)

  const courses = getCourses()
  const totalLessons = courses.reduce((sum, c) => sum + c.lessons.length, 0)
  const totalDone = Object.values(completedLessons).reduce((sum, ids) => sum + ids.length, 0)
  const noneStarted = totalDone === 0
  const allDone = totalDone >= totalLessons && totalLessons > 0

  const firstIncomplete = allDone ? null : findFirstIncompleteLesson(courses, completedLessons)

  // All done
  if (allDone) {
    return (
      <div className="rounded-card border border-gain/40 bg-gain-light dark:bg-gain/10 p-5 shadow-card">
        <p className="text-2xl mb-2">🎉</p>
        <h3 className="font-bold text-gain-dark dark:text-gain mb-1">All lessons completed!</h3>
        <p className="text-xs text-gain-dark dark:text-gain/80">
          You&apos;ve finished every lesson. Keep practising in the simulator.
        </p>
      </div>
    )
  }

  // Nothing started yet
  if (noneStarted) {
    return (
      <div className="rounded-card border border-[var(--border)] bg-[var(--bg-card)] p-5 shadow-card">
        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)] mb-2">
          Continue Learning
        </p>
        <h3 className="font-bold text-[var(--text-primary)] mb-1">Start your first lesson</h3>
        <p className="text-xs text-[var(--text-muted)] mb-4">
          Explore structured courses from the basics to advanced investing.
        </p>
        <Link
          href="/learn"
          className="inline-flex items-center gap-1 rounded-lg bg-brand-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-brand-600 transition-colors"
        >
          Begin →
        </Link>
      </div>
    )
  }

  // In progress
  if (!firstIncomplete) return null

  const { course, lessonTitle } = firstIncomplete
  const progressPct = getCourseProgress(course.slug, course.lessons.length)

  return (
    <div className="rounded-card border border-[var(--border)] bg-[var(--bg-card)] p-5 shadow-card">
      <p className="text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)] mb-2">
        Continue Learning
      </p>
      <p className="text-xs text-[var(--text-muted)] mb-0.5">{course.title}</p>
      <h3 className="font-semibold text-[var(--text-primary)] text-sm mb-3 leading-snug">
        {lessonTitle}
      </h3>

      <div className="mb-3">
        <div className="flex items-center justify-between text-xs text-[var(--text-muted)] mb-1">
          <span>Course progress</span>
          <span>{progressPct}%</span>
        </div>
        <ProgressBar value={progressPct} size="sm" color="brand" />
      </div>

      <Link
        href={`/learn/${course.slug}`}
        className="inline-flex items-center gap-1 rounded-lg bg-brand-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-brand-600 transition-colors"
      >
        Continue →
      </Link>
    </div>
  )
}
