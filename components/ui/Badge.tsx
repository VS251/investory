import { HTMLAttributes } from 'react'
import { cn } from '@/lib/utils/cn'

type BadgeVariant = 'default' | 'success' | 'danger' | 'warning' | 'info' | 'beginner' | 'intermediate' | 'advanced' | 'positive'

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant
  size?: 'sm' | 'md'
}

const variantClasses: Record<BadgeVariant, string> = {
  default: 'bg-[var(--bg-card-alt)] text-[var(--text-secondary)]',
  success: 'bg-gain-light text-gain-dark dark:bg-gain/20 dark:text-gain',
  danger: 'bg-loss-light text-loss-dark dark:bg-loss/20 dark:text-loss',
  warning: 'bg-caution-light text-caution-dark dark:bg-caution/20 dark:text-caution',
  info: 'bg-brand-50 text-brand-700 dark:bg-brand-900 dark:text-brand-200',
  beginner: 'bg-gain-light text-gain-dark dark:bg-gain/20 dark:text-gain',
  intermediate: 'bg-caution-light text-caution-dark dark:bg-caution/20 dark:text-caution',
  advanced: 'bg-loss-light text-loss-dark dark:bg-loss/20 dark:text-loss',
  positive: 'bg-gain-light text-gain-dark dark:bg-gain/20 dark:text-gain',
}

const sizeClasses = {
  sm: 'text-xs px-2 py-0.5 rounded-md font-medium',
  md: 'text-xs px-2.5 py-1 rounded-lg font-medium',
}

export function Badge({ variant = 'default', size = 'md', className, children, ...props }: BadgeProps) {
  return (
    <span
      className={cn('inline-flex items-center gap-1 whitespace-nowrap', variantClasses[variant], sizeClasses[size], className)}
      {...props}
    >
      {children}
    </span>
  )
}
