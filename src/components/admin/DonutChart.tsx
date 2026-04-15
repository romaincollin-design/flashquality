'use client'
import type { Bucket } from '@/lib/admin/aggregate'

const PALETTE = ['#7C5CFC', '#10B981', '#F59E0B', '#EC4899', '#3B82F6', '#DC2626', '#06B6D4', '#6B7280']

export default function DonutChart({ data, size = 160 }: { data: Bucket[]; size?: number }) {
  const total = data.reduce((s, d) => s + d.value, 0)
  if (total === 0) return <div style={{ padding: 20, color: '#B0ADA8', fontSize: 12, fontWeight: 700, textAlign: 'center' }}>Aucune donn\u00e9e</div>
  const r = (size - 20) / 2
  const c = 2 * Math.PI * r
  let acc = 0
  return <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#F0EDE8" strokeWidth={18} />
      {data.map((d, i) => {
        const col = d.color || PALETTE[i % PALETTE.length]
        const len = (d.value / total) * c
        const off = -acc
        acc += len
        return <circle key={i} cx={size / 2} cy={size / 2} r={r} fill="none" stroke={col} strokeWidth={18} strokeDasharray={`${len} ${c - len}`} strokeDashoffset={off} transform={`rotate(-90 ${size / 2} ${size / 2})`} />
      })}
      <text x={size / 2} y={size / 2 - 4} textAnchor="middle" fontSize={20} fontWeight={900} fill="#1A1033" fontFamily="Fredoka,sans-serif">{total}</text>
      <text x={size / 2} y={size / 2 + 14} textAnchor="middle" fontSize={10} fontWeight={700} fill="#B0ADA8">total</text>
    </svg>
    <div style={{ flex: 1, minWidth: 140, display: 'flex', flexDirection: 'column', gap: 5 }}>
      {data.map((d, i) => {
        const col = d.color || PALETTE[i % PALETTE.length]
        const pct = ((d.value / total) * 100).toFixed(0)
        return <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, fontWeight: 800 }}>
          <span style={{ width: 10, height: 10, borderRadius: '50%', background: col, flexShrink: 0 }} />
          <span style={{ flex: 1, color: '#1A1033', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{d.label}</span>
          <span style={{ color: '#6B6760' }}>{pct}%</span>
        </div>
      })}
    </div>
  </div>
}
