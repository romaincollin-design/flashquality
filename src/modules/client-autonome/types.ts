export type Categorie =
  | 'resto' | 'courses' | 'transport' | 'essence'
  | 'loisir' | 'sante' | 'maison' | 'autre'

export type Frequence = 'mensuel' | 'annuel' | 'hebdo' | 'ponctuel'

export type Depense = {
  id: string
  client_id: string
  montant: number
  categorie: Categorie
  libelle: string
  date: string            // ISO yyyy-mm-dd
  ticket_url?: string | null
  lieu?: string | null
  lat?: number | null
  lng?: number | null
  created_at: string
}

export type Abonnement = {
  id: string
  client_id: string
  nom: string
  montant: number
  frequence: Frequence
  date_debut: string       // ISO yyyy-mm-dd
  date_fin: string         // ISO yyyy-mm-dd
  conditions_resiliation: string
  categorie: Categorie
  actif: boolean
  created_at: string
}

export type Proposition = {
  titre: string
  detail: string
  montant_estime: number
}

export type Lead = {
  id: string
  client_id: string
  pro_id: string | null
  abonnement_id: string | null
  propositions: Proposition[]
  statut: 'envoye' | 'vu' | 'accepte' | 'refuse'
  created_at: string
}

export type DepenseInput = Omit<Depense, 'id' | 'client_id' | 'created_at'>
export type AbonnementInput = Omit<Abonnement, 'id' | 'client_id' | 'created_at'>
export type LeadInput = Omit<Lead, 'id' | 'client_id' | 'created_at' | 'statut'>
