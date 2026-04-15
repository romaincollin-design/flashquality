import type { Categorie } from '../types'

export const CATEGORIES: { id: Categorie; label: string; icon: string; color: string; bg: string }[] = [
  { id: 'resto',     label: 'Resto',     icon: '\u{1F37D}\uFE0F', color: '#7C5CFC', bg: '#EDE8FF' },
  { id: 'courses',   label: 'Courses',   icon: '\u{1F6D2}',       color: '#10B981', bg: '#D1FAE5' },
  { id: 'transport', label: 'Transport', icon: '\u{1F68C}',       color: '#3B82F6', bg: '#DBEAFE' },
  { id: 'essence',   label: 'Essence',   icon: '\u26FD',          color: '#DC2626', bg: '#FEE2E2' },
  { id: 'loisir',    label: 'Loisir',    icon: '\u{1F3AC}',       color: '#EC4899', bg: '#FCE7F3' },
  { id: 'sante',     label: 'Sant\u00e9',icon: '\u{1F489}',       color: '#06B6D4', bg: '#CFFAFE' },
  { id: 'maison',    label: 'Maison',    icon: '\u{1F3E0}',       color: '#F59E0B', bg: '#FEF3C7' },
  { id: 'autre',     label: 'Autre',     icon: '\u{1F4CC}',       color: '#6B7280', bg: '#F3F4F6' },
]

export const CAT_MAP: Record<Categorie, (typeof CATEGORIES)[number]> =
  CATEGORIES.reduce((acc, c) => { acc[c.id] = c; return acc }, {} as Record<Categorie, (typeof CATEGORIES)[number]>)
