'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useProgressStore } from '@/store/useProgressStore'
import { getCourse } from '@/lib/data/courses'
import { LessonContent } from '@/components/learn/LessonContent'
import { QuizBlock } from '@/components/learn/QuizBlock'
import { TryInSimulatorCTA } from '@/components/learn/TryInSimulatorCTA'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { cn } from '@/lib/utils/cn'

interface PageProps {
  params: { slug: string }
}

export default function CoursePage({ params }: PageProps) {
  const course = getCourse(params.slug)

  const markLessonComplete = useProgressStore((s) => s.markLessonComplete)
  const isLessonComplete = useProgressStore((s) => s.isLessonComplete)
  const getCourseProgress = useProgressStore((s) => s.getCourseProgress)

  const [activeLessonIndex, setActiveLessonIndex] = useState(0)
  const [showCompletion, setShowCompletion] = useState(false)

  if (!course) {
    return (
      <div className="flex min-h-screen items-center justify-center p-8 text-center">
        <div>
          <p className="text-4xl mb-3">🔍</p>
          <h1 className="text-lg font-bold text-[var(--text-primary)] mb-1">Course not found</h1>
          <p className="text-sm text-[var(--text-muted)] mb-4">
            The course you&apos;re looking for doesn&apos;t exist.
          </p>
          <Link
            href="/learn"
            className="text-sm font-medium text-brand-500 hover:underline"
          >
            ← Back to Learning Hub
          </Link>
        </div>
      </div>
    )
  }

  const totalLessons = course.lessons.length
  const progressPct = getCourseProgress(course.slug, totalLessons)
  const activeLesson = course.lessons[activeLessonIndex]

  function handleQuizComplete() {
    if (!activeLesson) return
    markLessonComplete(course!.slug, activeLesson.id)

    if (activeLessonIndex < totalLessons - 1) {
      setActiveLessonIndex((i) => i + 1)
    } else {
      setShowCompletion(true)
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-[var(--bg-page)]">
      {/* Progress bar at top */}
      <div className="sticky top-0 z-30 bg-[var(--bg-card)] border-b border-[var(--border)]">
        <ProgressBar value={progressPct} size="sm" color="brand" className="rounded-none" />
        <div className="mx-auto max-w-5xl px-4 py-3 flex items-center justify-between gap-4">
          <Link
            href="/learn"
            className="text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors flex items-center gap-1"
          >
            ← Learning Hub
          </Link>
          <span className="text-xs text-[var(--text-muted)]">
            {getCourseProgress(course.slug, totalLessons)}% complete
          </span>
        </div>
      </div>

      <div className="mx-auto max-w-5xl w-full px-4 py-6 flex flex-col lg:flex-row gap-6 flex-1">
        {/* Sidebar — lesson list */}
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <div className="sticky top-20 rounded-card border border-[var(--border)] bg-[var(--bg-card)] shadow-card overflow-hidden">
            <div className="px-4 py-3 border-b border-[var(--border)]">
              <p className="text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)] mb-0.5">
                Course
              </p>
              <h2 className="text-sm font-bold text-[var(--text-primary)] leading-snug">
                {course.title}
              </h2>
            </div>
            <nav className="py-2">
              {course.lessons.map((lesson, index) => {
                const done = isLessonComplete(course.slug, lesson.id)
                const isActive = index === activeLessonIndex && !showCompletion

                return (
                  <button
                    key={lesson.id}
                    onClick={() => {
                      setActiveLessonIndex(index)
                      setShowCompletion(false)
                    }}
                    className={cn(
                      'w-full flex items-start gap-2.5 px-4 py-2.5 text-left transition-colors text-sm',
                      isActive
                        ? 'bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-300 font-medium'
                        : 'text-[var(--text-secondary)] hover:bg-[var(--bg-card-alt)] hover:text-[var(--text-primary)]'
                    )}
                  >
                    <span
                      className={cn(
                        'flex-shrink-0 mt-0.5 h-4 w-4 rounded-full border text-xs flex items-center justify-center',
                        done
                          ? 'bg-gain border-gain text-white'
                          : isActive
                          ? 'border-brand-500'
                          : 'border-[var(--border)]'
                      )}
                    >
                      {done && '✓'}
                    </span>
                    <span className="leading-snug text-xs">{lesson.title}</span>
                  </button>
                )
              })}
            </nav>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 min-w-0">
          {showCompletion ? (
            <div className="rounded-card border border-gain/40 bg-gain-light dark:bg-gain/10 p-8 text-center shadow-card">
              <p className="text-5xl mb-4">🎉</p>
              <h2 className="text-xl font-bold text-gain-dark dark:text-gain mb-2">
                Course Complete!
              </h2>
              <p className="text-sm text-gain-dark dark:text-gain/80 mb-6">
                You&apos;ve finished <strong>{course.title}</strong>. Great work!
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href="/learn"
                  className="rounded-lg border border-[var(--border)] bg-[var(--bg-card)] px-4 py-2.5 text-sm font-medium text-[var(--text-primary)] hover:bg-[var(--bg-card-alt)] transition-colors"
                >
                  ← Back to Courses
                </Link>
                <Link
                  href="/simulator"
                  className="rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-600 transition-colors"
                >
                  Practice in Simulator →
                </Link>
              </div>
            </div>
          ) : activeLesson ? (
            <div className="flex flex-col gap-6">
              {/* Lesson header */}
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs text-[var(--text-muted)]">
                    Lesson {activeLessonIndex + 1} of {totalLessons}
                  </span>
                  <span className="text-xs text-[var(--text-muted)]">·</span>
                  <span className="text-xs text-[var(--text-muted)]">
                    {activeLesson.readingTime} min read
                  </span>
                </div>
                <h1 className="text-xl font-bold text-[var(--text-primary)]">
                  {activeLesson.title}
                </h1>
              </div>

              {/* Lesson content blocks */}
              <LessonContent blocks={activeLesson.content} />

              {/* Quiz */}
              <QuizBlock
                key={activeLesson.id}
                quiz={activeLesson.quiz}
                lessonId={activeLesson.id}
                courseSlug={course.slug}
                onComplete={handleQuizComplete}
              />

              {/* Simulator CTA */}
              {activeLesson.simulatorLink && (
                <TryInSimulatorCTA
                  message={activeLesson.simulatorLink.message}
                  href="/simulator"
                />
              )}

              {/* Mobile lesson switcher */}
              <div className="lg:hidden rounded-card border border-[var(--border)] bg-[var(--bg-card)] p-4 shadow-card">
                <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wide mb-3">
                  Lessons
                </p>
                <div className="flex flex-col gap-1">
                  {course.lessons.map((lesson, index) => {
                    const done = isLessonComplete(course.slug, lesson.id)
                    const isActive = index === activeLessonIndex
                    return (
                      <button
                        key={lesson.id}
                        onClick={() => {
                          setActiveLessonIndex(index)
                          setShowCompletion(false)
                        }}
                        className={cn(
                          'flex items-center gap-2 rounded-lg px-3 py-2 text-left text-xs transition-colors',
                          isActive
                            ? 'bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-300 font-medium'
                            : 'text-[var(--text-secondary)] hover:bg-[var(--bg-card-alt)]'
                        )}
                      >
                        <span
                          className={cn(
                            'flex-shrink-0 h-4 w-4 rounded-full border text-xs flex items-center justify-center',
                            done ? 'bg-gain border-gain text-white' : 'border-[var(--border)]'
                          )}
                        >
                          {done && '✓'}
                        </span>
                        {lesson.title}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          ) : null}
        </main>
      </div>
    </div>
  )
}
