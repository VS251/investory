import { cn } from '@/lib/utils/cn'

interface ProgressBarProps {
  value: number // 0-100
  className?: string
  color?: 'brand' | 'gain' | 'caution'
  size?: 'sm' | 'md'
  showLabel?: boolean
}

const colorClasses = {
  brand: 'bg-brand-500',
  gain: 'bg-gain',
  caution: 'bg-caution',
}

const sizeClasses = {
  sm: 'h-1.5',
  md: 'h-2.5',
}

export function ProgressBar({ value, className, color = 'brand', size = 'md', showLabel }: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(100, value))
  return (
    <div className={cn('w-full', className)}>
      <div className={cn('w-full rounded-full bg-[var(--bg-card-alt)]', sizeClasses[size])}>
        <div
          className={cn('h-full rounded-full transition-all duration-500', colorClasses[color])}
          style={{ width: `${clamped}%` }}
        />
      </div>
      {showLabel && (
        <span className="mt-1 block text-xs text-[var(--text-muted)]">{Math.round(clamped)}%</span>
      )}
    </div>
  )
}
