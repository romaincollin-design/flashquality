'use client'
import { useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleLogin() {
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) { setError('Email ou mot de passe incorrect'); setLoading(false); return }
    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">FlashQuality</h1>
          <p className="text-gray-400 mt-2 text-sm">Espace professionnel</p>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-gray-100 space-y-4">
          <div>
            <label className="text-xs text-gray-400 mb-1 block">Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="vous@example.com" />
          </div>
          <div>
            <label className="text-xs text-gray-400 mb-1 block">Mot de passe</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleLogin()} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="••••••••" />
          </div>
          {error && <p className="text-red-500 text-xs">{error}</p>}
          <button onClick={handleLogin} disabled={load
git add . && git commit -m "feat: login + dashboard + QR code" && git push
mkdir -p src/app/dashboard/clients src/app/dashboard/offres && cat > src/app/dashboard/clients/page.tsx << 'EOF'
'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
export default function Clients() {
  const [clients, setClients] = useState<any[]>([])
  const [pro, setPro] = useState<any>(null)
  const router = useRouter()
  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      const { data: proData } = await supabase.from('pros').select('*').eq('user_id', user.id).single()
      setPro(proData)
      if (proData) {
        const { data } = await supabase.from('clients').select('*').eq('pro_id', proData.id).order('created_at', { ascending: false })
        setClients(data || [])
      }
    }
    load()
  }, [router])
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <button onClick={() => router.push('/dashboard')} className="text-sm text-gray-400 mb-2 block">← Retour</button>
            <h1 className="text-2xl font-bold text-gray-900">Clients</h1>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100">
          {clients.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-12">Aucun client enregistré.</p>
          ) : (
            <div className="divide-y divide-gray-50">
              {clients.map((c) => (
                <div key={c.id} className="flex items-center justify-between px-4 py-3">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{c.nom || 'Client anonyme'}</p>
                    <p className="text-xs text-gray-400">{c.email || c.telephone || '—'}</p>
                  </div>
                  <span className="text-xs text-gray-300">{new Date(c.created_at).toLocaleDateString('fr-FR')}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
