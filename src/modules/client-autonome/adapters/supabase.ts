import type { ClientAutonomeAPI } from '../api'

// Stub : sera impl\u00e9ment\u00e9 apr\u00e8s cr\u00e9ation des tables depenses/abonnements/leads.
// Signatures identiques \u00e0 LocalStorageAdapter pour permettre un switch sans refactor.
export const SupabaseAdapter: ClientAutonomeAPI = {
  async listDepenses() { throw new Error('SupabaseAdapter not implemented') },
  async addDepense() { throw new Error('SupabaseAdapter not implemented') },
  async deleteDepense() { throw new Error('SupabaseAdapter not implemented') },
  async listAbonnements() { throw new Error('SupabaseAdapter not implemented') },
  async addAbonnement() { throw new Error('SupabaseAdapter not implemented') },
  async updateAbonnement() { throw new Error('SupabaseAdapter not implemented') },
  async deleteAbonnement() { throw new Error('SupabaseAdapter not implemented') },
  async listLeads() { throw new Error('SupabaseAdapter not implemented') },
  async createLead() { throw new Error('SupabaseAdapter not implemented') },
}
