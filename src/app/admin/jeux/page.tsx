import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import JeuxMatrix from './JeuxMatrix'

export default async function AdminJeuxPage() {
  const cookieStore = cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get(n: string) { return cookieStore.get(n)?.value }, set() {}, remove() {} } }
  )
  const { data: pros } = await supabase.from('pros').select('id, slug, nom').order('nom')
  return <JeuxMatrix pros={pros || []} />
}
