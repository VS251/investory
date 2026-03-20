import type { LessonContentBlock } from '@/types'

interface LessonContentProps {
  blocks: LessonContentBlock[]
}

export function LessonContent({ blocks }: LessonContentProps) {
  return (
    <div className="flex flex-col gap-4">
      {blocks.map((block, index) => {
        switch (block.type) {
          case 'paragraph':
            return (
              <p
                key={index}
                className="text-sm leading-relaxed text-[var(--text-secondary)]"
              >
                {block.text}
              </p>
            )

          case 'heading':
            return (
              <h3
                key={index}
                className="text-base font-bold text-[var(--text-primary)] mt-2"
              >
                {block.text}
              </h3>
            )

          case 'callout':
            return (
              <div
                key={index}
                className="flex gap-3 rounded-lg border-l-4 border-brand-400 bg-brand-50 dark:bg-brand-900/20 px-4 py-3"
              >
                <span className="text-lg leading-snug flex-shrink-0">📌</span>
                <p className="text-sm leading-relaxed text-brand-700 dark:text-brand-300">
                  {block.text}
                </p>
              </div>
            )

          case 'example':
            return (
              <div
                key={index}
                className="flex gap-3 rounded-lg border border-gain/30 bg-gain-light dark:bg-gain/10 px-4 py-3"
              >
                <span className="text-lg leading-snug flex-shrink-0">💡</span>
                <div>
                  <p className="text-xs font-semibold text-gain-dark dark:text-gain uppercase tracking-wide mb-1">
                    Example
                  </p>
                  <p className="text-sm leading-relaxed text-gain-dark dark:text-gain/90">
                    {block.text}
                  </p>
                </div>
              </div>
            )

          default:
            return null
        }
      })}
    </div>
  )
}
