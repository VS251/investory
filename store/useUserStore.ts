import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Goal, RiskTolerance, ExperienceLevel } from '@/types'

interface UserOnboardingAnswers {
  name: string
  goal: Goal | null
  riskTolerance: RiskTolerance | null
  experienceLevel: ExperienceLevel | null
}

interface UserStore extends UserOnboardingAnswers {
  hasCompletedOnboarding: boolean
  setOnboardingAnswers: (answers: Partial<UserOnboardingAnswers>) => void
  completeOnboarding: () => void
  resetUser: () => void
}

const DEFAULT_STATE: UserOnboardingAnswers & { hasCompletedOnboarding: boolean } = {
  name: '',
  goal: null,
  riskTolerance: null,
  experienceLevel: null,
  hasCompletedOnboarding: false,
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      ...DEFAULT_STATE,
      setOnboardingAnswers: (answers) => set((state) => ({ ...state, ...answers })),
      completeOnboarding: () => set({ hasCompletedOnboarding: true }),
      resetUser: () => set(DEFAULT_STATE),
    }),
    { name: 'investory_user' }
  )
)
