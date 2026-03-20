'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Navbar } from '@/components/layout/Navbar'
import { Sidebar } from '@/components/layout/Sidebar'
import { BottomNav } from '@/components/layout/BottomNav'
import { useUserStore } from '@/store/useUserStore'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { hasCompletedOnboarding } = useUserStore()
  const router = useRouter()

  useEffect(() => {
    if (!hasCompletedOnboarding) {
      router.replace('/onboarding')
    }
  }, [hasCompletedOnboarding, router])

  if (!hasCompletedOnboarding) return null

  return (
    <div className="flex min-h-screen flex-col bg-[var(--bg-page)]">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <div className="flex-1 overflow-auto">{children}</div>
      </div>
      <BottomNav />
    </div>
  )
}
