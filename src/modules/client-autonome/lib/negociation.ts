import type { Abonnement, Proposition } from '../types'

export function genererPropositions(abo: Abonnement): Proposition[] {
  const m = abo.montant
  return [
    {
      titre: 'R\u00e9duction 10%',
      detail: `Demander \u00e0 baisser ${abo.nom} de 10% au renouvellement.`,
      montant_estime: +(m * 0.9).toFixed(2),
    },
    {
      titre: 'M\u00eame prix + 2 mois offerts',
      detail: `Garder ${m.toFixed(2)}\u20AC mais n\u00e9gocier 2 mois gratuits.`,
      montant_estime: +((m * 12) / 14 * (abo.frequence === 'annuel' ? 12 : 1)).toFixed(2),
    },
    {
      titre: 'Offre concurrente -15%',
      detail: `Basculer chez un concurrent \u00e0 -15% sur ${abo.nom}.`,
      montant_estime: +(m * 0.85).toFixed(2),
    },
  ]
}

export type OffreConcurrente = { nom: string; prix: number; detail: string }

export function meilleuresOffresMock(abo: Abonnement): OffreConcurrente[] {
  const m = abo.montant
  return [
    { nom: 'Concurrent A', prix: +(m * 0.82).toFixed(2), detail: 'Sans engagement \u00b7 r\u00e9siliation libre' },
    { nom: 'Concurrent B', prix: +(m * 0.88).toFixed(2), detail: '3 mois offerts la 1\u00e8re ann\u00e9e' },
    { nom: 'Concurrent C', prix: +(m * 0.95).toFixed(2), detail: 'Service premium inclus' },
  ]
}
