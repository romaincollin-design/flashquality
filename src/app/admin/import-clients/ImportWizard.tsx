'use client'
import { useMemo, useState } from 'react'
import { parseCSV, autoDetect, TARGET_LABELS, validateEmail, type TargetField, type ParsedCSV } from '@/lib/admin/csv-parser'
import { toCSV, downloadCSV, csvFilename } from '@/lib/admin/csv'

const A = '#7C5CFC', AD = '#5538D4'
const CARD: React.CSSProperties = { background: 'white', borderRadius: 16, border: '1.5px solid #E8E4DC', padding: 18, boxSizing: 'border-box' }

type Step = 1 | 2 | 3

export default function ImportWizard() {
  const [step, setStep] = useState<Step>(1)
  const [fileName, setFileName] = useState('')
  const [parsed, setParsed] = useState<ParsedCSV | null>(null)
  const [mapping, setMapping] = useState<TargetField[]>([])
  const [imported, setImported] = useState(0)

  async function onFile(f: File) {
    const text = await f.text()
    const p = parseCSV(text)
    setFileName(f.name)
    setParsed(p)
    setMapping(p.headers.map(h => autoDetect(h)))
    setStep(2)
  }

  const preview = useMemo(() => {
    if (!parsed) return { rows: [] as Record<string, string>[], errors: [] as string[] }
    const rows: Record<string, string>[] = []
    const errors: string[] = []
    parsed.rows.forEach((r, idx) => {
      const obj: Record<string, string> = {}
      mapping.forEach((t, i) => {
        if (t === 'ignore') return
        obj[t] = (r[i] || '').trim()
      })
      if (obj.email && !validateEmail(obj.email)) errors.push(`Ligne ${idx + 2} : email invalide (${obj.email})`)
      if (mapping.includes('email') && !obj.email) errors.push(`Ligne ${idx + 2} : email manquant`)
      rows.push(obj)
    })
    return { rows, errors }
  }, [parsed, mapping])

  async function doImport() {
    // V2 : batch insert dans table clients via SupabaseAdapter. V1 : dry-run + CSV success.
    setImported(preview.rows.length)
    downloadCSV(csvFilename('import_success'), toCSV(preview.rows))
    setStep(3)
  }

  return <div style={{ padding: '24px 24px 40px', maxWidth: 1100 }}>
    <div style={{ marginBottom: 18 }}>
      <div style={{ fontSize: 11, fontWeight: 800, color: '#6B6760', textTransform: 'uppercase', letterSpacing: '.1em' }}>Admin</div>
      <div style={{ fontSize: 26, fontWeight: 900, color: '#1A1033', marginTop: 2 }}>Import clients existants</div>
    </div>

    <div style={{ display: 'flex', gap: 6, marginBottom: 18 }}>
      {[1, 2, 3].map(n => <div key={n} style={{ flex: 1, height: 6, borderRadius: 100, background: step >= n ? A : '#E8E4DC', transition: '.3s' }} />)}
    </div>

    {step === 1 && <div style={CARD}>
      <div style={{ fontSize: 14, fontWeight: 900, color: '#1A1033', marginBottom: 10 }}>1. Upload du fichier CSV</div>
      <label style={{ display: 'block', border: '2.5px dashed #D0CEC9', borderRadius: 16, padding: 40, textAlign: 'center', cursor: 'pointer', background: '#FAFAF8' }}>
        <input type="file" accept=".csv,text/csv" style={{ display: 'none' }} onChange={e => { const f = e.target.files?.[0]; if (f) onFile(f) }} />
        <div style={{ fontSize: 36, marginBottom: 8 }}>{'\u{1F4C4}'}</div>
        <div style={{ fontSize: 14, fontWeight: 900, color: '#1A1033' }}>Cliquer pour s\u00e9lectionner un CSV</div>
        <div style={{ fontSize: 12, color: '#B0ADA8', fontWeight: 700, marginTop: 4 }}>Format attendu : 1 ligne d&apos;en-t\u00eate, puis lignes clients</div>
      </label>
    </div>}

    {step === 2 && parsed && <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={CARD}>
        <div style={{ fontSize: 14, fontWeight: 900, color: '#1A1033', marginBottom: 4 }}>2. Mapping des colonnes</div>
        <div style={{ fontSize: 12, color: '#6B6760', fontWeight: 700, marginBottom: 14 }}>{fileName} \u00b7 {parsed.headers.length} colonnes \u00b7 {parsed.rows.length} lignes</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(240px,1fr))', gap: 10 }}>
          {parsed.headers.map((h, i) => <div key={i} style={{ border: '1.5px solid #E8E4DC', borderRadius: 12, padding: 10 }}>
            <div style={{ fontSize: 10, fontWeight: 900, color: '#6B6760', textTransform: 'uppercase', letterSpacing: '.08em' }}>Colonne source</div>
            <div style={{ fontSize: 13, fontWeight: 900, color: '#1A1033', marginBottom: 6, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{h}</div>
            <select value={mapping[i]} onChange={e => setMapping(m => m.map((x, k) => k === i ? (e.target.value as TargetField) : x))} style={{ width: '100%', padding: '7px 10px', borderRadius: 8, border: '1.5px solid #E8E4DC', fontSize: 12, fontFamily: 'inherit', fontWeight: 800, background: 'white', outline: 'none' }}>
              {(Object.entries(TARGET_LABELS) as [TargetField, string][]).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
            </select>
          </div>)}
        </div>
      </div>

      <div style={CARD}>
        <div style={{ fontSize: 14, fontWeight: 900, color: '#1A1033', marginBottom: 10 }}>Aper\u00e7u (5 premi\u00e8res lignes)</div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
            <thead><tr style={{ background: '#F0EDE8' }}>{parsed.headers.map((h, i) => <th key={i} style={{ padding: '8px 10px', textAlign: 'left', fontWeight: 900, color: '#6B6760', textTransform: 'uppercase', fontSize: 10, letterSpacing: '.08em' }}>{h}<br /><span style={{ color: A, fontSize: 10 }}>\u2192 {TARGET_LABELS[mapping[i]]}</span></th>)}</tr></thead>
            <tbody>{parsed.rows.slice(0, 5).map((r, i) => <tr key={i} style={{ borderTop: '1px solid #F0EDE8' }}>{r.map((c, k) => <td key={k} style={{ padding: '8px 10px', color: '#1A1033', fontWeight: 700 }}>{c}</td>)}</tr>)}</tbody>
          </table>
        </div>
      </div>

      {preview.errors.length > 0 && <div style={{ background: '#FEF3C7', border: '1.5px solid #F59E0B', borderRadius: 12, padding: '12px 14px', color: '#92400E' }}>
        <div style={{ fontSize: 13, fontWeight: 900, marginBottom: 6 }}>{'\u26A0\uFE0F'} {preview.errors.length} avertissement{preview.errors.length > 1 ? 's' : ''}</div>
        <ul style={{ paddingLeft: 18, fontSize: 12, fontWeight: 700 }}>{preview.errors.slice(0, 5).map((e, i) => <li key={i}>{e}</li>)}</ul>
      </div>}

      <div style={{ display: 'flex', gap: 8 }}>
        <button onClick={() => setStep(1)} style={{ background: '#F0EDE8', color: '#1A1033', border: 'none', borderRadius: 100, padding: '11px 22px', fontSize: 13, fontWeight: 900, cursor: 'pointer', fontFamily: 'inherit' }}>Retour</button>
        <button onClick={doImport} style={{ flex: 1, background: A, color: 'white', border: 'none', borderRadius: 100, padding: '11px 22px', fontSize: 13, fontWeight: 900, cursor: 'pointer', fontFamily: 'inherit', boxShadow: `0 3px 0 ${AD}` }}>Importer {preview.rows.length} ligne{preview.rows.length > 1 ? 's' : ''}</button>
      </div>
    </div>}

    {step === 3 && <div style={{ ...CARD, textAlign: 'center', padding: 40 }}>
      <div style={{ fontSize: 56, marginBottom: 12 }}>{'\u2705'}</div>
      <div style={{ fontSize: 20, fontWeight: 900, color: '#1A1033' }}>{imported} client{imported > 1 ? 's' : ''} import\u00e9{imported > 1 ? 's' : ''}</div>
      <div style={{ fontSize: 13, color: '#6B6760', fontWeight: 700, marginTop: 6 }}>Fichier success t\u00e9l\u00e9charg\u00e9. Insert r\u00e9el Supabase d\u00e8s que la table clients est cr\u00e9\u00e9e.</div>
      <button onClick={() => { setStep(1); setParsed(null); setMapping([]); setImported(0); setFileName('') }} style={{ marginTop: 18, background: A, color: 'white', border: 'none', borderRadius: 100, padding: '11px 22px', fontSize: 13, fontWeight: 900, cursor: 'pointer', fontFamily: 'inherit', boxShadow: `0 3px 0 ${AD}` }}>Nouvel import</button>
    </div>}
  </div>
}
