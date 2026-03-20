import Link from 'next/link'

interface TryInSimulatorCTAProps {
  message: string
  href: string
}

export function TryInSimulatorCTA({ message, href }: TryInSimulatorCTAProps) {
  return (
    <div className="rounded-card border-2 border-gain/40 bg-gain-light dark:bg-gain/10 p-5">
      <div className="flex items-start gap-3">
        <span className="text-2xl flex-shrink-0">🧪</span>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gain-dark dark:text-gain mb-3 leading-snug">
            {message}
          </p>
          <Link
            href={href}
            className="inline-flex items-center gap-1.5 rounded-lg bg-gain px-4 py-2 text-sm font-semibold text-white hover:bg-gain-dark transition-colors focus:outline-none focus:ring-2 focus:ring-gain focus:ring-offset-2"
          >
            Try it in Simulator →
          </Link>
        </div>
      </div>
    </div>
  )
}
