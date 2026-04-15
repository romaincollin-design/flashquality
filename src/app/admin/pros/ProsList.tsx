'use client'
import Link from 'next/link'
import { useMemo, useState } from 'react'

type Pro = {
  id: string; slug: string; nom: string; categorie: string | null
  adresse?: string | null; tel?: string | null; plan?: string | null
  actif: boolean; created_at: string
}

const A = '#7C5CFC'

export default function ProsList({ pros }: { pros: Pro[] }) {
  const [q, setQ] = useState('')
  const [filter, setFilter] = useState<'all' | 'actif' | 'inactif'>('all')

  const filtered = useMemo(() => {
    const ql = q.toLowerCase()
    return pros.filter(p => {
      if (filter === 'actif' && !p.actif) return false
      if (filter === 'inactif' && p.actif) return false
      if (!ql) return true
      return p.nom?.toLowerCase().includes(ql) || p.slug?.toLowerCase().includes(ql)
    })
  }, [pros, q, filter])

  return <div style={{ padding: '24px 24px 40px', maxWidth: 1200 }}>
    <div style={{ marginBottom: 18 }}>
      <div style={{ fontSize: 11, fontWeight: 800, color: '#6B6760', textTransform: 'uppercase', letterSpacing: '.1em' }}>Admin</div>
      <div style={{ fontSize: 26, fontWeight: 900, color: '#1A1033', marginTop: 2 }}>Tous les pros <span style={{ fontSize: 14, color: '#B0ADA8', fontWeight: 700 }}>\u00b7 {pros.length}</span></div>
    </div>

    <div style={{ display: 'flex', gap: 10, marginBottom: 14, flexWrap: 'wrap' }}>
      <input placeholder="Rechercher nom ou slug..." value={q} onChange={e => setQ(e.target.value)} style={{ flex: 1, minWidth: 240, padding: '10px 14px', borderRadius: 100, border: '1.5px solid #E8E4DC', fontSize: 13, fontWeight: 700, fontFamily: 'inherit', outline: 'none', background: 'white' }} />
      <div style={{ display: 'flex', gap: 4, background: 'white', padding: 4, borderRadius: 100, border: '1.5px solid #E8E4DC' }}>
        {(['all', 'actif', 'inactif'] as const).map(f => <button key={f} onClick={() => setFilter(f)} style={{ background: filter === f ? A : 'transparent', color: filter === f ? 'white' : '#6B6760', border: 'none', borderRadius: 100, padding: '7px 14px', fontSize: 12, fontWeight: 900, cursor: 'pointer', fontFamily: 'inherit' }}>{f === 'all' ? 'Tous' : f === 'actif' ? 'Actifs' : 'Inactifs'}</button>)}
      </div>
    </div>

    <div style={{ background: 'white', borderRadius: 16, border: '1.5px solid #E8E4DC', overflow: 'hidden' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr 1fr 1fr 100px', padding: '12px 16px', background: '#F0EDE8', fontSize: 11, fontWeight: 900, color: '#6B6760', textTransform: 'uppercase', letterSpacing: '.08em' }}>
        <div>Nom</div><div>Slug</div><div>Cat\u00e9gorie</div><div>Plan</div><div>Statut</div>
      </div>
      {filtered.length === 0 && <div style={{ padding: 40, textAlign: 'center', color: '#B0ADA8', fontWeight: 700 }}>Aucun r\u00e9sultat</div>}
      {filtered.map((p, i) => <Link key={p.id} href={`/admin/pros/${p.id}`} style={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr 1fr 1fr 100px', padding: '12px 16px', alignItems: 'center', background: i % 2 ? '#FAFAF8' : 'white', textDecoration: 'none', color: 'inherit', borderTop: '1px solid #F0EDE8', fontSize: 13, fontWeight: 700 }}>
        <div style={{ fontWeight: 900, color: '#1A1033' }}>{p.nom}</div>
        <div style={{ color: '#6B6760', fontFamily: 'monospace', fontSize: 12 }}>{p.slug}</div>
        <div style={{ color: '#6B6760' }}>{p.categorie || '\u2014'}</div>
        <div style={{ color: '#6B6760' }}>{p.plan || '\u2014'}</div>
        <div><span style={{ background: p.actif ? '#D1FAE5' : '#FEE2E2', color: p.actif ? '#065F46' : '#991B1B', padding: '3px 10px', borderRadius: 100, fontSize: 11, fontWeight: 900 }}>{p.actif ? 'Actif' : 'Inactif'}</span></div>
      </Link>)}
    </div>
  </div>
}
