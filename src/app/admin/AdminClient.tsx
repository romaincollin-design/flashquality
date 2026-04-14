'use client'

import { useState } from 'react'

const C = {
  navy: '#1A3A6B',
  teal: '#00A896',
  amber: '#E8A820',
  bg: '#F0F4F9',
  border: '#E2E8F0',
  slate: '#4A5568',
  slate2: '#94A3B8',
}
const F = "Calibri, 'Trebuchet MS', sans-serif"

type Pro = {
  id: string
  name: string
  slug: string
  email: string
  created_at: string
}

type Review = {
  id: string
  pro_id: string
  rating: number
  comment?: string
  created_at: string
}

type Props = {
  userEmail: string
  pros: Pro[]
  reviews: Review[]
}

export default function AdminClient({ userEmail, pros, reviews }: Props) {
  const [activeTab, setActiveTab] = useState<'pros' | 'reviews'>('pros')
  const [search, setSearch] = useState('')

  const filteredPros = pros.filter(p =>
    p.name?.toLowerCase().includes(search.toLowerCase()) ||
    p.slug?.toLowerCase().includes(search.toLowerCase()) ||
    p.email?.toLowerCase().includes(search.toLowerCase())
  )

  const filteredReviews = reviews.filter(r =>
    r.comment?.toLowerCase().includes(search.toLowerCase())
  )

  const avgRating = reviews.length
    ? (reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length).toFixed(1)
    : '0'

  return (
    <div style={{ minHeight: '100vh', background: C.bg, fontFamily: F }}>
      <div style={{
        background: 'linear-gradient(135deg, #1A3A6B, #0F2550)',
        padding: '20px 32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 8,
            background: C.teal,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'white', fontWeight: 700, fontSize: 16,
          }}>FQ</div>
          <div>
            <div style={{ color: 'white', fontWeight: 700, fontSize: 18 }}>FlashQuality Admin</div>
            <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12 }}>{userEmail}</div>
          </div>
        </div>
        <a href="/dashboard" style={{
          color: 'rgba(255,255,255,0.8)', fontSize: 13,
          textDecoration: 'none', border: '1px solid rgba(255,255,255,0.3)',
          padding: '6px 14px', borderRadius: 6,
        }}>
          Dashboard
        </a>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 32 }}>
          {[
            { label: 'Pros inscrits', value: pros.length, color: C.navy },
            { label: 'Avis totaux', value: reviews.length, color: C.teal },
            { label: 'Note moyenne', value: avgRating, color: C.amber },
          ].map((stat) => (
            <div key={stat.label} style={{
              background: 'white', borderRadius: 12,
              border: '1px solid ' + C.border,
              padding: '20px 24px',
            }}>
              <div style={{ color: C.slate2, fontSize: 13, marginBottom: 6 }}>{stat.label}</div>
              <div style={{ color: stat.color, fontSize: 32, fontWeight: 700 }}>{stat.value}</div>
            </div>
          ))}
        </div>

        <div style={{ background: 'white', borderRadius: 12, border: '1px solid ' + C.border, overflow: 'hidden' }}>
          <div style={{
            padding: '16px 24px', borderBottom: '1px solid ' + C.border,
            display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' as const,
          }}>
            <div style={{ display: 'flex', gap: 4 }}>
              {(['pros', 'reviews'] as const).map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)} style={{
                  padding: '6px 16px', borderRadius: 6, border: 'none',
                  cursor: 'pointer', fontSize: 14, fontFamily: F,
                  background: activeTab === tab ? C.navy : 'transparent',
                  color: activeTab === tab ? 'white' : C.slate,
                  fontWeight: activeTab === tab ? 600 : 400,
                }}>
                  {tab === 'pros' ? 'Pros (' + pros.length + ')' : 'Avis (' + reviews.length + ')'}
                </button>
              ))}
            </div>
            <input
              type="text"
              placeholder="Rechercher..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                marginLeft: 'auto', padding: '7px 12px',
                border: '1px solid ' + C.border, borderRadius: 6,
                fontSize: 13, fontFamily: F, outline: 'none',
                width: 220, boxSizing: 'border-box' as const,
              }}
            />
          </div>

          {activeTab === 'pros' && (
            <table style={{ width: '100%', borderCollapse: 'collapse' as const, fontSize: 13 }}>
              <thead>
                <tr style={{ background: C.bg }}>
                  {['Nom', 'Slug', 'Email', 'Inscription'].map(h => (
                    <th key={h} style={{
                      padding: '10px 16px', textAlign: 'left' as const,
                      color: C.slate2, fontWeight: 600, fontSize: 12,
                      borderBottom: '1px solid ' + C.border,
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredPros.length === 0 ? (
                  <tr><td colSpan={4} style={{ padding: 32, textAlign: 'center' as const, color: C.slate2 }}>Aucun pro</td></tr>
                ) : filteredPros.map((pro, i) => (
                  <tr key={pro.id} style={{ background: i % 2 === 0 ? 'white' : '#FAFBFC' }}>
                    <td style={{ padding: '12px 16px', fontWeight: 600, color: C.navy }}>{pro.name || '—'}</td>
                    <td style={{ padding: '12px 16px', color: C.slate }}>
                      <a href={'/scan/' + pro.slug} style={{ color: C.teal, textDecoration: 'none' }}>{pro.slug}</a>
                    </td>
                    <td style={{ padding: '12px 16px', color: C.slate }}>{pro.email || '—'}</td>
                    <td style={{ padding: '12px 16px', color: C.slate2 }}>
                      {pro.created_at ? new Date(pro.created_at).toLocaleDateString('fr-FR') : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {activeTab === 'reviews' && (
            <table style={{ width: '100%', borderCollapse: 'collapse' as const, fontSize: 13 }}>
              <thead>
                <tr style={{ background: C.bg }}>
                  {['Note', 'Commentaire', 'Date'].map(h => (
                    <th key={h} style={{
                      padding: '10px 16px', textAlign: 'left' as const,
                      color: C.slate2, fontWeight: 600, fontSize: 12,
                      borderBottom: '1px solid ' + C.border,
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredReviews.length === 0 ? (
                  <tr><td colSpan={3} style={{ padding: 32, textAlign: 'center' as const, color: C.slate2 }}>Aucun avis</td></tr>
                ) : filteredReviews.map((review, i) => (
                  <tr key={review.id} style={{ background: i % 2 === 0 ? 'white' : '#FAFBFC' }}>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{
                        background: review.rating >= 4 ? '#E8F5E9' : review.rating >= 3 ? '#FFF8E1' : '#FFEBEE',
                        color: review.rating >= 4 ? '#2E7D32' : review.rating >= 3 ? '#F57F17' : '#C62828',
                        padding: '3px 10px', borderRadius: 20, fontWeight: 700, fontSize: 13,
                      }}>{review.rating}/5</span>
                    </td>
                    <td style={{ padding: '12px 16px', color: C.slate }}>{review.comment || '—'}</td>
                    <td style={{ padding: '12px 16px', color: C.slate2 }}>
                      {review.created_at ? new Date(review.created_at).toLocaleDateString('fr-FR') : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}
