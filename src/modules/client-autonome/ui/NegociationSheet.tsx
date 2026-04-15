'use client'
import { useMemo, useState } from 'react'
import { useLeads } from '../hooks/useLeads'
import { genererPropositions, meilleuresOffresMock } from '../lib/negociation'
import type { Abonnement } from '../types'

const A = '#7C5CFC', AD = '#5538D4', AL = '#EDE8FF', RC = 22
const CARD: React.CSSProperties = { background: 'white', borderRadius: RC, border: '2.5px solid #F0EDE8', boxSizing: 'border-box' }

export default function NegociationSheet({ clientId, abonnement, onClose }: { clientId: string; abonnement: Abonnement; onClose: () => void }) {
  const { create } = useLeads(clientId)
  const propositions = useMemo(() => genererPropositions(abonnement), [abonnement])
  const offres = useMemo(() => meilleuresOffresMock(abonnement), [abonnement])
  const [sent, setSent] = useState(false)
  const [busy, setBusy] = useState(false)

  async function envoyer() {
    setBusy(true)
    try {
      await create({ pro_id: null, abonnement_id: abonnement.id, propositions })
      setSent(true)
    } finally { setBusy(false) }
  }

  return <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(26,16,51,.55)', zIndex: 200, display: 'flex', alignItems: 'flex-end' }}>
    <div onClick={e => e.stopPropagation()} style={{ width: '100%', background: '#F0EDE8', borderTopLeftRadius: 24, borderTopRightRadius: 24, maxHeight: '92%', overflowY: 'auto', padding: '16px 14px 20px' }}>
      <div style={{ width: 40, height: 4, background: '#D0CEC9', borderRadius: 100, margin: '0 auto 14px' }} />
      <div style={{ fontSize: 11, fontWeight: 800, color: '#B0ADA8', textTransform: 'uppercase', letterSpacing: '.1em' }}>N\u00e9gociation</div>
      <div style={{ fontSize: 20, fontWeight: 900, color: '#1A1033', marginTop: 2, marginBottom: 12 }}>{abonnement.nom}</div>

      <div style={{ fontSize: 11, fontWeight: 900, color: '#B0ADA8', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 8 }}>3 propositions</div>
      {propositions.map((p, i) => <div key={i} style={{ ...CARD, padding: 12, marginBottom: 8 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 900, color: A }}>{p.titre}</div>
            <div style={{ fontSize: 12, color: '#6B6760', fontWeight: 700, marginTop: 3, lineHeight: 1.4 }}>{p.detail}</div>
          </div>
          <div style={{ background: AL, color: A, fontSize: 13, fontWeight: 900, padding: '4px 10px', borderRadius: 100, whiteSpace: 'nowrap', fontFamily: "'Fredoka',sans-serif" }}>{p.montant_estime.toFixed(2)} \u20AC</div>
        </div>
      </div>)}

      <div style={{ fontSize: 11, fontWeight: 900, color: '#B0ADA8', textTransform: 'uppercase', letterSpacing: '.08em', margin: '14px 0 8px' }}>Meilleures offres trouv\u00e9es</div>
      {offres.map((o, i) => <div key={i} style={{ ...CARD, padding: 11, marginBottom: 7, display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: '#D1FAE5', color: '#065F46', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 900 }}>{'\u{1F4A1}'}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 900, color: '#1A1033' }}>{o.nom}</div>
          <div style={{ fontSize: 11, color: '#B0ADA8', fontWeight: 700 }}>{o.detail}</div>
        </div>
        <div style={{ fontSize: 14, fontWeight: 900, color: '#10B981', fontFamily: "'Fredoka',sans-serif" }}>{o.prix.toFixed(2)} \u20AC</div>
      </div>)}

      {sent ? <div style={{ background: '#D1FAE5', border: '2px solid #10B981', borderRadius: RC, padding: '14px 16px', marginTop: 16, textAlign: 'center' }}>
        <div style={{ fontSize: 22, marginBottom: 4 }}>{'\u2705'}</div>
        <div style={{ fontSize: 14, fontWeight: 900, color: '#065F46' }}>Demande envoy\u00e9e au prestataire</div>
        <div style={{ fontSize: 11, color: '#047857', fontWeight: 700, marginTop: 2 }}>Tu recevras une r\u00e9ponse dans ton espace notifications</div>
      </div> : <button onClick={envoyer} disabled={busy} style={{ width: '100%', background: busy ? '#B8A9FF' : A, color: 'white', border: 'none', borderRadius: 100, padding: '13px 20px', fontSize: 14, fontWeight: 900, cursor: busy ? 'wait' : 'pointer', fontFamily: 'inherit', marginTop: 16, boxShadow: `0 4px 0 ${AD}` }}>{busy ? 'Envoi...' : 'Envoyer au prestataire'}</button>}

      <button onClick={onClose} style={{ width: '100%', background: 'transparent', color: '#6B6760', border: 'none', padding: '12px', fontSize: 13, fontWeight: 800, cursor: 'pointer', fontFamily: 'inherit', marginTop: 6 }}>Fermer</button>
    </div>
  </div>
}
