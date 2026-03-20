import { HTMLAttributes } from 'react'
import { cn } from '@/lib/utils/cn'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean
  padding?: 'sm' | 'md' | 'lg' | 'none'
}

const paddingClasses = {
  sm: 'p-3',
  md: 'p-5',
  lg: 'p-6',
  none: '',
}

export function Card({ hover, padding = 'md', className, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-card border border-[var(--border)] bg-[var(--bg-card)] shadow-card',
        paddingClasses[padding],
        hover && 'transition-shadow duration-200 hover:shadow-card-hover cursor-pointer',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
