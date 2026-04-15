// Mock data pour le dashboard admin.
// Sera remplac\u00e9 par des fetch Supabase : clients, depenses, xp_events, reviews par pro_id.

export type MockClient = {
  id: string; pro_id: string; prenom: string; email: string
  ville: string; tranche: '18-25' | '26-35' | '36-50' | '50+'
  visites: number; inscrit_le: string
}

export type MockDepense = {
  id: string; pro_id: string; client_id: string
  montant: number; categorie: string; date: string; lieu: string
}

export type MockReview = { id: string; pro_id: string; rating: number; created_at: string }
export type MockXp = { id: string; pro_id: string; client_id: string; action: string; xp: number; created_at: string }

export type MockPro = { id: string; slug: string; nom: string; categorie: string; ville: string; actif: boolean }

export type StatsData = {
  pros: MockPro[]
  clients: MockClient[]
  depenses: MockDepense[]
  reviews: MockReview[]
  xp: MockXp[]
}

const VILLES = ['Nice', 'Grasse', 'Cannes', 'Antibes', 'Monaco', 'Menton']
const CATS = ['resto', 'courses', 'transport', 'loisir', 'maison', 'sante']
const TRANCHES: MockClient['tranche'][] = ['18-25', '26-35', '36-50', '50+']

function pick<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)] }
function rint(a: number, b: number) { return a + Math.floor(Math.random() * (b - a + 1)) }

export function getStatsMock(): StatsData {
  const pros: MockPro[] = [
    { id: 'p1', slug: 'boulangerie-martin', nom: 'Boulangerie Martin', categorie: 'Boulangerie', ville: 'Nice', actif: true },
    { id: 'p2', slug: 'trattoria-bella', nom: 'Trattoria Bella', categorie: 'Restaurant', ville: 'Nice', actif: true },
    { id: 'p3', slug: 'plomberie-carrel', nom: 'Plomberie Carrel', categorie: 'Artisan', ville: 'Grasse', actif: true },
    { id: 'p4', slug: 'studio-coiff', nom: 'Studio Coiff', categorie: 'Coiffeur', ville: 'Cannes', actif: true },
    { id: 'p5', slug: 'garage-azur', nom: 'Garage Azur', categorie: 'Artisan', ville: 'Antibes', actif: false },
  ]

  const clients: MockClient[] = []
  const depenses: MockDepense[] = []
  const reviews: MockReview[] = []
  const xp: MockXp[] = []

  pros.forEach(p => {
    const nbClients = rint(12, 48)
    for (let i = 0; i < nbClients; i++) {
      const cid = `${p.id}_c${i}`
      const month = rint(1, 12)
      clients.push({
        id: cid, pro_id: p.id,
        prenom: 'Client' + i, email: `c${i}@mail.fr`,
        ville: pick(VILLES), tranche: pick(TRANCHES),
        visites: rint(1, 9),
        inscrit_le: `2026-${String(month).padStart(2, '0')}-${String(rint(1, 28)).padStart(2, '0')}`,
      })
      const nbDep = rint(1, 6)
      for (let j = 0; j < nbDep; j++) {
        depenses.push({
          id: `${cid}_d${j}`, pro_id: p.id, client_id: cid,
          montant: +(Math.random() * 120 + 8).toFixed(2),
          categorie: pick(CATS), date: `2026-04-${String(rint(1, 15)).padStart(2, '0')}`,
          lieu: pick(VILLES),
        })
      }
      if (Math.random() > 0.4) {
        reviews.push({ id: `${cid}_r`, pro_id: p.id, rating: rint(3, 5), created_at: '2026-04-10' })
      }
      for (let k = 0; k < rint(1, 4); k++) {
        xp.push({ id: `${cid}_x${k}`, pro_id: p.id, client_id: cid, action: pick(['avis', 'partage', 'quizz']), xp: pick([5, 10, 15]), created_at: '2026-04-10' })
      }
    }
  })

  return { pros, clients, depenses, reviews, xp }
}
