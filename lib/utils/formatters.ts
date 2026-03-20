// Format a number as Indian Rupee with comma grouping
export function formatCurrency(value: number, compact = false): string {
  if (compact) {
    if (value >= 1_00_00_000) return `₹${(value / 1_00_00_000).toFixed(2)}Cr`
    if (value >= 1_00_000) return `₹${(value / 1_00_000).toFixed(2)}L`
    if (value >= 1_000) return `₹${(value / 1_000).toFixed(1)}K`
  }
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

// Format a percentage with sign and 2 decimal places
export function formatPercent(value: number, includeSign = true): string {
  const sign = includeSign && value > 0 ? '+' : ''
  return `${sign}${value.toFixed(2)}%`
}

// Format a large number with Indian number system (lakh, crore)
export function formatIndianNumber(value: number): string {
  return new Intl.NumberFormat('en-IN').format(Math.round(value))
}

// Format a timestamp to readable date
export function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export function formatTime(timestamp: number): string {
  return new Date(timestamp).toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function formatDateTime(timestamp: number): string {
  return `${formatDate(timestamp)}, ${formatTime(timestamp)}`
}
