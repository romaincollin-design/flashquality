'use client'
import { useState } from 'react'
import { useAbonnements } from '../hooks/useAbonnements'
import { CATEGORIES, CAT_MAP } from '../lib/categories'
import { couleurNiveau, labelNiveau, niveauAlerte } from '../lib/alertes'
import type { AbonnementInput, Categorie, Frequence, Abonnement } from '../types'
import NegociationSheet from './NegociationSheet'

const A = '#7C5CFC', AD = '#5538D4', RC = 22
const CARD: React.CSSProperties = { background: 'white', borderRadius: RC, border: '2.5px solid #F0EDE8', boxSizing: 'border-box' }
const IN: React.CSSProperties = { width: '100%', padding: '11px 13px', borderRadius: 12, border: '2px solid #F0EDE8', fontSize: 14, fontFamily: 'inherit', fontWeight: 700, color: '#1A1033', outline: 'none', boxSizing: 'border-box', background: 'white' }

const FREQ: { id: Frequence; label: string }[] = [
  { id: 'mensuel', label: 'Mensuel' }, { id: 'annuel', label: 'Annuel' },
  { id: 'hebdo', label: 'Hebdo' }, { id: 'ponctuel', label: 'Ponctuel' },
]

export default function AbonnementsScreen({ clientId, onBack }: { clientId: string; onBack: () => void }) {
  const { abonnements, add, remove } = useAbonnements(clientId)
  const [showForm, setShowForm] = useState(false)
  const [negoFor, setNegoFor] = useState<Abonnement | null>(null)

  const [nom, setNom] = useState(''); const [montant, setMontant] = useState('')
  const [freq, setFreq] = useState<Frequence>('mensuel')
  const [dDebut, setDDebut] = useState(new Date().toISOString().slice(0, 10))
  const [dFin, setDFin] = useState('')
  const [cond, setCond] = useState('')
  const [cat, setCat] = useState<Categorie>('maison')
  const [err, setErr] = useState('')

  async function submit() {
    setErr('')
    const m = parseFloat(montant.replace(',', '.'))
    if (!nom.trim()) return setErr('Nom requis')
    if (!isFinite(m) || m <= 0) return setErr('Montant invalide')
    if (!dFin) return setErr('Date de fin requise')
    const input: AbonnementInput = {
      nom: nom.trim(), montant: +m.toFixed(2), frequence: freq,
      date_debut: dDebut, date_fin: dFin,
      conditions_resiliation: cond, categorie: cat, actif: true,
    }
    await add(input)
    setNom(''); setMontant(''); setDFin(''); setCond(''); setShowForm(false)
  }

  return <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
    <div style={{ padding: '12px 14px 8px', display: 'flex', alignItems: 'center', gap: 10, background: 'white', borderBottom: '2px solid #F0EDE8' }}>
      <button onClick={onBack} style={{ width: 36, height: 36, borderRadius: '50%', background: '#F0EDE8', border: 'none', cursor: 'pointer', fontSize: 18, fontFamily: 'inherit' }}>{'\u2190'}</button>
      <span style={{ fontSize: 16, fontWeight: 900, color: '#1A1033', flex: 1 }}>Contrats &amp; abonnements</span>
      <button onClick={() => setShowForm(s => !s)} style={{ background: A, color: 'white', border: 'none', borderRadius: 100, padding: '7px 14px', fontSize: 12, fontWeight: 900, cursor: 'pointer', fontFamily: 'inherit' }}>{showForm ? 'Fermer' : '+ Ajouter'}</button>
    </div>
    <div style={{ flex: 1, overflowY: 'auto', padding: '12px 13px 16px' }}>
      {showForm && <div style={{ ...CARD, padding: 14, marginBottom: 12, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <input style={IN} placeholder="Nom (ex: Assurance AXA)" value={nom} onChange={e => setNom(e.target.value)} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          <input style={IN} placeholder="Montant \u20AC" inputMode="decimal" value={montant} onChange={e => setMontant(e.target.value)} />
          <select style={IN} value={freq} onChange={e => setFreq(e.target.value as Frequence)}>
            {FREQ.map(f => <option key={f.id} value={f.id}>{f.label}</option>)}
          </select>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          <input type="date" style={IN} value={dDebut} onChange={e => setDDebut(e.target.value)} />
          <input type="date" style={IN} value={dFin} onChange={e => setDFin(e.target.value)} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 6 }}>
          {CATEGORIES.map(c => {
            const on = cat === c.id
            return <button key={c.id} type="button" onClick={() => setCat(c.id)} style={{ padding: '8px 4px', borderRadius: 12, border: `2px solid ${on ? c.color : '#F0EDE8'}`, background: on ? c.bg : 'white', cursor: 'pointer', fontFamily: 'inherit', textAlign: 'center', boxSizing: 'border-box' }}>
              <div style={{ fontSize: 18 }}>{c.icon}</div>
              <div style={{ fontSize: 9, fontWeight: 800, color: on ? c.color : '#6B6760', marginTop: 2 }}>{c.label}</div>
            </button>
          })}
        </div>
        <textarea style={{ ...IN, resize: 'none', fontFamily: 'inherit' }} rows={2} placeholder="Conditions de r\u00e9siliation" value={cond} onChange={e => setCond(e.target.value)} />
        {err && <div style={{ background: '#FEE2E2', color: '#B91C1C', padding: '8px 12px', borderRadius: 10, fontSize: 12, fontWeight: 800 }}>{err}</div>}
        <button onClick={submit} style={{ background: A, color: 'white', border: 'none', borderRadius: 100, padding: '12px 20px', fontSize: 14, fontWeight: 900, cursor: 'pointer', fontFamily: 'inherit', boxShadow: `0 4px 0 ${AD}` }}>Enregistrer</button>
      </div>}

      {abonnements.length === 0 && !showForm && <div style={{ ...CARD, padding: 20, textAlign: 'center', color: '#B0ADA8', fontWeight: 700, fontSize: 13 }}>Aucun abonnement. Ajoute ton premier contrat !</div>}

      {abonnements.map(a => {
        const n = niveauAlerte(a.date_fin)
        const col = couleurNiveau(n)
        const c = CAT_MAP[a.categorie]
        return <div key={a.id} style={{ ...CARD, padding: 12, marginBottom: 9, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 42, height: 42, borderRadius: 12, background: c.bg, color: c.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>{c.icon}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 900, color: '#1A1033' }}>{a.nom}</div>
              <div style={{ fontSize: 11, color: '#B0ADA8', fontWeight: 700, marginTop: 2 }}>{a.montant.toFixed(2)} \u20AC \u00b7 {a.frequence} \u00b7 fin {a.date_fin}</div>
            </div>
            <div style={{ background: col, color: 'white', fontSize: 11, fontWeight: 900, padding: '4px 10px', borderRadius: 100 }}>{labelNiveau(a.date_fin)}</div>
          </div>
          {n !== 'ok' && <div style={{ background: col + '1A', borderRadius: 10, padding: '8px 10px', fontSize: 11, fontWeight: 800, color: col }}>
            {n === 'j7' ? '\u26A0\uFE0F \u00c9ch\u00e9ance imminente' : '\u{1F4C5} \u00c9ch\u00e9ance dans le mois'}
            {a.conditions_resiliation && <span style={{ color: '#6B6760', fontWeight: 700 }}> \u00b7 {a.conditions_resiliation}</span>}
          </div>}
          <div style={{ display: 'flex', gap: 6 }}>
            <button onClick={() => setNegoFor(a)} style={{ flex: 1, background: A, color: 'white', border: 'none', borderRadius: 100, padding: '9px 14px', fontSize: 12, fontWeight: 900, cursor: 'pointer', fontFamily: 'inherit' }}>{'\u{1F4AC}'} N\u00e9gocier</button>
            <button onClick={() => remove(a.id)} style={{ background: '#F0EDE8', color: '#6B6760', border: 'none', borderRadius: 100, padding: '9px 14px', fontSize: 12, fontWeight: 900, cursor: 'pointer', fontFamily: 'inherit' }}>Supprimer</button>
          </div>
        </div>
      })}
    </div>

    {negoFor && <NegociationSheet clientId={clientId} abonnement={negoFor} onClose={() => setNegoFor(null)} />}
  </div>
}
