import type { ClientAutonomeAPI } from '../api'
import type { Abonnement, AbonnementInput, Depense, DepenseInput, Lead, LeadInput } from '../types'

const uid = () => (typeof crypto !== 'undefined' && crypto.randomUUID) ? crypto.randomUUID() : String(Date.now()) + Math.random().toString(36).slice(2)
const now = () => new Date().toISOString()

const kDep = (cid: string) => `fq_ca_depenses_${cid}`
const kAbo = (cid: string) => `fq_ca_abonnements_${cid}`
const kLead = (cid: string) => `fq_ca_leads_${cid}`

function readJSON<T>(key: string): T[] {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) as T[] : [] } catch { return [] }
}
function writeJSON<T>(key: string, arr: T[]): void {
  try { localStorage.setItem(key, JSON.stringify(arr)) } catch {}
}

export const LocalStorageAdapter: ClientAutonomeAPI = {
  async listDepenses(cid) {
    return readJSON<Depense>(kDep(cid)).sort((a, b) => b.date.localeCompare(a.date))
  },
  async addDepense(cid, input) {
    const d: Depense = { ...input, id: uid(), client_id: cid, created_at: now() }
    const list = readJSON<Depense>(kDep(cid)); list.push(d); writeJSON(kDep(cid), list)
    return d
  },
  async deleteDepense(cid, id) {
    writeJSON(kDep(cid), readJSON<Depense>(kDep(cid)).filter(d => d.id !== id))
  },

  async listAbonnements(cid) {
    return readJSON<Abonnement>(kAbo(cid)).sort((a, b) => a.date_fin.localeCompare(b.date_fin))
  },
  async addAbonnement(cid, input) {
    const a: Abonnement = { ...input, id: uid(), client_id: cid, created_at: now() }
    const list = readJSON<Abonnement>(kAbo(cid)); list.push(a); writeJSON(kAbo(cid), list)
    return a
  },
  async updateAbonnement(cid, id, patch) {
    const list = readJSON<Abonnement>(kAbo(cid))
    const i = list.findIndex(a => a.id === id)
    if (i < 0) throw new Error('Abonnement introuvable')
    list[i] = { ...list[i], ...patch }
    writeJSON(kAbo(cid), list)
    return list[i]
  },
  async deleteAbonnement(cid, id) {
    writeJSON(kAbo(cid), readJSON<Abonnement>(kAbo(cid)).filter(a => a.id !== id))
  },

  async listLeads(cid) {
    return readJSON<Lead>(kLead(cid)).sort((a, b) => b.created_at.localeCompare(a.created_at))
  },
  async createLead(cid, input) {
    const l: Lead = { ...input, id: uid(), client_id: cid, statut: 'envoye', created_at: now() }
    const list = readJSON<Lead>(kLead(cid)); list.push(l); writeJSON(kLead(cid), list)
    return l
  },
}

export function getClientAutonomeAPI(): ClientAutonomeAPI {
  // V1 : local. V2 : switch sur un SupabaseAdapter selon ENV.
  return LocalStorageAdapter
}
