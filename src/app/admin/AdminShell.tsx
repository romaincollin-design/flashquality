'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

const A = '#7C5CFC'
const LINKS = [
  { href: '/admin',               label: 'Vue d\u2019ensemble', icon: '\u{1F3E0}' },
  { href: '/admin/pros',          label: 'Pros',               icon: '\u{1F3EA}' },
  { href: '/admin/stats',         label: 'Statistiques',       icon: '\u{1F4CA}' },
  { href: '/admin/jeux',          label: 'Jeux',               icon: '\u{1F3B2}' },
  { href: '/admin/import-clients',label: 'Import clients',     icon: '\u{1F4E5}' },
]

export default function AdminShell({ email, children }: { email: string; children: React.ReactNode }) {
  const pathname = usePathname() || ''
  const [open, setOpen] = useState(false)
  const isActive = (h: string) => h === '/admin' ? pathname === h : pathname.startsWith(h)

  return <div style={{ minHeight: '100vh', display: 'flex', background: '#F7F5F1', fontFamily: "'Nunito',sans-serif" }}>
    <style>{`@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@700;800;900&family=Fredoka:wght@500;600;700&display=swap');*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}@media(max-width:768px){.fq-sidebar{position:fixed!important;transform:translateX(-100%);transition:transform .25s;z-index:50;}.fq-sidebar.open{transform:translateX(0);}.fq-burger{display:flex!important;}}@media(min-width:769px){.fq-burger{display:none!important;}}`}</style>
    <aside className={`fq-sidebar${open ? ' open' : ''}`} style={{ width: 240, background: '#1A1033', color: 'white', padding: '18px 14px', display: 'flex', flexDirection: 'column', gap: 4, flexShrink: 0 }}>
      <div style={{ padding: '6px 10px 18px' }}>
        <div style={{ fontSize: 20, fontWeight: 900, letterSpacing: '-.02em' }}>FlashQuality</div>
        <div style={{ fontSize: 10, fontWeight: 800, color: 'rgba(255,255,255,.5)', textTransform: 'uppercase', letterSpacing: '.15em', marginTop: 2 }}>Admin</div>
      </div>
      {LINKS.map(l => {
        const active = isActive(l.href)
        return <Link key={l.href} href={l.href} onClick={() => setOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 12, textDecoration: 'none', color: active ? 'white' : 'rgba(255,255,255,.7)', background: active ? A : 'transparent', fontSize: 13, fontWeight: 800 }}>
          <span style={{ fontSize: 16 }}>{l.icon}</span>
          <span>{l.label}</span>
        </Link>
      })}
      <div style={{ flex: 1 }} />
      <div style={{ padding: '12px 10px', borderTop: '1px solid rgba(255,255,255,.1)', fontSize: 11, color: 'rgba(255,255,255,.6)', fontWeight: 700 }}>
        <div style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{email}</div>
        <Link href="/dashboard" style={{ color: 'rgba(255,255,255,.85)', textDecoration: 'none', fontSize: 11, fontWeight: 800, marginTop: 6, display: 'inline-block' }}>\u2190 Retour dashboard</Link>
      </div>
    </aside>
    <main style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
      <button className="fq-burger" onClick={() => setOpen(o => !o)} style={{ display: 'none', background: '#1A1033', color: 'white', border: 'none', padding: '10px 14px', fontSize: 16, cursor: 'pointer', alignItems: 'center', gap: 8, fontFamily: 'inherit', fontWeight: 900 }}>{'\u2630'} Menu</button>
      <div style={{ flex: 1, minWidth: 0 }}>{children}</div>
    </main>
  </div>
}
