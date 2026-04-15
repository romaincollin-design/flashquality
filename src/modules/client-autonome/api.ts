import type { Abonnement, AbonnementInput, Depense, DepenseInput, Lead, LeadInput } from './types'

export interface ClientAutonomeAPI {
  listDepenses(clientId: string): Promise<Depense[]>
  addDepense(clientId: string, input: DepenseInput): Promise<Depense>
  deleteDepense(clientId: string, id: string): Promise<void>

  listAbonnements(clientId: string): Promise<Abonnement[]>
  addAbonnement(clientId: string, input: AbonnementInput): Promise<Abonnement>
  updateAbonnement(clientId: string, id: string, patch: Partial<AbonnementInput>): Promise<Abonnement>
  deleteAbonnement(clientId: string, id: string): Promise<void>

  listLeads(clientId: string): Promise<Lead[]>
  createLead(clientId: string, input: LeadInput): Promise<Lead>
}
