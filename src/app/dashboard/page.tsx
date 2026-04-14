import { createClient } from '@supabase/supabase-js'
import { redirect } from 'next/navigation'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default async function DashboardPage() {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: pro } = await supabase
    .from('pros')
    .select('*')
    .eq('email', user.email)
    .single()

  const { data: avis } = await supabase
    .from('avis')
    .select('*')
    .eq('pro_id', pro?.id)
    .order('created_at', { ascending: false })

  const total = avis?.length || 0
  const emojis: Record<string, number> = {}
  avis?.forEach(a => {
    emojis[a.emoji_code] = (emojis[a.emoji_code] || 0) + 1
  })

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="max-w-lg mx-auto">
        <h1 className="text-2xl font-bold mb-1">{pro?.nom}</h1>
        <p className="text-gray-400 text-sm mb-8">{pro?.categorie}</p>

        <div className="bg-white rounded-2xl p-6 shadow-sm mb-4">
          <p className="text-gray-400 text-sm mb-1">Total avis reçus</p>
          <p className="text-4xl font-bold">{total}</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
          <p className="text-gray-400 text-sm mb-4">Répartition</p>
          <div className="flex gap-4 flex-wrap">
            {Object.entries(emojis).map(([emoji, count]) => (
              <div key={emoji} className="flex flex-col items-center">
                <span className="text-3xl">{emoji}</span>
                <span className="text-sm font-semibold mt-1">{count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <p className="text-gray-400 text-sm mb-4">Derniers avis</p>
          <div className="flex flex-col gap-3">
            {avis?.slice(0, 10).map(a => (
              <div key={a.id} className="flex items-center justify-between">
                <span className="text-2xl">{a.emoji_code}</span>
                <span className="text-xs text-gray-400">
                  {new Date(a.created_at).toLocaleDateString('fr-FR')}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
