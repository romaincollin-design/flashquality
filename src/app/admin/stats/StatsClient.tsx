'use client'
import { useMemo, useState } from 'react'
import type { StatsData } from '@/lib/admin/mock'
import { byKey, sumKey, toBuckets, bucketBudget, monthBucket, type Bucket } from '@/lib/admin/aggregate'
import { toCSV, downloadCSV, csvFilename } from '@/lib/admin/csv'
import BarChart from '@/components/admin/BarChart'
import DonutChart from '@/components/admin/DonutChart'

const A = '#7C5CFC', AD = '#5538D4', RC = 16
const CARD: React.CSSProperties = { background: 'white', borderRadius: RC, border: '1.5px solid #E8E4DC', padding: 16, boxSizing: 'border-box' }

function KPI({ label, value, sub, color = A }: { label: string; value: string | number; sub?: string; color?: string }) {
  return <div style={{ ...CARD, borderTop: `3px solid ${color}` }}>
    <div style={{ fontSize: 11, fontWeight: 800, color: '#6B6760', textTransform: 'uppercase', letterSpacing: '.08em' }}>{label}</div>
    <div style={{ fontSize: 26, fontWeight: 900, color: '#1A1033', marginTop: 4, fontFamily: "'Fredoka',sans-serif" }}>{value}</div>
    {sub && <div style={{ fontSize: 11, color: '#B0ADA8', fontWeight: 700, marginTop: 2 }}>{sub}</div>}
  </div>
}

function Section({ title, onExport, children }: { title: string; onExport?: () => void; children: React.ReactNode }) {
  return <div style={{ ...CARD, marginBottom: 14 }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
      <div style={{ fontSize: 14, fontWeight: 900, color: '#1A1033' }}>{title}</div>
      {onExport && <button onClick={onExport} style={{ background: '#F0EDE8', color: '#1A1033', border: 'none', borderRadius: 100, padding: '5px 12px', fontSize: 11, fontWeight: 800, cursor: 'pointer', fontFamily: 'inherit' }}>CSV</button>}
    </div>
    {children}
  </div>
}

export default function StatsClient({ data }: { data: StatsData }) {
  const [tab, setTab] = useState<'global' | 'pro'>('global')
  const [proId, setProId] = useState<string>(data.pros[0]?.id || '')

  const global = useMemo(() => {
    const catPro = toBuckets(byKey(data.pros, p => p.categorie))
    const villeClient = toBuckets(byKey(data.clients, c => c.ville)).slice(0, 5)
    const trancheClient = toBuckets(byKey(data.clients, c => c.tranche))
    const inscriptionsMois = toBuckets(byKey(data.clients, c => monthBucket(c.inscrit_le)))
      .sort((a, b) => a.label.localeCompare(b.label))
    const topProAvis = toBuckets(byKey(data.reviews, r => {
      const p = data.pros.find(x => x.id === r.pro_id); return p?.nom || r.pro_id
    })).slice(0, 5)
    const topProXp = toBuckets(sumKey(data.xp, x => {
      const p = data.pros.find(pp => pp.id === x.pro_id); return p?.nom || x.pro_id
    }, x => x.xp)).slice(0, 5)
    return { catPro, villeClient, trancheClient, inscriptionsMois, topProAvis, topProXp }
  }, [data])

  const pro = useMemo(() => {
    const clients = data.clients.filter(c => c.pro_id === proId)
    const depenses = data.depenses.filter(d => d.pro_id === proId)
    const reviews = data.reviews.filter(r => r.pro_id === proId)
    const xp = data.xp.filter(x => x.pro_id === proId)
    const info = data.pros.find(p => p.id === proId)
    const age = toBuckets(byKey(clients, c => c.tranche))
    const ville = toBuckets(byKey(clients, c => c.ville)).slice(0, 5)
    const freq = toBuckets(byKey(clients, c => {
      const n = c.visites
      if (n <= 1) return '1 visite'; if (n <= 5) return '2-5 visites'; return '5+ visites'
    }))
    const cat = toBuckets(byKey(depenses, d => d.categorie))
    const lieu = toBuckets(byKey(depenses, d => d.lieu)).slice(0, 5)
    const budget = toBuckets(byKey(depenses, d => bucketBudget(d.montant)))
    const totalDep = depenses.reduce((s, d) => s + d.montant, 0)
    const avgDep = depenses.length ? totalDep / depenses.length : 0
    const xpTotal = xp.reduce((s, x) => s + x.xp, 0)
    return { info, clients, depenses, reviews, xp, age, ville, freq, cat, lieu, budget, totalDep, avgDep, xpTotal }
  }, [data, proId])

  function exportBuckets(name: string, buckets: Bucket[]) {
    downloadCSV(csvFilename(name), toCSV(buckets.map(b => ({ label: b.label, value: b.value }))))
  }

  function exportAllPro() {
    if (!pro.info) return
    const rows = [
      ...pro.age.map(b => ({ dimension: 'age', ...b })),
      ...pro.ville.map(b => ({ dimension: 'ville', ...b })),
      ...pro.freq.map(b => ({ dimension: 'frequence', ...b })),
      ...pro.cat.map(b => ({ dimension: 'categorie_depense', ...b })),
      ...pro.lieu.map(b => ({ dimension: 'lieu', ...b })),
      ...pro.budget.map(b => ({ dimension: 'budget', ...b })),
    ]
    downloadCSV(csvFilename('stats', pro.info.slug), toCSV(rows))
  }

  function exportClients() {
    downloadCSV(csvFilename('clients'), toCSV(data.clients.map(c => ({ ...c }))))
  }
  function exportPros() {
    downloadCSV(csvFilename('pros'), toCSV(data.pros.map(p => ({ id: p.id, slug: p.slug, nom: p.nom, categorie: p.categorie, ville: p.ville, actif: p.actif ? 'oui' : 'non' }))))
  }

  return <div style={{ minHeight: '100vh', background: '#F7F5F1', fontFamily: "'Nunito',sans-serif", padding: '20px 16px 40px' }}>
    <style>{`@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@700;800;900&family=Fredoka:wght@500;600;700&display=swap');*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}`}</style>
    <div style={{ maxWidth: 1100, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18, flexWrap: 'wrap', gap: 10 }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 800, color: '#6B6760', textTransform: 'uppercase', letterSpacing: '.1em' }}>Admin</div>
          <div style={{ fontSize: 26, fontWeight: 900, color: '#1A1033', marginTop: 2 }}>Statistiques</div>
        </div>
        <div style={{ display: 'flex', gap: 6, background: 'white', padding: 4, borderRadius: 100, border: '1.5px solid #E8E4DC' }}>
          {(['global', 'pro'] as const).map(t => <button key={t} onClick={() => setTab(t)} style={{ background: tab === t ? A : 'transparent', color: tab === t ? 'white' : '#6B6760', border: 'none', borderRadius: 100, padding: '7px 16px', fontSize: 12, fontWeight: 900, cursor: 'pointer', fontFamily: 'inherit' }}>{t === 'global' ? 'Global' : 'Par pro'}</button>)}
        </div>
      </div>

      {tab === 'global' && <>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 12, marginBottom: 14 }}>
          <KPI label="Pros actifs" value={data.pros.filter(p => p.actif).length} sub={`sur ${data.pros.length} total`} />
          <KPI label="Clients" value={data.clients.length} color="#10B981" />
          <KPI label="Avis" value={data.reviews.length} color="#F59E0B" />
          <KPI label="XP distribu\u00e9s" value={data.xp.reduce((s, x) => s + x.xp, 0)} color="#EC4899" />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(320px,1fr))', gap: 14 }}>
          <Section title="Cat\u00e9gories pro" onExport={() => exportBuckets('categories_pro', global.catPro)}>
            <DonutChart data={global.catPro} />
          </Section>
          <Section title="Top villes clients" onExport={() => exportBuckets('villes_clients', global.villeClient)}>
            <BarChart data={global.villeClient} />
          </Section>
          <Section title="Tranches d\u2019\u00e2ge" onExport={() => exportBuckets('tranches_age', global.trancheClient)}>
            <DonutChart data={global.trancheClient} />
          </Section>
          <Section title="Inscriptions par mois" onExport={() => exportBuckets('inscriptions_mois', global.inscriptionsMois)}>
            <BarChart data={global.inscriptionsMois} defaultColor="#10B981" />
          </Section>
          <Section title="Top 5 pros par avis" onExport={() => exportBuckets('top_pros_avis', global.topProAvis)}>
            <BarChart data={global.topProAvis} defaultColor="#F59E0B" />
          </Section>
          <Section title="Top 5 pros par XP" onExport={() => exportBuckets('top_pros_xp', global.topProXp)}>
            <BarChart data={global.topProXp} defaultColor="#EC4899" />
          </Section>
        </div>
        <div style={{ display: 'flex', gap: 8, marginTop: 14, flexWrap: 'wrap' }}>
          <button onClick={exportClients} style={{ background: A, color: 'white', border: 'none', borderRadius: 100, padding: '10px 18px', fontSize: 13, fontWeight: 900, cursor: 'pointer', fontFamily: 'inherit', boxShadow: `0 3px 0 ${AD}` }}>Exporter clients (CSV)</button>
          <button onClick={exportPros} style={{ background: '#10B981', color: 'white', border: 'none', borderRadius: 100, padding: '10px 18px', fontSize: 13, fontWeight: 900, cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 3px 0 #065F46' }}>Exporter pros (CSV)</button>
        </div>
      </>}

      {tab === 'pro' && <>
        <div style={{ ...CARD, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <label style={{ fontSize: 12, fontWeight: 800, color: '#6B6760' }}>S\u00e9lection :</label>
          <select value={proId} onChange={e => setProId(e.target.value)} style={{ padding: '8px 12px', borderRadius: 10, border: '1.5px solid #E8E4DC', fontSize: 13, fontWeight: 800, fontFamily: 'inherit', background: 'white', color: '#1A1033', outline: 'none' }}>
            {data.pros.map(p => <option key={p.id} value={p.id}>{p.nom}</option>)}
          </select>
          <button onClick={exportAllPro} style={{ marginLeft: 'auto', background: A, color: 'white', border: 'none', borderRadius: 100, padding: '8px 16px', fontSize: 12, fontWeight: 900, cursor: 'pointer', fontFamily: 'inherit', boxShadow: `0 3px 0 ${AD}` }}>Export complet CSV</button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 12, marginBottom: 14 }}>
          <KPI label="Clients" value={pro.clients.length} />
          <KPI label="D\u00e9penses" value={`${pro.totalDep.toFixed(0)} \u20AC`} sub={`moy. ${pro.avgDep.toFixed(2)} \u20AC`} color="#10B981" />
          <KPI label="Avis" value={pro.reviews.length} color="#F59E0B" />
          <KPI label="XP distribu\u00e9s" value={pro.xpTotal} color="#EC4899" />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(320px,1fr))', gap: 14 }}>
          <Section title="\u00c2ge clients" onExport={() => exportBuckets('age_' + proId, pro.age)}><DonutChart data={pro.age} /></Section>
          <Section title="Villes clients" onExport={() => exportBuckets('villes_' + proId, pro.ville)}><BarChart data={pro.ville} /></Section>
          <Section title="Fr\u00e9quence visites" onExport={() => exportBuckets('frequence_' + proId, pro.freq)}><DonutChart data={pro.freq} /></Section>
          <Section title="Cat\u00e9gories d\u00e9penses" onExport={() => exportBuckets('categories_' + proId, pro.cat)}><DonutChart data={pro.cat} /></Section>
          <Section title="Budget par d\u00e9pense" onExport={() => exportBuckets('budget_' + proId, pro.budget)}><BarChart data={pro.budget} defaultColor="#10B981" /></Section>
          <Section title="Top 5 lieux" onExport={() => exportBuckets('lieux_' + proId, pro.lieu)}><BarChart data={pro.lieu} defaultColor="#F59E0B" /></Section>
        </div>
      </>}
    </div>
  </div>
}
