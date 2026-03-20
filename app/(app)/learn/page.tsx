'use client'

import Link from 'next/link'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { CourseCard } from '@/components/learn/CourseCard'
import { getCourses } from '@/lib/data/courses'
import { useProgressStore } from '@/store/useProgressStore'
import type { Course } from '@/types'

function findFirstIncompleteLesson(
  courses: Course[],
  completedLessons: Record<string, string[]>
): { course: Course; lessonTitle: string; lessonHref: string } | null {
  for (const course of courses) {
    const done = completedLessons[course.slug] ?? []
    const firstIncomplete = course.lessons.find((l) => !done.includes(l.id))
    if (firstIncomplete) {
      return {
        course,
        lessonTitle: firstIncomplete.title,
        lessonHref: `/learn/${course.slug}`,
      }
    }
  }
  return null
}

export default function LearnPage() {
  const courses = getCourses()
  const completedLessons = useProgressStore((s) => s.completedLessons)
  const currentStreak = useProgressStore((s) => s.currentStreak)

  const firstIncomplete = findFirstIncompleteLesson(courses, completedLessons)

  const allLessonsTotal = courses.reduce((sum, c) => sum + c.lessons.length, 0)
  const allLessonsDone = Object.values(completedLessons).reduce(
    (sum, ids) => sum + ids.length,
    0
  )
  const everythingComplete = allLessonsDone >= allLessonsTotal && allLessonsTotal > 0

  return (
    <PageWrapper title="Learning Hub">
      {/* Streak */}
      {currentStreak > 0 && (
        <div className="mb-4 flex items-center gap-1.5 text-sm font-medium text-caution">
          <span>🔥</span>
          <span>{currentStreak} day streak — keep it going!</span>
        </div>
      )}

      {/* Featured banner */}
      <div className="mb-6 rounded-card border border-[var(--border)] bg-[var(--bg-card)] p-4 shadow-card">
        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)] mb-1">
          Today&apos;s Lesson
        </p>
        {everythingComplete ? (
          <p className="text-sm font-semibold text-gain">
            You&apos;ve completed all lessons! 🎉
          </p>
        ) : firstIncomplete ? (
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <p className="text-xs text-[var(--text-muted)]">{firstIncomplete.course.title}</p>
              <p className="font-semibold text-[var(--text-primary)] text-sm">
                {firstIncomplete.lessonTitle}
              </p>
            </div>
            <Link
              href={firstIncomplete.lessonHref}
              className="inline-flex items-center gap-1 rounded-lg bg-brand-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-brand-600 transition-colors whitespace-nowrap"
            >
              Continue →
            </Link>
          </div>
        ) : (
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm text-[var(--text-secondary)]">Ready to start learning?</p>
            <Link
              href={`/learn/${courses[0]?.slug}`}
              className="inline-flex items-center gap-1 rounded-lg bg-brand-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-brand-600 transition-colors"
            >
              Begin →
            </Link>
          </div>
        )}
      </div>

      {/* Course grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {courses.map((course) => (
          <CourseCard key={course.slug} course={course} />
        ))}
      </div>
    </PageWrapper>
  )
}
