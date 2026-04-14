cat > src/app/dashboard/page.tsx << 'EOF'
'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const EMOJIS = [
  { emoji: '😍', label: 'Excellent' },
  { emoji: '😊', label: 'Bien' },
  { emoji: '👍', label: 'Correct' },
  { emoji: '😐', label: 'Moyen' },
  { emoji: '😕', label: 'Décevant' },
  { emoji: '😤', label: 'Mauvais' },
]

export default function Dashboard() {
  const [pro, setPro] = useState<any>(null)
  const [avis, setAvis] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      const { data: proData } = await supabase.from('pros').select('*').eq('user_id', user.id).single()
      setPro(proData)
      if (proData) {
        const { data: avisData } = await supabase.from('avis').select('*').eq('pro_id', proData.id).order('created_at', { ascending: false }).limit(50)
        setAvis(avisData || [])
      }
      setLoading(false)
    }
    load()
  }, [router])

  if (loading) return <div className="min-h-screen flex items-center justify-center"><p className="text-gray-400">Chargement...</p></div>
  if (!pro) return <div className="min-h-screen flex items-center justify-center"><p className="text-gray-500">Aucun commerce trouvé.</p></div>

  const total = avis.length
  const aujourdhui = avis.filter(a => new Date(a.created_at).toDateString() === new Date().toDateString()).length
  const comptes = EMOJIS.map(e => ({ ...e, count: avis.filter(a => a.emoji_code === e.emoji).length }))
  const topEmoji = comptes.reduce((a, b) => a.count > b.count ? a : b, comptes[0])
  const scanUrl = 'https://flashquality.vercel.app/scan/' + pro.slug

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{pro.nom}</h1>
            <p className="text-sm text-gray-400">{pro.categorie}</p>
          </div>
          <button onClick={() => supabase.auth.signOut().then(() => router.push('/login'))} className="text-sm text-gray-400 hover:text-red-500">Déconnexion</button>
        </div>
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-white rounded-2xl p-4 text-center border border-gray-100">
            <p className="text-3xl font-bold text-gray-900">{total}</p>
            <p className="text-xs text-gray-400 mt-1">Avis total</p>
          </div>
          <div className="bg-white rounded-2xl p-4 text-center border border-gray-100">
            <p className="text-3xl font-bold text-gray-900">{aujourdhui}</p>
            <p className="text-xs text-gray-400 mt-1">{"Aujourd'hui"}</p>
          </div>
          <div className="bg-white rounded-2xl p-4 text-center border border-gray-100">
            <p className="text-3xl">{total > 0 ? topEmoji.emoji : '—'}</p>
            <p className="text-xs text-gray-400 mt-1">Favori</p>
          </div>
        </div>
        <div className="bg-blue-50 rounded-2xl p-4 mb-6 border border-blue-100">
          <p className="text-xs text-blue-400 mb-1">Lien de votre page avis</p>
          <p className="text-sm font-medium text-blue-700 break-all">{scanUrl}</p>
          <button onClick={() => navigator.clipboard.writeText(scanUrl)} className="mt-2 text-xs bg-blue-600 text-white px-3 py-1.5 rounded-lg">Copier le lien</button>
        </div>
        {total > 0 && (
          <div className="bg-white rounded-2xl p-4 mb-6 border border-gray-100">
            <p className="text-sm font-semibold text-gray-700 mb-4">{"Répartition des avis"}</p>
            <div className="space-y-2">
              {comptes.map(({ emoji, label, count }) => (
                <div key={emoji} className="flex items-center gap-3">
                  <span className="text-xl w-7">{emoji}</span>
                  <div className="flex-1 bg-gray-100 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: Math.round((count / total) * 100) + '%' }} />
                  </div>
                  <span className="text-xs text-gray-400 w-16 text-right">{count} ({Math.round((count / total) * 100)}%)</span>
                </div>
              ))}
            </div>
          </div>
        )}
        <div className="bg-white rounded-2xl p-4 border border-gray-100">
          <p className="text-sm font-semibold text-gray-700 mb-4">Derniers avis</p>
          {avis.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">Aucun avis pour {"l'instant"}. Partagez votre lien !</p>
          ) : (
            <div className="space-y-3">
              {avis.slice(0, 20).map((a) => (
                <div key={a.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{a.emoji_code}</span>
                    <span className="text-sm text-gray-500">{EMOJIS.find(e => e.emoji === a.emoji_code)?.label}</span>
                  </div>
                  <span className="text-xs text-gray-300">{new Date(a.created_at).toLocaleDateString('fr-FR')}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
EOF