export type JeuType = 'tombola' | 'quizz' | 'spin'

export type ReglesTombola = {
  ticket_source: 'quizz_reussi' | 'toute_action'
  tirage_jour: 'fin_mois'
  lot: string
}

export type QuizzQuestion = { q: string; choix: string[]; bonne: number }

export type ReglesQuizz = {
  questions: QuizzQuestion[]
  nb_par_session: number
  xp_reussite: number
}

export type SpinSegment = { label: string; poids: number; gain: string; color: string }

export type ReglesSpin = {
  segments: SpinSegment[]
  cout_xp: number
}

export type JeuConfig =
  | { id: string; pro_id: string; jeu_type: 'tombola'; actif: boolean; regles: ReglesTombola }
  | { id: string; pro_id: string; jeu_type: 'quizz'; actif: boolean; regles: ReglesQuizz }
  | { id: string; pro_id: string; jeu_type: 'spin'; actif: boolean; regles: ReglesSpin }

export const isReglesQuizz = (j: JeuConfig): j is Extract<JeuConfig, { jeu_type: 'quizz' }> => j.jeu_type === 'quizz'
export const isReglesSpin = (j: JeuConfig): j is Extract<JeuConfig, { jeu_type: 'spin' }> => j.jeu_type === 'spin'
export const isReglesTombola = (j: JeuConfig): j is Extract<JeuConfig, { jeu_type: 'tombola' }> => j.jeu_type === 'tombola'
