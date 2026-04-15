export type Bucket = { label: string; value: number; color?: string }

export function byKey<T>(items: T[], key: (x: T) => string): Record<string, number> {
  const m: Record<string, number> = {}
  for (const it of items) { const k = key(it) || 'Autre'; m[k] = (m[k] || 0) + 1 }
  return m
}

export function sumKey<T>(items: T[], key: (x: T) => string, val: (x: T) => number): Record<string, number> {
  const m: Record<string, number> = {}
  for (const it of items) { const k = key(it) || 'Autre'; m[k] = (m[k] || 0) + val(it) }
  return m
}

export function toBuckets(m: Record<string, number>, colors?: string[]): Bucket[] {
  const entries = Object.entries(m).sort((a, b) => b[1] - a[1])
  return entries.map(([label, value], i) => ({ label, value, color: colors?.[i % (colors?.length || 1)] }))
}

export function topN(buckets: Bucket[], n: number): Bucket[] {
  return buckets.slice(0, n)
}

export function bucketAge(age: number): string {
  if (age < 26) return '18-25'
  if (age < 36) return '26-35'
  if (age < 51) return '36-50'
  return '50+'
}

export function bucketFrequence(nbVisites: number): string {
  if (nbVisites <= 1) return '1 visite'
  if (nbVisites <= 5) return '2-5 visites'
  return '5+ visites'
}

export function bucketBudget(montant: number): string {
  if (montant < 20) return '< 20\u20AC'
  if (montant < 50) return '20-50\u20AC'
  if (montant < 100) return '50-100\u20AC'
  return '100\u20AC+'
}

export function monthBucket(iso: string): string {
  return iso.slice(0, 7)
}
