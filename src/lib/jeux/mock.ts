import type { JeuConfig } from './types'

// TEMPORAIRE : sera remplacé par un fetch `jeux_config` Supabase.
// La structure imite exactement la future table (regles jsonb par jeu_type).
export function getJeuxMock(proId: string | undefined): JeuConfig[] {
  const pid = proId || 'mock-pro'
  return [
    {
      id: 'mock-tombola-' + pid,
      pro_id: pid,
      jeu_type: 'tombola',
      actif: true,
      regles: {
        ticket_source: 'quizz_reussi',
        tirage_jour: 'fin_mois',
        lot: 'Un bon de 50\u20AC \u00e0 d\u00e9penser en boutique',
      },
    },
    {
      id: 'mock-quizz-' + pid,
      pro_id: pid,
      jeu_type: 'quizz',
      actif: true,
      regles: {
        nb_par_session: 3,
        xp_reussite: 15,
        questions: [
          { q: 'Quelle est notre sp\u00e9cialit\u00e9 maison ?', choix: ['Pain au levain', 'Bagel', 'Brioche industrielle'], bonne: 0 },
          { q: 'Nos croissants sont cuits combien de fois par jour ?', choix: ['1 fois', '2 fois', '3 fois'], bonne: 2 },
          { q: 'Quelle farine utilisons-nous ?', choix: ['Importation', 'Locale bio', 'Au hasard'], bonne: 1 },
          { q: 'Quel jour est-on ferm\u00e9 ?', choix: ['Lundi', 'Mardi', 'Jamais'], bonne: 0 },
          { q: 'De quelle r\u00e9gion vient notre farine ?', choix: ['Provence', 'Bretagne', 'Italie'], bonne: 0 },
        ],
      },
    },
    // Alternative (inactif V1) : pour activer le spin \u00e0 la place du quizz, passer quizz.actif=false et spin.actif=true
    {
      id: 'mock-spin-' + pid,
      pro_id: pid,
      jeu_type: 'spin',
      actif: false,
      regles: {
        cout_xp: 0,
        segments: [
          { label: '5%',     poids: 30, gain: 'Bon -5%',         color: '#7C5CFC' },
          { label: 'Caf\u00e9',  poids: 20, gain: 'Caf\u00e9 offert',    color: '#F59E0B' },
          { label: 'Rien',   poids: 25, gain: 'Prochaine fois !', color: '#9CA3AF' },
          { label: '10%',    poids: 15, gain: 'Bon -10%',        color: '#10B981' },
          { label: 'Croiss.',poids: 8,  gain: 'Croissant offert', color: '#EC4899' },
          { label: 'Jackpot',poids: 2,  gain: 'Menu complet',    color: '#DC2626' },
        ],
      },
    },
  ]
}
