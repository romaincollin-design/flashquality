export type ParsedCSV = { headers: string[]; rows: string[][] }

export function parseCSV(text: string): ParsedCSV {
  // Parseur simple supportant "..." avec virgules et "" \u00e9chapp\u00e9s.
  const clean = text.replace(/\r\n/g, '\n').replace(/^\uFEFF/, '')
  const lines: string[][] = []
  let cur: string[] = []
  let field = ''
  let inQuotes = false
  for (let i = 0; i < clean.length; i++) {
    const c = clean[i]
    if (inQuotes) {
      if (c === '"') {
        if (clean[i + 1] === '"') { field += '"'; i++ }
        else inQuotes = false
      } else field += c
    } else {
      if (c === '"') inQuotes = true
      else if (c === ',') { cur.push(field); field = '' }
      else if (c === '\n') { cur.push(field); lines.push(cur); cur = []; field = '' }
      else field += c
    }
  }
  if (field.length > 0 || cur.length > 0) { cur.push(field); lines.push(cur) }
  if (lines.length === 0) return { headers: [], rows: [] }
  const headers = lines[0].map(h => h.trim())
  const rows = lines.slice(1).filter(r => r.some(c => c.trim().length > 0))
  return { headers, rows }
}

export type TargetField = 'ignore' | 'prenom' | 'email' | 'ville' | 'tranche' | 'pro_slug' | 'rgpd'

export const TARGET_LABELS: Record<TargetField, string> = {
  ignore: 'Ignorer',
  prenom: 'Pr\u00e9nom',
  email: 'Email',
  ville: 'Ville',
  tranche: 'Tranche d\u2019\u00e2ge',
  pro_slug: 'Pro (slug)',
  rgpd: 'RGPD',
}

export function autoDetect(header: string): TargetField {
  const h = header.toLowerCase().trim()
  if (/^(pr[e\u00e9]nom|first.?name|prenom)$/.test(h)) return 'prenom'
  if (/mail/.test(h)) return 'email'
  if (/^(ville|city|commune)$/.test(h)) return 'ville'
  if (/(age|tranche)/.test(h)) return 'tranche'
  if (/(pro|slug|commerce|boutique)/.test(h)) return 'pro_slug'
  if (/(rgpd|consent|optin)/.test(h)) return 'rgpd'
  return 'ignore'
}

export function validateEmail(s: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s.trim())
}
