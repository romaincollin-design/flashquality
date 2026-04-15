'use client'
import type { Bucket } from '@/lib/admin/aggregate'

export default function BarChart({ data, height = 180, defaultColor = '#7C5CFC' }: { data: Bucket[]; height?: number; defaultColor?: string }) {
  if (data.length === 0) return <div style={{ padding: 20, color: '#B0ADA8', fontSize: 12, fontWeight: 700, textAlign: 'center' }}>Aucune donn\u00e9e</div>
  const max = Math.max(...data.map(d => d.value), 1)
  const rowH = 26
  const totalH = Math.max(height, data.length * rowH + 10)
  return <div style={{ width: '100%' }}>
    {data.map((d, i) => {
      const pct = (d.value / max) * 100
      const color = d.color || defaultColor
      return <div key={i} style={{ marginBottom: 8 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 800, color: '#1A1033', marginBottom: 3 }}>
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '70%' }}>{d.label}</span>
          <span style={{ color: '#6B6760' }}>{d.value}</span>
        </div>
        <div style={{ background: '#F0EDE8', borderRadius: 100, height: 8, overflow: 'hidden' }}>
          <div style={{ height: '100%', background: color, width: pct + '%', borderRadius: 100, transition: 'width .4s' }} />
        </div>
      </div>
    })}
    <div style={{ height: 0, marginTop: totalH - data.length * rowH }} />
  </div>
}
