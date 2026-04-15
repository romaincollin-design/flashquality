import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'
import ClientApp from './ClientApp'

export default async function ClientPage({ searchParams }: { searchParams: { slug?: string } }) {
  const cookieStore = cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get: (name: string) => cookieStore.get(name)?.value } }
  )

  const slug = searchParams.slug || null

  let pro = null
  let offres: { id: string; titre: string; description: string; expire_at: string; type: string }[] = []

  if (slug) {
    const { data } = await supabase
      .from('pros')
      .select('id, slug, nom, categorie, adresse, tel, horaires, description, logo_url, tombola_actif')
      .eq('slug', slug)
      .eq('actif', true)
      .single()
    pro = data

    if (pro) {
      const { data: offresData } = await supabase
        .from('offres')
        .select('id, titre, description, expire_at, type')
        .eq('pro_id', pro.id)
        .eq('actif', true)
        .order('created_at', { ascending: false })
      offres = offresData || []
    }
  }

  return <ClientApp pro={pro} offres={offres} slug={slug} />
}
