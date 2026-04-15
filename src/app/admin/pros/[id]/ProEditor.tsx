'use client'
import Link from 'next/link'
import { useState } from 'react'
import ProInfos from './tabs/ProInfos'
import ProClients from './tabs/ProClients'
import ProJeux from './tabs/ProJeux'
import ProVisuel from './tabs/ProVisuel'

const A = '#7C5CFC'

type Pro = { id: string; slug: string; nom: string; categorie: string | null; adresse: string | null; tel: string | null; horaires: string | null; logo_url: string | null; plan: string | null; actif: boolean; theme?: Record<string, unknown> | null }
type Offre = { id: string; pro_id: string; titre: string; description: string | null; expire_at: string | null; type: string | null; actif: boolean }

type Tab = 'infos' | 'clients' | 'jeux' | 'visuel'

export default function ProEditor({ pro, offres }: { pro: Pro; offres: Offre[] }) {
  const [tab, setTab] = useState<Tab>('infos')

  return <div style={{ padding: '24px 24px 40px', maxWidth: 1200 }}>
    <Link href="/admin/pros" style={{ fontSize: 12, fontWeight: 800, color: '#6B6760', textDecoration: 'none' }}>{'\u2190'} Tous les pros</Link>
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, margin: '10px 0 18px', flexWrap: 'wrap' }}>
      <div style={{ width: 56, height: 56, borderRadius: 14, background: '#EDE8FF', color: A, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 900 }}>{pro.nom.split(' ').map(w => w[0] || '').join('').slice(0, 2).toUpperCase()}</div>
      <div>
        <div style={{ fontSize: 22, fontWeight: 900, color: '#1A1033' }}>{pro.nom}</div>
        <div style={{ fontSize: 12, color: '#6B6760', fontWeight: 700 }}>/{pro.slug} \u00b7 {pro.categorie || '\u2014'}</div>
      </div>
      <a href={`/client?slug=${pro.slug}`} target="_blank" rel="noreferrer" style={{ marginLeft: 'auto', background: A, color: 'white', border: 'none', borderRadius: 100, padding: '8px 16px', fontSize: 12, fontWeight: 900, cursor: 'pointer', fontFamily: 'inherit', textDecoration: 'none' }}>Voir la page client {'\u2197'}</a>
    </div>

    <div style={{ display: 'flex', gap: 4, background: 'white', padding: 4, borderRadius: 100, border: '1.5px solid #E8E4DC', marginBottom: 14, width: 'fit-content', flexWrap: 'wrap' }}>
      {(['infos', 'clients', 'jeux', 'visuel'] as Tab[]).map(t => <button key={t} onClick={() => setTab(t)} style={{ background: tab === t ? A : 'transparent', color: tab === t ? 'white' : '#6B6760', border: 'none', borderRadius: 100, padding: '8px 18px', fontSize: 12, fontWeight: 900, cursor: 'pointer', fontFamily: 'inherit', textTransform: 'capitalize' }}>{t}</button>)}
    </div>

    {tab === 'infos' && <ProInfos pro={pro} offres={offres} />}
    {tab === 'clients' && <ProClients pro={pro} />}
    {tab === 'jeux' && <ProJeux pro={pro} />}
    {tab === 'visuel' && <ProVisuel pro={pro} />}
  </div>
}
