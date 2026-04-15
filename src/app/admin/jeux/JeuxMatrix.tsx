'use client'
import Link from 'next/link'
import { useMemo, useState } from 'react'
import { getJeuxMock } from '@/lib/jeux/mock'
import type { JeuConfig, JeuType } from '@/lib/jeux/types'

const A = '#7C5CFC'

type Pro = { id: string; slug: string; nom: string }

type Row = { pro: Pro; tombola: boolean; quizz: boolean; spin: boolean }

export default function JeuxMatrix({ pros }: { pros: Pro[] }) {
  const initial = useMemo<Row[]>(() => pros.map(p => {
    const js = getJeuxMock(p.id)
    const get = (t: JeuType) => js.find(j => j.jeu_type === t)?.actif ?? false
    return { pro: p, tombola: get('tombola'), quizz: get('quizz'), spin: get('spin') }
  }), [pros])
  const [rows, setRows] = useState<Row[]>(initial)

  function toggle(proId: string, col: JeuType) {
    setRows(rs => rs.map(r => {
      if (r.pro.id !== proId) return r
      if (col === 'tombola') return { ...r, tombola: !r.tombola }
      // R\u00e8gle : 1 bonus max \u00e0 la fois
      if (col === 'quizz') return { ...r, quizz: !r.quizz, spin: r.quizz ? r.spin : false }
      return { ...r, spin: !r.spin, quizz: r.spin ? r.quizz : false }
    }))
  }

  return <div style={{ padding: '24px 24px 40px', maxWidth: 1100 }}>
    <div style={{ marginBottom: 18 }}>
      <div style={{ fontSize: 11, fontWeight: 800, color: '#6B6760', textTransform: 'uppercase', letterSpacing: '.1em' }}>Admin</div>
      <div style={{ fontSize: 26, fontWeight: 900, color: '#1A1033', marginTop: 2 }}>Jeux \u00b7 vue matricielle</div>
      <div style={{ fontSize: 12, color: '#6B6760', fontWeight: 700, marginTop: 4 }}>Toggle rapide. Config d\u00e9taill\u00e9e : cliquer sur le pro.</div>
    </div>

    <div style={{ background: 'white', borderRadius: 16, border: '1.5px solid #E8E4DC', overflow: 'hidden' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 90px 90px 90px 140px', padding: '12px 18px', background: '#F0EDE8', fontSize: 11, fontWeight: 900, color: '#6B6760', textTransform: 'uppercase', letterSpacing: '.08em' }}>
        <div>Pro</div>
        <div style={{ textAlign: 'center' }}>Tombola</div>
        <div style={{ textAlign: 'center' }}>Quizz</div>
        <div style={{ textAlign: 'center' }}>Spin</div>
        <div style={{ textAlign: 'right' }}>Config</div>
      </div>
      {rows.length === 0 && <div style={{ padding: 40, textAlign: 'center', color: '#B0ADA8', fontWeight: 700 }}>Aucun pro</div>}
      {rows.map((r, i) => <div key={r.pro.id} style={{ display: 'grid', gridTemplateColumns: '2fr 90px 90px 90px 140px', padding: '10px 18px', alignItems: 'center', background: i % 2 ? '#FAFAF8' : 'white', borderTop: '1px solid #F0EDE8', fontSize: 13, fontWeight: 700 }}>
        <div><div style={{ fontWeight: 900, color: '#1A1033' }}>{r.pro.nom}</div><div style={{ fontSize: 11, color: '#B0ADA8', fontFamily: 'monospace' }}>{r.pro.slug}</div></div>
        <div style={{ textAlign: 'center' }}><Toggle on={r.tombola} onChange={() => toggle(r.pro.id, 'tombola')} /></div>
        <div style={{ textAlign: 'center' }}><Toggle on={r.quizz} onChange={() => toggle(r.pro.id, 'quizz')} /></div>
        <div style={{ textAlign: 'center' }}><Toggle on={r.spin} onChange={() => toggle(r.pro.id, 'spin')} /></div>
        <div style={{ textAlign: 'right' }}><Link href={`/admin/pros/${r.pro.id}`} style={{ background: '#F0EDE8', color: '#1A1033', borderRadius: 100, padding: '6px 12px', fontSize: 11, fontWeight: 900, textDecoration: 'none' }}>Configurer {'\u2192'}</Link></div>
      </div>)}
    </div>

    <div style={{ marginTop: 14, fontSize: 11, color: '#B0ADA8', fontWeight: 700 }}>R\u00e8gle : tombola ind\u00e9pendante, 1 seul bonus (quizz ou spin) actif \u00e0 la fois par pro. Non persist\u00e9 V1 (table jeux_config \u00e0 cr\u00e9er).</div>
  </div>
}

function Toggle({ on, onChange }: { on: boolean; onChange: () => void }) {
  return <label style={{ position: 'relative', display: 'inline-block', width: 42, height: 24, cursor: 'pointer' }}>
    <input type="checkbox" checked={on} onChange={onChange} style={{ opacity: 0, width: 0, height: 0 }} />
    <span style={{ position: 'absolute', inset: 0, background: on ? A : '#D0CEC9', borderRadius: 100, transition: '.2s' }}>
      <span style={{ position: 'absolute', top: 2, left: on ? 20 : 2, width: 20, height: 20, background: 'white', borderRadius: '50%', transition: '.2s' }} />
    </span>
  </label>
}
