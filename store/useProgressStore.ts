import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface ProgressStore {
  completedLessons: Record<string, string[]> // courseSlug → lessonIds
  quizScores: Record<string, number> // lessonId → score (0 or 100)
  lastLessonDate: string | null
  currentStreak: number

  markLessonComplete: (courseSlug: string, lessonId: string) => void
  recordQuizScore: (lessonId: string, score: number) => void
  getCourseProgress: (courseSlug: string, totalLessons: number) => number
  isLessonComplete: (courseSlug: string, lessonId: string) => boolean
  resetProgress: () => void
}

const DEFAULT_STATE = {
  completedLessons: {} as Record<string, string[]>,
  quizScores: {} as Record<string, number>,
  lastLessonDate: null as string | null,
  currentStreak: 0,
}

export const useProgressStore = create<ProgressStore>()(
  persist(
    (set, get) => ({
      ...DEFAULT_STATE,

      markLessonComplete: (courseSlug, lessonId) => {
        // Use local calendar date (en-CA gives YYYY-MM-DD in local time zone)
        const today = new Date().toLocaleDateString('en-CA')
        const yesterdayDate = new Date()
        yesterdayDate.setDate(yesterdayDate.getDate() - 1)
        const yesterday = yesterdayDate.toLocaleDateString('en-CA')

        set((state) => {
          const existing = state.completedLessons[courseSlug] ?? []
          if (existing.includes(lessonId)) return state

          const lastDate = state.lastLessonDate

          let newStreak: number
          if (!lastDate) {
            // First lesson ever
            newStreak = 1
          } else if (lastDate === today) {
            // Another lesson on the same day — streak doesn't change
            newStreak = state.currentStreak
          } else if (lastDate === yesterday) {
            // Lesson on the next consecutive calendar day — increment
            newStreak = state.currentStreak + 1
          } else {
            // Gap of 2+ days — reset
            newStreak = 1
          }

          return {
            completedLessons: {
              ...state.completedLessons,
              [courseSlug]: [...existing, lessonId],
            },
            lastLessonDate: today,
            currentStreak: newStreak,
          }
        })
      },

      recordQuizScore: (lessonId, score) => {
        set((state) => ({
          quizScores: { ...state.quizScores, [lessonId]: score },
        }))
      },

      getCourseProgress: (courseSlug, totalLessons) => {
        if (totalLessons === 0) return 0
        const done = (get().completedLessons[courseSlug] ?? []).length
        return Math.round((done / totalLessons) * 100)
      },

      isLessonComplete: (courseSlug, lessonId) => {
        return (get().completedLessons[courseSlug] ?? []).includes(lessonId)
      },

      resetProgress: () => set(DEFAULT_STATE),
    }),
    { name: 'investory_progress' }
  )
)
