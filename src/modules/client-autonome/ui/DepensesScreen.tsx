'use client'
import { useMemo, useState } from 'react'
import { useDepenses } from '../hooks/useDepenses'
import { CATEGORIES, CAT_MAP } from '../lib/categories'
import type { Categorie, DepenseInput } from '../types'

const A = '#7C5CFC', AD = '#5538D4', AL = '#EDE8FF', RC = 22
const CARD: React.CSSProperties = { background: 'white', borderRadius: RC, border: '2.5px solid #F0EDE8', boxSizing: 'border-box' }
const IN: React.CSSProperties = { width: '100%', padding: '11px 13px', borderRadius: 12, border: '2px solid #F0EDE8', fontSize: 14, fontFamily: 'inherit', fontWeight: 700, color: '#1A1033', outline: 'none', boxSizing: 'border-box', background: 'white' }

function monthKey() { const d = new Date(); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') }

export default function DepensesScreen({ clientId, onBack }: { clientId: string; onBack: () => void }) {
  const { depenses, add, remove } = useDepenses(clientId)
  const [showForm, setShowForm] = useState(false)
  const [ocrBusy, setOcrBusy] = useState(false)
  const [libelle, setLibelle] = useState('')
  const [montant, setMontant] = useState('')
  const [cat, setCat] = useState<Categorie>('resto')
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10))
  const [lieu, setLieu] = useState('')
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null)
  const [err, setErr] = useState('')

  const mois = monthKey()
  const dMois = useMemo(() => depenses.filter(d => d.date.slice(0, 7) === mois), [depenses, mois])
  const total = useMemo(() => dMois.reduce((s, d) => s + d.montant, 0), [dMois])
  const parCat = useMemo(() => {
    const m: Record<string, number> = {}
    dMois.forEach(d => { m[d.categorie] = (m[d.categorie] || 0) + d.montant })
    return m
  }, [dMois])

  function simulerOcr() {
    setOcrBusy(true)
    setTimeout(() => {
      setLibelle('Ticket import\u00e9')
      setMontant((Math.random() * 60 + 10).toFixed(2))
      setCat('courses')
      setOcrBusy(false)
      setShowForm(true)
    }, 1200)
  }

  function demanderGeo() {
    if (!navigator.geolocation) { setErr('G\u00e9oloc non dispo'); return }
    navigator.geolocation.getCurrentPosition(
      p => setCoords({ lat: p.coords.latitude, lng: p.coords.longitude }),
      () => setErr('G\u00e9oloc refus\u00e9e')
    )
  }

  async function submit() {
    setErr('')
    const m = parseFloat(montant.replace(',', '.'))
    if (!libelle.trim()) return setErr('Libell\u00e9 requis')
    if (!isFinite(m) || m <= 0) return setErr('Montant invalide')
    const input: DepenseInput = {
      libelle: libelle.trim(), montant: +m.toFixed(2), categorie: cat, date,
      lieu: lieu || null, lat: coords?.lat ?? null, lng: coords?.lng ?? null, ticket_url: null,
    }
    await add(input)
    setLibelle(''); setMontant(''); setLieu(''); setCoords(null); setShowForm(false)
  }

  return <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
    <div style={{ padding: '12px 14px 8px', display: 'flex', alignItems: 'center', gap: 10, background: 'white', borderBottom: '2px solid #F0EDE8' }}>
      <button onClick={onBack} style={{ width: 36, height: 36, borderRadius: '50%', background: '#F0EDE8', border: 'none', cursor: 'pointer', fontSize: 18, fontFamily: 'inherit' }}>{'\u2190'}</button>
      <span style={{ fontSize: 16, fontWeight: 900, color: '#1A1033', flex: 1 }}>D\u00e9penses</span>
      <button onClick={() => setShowForm(s => !s)} style={{ background: A, color: 'white', border: 'none', borderRadius: 100, padding: '7px 14px', fontSize: 12, fontWeight: 900, cursor: 'pointer', fontFamily: 'inherit' }}>{showForm ? 'Fermer' : '+ Ajouter'}</button>
    </div>
    <div style={{ flex: 1, overflowY: 'auto', padding: '12px 13px 16px' }}>
      <div style={{ ...CARD, padding: 16, marginBottom: 10, background: `linear-gradient(135deg,${A},${AD})`, color: 'white', border: 'none' }}>
        <div style={{ fontSize: 11, fontWeight: 800, color: 'rgba(255,255,255,.75)', textTransform: 'uppercase', letterSpacing: '.1em' }}>Total {mois}</div>
        <div style={{ fontSize: 28, fontWeight: 900, marginTop: 4, fontFamily: "'Fredoka',sans-serif" }}>{total.toFixed(2)} \u20AC</div>
        <div style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,.8)', marginTop: 2 }}>{dMois.length} d\u00e9pense{dMois.length > 1 ? 's' : ''} ce mois</div>
      </div>

      {!showForm && <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 10 }}>
        <button onClick={simulerOcr} disabled={ocrBusy} style={{ ...CARD, padding: 12, cursor: 'pointer', textAlign: 'left', border: `2.5px solid ${A}` }}>
          <div style={{ fontSize: 22, marginBottom: 4 }}>{'\u{1F4F8}'}</div>
          <div style={{ fontSize: 13, fontWeight: 900, color: A }}>{ocrBusy ? 'Lecture...' : 'Photo ticket'}</div>
          <div style={{ fontSize: 11, color: '#B0ADA8', fontWeight: 700 }}>OCR auto</div>
        </button>
        <button onClick={() => setShowForm(true)} style={{ ...CARD, padding: 12, cursor: 'pointer', textAlign: 'left' }}>
          <div style={{ fontSize: 22, marginBottom: 4 }}>{'\u270F\uFE0F'}</div>
          <div style={{ fontSize: 13, fontWeight: 900, color: '#1A1033' }}>Saisie manuelle</div>
          <div style={{ fontSize: 11, color: '#B0ADA8', fontWeight: 700 }}>Rapide</div>
        </button>
      </div>}

      {showForm && <div style={{ ...CARD, padding: 14, marginBottom: 12, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <input style={IN} placeholder="Libell\u00e9 (ex: Trattoria)" value={libelle} onChange={e => setLibelle(e.target.value)} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          <input style={IN} placeholder="Montant \u20AC" inputMode="decimal" value={montant} onChange={e => setMontant(e.target.value)} />
          <input type="date" style={IN} value={date} onChange={e => setDate(e.target.value)} />
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
        <input style={IN} placeholder="Lieu (optionnel)" value={lieu} onChange={e => setLieu(e.target.value)} />
        <button type="button" onClick={demanderGeo} style={{ background: coords ? '#D1FAE5' : '#F0EDE8', color: coords ? '#065F46' : '#6B6760', border: 'none', borderRadius: 12, padding: '10px 14px', fontSize: 12, fontWeight: 800, cursor: 'pointer', fontFamily: 'inherit' }}>
          {coords ? `\u{1F4CD} ${coords.lat.toFixed(3)}, ${coords.lng.toFixed(3)}` : '\u{1F4CD} Ajouter ma position'}
        </button>
        {err && <div style={{ background: '#FEE2E2', color: '#B91C1C', padding: '8px 12px', borderRadius: 10, fontSize: 12, fontWeight: 800 }}>{err}</div>}
        <button onClick={submit} style={{ background: A, color: 'white', border: 'none', borderRadius: 100, padding: '12px 20px', fontSize: 14, fontWeight: 900, cursor: 'pointer', fontFamily: 'inherit', boxShadow: `0 4px 0 ${AD}` }}>Enregistrer</button>
      </div>}

      {total > 0 && <div style={{ ...CARD, padding: 14, marginBottom: 10 }}>
        <div style={{ fontSize: 11, fontWeight: 900, color: '#B0ADA8', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 10 }}>Par cat\u00e9gorie</div>
        {Object.entries(parCat).sort((a, b) => b[1] - a[1]).map(([id, v]) => {
          const c = CAT_MAP[id as Categorie]; const pct = (v / total) * 100
          return <div key={id} style={{ marginBottom: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 800, color: '#1A1033', marginBottom: 3 }}>
              <span>{c.icon} {c.label}</span><span>{v.toFixed(2)} \u20AC</span>
            </div>
            <div style={{ background: '#F0EDE8', borderRadius: 100, height: 6, overflow: 'hidden' }}>
              <div style={{ height: '100%', background: c.color, width: pct + '%', borderRadius: 100 }} />
            </div>
          </div>
        })}
      </div>}

      <div style={{ fontSize: 11, fontWeight: 900, color: '#B0ADA8', textTransform: 'uppercase', letterSpacing: '.08em', margin: '10px 2px 8px' }}>Historique</div>
      {depenses.length === 0 && <div style={{ ...CARD, padding: 20, textAlign: 'center', color: '#B0ADA8', fontWeight: 700, fontSize: 13 }}>Aucune d\u00e9pense enregistr\u00e9e</div>}
      {depenses.map(d => {
        const c = CAT_MAP[d.categorie]
        return <div key={d.id} style={{ ...CARD, display: 'flex', alignItems: 'center', gap: 10, padding: '11px 12px', marginBottom: 8 }}>
          <div style={{ width: 38, height: 38, borderRadius: 12, background: c.bg, color: c.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>{c.icon}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 900, color: '#1A1033', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{d.libelle}</div>
            <div style={{ fontSize: 11, color: '#B0ADA8', fontWeight: 700 }}>{c.label} \u00b7 {d.date}{d.lieu ? ' \u00b7 ' + d.lieu : ''}</div>
          </div>
          <div style={{ fontSize: 14, fontWeight: 900, color: '#1A1033' }}>{d.montant.toFixed(2)} \u20AC</div>
          <button onClick={() => remove(d.id)} style={{ background: 'none', border: 'none', color: '#B0ADA8', fontSize: 18, cursor: 'pointer', fontFamily: 'inherit' }}>{'\u00d7'}</button>
        </div>
      })}
    </div>
  </div>
}
