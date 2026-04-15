import type { Abonnement } from '../types'

export type AlertNiveau = 'j7' | 'j30' | 'ok'

export function joursAvantFin(dateFin: string): number {
  const now = new Date(); now.setHours(0, 0, 0, 0)
  const fin = new Date(dateFin); fin.setHours(0, 0, 0, 0)
  return Math.round((fin.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
}

export function niveauAlerte(dateFin: string): AlertNiveau {
  const j = joursAvantFin(dateFin)
  if (j <= 7) return 'j7'
  if (j <= 30) return 'j30'
  return 'ok'
}

export function alertesActives(abos: Abonnement[]): Abonnement[] {
  return abos.filter(a => a.actif && niveauAlerte(a.date_fin) !== 'ok')
}

export function couleurNiveau(n: AlertNiveau): string {
  return n === 'j7' ? '#DC2626' : n === 'j30' ? '#F59E0B' : '#10B981'
}

export function labelNiveau(dateFin: string): string {
  const j = joursAvantFin(dateFin)
  if (j < 0) return `\u00c9chu il y a ${-j}j`
  if (j === 0) return 'Aujourd\u2019hui'
  return `J-${j}`
}
