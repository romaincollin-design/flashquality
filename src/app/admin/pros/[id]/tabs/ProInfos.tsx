'use client'
import { useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'

const A = '#7C5CFC', AD = '#5538D4'
const CARD: React.CSSProperties = { background: 'white', borderRadius: 16, border: '1.5px solid #E8E4DC', padding: 18, boxSizing: 'border-box' }
const IN: React.CSSProperties = { width: '100%', padding: '10px 13px', borderRadius: 10, border: '1.5px solid #E8E4DC', fontSize: 13, fontFamily: 'inherit', fontWeight: 700, color: '#1A1033', outline: 'none', boxSizing: 'border-box', background: 'white' }

type Pro = { id: string; slug: string; nom: string; categorie: string | null; adresse: string | null; tel: string | null; horaires: string | null; logo_url: string | null; plan: string | null; actif: boolean }
type Offre = { id: string; titre: string; actif: boolean }

export default function ProInfos({ pro, offres }: { pro: Pro; offres: Offre[] }) {
  const [form, setForm] = useState<Pro>(pro)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')

  const set = <K extends keyof Pro>(k: K, v: Pro[K]) => setForm(f => ({ ...f, [k]: v }))

  async function save() {
    setSaving(true); setMsg('')
    try {
      const sb = createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
      const { error } = await sb.from('pros').update({
        nom: form.nom, slug: form.slug, categorie: form.categorie, adresse: form.adresse,
        tel: form.tel, horaires: form.horaires, logo_url: form.logo_url, plan: form.plan, actif: form.actif,
      }).eq('id', form.id)
      if (error) throw error
      setMsg('\u2705 Enregistr\u00e9')
    } catch (e) {
      setMsg('\u274C ' + (e instanceof Error ? e.message : 'Erreur'))
    } finally { setSaving(false) }
  }

  return <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(320px,1fr))', gap: 14 }}>
    <div style={CARD}>
      <div style={{ fontSize: 14, fontWeight: 900, color: '#1A1033', marginBottom: 12 }}>Infos g\u00e9n\u00e9rales</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <Field label="Nom"><input style={IN} value={form.nom} onChange={e => set('nom', e.target.value)} /></Field>
        <Field label="Slug"><input style={IN} value={form.slug} onChange={e => set('slug', e.target.value)} /></Field>
        <Field label="Cat\u00e9gorie"><input style={IN} value={form.categorie || ''} onChange={e => set('categorie', e.target.value)} /></Field>
        <Field label="Adresse"><input style={IN} value={form.adresse || ''} onChange={e => set('adresse', e.target.value)} /></Field>
        <Field label="T\u00e9l\u00e9phone"><input style={IN} value={form.tel || ''} onChange={e => set('tel', e.target.value)} /></Field>
        <Field label="Horaires"><textarea rows={3} style={{ ...IN, resize: 'vertical' }} value={form.horaires || ''} onChange={e => set('horaires', e.target.value)} /></Field>
      </div>
    </div>
    <div style={CARD}>
      <div style={{ fontSize: 14, fontWeight: 900, color: '#1A1033', marginBottom: 12 }}>Param\u00e8tres</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <Field label="Logo URL"><input style={IN} value={form.logo_url || ''} onChange={e => set('logo_url', e.target.value)} /></Field>
        <Field label="Plan">
          <select style={IN} value={form.plan || ''} onChange={e => set('plan', e.target.value)}>
            <option value="">\u2014</option>
            <option value="gratuit">Gratuit</option>
            <option value="essentiel">Essentiel</option>
            <option value="pro">Pro</option>
            <option value="premium">Premium</option>
          </select>
        </Field>
        <label style={{ display: 'flex', gap: 10, alignItems: 'center', padding: '8px 2px', cursor: 'pointer' }}>
          <input type="checkbox" checked={form.actif} onChange={e => set('actif', e.target.checked)} style={{ width: 18, height: 18, accentColor: A, cursor: 'pointer' }} />
          <span style={{ fontSize: 13, fontWeight: 800, color: '#1A1033' }}>Compte actif</span>
        </label>
      </div>
      <div style={{ marginTop: 16, paddingTop: 14, borderTop: '1px solid #F0EDE8' }}>
        <div style={{ fontSize: 11, fontWeight: 900, color: '#6B6760', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 8 }}>Offres</div>
        {offres.length === 0 && <div style={{ fontSize: 12, color: '#B0ADA8', fontWeight: 700 }}>Aucune offre</div>}
        {offres.map(o => <div key={o.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', fontSize: 12, fontWeight: 700, color: '#1A1033' }}>
          <span>{o.titre}</span>
          <span style={{ background: o.actif ? '#D1FAE5' : '#F0EDE8', color: o.actif ? '#065F46' : '#6B6760', padding: '2px 8px', borderRadius: 100, fontSize: 10, fontWeight: 900 }}>{o.actif ? 'Active' : 'Inactive'}</span>
        </div>)}
      </div>
    </div>
    <div style={{ gridColumn: '1/-1', display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
      <button onClick={save} disabled={saving} style={{ background: saving ? '#B8A9FF' : A, color: 'white', border: 'none', borderRadius: 100, padding: '11px 22px', fontSize: 13, fontWeight: 900, cursor: saving ? 'wait' : 'pointer', fontFamily: 'inherit', boxShadow: `0 3px 0 ${AD}` }}>{saving ? 'Enregistrement...' : 'Enregistrer'}</button>
      {msg && <span style={{ fontSize: 12, fontWeight: 800, color: msg.startsWith('\u2705') ? '#065F46' : '#B91C1C' }}>{msg}</span>}
    </div>
  </div>
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label style={{ display: 'block' }}>
    <div style={{ fontSize: 10, fontWeight: 900, color: '#6B6760', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 4 }}>{label}</div>
    {children}
  </label>
}
