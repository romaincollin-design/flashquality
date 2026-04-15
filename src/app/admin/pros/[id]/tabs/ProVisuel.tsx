'use client'
import { useState } from 'react'

const A = '#7C5CFC', AD = '#5538D4'
const CARD: React.CSSProperties = { background: 'white', borderRadius: 16, border: '1.5px solid #E8E4DC', padding: 18 }
const IN: React.CSSProperties = { width: '100%', padding: '10px 13px', borderRadius: 10, border: '1.5px solid #E8E4DC', fontSize: 13, fontFamily: 'inherit', fontWeight: 700, color: '#1A1033', outline: 'none', boxSizing: 'border-box', background: 'white' }

type Pro = { id: string; slug: string; nom: string; logo_url: string | null }
type Theme = { primary: string; secondary: string; titre: string; soustitre: string }

export default function ProVisuel({ pro }: { pro: Pro }) {
  const [theme, setTheme] = useState<Theme>({
    primary: '#7C5CFC',
    secondary: '#5538D4',
    titre: `Bienvenue chez ${pro.nom}`,
    soustitre: 'D\u00e9couvre nos offres et gagne des r\u00e9compenses',
  })
  const [logoUrl, setLogoUrl] = useState(pro.logo_url || '')
  const [msg, setMsg] = useState('')
  const [bump, setBump] = useState(0)

  function save() {
    // V2 : update pros SET theme = jsonb avec {primary, secondary, titre, soustitre}
    setMsg('\u2705 Th\u00e8me enregistr\u00e9 (non persist\u00e9 : colonne pros.theme \u00e0 cr\u00e9er)')
    setTimeout(() => setMsg(''), 3500)
    setBump(b => b + 1)
  }

  const set = <K extends keyof Theme>(k: K, v: Theme[K]) => setTheme(t => ({ ...t, [k]: v }))

  return <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: 14 }}>
    <div style={{ ...CARD, display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ fontSize: 14, fontWeight: 900, color: '#1A1033' }}>\u00c9diteur visuel</div>
      <Field label="Couleur primaire">
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <input type="color" value={theme.primary} onChange={e => set('primary', e.target.value)} style={{ width: 44, height: 36, border: 'none', padding: 0, background: 'transparent', cursor: 'pointer' }} />
          <input style={IN} value={theme.primary} onChange={e => set('primary', e.target.value)} />
        </div>
      </Field>
      <Field label="Couleur secondaire">
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <input type="color" value={theme.secondary} onChange={e => set('secondary', e.target.value)} style={{ width: 44, height: 36, border: 'none', padding: 0, background: 'transparent', cursor: 'pointer' }} />
          <input style={IN} value={theme.secondary} onChange={e => set('secondary', e.target.value)} />
        </div>
      </Field>
      <Field label="Titre de bienvenue"><input style={IN} value={theme.titre} onChange={e => set('titre', e.target.value)} /></Field>
      <Field label="Sous-titre"><textarea rows={2} style={{ ...IN, resize: 'vertical' }} value={theme.soustitre} onChange={e => set('soustitre', e.target.value)} /></Field>
      <Field label="Logo (URL)"><input style={IN} value={logoUrl} onChange={e => setLogoUrl(e.target.value)} placeholder="https://..." /></Field>
      {logoUrl && <div style={{ width: 80, height: 80, borderRadius: 12, background: '#F0EDE8', backgroundImage: `url(${logoUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />}

      <button onClick={save} style={{ background: A, color: 'white', border: 'none', borderRadius: 100, padding: '11px 22px', fontSize: 13, fontWeight: 900, cursor: 'pointer', fontFamily: 'inherit', boxShadow: `0 3px 0 ${AD}`, marginTop: 6 }}>Enregistrer</button>
      {msg && <div style={{ fontSize: 12, fontWeight: 800, color: '#065F46' }}>{msg}</div>}
    </div>

    <div style={{ ...CARD, padding: 0, overflow: 'hidden', minHeight: 640 }}>
      <div style={{ padding: '10px 14px', borderBottom: '1px solid #F0EDE8', fontSize: 11, fontWeight: 900, color: '#6B6760', textTransform: 'uppercase', letterSpacing: '.08em' }}>Aper\u00e7u \u00b7 /client?slug={pro.slug}</div>
      <div style={{ background: '#1A1033', padding: 14, display: 'flex', justifyContent: 'center', minHeight: 580 }}>
        <div style={{ width: 380, background: 'white', borderRadius: 18, overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,.3)' }}>
          <div style={{ background: `linear-gradient(135deg,${theme.primary},${theme.secondary})`, padding: '22px 20px', color: 'white' }}>
            {logoUrl && <div style={{ width: 54, height: 54, borderRadius: 14, background: `white url(${logoUrl}) center/cover`, marginBottom: 10 }} />}
            <div style={{ fontSize: 10, fontWeight: 800, color: 'rgba(255,255,255,.6)', textTransform: 'uppercase', letterSpacing: '.12em' }}>Aper\u00e7u</div>
            <div style={{ fontSize: 22, fontWeight: 900, marginTop: 4, lineHeight: 1.2 }}>{theme.titre}</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,.82)', fontWeight: 700, marginTop: 6 }}>{theme.soustitre}</div>
          </div>
          <div style={{ padding: 16, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {['\u2B50', '\u26A1', '\u{1F4AC}', '\u{1F3B2}'].map((ic, i) => <div key={i} style={{ background: 'white', border: '2px solid #F0EDE8', borderRadius: 16, padding: 14, textAlign: 'left' }}>
              <div style={{ fontSize: 24 }}>{ic}</div>
              <div style={{ fontSize: 12, fontWeight: 900, color: '#1A1033', marginTop: 6 }}>{['Mon avis', 'Offres', 'Contact', 'Jouer'][i]}</div>
            </div>)}
          </div>
          <div style={{ margin: 14, background: `linear-gradient(135deg,${theme.primary},${theme.secondary})`, borderRadius: 16, padding: '12px 14px', color: 'white', fontSize: 12, fontWeight: 800 }}>Offre du jour \u2192</div>
        </div>
      </div>
      <div style={{ padding: '10px 14px', fontSize: 11, color: '#B0ADA8', fontWeight: 700, borderTop: '1px solid #F0EDE8' }}>Preview sch\u00e9matique \u00b7 itera \u00e0 chaque modif {bump > 0 && `(${bump} sauvegarde${bump > 1 ? 's' : ''})`}</div>
    </div>
  </div>
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label style={{ display: 'block' }}>
    <div style={{ fontSize: 10, fontWeight: 900, color: '#6B6760', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 4 }}>{label}</div>
    {children}
  </label>
}
