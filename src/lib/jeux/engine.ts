import type { JeuConfig, QuizzQuestion, ReglesSpin, SpinSegment } from './types'

// Garantit : tombola toujours en t\u00eate si active, + 1 bonus max (quizz ou spin).
export function selectActifs(configs: JeuConfig[]): JeuConfig[] {
  const actifs = configs.filter(c => c.actif)
  const tombola = actifs.find(c => c.jeu_type === 'tombola')
  const bonus = actifs.find(c => c.jeu_type === 'quizz' || c.jeu_type === 'spin')
  const out: JeuConfig[] = []
  if (tombola) out.push(tombola)
  if (bonus) out.push(bonus)
  return out
}

export function tirerQuestionsQuizz(questions: QuizzQuestion[], n: number): QuizzQuestion[] {
  const copy = [...questions]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy.slice(0, Math.max(1, Math.min(n, copy.length)))
}

// Tirage pond\u00e9r\u00e9. Renvoie l'index du segment et le segment.
export function tirerSpin(regles: ReglesSpin): { index: number; segment: SpinSegment } {
  const total = regles.segments.reduce((s, x) => s + x.poids, 0)
  let r = Math.random() * total
  for (let i = 0; i < regles.segments.length; i++) {
    r -= regles.segments[i].poids
    if (r <= 0) return { index: i, segment: regles.segments[i] }
  }
  const last = regles.segments.length - 1
  return { index: last, segment: regles.segments[last] }
}

// Cl\u00e9 mensuelle pour les tickets tombola (tirage fin de mois).
export function tombolaMonthKey(): string {
  const d = new Date()
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0')
}

export function tombolaStorageKey(clientId: string, proId: string): string {
  return `fq_tombola_tickets_${clientId}_${proId}_${tombolaMonthKey()}`
}

export function readTombolaTickets(clientId: string, proId: string): number {
  try {
    const v = localStorage.getItem(tombolaStorageKey(clientId, proId))
    return v ? parseInt(v, 10) || 0 : 0
  } catch { return 0 }
}

export function addTombolaTicket(clientId: string, proId: string, n = 1): number {
  const cur = readTombolaTickets(clientId, proId)
  const next = cur + n
  try { localStorage.setItem(tombolaStorageKey(clientId, proId), String(next)) } catch {}
  return next
}
