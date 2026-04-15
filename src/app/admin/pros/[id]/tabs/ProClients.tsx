'use client'
import { useMemo } from 'react'
import { getStatsMock } from '@/lib/admin/mock'
import { toCSV, downloadCSV, csvFilename } from '@/lib/admin/csv'

type Pro = { id: string; slug: string; nom: string }

// V1 : mock (table `clients` pas encore cr\u00e9\u00e9e). V2 : fetch clients WHERE pro_id = pro.id.
export default function ProClients({ pro }: { pro: Pro }) {
  const mock = useMemo(() => getStatsMock(), [])
  const clients = useMemo(() => {
    // Match d\u2019abord par id, sinon premier pro mock (fallback d\u00e9mo)
    const found = mock.clients.filter(c => c.pro_id === pro.id)
    if (found.length) return found
    const firstPro = mock.pros[0]
    return mock.clients.filter(c => c.pro_id === firstPro?.id)
  }, [mock, pro.id])

  function exportCsv() {
    downloadCSV(csvFilename('clients', pro.slug), toCSV(clients.map(c => ({ ...c }))))
  }

  return <div style={{ background: 'white', borderRadius: 16, border: '1.5px solid #E8E4DC', overflow: 'hidden' }}>
    <div style={{ padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
      <div style={{ fontSize: 14, fontWeight: 900, color: '#1A1033' }}>{clients.length} client{clients.length > 1 ? 's' : ''} <span style={{ fontSize: 11, color: '#B0ADA8', fontWeight: 700 }}>(mock tant que table clients non cr\u00e9\u00e9e)</span></div>
      <button onClick={exportCsv} style={{ background: '#F0EDE8', color: '#1A1033', border: 'none', borderRadius: 100, padding: '7px 14px', fontSize: 12, fontWeight: 900, cursor: 'pointer', fontFamily: 'inherit' }}>Exporter CSV</button>
    </div>
    <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 2fr 1fr 1fr 80px 80px', padding: '10px 18px', background: '#F0EDE8', fontSize: 10, fontWeight: 900, color: '#6B6760', textTransform: 'uppercase', letterSpacing: '.08em' }}>
      <div>Pr\u00e9nom</div><div>Email</div><div>Ville</div><div>Tranche</div><div>Visites</div><div>Inscrit</div>
    </div>
    {clients.slice(0, 50).map((c, i) => <div key={c.id} style={{ display: 'grid', gridTemplateColumns: '1.5fr 2fr 1fr 1fr 80px 80px', padding: '10px 18px', fontSize: 12, fontWeight: 700, color: '#1A1033', background: i % 2 ? '#FAFAF8' : 'white', borderTop: '1px solid #F0EDE8' }}>
      <div style={{ fontWeight: 900 }}>{c.prenom}</div>
      <div style={{ color: '#6B6760' }}>{c.email}</div>
      <div style={{ color: '#6B6760' }}>{c.ville}</div>
      <div style={{ color: '#6B6760' }}>{c.tranche}</div>
      <div style={{ color: '#6B6760' }}>{c.visites}</div>
      <div style={{ color: '#6B6760', fontSize: 11 }}>{c.inscrit_le.slice(5)}</div>
    </div>)}
    {clients.length > 50 && <div style={{ padding: 12, textAlign: 'center', fontSize: 11, color: '#B0ADA8', fontWeight: 700 }}>\u2026 et {clients.length - 50} autres (CSV complet)</div>}
  </div>
}
