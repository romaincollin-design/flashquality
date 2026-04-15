'use client'
import { useMemo, useState } from 'react'
import { getJeuxMock } from '@/lib/jeux/mock'
import type { JeuConfig, QuizzQuestion, ReglesQuizz, ReglesSpin, ReglesTombola, SpinSegment } from '@/lib/jeux/types'

const A = '#7C5CFC', AD = '#5538D4'
const CARD: React.CSSProperties = { background: 'white', borderRadius: 16, border: '1.5px solid #E8E4DC', padding: 18 }
const IN: React.CSSProperties = { width: '100%', padding: '9px 12px', borderRadius: 10, border: '1.5px solid #E8E4DC', fontSize: 13, fontFamily: 'inherit', fontWeight: 700, color: '#1A1033', outline: 'none', boxSizing: 'border-box', background: 'white' }

type Pro = { id: string }

export default function ProJeux({ pro }: { pro: Pro }) {
  // V1 : mock. V2 : fetch jeux_config WHERE pro_id = pro.id ; save = upsert jeux_config.
  const initial = useMemo(() => getJeuxMock(pro.id), [pro.id])
  const [jeux, setJeux] = useState<JeuConfig[]>(initial)
  const [edit, setEdit] = useState<JeuConfig | null>(null)
  const [msg, setMsg] = useState('')

  function toggle(id: string) {
    setJeux(js => {
      const target = js.find(j => j.id === id)
      if (!target) return js
      if (!target.actif && target.jeu_type !== 'tombola') {
        // R\u00e8gle : 1 bonus max \u00e0 la fois
        return js.map(j => j.id === id ? { ...j, actif: true } : (j.jeu_type === 'tombola' ? j : { ...j, actif: false }))
      }
      return js.map(j => j.id === id ? { ...j, actif: !j.actif } : j)
    })
  }

  function saveEdit(next: JeuConfig) {
    setJeux(js => js.map(j => j.id === next.id ? next : j))
    setEdit(null)
    setMsg('\u2705 R\u00e8gles mises \u00e0 jour (non persist\u00e9 : table jeux_config \u00e0 cr\u00e9er)')
    setTimeout(() => setMsg(''), 3500)
  }

  return <>
    {msg && <div style={{ background: '#D1FAE5', border: '1.5px solid #10B981', color: '#065F46', padding: '10px 14px', borderRadius: 12, fontSize: 12, fontWeight: 800, marginBottom: 12 }}>{msg}</div>}
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(320px,1fr))', gap: 14 }}>
      {jeux.map(j => <div key={j.id} style={{ ...CARD, borderColor: j.actif ? A : '#E8E4DC', borderWidth: j.actif ? 2 : 1.5 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
          <div style={{ fontSize: 24 }}>{j.jeu_type === 'tombola' ? '\u{1F3AB}' : j.jeu_type === 'quizz' ? '\u{1F9E0}' : '\u{1F3AF}'}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 15, fontWeight: 900, color: '#1A1033', textTransform: 'capitalize' }}>{j.jeu_type}</div>
            <div style={{ fontSize: 11, color: '#6B6760', fontWeight: 700 }}>{describe(j)}</div>
          </div>
          <label style={{ position: 'relative', display: 'inline-block', width: 42, height: 24, cursor: 'pointer' }}>
            <input type="checkbox" checked={j.actif} onChange={() => toggle(j.id)} style={{ opacity: 0, width: 0, height: 0 }} />
            <span style={{ position: 'absolute', inset: 0, background: j.actif ? A : '#D0CEC9', borderRadius: 100, transition: '.2s' }}>
              <span style={{ position: 'absolute', top: 2, left: j.actif ? 20 : 2, width: 20, height: 20, background: 'white', borderRadius: '50%', transition: '.2s' }} />
            </span>
          </label>
        </div>
        <button onClick={() => setEdit(j)} style={{ width: '100%', background: '#F0EDE8', color: '#1A1033', border: 'none', borderRadius: 100, padding: '8px 14px', fontSize: 12, fontWeight: 900, cursor: 'pointer', fontFamily: 'inherit' }}>Configurer</button>
      </div>)}
    </div>

    {edit && <EditSheet jeu={edit} onClose={() => setEdit(null)} onSave={saveEdit} />}
  </>
}

function describe(j: JeuConfig): string {
  if (j.jeu_type === 'tombola') return j.regles.lot
  if (j.jeu_type === 'quizz') return `${j.regles.questions.length} questions \u00b7 ${j.regles.nb_par_session} par session`
  return `${j.regles.segments.length} segments pond\u00e9r\u00e9s`
}

function EditSheet({ jeu, onClose, onSave }: { jeu: JeuConfig; onClose: () => void; onSave: (j: JeuConfig) => void }) {
  const [draft, setDraft] = useState<JeuConfig>(JSON.parse(JSON.stringify(jeu)))

  return <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(26,16,51,.55)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
    <div onClick={e => e.stopPropagation()} style={{ background: 'white', borderRadius: 18, maxWidth: 640, width: '100%', maxHeight: '88vh', overflowY: 'auto', padding: 20 }}>
      <div style={{ fontSize: 11, fontWeight: 800, color: '#B0ADA8', textTransform: 'uppercase', letterSpacing: '.1em' }}>Configurer</div>
      <div style={{ fontSize: 20, fontWeight: 900, color: '#1A1033', marginTop: 2, marginBottom: 14, textTransform: 'capitalize' }}>{draft.jeu_type}</div>

      {draft.jeu_type === 'tombola' && <TombolaEdit r={draft.regles} onChange={r => setDraft({ ...draft, regles: r })} />}
      {draft.jeu_type === 'quizz' && <QuizzEdit r={draft.regles} onChange={r => setDraft({ ...draft, regles: r })} />}
      {draft.jeu_type === 'spin' && <SpinEdit r={draft.regles} onChange={r => setDraft({ ...draft, regles: r })} />}

      <div style={{ display: 'flex', gap: 8, marginTop: 18 }}>
        <button onClick={onClose} style={{ flex: 1, background: '#F0EDE8', color: '#1A1033', border: 'none', borderRadius: 100, padding: '11px 20px', fontSize: 13, fontWeight: 900, cursor: 'pointer', fontFamily: 'inherit' }}>Annuler</button>
        <button onClick={() => onSave(draft)} style={{ flex: 1, background: A, color: 'white', border: 'none', borderRadius: 100, padding: '11px 20px', fontSize: 13, fontWeight: 900, cursor: 'pointer', fontFamily: 'inherit', boxShadow: `0 3px 0 ${AD}` }}>Enregistrer</button>
      </div>
    </div>
  </div>
}

function TombolaEdit({ r, onChange }: { r: ReglesTombola; onChange: (r: ReglesTombola) => void }) {
  return <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
    <Field label="Lot"><input style={IN} value={r.lot} onChange={e => onChange({ ...r, lot: e.target.value })} /></Field>
    <Field label="Source des tickets">
      <select style={IN} value={r.ticket_source} onChange={e => onChange({ ...r, ticket_source: e.target.value as ReglesTombola['ticket_source'] })}>
        <option value="quizz_reussi">Quizz r\u00e9ussi (sans-faute)</option>
        <option value="toute_action">Toute action r\u00e9alis\u00e9e</option>
      </select>
    </Field>
    <Field label="Jour du tirage">
      <select style={IN} value={r.tirage_jour} onChange={e => onChange({ ...r, tirage_jour: e.target.value as ReglesTombola['tirage_jour'] })}>
        <option value="fin_mois">Fin de mois</option>
      </select>
    </Field>
  </div>
}

function QuizzEdit({ r, onChange }: { r: ReglesQuizz; onChange: (r: ReglesQuizz) => void }) {
  const updateQ = (i: number, patch: Partial<QuizzQuestion>) => onChange({ ...r, questions: r.questions.map((q, k) => k === i ? { ...q, ...patch } : q) })
  const addQ = () => onChange({ ...r, questions: [...r.questions, { q: '', choix: ['', '', ''], bonne: 0 }] })
  const removeQ = (i: number) => onChange({ ...r, questions: r.questions.filter((_, k) => k !== i) })

  return <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
      <Field label="Questions par session"><input type="number" min={1} style={IN} value={r.nb_par_session} onChange={e => onChange({ ...r, nb_par_session: parseInt(e.target.value, 10) || 1 })} /></Field>
      <Field label="XP r\u00e9ussite"><input type="number" min={0} style={IN} value={r.xp_reussite} onChange={e => onChange({ ...r, xp_reussite: parseInt(e.target.value, 10) || 0 })} /></Field>
    </div>
    <div style={{ fontSize: 11, fontWeight: 900, color: '#6B6760', textTransform: 'uppercase', letterSpacing: '.08em', marginTop: 6 }}>Banque de questions ({r.questions.length})</div>
    {r.questions.map((q, i) => <div key={i} style={{ background: '#FAFAF8', borderRadius: 12, padding: 12, border: '1px solid #F0EDE8' }}>
      <div style={{ display: 'flex', gap: 8, marginBottom: 6 }}>
        <input style={IN} placeholder="Question" value={q.q} onChange={e => updateQ(i, { q: e.target.value })} />
        <button onClick={() => removeQ(i)} style={{ background: '#FEE2E2', color: '#B91C1C', border: 'none', borderRadius: 10, padding: '0 12px', fontSize: 14, fontWeight: 900, cursor: 'pointer', fontFamily: 'inherit' }}>{'\u00d7'}</button>
      </div>
      {q.choix.map((c, k) => <div key={k} style={{ display: 'flex', gap: 6, marginBottom: 4 }}>
        <input style={{ ...IN, padding: '7px 11px' }} placeholder={`Choix ${k + 1}`} value={c} onChange={e => updateQ(i, { choix: q.choix.map((x, kk) => kk === k ? e.target.value : x) })} />
        <label style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 800, color: '#1A1033', cursor: 'pointer', padding: '0 8px' }}>
          <input type="radio" name={`bonne-${i}`} checked={q.bonne === k} onChange={() => updateQ(i, { bonne: k })} /> Bonne
        </label>
      </div>)}
    </div>)}
    <button onClick={addQ} style={{ background: 'transparent', color: A, border: `1.5px dashed ${A}`, borderRadius: 12, padding: '10px 14px', fontSize: 12, fontWeight: 900, cursor: 'pointer', fontFamily: 'inherit' }}>+ Ajouter une question</button>
  </div>
}

function SpinEdit({ r, onChange }: { r: ReglesSpin; onChange: (r: ReglesSpin) => void }) {
  const update = (i: number, patch: Partial<SpinSegment>) => onChange({ ...r, segments: r.segments.map((s, k) => k === i ? { ...s, ...patch } : s) })
  const addSeg = () => onChange({ ...r, segments: [...r.segments, { label: '', poids: 10, gain: '', color: '#7C5CFC' }] })
  const removeSeg = (i: number) => onChange({ ...r, segments: r.segments.filter((_, k) => k !== i) })
  return <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
    <Field label="Co\u00fbt XP par spin"><input type="number" min={0} style={IN} value={r.cout_xp} onChange={e => onChange({ ...r, cout_xp: parseInt(e.target.value, 10) || 0 })} /></Field>
    <div style={{ fontSize: 11, fontWeight: 900, color: '#6B6760', textTransform: 'uppercase', letterSpacing: '.08em' }}>Segments ({r.segments.length})</div>
    {r.segments.map((s, i) => <div key={i} style={{ display: 'grid', gridTemplateColumns: '1.5fr 2fr 70px 40px 30px', gap: 6, alignItems: 'center' }}>
      <input style={IN} placeholder="Label" value={s.label} onChange={e => update(i, { label: e.target.value })} />
      <input style={IN} placeholder="Gain" value={s.gain} onChange={e => update(i, { gain: e.target.value })} />
      <input type="number" min={1} style={IN} value={s.poids} onChange={e => update(i, { poids: parseInt(e.target.value, 10) || 1 })} />
      <input type="color" style={{ width: 40, height: 34, border: 'none', padding: 0, background: 'transparent', cursor: 'pointer' }} value={s.color} onChange={e => update(i, { color: e.target.value })} />
      <button onClick={() => removeSeg(i)} style={{ background: '#FEE2E2', color: '#B91C1C', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 900, cursor: 'pointer', fontFamily: 'inherit', height: 34 }}>{'\u00d7'}</button>
    </div>)}
    <button onClick={addSeg} style={{ background: 'transparent', color: A, border: `1.5px dashed ${A}`, borderRadius: 12, padding: '10px 14px', fontSize: 12, fontWeight: 900, cursor: 'pointer', fontFamily: 'inherit' }}>+ Ajouter un segment</button>
  </div>
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label style={{ display: 'block' }}>
    <div style={{ fontSize: 10, fontWeight: 900, color: '#6B6760', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 4 }}>{label}</div>
    {children}
  </label>
}
